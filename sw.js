const CACHE_NAME = 'quangpm-app-v17';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './firebase-config.js',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// In-memory background timers for fallback scheduling
let workerBackgroundTimers = [];

// Install Service Worker and cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Opened cache', CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch events: Stale-While-Revalidate strategy for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore.googleapis.com')) return;
  if (event.request.url.includes('identitytoolkit.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log('[SW] Fetch failed, offline mode.', err);
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// SOLUTION 1 & 2: BACKGROUND REMINDER SCHEDULER & NOTIFICATION TRIGGERS
// ==========================================

function clearWorkerBackgroundTimers() {
  workerBackgroundTimers.forEach((t) => clearTimeout(t));
  workerBackgroundTimers = [];
}

function scheduleSingleReminder(title, body, targetTime, tag, data) {
  const now = Date.now();
  const delay = targetTime - now;
  if (delay <= -30000) return; // Don't fire if more than 30s in past

  const actions = [
    { action: 'complete', title: '✓ Hoàn thành' },
    { action: 'snooze', title: '⏰ Báo lại 5p' }
  ];

  const notifOptions = {
    body: body,
    icon: 'icon.svg',
    badge: 'icon.svg',
    tag: tag,
    data: data,
    requireInteraction: true,
    renotify: true,
    vibrate: [300, 100, 300, 100, 400],
    actions: actions
  };

  // 1. Notification Triggers API (TimestampTrigger) - hardware OS level alarm
  const supportsTriggers = ('showTrigger' in Notification.prototype) || (typeof TimestampTrigger !== 'undefined');
  if (supportsTriggers && delay > 1000) {
    try {
      const triggerOptions = Object.assign({}, notifOptions, {
        showTrigger: new TimestampTrigger(targetTime)
      });
      self.registration.showNotification(title, triggerOptions).catch((err) => {
        console.warn('[SW] TimestampTrigger registration error:', err);
      });
    } catch (e) {
      console.warn('[SW] TimestampTrigger failed:', e);
    }
  }

  // 2. Worker Fallback Timer - keeps timer running in Service Worker thread
  if (delay > 0 && delay < 86400000) { // within 24 hours
    const timerId = setTimeout(() => {
      self.registration.showNotification(title, notifOptions).catch((err) => {
        console.warn('[SW] Worker fallback showNotification error:', err);
      });
    }, delay);
    workerBackgroundTimers.push(timerId);
  } else if (delay <= 0) {
    // Fire immediately
    self.registration.showNotification(title, notifOptions).catch((err) => {});
  }
}

function syncRemindersInWorker(tasks) {
  clearWorkerBackgroundTimers();
  if (!Array.isArray(tasks) || tasks.length === 0) return;

  const now = Date.now();

  tasks.forEach((task) => {
    if (task.completed) return;
    const targetMs = task.targetMs;
    if (!targetMs || isNaN(targetMs)) return;

    const stage = typeof task.stage === 'number' ? task.stage : 0;
    const dismissed = !!task.dismissed;
    const taskTitle = task.text || 'Công việc';
    const bodyText = task.subtasksSummary || 'FlowHub: Đã đến giờ làm việc của bạn';

    const cp1 = targetMs - 5 * 60 * 1000; // -5m
    const cp2 = targetMs;                  // on-time
    const cp3 = targetMs + 5 * 60 * 1000; // +5m late

    // Stage 1: -5m
    if (stage === 0 && cp1 > now) {
      scheduleSingleReminder(
        '⏰ Sắp đến giờ (còn 5p): ' + taskTitle,
        bodyText,
        cp1,
        'flowhub-task-' + task.id + '-s1',
        { taskId: task.id, stage: 1, taskText: taskTitle }
      );
    }

    // Stage 2: On-time
    if (stage < 2 && cp2 > now) {
      scheduleSingleReminder(
        '🔔 Đến giờ làm task: ' + taskTitle,
        bodyText,
        cp2,
        'flowhub-task-' + task.id + '-s2',
        { taskId: task.id, stage: 2, taskText: taskTitle }
      );
    }

    // Stage 3: +5m late
    if (!dismissed && cp3 > now) {
      scheduleSingleReminder(
        '⚠️ Quá hạn 5 phút: ' + taskTitle,
        bodyText,
        cp3,
        'flowhub-task-' + task.id + '-s3',
        { taskId: task.id, stage: 3, taskText: taskTitle }
      );
    }
  });
}

// Listen for messages from client windows
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SYNC_REMINDERS') {
    syncRemindersInWorker(event.data.tasks || []);
  }
});

// ==========================================
// SOLUTION 2: NOTIFICATION CLICK & LOCK SCREEN ACTIONS
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  const data = event.notification.data || {};
  const taskId = data.taskId;

  if (action === 'complete') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        let notified = false;
        for (const client of clientList) {
          client.postMessage({
            type: 'TASK_ACTION',
            action: 'complete',
            taskId: taskId
          });
          notified = true;
        }
        if (!notified) {
          // Confirm via feedback notification if app wasn't in foreground
          self.registration.showNotification('🎉 Đã hoàn thành công việc', {
            body: data.taskText || 'Công việc đã được đánh dấu hoàn tất',
            icon: 'icon.svg',
            badge: 'icon.svg',
            tag: 'flowhub-action-feedback-' + Date.now()
          });
        }
      })
    );
    return;
  }

  if (action === 'snooze') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        let notified = false;
        for (const client of clientList) {
          client.postMessage({
            type: 'TASK_ACTION',
            action: 'snooze',
            taskId: taskId,
            minutes: 5
          });
          notified = true;
        }

        // Reschedule notification 5 minutes from now directly in SW
        const snoozeTarget = Date.now() + 5 * 60 * 1000;
        scheduleSingleReminder(
          '⏰ Báo lại 5p: ' + (data.taskText || 'Công việc'),
          'Nhắc lại công việc sau 5 phút',
          snoozeTarget,
          'flowhub-task-' + taskId + '-snooze-' + Date.now(),
          { taskId: taskId, stage: 2, taskText: data.taskText }
        );

        self.registration.showNotification('⏰ Đã hoãn 5 phút', {
          body: 'FlowHub sẽ nhắc lại lúc ' + new Date(snoozeTarget).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          icon: 'icon.svg',
          badge: 'icon.svg',
          tag: 'flowhub-snooze-ack-' + Date.now()
        });
      })
    );
    return;
  }

  // Default: tap anywhere on notification body to open/focus app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
