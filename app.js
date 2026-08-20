(function () {
    'use strict';

    // ===== CONSTANTS =====
    const MODES = {
        '30': { work: 25 * 60, break: 5 * 60, label: '30 phút' },
        '50': { work: 40 * 60, break: 10 * 60, label: '50 phút' }
    };

    const STORAGE_KEYS = {
        history: 'pomodoro_history',
        tasks: 'todo_tasks',
        notes: 'quick_notes',
        lang: 'app_language'
    };

    // ===== I18N DICTIONARIES =====
    var LANG = {
        vi: {
            // Pomodoro
            mode: 'Chế độ',
            mode30: '30 phút',
            mode30Detail: "25' làm + 5' nghỉ",
            mode50: '50 phút',
            mode50Detail: "40' làm + 10' nghỉ",
            reps: 'Số Rep',
            ready: 'Sẵn sàng',
            start: '▶ Bắt đầu',
            pause: '⏸ Tạm dừng',
            resume: '▶ Tiếp tục',
            completed: '🎉 Hoàn thành!',
            working: '🔥 Đang làm việc',
            breaking: '☕ Nghỉ ngơi',
            history: '📊 Lịch sử',
            noHistory: 'Chưa có lịch sử',
            // Todo
            addTaskPlaceholder: 'Thêm task mới...',
            addBtn: '+ Thêm',
            filterAll: 'Tất cả',
            filterInProgress: 'Đang làm',
            filterCompleted: 'Hoàn thành',
            emptyTasks: 'Chưa có task nào',
            noMatch: 'Không có task phù hợp',
            statsTemplate: '{ip} đang làm · {c} hoàn thành · {t} tổng',
            // Mode labels for history
            modeLabel30: '30 phút',
            modeLabel50: '50 phút',
            // Notes
            newNote: '+ Ghi chú mới',
            editNote: 'Sửa ghi chú',
            deleteSelected: '🗑 Xóa đã chọn',
            emptyNotes: 'Chưa có ghi chú nào',
            noteTitlePlaceholder: 'Tiêu đề...',
            noteContentPlaceholder: 'Nội dung ghi chú...',
            noteColor: 'Màu:',
            cancel: 'Hủy',
            saveNote: 'Lưu'
        },
        en: {
            // Pomodoro
            mode: 'Mode',
            mode30: '30 min',
            mode30Detail: "25' work + 5' rest",
            mode50: '50 min',
            mode50Detail: "40' work + 10' rest",
            reps: 'Reps',
            ready: 'Ready',
            start: '▶ Start',
            pause: '⏸ Pause',
            resume: '▶ Resume',
            completed: '🎉 Completed!',
            working: '🔥 Working',
            breaking: '☕ Break',
            history: '📊 History',
            noHistory: 'No history yet',
            // Todo
            addTaskPlaceholder: 'Add new task...',
            addBtn: '+ Add',
            filterAll: 'All',
            filterInProgress: 'In Progress',
            filterCompleted: 'Completed',
            emptyTasks: 'No tasks yet',
            noMatch: 'No matching tasks',
            statsTemplate: '{ip} in progress · {c} completed · {t} total',
            // Mode labels for history
            modeLabel30: '30 min',
            modeLabel50: '50 min',
            // Notes
            newNote: '+ New Note',
            editNote: 'Edit Note',
            deleteSelected: '🗑 Delete Selected',
            emptyNotes: 'No notes yet',
            noteTitlePlaceholder: 'Title...',
            noteContentPlaceholder: 'Note content...',
            noteColor: 'Color:',
            cancel: 'Cancel',
            saveNote: 'Save'
        }
    };

    // ===== I18N MANAGER =====
    var currentLang = localStorage.getItem(STORAGE_KEYS.lang) || 'vi';

    function t(key) {
        return LANG[currentLang][key] || LANG['vi'][key] || key;
    }

    function applyI18nToDOM() {
        // Translate textContent
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEYS.lang, lang);

        // Update toggle button
        var flagEl = document.getElementById('lang-flag');
        var labelEl = document.getElementById('lang-label');
        if (lang === 'vi') {
            flagEl.textContent = '🇻🇳';
            labelEl.textContent = 'VI';
            document.documentElement.lang = 'vi';
        } else {
            flagEl.textContent = '🇬🇧';
            labelEl.textContent = 'EN';
            document.documentElement.lang = 'en';
        }

        applyI18nToDOM();
    }

    const CIRCUMFERENCE = 2 * Math.PI * 120; // r=120 from SVG

    // ===== UTILITY FUNCTIONS =====
    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    function getTodayStr() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function getTimeStr() {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== AUDIO NOTIFICATION =====
    function playBeep(frequency, duration, times) {
        frequency = frequency || 800;
        duration = duration || 200;
        times = times || 3;

        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();
            var startTime = ctx.currentTime;

            for (var i = 0; i < times; i++) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = frequency;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration / 1000);
                osc.start(startTime);
                osc.stop(startTime + duration / 1000);
                startTime += (duration + 150) / 1000;
            }
        } catch (e) {
            // Audio API not available, silently ignore
        }
    }

    // ===== TAB MANAGER =====
    function initTabs() {
        var tabBtns = document.querySelectorAll('.tab-btn');
        var sections = document.querySelectorAll('.section');

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetTab = btn.getAttribute('data-tab');

                // Update tab buttons
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Update sections with re-trigger animation
                sections.forEach(function (s) {
                    s.classList.remove('active');
                    s.style.animation = 'none';
                    s.offsetHeight; // force reflow
                    s.style.animation = '';
                });

                document.getElementById(targetTab + '-section').classList.add('active');
            });
        });
    }

    // =========================================================
    //  POMODORO TIMER
    // =========================================================
    function PomodoroTimer() {
        this.mode = '30';
        this.totalReps = 3;
        this.currentRep = 1;
        this.isWorking = true;
        this.timeRemaining = MODES[this.mode].work;
        this.totalTime = MODES[this.mode].work;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;

        this._cacheElements();
        this._bindEvents();
        this._loadHistory();
        this._updateDisplay();
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

        // Mode selection
        var modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (self.isRunning) return;
                modeBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                self.mode = btn.getAttribute('data-mode');
                self._reset();
            });
        });

        // Rep controls
        document.getElementById('rep-decrease').addEventListener('click', function () {
            if (self.isRunning || self.totalReps <= 1) return;
            self.totalReps--;
            self.repCountEl.textContent = self.totalReps;
            self._reset();
        });

        document.getElementById('rep-increase').addEventListener('click', function () {
            if (self.isRunning || self.totalReps >= 10) return;
            self.totalReps++;
            self.repCountEl.textContent = self.totalReps;
            self._reset();
        });

        // Start / Pause / Resume
        this.startBtn.addEventListener('click', function () {
            if (!self.isRunning) {
                self._start();
            } else if (self.isPaused) {
                self._resume();
            } else {
                self._pause();
            }
        });

        // Reset
        this.resetBtn.addEventListener('click', function () { self._reset(); });

        // History toggle
        document.getElementById('history-toggle').addEventListener('click', function () {
            self.historyContent.classList.toggle('open');
            self.historyArrow.classList.toggle('open');
        });
    };

    PomodoroTimer.prototype._start = function () {
        var self = this;
        this.isRunning = true;
        this.isPaused = false;
        this.resetBtn.disabled = false;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this._updateStatus();
        this._setLockedUI(true);

        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };

    PomodoroTimer.prototype._pause = function () {
        this.isPaused = true;
        clearInterval(this.intervalId);
        this.startBtn.textContent = t('resume');
        this.timerCard.classList.remove('running');
    };

    PomodoroTimer.prototype._resume = function () {
        var self = this;
        this.isPaused = false;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };

    PomodoroTimer.prototype._reset = function () {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.currentRep = 1;
        this.isWorking = true;
        this.timeRemaining = MODES[this.mode].work;
        this.totalTime = MODES[this.mode].work;

        this.startBtn.textContent = t('start');
        this.resetBtn.disabled = true;
        this.statusEl.textContent = t('ready');
        this.statusEl.className = 'timer-status';
        this.timerCard.classList.remove('running');
        this.timerCard.classList.remove('break-active');
        this.ringEl.classList.remove('break-mode');
        this._setLockedUI(false);
        this._updateDisplay();
    };

    PomodoroTimer.prototype._tick = function () {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
            this._onPhaseComplete();
        }

        this._updateDisplay();
    };

    PomodoroTimer.prototype._onPhaseComplete = function () {
        if (this.isWorking) {
            // Work → Break
            playBeep(600, 200, 2);
            this.isWorking = false;
            this.timeRemaining = MODES[this.mode].break;
            this.totalTime = MODES[this.mode].break;
            this.ringEl.classList.add('break-mode');
            this.timerCard.classList.add('break-active');
        } else {
            // Break → next rep or complete
            this.ringEl.classList.remove('break-mode');
            this.timerCard.classList.remove('break-active');

            if (this.currentRep < this.totalReps) {
                playBeep(800, 200, 2);
                this.currentRep++;
                this.isWorking = true;
                this.timeRemaining = MODES[this.mode].work;
                this.totalTime = MODES[this.mode].work;
            } else {
                // All done!
                playBeep(1000, 300, 4);
                this._onAllComplete();
                return;
            }
        }
        this._updateStatus();
    };

    PomodoroTimer.prototype._onAllComplete = function () {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;

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

        // Update SVG ring
        var progress = 1 - (this.timeRemaining / this.totalTime);
        var offset = CIRCUMFERENCE * (1 - progress);
        this.ringEl.style.strokeDashoffset = offset;
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

    // Lock mode & rep controls while timer is running
    PomodoroTimer.prototype._setLockedUI = function (locked) {
        var modeBtns = document.querySelectorAll('.mode-btn');
        var repBtns = document.querySelectorAll('.rep-btn');

        modeBtns.forEach(function (b) {
            if (locked) b.classList.add('disabled');
            else b.classList.remove('disabled');
        });
        repBtns.forEach(function (b) {
            if (locked) b.classList.add('disabled');
            else b.classList.remove('disabled');
        });
    };

    // ----- History persistence -----

    PomodoroTimer.prototype._saveHistory = function () {
        var raw = localStorage.getItem(STORAGE_KEYS.history);
        var history = raw ? JSON.parse(raw) : {};
        var today = getTodayStr();

        if (!history[today]) history[today] = [];

        history[today].push({
            mode: this.mode,
            reps: this.totalReps,
            completedAt: getTimeStr()
        });

        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
        this._renderHistory(history);
    };

    PomodoroTimer.prototype._loadHistory = function () {
        var raw = localStorage.getItem(STORAGE_KEYS.history);
        var history = raw ? JSON.parse(raw) : {};
        this._renderHistory(history);
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
            var dateStr = dateObj.toLocaleDateString(locale, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            html += '<div class="history-day">';
            html += '<div class="history-date">' + dateStr + '</div>';
            items.forEach(function (item) {
                var modeLabel = t('modeLabel' + item.mode);
                html += '<div class="history-item">';
                html += '<span class="history-item-mode">🍅 ' + modeLabel + ' × ' + item.reps + ' rep</span>';
                html += '<span class="history-item-detail">' + item.completedAt + '</span>';
                html += '</div>';
            });
            html += '</div>';
        });

        this.historyListEl.innerHTML = html;
    };

    // =========================================================
    //  TODO LIST
    // =========================================================
    function TodoList() {
        this.tasks = [];
        this.filter = 'all';

        this._cacheElements();
        this._bindEvents();
        this._loadTasks();
    }

    TodoList.prototype._cacheElements = function () {
        this.inputEl = document.getElementById('todo-input');
        this.addBtn = document.getElementById('btn-add-todo');
        this.listEl = document.getElementById('todo-list');
        this.statsEl = document.getElementById('todo-stats');
    };

    TodoList.prototype._bindEvents = function () {
        var self = this;

        this.addBtn.addEventListener('click', function () { self._addTask(); });

        this.inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') self._addTask();
        });

        // Filter buttons
        var filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                self.filter = btn.getAttribute('data-filter');
                self._render();
            });
        });
    };

    TodoList.prototype._addTask = function () {
        var text = this.inputEl.value.trim();
        if (!text) return;

        this.tasks.unshift({
            id: generateId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        });

        this.inputEl.value = '';
        this.inputEl.focus();
        this._saveTasks();
        this._render();
    };

    TodoList.prototype.toggleTask = function (id) {
        var task = this.tasks.find(function (t) { return t.id === id; });
        if (task) {
            task.completed = !task.completed;
            this._saveTasks();
            this._render();
        }
    };

    TodoList.prototype.deleteTask = function (id) {
        this.tasks = this.tasks.filter(function (t) { return t.id !== id; });
        this._saveTasks();
        this._render();
    };

    TodoList.prototype._getFilteredTasks = function () {
        switch (this.filter) {
            case 'completed':
                return this.tasks.filter(function (t) { return t.completed; });
            case 'in-progress':
                return this.tasks.filter(function (t) { return !t.completed; });
            default:
                return this.tasks;
        }
    };

    TodoList.prototype._render = function () {
        var filtered = this._getFilteredTasks();
        var totalTasks = this.tasks.length;
        var completedTasks = this.tasks.filter(function (t) { return t.completed; }).length;
        var inProgressTasks = totalTasks - completedTasks;

        // Stats
        this.statsEl.textContent = t('statsTemplate')
            .replace('{ip}', inProgressTasks)
            .replace('{c}', completedTasks)
            .replace('{t}', totalTasks);

        // Empty state
        if (filtered.length === 0) {
            var msg = totalTasks === 0 ? t('emptyTasks') : t('noMatch');
            this.listEl.innerHTML =
                '<div class="todo-empty">' +
                '<span class="empty-icon">📝</span>' +
                '<p>' + msg + '</p>' +
                '</div>';
            return;
        }

        // Render items
        var html = '';
        filtered.forEach(function (task) {
            var checkedAttr = task.completed ? ' checked' : '';
            var completedClass = task.completed ? ' completed' : '';

            html +=
                '<div class="todo-item' + completedClass + '" data-id="' + task.id + '">' +
                '<input type="checkbox" class="todo-checkbox"' + checkedAttr + ' data-action="toggle" data-task-id="' + task.id + '" />' +
                '<span class="todo-text">' + escapeHtml(task.text) + '</span>' +
                '<button class="todo-delete" data-action="delete" data-task-id="' + task.id + '" title="Xóa">✕</button>' +
                '</div>';
        });

        this.listEl.innerHTML = html;
    };

    TodoList.prototype._saveTasks = function () {
        localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(this.tasks));
    };

    TodoList.prototype._loadTasks = function () {
        var raw = localStorage.getItem(STORAGE_KEYS.tasks);
        this.tasks = raw ? JSON.parse(raw) : [];
        this._render();
    };

    // =========================================================
    //  INITIALIZATION
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        initTabs();

        // Apply saved language
        setLanguage(currentLang);

        // Language toggle
        document.getElementById('lang-toggle').addEventListener('click', function () {
            var newLang = currentLang === 'vi' ? 'en' : 'vi';
            setLanguage(newLang);
            // Re-render dynamic content with new language
            if (window.__pomodoroApp) {
                window.__pomodoroApp._loadHistory();
                // Update timer status if not running
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
            if (window.__todoApp) {
                window.__todoApp._render();
            }
            if (window.__noteApp) {
                window.__noteApp._render();
            }
        });

        // Pomodoro
        window.__pomodoroApp = new PomodoroTimer();

        // Todo — use event delegation for performance
        window.__todoApp = new TodoList();

        document.getElementById('todo-list').addEventListener('click', function (e) {
            var target = e.target;
            var action = target.getAttribute('data-action');
            var taskId = target.getAttribute('data-task-id');

            if (!action || !taskId) return;

            if (action === 'delete') {
                window.__todoApp.deleteTask(taskId);
            }
        });

        document.getElementById('todo-list').addEventListener('change', function (e) {
            var target = e.target;
            var action = target.getAttribute('data-action');
            var taskId = target.getAttribute('data-task-id');

            if (action === 'toggle' && taskId) {
                window.__todoApp.toggleTask(taskId);
            }
        });

        // Notes
        window.__noteApp = new NoteApp();
    });

    // =========================================================
    //  QUICK NOTES
    // =========================================================
    function NoteApp() {
        this.notes = [];
        this.selectedIds = new Set();
        this.editingNoteId = null;
        this.currentColor = 'default';

        this._cacheElements();
        this._bindEvents();
        this._loadNotes();
    }

    NoteApp.prototype._cacheElements = function () {
        this.gridEl = document.getElementById('notes-grid');
        this.deleteBtn = document.getElementById('note-delete-selected');
        this.addBtn = document.getElementById('note-add-btn');
        this.overlay = document.getElementById('note-modal-overlay');
        this.modalTitle = document.getElementById('note-modal-title');
        this.titleInput = document.getElementById('note-title-input');
        this.contentInput = document.getElementById('note-content-input');
        this.saveBtn = document.getElementById('note-modal-save');
        this.cancelBtn = document.getElementById('note-modal-cancel');
        this.closeBtn = document.getElementById('note-modal-close');
        this.colorDots = document.querySelectorAll('.color-dot');
    };

    NoteApp.prototype._bindEvents = function () {
        var self = this;

        // Add button → open modal for new note
        this.addBtn.addEventListener('click', function () {
            self._openModal(null);
        });

        // Delete selected
        this.deleteBtn.addEventListener('click', function () {
            self._deleteSelected();
        });

        // Modal close / cancel
        this.closeBtn.addEventListener('click', function () { self._closeModal(); });
        this.cancelBtn.addEventListener('click', function () { self._closeModal(); });

        // Click overlay backdrop to close
        this.overlay.addEventListener('click', function (e) {
            if (e.target === self.overlay) self._closeModal();
        });

        // Escape key to close modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && self.overlay.classList.contains('active')) {
                self._closeModal();
            }
        });

        // Save
        this.saveBtn.addEventListener('click', function () {
            self._saveFromModal();
        });

        // Color picker
        this.colorDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                self.colorDots.forEach(function (d) { d.classList.remove('active'); });
                dot.classList.add('active');
                self.currentColor = dot.getAttribute('data-color');
            });
        });

        // Event delegation on the grid: select checkboxes + click to edit
        this.gridEl.addEventListener('change', function (e) {
            if (e.target.classList.contains('note-select')) {
                var noteId = e.target.getAttribute('data-note-id');
                if (e.target.checked) {
                    self.selectedIds.add(noteId);
                } else {
                    self.selectedIds.delete(noteId);
                }
                self._updateDeleteBtn();
                self._updateCardSelection();
            }
        });

        this.gridEl.addEventListener('click', function (e) {
            // Don't open modal if clicking checkbox
            if (e.target.classList.contains('note-select')) return;

            var card = e.target.closest('.note-card');
            if (card) {
                var noteId = card.getAttribute('data-id');
                self._openModal(noteId);
            }
        });
    };

    NoteApp.prototype._openModal = function (noteId) {
        this.editingNoteId = noteId;

        // Reset color picker
        this.colorDots.forEach(function (d) { d.classList.remove('active'); });

        if (noteId) {
            // Edit existing note
            var note = this.notes.find(function (n) { return n.id === noteId; });
            if (!note) return;
            this.modalTitle.textContent = t('editNote');
            this.titleInput.value = note.title;
            this.contentInput.value = note.content;
            this.currentColor = note.color || 'default';
        } else {
            // New note
            this.modalTitle.textContent = t('newNote');
            this.titleInput.value = '';
            this.contentInput.value = '';
            this.currentColor = 'default';
        }

        // Activate current color dot
        var self = this;
        this.colorDots.forEach(function (d) {
            if (d.getAttribute('data-color') === self.currentColor) {
                d.classList.add('active');
            }
        });

        this.overlay.classList.add('active');
        // Focus title input after animation
        setTimeout(function () { self.titleInput.focus(); }, 300);
    };

    NoteApp.prototype._closeModal = function () {
        this.overlay.classList.remove('active');
        this.editingNoteId = null;
    };

    NoteApp.prototype._saveFromModal = function () {
        var title = this.titleInput.value.trim();
        var content = this.contentInput.value.trim();

        // Need at least title or content
        if (!title && !content) return;

        if (this.editingNoteId) {
            // Update existing
            var note = this.notes.find(function (n) { return n.id === this.editingNoteId; }.bind(this));
            if (note) {
                note.title = title;
                note.content = content;
                note.color = this.currentColor;
                note.updatedAt = new Date().toISOString();
            }
        } else {
            // Create new
            this.notes.unshift({
                id: generateId(),
                title: title,
                content: content,
                color: this.currentColor,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        this._saveNotes();
        this._render();
        this._closeModal();
    };

    NoteApp.prototype._deleteSelected = function () {
        var selected = this.selectedIds;
        this.notes = this.notes.filter(function (n) { return !selected.has(n.id); });
        this.selectedIds.clear();
        this._updateDeleteBtn();
        this._saveNotes();
        this._render();
    };

    NoteApp.prototype._updateDeleteBtn = function () {
        if (this.selectedIds.size > 0) {
            this.deleteBtn.classList.add('visible');
        } else {
            this.deleteBtn.classList.remove('visible');
        }
    };

    NoteApp.prototype._updateCardSelection = function () {
        var cards = this.gridEl.querySelectorAll('.note-card');
        var selected = this.selectedIds;
        cards.forEach(function (card) {
            var id = card.getAttribute('data-id');
            if (selected.has(id)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    };

    NoteApp.prototype._render = function () {
        if (this.notes.length === 0) {
            this.gridEl.innerHTML =
                '<div class="notes-empty">' +
                '<span class="empty-icon">📌</span>' +
                '<p data-i18n="emptyNotes">' + t('emptyNotes') + '</p>' +
                '</div>';
            return;
        }

        var html = '';
        var locale = currentLang === 'vi' ? 'vi-VN' : 'en-US';
        var selectedIds = this.selectedIds;

        this.notes.forEach(function (note) {
            var isSelected = selectedIds.has(note.id);
            var checkedAttr = isSelected ? ' checked' : '';
            var selectedClass = isSelected ? ' selected' : '';
            var colorAttr = note.color && note.color !== 'default' ? ' data-color="' + note.color + '"' : '';

            var dateObj = new Date(note.updatedAt || note.createdAt);
            var dateStr = dateObj.toLocaleDateString(locale, {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }) + ' ' + dateObj.toLocaleTimeString(locale, {
                hour: '2-digit', minute: '2-digit'
            });

            html += '<div class="note-card' + selectedClass + '" data-id="' + note.id + '"' + colorAttr + '>';
            html += '<input type="checkbox" class="note-select" data-note-id="' + note.id + '"' + checkedAttr + ' />';
            if (note.title) {
                html += '<div class="note-title">' + escapeHtml(note.title) + '</div>';
            }
            if (note.content) {
                html += '<div class="note-body">' + escapeHtml(note.content) + '</div>';
            }
            html += '<div class="note-date">' + dateStr + '</div>';
            html += '</div>';
        });

        this.gridEl.innerHTML = html;
    };

    NoteApp.prototype._saveNotes = function () {
        localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(this.notes));
    };

    NoteApp.prototype._loadNotes = function () {
        var raw = localStorage.getItem(STORAGE_KEYS.notes);
        this.notes = raw ? JSON.parse(raw) : [];
        this._render();
    };

})();
