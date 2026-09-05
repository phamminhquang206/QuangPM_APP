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
            startDate: 'Bắt đầu:', endDate: 'Kết thúc:',
            from: 'Từ', to: 'Đến',
            todayBadge: 'Hôm nay', overdueBadge: 'Quá hạn',
            subtasksCount: 'mục', addSubtaskPlaceholder: 'Thêm việc con...',
            addSubtaskBtn: '+',
            editTask: 'Sửa tên',
            doubleClickToEdit: 'Nhấp đúp hoặc bấm ✎ để sửa tên',
            taskTitleLabel: 'Tên công việc:',
            taskTitlePlaceholder: 'Nhập tên công việc...',
            taskUpdatedToast: 'Đã cập nhật tên công việc! ✏️',
            setTaskDates: 'Thời hạn công việc', clearDates: 'Xóa hạn',
            save: 'Lưu', addDate: '+ Ngày',
            confirmModalTitle: 'Xác nhận xóa', confirmDelete: 'Xóa',
            confirmDeleteTaskMsg: 'Bạn có chắc chắn muốn xóa công việc này?',
            confirmDeleteSubtaskMsg: 'Bạn có chắc chắn muốn xóa việc con này?',
            confirmDeleteNotesMsg: 'Bạn có chắc chắn muốn xóa các ghi chú đã chọn?',
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
            logout: 'Đăng xuất', logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?',
            goldPrices: 'Giá Vàng DOJI', goldSJC: 'Vàng miếng SJC', goldRing: 'Nhẫn tròn Hưng Thịnh Vượng',
            buyPrice: 'Mua vào', sellPrice: 'Bán ra', refresh: '🔄 Làm mới',
            globalPrices: 'Hàng Hóa Toàn Cầu', worldGold: 'Vàng (World)', crudeOil: 'Dầu Thô (WTI)',
            or: 'hoặc',
            installApp: 'Cài app',
            installAppLogin: 'Cài đặt ứng dụng vào điện thoại',
            installBannerTitle: 'Cài đặt FlowHub',
            installBannerDesc: 'Thêm vào màn hình chính để dùng mượt mà như app di động',
            installBtn: 'Cài đặt',
            pwaGuideTitle: 'Cài đặt FlowHub',
            pwaGuideIntro: 'Để cài đặt FlowHub vào màn hình chính thiết bị của bạn:',
            iosStep1: 'Nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong> <span class="pwa-inline-icon">📤</span> ở thanh công cụ trình duyệt.',
            iosStep2: 'Cuộn xuống và chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen) <span class="pwa-inline-icon">➕</span>.',
            iosStep3: 'Nhấn <strong>"Thêm" (Add)</strong> ở góc trên bên phải để hoàn tất.',
            desktopStep1: 'Nhấn biểu tượng Cài đặt <span class="pwa-inline-icon">⊕</span> hoặc <span class="pwa-inline-icon">💻</span> trên thanh địa chỉ trình duyệt.',
            desktopStep2: 'Hoặc vào Menu <span class="pwa-inline-icon">⋮</span> của trình duyệt -> chọn <strong>"Cài đặt FlowHub..."</strong>',
            desktopStep3: 'Xác nhận <strong>"Cài đặt"</strong> để mở FlowHub trong cửa sổ độc lập mượt mà.',
            pwaTip: 'FlowHub sẽ hoạt động toàn màn hình mượt mà, độc lập và lưu dữ liệu offline!',
            gotIt: 'Đã hiểu',
            installedToast: 'Đã cài đặt FlowHub thành công! 🎉',
            alreadyInstalledToast: 'FlowHub đã được cài đặt trên thiết bị của bạn! ✨',
            setTaskDates: 'Thời hạn công việc',
            setTaskDatesAndReminder: 'Thời hạn & Nhắc nhở',
            enableTaskReminder: 'Bật thông báo nhắc nhở',
            clearDates: 'Xóa ngày giờ',
            reminderTime: 'Thời gian:',
            reminderFrequency: 'Lặp lại:',
            freqOnce: 'Một lần',
            freqDaily: 'Hàng ngày',
            freqWeekly: 'Hàng tuần',
            freqMonthly: 'Hàng tháng',
            notificationNotice: 'Cần cấp quyền để nhận thông báo trên điện thoại / máy tính',
            enableNotification: 'Bật thông báo',
            taskReminderAlertTitle: '⏰ Nhắc nhở công việc',
            reminderToast: '⏰ Nhắc nhở: {title}',
            taskReminderDue: 'Đến hạn công việc',
            completeTask: '✓ Hoàn thành',
            taskCompletedToast: 'Đã hoàn thành công việc! 🎉',
            reminderStageBeforeTitle: '⏰ Sắp đến giờ task (còn 5 phút)',
            reminderStageBeforeToast: '⏰ Còn 5 phút nữa đến giờ task: {title}',
            reminderStageBeforeBadge: 'Sắp đến (còn 5p)',
            reminderStageDueTitle: '🔔 Đến giờ làm task',
            reminderStageDueToast: '🔔 Đến giờ làm task: {title}',
            reminderStageDueBadge: 'Đến giờ hẹn',
            reminderStageLateTitle: '⚠️ Quá hạn task 5 phút',
            reminderStageLateToast: '⚠️ Quá hạn task 5 phút: {title}',
            reminderStageLateBadge: 'Quá hạn 5 phút',
            snooze5m: '⏰ Báo lại 5p',
            dismiss: 'Đã hiểu (Tắt nhắc)',
            snoozedToast: 'Đã hoãn nhắc nhở 5 phút',
            reminderSetSuccessToast: '⏰ Đã lưu thời hạn: "{title}" (Hạn: {time})',
            reminderSetSuccessTitle: '⏰ Đã đặt lịch task',
            dueTimeLabel: 'Hạn hoàn thành',
            batteryTipLink: 'Mẹo: Nhận thông báo chuẩn khi tắt màn hình',
            batteryGuideTitle: '⚡ Mẹo nhận thông báo khi tắt màn hình',
            batteryGuideIntro: 'Hệ điều hành Android thường bật chế độ "Tối ưu hóa pin" mặc định. Sau vài phút tắt màn hình, máy sẽ tự động đóng băng ứng dụng, khiến chuông nhắc việc bị trễ hoặc nín bặt.',
            batteryStep1Title: 'Mở thông tin ứng dụng',
            batteryStep1Desc: 'Nhấn giữ icon FlowHub (hoặc Chrome) trên màn hình chính ➔ Chọn biểu tượng Thông tin ứng dụng (App info ⓘ).',
            batteryStep2Title: 'Đổi Pin sang "Không hạn chế"',
            batteryStep2Desc: 'Vào mục Pin (Battery) ➔ Chọn chế độ "Không hạn chế" (Unrestricted) thay vì "Tối ưu hóa".',
            batteryStep3Title: 'Bật trên màn hình khóa',
            batteryStep3Desc: 'Vào mục Thông báo ➔ Đảm bảo đã bật "Cho phép trên màn hình khóa" và "Bật âm thanh & rung".',
            batteryGuideTipNote: 'Sau khi thiết lập, thông báo nhắc việc sẽ reo chuông và sáng màn hình chuẩn từng phút ngay cả khi tắt máy!',
            batteryGuideGotIt: '✓ Tôi đã hiểu & đã cài đặt',

            // Habit Tracker
            habitsTab: 'Thói quen',
            currentStreak: 'Chuỗi hiện tại',
            daysUnit: 'ngày',
            habitRank1: 'Tập sự kỷ luật',
            habitRank2: 'Chiến binh kiên trì',
            habitRank3: 'Bậc thầy thói quen',
            habitRank4: 'Đại sư kỷ luật',
            habitShop: 'Cửa hàng tự thưởng',
            habitBadges: 'Huy hiệu',
            habitDiscipline: 'Quỹ kỷ luật',
            todayQuick: 'Hôm nay',
            initMonthTable: 'Tạo bảng tháng',
            manageHabits: 'Quản lý',
            addHabit: 'Thêm thói quen',
            editHabit: 'Sửa thói quen',
            emptyHabitTitle: 'Chưa có thói quen nào',
            emptyHabitDesc: 'Hãy bấm "+ Thêm thói quen" để bắt đầu hành trình xây dựng kỷ luật bản thân!',
            addFirstHabit: 'Tạo thói quen đầu tiên',
            habitNameLabel: 'Tên thói quen',
            habitNamePlaceholder: 'ví dụ: Uống 2L nước, Đọc sách...',
            trackerTypeLabel: 'Kiểu theo dõi',
            typeCheckbox: 'Checkbox',
            typeCheckboxSub: 'Hoàn thành Có / Không',
            typeNumeric: 'Số lượng',
            typeNumericSub: 'Nhập chỉ tiêu theo số',
            targetAmount: 'Chỉ tiêu mỗi ngày',
            unitLabel: 'Đơn vị đo',
            unitPlaceholder: 'ml, trang, cái...',
            iconLabel: 'Biểu tượng',
            colorTagLabel: 'Màu nhận diện',
            confirmDeleteHabit: 'Bạn có chắc chắn muốn xóa thói quen này?',
            yourXpBalance: 'Điểm XP hiện có',
            shopDesc: 'Dùng điểm kỷ luật đã tích lũy để tự thưởng cho bản thân!',
            addCustomReward: 'Thêm phần thưởng mới',
            rewardTitlePlaceholder: 'ví dụ: 1 cốc trà sữa, Xem 1 tập phim...',
            disciplineIntro: 'Tự cam kết kỷ luật: Khi bỏ lỡ thói quen trong ngày, bạn có thể ghi nhận tiền phạt vào quỹ tiết kiệm hoặc làm một thử thách rèn luyện!',
            disciplinePledgeLabel: 'Mức phạt cam kết mỗi lần vi phạm',
            penaltyHistory: 'Lịch sử vi phạm kỷ luật',
            clearHistory: 'Xóa lịch sử',
            perfectDayToast: '🎉 Ngày hoàn hảo! Bạn đã hoàn thành 100% thói quen hôm nay (+50 XP Bonus)!',
            habitCompletedToast: '+10 XP! Hoàn thành thói quen: {title}',
            redeemSuccess: '🎉 Đã đổi thưởng: {title} (-{xp} XP). Hãy tận hưởng nhé!',
            notEnoughXp: 'Bạn chưa đủ điểm XP để đổi phần thưởng này!'
        },
        en: {
            mode: 'Mode', mode30: '30 min', mode30Detail: "25' work + 5' rest",
            mode50: '50 min', mode50Detail: "40' work + 10' rest", reps: 'Reps',
            ready: 'Ready', start: '▶ Start', pause: '⏸ Pause',
            resume: '▶ Resume', completed: '🎉 Completed!',
            working: '🔥 Working', breaking: '☕ Break',
            history: '📊 History', noHistory: 'No history yet',
            addTaskPlaceholder: 'Add new task...', addBtn: '+ Add',
            startDate: 'Start:', endDate: 'End:',
            from: 'From', to: 'To',
            todayBadge: 'Today', overdueBadge: 'Overdue',
            subtasksCount: 'subtasks', addSubtaskPlaceholder: 'Add subtask...',
            addSubtaskBtn: '+',
            editTask: 'Edit task',
            doubleClickToEdit: 'Double-click or click ✎ to edit',
            taskTitleLabel: 'Task Title:',
            taskTitlePlaceholder: 'Enter task title...',
            taskUpdatedToast: 'Task title updated! ✏️',
            setTaskDates: 'Task Dates',
            setTaskDatesAndReminder: 'Task Dates & Reminder',
            enableTaskReminder: 'Enable task reminder',
            clearDates: 'Clear Dates',
            save: 'Save', addDate: '+ Date',
            confirmModalTitle: 'Confirm Delete', confirmDelete: 'Delete',
            confirmDeleteTaskMsg: 'Are you sure you want to delete this task?',
            confirmDeleteSubtaskMsg: 'Are you sure you want to delete this subtask?',
            confirmDeleteNotesMsg: 'Are you sure you want to delete selected notes?',
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
            logout: 'Sign out', logoutConfirm: 'Are you sure you want to sign out?',
            goldPrices: 'DOJI Gold Prices', goldSJC: 'SJC Gold Bar', goldRing: 'Gold Ring',
            buyPrice: 'Buy', sellPrice: 'Sell', refresh: '🔄 Refresh',
            globalPrices: 'Global Commodities', worldGold: 'Gold (World)', crudeOil: 'Crude Oil (WTI)',
            or: 'or',
            installApp: 'Install App',
            installAppLogin: 'Install App to Mobile',
            installBannerTitle: 'Install FlowHub',
            installBannerDesc: 'Add to home screen for smooth, native mobile experience',
            installBtn: 'Install',
            pwaGuideTitle: 'Install FlowHub',
            pwaGuideIntro: 'To install FlowHub on your home screen:',
            iosStep1: 'Tap the <strong>Share</strong> button <span class="pwa-inline-icon">📤</span> in the browser toolbar.',
            iosStep2: 'Scroll down and tap <strong>"Add to Home Screen"</strong> <span class="pwa-inline-icon">➕</span>.',
            iosStep3: 'Tap <strong>"Add"</strong> in the top-right corner to complete.',
            desktopStep1: 'Click the Install icon <span class="pwa-inline-icon">⊕</span> or <span class="pwa-inline-icon">💻</span> in the address bar.',
            desktopStep2: 'Or open the browser menu <span class="pwa-inline-icon">⋮</span> -> select <strong>"Install FlowHub..."</strong>',
            desktopStep3: 'Confirm <strong>"Install"</strong> to launch FlowHub in a smooth standalone window.',
            pwaTip: 'FlowHub runs in full screen smoothly, works independently and saves data offline!',
            gotIt: 'Got it',
            installedToast: 'FlowHub installed successfully! 🎉',
            alreadyInstalledToast: 'FlowHub is already installed on your device! ✨',
            reminderTime: 'Time:',
            reminderFrequency: 'Repeat:',
            freqOnce: 'Once',
            freqDaily: 'Daily',
            freqWeekly: 'Weekly',
            freqMonthly: 'Monthly',
            notificationNotice: 'Permission required to receive reminders on phone / PC',
            enableNotification: 'Enable notifications',
            taskReminderAlertTitle: '⏰ Task Reminder',
            reminderToast: '⏰ Reminder: {title}',
            taskReminderDue: 'Task Due',
            completeTask: '✓ Complete',
            taskCompletedToast: 'Task completed! 🎉',
            reminderStageBeforeTitle: '⏰ Task due soon (5 min left)',
            reminderStageBeforeToast: '⏰ 5 minutes until task: {title}',
            reminderStageBeforeBadge: 'Upcoming (5m)',
            reminderStageDueTitle: '🔔 Task due now',
            reminderStageDueToast: '🔔 Task due now: {title}',
            reminderStageDueBadge: 'Due now',
            reminderStageLateTitle: '⚠️ Task overdue by 5 minutes',
            reminderStageLateToast: '⚠️ Task overdue by 5 minutes: {title}',
            reminderStageLateBadge: '5 min overdue',
            snooze5m: '⏰ Snooze 5m',
            dismiss: 'Got it (Dismiss)',
            snoozedToast: 'Reminder snoozed for 5 minutes',
            reminderSetSuccessToast: '⏰ Deadline set: "{title}" (Due: {time})',
            reminderSetSuccessTitle: '⏰ Task deadline set',
            dueTimeLabel: 'Due time',
            batteryTipLink: 'Tip: Reliable notifications when screen is off',
            batteryGuideTitle: '⚡ Reliable Notifications When Screen Is Off',
            batteryGuideIntro: 'Android OS enables "Battery Optimization" by default. After a few minutes of screen-off, the OS freezes background apps, delaying or muting task alarms.',
            batteryStep1Title: 'Open App Info',
            batteryStep1Desc: 'Long press FlowHub (or Chrome) icon on home screen ➔ Tap App Info (ⓘ).',
            batteryStep2Title: 'Set Battery to "Unrestricted"',
            batteryStep2Desc: 'Go to Battery ➔ Select "Unrestricted" instead of "Optimized".',
            batteryStep3Title: 'Allow on Lock Screen',
            batteryStep3Desc: 'Go to Notifications ➔ Ensure "Allow on Lock Screen" and "Sound & Vibration" are enabled.',
            batteryGuideTipNote: 'Once configured, task reminders will ring and wake your screen on time even when your phone is locked!',
            batteryGuideGotIt: '✓ Got it, all set',

            // Habit Tracker
            habitsTab: 'Habits',
            currentStreak: 'Current Streak',
            daysUnit: 'days',
            habitRank1: 'Discipline Novice',
            habitRank2: 'Persistent Warrior',
            habitRank3: 'Habit Master',
            habitRank4: 'Discipline Grandmaster',
            habitShop: 'Rewards Shop',
            habitBadges: 'Badges',
            habitDiscipline: 'Discipline Fund',
            todayQuick: 'Today',
            initMonthTable: 'Init Month Table',
            manageHabits: 'Manage',
            addHabit: 'Add Habit',
            editHabit: 'Edit Habit',
            emptyHabitTitle: 'No habits yet',
            emptyHabitDesc: 'Click "+ Add Habit" to start building self-discipline today!',
            addFirstHabit: 'Create your first habit',
            habitNameLabel: 'Habit Name',
            habitNamePlaceholder: 'e.g., Drink 2L water, Read 20 pages...',
            trackerTypeLabel: 'Tracker Type',
            typeCheckbox: 'Checkbox',
            typeCheckboxSub: 'Done Yes / No',
            typeNumeric: 'Numeric',
            typeNumericSub: 'Track by quantity & target',
            targetAmount: 'Daily Target',
            unitLabel: 'Unit',
            unitPlaceholder: 'ml, pages, reps...',
            iconLabel: 'Icon',
            colorTagLabel: 'Color Tag',
            confirmDeleteHabit: 'Are you sure you want to delete this habit?',
            yourXpBalance: 'Current XP Balance',
            shopDesc: 'Spend earned discipline XP to reward yourself!',
            addCustomReward: 'Add New Reward',
            rewardTitlePlaceholder: 'e.g., 1 Boba Tea, 1 Netflix episode...',
            disciplineIntro: 'Self-discipline commitment: When missing habits, pledge penalty money to savings or do a workout challenge!',
            disciplinePledgeLabel: 'Pledged penalty per missed habit',
            penaltyHistory: 'Penalty History',
            clearHistory: 'Clear History',
            perfectDayToast: '🎉 Perfect Day! You completed 100% of habits today (+50 XP Bonus)!',
            habitCompletedToast: '+10 XP! Completed habit: {title}',
            redeemSuccess: '🎉 Redeemed: {title} (-{xp} XP). Enjoy!',
            notEnoughXp: 'Not enough XP to redeem this reward!'
        }
    };

    // ===== I18N MANAGER =====
    var currentLang = localStorage.getItem('app_language') || 'vi';

    function t(key) {
        return (LANG[currentLang] && LANG[currentLang][key]) || LANG['vi'][key] || key;
    }

    function applyI18nToDOM() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var val = t(el.getAttribute('data-i18n'));
            if (val.indexOf('<') !== -1) {
                el.innerHTML = val;
            } else {
                el.textContent = val;
            }
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

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        if (dateStr.indexOf('T') !== -1) {
            var dtParts = dateStr.split('T');
            var dParts = dtParts[0].split('-');
            var timePart = dtParts[1] ? dtParts[1].substring(0, 5) : '';
            var dFormatted = '';
            if (dParts.length === 3) {
                dFormatted = currentLang === 'vi' ? (dParts[2] + '/' + dParts[1]) : (dParts[1] + '/' + dParts[2]);
            } else {
                dFormatted = dtParts[0];
            }
            return timePart ? (dFormatted + ' ' + timePart) : dFormatted;
        }
        var parts = dateStr.split('-');
        if (parts.length === 3) {
            return currentLang === 'vi' ? (parts[2] + '/' + parts[1]) : (parts[1] + '/' + parts[2]);
        }
        return dateStr;
    }

    function formatDateTimeLocal(d) {
        var pad = function (n) { return String(n).padStart(2, '0'); };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function playChime() {
        try {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            var ctx = new Ctx();
            var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach(function (freq, index) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                var startTime = ctx.currentTime + index * 0.12;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.36);
            });
        } catch (e) { /* ignore */ }
    }

    function showSystemNotification(title, body, actions, data) {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        var defaultActions = [
            { action: 'complete', title: t('completeTask') || '✓ Hoàn thành' },
            { action: 'snooze', title: t('snooze5m') || '⏰ Báo lại 5p' }
        ];

        var notifActions = (actions !== undefined) ? actions : defaultActions;
        var tagKey = (data && data.taskId) ? ('flowhub-task-' + data.taskId + '-' + (data.stage || 'alert')) : ('flowhub-reminder-' + Date.now());

        var options = {
            body: body,
            icon: 'icon.svg',
            badge: 'icon.svg',
            vibrate: [300, 100, 300, 100, 400],
            tag: tagKey,
            renotify: true,
            requireInteraction: true,
            data: data || {}
        };

        if (Array.isArray(notifActions) && notifActions.length > 0) {
            options.actions = notifActions;
        }

        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(function (reg) {
                reg.showNotification(title, options);
            }).catch(function () {
                try {
                    new Notification(title, options);
                } catch (e) {}
            });
        } else {
            try {
                new Notification(title, options);
            } catch (e) {}
        }
    }

    // ===== CONFIRM MODAL MANAGER =====
    var confirmCallback = null;
    var confirmOverlay = null;

    function initConfirmModal() {
        confirmOverlay = document.getElementById('confirm-modal-overlay');
        if (!confirmOverlay) return;
        var cancelBtn = document.getElementById('confirm-modal-cancel');
        var okBtn = document.getElementById('confirm-modal-ok');

        cancelBtn.addEventListener('click', function () {
            closeConfirmModal();
        });

        confirmOverlay.addEventListener('click', function (e) {
            if (e.target === confirmOverlay) closeConfirmModal();
        });

        okBtn.addEventListener('click', function () {
            var cb = confirmCallback;
            closeConfirmModal();
            if (typeof cb === 'function') cb();
        });
    }

    function showConfirmModal(opts) {
        if (!confirmOverlay) initConfirmModal();
        if (!confirmOverlay) return;
        var titleEl = document.getElementById('confirm-modal-title');
        var messageEl = document.getElementById('confirm-modal-message');
        var okBtn = document.getElementById('confirm-modal-ok');

        if (titleEl) titleEl.textContent = opts.title || t('confirmModalTitle');
        if (messageEl) messageEl.textContent = opts.message || t('confirmDeleteTaskMsg');
        if (okBtn) okBtn.textContent = opts.confirmText || t('confirmDelete');

        confirmCallback = opts.onConfirm;
        confirmOverlay.classList.add('active');
    }

    function closeConfirmModal() {
        if (confirmOverlay) confirmOverlay.classList.remove('active');
        confirmCallback = null;
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
            if (window.confirm(t('logoutConfirm'))) {
                auth.signOut();
            }
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
        if (window.__habitApp) window.__habitApp._loadData();
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
        this.endTime = null;

        this._cacheElements(); this._bindEvents();
        this._loadHistory();
        this._restoreSession();
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

    PomodoroTimer.prototype._saveSession = function () {
        if (!this.isRunning && !this.isPaused) {
            localStorage.removeItem('flowhub_pomodoro_session');
            return;
        }
        var session = {
            mode: this.mode,
            totalReps: this.totalReps,
            currentRep: this.currentRep,
            isWorking: this.isWorking,
            totalTime: this.totalTime,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            timeRemaining: this.timeRemaining,
            endTime: this.endTime,
            pausedRemaining: this.isPaused ? this.timeRemaining : null
        };
        localStorage.setItem('flowhub_pomodoro_session', JSON.stringify(session));
    };

    PomodoroTimer.prototype._clearSession = function () {
        localStorage.removeItem('flowhub_pomodoro_session');
    };

    PomodoroTimer.prototype._restoreSession = function () {
        try {
            var raw = localStorage.getItem('flowhub_pomodoro_session');
            if (!raw) return;
            var s = JSON.parse(raw);
            if (!s) return;

            this.mode = s.mode || '30';
            this.totalReps = s.totalReps || 3;
            this.currentRep = s.currentRep || 1;
            this.isWorking = (s.isWorking !== undefined) ? s.isWorking : true;
            this.totalTime = s.totalTime || (this.isWorking ? MODES[this.mode].work : MODES[this.mode].break);

            // Cập nhật giao diện nút mode
            var self = this;
            document.querySelectorAll('.mode-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-mode') === self.mode);
            });
            if (this.repCountEl) this.repCountEl.textContent = this.totalReps;

            // Cập nhật giao diện Work vs Break
            if (!this.isWorking) {
                this.ringEl.classList.add('break-mode');
                this.timerCard.classList.add('break-active');
            } else {
                this.ringEl.classList.remove('break-mode');
                this.timerCard.classList.remove('break-active');
            }

            if (s.isPaused) {
                // Khôi phục trạng thái tạm dừng
                this.isRunning = true;
                this.isPaused = true;
                this.timeRemaining = s.pausedRemaining || s.timeRemaining || this.totalTime;
                this.startBtn.textContent = t('resume');
                this.resetBtn.disabled = false;
                this.timerCard.classList.remove('running');
                this._setLockedUI(true);
                this._updateStatus();
            } else if (s.isRunning && s.endTime) {
                var now = Date.now();
                var diff = Math.round((s.endTime - now) / 1000);

                if (diff > 0) {
                    // Phiên hiện tại vẫn chưa kết thúc -> khôi phục tiếp tục đếm
                    this.isRunning = true;
                    this.isPaused = false;
                    this.timeRemaining = diff;
                    this.endTime = s.endTime;
                    this.resetBtn.disabled = false;
                    this.startBtn.textContent = t('pause');
                    this.timerCard.classList.add('running');
                    this._setLockedUI(true);
                    this._updateStatus();

                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(function () { self._tick(); }, 1000);
                } else {
                    // Thời gian trôi qua trong lúc đóng tab/refresh đã vượt quá phiên hiện tại
                    this._advanceElapsedSession(s, Math.abs(diff));
                }
            }
        } catch (e) {
            console.warn('Pomodoro session restore error:', e);
            localStorage.removeItem('flowhub_pomodoro_session');
        }
    };

    PomodoroTimer.prototype._advanceElapsedSession = function (s, elapsedPast) {
        var isWork = s.isWorking;
        var curRep = s.currentRep;
        var totalR = s.totalReps;
        var modeVal = s.mode;
        var remainingOver = elapsedPast;
        var self = this;

        while (true) {
            if (isWork) {
                // Hết phiên làm việc -> chuyển sang phiên nghỉ ngơi
                isWork = false;
                var breakTime = MODES[modeVal].break;
                if (remainingOver < breakTime) {
                    this.isRunning = true;
                    this.isPaused = false;
                    this.isWorking = false;
                    this.currentRep = curRep;
                    this.totalTime = breakTime;
                    this.timeRemaining = breakTime - remainingOver;
                    this.endTime = Date.now() + this.timeRemaining * 1000;
                    this.ringEl.classList.add('break-mode');
                    this.timerCard.classList.add('break-active');
                    this.timerCard.classList.add('running');
                    this.startBtn.textContent = t('pause');
                    this.resetBtn.disabled = false;
                    this._setLockedUI(true);
                    this._updateStatus();
                    this._saveSession();

                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(function () { self._tick(); }, 1000);
                    return;
                } else {
                    remainingOver -= breakTime;
                }
            } else {
                // Hết phiên nghỉ ngơi -> chuyển sang rep tiếp theo hoặc hoàn thành
                if (curRep < totalR) {
                    curRep++;
                    isWork = true;
                    var workTime = MODES[modeVal].work;
                    if (remainingOver < workTime) {
                        this.isRunning = true;
                        this.isPaused = false;
                        this.isWorking = true;
                        this.currentRep = curRep;
                        this.totalTime = workTime;
                        this.timeRemaining = workTime - remainingOver;
                        this.endTime = Date.now() + this.timeRemaining * 1000;
                        this.ringEl.classList.remove('break-mode');
                        this.timerCard.classList.remove('break-active');
                        this.timerCard.classList.add('running');
                        this.startBtn.textContent = t('pause');
                        this.resetBtn.disabled = false;
                        this._setLockedUI(true);
                        this._updateStatus();
                        this._saveSession();

                        if (this.intervalId) clearInterval(this.intervalId);
                        this.intervalId = setInterval(function () { self._tick(); }, 1000);
                        return;
                    } else {
                        remainingOver -= workTime;
                    }
                } else {
                    // Đã hoàn thành toàn bộ chu kỳ
                    this._clearSession();
                    this.currentRep = totalR;
                    this._onAllComplete();
                    return;
                }
            }
        }
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
        this.isRunning = true;
        this.isPaused = false;
        this.endTime = Date.now() + this.timeRemaining * 1000;
        this.resetBtn.disabled = false;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this._updateStatus();
        this._setLockedUI(true);
        this._saveSession();

        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };

    PomodoroTimer.prototype._pause = function () {
        this.isPaused = true;
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.endTime) {
            this.timeRemaining = Math.max(0, Math.round((this.endTime - Date.now()) / 1000));
        }
        this.startBtn.textContent = t('resume');
        this.timerCard.classList.remove('running');
        this._saveSession();
    };

    PomodoroTimer.prototype._resume = function () {
        var self = this;
        this.isPaused = false;
        this.endTime = Date.now() + this.timeRemaining * 1000;
        this.startBtn.textContent = t('pause');
        this.timerCard.classList.add('running');
        this._saveSession();

        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(function () { self._tick(); }, 1000);
    };

    PomodoroTimer.prototype._reset = function () {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.endTime = null;
        this.currentRep = 1;
        this.isWorking = true;
        this.timeRemaining = MODES[this.mode].work;
        this.totalTime = MODES[this.mode].work;
        this.startBtn.textContent = t('start');
        this.resetBtn.disabled = true;
        this.statusEl.textContent = t('ready');
        this.statusEl.className = 'timer-status';
        this.timerCard.classList.remove('running', 'break-active');
        this.ringEl.classList.remove('break-mode');
        this._setLockedUI(false);
        this._clearSession();
        this._updateDisplay();
    };

    PomodoroTimer.prototype._tick = function () {
        if (this.endTime) {
            this.timeRemaining = Math.max(0, Math.round((this.endTime - Date.now()) / 1000));
        } else {
            this.timeRemaining--;
        }

        if (this.timeRemaining <= 0) {
            this._onPhaseComplete();
        } else {
            this._updateDisplay();
            // Lưu session định kỳ mỗi 5s để giảm I/O
            if (this.timeRemaining % 5 === 0) {
                this._saveSession();
            }
        }
    };

    PomodoroTimer.prototype._onPhaseComplete = function () {
        if (this.isWorking) {
            playBeep(600, 200, 2);
            this.isWorking = false;
            this.timeRemaining = MODES[this.mode].break;
            this.totalTime = MODES[this.mode].break;
            this.endTime = Date.now() + this.timeRemaining * 1000;
            this.ringEl.classList.add('break-mode');
            this.timerCard.classList.add('break-active');
        } else {
            this.ringEl.classList.remove('break-mode');
            this.timerCard.classList.remove('break-active');
            if (this.currentRep < this.totalReps) {
                playBeep(800, 200, 2);
                this.currentRep++;
                this.isWorking = true;
                this.timeRemaining = MODES[this.mode].work;
                this.totalTime = MODES[this.mode].work;
                this.endTime = Date.now() + this.timeRemaining * 1000;
            } else {
                playBeep(1000, 300, 4);
                this._onAllComplete();
                return;
            }
        }
        this._updateStatus();
        this._updateDisplay();
        this._saveSession();
    };

    PomodoroTimer.prototype._onAllComplete = function () {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.endTime = null;
        this.statusEl.textContent = t('completed');
        this.statusEl.className = 'timer-status completed';
        this.startBtn.textContent = t('start');
        this.resetBtn.disabled = false;
        this.timerCard.classList.remove('running');
        this._setLockedUI(false);
        this._clearSession();
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
        this.tasks = [];
        this.filter = 'all';
        this.expandedTaskIds = new Set();
        this.editingDateTaskId = null;
        this.editingTaskId = null;
        this.activeAlertTaskId = null;
        this._exactTimer = null;
        this._cacheElements();
        this._bindEvents();
        this._loadTasks();
        this._startScheduler();
    }

    TodoList.prototype._cacheElements = function () {
        this.inputEl = document.getElementById('todo-input');
        this.dateToggleBtn = document.getElementById('todo-date-toggle-btn');
        this.datesPickerRow = document.getElementById('todo-dates-picker-row');
        this.startDateEl = document.getElementById('todo-start-date');
        this.endDateEl = document.getElementById('todo-end-date');
        this.dateClearBtn = document.getElementById('todo-date-clear-btn');
        this.listEl = document.getElementById('todo-list');
        this.statsEl = document.getElementById('todo-stats');

        // Date & Reminder edit modal elements
        this.dateModalOverlay = document.getElementById('todo-date-modal-overlay');
        this.dateModalTaskTitle = document.getElementById('todo-date-modal-task-title');
        this.modalTaskTitleInput = document.getElementById('modal-task-title-input');
        this.modalStartDate = document.getElementById('modal-task-start-date');
        this.modalEndDate = document.getElementById('modal-task-end-date');
        this.modalReminderEnable = document.getElementById('modal-task-reminder-enable');
        this.modalReminderFields = document.getElementById('todo-reminder-fields');
        this.modalReminderFreq = document.getElementById('modal-task-reminder-frequency');
        this.modalPermissionNotice = document.getElementById('todo-permission-notice');
        this.modalPermissionBtn = document.getElementById('todo-permission-request-btn');
        this.modalDateSaveBtn = document.getElementById('modal-task-date-save');
        this.modalDateCancelBtn = document.getElementById('modal-task-date-cancel');
        this.modalDateClearBtn = document.getElementById('modal-task-date-clear');
        this.modalDateCloseBtn = document.getElementById('todo-date-modal-close');

        // Reminder Alert Popup elements
        this.alertModal = document.getElementById('reminder-alert-modal');
        this.alertTitle = document.getElementById('reminder-alert-title');
        this.alertTime = document.getElementById('reminder-alert-time');
        this.alertStageBadge = document.getElementById('reminder-alert-stage-badge');
        this.alertFreq = document.getElementById('reminder-alert-freq');
        this.alertContent = document.getElementById('reminder-alert-content');
        this.alertCompleteBtn = document.getElementById('reminder-alert-complete');
        this.alertSnoozeBtn = document.getElementById('reminder-alert-snooze');
        this.alertDismissBtn = document.getElementById('reminder-alert-dismiss');
    };

    TodoList.prototype._bindEvents = function () {
        var self = this;
        document.getElementById('btn-add-todo').addEventListener('click', function () { self._addTask(); });
        this.inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._addTask(); });

        if (this.dateToggleBtn) {
            this.dateToggleBtn.addEventListener('click', function () {
                var isHidden = self.datesPickerRow.style.display === 'none';
                self.datesPickerRow.style.display = isHidden ? 'flex' : 'none';
                self.dateToggleBtn.classList.toggle('active', isHidden);
            });
        }

        if (this.dateClearBtn) {
            this.dateClearBtn.addEventListener('click', function () {
                if (self.startDateEl) self.startDateEl.value = '';
                if (self.endDateEl) self.endDateEl.value = '';
            });
        }

        // Date modal events
        if (this.modalDateCloseBtn) this.modalDateCloseBtn.addEventListener('click', function () { self.closeDateModal(); });
        if (this.modalDateCancelBtn) this.modalDateCancelBtn.addEventListener('click', function () { self.closeDateModal(); });
        if (this.dateModalOverlay) {
            this.dateModalOverlay.addEventListener('click', function (e) {
                if (e.target === self.dateModalOverlay) self.closeDateModal();
            });
        }
        if (this.modalDateSaveBtn) this.modalDateSaveBtn.addEventListener('click', function () { self.saveDateFromModal(); });
        if (this.modalDateClearBtn) this.modalDateClearBtn.addEventListener('click', function () { self.clearDateFromModal(); });
        var modalTitleInput = document.getElementById('modal-task-title-input') || this.modalTaskTitleInput;
        if (modalTitleInput) {
            modalTitleInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.saveDateFromModal();
                }
            });
        }

        // Reminder toggle inside date modal
        if (this.modalReminderEnable) {
            this.modalReminderEnable.addEventListener('change', function () {
                var isChecked = self.modalReminderEnable.checked;
                if (self.modalReminderFields) self.modalReminderFields.style.display = isChecked ? 'flex' : 'none';
                if (isChecked && 'Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().then(function () {
                        self._checkPermissionUI();
                    }).catch(function () {});
                }
                self._checkPermissionUI();
            });
        }

        if (this.modalPermissionBtn) {
            this.modalPermissionBtn.addEventListener('click', function () {
                if ('Notification' in window) {
                    Notification.requestPermission().then(function () {
                        self._checkPermissionUI();
                    }).catch(function () {});
                }
            });
        }

        // Reminder Alert Popup events
        if (this.alertCompleteBtn) {
            this.alertCompleteBtn.addEventListener('click', function () {
                self._completeActiveTask();
            });
        }
        if (this.alertDismissBtn) {
            this.alertDismissBtn.addEventListener('click', function () {
                self._dismissActiveReminder();
            });
        }
        if (this.alertSnoozeBtn) {
            this.alertSnoozeBtn.addEventListener('click', function () {
                self._snoozeActiveReminder(5);
            });
        }
        if (this.alertModal) {
            this.alertModal.addEventListener('click', function (e) {
                if (e.target === self.alertModal) {
                    self._dismissActiveReminder();
                }
            });
        }

        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                self.filter = btn.getAttribute('data-filter');
                self._render();
            });
        });

        // Delegate clicks on listEl
        this.listEl.addEventListener('click', function (e) {
            var target = e.target.closest('[data-action]');
            if (!target) return;
            var action = target.getAttribute('data-action');
            var taskId = target.getAttribute('data-task-id');
            var subtaskId = target.getAttribute('data-subtask-id');

            if (action === 'delete-task' && taskId) {
                self.deleteTask(taskId);
            } else if (action === 'edit-task' && taskId) {
                self.startEditTask(taskId);
            } else if (action === 'save-edit-task' && taskId) {
                self.saveEditTask(taskId);
            } else if (action === 'cancel-edit-task') {
                self.cancelEditTask();
            } else if (action === 'toggle-subtasks' && taskId) {
                self.toggleSubtasksView(taskId);
            } else if (action === 'edit-dates' && taskId) {
                self.openDateModal(taskId);
            } else if (action === 'add-subtask' && taskId) {
                var input = document.getElementById('subtask-input-' + taskId);
                if (input && input.value.trim()) {
                    self.addSubtask(taskId, input.value.trim());
                    input.value = '';
                }
            } else if (action === 'delete-subtask' && taskId && subtaskId) {
                self.deleteSubtask(taskId, subtaskId);
            }
        });

        // Delegate double click on task text to edit
        this.listEl.addEventListener('dblclick', function (e) {
            var textEl = e.target.closest('.todo-text');
            if (textEl) {
                var taskId = textEl.getAttribute('data-task-id');
                if (taskId) self.startEditTask(taskId);
            }
        });

        // Delegate checkbox changes on listEl
        this.listEl.addEventListener('change', function (e) {
            var target = e.target;
            var action = target.getAttribute('data-action');
            var taskId = target.getAttribute('data-task-id');
            var subtaskId = target.getAttribute('data-subtask-id');

            if (action === 'toggle-task' && taskId) {
                self.toggleTask(taskId);
            } else if (action === 'toggle-subtask' && taskId && subtaskId) {
                self.toggleSubtask(taskId, subtaskId);
            }
        });

        // Delegate keydown on edit input and subtask inputs
        this.listEl.addEventListener('keydown', function (e) {
            if (e.target.classList.contains('todo-edit-input')) {
                var taskId = e.target.getAttribute('data-task-id');
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.saveEditTask(taskId);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    self.cancelEditTask();
                }
            } else if (e.key === 'Enter' && e.target.classList.contains('subtask-add-input')) {
                var sTaskId = e.target.getAttribute('data-task-id');
                if (sTaskId && e.target.value.trim()) {
                    self.addSubtask(sTaskId, e.target.value.trim());
                    e.target.value = '';
                }
            }
        });

        // Delegate focusout on edit input to auto-save
        this.listEl.addEventListener('focusout', function (e) {
            if (e.target.classList.contains('todo-edit-input')) {
                var taskId = e.target.getAttribute('data-task-id');
                var related = e.relatedTarget;
                if (related && (related.getAttribute('data-action') === 'cancel-edit-task' || related.getAttribute('data-action') === 'save-edit-task')) {
                    return;
                }
                setTimeout(function () {
                    if (self.editingTaskId === taskId) {
                        self.saveEditTask(taskId);
                    }
                }, 200);
            }
        });
    };

    TodoList.prototype._checkPermissionUI = function () {
        if (!this.modalPermissionNotice) return;
        if (!('Notification' in window)) {
            this.modalPermissionNotice.style.display = 'none';
            return;
        }
        if (Notification.permission === 'granted') {
            this.modalPermissionNotice.style.display = 'none';
        } else {
            this.modalPermissionNotice.style.display = (this.modalReminderEnable && this.modalReminderEnable.checked) ? 'flex' : 'none';
        }
    };

    TodoList.prototype.openDateModal = function (taskId) {
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (!task) return;
        this.editingDateTaskId = taskId;
        var titleEl = document.getElementById('modal-task-title-input') || this.modalTaskTitleInput;
        if (titleEl) {
            titleEl.value = task.text || '';
        }
        if (this.dateModalTaskTitle) this.dateModalTaskTitle.textContent = task.text || '';
        if (this.modalStartDate) this.modalStartDate.value = task.startDate || '';
        if (this.modalEndDate) this.modalEndDate.value = task.endDate || '';

        var hasReminder = !!(task.reminder && task.reminder.enabled);
        if (this.modalReminderEnable) this.modalReminderEnable.checked = hasReminder;
        if (this.modalReminderFields) this.modalReminderFields.style.display = hasReminder ? 'flex' : 'none';
        if (this.modalReminderFreq) this.modalReminderFreq.value = (task.reminder && task.reminder.frequency) || 'once';
        this._checkPermissionUI();
        if (this.dateModalOverlay) this.dateModalOverlay.classList.add('active');
    };

    TodoList.prototype.closeDateModal = function () {
        if (this.dateModalOverlay) this.dateModalOverlay.classList.remove('active');
        this.editingDateTaskId = null;
    };

    TodoList.prototype.saveDateFromModal = function () {
        if (!this.editingDateTaskId) return;
        var self = this;
        var task = this.tasks.find(function (t) { return t.id === self.editingDateTaskId; });
        if (task) {
            var titleEl = document.getElementById('modal-task-title-input') || this.modalTaskTitleInput;
            var updatedTitle = titleEl ? titleEl.value.trim() : '';
            var titleChanged = false;
            if (updatedTitle && updatedTitle !== task.text) {
                task.text = updatedTitle;
                titleChanged = true;
            }
            task.startDate = this.modalStartDate ? this.modalStartDate.value : (document.getElementById('modal-task-start-date') ? document.getElementById('modal-task-start-date').value : '');
            task.endDate = this.modalEndDate ? this.modalEndDate.value : (document.getElementById('modal-task-end-date') ? document.getElementById('modal-task-end-date').value : '');

            var isReminder = this.modalReminderEnable && this.modalReminderEnable.checked;
            if (isReminder) {
                var freq = (this.modalReminderFreq && this.modalReminderFreq.value) || 'once';
                var initialDt = '';
                if (freq !== 'once' && task.startDate) {
                    initialDt = task.startDate;
                } else {
                    initialDt = task.endDate || task.startDate || '';
                }
                if (initialDt && initialDt.indexOf('T') === -1) {
                    initialDt += 'T09:00';
                }

                var targetMs = initialDt ? new Date(initialDt).getTime() : NaN;
                var nowMs = Date.now();
                var initStage = 0;
                if (!isNaN(targetMs)) {
                    if (nowMs >= targetMs) initStage = 2;
                    else if (nowMs >= targetMs - 5 * 60 * 1000) initStage = 1;
                    else initStage = 0;
                }

                if (task.reminder && task.reminder.datetime === initialDt && typeof task.reminder.stage === 'number') {
                    initStage = task.reminder.stage;
                }

                task.reminder = {
                    enabled: true,
                    datetime: initialDt,
                    frequency: freq,
                    stage: initStage,
                    dismissed: false,
                    completed: false,
                    lastTriggered: null
                };

                if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().catch(function () {});
                }
            } else {
                task.reminder = null;
            }

            this._saveTasks();
            this._render();
            this._scheduleNextTimer();

            if (titleChanged && typeof PwaManager !== 'undefined' && PwaManager.showToast) {
                PwaManager.showToast(t('taskUpdatedToast') || 'Đã cập nhật tên công việc! ✏️', '✏️');
            } else if (task.endDate || task.startDate || (task.reminder && task.reminder.datetime)) {
                self._notifyDateSet(task);
            }
        }
        this.closeDateModal();
    };

    TodoList.prototype._notifyDateSet = function (task) {
        if (!task) return;
        var endOrDt = task.endDate || (task.reminder && task.reminder.datetime) || task.startDate;
        if (!endOrDt) return;

        var displayTime = '';
        var labelPrefix = '';
        if (task.startDate && task.endDate) {
            displayTime = formatDisplayDate(task.startDate) + ' - ' + formatDisplayDate(task.endDate);
            labelPrefix = t('dueTimeLabel');
        } else if (task.endDate) {
            displayTime = formatDisplayDate(task.endDate);
            labelPrefix = t('dueTimeLabel');
        } else {
            displayTime = formatDisplayDate(task.startDate);
            labelPrefix = t('from');
        }

        var toastMsg = t('reminderSetSuccessToast')
            .replace('{title}', task.text)
            .replace('{time}', labelPrefix + ' ' + displayTime);
        var notifTitle = t('reminderSetSuccessTitle') + ': ' + task.text;
        var notifBody = labelPrefix + ': ' + displayTime;

        playChime();

        if (typeof PwaManager !== 'undefined' && PwaManager.showToast) {
            PwaManager.showToast(toastMsg, '⏰');
        }

        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                showSystemNotification(notifTitle, notifBody);
            } else if (Notification.permission === 'default') {
                Notification.requestPermission().then(function (perm) {
                    if (perm === 'granted') {
                        showSystemNotification(notifTitle, notifBody);
                    }
                }).catch(function () {});
            }
        }
    };

    TodoList.prototype.clearDateFromModal = function () {
        if (!this.editingDateTaskId) return;
        var self = this;
        var task = this.tasks.find(function (t) { return t.id === self.editingDateTaskId; });
        if (task) {
            task.startDate = '';
            task.endDate = '';
            task.reminder = null;
            this._saveTasks();
            this._render();
            this._scheduleNextTimer();
        }
        this.closeDateModal();
    };

    TodoList.prototype._addTask = function () {
        var text = this.inputEl.value.trim();
        if (!text || !currentUser) return;

        var startDate = this.startDateEl ? this.startDateEl.value : '';
        var endDate = this.endDateEl ? this.endDateEl.value : '';

        var task = {
            id: generateId(),
            text: text,
            completed: false,
            startDate: startDate,
            endDate: endDate,
            reminder: null,
            subtasks: [],
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.inputEl.value = '';
        this.inputEl.focus();

        if (this.startDateEl) this.startDateEl.value = '';
        if (this.endDateEl) this.endDateEl.value = '';
        if (this.datesPickerRow) this.datesPickerRow.style.display = 'none';
        if (this.dateToggleBtn) this.dateToggleBtn.classList.remove('active');

        this._saveTasks();
        this._render();
        this._scheduleNextTimer();

        if (task.endDate || task.startDate) {
            this._notifyDateSet(task);
        }
    };

    TodoList.prototype.toggleTask = function (id) {
        var task = this.tasks.find(function (t) { return t.id === id; });
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                if (this.activeAlertTaskId === id) {
                    this._closeReminderAlertModal();
                }
                if (task.reminder) {
                    task.reminder.dismissed = true;
                    if (task.reminder.frequency === 'once') {
                        task.reminder.completed = true;
                    }
                }
            } else {
                if (task.reminder) {
                    task.reminder.completed = false;
                    task.reminder.dismissed = false;
                }
            }
            this._saveTasks();
            this._render();
            this._scheduleNextTimer();
        }
    };

    TodoList.prototype.deleteTask = function (id) {
        var self = this;
        showConfirmModal({
            title: t('confirmModalTitle'),
            message: t('confirmDeleteTaskMsg'),
            confirmText: t('confirmDelete'),
            onConfirm: function () {
                self.tasks = self.tasks.filter(function (t) { return t.id !== id; });
                self.expandedTaskIds.delete(id);
                if (self.activeAlertTaskId === id) {
                    self._closeReminderAlertModal();
                }
                self._saveTasks();
                self._render();
                self._scheduleNextTimer();
            }
        });
    };

    TodoList.prototype.startEditTask = function (id) {
        if (!id) return;
        this.editingTaskId = id;
        this._render();
    };

    TodoList.prototype.saveEditTask = function (id) {
        if (!id) return;
        var input = document.getElementById('todo-edit-input-' + id);
        var newTitle = input ? input.value.trim() : '';
        if (!newTitle) {
            this.cancelEditTask();
            return;
        }
        var task = this.tasks.find(function (t) { return t.id === id; });
        if (task) {
            if (task.text !== newTitle) {
                task.text = newTitle;
                this._saveTasks();
                if (typeof PwaManager !== 'undefined' && PwaManager.showToast) {
                    PwaManager.showToast(t('taskUpdatedToast'), '✏️');
                }
            }
        }
        this.editingTaskId = null;
        this._render();
    };

    TodoList.prototype.cancelEditTask = function () {
        this.editingTaskId = null;
        this._render();
    };

    TodoList.prototype.toggleSubtasksView = function (taskId) {
        if (this.expandedTaskIds.has(taskId)) {
            this.expandedTaskIds.delete(taskId);
        } else {
            this.expandedTaskIds.add(taskId);
        }
        this._render();
    };

    TodoList.prototype.addSubtask = function (taskId, text) {
        if (!text) return;
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (!task) return;
        if (!Array.isArray(task.subtasks)) task.subtasks = [];
        task.subtasks.push({
            id: generateId(),
            text: text,
            completed: false
        });
        this.expandedTaskIds.add(taskId);
        this._saveTasks();
        this._render();
    };

    TodoList.prototype.toggleSubtask = function (taskId, subtaskId) {
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (!task || !Array.isArray(task.subtasks)) return;
        var sub = task.subtasks.find(function (s) { return s.id === subtaskId; });
        if (sub) {
            sub.completed = !sub.completed;
            this._saveTasks();
            this._render();
        }
    };

    TodoList.prototype.deleteSubtask = function (taskId, subtaskId) {
        var self = this;
        showConfirmModal({
            title: t('confirmModalTitle'),
            message: t('confirmDeleteSubtaskMsg'),
            confirmText: t('confirmDelete'),
            onConfirm: function () {
                var task = self.tasks.find(function (t) { return t.id === taskId; });
                if (!task || !Array.isArray(task.subtasks)) return;
                task.subtasks = task.subtasks.filter(function (s) { return s.id !== subtaskId; });
                self._saveTasks();
                self._render();
            }
        });
    };

    TodoList.prototype._getFilteredTasks = function () {
        if (this.filter === 'completed') return this.tasks.filter(function (t) { return t.completed; });
        if (this.filter === 'in-progress') return this.tasks.filter(function (t) { return !t.completed; });
        return this.tasks;
    };

    TodoList.prototype._render = function () {
        var self = this;
        var filtered = this._getFilteredTasks();
        var total = this.tasks.length;
        var done = this.tasks.filter(function (t) { return t.completed; }).length;
        var today = getTodayStr();

        this.statsEl.textContent = t('statsTemplate').replace('{ip}', total - done).replace('{c}', done).replace('{t}', total);
        if (filtered.length === 0) {
            this.listEl.innerHTML = '<div class="todo-empty"><span class="empty-icon">📝</span><p>' + (total === 0 ? t('emptyTasks') : t('noMatch')) + '</p></div>';
            return;
        }

        var html = '';
        filtered.forEach(function (task) {
            var subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
            var totalSubs = subtasks.length;
            var doneSubs = subtasks.filter(function (s) { return s.completed; }).length;
            var isExpanded = self.expandedTaskIds.has(task.id);

            // Date & Reminder badge
            var dateBadgeHtml = '';
            if (task.startDate || task.endDate) {
                var dateStatusCls = '';
                var dateLabel = '';

                if (task.endDate && !task.completed) {
                    var endTarget = new Date(task.endDate.indexOf('T') !== -1 ? task.endDate : (task.endDate + 'T23:59:59')).getTime();
                    var now = Date.now();
                    var endDayStr = task.endDate.split('T')[0];
                    if (endTarget < now) {
                        dateStatusCls = ' overdue';
                    } else if (endDayStr === today) {
                        dateStatusCls = ' today';
                    }
                }

                if (task.startDate && task.endDate) {
                    dateLabel = formatDisplayDate(task.startDate) + ' - ' + formatDisplayDate(task.endDate);
                } else if (task.startDate) {
                    dateLabel = t('from') + ' ' + formatDisplayDate(task.startDate);
                } else if (task.endDate) {
                    dateLabel = t('to') + ' ' + formatDisplayDate(task.endDate);
                }

                var statusPrefix = '';
                if (dateStatusCls === ' overdue') statusPrefix = '⚠️ ' + t('overdueBadge') + ': ';
                else if (dateStatusCls === ' today') statusPrefix = '⏰ ' + t('todayBadge') + ': ';
                else statusPrefix = '📅 ';

                var reminderIcon = (task.reminder && task.reminder.enabled && !task.reminder.completed && !task.completed) ? ' 🔔' : '';
                dateBadgeHtml = '<span class="todo-date-badge' + dateStatusCls + '" data-action="edit-dates" data-task-id="' + task.id + '" title="' + t('setTaskDatesAndReminder') + '">' + statusPrefix + dateLabel + reminderIcon + ' ✎</span>';
            } else {
                dateBadgeHtml = '<span class="todo-date-badge empty" data-action="edit-dates" data-task-id="' + task.id + '" title="' + t('setTaskDatesAndReminder') + '">📅 ' + t('addDate') + '</span>';
            }

            // Subtask toggle button & count
            var subtasksToggleHtml = '';
            if (totalSubs > 0) {
                subtasksToggleHtml = '<button class="todo-subtasks-toggle" data-action="toggle-subtasks" data-task-id="' + task.id + '">' +
                    '📋 ' + doneSubs + '/' + totalSubs + ' ' + (isExpanded ? '▲' : '▼') + '</button>';
            } else {
                subtasksToggleHtml = '<button class="todo-subtasks-toggle empty" data-action="toggle-subtasks" data-task-id="' + task.id + '">' +
                    '📋 + ' + t('subtasksCount') + '</button>';
            }

            // Subtasks container
            var subtasksListHtml = '';
            subtasks.forEach(function (sub) {
                subtasksListHtml += '<div class="subtask-item' + (sub.completed ? ' completed' : '') + '">' +
                    '<input type="checkbox" class="subtask-checkbox"' + (sub.completed ? ' checked' : '') +
                    ' data-action="toggle-subtask" data-task-id="' + task.id + '" data-subtask-id="' + sub.id + '" />' +
                    '<span class="subtask-text">' + escapeHtml(sub.text) + '</span>' +
                    '<button class="subtask-delete" data-action="delete-subtask" data-task-id="' + task.id + '" data-subtask-id="' + sub.id + '" title="' + t('confirmDelete') + '">✕</button>' +
                    '</div>';
            });

            var subtasksContainerHtml = '<div class="todo-subtasks-container' + (isExpanded ? ' open' : '') + '">' +
                '<div class="subtask-list">' + subtasksListHtml + '</div>' +
                '<div class="subtask-add-row">' +
                '<input type="text" class="subtask-add-input" id="subtask-input-' + task.id + '" data-task-id="' + task.id + '" placeholder="' + t('addSubtaskPlaceholder') + '" autocomplete="off" />' +
                '<button class="subtask-add-btn" data-action="add-subtask" data-task-id="' + task.id + '">' + t('addSubtaskBtn') + '</button>' +
                '</div>' +
                '</div>';

            var isEditing = self.editingTaskId === task.id;
            var textOrInputHtml = '';
            if (isEditing) {
                textOrInputHtml = '<div class="todo-edit-row">' +
                    '<input type="text" class="todo-edit-input" id="todo-edit-input-' + task.id + '" data-task-id="' + task.id + '" value="' + escapeHtml(task.text) + '" placeholder="' + t('taskTitlePlaceholder') + '" autocomplete="off" />' +
                    '<div class="todo-edit-actions">' +
                    '<button type="button" class="todo-edit-save-btn" data-action="save-edit-task" data-task-id="' + task.id + '" title="' + t('save') + '">✓</button>' +
                    '<button type="button" class="todo-edit-cancel-btn" data-action="cancel-edit-task" data-task-id="' + task.id + '" title="' + t('cancel') + '">✕</button>' +
                    '</div>' +
                    '</div>';
            } else {
                textOrInputHtml = '<span class="todo-text" data-task-id="' + task.id + '" title="' + t('doubleClickToEdit') + '">' + escapeHtml(task.text) + '</span>';
            }

            html += '<div class="todo-item' + (task.completed ? ' completed' : '') + (isEditing ? ' editing' : '') + '" data-id="' + task.id + '">' +
                '<div class="todo-main-row">' +
                '<input type="checkbox" class="todo-checkbox"' + (task.completed ? ' checked' : '') + ' data-action="toggle-task" data-task-id="' + task.id + '" />' +
                '<div class="todo-content-col">' +
                textOrInputHtml +
                '<div class="todo-meta-row">' + dateBadgeHtml + subtasksToggleHtml + '</div>' +
                '</div>' +
                '<div class="todo-actions-wrap">' +
                '<button type="button" class="todo-edit-btn" data-action="edit-task" data-task-id="' + task.id + '" title="' + t('editTask') + '">✎</button>' +
                '<button type="button" class="todo-delete" data-action="delete-task" data-task-id="' + task.id + '" title="' + t('confirmDelete') + '">✕</button>' +
                '</div>' +
                '</div>' +
                subtasksContainerHtml +
                '</div>';
        });

        this.listEl.innerHTML = html;

        if (this.editingTaskId) {
            var activeInput = document.getElementById('todo-edit-input-' + this.editingTaskId);
            if (activeInput) {
                activeInput.focus();
                activeInput.select();
            }
        }
    };

    // Scheduler and high-precision reminder check for tasks
    TodoList.prototype._startScheduler = function () {
        var self = this;
        setTimeout(function () {
            self._checkReminders();
        }, 500);

        this._scheduleNextTimer();

        this.schedulerInterval = setInterval(function () {
            self._checkReminders();
        }, 10000);

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                self._checkReminders();
            }
        });
        window.addEventListener('focus', function () {
            self._checkReminders();
        });
    };

    TodoList.prototype._getTaskTargetMs = function (task) {
        if (!task || !task.reminder || !task.reminder.enabled || task.reminder.completed || task.completed) return null;
        var dt = task.reminder.datetime;
        if (!dt) {
            var freq = task.reminder.frequency || 'once';
            if (freq !== 'once' && task.startDate) {
                dt = task.startDate;
            } else {
                dt = task.endDate || task.startDate;
            }
        }
        if (!dt) return null;
        if (dt.indexOf('T') === -1) {
            dt += 'T09:00';
        }
        var target = new Date(dt).getTime();
        return isNaN(target) ? null : target;
    };

    TodoList.prototype._scheduleNextTimer = function () {
        if (this._exactTimer) {
            clearTimeout(this._exactTimer);
            this._exactTimer = null;
        }
        if (!this.tasks || this.tasks.length === 0) return;
        var now = Date.now();
        var minDiff = Infinity;
        var self = this;

        this.tasks.forEach(function (task) {
            if (task.completed) return;
            if (!task.reminder || !task.reminder.enabled || task.reminder.completed) return;

            var target = self._getTaskTargetMs(task);
            if (!target) return;

            var stage = typeof task.reminder.stage === 'number' ? task.reminder.stage : 0;
            var dismissed = !!task.reminder.dismissed;

            var cp1 = target - 5 * 60 * 1000; // -5m
            var cp2 = target;                  // on-time
            var cp3 = target + 5 * 60 * 1000; // +5m (late)

            var candidate = null;
            if (stage === 0) {
                if (cp1 > now) {
                    candidate = cp1 - now;
                } else if (cp2 > now) {
                    candidate = cp2 - now;
                } else if (!dismissed && cp3 > now) {
                    candidate = cp3 - now;
                }
            } else if (stage === 1) {
                if (cp2 > now) {
                    candidate = cp2 - now;
                } else if (!dismissed && cp3 > now) {
                    candidate = cp3 - now;
                }
            } else if (stage === 2) {
                if (!dismissed && cp3 > now) {
                    candidate = cp3 - now;
                }
            }

            if (candidate !== null && candidate > 0 && candidate < minDiff) {
                minDiff = candidate;
            }
        });

        if (minDiff !== Infinity && minDiff < 2147483647) {
            this._exactTimer = setTimeout(function () {
                self._checkReminders();
            }, minDiff + 200);
        }

        this._syncRemindersToWorker();
    };

    TodoList.prototype._checkReminders = function () {
        if (!this.tasks || this.tasks.length === 0) return;
        var now = Date.now();
        var hasChanges = false;
        var self = this;

        this.tasks.forEach(function (task) {
            if (task.completed) return;
            if (!task.reminder || !task.reminder.enabled || task.reminder.completed) return;

            var target = self._getTaskTargetMs(task);
            if (!target) return;

            var cp1 = target - 5 * 60 * 1000; // -5m
            var cp2 = target;                  // on-time
            var cp3 = target + 5 * 60 * 1000; // +5m (late)

            var stage = typeof task.reminder.stage === 'number' ? task.reminder.stage : 0;
            var dismissed = !!task.reminder.dismissed;

            if (stage === 0) {
                if (now >= cp3) {
                    if (!dismissed) {
                        task.reminder.stage = 3;
                        task.reminder.lastTriggered = new Date().toISOString();
                        self._triggerReminderStage(task, 3);
                    }
                    if (task.reminder.frequency === 'once') {
                        task.reminder.completed = true;
                    } else {
                        self._advanceTaskRecurrence(task);
                    }
                    hasChanges = true;
                } else if (now >= cp2) {
                    task.reminder.stage = 2;
                    task.reminder.lastTriggered = new Date().toISOString();
                    self._triggerReminderStage(task, 2);
                    hasChanges = true;
                } else if (now >= cp1) {
                    task.reminder.stage = 1;
                    task.reminder.lastTriggered = new Date().toISOString();
                    self._triggerReminderStage(task, 1);
                    hasChanges = true;
                }
            } else if (stage === 1) {
                if (now >= cp3) {
                    if (!dismissed) {
                        task.reminder.stage = 3;
                        task.reminder.lastTriggered = new Date().toISOString();
                        self._triggerReminderStage(task, 3);
                    }
                    if (task.reminder.frequency === 'once') {
                        task.reminder.completed = true;
                    } else {
                        self._advanceTaskRecurrence(task);
                    }
                    hasChanges = true;
                } else if (now >= cp2) {
                    task.reminder.stage = 2;
                    task.reminder.lastTriggered = new Date().toISOString();
                    self._triggerReminderStage(task, 2);
                    hasChanges = true;
                }
            } else if (stage === 2) {
                if (now >= cp3) {
                    if (!dismissed) {
                        task.reminder.stage = 3;
                        task.reminder.lastTriggered = new Date().toISOString();
                        self._triggerReminderStage(task, 3);
                    }
                    if (task.reminder.frequency === 'once') {
                        task.reminder.completed = true;
                    } else {
                        self._advanceTaskRecurrence(task);
                    }
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            this._saveTasks();
            this._render();
        }

        this._scheduleNextTimer();
    };

    TodoList.prototype._triggerReminderStage = function (task, stage) {
        var titleText = task.text || t('taskReminderDue');
        var subtasksText = '';
        if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
            var done = task.subtasks.filter(function (s) { return s.completed; }).length;
            subtasksText = '(' + done + '/' + task.subtasks.length + ' ' + t('subtasksCount') + ')';
        }

        // 1. Play sweet audio chime
        playChime();

        var alertTitle = '';
        var toastMsg = '';
        var stageBadge = '';

        if (stage === 1) {
            alertTitle = t('reminderStageBeforeTitle');
            toastMsg = t('reminderStageBeforeToast').replace('{title}', titleText);
            stageBadge = t('reminderStageBeforeBadge');
        } else if (stage === 2) {
            alertTitle = t('reminderStageDueTitle');
            toastMsg = t('reminderStageDueToast').replace('{title}', titleText);
            stageBadge = t('reminderStageDueBadge');
            this._showReminderAlertModal(task, 2, stageBadge);
        } else if (stage === 3) {
            alertTitle = t('reminderStageLateTitle');
            toastMsg = t('reminderStageLateToast').replace('{title}', titleText);
            stageBadge = t('reminderStageLateBadge');
            this._showReminderAlertModal(task, 3, stageBadge);
        }

        if (typeof PwaManager !== 'undefined' && PwaManager.showToast) {
            var icon = stage === 3 ? '⚠️' : '⏰';
            PwaManager.showToast(toastMsg, icon);
        }

        showSystemNotification(alertTitle + ': ' + titleText, subtasksText, undefined, {
            taskId: task.id,
            stage: stage,
            taskText: titleText
        });
    };

    TodoList.prototype._showReminderAlertModal = function (task, stage, stageBadge) {
        if (!this.alertModal) return;
        this.activeAlertTaskId = task.id;
        this.alertTitle.textContent = task.text || t('taskReminderDue');

        var subtasksText = '';
        if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
            subtasksText = task.subtasks.map(function (s) {
                return (s.completed ? '☑ ' : '☐ ') + s.text;
            }).join('\n');
        }
        this.alertContent.textContent = subtasksText || task.text;

        var targetMs = this._getTaskTargetMs(task) || Date.now();
        var rDate = new Date(targetMs);
        var locale = currentLang === 'vi' ? 'vi-VN' : 'en-US';
        var timeFormatted = rDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        this.alertTime.textContent = timeFormatted;

        if (this.alertStageBadge) {
            this.alertStageBadge.textContent = stageBadge || (stage === 3 ? t('reminderStageLateBadge') : t('reminderStageDueBadge'));
            if (stage === 3) {
                this.alertStageBadge.classList.add('late');
            } else {
                this.alertStageBadge.classList.remove('late');
            }
        }

        var freqLabels = {
            'once': t('freqOnce'),
            'daily': t('freqDaily'),
            'weekly': t('freqWeekly'),
            'monthly': t('freqMonthly')
        };
        var freq = (task.reminder && task.reminder.frequency) || 'once';
        this.alertFreq.textContent = freqLabels[freq] || t('freqOnce');
        this.alertModal.classList.add('active');
    };

    TodoList.prototype._closeReminderAlertModal = function () {
        if (this.alertModal) {
            this.alertModal.classList.remove('active');
        }
        this.activeAlertTaskId = null;
    };

    TodoList.prototype.completeTaskById = function (taskId) {
        if (!taskId) return;
        var self = this;
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (task) {
            task.completed = true;
            if (task.reminder) {
                task.reminder.dismissed = true;
                if (task.reminder.frequency === 'once') {
                    task.reminder.completed = true;
                } else {
                    self._advanceTaskRecurrence(task);
                }
            }
            this._saveTasks();
            this._render();
            this._scheduleNextTimer();
            playChime();
            if (typeof PwaManager !== 'undefined' && PwaManager.showToast) {
                PwaManager.showToast(t('taskCompletedToast'), '🎉');
            }
        }
        if (this.activeAlertTaskId === taskId) {
            this._closeReminderAlertModal();
        }
    };

    TodoList.prototype.snoozeTaskById = function (taskId, minutes) {
        if (!taskId) return;
        var mins = minutes || 5;
        var self = this;
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (task && task.reminder) {
            var snoozeDate = new Date(Date.now() + mins * 60 * 1000);
            task.reminder.datetime = formatDateTimeLocal(snoozeDate);
            task.reminder.stage = 1;
            task.reminder.dismissed = false;
            task.reminder.completed = false;
            this._saveTasks();
            this._render();
            this._scheduleNextTimer();
            if (typeof PwaManager !== 'undefined' && PwaManager.showToast) {
                PwaManager.showToast(t('snoozedToast'), '⏰');
            }
        }
        if (this.activeAlertTaskId === taskId) {
            this._closeReminderAlertModal();
        }
    };

    TodoList.prototype._completeActiveTask = function () {
        if (!this.activeAlertTaskId) {
            this._closeReminderAlertModal();
            return;
        }
        this.completeTaskById(this.activeAlertTaskId);
    };

    TodoList.prototype._dismissActiveReminder = function () {
        if (!this.activeAlertTaskId) {
            this._closeReminderAlertModal();
            return;
        }
        var self = this;
        var task = this.tasks.find(function (t) { return t.id === self.activeAlertTaskId; });
        if (task && task.reminder) {
            task.reminder.dismissed = true;
            if (task.reminder.frequency === 'once') {
                task.reminder.completed = true;
            } else {
                var targetMs = self._getTaskTargetMs(task);
                if (targetMs && targetMs <= Date.now()) {
                    self._advanceTaskRecurrence(task);
                }
            }
            this._saveTasks();
            this._render();
            this._scheduleNextTimer();
        }
        this._closeReminderAlertModal();
    };

    TodoList.prototype._snoozeActiveReminder = function (minutes) {
        if (!this.activeAlertTaskId) {
            this._closeReminderAlertModal();
            return;
        }
        this.snoozeTaskById(this.activeAlertTaskId, minutes || 5);
    };

    TodoList.prototype._syncRemindersToWorker = function () {
        if (!('serviceWorker' in navigator)) return;
        var self = this;
        var activeTasks = [];
        if (this.tasks && this.tasks.length > 0) {
            this.tasks.forEach(function (task) {
                if (task.completed) return;
                if (!task.reminder || !task.reminder.enabled || task.reminder.completed) return;
                var targetMs = self._getTaskTargetMs(task);
                if (!targetMs) return;

                var subtasksSummary = '';
                if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
                    var done = task.subtasks.filter(function (s) { return s.completed; }).length;
                    subtasksSummary = '(' + done + '/' + task.subtasks.length + ' ' + t('subtasksCount') + ') ' +
                        task.subtasks.map(function (s) { return (s.completed ? '☑ ' : '☐ ') + s.text; }).join(', ');
                }

                activeTasks.push({
                    id: task.id,
                    text: task.text,
                    targetMs: targetMs,
                    stage: typeof task.reminder.stage === 'number' ? task.reminder.stage : 0,
                    dismissed: !!task.reminder.dismissed,
                    subtasksSummary: subtasksSummary
                });
            });
        }

        var payload = { type: 'SYNC_REMINDERS', tasks: activeTasks };
        try {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage(payload);
            }
            navigator.serviceWorker.ready.then(function (reg) {
                if (reg.active) {
                    reg.active.postMessage(payload);
                }
            }).catch(function () {});
        } catch (e) {
            console.warn('[TodoList] syncReminders error:', e);
        }
    };

    TodoList.prototype._advanceTaskRecurrence = function (task) {
        var reminder = task.reminder;
        if (!reminder) return;
        var freq = reminder.frequency || 'once';
        if (freq === 'once') {
            reminder.completed = true;
            return;
        }
        var now = new Date();
        var curTime = reminder.datetime ? new Date(reminder.datetime) : new Date();
        if (isNaN(curTime.getTime())) curTime = new Date();

        if (freq === 'daily') {
            curTime.setDate(curTime.getDate() + 1);
            while (curTime <= now) {
                curTime.setDate(curTime.getDate() + 1);
            }
        } else if (freq === 'weekly') {
            curTime.setDate(curTime.getDate() + 7);
            while (curTime <= now) {
                curTime.setDate(curTime.getDate() + 7);
            }
        } else if (freq === 'monthly') {
            curTime.setMonth(curTime.getMonth() + 1);
            while (curTime <= now) {
                curTime.setMonth(curTime.getMonth() + 1);
            }
        } else {
            reminder.completed = true;
            return;
        }

        reminder.datetime = formatDateTimeLocal(curTime);

        // Check if task has endDate limit:
        if (task.endDate) {
            var endStr = task.endDate;
            if (endStr.indexOf('T') === -1) endStr += 'T23:59:59';
            var endLimitMs = new Date(endStr).getTime();
            if (!isNaN(endLimitMs) && curTime.getTime() > endLimitMs) {
                // Reached or exceeded end date! Stop repeating.
                reminder.completed = true;
                return;
            }
        }

        reminder.stage = 0;
        reminder.dismissed = false;
        reminder.completed = false;
    };

    // Firestore persistence
    TodoList.prototype._saveTasks = function () {
        if (!currentUser) return;
        userDocRef('data').doc('todos').set({ items: this.tasks });
        this._syncRemindersToWorker();
    };
    TodoList.prototype._loadTasks = function () {
        if (!currentUser) { this.tasks = []; this._render(); return; }
        var self = this;
        userDocRef('data').doc('todos').get().then(function (doc) {
            self.tasks = (doc.exists && doc.data().items) ? doc.data().items : [];
            self._render();
            self._checkReminders();
            self._syncRemindersToWorker();
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
                if (navigator.vibrate) navigator.vibrate(50);
                var checkbox = card.querySelector('.note-select');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
                longPressTimer = null;
            }, 500);
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
        this._saveNotes();
        this._render();
        this._closeModal();
    };

    NoteApp.prototype._deleteSelected = function () {
        if (this.selectedIds.size === 0) return;
        var self = this;
        showConfirmModal({
            title: t('confirmModalTitle'),
            message: t('confirmDeleteNotesMsg'),
            confirmText: t('confirmDelete'),
            onConfirm: function () {
                var sel = self.selectedIds;
                self.notes = self.notes.filter(function (n) { return !sel.has(n.id); });
                self.selectedIds.clear();
                self._updateDeleteBtn();
                self._saveNotes();
                self._render();
            }
        });
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
        this.sjcTrendEl = document.getElementById('trend-sjc');
        
        this.ringBuyEl = document.getElementById('price-ring-buy');
        this.ringSellEl = document.getElementById('price-ring-sell');
        this.ringTrendEl = document.getElementById('trend-ring');

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

    PriceApp.prototype.updateDojiTrend = function(trendEl, changeVal, currentPrice) {
        if (!trendEl) return;
        if (!changeVal || changeVal === 0) {
            trendEl.textContent = '--';
            trendEl.className = 'trend-badge';
            return;
        }
        var prev = currentPrice - changeVal;
        var percent = ((changeVal / prev) * 100).toFixed(2) + '%';
        
        var changeStr = '';
        if (Math.abs(changeVal) >= 1000) {
            changeStr = (changeVal / 1000).toLocaleString('vi-VN') + 'K';
        } else {
            changeStr = changeVal.toLocaleString('vi-VN');
        }
        
        var isUp = changeVal > 0;
        if (isUp) changeStr = '+' + changeStr;
        
        trendEl.textContent = (isUp ? '▲ ' : '▼ ') + changeStr + ' (' + percent + ')';
        trendEl.className = 'trend-badge ' + (isUp ? 'up' : 'down');
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
                    self.updateDojiTrend(self.sjcTrendEl, sjc.change_buy, sjc.buy);
                }
                var ring = dojiData.prices['DOJINHTV'];
                if (ring) {
                    self.ringBuyEl.textContent = self.formatPrice(ring.buy);
                    self.ringSellEl.textContent = self.formatPrice(ring.sell);
                    self.updateDojiTrend(self.ringTrendEl, ring.change_buy, ring.buy);
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
    //  8. HABIT TRACKER APP (FEATURE 8)
    // =========================================================
    var ALL_HABIT_BADGES = [
        { id: 'streak_3', icon: '🌱', nameVi: 'Mầm Xanh Kỷ Luật', nameEn: 'Discipline Seed', descVi: 'Duy trì chuỗi 3 ngày liên tiếp', descEn: 'Maintain a 3-day streak', reqStreak: 3 },
        { id: 'streak_7', icon: '🥉', nameVi: 'Đà Tiến Tới', nameEn: 'Momentum Builder', descVi: 'Duy trì chuỗi 7 ngày liên tiếp', descEn: 'Maintain a 7-day streak', reqStreak: 7 },
        { id: 'streak_21', icon: '🥈', nameVi: 'Kỷ Luật Thép', nameEn: 'Iron Discipline', descVi: 'Duy trì chuỗi 21 ngày hình thành thói quen', descEn: 'Maintain a 21-day streak', reqStreak: 21 },
        { id: 'streak_30', icon: '🥇', nameVi: 'Bậc Thầy Thói Quen', nameEn: 'Habit Master', descVi: 'Duy trì chuỗi trọn vẹn 30 ngày', descEn: 'Complete a full 30-day streak', reqStreak: 30 },
        { id: 'perfect_1', icon: '⭐', nameVi: 'Ngày Hoàn Hảo', nameEn: 'Perfect Day', descVi: 'Hoàn thành 100% thói quen trong 1 ngày', descEn: 'Complete 100% habits in a single day', reqPerfect: 1 },
        { id: 'xp_500', icon: '⚡', nameVi: 'Tia Chớp Năng Lượng', nameEn: 'Energy Spark', descVi: 'Đạt mốc 500 điểm XP', descEn: 'Reach 500 XP', reqXp: 500 },
        { id: 'xp_1000', icon: '👑', nameVi: 'Đại Sư Kỷ Luật', nameEn: 'Grandmaster', descVi: 'Đạt mốc 1000 điểm XP', descEn: 'Reach 1000 XP', reqXp: 1000 }
    ];

    function HabitApp() {
        this.habits = [];
        this.habitLogs = {}; // monthKey -> { days: { "YYYY-MM-DD": { [habitId]: { completed: true, value: 2000 } } } }
        this.habitProfile = {
            xp: 0,
            currentStreak: 0,
            longestStreak: 0,
            badges: [],
            rewards: [
                { id: 'rw1', title: '1 cốc trà sữa', cost: 100, icon: '🧋' },
                { id: 'rw2', title: 'Xem 1 tập phim Netflix', cost: 150, icon: '🎬' },
                { id: 'rw3', title: 'Chơi game 1 tiếng', cost: 200, icon: '🎮' }
            ],
            penalties: [],
            pledge: '10.000 VNĐ vào heo đất'
        };

        var now = new Date();
        this.viewYear = now.getFullYear();
        this.viewMonth = now.getMonth() + 1; // 1-indexed (1..12)

        this.selectedType = 'checkbox';
        this.selectedIcon = '💧';
        this.selectedColor = 'purple';
        this.editingHabitId = null;

        this.activeNumericCell = null; // { dateStr, habitId, target, unit, name }

        this._cacheElements();
        this._bindEvents();
        this._loadLocalData();
        this._render();
    }

    HabitApp.prototype._cacheElements = function () {
        // Stats
        this.currentStreakEl = document.getElementById('habit-current-streak');
        this.recordStreakEl = document.getElementById('habit-record-streak');
        this.levelBadgeEl = document.getElementById('habit-level-badge');
        this.levelTitleEl = document.getElementById('habit-level-title');
        this.currentXpEl = document.getElementById('habit-current-xp');
        this.nextXpEl = document.getElementById('habit-next-xp');
        this.xpBarEl = document.getElementById('habit-xp-bar');

        // Stat Action buttons
        this.btnShop = document.getElementById('btn-open-habit-shop');
        this.btnBadges = document.getElementById('btn-open-habit-badges');
        this.btnDiscipline = document.getElementById('btn-open-habit-discipline');

        // Toolbar
        this.prevMonthBtn = document.getElementById('btn-habit-prev-month');
        this.monthTitleEl = document.getElementById('habit-month-title');
        this.nextMonthBtn = document.getElementById('btn-habit-next-month');
        this.todayBtn = document.getElementById('btn-habit-today');
        this.syncMonthBtn = document.getElementById('btn-habit-sync-month');
        this.manageHabitsBtn = document.getElementById('btn-manage-habits');
        this.addHabitBtn = document.getElementById('btn-add-habit');
        this.emptyAddHabitBtn = document.getElementById('btn-empty-add-habit');

        // Matrix
        this.emptyStateEl = document.getElementById('habit-empty-state');
        this.tableWrapperEl = document.getElementById('habit-table-wrapper');
        this.tableHeadEl = document.getElementById('habit-table-head');
        this.tableBodyEl = document.getElementById('habit-table-body');

        // Modal Add/Edit
        this.habitModal = document.getElementById('habit-modal');
        this.habitModalTitle = document.getElementById('habit-modal-title');
        this.habitModalClose = document.getElementById('habit-modal-close');
        this.habitModalCancel = document.getElementById('habit-modal-cancel');
        this.habitModalSave = document.getElementById('habit-modal-save');
        this.habitEditId = document.getElementById('habit-edit-id');
        this.habitNameInput = document.getElementById('habit-name-input');
        this.typePillCheckbox = document.getElementById('type-pill-checkbox');
        this.typePillNumeric = document.getElementById('type-pill-numeric');
        this.numericRow = document.getElementById('habit-numeric-row');
        this.targetInput = document.getElementById('habit-target-input');
        this.unitInput = document.getElementById('habit-unit-input');
        this.iconPicker = document.getElementById('habit-icon-picker');
        this.colorPicker = document.getElementById('habit-color-picker');

        // Modal Manage
        this.manageModal = document.getElementById('habit-manage-modal');
        this.manageClose = document.getElementById('habit-manage-close');
        this.manageDone = document.getElementById('habit-manage-done');
        this.manageList = document.getElementById('habit-manage-list');

        // Modal Numeric Input
        this.numericModal = document.getElementById('habit-numeric-modal');
        this.numericClose = document.getElementById('habit-numeric-close');
        this.numericCancel = document.getElementById('numeric-modal-cancel');
        this.numericSave = document.getElementById('numeric-modal-save');
        this.numericName = document.getElementById('numeric-modal-name');
        this.numericTarget = document.getElementById('numeric-modal-target');
        this.numericIcon = document.getElementById('numeric-modal-icon');
        this.numericUnit = document.getElementById('numeric-modal-unit');
        this.numericValInput = document.getElementById('numeric-modal-val');
        this.numericStepDown = document.getElementById('numeric-step-down');
        this.numericStepUp = document.getElementById('numeric-step-up');
        this.quickPresets = document.getElementById('numeric-quick-presets');

        // Modal Shop
        this.shopModal = document.getElementById('habit-shop-modal');
        this.shopClose = document.getElementById('habit-shop-close');
        this.shopDone = document.getElementById('habit-shop-done');
        this.shopXpBalance = document.getElementById('shop-xp-balance');
        this.shopRewardTitle = document.getElementById('shop-reward-title');
        this.shopRewardCost = document.getElementById('shop-reward-cost');
        this.shopRewardIcon = document.getElementById('shop-reward-icon');
        this.btnAddReward = document.getElementById('btn-add-reward');
        this.shopItemsList = document.getElementById('shop-items-list');

        // Modal Badges
        this.badgesModal = document.getElementById('habit-badges-modal');
        this.badgesClose = document.getElementById('habit-badges-close');
        this.badgesDone = document.getElementById('habit-badges-done');
        this.badgesGrid = document.getElementById('habit-badges-grid');

        // Modal Discipline
        this.disciplineModal = document.getElementById('habit-discipline-modal');
        this.disciplineClose = document.getElementById('habit-discipline-close');
        this.disciplineDone = document.getElementById('habit-discipline-done');
        this.disciplinePledgeInput = document.getElementById('discipline-pledge-input');
        this.btnSavePledge = document.getElementById('btn-save-pledge');
        this.btnClearPenalties = document.getElementById('btn-clear-penalties');
        this.disciplineLogsList = document.getElementById('discipline-logs-list');
    };

    HabitApp.prototype._getMonthKey = function () {
        return this.viewYear + '-' + String(this.viewMonth).padStart(2, '0');
    };

    HabitApp.prototype._bindEvents = function () {
        var self = this;

        // Month Switcher
        if (this.prevMonthBtn) {
            this.prevMonthBtn.addEventListener('click', function () {
                self.viewMonth--;
                if (self.viewMonth < 1) {
                    self.viewMonth = 12;
                    self.viewYear--;
                }
                self._onMonthChanged();
            });
        }
        if (this.nextMonthBtn) {
            this.nextMonthBtn.addEventListener('click', function () {
                self.viewMonth++;
                if (self.viewMonth > 12) {
                    self.viewMonth = 1;
                    self.viewYear++;
                }
                self._onMonthChanged();
            });
        }
        if (this.todayBtn) {
            this.todayBtn.addEventListener('click', function () {
                var now = new Date();
                self.viewYear = now.getFullYear();
                self.viewMonth = now.getMonth() + 1;
                self._onMonthChanged();
                setTimeout(function () {
                    var todayRow = document.querySelector('.habit-table tbody tr.row-today');
                    if (todayRow) todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            });
        }

        // Action Toolbar
        if (this.syncMonthBtn) {
            this.syncMonthBtn.addEventListener('click', function () {
                self._syncMonthTable();
            });
        }
        if (this.addHabitBtn) {
            this.addHabitBtn.addEventListener('click', function () {
                self._openAddHabitModal();
            });
        }
        if (this.emptyAddHabitBtn) {
            this.emptyAddHabitBtn.addEventListener('click', function () {
                self._openAddHabitModal();
            });
        }
        if (this.manageHabitsBtn) {
            this.manageHabitsBtn.addEventListener('click', function () {
                self._openManageModal();
            });
        }

        // Quick Modal Openers
        if (this.btnShop) {
            this.btnShop.addEventListener('click', function () {
                self._openShopModal();
            });
        }
        if (this.btnBadges) {
            this.btnBadges.addEventListener('click', function () {
                self._openBadgesModal();
            });
        }
        if (this.btnDiscipline) {
            this.btnDiscipline.addEventListener('click', function () {
                self._openDisciplineModal();
            });
        }

        // Habit Add/Edit Form
        if (this.typePillCheckbox && this.typePillNumeric) {
            this.typePillCheckbox.addEventListener('click', function () {
                self.selectedType = 'checkbox';
                self.typePillCheckbox.classList.add('active');
                self.typePillNumeric.classList.remove('active');
                self.numericRow.style.display = 'none';
            });
            this.typePillNumeric.addEventListener('click', function () {
                self.selectedType = 'numeric';
                self.typePillNumeric.classList.add('active');
                self.typePillCheckbox.classList.remove('active');
                self.numericRow.style.display = 'flex';
            });
        }

        if (this.iconPicker) {
            this.iconPicker.addEventListener('click', function (e) {
                var btn = e.target.closest('.icon-preset-btn');
                if (!btn) return;
                self.selectedIcon = btn.getAttribute('data-icon') || '💧';
                self.iconPicker.querySelectorAll('.icon-preset-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        }

        if (this.colorPicker) {
            this.colorPicker.addEventListener('click', function (e) {
                var dot = e.target.closest('.color-dot');
                if (!dot) return;
                self.selectedColor = dot.getAttribute('data-color') || 'purple';
                self.colorPicker.querySelectorAll('.color-dot').forEach(function (d) { d.classList.remove('active'); });
                dot.classList.add('active');
            });
        }

        if (this.habitModalClose) this.habitModalClose.addEventListener('click', function () { self._closeHabitModal(); });
        if (this.habitModalCancel) this.habitModalCancel.addEventListener('click', function () { self._closeHabitModal(); });
        if (this.habitModalSave) this.habitModalSave.addEventListener('click', function () { self._saveHabitModal(); });

        // Manage Modal
        if (this.manageClose) this.manageClose.addEventListener('click', function () { self.manageModal.classList.remove('active'); });
        if (this.manageDone) this.manageDone.addEventListener('click', function () { self.manageModal.classList.remove('active'); });

        // Numeric Modal
        if (this.numericClose) this.numericClose.addEventListener('click', function () { self.numericModal.classList.remove('active'); });
        if (this.numericCancel) this.numericCancel.addEventListener('click', function () { self.numericModal.classList.remove('active'); });
        if (this.numericSave) this.numericSave.addEventListener('click', function () { self._saveNumericModal(); });
        if (this.numericStepDown) {
            this.numericStepDown.addEventListener('click', function () {
                var cur = parseFloat(self.numericValInput.value) || 0;
                var step = (self.activeNumericCell && self.activeNumericCell.target >= 100) ? 50 : 1;
                self.numericValInput.value = Math.max(0, cur - step);
            });
        }
        if (this.numericStepUp) {
            this.numericStepUp.addEventListener('click', function () {
                var cur = parseFloat(self.numericValInput.value) || 0;
                var step = (self.activeNumericCell && self.activeNumericCell.target >= 100) ? 50 : 1;
                self.numericValInput.value = cur + step;
            });
        }

        // Shop Modal
        if (this.shopClose) this.shopClose.addEventListener('click', function () { self.shopModal.classList.remove('active'); });
        if (this.shopDone) this.shopDone.addEventListener('click', function () { self.shopModal.classList.remove('active'); });
        if (this.btnAddReward) {
            this.btnAddReward.addEventListener('click', function () {
                var title = (self.shopRewardTitle.value || '').trim();
                var cost = parseInt(self.shopRewardCost.value, 10);
                var icon = self.shopRewardIcon.value || '🎁';
                if (!title || !cost || cost < 10) {
                    alert(currentLang === 'vi' ? 'Vui lòng nhập tên phần thưởng và chi phí XP hợp lệ!' : 'Please enter valid reward title and XP cost!');
                    return;
                }
                self.habitProfile.rewards.push({
                    id: generateId(),
                    title: title,
                    cost: cost,
                    icon: icon
                });
                self.shopRewardTitle.value = '';
                self.shopRewardCost.value = '';
                self._saveProfile();
                self._renderShop();
            });
        }

        // Badges Modal
        if (this.badgesClose) this.badgesClose.addEventListener('click', function () { self.badgesModal.classList.remove('active'); });
        if (this.badgesDone) this.badgesDone.addEventListener('click', function () { self.badgesModal.classList.remove('active'); });

        // Discipline Modal
        if (this.disciplineClose) this.disciplineClose.addEventListener('click', function () { self.disciplineModal.classList.remove('active'); });
        if (this.disciplineDone) this.disciplineDone.addEventListener('click', function () { self.disciplineModal.classList.remove('active'); });
        if (this.btnSavePledge) {
            this.btnSavePledge.addEventListener('click', function () {
                self.habitProfile.pledge = (self.disciplinePledgeInput.value || '').trim();
                self._saveProfile();
                PwaManager.showToast(currentLang === 'vi' ? 'Đã lưu cam kết kỷ luật cá nhân!' : 'Saved discipline pledge!', '⚖️');
            });
        }
        if (this.btnClearPenalties) {
            this.btnClearPenalties.addEventListener('click', function () {
                self.habitProfile.penalties = [];
                self._saveProfile();
                self._renderDiscipline();
            });
        }

        // Matrix Table Delegated Cell Clicks
        if (this.tableBodyEl) {
            this.tableBodyEl.addEventListener('click', function (e) {
                var checkBtn = e.target.closest('.habit-cell-checkbox');
                if (checkBtn) {
                    var dStr = checkBtn.getAttribute('data-date');
                    var hId = checkBtn.getAttribute('data-id');
                    if (dStr && hId) self._toggleCheckbox(dStr, hId, e);
                    return;
                }

                var numBtn = e.target.closest('.habit-cell-numeric');
                if (numBtn) {
                    var dStrNum = numBtn.getAttribute('data-date');
                    var hIdNum = numBtn.getAttribute('data-id');
                    if (dStrNum && hIdNum) self._openNumericModal(dStrNum, hIdNum);
                    return;
                }
            });
        }
    };

    HabitApp.prototype._onMonthChanged = function () {
        this._render();
        this._loadMonthLogs();
    };

    // --- Data Persistence ---
    HabitApp.prototype._loadLocalData = function () {
        var keySuffix = currentUser ? currentUser.uid : 'local';
        try {
            var rawHabits = localStorage.getItem('flowhub_habits_' + keySuffix);
            if (rawHabits) this.habits = JSON.parse(rawHabits);
            else if (!currentUser && this.habits.length === 0) {
                // Default starter habits if completely fresh
                this.habits = [
                    { id: 'h_water', title: 'Uống 2L nước', type: 'numeric', target: 2000, unit: 'ml', icon: '💧', color: 'blue', active: true, order: 1 },
                    { id: 'h_read', title: 'Đọc sách 20 trang', type: 'numeric', target: 20, unit: 'trang', icon: '📚', color: 'purple', active: true, order: 2 },
                    { id: 'h_sleep', title: 'Dậy trước 6:30', type: 'checkbox', target: 1, unit: '', icon: '⏰', color: 'orange', active: true, order: 3 },
                    { id: 'h_gym', title: 'Tập thể dục 30p', type: 'checkbox', target: 1, unit: '', icon: '🏃', color: 'green', active: true, order: 4 }
                ];
            }

            var rawLogs = localStorage.getItem('flowhub_habit_logs_' + keySuffix + '_' + this._getMonthKey());
            if (rawLogs) this.habitLogs[this._getMonthKey()] = JSON.parse(rawLogs);

            var rawProfile = localStorage.getItem('flowhub_habit_profile_' + keySuffix);
            if (rawProfile) {
                var p = JSON.parse(rawProfile);
                this.habitProfile.xp = p.xp || 0;
                this.habitProfile.currentStreak = p.currentStreak || 0;
                this.habitProfile.longestStreak = p.longestStreak || 0;
                if (p.badges) this.habitProfile.badges = p.badges;
                if (p.rewards) this.habitProfile.rewards = p.rewards;
                if (p.penalties) this.habitProfile.penalties = p.penalties;
                if (p.pledge) this.habitProfile.pledge = p.pledge;
            }
        } catch (e) {
            console.warn('Local habit data load error:', e);
        }
    };

    HabitApp.prototype._loadData = function () {
        var self = this;
        if (!currentUser) {
            this._loadLocalData();
            this._render();
            return;
        }

        // Firestore Realtime Listeners
        // 1. Habits list
        try {
            userDocRef('habits').orderBy('order', 'asc').onSnapshot(function (snapshot) {
                var items = [];
                snapshot.forEach(function (doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    items.push(data);
                });
                if (items.length > 0) {
                    self.habits = items;
                    localStorage.setItem('flowhub_habits_' + currentUser.uid, JSON.stringify(items));
                    self._render();
                } else {
                    // Initialize default habits to firestore if brand new user
                    self._seedDefaultHabits();
                }
            }, function () {
                self._loadLocalData();
                self._render();
            });

            // 2. Profile & stats
            userDocRef('habit_profile').doc('stats').onSnapshot(function (doc) {
                if (doc.exists) {
                    var p = doc.data();
                    self.habitProfile.xp = p.xp || 0;
                    self.habitProfile.currentStreak = p.currentStreak || 0;
                    self.habitProfile.longestStreak = p.longestStreak || 0;
                    if (p.badges) self.habitProfile.badges = p.badges;
                    if (p.rewards) self.habitProfile.rewards = p.rewards;
                    if (p.penalties) self.habitProfile.penalties = p.penalties;
                    if (p.pledge) self.habitProfile.pledge = p.pledge;
                    localStorage.setItem('flowhub_habit_profile_' + currentUser.uid, JSON.stringify(self.habitProfile));
                    self._renderStats();
                } else {
                    self._saveProfile();
                }
            });

            // 3. Current month logs
            this._loadMonthLogs();
        } catch (e) {
            self._loadLocalData();
            self._render();
        }
    };

    HabitApp.prototype._seedDefaultHabits = function () {
        var self = this;
        var defaultList = [
            { title: 'Uống 2L nước', type: 'numeric', target: 2000, unit: 'ml', icon: '💧', color: 'blue', active: true, order: 1 },
            { title: 'Đọc sách 20 trang', type: 'numeric', target: 20, unit: 'trang', icon: '📚', color: 'purple', active: true, order: 2 },
            { title: 'Dậy trước 6:30', type: 'checkbox', target: 1, unit: '', icon: '⏰', color: 'orange', active: true, order: 3 },
            { title: 'Tập thể dục 30p', type: 'checkbox', target: 1, unit: '', icon: '🏃', color: 'green', active: true, order: 4 }
        ];
        defaultList.forEach(function (h) {
            userDocRef('habits').add(h);
        });
    };

    HabitApp.prototype._loadMonthLogs = function () {
        var self = this;
        var mKey = this._getMonthKey();
        if (!currentUser) {
            this._renderMatrix();
            return;
        }

        userDocRef('habit_logs').doc(mKey).onSnapshot(function (doc) {
            if (doc.exists) {
                self.habitLogs[mKey] = doc.data();
            } else {
                if (!self.habitLogs[mKey]) self.habitLogs[mKey] = { month: mKey, days: {} };
            }
            localStorage.setItem('flowhub_habit_logs_' + currentUser.uid + '_' + mKey, JSON.stringify(self.habitLogs[mKey]));
            self._calculateStreaks();
            self._renderMatrix();
        }, function () {
            self._renderMatrix();
        });
    };

    HabitApp.prototype._saveHabitToDb = function (habit) {
        var keySuffix = currentUser ? currentUser.uid : 'local';
        localStorage.setItem('flowhub_habits_' + keySuffix, JSON.stringify(this.habits));

        if (currentUser) {
            if (habit.id && !habit.id.startsWith('temp_')) {
                userDocRef('habits').doc(habit.id).set(habit, { merge: true });
            } else {
                var newRef = userDocRef('habits').doc();
                habit.id = newRef.id;
                newRef.set(habit);
            }
        }
    };

    HabitApp.prototype._deleteHabitFromDb = function (habitId) {
        var keySuffix = currentUser ? currentUser.uid : 'local';
        this.habits = this.habits.filter(function (h) { return h.id !== habitId; });
        localStorage.setItem('flowhub_habits_' + keySuffix, JSON.stringify(this.habits));

        if (currentUser) {
            userDocRef('habits').doc(habitId).delete().catch(function () {});
        }
        this._render();
    };

    HabitApp.prototype._saveMonthLogs = function () {
        var mKey = this._getMonthKey();
        var keySuffix = currentUser ? currentUser.uid : 'local';
        var logsData = this.habitLogs[mKey] || { month: mKey, days: {} };
        localStorage.setItem('flowhub_habit_logs_' + keySuffix + '_' + mKey, JSON.stringify(logsData));

        if (currentUser) {
            userDocRef('habit_logs').doc(mKey).set(logsData, { merge: true }).catch(function () {});
        }
    };

    HabitApp.prototype._saveProfile = function () {
        var keySuffix = currentUser ? currentUser.uid : 'local';
        localStorage.setItem('flowhub_habit_profile_' + keySuffix, JSON.stringify(this.habitProfile));

        if (currentUser) {
            userDocRef('habit_profile').doc('stats').set(this.habitProfile, { merge: true }).catch(function () {});
        }
        this._renderStats();
    };

    // --- Rendering ---
    HabitApp.prototype._render = function () {
        this._renderMonthTitle();
        this._renderStats();
        this._renderMatrix();
    };

    HabitApp.prototype._renderMonthTitle = function () {
        if (!this.monthTitleEl) return;
        var monthNamesVi = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (currentLang === 'vi') {
            this.monthTitleEl.textContent = 'Tháng ' + monthNamesVi[this.viewMonth - 1] + ' / ' + this.viewYear;
        } else {
            this.monthTitleEl.textContent = monthNamesEn[this.viewMonth - 1] + ' ' + this.viewYear;
        }
    };

    HabitApp.prototype._renderStats = function () {
        var xp = this.habitProfile.xp || 0;
        var level = 1;
        var currentLevelFloor = 0;
        var nextLevelXp = 100;
        var titleKey = 'habitRank1';

        if (xp >= 1500) {
            level = 5;
            currentLevelFloor = 1500;
            nextLevelXp = 3000;
            titleKey = 'habitRank4';
        } else if (xp >= 700) {
            level = 4;
            currentLevelFloor = 700;
            nextLevelXp = 1500;
            titleKey = 'habitRank4';
        } else if (xp >= 300) {
            level = 3;
            currentLevelFloor = 300;
            nextLevelXp = 700;
            titleKey = 'habitRank3';
        } else if (xp >= 100) {
            level = 2;
            currentLevelFloor = 100;
            nextLevelXp = 300;
            titleKey = 'habitRank2';
        }

        if (this.currentStreakEl) {
            this.currentStreakEl.innerHTML = (this.habitProfile.currentStreak || 0) + ' <span class="streak-unit">' + t('daysUnit') + '</span>';
        }
        if (this.recordStreakEl) {
            this.recordStreakEl.textContent = (currentLang === 'vi' ? 'Kỷ lục: ' : 'Best: ') + (this.habitProfile.longestStreak || 0) + ' ' + t('daysUnit');
        }

        if (this.levelBadgeEl) this.levelBadgeEl.textContent = 'Lv ' + level;
        if (this.levelTitleEl) this.levelTitleEl.textContent = t(titleKey);
        if (this.currentXpEl) this.currentXpEl.textContent = xp;
        if (this.nextXpEl) this.nextXpEl.textContent = nextLevelXp;

        if (this.xpBarEl) {
            var pct = Math.min(100, Math.max(0, Math.round(((xp - currentLevelFloor) / (nextLevelXp - currentLevelFloor)) * 100)));
            this.xpBarEl.style.width = pct + '%';
        }
    };

    HabitApp.prototype._renderMatrix = function () {
        var self = this;
        var activeHabits = this.habits.filter(function (h) { return h.active !== false; });

        if (activeHabits.length === 0) {
            if (this.emptyStateEl) this.emptyStateEl.style.display = 'flex';
            if (this.tableWrapperEl) this.tableWrapperEl.style.display = 'none';
            return;
        }

        if (this.emptyStateEl) this.emptyStateEl.style.display = 'none';
        if (this.tableWrapperEl) this.tableWrapperEl.style.display = 'block';

        // 1. Render Thead
        var headHtml = '<tr>';
        headHtml += '<th class="habit-th-date">' + (currentLang === 'vi' ? 'Ngày' : 'Date') + '</th>';
        activeHabits.forEach(function (h) {
            var targetText = h.type === 'numeric' ? (h.target + ' ' + (h.unit || '')) : '✓';
            headHtml += '<th class="habit-th-col">';
            headHtml += '  <div class="habit-th-wrap">';
            headHtml += '    <span class="habit-th-icon">' + (h.icon || '🎯') + '</span>';
            headHtml += '    <span class="habit-th-title" title="' + escapeHtml(h.title) + '">' + escapeHtml(h.title) + '</span>';
            headHtml += '    <span class="habit-th-target">' + targetText + '</span>';
            headHtml += '  </div>';
            headHtml += '</th>';
        });
        headHtml += '<th class="habit-th-stats">' + (currentLang === 'vi' ? 'Tiến độ ngày' : 'Daily Progress') + '</th>';
        headHtml += '</tr>';
        this.tableHeadEl.innerHTML = headHtml;

        // 2. Render Tbody (28 to 31 rows)
        var totalDays = new Date(this.viewYear, this.viewMonth, 0).getDate();
        var todayStr = getTodayStr();
        var mKey = this._getMonthKey();
        var logs = (this.habitLogs[mKey] && this.habitLogs[mKey].days) || {};

        var weekdaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        var weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var bodyHtml = '';

        for (var d = 1; d <= totalDays; d++) {
            var dPad = String(d).padStart(2, '0');
            var mPad = String(this.viewMonth).padStart(2, '0');
            var dateStr = this.viewYear + '-' + mPad + '-' + dPad;
            var dateObj = new Date(this.viewYear, this.viewMonth - 1, d);
            var dayOfWeek = dateObj.getDay();
            var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            var isToday = dateStr === todayStr;
            var dayLabel = currentLang === 'vi' ? weekdaysVi[dayOfWeek] : weekdaysEn[dayOfWeek];

            var rowClasses = [];
            if (isWeekend) rowClasses.push('row-weekend');
            if (isToday) rowClasses.push('row-today');

            var completedHabitsCount = 0;

            var cellsHtml = '';
            activeHabits.forEach(function (h) {
                var cellData = (logs[dateStr] && logs[dateStr][h.id]) || { completed: false, value: 0 };
                var isDone = false;
                if (h.type === 'numeric') {
                    var val = cellData.value || 0;
                    isDone = val >= h.target;
                    if (isDone) completedHabitsCount++;
                    var pct = Math.min(100, Math.round((val / h.target) * 100));
                    cellsHtml += '<td>';
                    cellsHtml += '  <button type="button" class="habit-cell-numeric ' + (isDone ? 'completed' : '') + '" data-date="' + dateStr + '" data-id="' + h.id + '">';
                    cellsHtml += '    <span class="numeric-val-text">' + val + ' / ' + h.target + ' ' + (h.unit || '') + '</span>';
                    cellsHtml += '    <div class="numeric-mini-bar-bg"><div class="numeric-mini-bar-fill" style="width: ' + pct + '%;"></div></div>';
                    cellsHtml += '  </button>';
                    cellsHtml += '</td>';
                } else {
                    isDone = !!cellData.completed;
                    if (isDone) completedHabitsCount++;
                    cellsHtml += '<td>';
                    cellsHtml += '  <button type="button" class="habit-cell-checkbox ' + (isDone ? 'checked' : '') + '" data-date="' + dateStr + '" data-id="' + h.id + '">';
                    cellsHtml += isDone ? '✓' : '';
                    cellsHtml += '  </button>';
                    cellsHtml += '</td>';
                }
            });

            var dailyPercent = activeHabits.length > 0 ? Math.round((completedHabitsCount / activeHabits.length) * 100) : 0;
            var isPerfect = activeHabits.length > 0 && completedHabitsCount === activeHabits.length;

            bodyHtml += '<tr class="' + rowClasses.join(' ') + '">';
            bodyHtml += '  <td class="col-date">';
            if (isToday) bodyHtml += '<span class="today-dot"></span>';
            bodyHtml += '    <span class="date-num">' + dPad + '</span>';
            bodyHtml += '    <span class="date-weekday">' + dayLabel + '</span>';
            bodyHtml += '  </td>';
            bodyHtml += cellsHtml;
            bodyHtml += '  <td>';
            bodyHtml += '    <div class="daily-progress-cell">';
            bodyHtml += '      <div class="daily-progress-bar-bg">';
            bodyHtml += '        <div class="daily-progress-bar-fill" style="width: ' + dailyPercent + '%;"></div>';
            bodyHtml += '      </div>';
            bodyHtml += '      <span class="daily-progress-text">' + completedHabitsCount + '/' + activeHabits.length + ' (' + dailyPercent + '%)</span>';
            if (isPerfect) bodyHtml += '      <span class="daily-perfect-badge">⭐ 100%</span>';
            bodyHtml += '    </div>';
            bodyHtml += '  </td>';
            bodyHtml += '</tr>';
        }

        this.tableBodyEl.innerHTML = bodyHtml;
    };

    // --- Cell Interaction Handlers ---
    HabitApp.prototype._toggleCheckbox = function (dateStr, habitId, e) {
        var mKey = this._getMonthKey();
        if (!this.habitLogs[mKey]) this.habitLogs[mKey] = { month: mKey, days: {} };
        if (!this.habitLogs[mKey].days[dateStr]) this.habitLogs[mKey].days[dateStr] = {};

        var cur = this.habitLogs[mKey].days[dateStr][habitId] || { completed: false, value: 0 };
        var willComplete = !cur.completed;

        this.habitLogs[mKey].days[dateStr][habitId] = {
            completed: willComplete,
            value: willComplete ? 1 : 0
        };

        var habit = this.habits.find(function (h) { return h.id === habitId; });

        if (willComplete) {
            playChime();
            this.awardXP(10, 'Hoàn thành thói quen', e);
            if (habit) {
                PwaManager.showToast(t('habitCompletedToast').replace('{title}', habit.title), '🎉');
            }

            // Check if day is 100% completed
            var activeHabits = this.habits.filter(function (h) { return h.active !== false; });
            var dayData = this.habitLogs[mKey].days[dateStr];
            var allDone = activeHabits.length > 0 && activeHabits.every(function (h) {
                var entry = dayData[h.id];
                return entry && (h.type === 'numeric' ? entry.value >= h.target : entry.completed);
            });

            if (allDone) {
                this.awardXP(50, 'Ngày hoàn hảo 100%', e);
                PwaManager.showToast(t('perfectDayToast'), '⭐');
            }
        } else {
            // Deduct XP
            this.habitProfile.xp = Math.max(0, (this.habitProfile.xp || 0) - 10);
            this._saveProfile();
        }

        this._saveMonthLogs();
        this._calculateStreaks();
        this._renderMatrix();
    };

    HabitApp.prototype._openNumericModal = function (dateStr, habitId) {
        var habit = this.habits.find(function (h) { return h.id === habitId; });
        if (!habit) return;

        var mKey = this._getMonthKey();
        var entry = (this.habitLogs[mKey] && this.habitLogs[mKey].days && this.habitLogs[mKey].days[dateStr] && this.habitLogs[mKey].days[dateStr][habitId]) || { value: 0 };

        this.activeNumericCell = {
            dateStr: dateStr,
            habitId: habitId,
            target: habit.target,
            unit: habit.unit || '',
            name: habit.title
        };

        if (this.numericName) this.numericName.textContent = habit.title;
        if (this.numericTarget) this.numericTarget.textContent = (currentLang === 'vi' ? 'Mục tiêu: ' : 'Target: ') + habit.target + ' ' + (habit.unit || '');
        if (this.numericIcon) this.numericIcon.textContent = habit.icon || '🔢';
        if (this.numericUnit) this.numericUnit.textContent = habit.unit || '';
        if (this.numericValInput) this.numericValInput.value = entry.value || 0;

        // Quick Presets
        if (this.quickPresets) {
            var target = habit.target;
            var isMlOrWater = (habit.unit && habit.unit.toLowerCase().indexOf('ml') !== -1) || 
                              (habit.title && (habit.title.toLowerCase().indexOf('nước') !== -1 || habit.title.toLowerCase().indexOf('water') !== -1));
            var presets = [];
            if (isMlOrWater || target >= 1000) {
                presets = [100, 150, 200, 250, 500, 1000, target];
            } else if (target >= 500) {
                presets = [50, 100, 150, 200, 250, target];
            } else if (target >= 100) {
                presets = [10, 25, 50, 100, target];
            } else {
                presets = [1, 2, 5, target];
            }
            // Lọc trùng và sắp xếp tăng dần
            var uniquePresets = [];
            presets.forEach(function (p) {
                if (uniquePresets.indexOf(p) === -1 && p > 0) uniquePresets.push(p);
            });
            uniquePresets.sort(function (a, b) { return a - b; });
            presets = uniquePresets;
            var self = this;
            var html = '';
            presets.forEach(function (p) {
                html += '<button type="button" class="preset-chip" data-val="' + p + '">+' + p + ' ' + (habit.unit || '') + '</button>';
            });
            this.quickPresets.innerHTML = html;

            this.quickPresets.querySelectorAll('.preset-chip').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    var addVal = parseFloat(chip.getAttribute('data-val')) || 0;
                    var cur = parseFloat(self.numericValInput.value) || 0;
                    self.numericValInput.value = cur + addVal;
                });
            });
        }

        if (this.numericModal) this.numericModal.classList.add('active');
    };

    HabitApp.prototype._saveNumericModal = function () {
        if (!this.activeNumericCell) return;
        var dateStr = this.activeNumericCell.dateStr;
        var habitId = this.activeNumericCell.habitId;
        var target = this.activeNumericCell.target;
        var newVal = parseFloat(this.numericValInput.value) || 0;

        var mKey = this._getMonthKey();
        if (!this.habitLogs[mKey]) this.habitLogs[mKey] = { month: mKey, days: {} };
        if (!this.habitLogs[mKey].days[dateStr]) this.habitLogs[mKey].days[dateStr] = {};

        var oldEntry = this.habitLogs[mKey].days[dateStr][habitId] || { value: 0 };
        var wasDone = oldEntry.value >= target;
        var nowDone = newVal >= target;

        this.habitLogs[mKey].days[dateStr][habitId] = {
            completed: nowDone,
            value: newVal
        };

        if (!wasDone && nowDone) {
            playChime();
            this.awardXP(10, 'Đạt chỉ tiêu thói quen');
            PwaManager.showToast(t('habitCompletedToast').replace('{title}', this.activeNumericCell.name), '🎉');
        }

        this._saveMonthLogs();
        this._calculateStreaks();
        this._renderMatrix();
        if (this.numericModal) this.numericModal.classList.remove('active');
    };

    // --- Add / Edit Habit Modal ---
    HabitApp.prototype._openAddHabitModal = function () {
        this.editingHabitId = null;
        if (this.habitModalTitle) this.habitModalTitle.textContent = t('addHabit');
        if (this.habitNameInput) this.habitNameInput.value = '';
        if (this.targetInput) this.targetInput.value = '2000';
        if (this.unitInput) this.unitInput.value = 'ml';

        this.selectedType = 'checkbox';
        if (this.typePillCheckbox) this.typePillCheckbox.classList.add('active');
        if (this.typePillNumeric) this.typePillNumeric.classList.remove('active');
        if (this.numericRow) this.numericRow.style.display = 'none';

        this.selectedIcon = '💧';
        if (this.iconPicker) {
            this.iconPicker.querySelectorAll('.icon-preset-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-icon') === '💧');
            });
        }

        this.selectedColor = 'purple';
        if (this.colorPicker) {
            this.colorPicker.querySelectorAll('.color-dot').forEach(function (d) {
                d.classList.toggle('active', d.getAttribute('data-color') === 'purple');
            });
        }

        if (this.habitModal) this.habitModal.classList.add('active');
    };

    HabitApp.prototype._openEditHabitModal = function (habitId) {
        var habit = this.habits.find(function (h) { return h.id === habitId; });
        if (!habit) return;

        this.editingHabitId = habitId;
        if (this.habitModalTitle) this.habitModalTitle.textContent = t('editHabit');
        if (this.habitNameInput) this.habitNameInput.value = habit.title;
        if (this.targetInput) this.targetInput.value = habit.target || 1;
        if (this.unitInput) this.unitInput.value = habit.unit || '';

        this.selectedType = habit.type || 'checkbox';
        if (this.typePillCheckbox) this.typePillCheckbox.classList.toggle('active', this.selectedType === 'checkbox');
        if (this.typePillNumeric) this.typePillNumeric.classList.toggle('active', this.selectedType === 'numeric');
        if (this.numericRow) this.numericRow.style.display = this.selectedType === 'numeric' ? 'flex' : 'none';

        this.selectedIcon = habit.icon || '💧';
        if (this.iconPicker) {
            this.iconPicker.querySelectorAll('.icon-preset-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-icon') === habit.icon);
            });
        }

        this.selectedColor = habit.color || 'purple';
        if (this.colorPicker) {
            this.colorPicker.querySelectorAll('.color-dot').forEach(function (d) {
                d.classList.toggle('active', d.getAttribute('data-color') === habit.color);
            });
        }

        if (this.manageModal) this.manageModal.classList.remove('active');
        if (this.habitModal) this.habitModal.classList.add('active');
    };

    HabitApp.prototype._closeHabitModal = function () {
        if (this.habitModal) this.habitModal.classList.remove('active');
        this.editingHabitId = null;
    };

    HabitApp.prototype._saveHabitModal = function () {
        var title = (this.habitNameInput.value || '').trim();
        if (!title) {
            alert(currentLang === 'vi' ? 'Vui lòng nhập tên thói quen!' : 'Please enter habit name!');
            return;
        }

        var target = 1;
        var unit = '';
        if (this.selectedType === 'numeric') {
            target = parseFloat(this.targetInput.value) || 1;
            unit = (this.unitInput.value || '').trim();
        }

        if (this.editingHabitId) {
            var habit = this.habits.find(function (h) { return h.id === this.editingHabitId; }.bind(this));
            if (habit) {
                habit.title = title;
                habit.type = this.selectedType;
                habit.target = target;
                habit.unit = unit;
                habit.icon = this.selectedIcon;
                habit.color = this.selectedColor;
                this._saveHabitToDb(habit);
            }
        } else {
            var newHabit = {
                id: 'temp_' + generateId(),
                title: title,
                type: this.selectedType,
                target: target,
                unit: unit,
                icon: this.selectedIcon,
                color: this.selectedColor,
                active: true,
                order: this.habits.length + 1,
                createdAt: Date.now()
            };
            this.habits.push(newHabit);
            this._saveHabitToDb(newHabit);
        }

        this._closeHabitModal();
        this._render();
        PwaManager.showToast(currentLang === 'vi' ? 'Đã lưu thói quen thành công!' : 'Habit saved successfully!', '✨');
    };

    // --- Manage Modal ---
    HabitApp.prototype._openManageModal = function () {
        this._renderManageList();
        if (this.manageModal) this.manageModal.classList.add('active');
    };

    HabitApp.prototype._renderManageList = function () {
        var self = this;
        if (!this.manageList) return;
        if (this.habits.length === 0) {
            this.manageList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">' + t('emptyHabitTitle') + '</p>';
            return;
        }

        var html = '';
        this.habits.forEach(function (h) {
            var metaText = h.type === 'numeric' ? (h.target + ' ' + (h.unit || '')) : (currentLang === 'vi' ? 'Dạng Checkbox' : 'Checkbox');
            html += '<div class="habit-manage-item">';
            html += '  <div class="habit-manage-info">';
            html += '    <span class="habit-manage-icon">' + (h.icon || '🎯') + '</span>';
            html += '    <div>';
            html += '      <div class="habit-manage-name">' + escapeHtml(h.title) + '</div>';
            html += '      <div class="habit-manage-meta">' + metaText + '</div>';
            html += '    </div>';
            html += '  </div>';
            html += '  <div class="habit-manage-actions">';
            html += '    <button type="button" class="manage-btn-icon edit" data-id="' + h.id + '" title="Sửa">✏️</button>';
            html += '    <button type="button" class="manage-btn-icon delete" data-id="' + h.id + '" title="Xóa">🗑</button>';
            html += '  </div>';
            html += '</div>';
        });
        this.manageList.innerHTML = html;

        this.manageList.querySelectorAll('.manage-btn-icon.edit').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                self._openEditHabitModal(id);
            });
        });

        this.manageList.querySelectorAll('.manage-btn-icon.delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                showConfirmModal({
                    title: t('confirmModalTitle'),
                    message: t('confirmDeleteHabit'),
                    confirmText: t('confirmDelete'),
                    onConfirm: function () {
                        self._deleteHabitFromDb(id);
                        self._renderManageList();
                    }
                });
            });
        });
    };

    // --- Sync Month Table ---
    HabitApp.prototype._syncMonthTable = function () {
        var mKey = this._getMonthKey();
        if (!this.habitLogs[mKey]) this.habitLogs[mKey] = { month: mKey, days: {} };
        var totalDays = new Date(this.viewYear, this.viewMonth, 0).getDate();

        for (var d = 1; d <= totalDays; d++) {
            var dPad = String(d).padStart(2, '0');
            var mPad = String(this.viewMonth).padStart(2, '0');
            var dateStr = this.viewYear + '-' + mPad + '-' + dPad;
            if (!this.habitLogs[mKey].days[dateStr]) {
                this.habitLogs[mKey].days[dateStr] = {};
            }
        }

        this._saveMonthLogs();
        this._calculateStreaks();
        this._renderMatrix();
        PwaManager.showToast(currentLang === 'vi' ? 'Đã đồng bộ hóa bảng theo dõi tháng thành công!' : 'Synced month table successfully!', '📋');
    };

    // --- Gamification, XP & Streaks ---
    HabitApp.prototype.awardXP = function (amount, reason, e) {
        this.habitProfile.xp = (this.habitProfile.xp || 0) + amount;
        this._saveProfile();
        this._renderStats();

        if (e && e.clientX && e.clientY) {
            this._spawnXpFloat(e.clientX, e.clientY, '+' + amount + ' XP');
        }

        // Check milestones
        if (this.habitProfile.xp >= 500 && !this.habitProfile.badges.includes('xp_500')) {
            this.habitProfile.badges.push('xp_500');
            PwaManager.showToast('🏆 Mở khóa danh hiệu: Tia Chớp Năng Lượng (+500 XP)!', '⚡');
        }
        if (this.habitProfile.xp >= 1000 && !this.habitProfile.badges.includes('xp_1000')) {
            this.habitProfile.badges.push('xp_1000');
            PwaManager.showToast('👑 Mở khóa danh hiệu: Đại Sư Kỷ Luật (+1000 XP)!', '👑');
        }
    };

    HabitApp.prototype._calculateStreaks = function () {
        var activeHabits = this.habits.filter(function (h) { return h.active !== false; });
        if (activeHabits.length === 0) return;

        var mKey = this._getMonthKey();
        var logs = (this.habitLogs[mKey] && this.habitLogs[mKey].days) || {};

        var streak = 0;
        var today = new Date();
        var currentDayNum = today.getDate();
        if (this.viewYear !== today.getFullYear() || this.viewMonth !== (today.getMonth() + 1)) {
            // Viewing another month, just calculate from logs
            currentDayNum = new Date(this.viewYear, this.viewMonth, 0).getDate();
        }

        // Count streak backwards from today
        for (var d = currentDayNum; d >= 1; d--) {
            var dPad = String(d).padStart(2, '0');
            var mPad = String(this.viewMonth).padStart(2, '0');
            var dateStr = this.viewYear + '-' + mPad + '-' + dPad;

            var dayEntry = logs[dateStr];
            if (!dayEntry) break;

            var doneCount = 0;
            activeHabits.forEach(function (h) {
                var entry = dayEntry[h.id];
                if (entry && (h.type === 'numeric' ? entry.value >= h.target : entry.completed)) {
                    doneCount++;
                }
            });

            // Count streak if at least 1 habit was completed
            if (doneCount > 0) {
                streak++;
            } else if (d < currentDayNum) {
                // broken streak in the past -> ghi nhận vào lịch sử Quỹ kỷ luật nếu chưa có
                var penaltyDate = dPad + '/' + mPad + '/' + this.viewYear;
                if (!this.habitProfile.penalties) this.habitProfile.penalties = [];
                var alreadyLogged = this.habitProfile.penalties.some(function (p) { return p.date === penaltyDate; });
                if (!alreadyLogged && activeHabits.length > 0) {
                    this.habitProfile.penalties.unshift({
                        id: generateId(),
                        date: penaltyDate,
                        note: currentLang === 'vi' ? 'Bỏ lỡ toàn bộ thói quen trong ngày (Đứt chuỗi 🔥)' : 'Missed all daily habits (Streak broken 🔥)'
                    });
                }
                break;
            }
        }

        this.habitProfile.currentStreak = streak;
        this.habitProfile.longestStreak = Math.max(this.habitProfile.longestStreak || 0, streak);

        // Check badge unlocks
        if (streak >= 3 && !this.habitProfile.badges.includes('streak_3')) {
            this.habitProfile.badges.push('streak_3');
            PwaManager.showToast('🌱 Mở khóa danh hiệu: Mầm Xanh Kỷ Luật (Chuỗi 3 ngày)!', '🌱');
        }
        if (streak >= 7 && !this.habitProfile.badges.includes('streak_7')) {
            this.habitProfile.badges.push('streak_7');
            this.awardXP(100, 'Chuỗi 7 ngày');
            PwaManager.showToast('🥉 Mở khóa danh hiệu: Đà Tiến Tới (Chuỗi 7 ngày)! +100 XP', '🥉');
        }
        if (streak >= 21 && !this.habitProfile.badges.includes('streak_21')) {
            this.habitProfile.badges.push('streak_21');
            this.awardXP(300, 'Chuỗi 21 ngày');
            PwaManager.showToast('🥈 Mở khóa danh hiệu: Kỷ Luật Thép (Chuỗi 21 ngày)! +300 XP', '🥈');
        }
        if (streak >= 30 && !this.habitProfile.badges.includes('streak_30')) {
            this.habitProfile.badges.push('streak_30');
            this.awardXP(500, 'Chuỗi 30 ngày');
            PwaManager.showToast('🥇 Mở khóa danh hiệu: Bậc Thầy Thói Quen (Chuỗi 30 ngày)! +500 XP', '🥇');
        }

        this._saveProfile();
    };

    HabitApp.prototype._spawnXpFloat = function (x, y, text) {
        var el = document.createElement('div');
        el.className = 'xp-float-indicator';
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = (y - 20) + 'px';
        document.body.appendChild(el);
        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 1200);
    };

    // --- Reward Shop Modal ---
    HabitApp.prototype._openShopModal = function () {
        this._renderShop();
        if (this.shopModal) this.shopModal.classList.add('active');
    };

    HabitApp.prototype._renderShop = function () {
        var self = this;
        var xp = this.habitProfile.xp || 0;
        if (this.shopXpBalance) this.shopXpBalance.textContent = xp;

        if (!this.shopItemsList) return;
        var rewards = this.habitProfile.rewards || [];

        if (rewards.length === 0) {
            this.shopItemsList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">' + (currentLang === 'vi' ? 'Chưa có phần thưởng nào.' : 'No rewards yet.') + '</p>';
            return;
        }

        var html = '';
        rewards.forEach(function (rw) {
            var canAfford = xp >= rw.cost;
            html += '<div class="shop-item-card">';
            html += '  <div class="shop-item-info">';
            html += '    <span class="shop-item-icon">' + (rw.icon || '🎁') + '</span>';
            html += '    <div>';
            html += '      <div class="shop-item-title">' + escapeHtml(rw.title) + '</div>';
            html += '      <div class="shop-item-cost">' + rw.cost + ' XP</div>';
            html += '    </div>';
            html += '  </div>';
            html += '  <button type="button" class="shop-redeem-btn" data-id="' + rw.id + '" ' + (canAfford ? '' : 'disabled') + '>';
            html += currentLang === 'vi' ? 'Đổi quà' : 'Redeem';
            html += '  </button>';
            html += '</div>';
        });
        this.shopItemsList.innerHTML = html;

        this.shopItemsList.querySelectorAll('.shop-redeem-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var rwId = btn.getAttribute('data-id');
                var rw = rewards.find(function (r) { return r.id === rwId; });
                if (!rw) return;
                if ((self.habitProfile.xp || 0) < rw.cost) {
                    alert(t('notEnoughXp'));
                    return;
                }
                self.habitProfile.xp -= rw.cost;
                playChime();
                self._saveProfile();
                self._renderShop();
                PwaManager.showToast(t('redeemSuccess').replace('{title}', rw.title).replace('{xp}', rw.cost), rw.icon || '🎁');
            });
        });
    };

    // --- Badges Modal ---
    HabitApp.prototype._openBadgesModal = function () {
        this._renderBadges();
        if (this.badgesModal) this.badgesModal.classList.add('active');
    };

    HabitApp.prototype._renderBadges = function () {
        if (!this.badgesGrid) return;
        var unlocked = this.habitProfile.badges || [];
        var html = '';

        ALL_HABIT_BADGES.forEach(function (b) {
            var isUnlocked = unlocked.includes(b.id);
            var name = currentLang === 'vi' ? b.nameVi : b.nameEn;
            var desc = currentLang === 'vi' ? b.descVi : b.descEn;

            html += '<div class="badge-item-card ' + (isUnlocked ? 'unlocked' : 'locked') + '">';
            html += '  <span class="badge-icon">' + b.icon + '</span>';
            html += '  <div class="badge-info">';
            html += '    <div class="badge-name">' + name + (isUnlocked ? ' ✓' : '') + '</div>';
            html += '    <div class="badge-desc">' + desc + '</div>';
            html += '  </div>';
            html += '</div>';
        });

        this.badgesGrid.innerHTML = html;
    };

    // --- Discipline Fund Modal ---
    HabitApp.prototype._openDisciplineModal = function () {
        this._renderDiscipline();
        if (this.disciplineModal) this.disciplineModal.classList.add('active');
    };

    HabitApp.prototype._renderDiscipline = function () {
        if (this.disciplinePledgeInput) {
            this.disciplinePledgeInput.value = this.habitProfile.pledge || '10.000 VNĐ vào heo đất';
        }
        if (!this.disciplineLogsList) return;
        var penalties = this.habitProfile.penalties || [];

        if (penalties.length === 0) {
            this.disciplineLogsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">' + (currentLang === 'vi' ? 'Chưa ghi nhận vi phạm nào. Bạn đang giữ kỷ luật rất tốt! 🔥' : 'No penalties logged. You are keeping discipline great! 🔥') + '</p>';
            return;
        }

        var html = '';
        penalties.forEach(function (p) {
            html += '<div class="penalty-log-item">';
            html += '  <span class="penalty-log-date">' + p.date + '</span>';
            html += '  <span class="penalty-log-note">' + escapeHtml(p.note || 'Bỏ lỡ thói quen') + '</span>';
            html += '</div>';
        });
        this.disciplineLogsList.innerHTML = html;
    };

    // =========================================================
    //  PWA INSTALLATION MANAGER
    // =========================================================
    var PwaManager = (function () {
        var deferredPrompt = null;
        var headerBtn = null;
        var loginBtn = null;
        var banner = null;
        var bannerInstallBtn = null;
        var bannerCloseBtn = null;
        var guideModal = null;
        var guideCloseBtn = null;
        var guideOkBtn = null;
        var toastEl = null;
        var toastTimer = null;

        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

        function init() {
            headerBtn = document.getElementById('btn-header-install');
            loginBtn = document.getElementById('btn-login-install');
            banner = document.getElementById('pwa-install-banner');
            bannerInstallBtn = document.getElementById('pwa-banner-install-btn');
            bannerCloseBtn = document.getElementById('pwa-banner-close');
            guideModal = document.getElementById('pwa-guide-modal');
            guideCloseBtn = document.getElementById('pwa-guide-close');
            guideOkBtn = document.getElementById('pwa-guide-ok');
            toastEl = document.getElementById('pwa-toast');

            // If already installed (running in standalone app mode)
            if (isStandalone) {
                if (headerBtn) {
                    headerBtn.classList.add('installed');
                    headerBtn.title = t('alreadyInstalledToast');
                }
                var loginWrapper = document.getElementById('login-install-wrapper');
                if (loginWrapper) loginWrapper.style.display = 'none';
                return;
            }

            // Capture beforeinstallprompt event (Chromium on Android / Windows / Mac)
            window.addEventListener('beforeinstallprompt', function (e) {
                e.preventDefault();
                deferredPrompt = e;
                showInstallPrompts();
            });

            // App installed event
            window.addEventListener('appinstalled', function () {
                deferredPrompt = null;
                hideInstallPrompts();
                if (headerBtn) {
                    headerBtn.classList.add('installed');
                }
                showToast(t('installedToast'), '🎉');
            });

            // If on iOS Safari, install is supported via Add to Home Screen
            if (isIOS && !isStandalone) {
                showInstallPrompts();
            }

            // Bind click handlers
            if (headerBtn) {
                headerBtn.addEventListener('click', handleInstallClick);
            }
            if (loginBtn) {
                loginBtn.addEventListener('click', handleInstallClick);
            }
            if (bannerInstallBtn) {
                bannerInstallBtn.addEventListener('click', handleInstallClick);
            }
            if (bannerCloseBtn) {
                bannerCloseBtn.addEventListener('click', function () {
                    if (banner) banner.style.display = 'none';
                    sessionStorage.setItem('pwa_banner_dismissed', 'true');
                });
            }

            // Guide modal handlers
            if (guideCloseBtn) {
                guideCloseBtn.addEventListener('click', closeGuideModal);
            }
            if (guideOkBtn) {
                guideOkBtn.addEventListener('click', closeGuideModal);
            }
            if (guideModal) {
                guideModal.addEventListener('click', function (e) {
                    if (e.target === guideModal) closeGuideModal();
                });
            }
        }

        function showInstallPrompts() {
            if (isStandalone) return;
            var dismissed = sessionStorage.getItem('pwa_banner_dismissed');
            if (!dismissed && banner) {
                setTimeout(function () {
                    if (banner && !sessionStorage.getItem('pwa_banner_dismissed') && !isStandalone) {
                        banner.style.display = 'flex';
                    }
                }, 1200);
            }
        }

        function hideInstallPrompts() {
            if (banner) banner.style.display = 'none';
            var loginWrapper = document.getElementById('login-install-wrapper');
            if (loginWrapper) loginWrapper.style.display = 'none';
        }

        function handleInstallClick() {
            if (isStandalone) {
                showToast(t('alreadyInstalledToast'), '✨');
                return;
            }

            // 1. If deferredPrompt exists (Chrome/Android/Edge)
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function (choiceResult) {
                    if (choiceResult && choiceResult.outcome === 'accepted') {
                        hideInstallPrompts();
                    }
                    deferredPrompt = null;
                });
                return;
            }

            // 2. If iOS Safari or unsupported automated prompt: show Guide Modal
            openGuideModal();
        }

        function openGuideModal() {
            if (!guideModal) return;

            var titleEl = document.getElementById('pwa-guide-title');
            var step1El = document.getElementById('pwa-step-1');
            var step2El = document.getElementById('pwa-step-2');
            var step3El = document.getElementById('pwa-step-3');

            if (isIOS) {
                if (titleEl) titleEl.textContent = t('pwaGuideTitle') + ' (iOS)';
                if (step1El) step1El.innerHTML = t('iosStep1');
                if (step2El) step2El.innerHTML = t('iosStep2');
                if (step3El) step3El.innerHTML = t('iosStep3');
            } else {
                if (titleEl) titleEl.textContent = t('pwaGuideTitle');
                if (step1El) step1El.innerHTML = t('desktopStep1');
                if (step2El) step2El.innerHTML = t('desktopStep2');
                if (step3El) step3El.innerHTML = t('desktopStep3');
            }

            guideModal.classList.add('active');
        }

        function closeGuideModal() {
            if (guideModal) guideModal.classList.remove('active');
        }

        function showToast(msg, icon) {
            if (!toastEl) return;
            var iconEl = document.getElementById('pwa-toast-icon');
            var msgEl = document.getElementById('pwa-toast-msg');
            if (iconEl && icon) iconEl.textContent = icon;
            if (msgEl) msgEl.textContent = msg;

            toastEl.style.display = 'flex';
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toastEl.style.display = 'none';
            }, 3500);
        }

        return {
            init: init,
            handleInstallClick: handleInstallClick,
            showToast: showToast
        };
    })();

    // =========================================================
    //  BATTERY GUIDE MODAL & SERVICE WORKER MESSAGES
    // =========================================================
    function initBatteryGuideModal() {
        var modal = document.getElementById('battery-guide-modal');
        var triggerBtn = document.getElementById('todo-battery-tip-btn');
        var closeBtn = document.getElementById('battery-guide-close');
        var okBtn = document.getElementById('battery-guide-ok');

        if (!modal) return;

        function openModal() {
            modal.classList.add('active');
        }
        function closeModal() {
            modal.classList.remove('active');
        }

        if (triggerBtn) {
            triggerBtn.addEventListener('click', openModal);
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        if (okBtn) {
            okBtn.addEventListener('click', function () {
                closeModal();
                localStorage.setItem('flowhub_battery_guide_seen', 'true');
            });
        }

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Listen for Service Worker lock screen actions (complete, snooze)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', function (event) {
            if (!event.data) return;
            if (event.data.type === 'TASK_ACTION') {
                var taskId = event.data.taskId;
                if (window.__todoApp && taskId) {
                    if (event.data.action === 'complete') {
                        window.__todoApp.completeTaskById(taskId);
                    } else if (event.data.action === 'snooze') {
                        window.__todoApp.snoozeTaskById(taskId, event.data.minutes || 5);
                    }
                }
            }
        });
    }

    // =========================================================
    //  INITIALIZATION
    // =========================================================
    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        setLanguage(currentLang);
        initAuth();
        initConfirmModal();
        initBatteryGuideModal();
        PwaManager.init();

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
            if (window.__habitApp) window.__habitApp._render();
        });

        // App Reload (F5) button
        var reloadBtn = document.getElementById('btn-app-reload');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', function () {
                reloadBtn.classList.add('spinning');
                setTimeout(function () {
                    window.location.reload();
                }, 200);
            });
        }

        // Create app instances
        window.__pomodoroApp = new PomodoroTimer();
        window.__todoApp = new TodoList();
        window.__noteApp = new NoteApp();
        window.__priceApp = new PriceApp();
        window.__habitApp = new HabitApp();
    });
})();
