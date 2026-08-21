(function () {
    'use strict';

    // ===== CONSTANTS =====
    var MODES = {
        '30': { work: 25 * 60, break: 5 * 60, label: '30 phút' },
        '50': { work: 40 * 60, break: 10 * 60, label: '50 phút' }
    };

    var CIRCUMFERENCE = 2 * Math.PI * 120;

    // ===== I18N DICTIONARIES =====
    var LANG = {
        vi: {
            mode: 'Chế độ', mode30: '30 phút', mode30Detail: "25' làm + 5' nghỉ",
            mode50: '50 phút', mode50Detail: "40' làm + 10' nghỉ", reps: 'Số Rep',
            ready: 'Sẵn sàng', start: '▶ Bắt đầu', pause: '⏸ Tạm dừng',
            resume: '▶ Tiếp tục', completed: '🎉 Hoàn thành!',
            working: '🔥 Đang làm việc', breaking: '☕ Nghỉ ngơi',
            history: '📊 Lịch sử', noHistory: 'Chưa có lịch sử',
            addTaskPlaceholder: 'Thêm task mới...', addBtn: '+ Thêm',
            filterAll: 'Tất cả', filterInProgress: 'Đang làm', filterCompleted: 'Hoàn thành',
            emptyTasks: 'Chưa có task nào', noMatch: 'Không có task phù hợp',
            statsTemplate: '{ip} đang làm · {c} hoàn thành · {t} tổng',
            modeLabel30: '30 phút', modeLabel50: '50 phút',
            newNote: '+ Ghi chú mới', editNote: 'Sửa ghi chú',
            deleteSelected: '🗑 Xóa đã chọn', emptyNotes: 'Chưa có ghi chú nào',
            noteTitlePlaceholder: 'Tiêu đề...', noteContentPlaceholder: 'Nội dung ghi chú...',
            noteColor: 'Màu:', cancel: 'Hủy', saveNote: 'Lưu',
            loginSubtitle: 'Đăng nhập để bắt đầu',
            loginGoogle: 'Đăng nhập bằng Google', loginGithub: 'Đăng nhập bằng GitHub',
            logout: 'Đăng xuất',
            goldPrices: 'Giá Vàng DOJI', goldSJC: 'Vàng miếng SJC', goldRing: 'Nhẫn tròn Hưng Thịnh Vượng',
            buyPrice: 'Mua vào', sellPrice: 'Bán ra', refresh: '🔄 Làm mới',
            globalPrices: 'Hàng Hóa Toàn Cầu', worldGold: 'Vàng (World)', crudeOil: 'Dầu Thô (WTI)'
        },
        en: {
            mode: 'Mode', mode30: '30 min', mode30Detail: "25' work + 5' rest",
            mode50: '50 min', mode50Detail: "40' work + 10' rest", reps: 'Reps',
            ready: 'Ready', start: '▶ Start', pause: '⏸ Pause',
            resume: '▶ Resume', completed: '🎉 Completed!',
            working: '🔥 Working', breaking: '☕ Break',
            history: '📊 History', noHistory: 'No history yet',
            addTaskPlaceholder: 'Add new task...', addBtn: '+ Add',
            filterAll: 'All', filterInProgress: 'In Progress', filterCompleted: 'Completed',
            emptyTasks: 'No tasks yet', noMatch: 'No matching tasks',
            statsTemplate: '{ip} in progress · {c} completed · {t} total',
            modeLabel30: '30 min', modeLabel50: '50 min',
            newNote: '+ New Note', editNote: 'Edit Note',
            deleteSelected: '🗑 Delete Selected', emptyNotes: 'No notes yet',
            noteTitlePlaceholder: 'Title...', noteContentPlaceholder: 'Note content...',
            noteColor: 'Color:', cancel: 'Cancel', saveNote: 'Save',
            loginSubtitle: 'Sign in to get started',
            loginGoogle: 'Sign in with Google', loginGithub: 'Sign in with GitHub',
            logout: 'Sign out',
            goldPrices: 'DOJI Gold Prices', goldSJC: 'SJC Gold Bar', goldRing: 'Gold Ring',
            buyPrice: 'Buy', sellPrice: 'Sell', refresh: '🔄 Refresh',
            globalPrices: 'Global Commodities', worldGold: 'Gold (World)', crudeOil: 'Crude Oil (WTI)'
        }
    };

    // ===== I18N MANAGER =====
    var currentLang = localStorage.getItem('app_language') || 'vi';

    function t(key) {
        return (LANG[currentLang] && LANG[currentLang][key]) || LANG['vi'][key] || key;
    }

    function applyI18nToDOM() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('app_language', lang);
        var flagEl = document.getElementById('lang-flag');
        var labelEl = document.getElementById('lang-label');
        if (lang === 'vi') {
            flagEl.textContent = '🇻🇳'; labelEl.textContent = 'VI';
            document.documentElement.lang = 'vi';
        } else {
            flagEl.textContent = '🇬🇧'; labelEl.textContent = 'EN';
            document.documentElement.lang = 'en';
        }
        applyI18nToDOM();
    }

    // ===== UTILITY FUNCTIONS =====
    function formatTime(s) {
        return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
    function getTodayStr() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function getTimeStr() {
        var d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }
    function escapeHtml(text) { var d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

    function playBeep(freq, dur, times) {
        freq = freq || 800; dur = dur || 200; times = times || 3;
        try {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            var ctx = new Ctx(), st = ctx.currentTime;
            for (var i = 0; i < times; i++) {
                var o = ctx.createOscillator(), g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.frequency.value = freq; o.type = 'sine';
                g.gain.setValueAtTime(0.3, st);
                g.gain.exponentialRampToValueAtTime(0.001, st + dur / 1000);
                o.start(st); o.stop(st + dur / 1000);
                st += (dur + 150) / 1000;
            }
        } catch (e) { /* ignore */ }
    }

    // =========================================================
    //  FIREBASE SETUP
    // =========================================================
    firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();

    // Enable offline persistence
    db.enablePersistence({ synchronizeTabs: true }).catch(function () { /* ignore */ });

    var currentUser = null;

    function userDocRef(collection) {
        return db.collection('users').doc(currentUser.uid).collection(collection);
    }

    // =========================================================
    //  AUTH MODULE
    // =========================================================
    function initAuth() {
        var loginPage = document.getElementById('login-page');
        var appContainer = document.getElementById('app-container');
        var loadingOverlay = document.getElementById('loading-overlay');
        var loginError = document.getElementById('login-error');
        var avatarEl = document.getElementById('user-avatar');
        var nameEl = document.getElementById('user-name');

        // Google login
        document.getElementById('btn-login-google').addEventListener('click', function () {
            loginError.textContent = '';
            var provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(function (err) {
                loginError.textContent = err.message;
            });
        });

        // GitHub login
        document.getElementById('btn-login-github').addEventListener('click', function () {
            loginError.textContent = '';
            var provider = new firebase.auth.GithubAuthProvider();
            auth.signInWithPopup(provider).catch(function (err) {
                loginError.textContent = err.message;
            });
        });

        // Logout
        document.getElementById('btn-logout').addEventListener('click', function () {
            auth.signOut();
        });

        // Auth state listener
        auth.onAuthStateChanged(function (user) {
            loadingOverlay.classList.add('hidden');

            if (user) {
                currentUser = user;
                // Update UI
                avatarEl.src = user.photoURL || '';
                nameEl.textContent = user.displayName || user.email || 'User';
                loginPage.classList.add('hidden');
                appContainer.style.display = '';

                // Load data from Firestore
                loadAllUserData();
            } else {
                currentUser = null;
                loginPage.classList.remove('hidden');
                appContainer.style.display = 'none';
            }
        });
    }

    function loadAllUserData() {
        if (window.__pomodoroApp) window.__pomodoroApp._loadHistory();
        if (window.__todoApp) window.__todoApp._loadTasks();
        if (window.__noteApp) window.__noteApp._loadNotes();
    }

    // =========================================================
    //  TAB MANAGER
    // =========================================================
    function initTabs() {
        var tabBtns = document.querySelectorAll('.tab-btn');
        var sections = document.querySelectorAll('.section');
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tab = btn.getAttribute('data-tab');
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                sections.forEach(function (s) {
                    s.classList.remove('active');
                    s.style.animation = 'none'; s.offsetHeight; s.style.animation = '';
                });
                document.getElementById(tab + '-section').classList.add('active');
            });
        });
    }

    // =========================================================
    //  POMODORO TIMER
    // =========================================================
    function PomodoroTimer() {
        this.mode = '30'; this.totalReps = 3; this.currentRep = 1;
        this.isWorking = true; this.timeRemaining = MODES['30'].work;
        this.totalTime = MODES['30'].work; this.isRunning = false;
        this.isPaused = false; this.intervalId = null;

        this._cacheElements(); this._bindEvents();
        this._loadHistory(); this._updateDisplay();
    }

    PomodoroTimer.prototype._cacheElements = function () {
        this.statusEl = document.getElementById('timer-status');
        this.timeEl = document.getElementById('timer-time');
        this.repEl = document.getElementById('timer-rep');
        this.ringEl = document.getElementById('timer-ring-progress');
        this.startBtn = document.getElementById('btn-start');
        this.resetBtn = document.getElementById('btn-reset');
        this.repCountEl = document.getElementById('rep-count');
        this.timerCard = document.getElementById('timer-card');
        this.historyListEl = document.getElementById('history-list');
        this.historyContent = document.getElementById('history-content');
        this.historyArrow = document.getElementById('history-arrow');
    };

    PomodoroTimer.prototype._bindEvents = function () {
        var self = this;
        document.querySelectorAll('.mode-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (self.isRunning) return;
                document.querySelectorAll('.mode-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                self.mode = btn.getAttribute('data-mode');
                self._reset();
            });
        });
        document.getElementById('rep-decrease').addEventListener('click', function () {
            if (self.isRunning || self.totalReps <= 1) return;
            self.totalReps--; self.repCountEl.textContent = self.totalReps; self._reset();
        });
        document.getElementById('rep-increase').addEventListener('click', function () {
            if (self.isRunning || self.totalReps >= 10) return;
            self.totalReps++; self.repCountEl.textContent = self.totalReps; self._reset();
        });
        this.startBtn.addEventListener('click', function () {
            if (!self.isRunning) self._start();
            else if (self.isPaused) self._resume();
            else self._pause();
        });
        this.resetBtn.addEventListener('click', function () { self._reset(); });
        document.getElementById('history-toggle').addEventListener('click', function () {
            self.historyContent.classList.toggle('open');
            self.historyArrow.classList.toggle('open');
        });
    };

    PomodoroTimer.prototype._start = function () {
        var self = this;
        this.isRunning = true; this.isPaused = false;
        this.resetBtn.disabled = false;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this._updateStatus(); this._setLockedUI(true);
        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };
    PomodoroTimer.prototype._pause = function () {
        this.isPaused = true; clearInterval(this.intervalId);
        this.startBtn.textContent = t('resume');
        this.timerCard.classList.remove('running');
    };
    PomodoroTimer.prototype._resume = function () {
        var self = this; this.isPaused = false;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };
    PomodoroTimer.prototype._reset = function () {
        clearInterval(this.intervalId);
        this.isRunning = false; this.isPaused = false;
        this.currentRep = 1; this.isWorking = true;
        this.timeRemaining = MODES[this.mode].work;
        this.totalTime = MODES[this.mode].work;
        this.startBtn.textContent = t('start');
        this.resetBtn.disabled = true;
        this.statusEl.textContent = t('ready');
        this.statusEl.className = 'timer-status';
        this.timerCard.classList.remove('running', 'break-active');
        this.ringEl.classList.remove('break-mode');
        this._setLockedUI(false); this._updateDisplay();
    };
    PomodoroTimer.prototype._tick = function () {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) this._onPhaseComplete();
        this._updateDisplay();
    };
    PomodoroTimer.prototype._onPhaseComplete = function () {
        if (this.isWorking) {
            playBeep(600, 200, 2);
            this.isWorking = false;
            this.timeRemaining = MODES[this.mode].break;
            this.totalTime = MODES[this.mode].break;
            this.ringEl.classList.add('break-mode');
            this.timerCard.classList.add('break-active');
        } else {
            this.ringEl.classList.remove('break-mode');
            this.timerCard.classList.remove('break-active');
            if (this.currentRep < this.totalReps) {
                playBeep(800, 200, 2); this.currentRep++;
                this.isWorking = true;
                this.timeRemaining = MODES[this.mode].work;
                this.totalTime = MODES[this.mode].work;
            } else {
                playBeep(1000, 300, 4); this._onAllComplete(); return;
            }
        }
        this._updateStatus();
    };
    PomodoroTimer.prototype._onAllComplete = function () {
        clearInterval(this.intervalId);
        this.isRunning = false; this.isPaused = false;
        this.statusEl.textContent = t('completed');
        this.statusEl.className = 'timer-status completed';
        this.startBtn.textContent = t('start');
        this.resetBtn.disabled = false;
        this.timerCard.classList.remove('running');
        this._setLockedUI(false);
        this._saveHistory();
    };
    PomodoroTimer.prototype._updateDisplay = function () {
        this.timeEl.textContent = formatTime(this.timeRemaining);
        this.repEl.textContent = 'Rep ' + this.currentRep + '/' + this.totalReps;
        var progress = 1 - (this.timeRemaining / this.totalTime);
        this.ringEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    };
    PomodoroTimer.prototype._updateStatus = function () {
        if (this.isWorking) {
            this.statusEl.textContent = t('working');
            this.statusEl.className = 'timer-status working';
        } else {
            this.statusEl.textContent = t('breaking');
            this.statusEl.className = 'timer-status breaking';
        }
    };
    PomodoroTimer.prototype._setLockedUI = function (locked) {
        var cls = locked ? 'add' : 'remove';
        document.querySelectorAll('.mode-btn, .rep-btn').forEach(function (b) { b.classList[cls]('disabled'); });
    };

    // History — Firestore
    PomodoroTimer.prototype._saveHistory = function () {
        if (!currentUser) return;
        var entry = { mode: this.mode, reps: this.totalReps, completedAt: getTimeStr(), date: getTodayStr() };
        userDocRef('pomodoro_history').add(entry).then(function () {
            if (window.__pomodoroApp) window.__pomodoroApp._loadHistory();
        });
    };
    PomodoroTimer.prototype._loadHistory = function () {
        if (!currentUser) return;
        var self = this;
        userDocRef('pomodoro_history').orderBy('date', 'desc').get().then(function (snap) {
            var history = {};
            snap.forEach(function (doc) {
                var d = doc.data();
                if (!history[d.date]) history[d.date] = [];
                history[d.date].push(d);
            });
            self._renderHistory(history);
        });
    };
    PomodoroTimer.prototype._renderHistory = function (history) {
        var days = Object.keys(history).sort().reverse();
        if (days.length === 0) {
            this.historyListEl.innerHTML = '<div class="history-empty">' + t('noHistory') + '</div>';
            return;
        }
        var html = '';
        var locale = currentLang === 'vi' ? 'vi-VN' : 'en-US';
        days.forEach(function (day) {
            var items = history[day];
            var dateObj = new Date(day + 'T00:00:00');
            var dateStr = dateObj.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            html += '<div class="history-day"><div class="history-date">' + dateStr + '</div>';
            items.forEach(function (item) {
                html += '<div class="history-item"><span class="history-item-mode">🍅 ' + t('modeLabel' + item.mode) + ' × ' + item.reps + ' rep</span><span class="history-item-detail">' + item.completedAt + '</span></div>';
            });
            html += '</div>';
        });
        this.historyListEl.innerHTML = html;
    };

    // =========================================================
    //  TODO LIST
    // =========================================================
    function TodoList() {
        this.tasks = []; this.filter = 'all';
        this._cacheElements(); this._bindEvents(); this._loadTasks();
    }
    TodoList.prototype._cacheElements = function () {
        this.inputEl = document.getElementById('todo-input');
        this.listEl = document.getElementById('todo-list');
        this.statsEl = document.getElementById('todo-stats');
    };
    TodoList.prototype._bindEvents = function () {
        var self = this;
        document.getElementById('btn-add-todo').addEventListener('click', function () { self._addTask(); });
        this.inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._addTask(); });
        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                self.filter = btn.getAttribute('data-filter');
                self._render();
            });
        });
    };
    TodoList.prototype._addTask = function () {
        var text = this.inputEl.value.trim();
        if (!text || !currentUser) return;
        var task = { id: generateId(), text: text, completed: false, createdAt: new Date().toISOString() };
        this.tasks.unshift(task);
        this.inputEl.value = ''; this.inputEl.focus();
        this._saveTasks(); this._render();
    };
    TodoList.prototype.toggleTask = function (id) {
        var task = this.tasks.find(function (t) { return t.id === id; });
        if (task) { task.completed = !task.completed; this._saveTasks(); this._render(); }
    };
    TodoList.prototype.deleteTask = function (id) {
        this.tasks = this.tasks.filter(function (t) { return t.id !== id; });
        this._saveTasks(); this._render();
    };
    TodoList.prototype._getFilteredTasks = function () {
        if (this.filter === 'completed') return this.tasks.filter(function (t) { return t.completed; });
        if (this.filter === 'in-progress') return this.tasks.filter(function (t) { return !t.completed; });
        return this.tasks;
    };
    TodoList.prototype._render = function () {
        var filtered = this._getFilteredTasks();
        var total = this.tasks.length;
        var done = this.tasks.filter(function (t) { return t.completed; }).length;
        this.statsEl.textContent = t('statsTemplate').replace('{ip}', total - done).replace('{c}', done).replace('{t}', total);
        if (filtered.length === 0) {
            this.listEl.innerHTML = '<div class="todo-empty"><span class="empty-icon">📝</span><p>' + (total === 0 ? t('emptyTasks') : t('noMatch')) + '</p></div>';
            return;
        }
        var html = '';
        filtered.forEach(function (task) {
            html += '<div class="todo-item' + (task.completed ? ' completed' : '') + '" data-id="' + task.id + '">' +
                '<input type="checkbox" class="todo-checkbox"' + (task.completed ? ' checked' : '') + ' data-action="toggle" data-task-id="' + task.id + '" />' +
                '<span class="todo-text">' + escapeHtml(task.text) + '</span>' +
                '<button class="todo-delete" data-action="delete" data-task-id="' + task.id + '" title="Xóa">✕</button></div>';
        });
        this.listEl.innerHTML = html;
    };

    // Firestore persistence
    TodoList.prototype._saveTasks = function () {
        if (!currentUser) return;
        userDocRef('data').doc('todos').set({ items: this.tasks });
    };
    TodoList.prototype._loadTasks = function () {
        if (!currentUser) { this.tasks = []; this._render(); return; }
        var self = this;
        userDocRef('data').doc('todos').get().then(function (doc) {
            self.tasks = (doc.exists && doc.data().items) ? doc.data().items : [];
            self._render();
        });
    };

    // =========================================================
    //  QUICK NOTES
    // =========================================================
    function NoteApp() {
        this.notes = []; this.selectedIds = new Set();
        this.editingNoteId = null; this.currentColor = 'default';
        this._cacheElements(); this._bindEvents(); this._loadNotes();
    }
    NoteApp.prototype._cacheElements = function () {
        this.gridEl = document.getElementById('notes-grid');
        this.deleteBtn = document.getElementById('note-delete-selected');
        this.overlay = document.getElementById('note-modal-overlay');
        this.modalTitle = document.getElementById('note-modal-title');
        this.titleInput = document.getElementById('note-title-input');
        this.contentInput = document.getElementById('note-content-input');
        this.colorDots = document.querySelectorAll('.color-dot');
    };
    NoteApp.prototype._bindEvents = function () {
        var self = this;
        document.getElementById('note-add-btn').addEventListener('click', function () { self._openModal(null); });
        this.deleteBtn.addEventListener('click', function () { self._deleteSelected(); });
        document.getElementById('note-modal-close').addEventListener('click', function () { self._closeModal(); });
        document.getElementById('note-modal-cancel').addEventListener('click', function () { self._closeModal(); });
        this.overlay.addEventListener('click', function (e) { if (e.target === self.overlay) self._closeModal(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && self.overlay.classList.contains('active')) self._closeModal();
        });
        document.getElementById('note-modal-save').addEventListener('click', function () { self._saveFromModal(); });
        this.colorDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                self.colorDots.forEach(function (d) { d.classList.remove('active'); });
                dot.classList.add('active');
                self.currentColor = dot.getAttribute('data-color');
            });
        });
        this.gridEl.addEventListener('change', function (e) {
            if (e.target.classList.contains('note-select')) {
                var nid = e.target.getAttribute('data-note-id');
                if (e.target.checked) self.selectedIds.add(nid); else self.selectedIds.delete(nid);
                self._updateDeleteBtn(); self._updateCardSelection();
            }
        });

        // Long press logic for mobile and desktop
        var longPressTimer = null;
        var isLongPress = false;
        var startX = 0, startY = 0;

        var startPress = function (e) {
            if (e.target.classList.contains('note-select')) return;
            var card = e.target.closest('.note-card');
            if (!card) return;

            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }

            isLongPress = false;
            longPressTimer = setTimeout(function () {
                isLongPress = true;
                // Vibrate on mobile to indicate successful long press
                if (navigator.vibrate) navigator.vibrate(50);
                var checkbox = card.querySelector('.note-select');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
                longPressTimer = null;
            }, 500); // 500ms for better mobile feel
        };

        var cancelPress = function () {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        var touchMoveCancel = function (e) {
            if (!longPressTimer) return;
            var dx = e.touches[0].clientX - startX;
            var dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                cancelPress();
            }
        };

        this.gridEl.addEventListener('mousedown', startPress);
        this.gridEl.addEventListener('touchstart', startPress, { passive: true });
        this.gridEl.addEventListener('mouseup', cancelPress);
        this.gridEl.addEventListener('mouseleave', cancelPress);
        this.gridEl.addEventListener('touchend', cancelPress);
        this.gridEl.addEventListener('touchcancel', cancelPress);
        this.gridEl.addEventListener('touchmove', touchMoveCancel, { passive: true });

        this.gridEl.addEventListener('contextmenu', function (e) {
            // Prevent default context menu on long press on mobile
            var card = e.target.closest('.note-card');
            if (card) e.preventDefault();
        });

        this.gridEl.addEventListener('click', function (e) {
            cancelPress();
            if (isLongPress) {
                isLongPress = false;
                e.preventDefault();
                return;
            }
            if (e.target.classList.contains('note-select')) return;
            var card = e.target.closest('.note-card');
            if (card) self._openModal(card.getAttribute('data-id'));
        });
    };
    NoteApp.prototype._openModal = function (noteId) {
        this.editingNoteId = noteId;
        this.colorDots.forEach(function (d) { d.classList.remove('active'); });
        if (noteId) {
            var note = this.notes.find(function (n) { return n.id === noteId; });
            if (!note) return;
            this.modalTitle.textContent = t('editNote');
            this.titleInput.value = note.title; this.contentInput.value = note.content;
            this.currentColor = note.color || 'default';
        } else {
            this.modalTitle.textContent = t('newNote');
            this.titleInput.value = ''; this.contentInput.value = '';
            this.currentColor = 'default';
        }
        var self = this;
        this.colorDots.forEach(function (d) {
            if (d.getAttribute('data-color') === self.currentColor) d.classList.add('active');
        });
        this.overlay.classList.add('active');
        setTimeout(function () { self.titleInput.focus(); }, 300);
    };
    NoteApp.prototype._closeModal = function () {
        this.overlay.classList.remove('active'); this.editingNoteId = null;
    };
    NoteApp.prototype._saveFromModal = function () {
        var title = this.titleInput.value.trim();
        var content = this.contentInput.value.trim();
        if (!title && !content) return;
        if (this.editingNoteId) {
            var note = this.notes.find(function (n) { return n.id === this.editingNoteId; }.bind(this));
            if (note) {
                note.title = title; note.content = content;
                note.color = this.currentColor; note.updatedAt = new Date().toISOString();
            }
        } else {
            this.notes.unshift({
                id: generateId(), title: title, content: content,
                color: this.currentColor,
                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
            });
        }
        this._saveNotes(); this._render(); this._closeModal();
    };
    NoteApp.prototype._deleteSelected = function () {
        var sel = this.selectedIds;
        this.notes = this.notes.filter(function (n) { return !sel.has(n.id); });
        this.selectedIds.clear(); this._updateDeleteBtn();
        this._saveNotes(); this._render();
    };
    NoteApp.prototype._updateDeleteBtn = function () {
        this.deleteBtn.classList[this.selectedIds.size > 0 ? 'add' : 'remove']('visible');
    };
    NoteApp.prototype._updateCardSelection = function () {
        var sel = this.selectedIds;
        this.gridEl.querySelectorAll('.note-card').forEach(function (c) {
            c.classList[sel.has(c.getAttribute('data-id')) ? 'add' : 'remove']('selected');
        });
    };
    NoteApp.prototype._render = function () {
        if (this.notes.length === 0) {
            this.gridEl.innerHTML = '<div class="notes-empty"><span class="empty-icon">📌</span><p>' + t('emptyNotes') + '</p></div>';
            return;
        }
        var html = '', locale = currentLang === 'vi' ? 'vi-VN' : 'en-US', sel = this.selectedIds;
        this.notes.forEach(function (note) {
            var checked = sel.has(note.id), colorAttr = note.color && note.color !== 'default' ? ' data-color="' + note.color + '"' : '';
            var dateObj = new Date(note.updatedAt || note.createdAt);
            var dateStr = dateObj.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
                dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
            html += '<div class="note-card' + (checked ? ' selected' : '') + '" data-id="' + note.id + '"' + colorAttr + '>' +
                '<input type="checkbox" class="note-select" data-note-id="' + note.id + '"' + (checked ? ' checked' : '') + ' />' +
                (note.title ? '<div class="note-title">' + escapeHtml(note.title) + '</div>' : '') +
                (note.content ? '<div class="note-body">' + escapeHtml(note.content) + '</div>' : '') +
                '<div class="note-date">' + dateStr + '</div></div>';
        });
        this.gridEl.innerHTML = html;
    };

    // Firestore persistence
    NoteApp.prototype._saveNotes = function () {
        if (!currentUser) return;
        userDocRef('data').doc('notes').set({ items: this.notes });
    };
    NoteApp.prototype._loadNotes = function () {
        if (!currentUser) { this.notes = []; this._render(); return; }
        var self = this;
        userDocRef('data').doc('notes').get().then(function (doc) {
            self.notes = (doc.exists && doc.data().items) ? doc.data().items : [];
            self._render();
        });
    };

    // =========================================================
    //  PRICE APP (DOJI)
    // =========================================================
    function PriceApp() {
        this.sjcBuyEl = document.getElementById('price-sjc-buy');
        this.sjcSellEl = document.getElementById('price-sjc-sell');
        this.ringBuyEl = document.getElementById('price-ring-buy');
        this.ringSellEl = document.getElementById('price-ring-sell');

        // Global
        this.goldPriceEl = document.getElementById('price-gold');
        this.goldTrendEl = document.getElementById('trend-gold');
        this.oilPriceEl = document.getElementById('price-oil');
        this.oilTrendEl = document.getElementById('trend-oil');


        this.lastUpdateEl = document.getElementById('prices-last-update');
        this.refreshBtn = document.getElementById('btn-refresh-prices');

        if (!this.sjcBuyEl) return;

        this.refreshBtn.addEventListener('click', this.fetchPrices.bind(this));

        // PASTE YOUR APPS SCRIPT URL HERE
        this.appsScriptUrl = "https://script.google.com/macros/s/AKfycbzgehE46dQ-oMGOTRLh71L02VykMBsImfOcu9ePvqZwnO0lV2vc6k5-RQh9FWOXE6C6/exec";

        // Initial fetch
        this.fetchPrices();
    }

    PriceApp.prototype.formatPrice = function (value) {
        if (!value) return '--';
        return value.toLocaleString('vi-VN') + ' đ';
    };

    PriceApp.prototype.fetchPrices = function () {
        var self = this;
        this.refreshBtn.classList.add('loading');

        // 1. Fetch DOJI Gold (Vang.today)
        var p1 = fetch('https://www.vang.today/api/prices').then(function (res) { return res.json(); });

        // 2. Fetch Global Commodities (Google Apps Script)
        var p2 = Promise.resolve({ success: false }); // Default if no script URL
        if (this.appsScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
            p2 = fetch(this.appsScriptUrl).then(function (res) { return res.json(); });
        }

        Promise.all([p1, p2]).then(function (results) {
            var dojiData = results[0];
            var globalData = results[1];

            // --- DOJI DATA ---
            if (dojiData && dojiData.success && dojiData.prices) {
                var sjc = dojiData.prices['DOHNL'] || dojiData.prices['DOHCML'];
                if (sjc) {
                    self.sjcBuyEl.textContent = self.formatPrice(sjc.buy);
                    self.sjcSellEl.textContent = self.formatPrice(sjc.sell);
                }
                var ring = dojiData.prices['DOJINHTV'];
                if (ring) {
                    self.ringBuyEl.textContent = self.formatPrice(ring.buy);
                    self.ringSellEl.textContent = self.formatPrice(ring.sell);
                }
                var dateObj = new Date(dojiData.timestamp * 1000);
                self.lastUpdateEl.textContent = 'Cập nhật: ' + dateObj.toLocaleTimeString('vi-VN') + ' ' + dateObj.toLocaleDateString('vi-VN');
            }

            // --- GLOBAL COMMODITIES ---
            if (dojiData && dojiData.success && dojiData.prices && dojiData.prices['XAUUSD']) {
                var goldData = dojiData.prices['XAUUSD'];
                var changeStr = (goldData.change_buy > 0 ? '+' : '') + goldData.change_buy.toFixed(2);
                self.updateGlobalCard(self.goldPriceEl, self.goldTrendEl, {
                    price: goldData.buy.toFixed(2),
                    change: changeStr,
                    percent: (goldData.change_buy / (goldData.buy - goldData.change_buy) * 100).toFixed(2) + '%'
                }, '$');
            } else {
                self.goldPriceEl.textContent = "Lỗi API";
            }

            if (globalData && globalData.success && globalData.data) {
                if (globalData.data['Oil']) {
                    self.updateGlobalCard(self.oilPriceEl, self.oilTrendEl, globalData.data['Oil'], '$');
                }
            } else {
                self.oilPriceEl.textContent = "Chờ API...";
            }
        }).catch(function (err) {
            console.error("Lỗi lấy giá:", err);
            self.lastUpdateEl.textContent = 'Lỗi cập nhật lúc ' + new Date().toLocaleTimeString('vi-VN');
        }).finally(function () {
            self.refreshBtn.classList.remove('loading');
        });
    };

    PriceApp.prototype.updateGlobalCard = function (priceEl, trendEl, dataObj, prefix) {
        if (!dataObj) return;
        priceEl.textContent = prefix + dataObj.price;

        var isUp = dataObj.change.indexOf('+') !== -1 || parseFloat(dataObj.change) > 0;
        var changeStr = dataObj.change + ' (' + dataObj.percent + ')';
        trendEl.textContent = (isUp ? '▲ ' : '▼ ') + changeStr;
        trendEl.className = 'trend-badge ' + (isUp ? 'up' : 'down');
    };

    // =========================================================
    //  INITIALIZATION
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        setLanguage(currentLang);
        initAuth();

        // Language toggle
        document.getElementById('lang-toggle').addEventListener('click', function () {
            setLanguage(currentLang === 'vi' ? 'en' : 'vi');
            if (window.__pomodoroApp) {
                window.__pomodoroApp._loadHistory();
                if (!window.__pomodoroApp.isRunning) {
                    window.__pomodoroApp.statusEl.textContent = t('ready');
                    window.__pomodoroApp.startBtn.textContent = t('start');
                } else if (window.__pomodoroApp.isPaused) {
                    window.__pomodoroApp.startBtn.textContent = t('resume');
                    window.__pomodoroApp._updateStatus();
                } else {
                    window.__pomodoroApp.startBtn.textContent = t('pause');
                    window.__pomodoroApp._updateStatus();
                }
            }
            if (window.__todoApp) window.__todoApp._render();
            if (window.__noteApp) window.__noteApp._render();
        });

        // Create app instances
        window.__pomodoroApp = new PomodoroTimer();
        window.__todoApp = new TodoList();
        window.__noteApp = new NoteApp();
        window.__priceApp = new PriceApp();

        // Todo event delegation
        document.getElementById('todo-list').addEventListener('click', function (e) {
            var action = e.target.getAttribute('data-action'), id = e.target.getAttribute('data-task-id');
            if (action === 'delete' && id) window.__todoApp.deleteTask(id);
        });
        document.getElementById('todo-list').addEventListener('change', function (e) {
            var action = e.target.getAttribute('data-action'), id = e.target.getAttribute('data-task-id');
            if (action === 'toggle' && id) window.__todoApp.toggleTask(id);
        });
    });
})();
