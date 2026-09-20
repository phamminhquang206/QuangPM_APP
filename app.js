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
            allNotes: 'Tất cả', uncategorized: 'Chưa phân loại',
            newFolder: 'Thư mục mới', newFolderText: 'Thư mục',
            editFolder: 'Sửa tên', deleteFolder: 'Xóa thư mục',
            folderName: 'Tên thư mục', folderNamePlaceholder: 'Ví dụ: Công việc, Học tập, Dự án...',
            moveSelected: '📁 Di chuyển', moveToFolder: 'Di chuyển ghi chú',
            selectTargetFolder: 'Chọn thư mục đích cho các ghi chú đã chọn:',
            confirmDeleteFolderMsg: 'Bạn có chắc muốn xóa thư mục này? Các ghi chú bên trong sẽ được chuyển về "Chưa phân loại".',
            notionShortcutsTip: '💡 Phím tắt: # Tiêu đề, - Danh sách, [] To-do, > Trích dẫn',
            notionEditorPlaceholder: 'Gõ nội dung hoặc dùng phím tắt #, -, [], > ...',
            noteImageUploadTitle: 'Tải ảnh lên',
            noteImageUploading: 'Đang tải {count} ảnh lên...',
            noteImageUploadingProgress: 'Đang tải {count} ảnh lên Cloudinary... {percent}%',
            noteImageUploadSuccess: 'Đã thêm ảnh vào ghi chú',
            noteImageUploadError: 'Không thể tải ảnh lên. Vui lòng thử lại.',
            noteImageUploadTimeout: 'Tải ảnh quá lâu. Vui lòng kiểm tra kết nối rồi thử lại.',
            noteImageUploadConfigError: 'Chưa cấu hình Cloudinary cho Notes.',
            noteImageTooLarge: 'Ảnh phải nhỏ hơn 10 MB.',
            noteImageUploadPending: 'Vui lòng chờ ảnh tải lên xong trước khi lưu.',
            emptyFolderNotes: 'Thư mục này chưa có ghi chú nào',
            addNoteToFolder: '+ Tạo ghi chú vào thư mục này',
            folderCreatedToast: 'Đã tạo thư mục mới! 📁',
            folderUpdatedToast: 'Đã đổi tên thư mục! 📁',
            folderDeletedToast: 'Đã xóa thư mục! 🗑',
            notesMovedToast: 'Đã di chuyển ghi chú thành công! 📁',
            removeFromFolder: 'Bỏ khỏi thư mục (Chưa phân loại)',
            editNoteBtn: 'Chỉnh sửa',
            doneBtn: 'Xong',
            tapToEditTip: '💡 Đang ở chế độ xem an toàn. Bấm ✏️ để chỉnh sửa',
            close: 'Đóng',
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
            installNotReadyToast: 'Trình duyệt chưa cho phép cài trực tiếp. Hãy mở FlowHub qua HTTPS và tải lại trang.',
            installFailedToast: 'Chưa mở được hộp thoại cài đặt. Hãy tải lại trang và thử lại.',
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
            notEnoughXp: 'Bạn chưa đủ điểm XP để đổi phần thưởng này!',
            // MyGarden
            gardenTab: 'MyGarden',
            gardenFocusTab: 'Tập trung',
            gardenLandTab: 'Khu vườn',
            gardenHistoryTab: 'Lịch sử',
            gardenFocusEyebrow: 'DÀNH MỘT CHÚT THỜI GIAN CHO BẠN',
            gardenGrowingEyebrow: 'MỘT MẦM SỐNG ĐANG LỚN LÊN',
            gardenFocusMessage: 'Đặt điện thoại xuống. Để khu vườn lớn lên.',
            gardenGrowingMessage: 'Cứ chậm rãi. Thời gian này là của bạn.',
            gardenDialHint: 'Xoay vòng quanh cây để chọn số phút',
            gardenStartAction: 'Bắt đầu {verb} ↗',
            gardenGiveUpAction: 'Kết thúc sớm',
            gardenLandEyebrow: 'TỪ NHỮNG PHÚT BẠN TẬP TRUNG',
            gardenLandTitle: 'Khu vườn của bạn',
            gardenLandHint: 'Chọn một ô đất trống để gieo mầm.',
            gardenLandGrowingHint: 'Mầm đang lớn. Hãy ngắm vườn trong lúc tập trung.',
            gardenStatPlants: 'Sinh vật',
            gardenStatMinutes: 'Phút tập trung',
            gardenStatSessions: 'Phiên hoàn thành',
            gardenHistoryEyebrow: 'DỮ LIỆU ĐÁM MÂY',
            gardenHistoryTitle: '📊 Lịch sử tập trung',
            chooseSpeciesTitle: 'Chọn một mầm sống',
            chooseSpeciesSub: 'Mỗi phiên hoàn thành là một thành viên mới trong khu vườn.',
            cancelFocusTitle: 'Dừng phiên tập trung?',
            cancelFocusDesc: 'Sinh vật của phiên này sẽ không được thêm vào vườn. Bạn có thể bắt đầu lại bất cứ lúc nào.',
            keepFocusBtn: 'Tiếp tục tập trung',
            giveUpBtn: 'Kết thúc sớm',
            unlockProgressText: 'Đã tập trung {h} giờ {m} phút · Còn {rem} phút để mở khóa 3 sinh vật mới.',
            allUnlockedText: 'Bạn đã mở khóa toàn bộ bộ sưu tập 18 sinh vật!',
            sessionCompleteToast: 'Hoàn thành! Khu vườn có một thành viên mới ✿',
            unlockSpeciesToast: 'Hoàn thành! Mở khóa thêm: {names}',
            cancelSessionToast: 'Ô đất vẫn còn trống. Khi sẵn sàng, hãy thử lại.',
            selectPlotToast: 'Đã chọn ô đất {index}',
            finishCurrentSessionFirst: 'Hãy hoàn thành phiên hiện tại trước khi gieo mầm mới.'
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
            allNotes: 'All Notes', uncategorized: 'Uncategorized',
            newFolder: 'New Folder', newFolderText: 'Folder',
            editFolder: 'Rename', deleteFolder: 'Delete Folder',
            folderName: 'Folder Name', folderNamePlaceholder: 'e.g. Work, Study, Projects...',
            moveSelected: '📁 Move', moveToFolder: 'Move Notes',
            selectTargetFolder: 'Select destination folder for selected notes:',
            confirmDeleteFolderMsg: 'Are you sure you want to delete this folder? Notes inside will be moved to "Uncategorized".',
            notionShortcutsTip: '💡 Shortcuts: # Heading, - List, [] To-do, > Quote',
            notionEditorPlaceholder: 'Type content or use shortcuts #, -, [], > ...',
            noteImageUploadTitle: 'Upload image',
            noteImageUploading: 'Uploading {count} image(s)...',
            noteImageUploadingProgress: 'Uploading {count} image(s) to Cloudinary... {percent}%',
            noteImageUploadSuccess: 'Image added to note',
            noteImageUploadError: 'Could not upload the image. Please try again.',
            noteImageUploadTimeout: 'The image upload timed out. Check your connection and try again.',
            noteImageUploadConfigError: 'Cloudinary is not configured for Notes.',
            noteImageTooLarge: 'Images must be smaller than 10 MB.',
            noteImageUploadPending: 'Please wait for the image upload to finish before saving.',
            emptyFolderNotes: 'No notes in this folder',
            addNoteToFolder: '+ Create note in this folder',
            folderCreatedToast: 'Folder created! 📁',
            folderUpdatedToast: 'Folder renamed! 📁',
            folderDeletedToast: 'Folder deleted! 🗑',
            notesMovedToast: 'Notes moved successfully! 📁',
            removeFromFolder: 'Remove from folder (Uncategorized)',
            editNoteBtn: 'Edit',
            doneBtn: 'Done',
            tapToEditTip: '💡 Safe view mode. Tap ✏️ to edit',
            close: 'Close',
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
            installNotReadyToast: 'Direct installation is not available yet. Open FlowHub over HTTPS and reload the page.',
            installFailedToast: 'Could not open the installation dialog. Reload the page and try again.',
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
            notEnoughXp: 'Not enough XP to redeem this reward!',
            // MyGarden
            gardenTab: 'MyGarden',
            gardenFocusTab: 'Focus',
            gardenLandTab: 'Garden',
            gardenHistoryTab: 'History',
            gardenFocusEyebrow: 'TAKE A LITTLE TIME FOR YOURSELF',
            gardenGrowingEyebrow: 'A NEW LIFE IS GROWING',
            gardenFocusMessage: 'Put your phone down. Let the garden grow.',
            gardenGrowingMessage: 'Take your time. This moment is yours.',
            gardenDialHint: 'Rotate around the tree to pick minutes',
            gardenStartAction: 'Start {verb} ↗',
            gardenGiveUpAction: 'Give Up',
            gardenLandEyebrow: 'FROM YOUR FOCUSED MOMENTS',
            gardenLandTitle: 'Your Garden',
            gardenLandHint: 'Choose an empty plot to plant.',
            gardenLandGrowingHint: 'Growing nicely. Enjoy the garden during your session.',
            gardenStatPlants: 'Creatures',
            gardenStatMinutes: 'Focus Minutes',
            gardenStatSessions: 'Completed Sessions',
            gardenHistoryEyebrow: 'CLOUD DATA',
            gardenHistoryTitle: '📊 Focus History',
            chooseSpeciesTitle: 'Choose a Creature',
            chooseSpeciesSub: 'Each completed session adds a new member to your garden.',
            cancelFocusTitle: 'Stop focus session?',
            cancelFocusDesc: 'The creature from this session will not be added to the garden. You can try again anytime.',
            keepFocusBtn: 'Keep Focusing',
            giveUpBtn: 'Give Up',
            unlockProgressText: 'Focused {h}h {m}m · {rem}m remaining to unlock 3 new species.',
            allUnlockedText: 'You have unlocked the full collection of 18 species!',
            sessionCompleteToast: 'Completed! A new creature joined your garden ✿',
            unlockSpeciesToast: 'Completed! Unlocked: {names}',
            cancelSessionToast: 'The plot is still empty. Try again whenever you are ready.',
            selectPlotToast: 'Selected plot {index}',
            finishCurrentSessionFirst: 'Please complete the ongoing session before planting a new one.'
        }
    };

    // ===== I18N MANAGER =====
    var currentLang = 'vi';

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

    function setLanguage() {
        currentLang = 'vi';
        document.documentElement.lang = 'vi';
        applyI18nToDOM();
    }

    // ===== THEME MANAGER =====
    var THEME_STORAGE_KEY = 'flowhub_theme';

    function getTheme() {
        return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    }

    function updateThemeButton(theme) {
        var button = document.getElementById('btn-theme-toggle');
        if (!button) return;

        var isLight = theme === 'light';
        var label = isLight ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng';
        var icon = button.querySelector('.theme-toggle-icon');

        if (icon) icon.textContent = isLight ? '🌙' : '☀️';
        button.title = label;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(isLight));
    }

    function applyTheme(theme, persist) {
        var nextTheme = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        updateThemeButton(nextTheme);

        var themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) themeMeta.content = nextTheme === 'light' ? '#e9eef5' : '#7c3aed';

        if (persist) {
            try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch (error) { /* Storage may be unavailable. */ }
        }
    }

    function initThemeToggle() {
        var button = document.getElementById('btn-theme-toggle');
        applyTheme(getTheme(), false);
        if (!button) return;

        button.addEventListener('click', function () {
            applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);
        });
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
        var avatarFallbackEl = document.getElementById('user-avatar-fallback');
        var nameEl = document.getElementById('user-name');
        var accountMenu = document.getElementById('account-menu');
        var accountToggle = document.getElementById('account-menu-toggle');
        var accountPopover = document.getElementById('account-popover');

        function setAccountMenuOpen(open) {
            if (!accountMenu || !accountToggle || !accountPopover) return;
            accountMenu.classList.toggle('open', open);
            accountToggle.setAttribute('aria-expanded', String(open));
            accountPopover.hidden = !open;
        }

        if (accountToggle) {
            accountToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                setAccountMenuOpen(accountPopover.hidden);
            });
        }

        document.addEventListener('click', function (event) {
            if (accountMenu && !accountMenu.contains(event.target)) setAccountMenuOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && accountPopover && !accountPopover.hidden) {
                setAccountMenuOpen(false);
                accountToggle.focus();
            }
        });

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
            setAccountMenuOpen(false);
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
                var accountName = user.displayName || user.email || 'User';
                nameEl.textContent = accountName;
                accountToggle.title = accountName;
                accountToggle.setAttribute('aria-label', 'Mở menu tài khoản của ' + accountName);
                if (user.photoURL) {
                    avatarEl.src = user.photoURL;
                    avatarEl.hidden = false;
                    avatarFallbackEl.hidden = true;
                } else {
                    avatarEl.removeAttribute('src');
                    avatarEl.hidden = true;
                    avatarFallbackEl.textContent = accountName.trim().charAt(0) || 'U';
                    avatarFallbackEl.hidden = false;
                }
                loginPage.classList.add('hidden');
                appContainer.style.display = '';

                // Load data from Firestore
                loadAllUserData();
            } else {
                currentUser = null;
                setAccountMenuOpen(false);
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
                // Mobile browsers may keep :hover on the tapped tab until the
                // next touch. Remove focus so the new active color paints now.
                if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
                    btn.blur();
                }
                if (tab === 'prices' && window.FlowHubStockFeature) {
                    window.FlowHubStockFeature.refresh();
                }
            });
        });
    }

    // =========================================================
    //  MYGARDEN (FOREST POMODORO) ENGINE
    // =========================================================
    var GARDEN_SPECIES = [
        { id: 'pine', name: { vi: 'Cây thông', en: 'Pine Tree' }, icon: '🌲', stages: ['🌱', '🌿', '🌲'], verb: { vi: 'trồng', en: 'plant' } },
        { id: 'oak', name: { vi: 'Cây xanh', en: 'Oak Tree' }, icon: '🌳', stages: ['🌱', '🌿', '🌳'], verb: { vi: 'trồng', en: 'plant' } },
        { id: 'cherry', name: { vi: 'Anh đào', en: 'Cherry Blossom' }, icon: '🌸', stages: ['🌱', '🌿', '🌸'], verb: { vi: 'trồng', en: 'plant' } },
        { id: 'sunflower', name: { vi: 'Hướng dương', en: 'Sunflower' }, icon: '🌻', stages: ['🌱', '🌿', '🌻'], verb: { vi: 'trồng', en: 'plant' } },
        { id: 'rabbit', name: { vi: 'Thỏ nhỏ', en: 'Rabbit' }, icon: '🐇', stages: ['🐰', '🐰', '🐇'], verb: { vi: 'nuôi', en: 'raise' } },
        { id: 'cat', name: { vi: 'Mèo con', en: 'Kitten' }, icon: '🐈', stages: ['🐱', '🐱', '🐈'], verb: { vi: 'nuôi', en: 'raise' } }
    ];

    var GARDEN_ADDITIONS = [
        ['palm', { vi: 'Cây cọ', en: 'Palm Tree' }, '🌴', 'plant'],
        ['tulip', { vi: 'Tulip', en: 'Tulip' }, '🌷', 'plant'],
        ['dog', { vi: 'Cún nhỏ', en: 'Puppy' }, '🐕', 'raise'],
        ['cactus', { vi: 'Xương rồng', en: 'Cactus' }, '🌵', 'plant'],
        ['rose', { vi: 'Hoa hồng', en: 'Rose' }, '🌹', 'plant'],
        ['deer', { vi: 'Hươu', en: 'Deer' }, '🦌', 'raise'],
        ['bamboo', { vi: 'Tre xanh', en: 'Bamboo' }, '🎋', 'plant'],
        ['hibiscus', { vi: 'Dâm bụt', en: 'Hibiscus' }, '🌺', 'plant'],
        ['fox', { vi: 'Cáo nhỏ', en: 'Fox' }, '🦊', 'raise'],
        ['maple', { vi: 'Phong đỏ', en: 'Maple Tree' }, '🍁', 'plant'],
        ['lotus', { vi: 'Hoa sen', en: 'Lotus' }, '🪷', 'plant'],
        ['squirrel', { vi: 'Sóc nhỏ', en: 'Squirrel' }, '🐿️', 'raise']
    ];

    GARDEN_ADDITIONS.forEach(function (item, i) {
        var id = item[0], name = item[1], icon = item[2], type = item[3];
        var verb = type === 'plant' ? { vi: 'trồng', en: 'plant' } : { vi: 'nuôi', en: 'raise' };
        var stages = type === 'plant' ? ['🌱', '🌿', icon] : [icon, icon, icon];
        var unlockMinutes = (Math.floor(i / 3) + 1) * 300; // 5h, 10h, 15h, 20h
        GARDEN_SPECIES.push({ id: id, name: name, icon: icon, verb: verb, stages: stages, unlockMinutes: unlockMinutes });
    });

    var GARDEN_SOUNDS = {
        rain: './sound/liecio-calming-rain.mp3',
        stream: './sound/alex_jauk-calm-zen-river-flowing-228223.mp3',
        ambient: './sound/focus.mp3'
    };

    function totalGardenMinutes(state) {
        if (!state || !Array.isArray(state.plots)) return 0;
        return state.plots.reduce(function (sum, p) { return sum + (p && p.minutes ? p.minutes : 0); }, 0);
    }

    function isSpeciesUnlocked(state, speciesId) {
        var sp = GARDEN_SPECIES.find(function (s) { return s.id === speciesId; });
        if (!sp) return false;
        if (!sp.unlockMinutes) return true;
        return totalGardenMinutes(state) >= sp.unlockMinutes;
    }

    function freshGardenState() {
        return {
            version: 1,
            plots: Array(16).fill(null),
            session: null,
            selectedSpecies: 'pine',
            duration: 25,
            sound: 'rain',
            volume: 35
        };
    }

    function validGardenState(v) {
        if (!v || v.version !== 1 || !Array.isArray(v.plots) || v.plots.length < 16 || (v.plots.length % 16 !== 0)) {
            return freshGardenState();
        }
        var b = freshGardenState();
        b.plots = v.plots.map(function (p) {
            if (p && GARDEN_SPECIES.some(function (s) { return s.id === p.species; }) && Number.isFinite(p.minutes) && p.minutes > 0) {
                return {
                    species: p.species,
                    minutes: p.minutes,
                    completedAt: Number(p.completedAt) || 0,
                    id: String(p.id || ('plot-' + Date.now()))
                };
            }
            return null;
        });
        if (GARDEN_SPECIES.some(function (s) { return s.id === v.selectedSpecies; })) b.selectedSpecies = v.selectedSpecies;
        if (Number.isInteger(v.duration) && v.duration >= 0 && v.duration <= 180) b.duration = v.duration;
        if (['rain', 'stream', 'ambient'].indexOf(v.sound) !== -1) b.sound = v.sound;
        if (Number.isFinite(v.volume)) b.volume = Math.max(0, Math.min(100, v.volume));
        var s = v.session;
        if (s && typeof s.id === 'string' && GARDEN_SPECIES.some(function (x) { return x.id === s.species; }) &&
            Number.isInteger(s.plot) && s.plot >= 0 && s.plot < b.plots.length && !b.plots[s.plot] &&
            Number.isFinite(s.startedAt) && Number.isInteger(s.minutes) && s.minutes >= 1 && s.minutes <= 180 &&
            s.endsAt === s.startedAt + s.minutes * 60000) {
            b.session = Object.assign({}, s);
        }
        if (b.plots.every(Boolean)) b.plots.push.apply(b.plots, Array(16).fill(null));
        if (!isSpeciesUnlocked(b, b.selectedSpecies)) b.selectedSpecies = 'pine';
        return b;
    }

    function minutesFromPoint(x, y, cx, cy) {
        var angle = (Math.atan2(x - cx, cy - y) * 180 / Math.PI + 360) % 360;
        var sweep = (angle - 225 + 360) % 360;
        return Math.round((sweep <= 270 ? sweep : sweep < 315 ? 270 : 0) / 270 * 60);
    }

    function dialPosition(minutes) {
        var m = Math.max(0, Math.min(60, minutes));
        var angle = (225 + m / 60 * 270) * Math.PI / 180;
        return {
            x: 50 + Math.sin(angle) * 43.333333,
            y: 50 - Math.cos(angle) * 43.333333
        };
    }

    function formatTimeSeconds(totalSec) {
        var s = Math.max(0, totalSec);
        var mins = Math.floor(s / 60);
        var secs = s % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    // Main MyGarden App Controller (named PomodoroTimer for full compatibility)
    function PomodoroTimer() {
        this.KEY = 'flowhub_mygarden_v1';
        this.state = freshGardenState();
        this.selectedPlot = 0;
        this.page = 0;
        this.activeView = 'focus';
        this.audio = null;
        this.audioPlaying = false;
        this.soundRequest = 0;
        this.dialPointer = null;
        this.toastTimeout = null;

        // Compatibility dummy properties
        this.isRunning = false;
        this.isPaused = false;
        this.statusEl = { textContent: '' };
        this.startBtn = { textContent: '' };

        this._loadLocalState();
        this._cacheElements();
        this._bindEvents();
        this._bindDialEvents();
        this._restoreSession();
        this._loadHistory();
        this._render();

        var self = this;
        setInterval(function () {
            self._tick();
        }, 1000);
    }

    PomodoroTimer.prototype._cacheElements = function () {
        // Sub-nav buttons
        this.subnavFocus = document.getElementById('garden-subnav-focus');
        this.subnavGarden = document.getElementById('garden-subnav-garden');
        this.subnavHistory = document.getElementById('garden-subnav-history');

        // Views
        this.viewFocus = document.getElementById('garden-focus-view');
        this.viewGarden = document.getElementById('garden-land-view');
        this.viewHistory = document.getElementById('garden-history-view');

        // Focus scene
        this.dialEl = document.getElementById('duration-dial');
        this.dialProgress = document.getElementById('dial-progress');
        this.dialHandle = document.getElementById('dial-handle');
        this.plantArt = document.getElementById('plant-art');
        this.plantCaption = document.getElementById('plant-caption');
        this.focusLabel = document.getElementById('garden-focus-label');
        this.timerEl = document.getElementById('garden-timer');
        this.messageEl = document.getElementById('garden-message');
        this.chooseSpeciesBtn = document.getElementById('choose-species');
        this.speciesIcon = document.getElementById('choose-species-icon');
        this.speciesName = document.getElementById('choose-species-name');
        this.dialHint = document.getElementById('dial-hint');
        this.actionBtn = document.getElementById('garden-action');
        this.setupContainer = document.getElementById('garden-setup');

        // Sound bar
        this.soundToggleBtn = document.getElementById('garden-sound-toggle');
        this.soundKindSelect = document.getElementById('garden-sound-kind');
        this.soundVolumeInput = document.getElementById('garden-volume');

        // Garden view
        this.gardenCountBadge = document.getElementById('garden-count');
        this.gardenGrid = document.getElementById('garden-grid');
        this.gardenHint = document.getElementById('garden-hint');
        this.prevPageBtn = document.getElementById('garden-prev-page');
        this.nextPageBtn = document.getElementById('garden-next-page');
        this.pageLabel = document.getElementById('garden-page-label');
        this.statPlants = document.getElementById('garden-stat-plants');
        this.statMinutes = document.getElementById('garden-stat-minutes');
        this.statSessions = document.getElementById('garden-stat-sessions');

        // History
        this.historyListEl = document.getElementById('garden-history-list');

        // Dialogs
        this.speciesDialog = document.getElementById('species-dialog');
        this.speciesListEl = document.getElementById('species-list');
        this.unlockProgressEl = document.getElementById('unlock-progress');
        this.closeSpeciesBtn = document.getElementById('close-species');
        this.cancelDialog = document.getElementById('cancel-dialog');
        this.keepFocusBtn = document.getElementById('keep-focus');
        this.confirmCancelBtn = document.getElementById('confirm-cancel');
    };

    PomodoroTimer.prototype._loadLocalState = function () {
        try {
            var raw = localStorage.getItem(this.KEY);
            if (raw) {
                this.state = validGardenState(JSON.parse(raw));
            } else {
                // Check legacy myForest key if present
                var legacy = JSON.parse(localStorage.getItem('myForest') || '[]');
                if (Array.isArray(legacy) && legacy.length > 0) {
                    var trees = legacy.filter(function (x) { return x === '🌳'; });
                    this.state.plots = Array(Math.max(16, (Math.floor(trees.length / 16) + 1) * 16)).fill(null);
                    for (var i = 0; i < trees.length; i++) {
                        this.state.plots[i] = { id: 'legacy-' + i, species: 'oak', minutes: 25, completedAt: 0 };
                    }
                }
            }
        } catch (e) {
            console.warn('MyGarden state load warning:', e);
        }
        this.selectedPlot = this.state.session ? this.state.session.plot : this.state.plots.findIndex(function (p) { return !p; });
        if (this.selectedPlot < 0) this.selectedPlot = 0;
    };

    PomodoroTimer.prototype._save = function () {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(this.state));
            this._saveToCloud();
            return true;
        } catch (e) {
            console.warn('MyGarden save error:', e);
            return false;
        }
    };

    PomodoroTimer.prototype._saveToCloud = function () {
        if (!currentUser) return;
        try {
            var cleanPlots = this.state.plots.map(function (p) {
                return p ? { species: p.species, minutes: p.minutes, completedAt: p.completedAt, id: p.id } : null;
            });
            var payload = {
                version: 1,
                plots: cleanPlots,
                selectedSpecies: this.state.selectedSpecies,
                duration: this.state.duration,
                sound: this.state.sound,
                volume: this.state.volume,
                updatedAt: Date.now()
            };
            userDocRef('data').doc('garden').set(payload, { merge: true }).catch(function () {});
        } catch (e) {}
    };

    PomodoroTimer.prototype._loadCloudGarden = function () {
        if (!currentUser) return;
        var self = this;
        userDocRef('data').doc('garden').get().then(function (doc) {
            if (doc.exists) {
                var cloudData = doc.data();
                if (cloudData && Array.isArray(cloudData.plots)) {
                    var cloudMinutes = totalGardenMinutes(cloudData);
                    var localMinutes = totalGardenMinutes(self.state);
                    // If cloud has equal or more progress, adopt cloud state while preserving active session
                    if (cloudMinutes >= localMinutes) {
                        var currentSession = self.state.session;
                        self.state = validGardenState(cloudData);
                        if (currentSession) self.state.session = currentSession;
                        self._save();
                        self._render();
                    }
                }
            }
        }).catch(function (e) {
            console.warn('Cloud garden load error:', e);
        });
    };

    PomodoroTimer.prototype._bindEvents = function () {
        var self = this;

        // Subnav switching
        if (this.subnavFocus) this.subnavFocus.addEventListener('click', function () { self._switchView('focus'); });
        if (this.subnavGarden) this.subnavGarden.addEventListener('click', function () { self._switchView('garden'); });
        if (this.subnavHistory) this.subnavHistory.addEventListener('click', function () { self._switchView('history'); });

        // Action button (Start / Give up)
        if (this.actionBtn) {
            this.actionBtn.addEventListener('click', function () {
                if (self.state.session) {
                    if (self.cancelDialog) self.cancelDialog.showModal();
                } else {
                    var mins = self.state.duration;
                    if (!Number.isInteger(mins) || mins < 1 || mins > 60) {
                        toast(t('gardenDialHint'));
                        return;
                    }
                    if (self.state.plots[self.selectedPlot]) {
                        self.selectedPlot = self.state.plots.findIndex(function (p) { return !p; });
                        if (self.selectedPlot === -1) {
                            self.state.plots.push.apply(self.state.plots, Array(16).fill(null));
                            self.selectedPlot = self.state.plots.findIndex(function (p) { return !p; });
                        }
                    }
                    var now = Date.now();
                    self.state.session = {
                        id: 'ses-' + now,
                        plot: self.selectedPlot,
                        species: self.state.selectedSpecies,
                        minutes: mins,
                        startedAt: now,
                        endsAt: now + mins * 60000
                    };
                    self.isRunning = true;
                    self._save();
                    self._render();
                }
            });
        }

        // Cancel modal buttons
        if (this.keepFocusBtn) {
            this.keepFocusBtn.addEventListener('click', function () {
                if (self.cancelDialog) self.cancelDialog.close();
            });
        }
        if (this.confirmCancelBtn) {
            this.confirmCancelBtn.addEventListener('click', function () {
                self.state.session = null;
                self.isRunning = false;
                self._stopSound();
                self._save();
                if (self.cancelDialog) self.cancelDialog.close();
                self._render();
                toast(t('cancelSessionToast'));
            });
        }

        // Species picker button
        if (this.chooseSpeciesBtn) {
            this.chooseSpeciesBtn.addEventListener('click', function () {
                self._openSpeciesDialog();
            });
        }
        if (this.closeSpeciesBtn) {
            this.closeSpeciesBtn.addEventListener('click', function () {
                if (self.speciesDialog) self.speciesDialog.close();
            });
        }

        // Sound bar
        if (this.soundToggleBtn) {
            this.soundToggleBtn.addEventListener('click', function () {
                if (self.audio) self._stopSound();
                else self._startSound();
            });
        }
        if (this.soundKindSelect) {
            this.soundKindSelect.addEventListener('change', function () {
                var wasPlaying = !!self.audio;
                self.state.sound = self.soundKindSelect.value;
                self._save();
                if (wasPlaying) self._startSound();
            });
        }
        if (this.soundVolumeInput) {
            this.soundVolumeInput.addEventListener('input', function () {
                self.state.volume = Number(self.soundVolumeInput.value);
                if (self.audio) self.audio.volume = self.state.volume / 100;
                self._save();
            });
        }

        // Garden Pagination
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', function () {
                if (self.page > 0) {
                    self.page--;
                    self._renderGardenPlots();
                }
            });
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', function () {
                if (self.page < (self.state.plots.length / 16 - 1)) {
                    self.page++;
                    self._renderGardenPlots();
                }
            });
        }

        // Cross-tab and visibility sync
        window.addEventListener('storage', function (e) {
            if (e.key === self.KEY) {
                self._loadLocalState();
                if (!self.state.session) self._stopSound();
                self._render();
            }
        });
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                self._tick();
                self._render();
            }
        });
    };

    PomodoroTimer.prototype._bindDialEvents = function () {
        var self = this;
        var dial = this.dialEl;
        if (!dial) return;

        function drag(event) {
            if (self.state.session) return;
            var r = dial.getBoundingClientRect();
            var mins = minutesFromPoint(event.clientX, event.clientY, r.left + r.width / 2, r.top + r.height / 2);
            self.state.duration = mins;
            self._updateDialUI();
            self._save();
        }

        dial.addEventListener('pointerdown', function (event) {
            if (self.state.session || !event.isPrimary || event.button !== 0) return;
            var r = dial.getBoundingClientRect();
            var dist = Math.hypot(event.clientX - r.left - r.width / 2, event.clientY - r.top - r.height / 2);
            if (dist < r.width * 0.3) return; // ignore center clicks
            event.preventDefault();
            self.dialPointer = event.pointerId;
            dial.setPointerCapture(event.pointerId);
            if (event.pointerType === 'mouse') {
                dial.focus({ preventScroll: true });
            } else if (document.activeElement === dial) {
                dial.blur();
            }
            drag(event);
        });

        dial.addEventListener('pointermove', function (event) {
            if (event.pointerId === self.dialPointer) drag(event);
        });

        function endDial(event) {
            if (event.pointerId === self.dialPointer) {
                self.dialPointer = null;
                if (dial.hasPointerCapture(event.pointerId)) {
                    dial.releasePointerCapture(event.pointerId);
                }
            }
        }
        dial.addEventListener('pointerup', endDial);
        dial.addEventListener('pointercancel', endDial);
        dial.addEventListener('lostpointercapture', function () { self.dialPointer = null; });

        dial.addEventListener('keydown', function (event) {
            if (self.state.session) return;
            var steps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
            var mins;
            if (event.key === 'Home') mins = 0;
            else if (event.key === 'End') mins = 60;
            else if (event.key in steps) mins = Math.max(0, Math.min(60, self.state.duration + steps[event.key]));
            else return;
            event.preventDefault();
            self.state.duration = mins;
            self._updateDialUI();
            self._save();
        });
    };

    PomodoroTimer.prototype._switchView = function (viewName) {
        this.activeView = viewName;
        if (this.subnavFocus) this.subnavFocus.classList.toggle('active', viewName === 'focus');
        if (this.subnavGarden) this.subnavGarden.classList.toggle('active', viewName === 'garden');
        if (this.subnavHistory) this.subnavHistory.classList.toggle('active', viewName === 'history');

        if (this.viewFocus) this.viewFocus.style.display = viewName === 'focus' ? 'flex' : 'none';
        if (this.viewGarden) this.viewGarden.style.display = viewName === 'garden' ? 'flex' : 'none';
        if (this.viewHistory) this.viewHistory.style.display = viewName === 'history' ? 'flex' : 'none';

        if (viewName === 'garden') this._renderGardenPlots();
        if (viewName === 'history') this._loadHistory();
    };

    PomodoroTimer.prototype._updateDialUI = function () {
        var mins = Math.min(60, this.state.session ? this.state.session.minutes : this.state.duration);
        var pos = dialPosition(mins);
        if (this.dialEl) {
            this.dialEl.setAttribute('aria-valuenow', mins);
            this.dialEl.setAttribute('aria-valuetext', mins + ' phút');
            this.dialEl.setAttribute('aria-disabled', String(!!this.state.session));
            this.dialEl.tabIndex = this.state.session ? -1 : 0;
        }
        if (this.dialHandle) {
            this.dialHandle.style.left = pos.x + '%';
            this.dialHandle.style.top = pos.y + '%';
        }
        if (this.dialProgress) {
            this.dialProgress.style.strokeDasharray = mins + ' 60';
        }
        if (this.actionBtn) {
            this.actionBtn.disabled = !this.state.session && this.state.duration === 0;
        }
        if (!this.state.session && this.timerEl) {
            this.timerEl.textContent = formatTimeSeconds(this.state.duration * 60);
        }
    };

    PomodoroTimer.prototype._render = function () {
        var session = this.state.session;
        this.isRunning = !!session;
        var sp = GARDEN_SPECIES.find(function (s) { return s.id === (session ? session.species : this.state.selectedSpecies); }.bind(this)) || GARDEN_SPECIES[0];
        var lang = currentLang === 'en' ? 'en' : 'vi';
        var spName = sp.name[lang] || sp.name.vi;
        var spVerb = sp.verb[lang] || sp.verb.vi;

        var seconds = session ? Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000)) : this.state.duration * 60;
        if (this.timerEl) this.timerEl.textContent = formatTimeSeconds(seconds);

        var progress = session ? Math.max(0, Math.min(1, 1 - seconds / (session.minutes * 60))) : 1;
        var stageIdx = progress < 0.35 ? 0 : progress < 0.75 ? 1 : 2;

        if (this.plantArt) {
            this.plantArt.textContent = session ? sp.stages[stageIdx] : sp.icon;
            this.plantArt.setAttribute('aria-label', spName);
        }

        if (this.plantCaption) {
            this.plantCaption.textContent = session
                ? (spName + (lang === 'vi' ? ' đang lớn lên · ô ' : ' is growing · plot ') + (session.plot + 1))
                : (lang === 'vi' ? ('Một ' + spName.toLowerCase() + ' đang chờ bạn') : ('A ' + spName.toLowerCase() + ' is waiting for you'));
        }

        if (this.focusLabel) {
            this.focusLabel.textContent = session ? t('gardenGrowingEyebrow') : t('gardenFocusEyebrow');
        }

        if (this.messageEl) {
            this.messageEl.textContent = session ? t('gardenGrowingMessage') : t('gardenFocusMessage');
        }

        if (this.actionBtn) {
            this.actionBtn.textContent = session ? t('gardenGiveUpAction') : t('gardenStartAction').replace('{verb}', spVerb);
            this.actionBtn.classList.toggle('running', !!session);
        }

        if (this.setupContainer) {
            this.setupContainer.style.display = session ? 'none' : 'flex';
        }

        if (this.speciesIcon) this.speciesIcon.textContent = sp.icon;
        if (this.speciesName) this.speciesName.textContent = spName;

        if (this.soundKindSelect) this.soundKindSelect.value = this.state.sound;
        if (this.soundVolumeInput) this.soundVolumeInput.value = this.state.volume;

        this._updateDialUI();
        this._renderGardenPlots();
    };

    PomodoroTimer.prototype._renderGardenPlots = function () {
        var self = this;
        var session = this.state.session;
        var lang = currentLang === 'en' ? 'en' : 'vi';
        var occupied = this.state.plots.filter(Boolean);

        if (this.gardenCountBadge) {
            this.gardenCountBadge.textContent = occupied.length + ' / ' + this.state.plots.length;
        }
        if (this.statPlants) this.statPlants.textContent = occupied.length;
        if (this.statSessions) this.statSessions.textContent = occupied.length;
        if (this.statMinutes) this.statMinutes.textContent = totalGardenMinutes(this.state);

        var totalPages = Math.max(1, Math.ceil(this.state.plots.length / 16));
        this.page = Math.max(0, Math.min(this.page, totalPages - 1));
        if (this.pageLabel) this.pageLabel.textContent = (lang === 'vi' ? 'Khu ' : 'Area ') + (this.page + 1) + ' / ' + totalPages;
        if (this.prevPageBtn) this.prevPageBtn.disabled = this.page === 0;
        if (this.nextPageBtn) this.nextPageBtn.disabled = this.page >= totalPages - 1;

        if (this.gardenHint) {
            this.gardenHint.textContent = session ? t('gardenLandGrowingHint') : t('gardenLandHint');
        }

        if (!this.gardenGrid) return;
        this.gardenGrid.innerHTML = '';
        var slice = this.state.plots.slice(this.page * 16, this.page * 16 + 16);

        slice.forEach(function (plant, i) {
            var index = self.page * 16 + i;
            var isReserved = session && session.plot === index;
            var btn = document.createElement('button');
            btn.className = 'plot ' + (plant ? '' : 'empty ') + (isReserved ? 'reserved ' : '') + (!plant && self.selectedPlot === index ? 'selected' : '');

            var plantSp = plant ? (GARDEN_SPECIES.find(function (s) { return s.id === plant.species; }) || GARDEN_SPECIES[0]) : null;
            btn.textContent = plant ? plantSp.icon : (isReserved ? '🌱' : '+');

            btn.addEventListener('click', function () {
                if (plant) {
                    var spName = plantSp.name[lang] || plantSp.name.vi;
                    toast(spName + ' · ' + plant.minutes + (lang === 'vi' ? ' phút tập trung' : ' focus mins'));
                } else if (session) {
                    toast(t('finishCurrentSessionFirst'));
                } else {
                    self.selectedPlot = index;
                    self._switchView('focus');
                    toast(t('selectPlotToast').replace('{index}', index + 1));
                }
            });
            self.gardenGrid.appendChild(btn);
        });
    };

    PomodoroTimer.prototype._openSpeciesDialog = function () {
        var self = this;
        var minutes = totalGardenMinutes(this.state);
        var lang = currentLang === 'en' ? 'en' : 'vi';
        var next = GARDEN_SPECIES.find(function (s) { return (s.unlockMinutes || 0) > minutes; });

        if (this.unlockProgressEl) {
            if (next) {
                var h = Math.floor(minutes / 60);
                var m = minutes % 60;
                var rem = next.unlockMinutes - minutes;
                this.unlockProgressEl.textContent = t('unlockProgressText')
                    .replace('{h}', h).replace('{m}', m).replace('{rem}', rem);
            } else {
                this.unlockProgressEl.textContent = t('allUnlockedText');
            }
        }

        if (!this.speciesListEl) return;
        this.speciesListEl.innerHTML = '';

        GARDEN_SPECIES.forEach(function (sp) {
            var btn = document.createElement('button');
            var isCurrent = self.state.selectedSpecies === sp.id;
            var unlocked = isSpeciesUnlocked(self.state, sp.id);
            btn.className = 'species' + (isCurrent ? ' chosen' : '') + (!unlocked ? ' locked' : '');
            if (!unlocked) btn.disabled = true;

            var art = document.createElement('span');
            art.textContent = sp.icon;
            var spName = sp.name[lang] || sp.name.vi;
            btn.append(art, spName);

            if (!unlocked) {
                var hint = document.createElement('small');
                hint.textContent = '🔒 ' + (sp.unlockMinutes / 60) + (lang === 'vi' ? ' giờ' : ' hrs');
                btn.append(hint);
            }

            btn.addEventListener('click', function () {
                if (!isSpeciesUnlocked(self.state, sp.id)) return;
                self.state.selectedSpecies = sp.id;
                self._save();
                if (self.speciesDialog) self.speciesDialog.close();
                self._render();
            });

            self.speciesListEl.appendChild(btn);
        });

        if (this.speciesDialog) this.speciesDialog.showModal();
    };

    PomodoroTimer.prototype._restoreSession = function () {
        if (!this.state.session) return;
        var now = Date.now();
        if (now >= this.state.session.endsAt) {
            this._settleSession(now);
        } else {
            this.isRunning = true;
        }
    };

    PomodoroTimer.prototype._tick = function () {
        if (!this.state.session) return;
        var now = Date.now();
        if (now >= this.state.session.endsAt) {
            this._settleSession(now);
        } else {
            var s = Math.max(0, Math.ceil((this.state.session.endsAt - now) / 1000));
            if (this.timerEl) this.timerEl.textContent = formatTimeSeconds(s);
            var progress = 1 - s / (this.state.session.minutes * 60);
            var sp = GARDEN_SPECIES.find(function (x) { return x.id === this.state.session.species; }.bind(this)) || GARDEN_SPECIES[0];
            var stageIdx = progress < 0.35 ? 0 : progress < 0.75 ? 1 : 2;
            if (this.plantArt) this.plantArt.textContent = sp.stages[stageIdx];
        }
    };

    PomodoroTimer.prototype._settleSession = function (now) {
        var s = this.state.session;
        if (!s) return;
        var beforeMinutes = totalGardenMinutes(this.state);
        var completedPlot = s.plot;

        if (!this.state.plots[completedPlot]) {
            this.state.plots[completedPlot] = {
                id: s.id,
                species: s.species,
                minutes: s.minutes,
                completedAt: s.endsAt
            };
        }

        this.state.session = null;
        this.isRunning = false;

        // Auto expand if full
        if (this.state.plots.every(Boolean)) {
            this.state.plots.push.apply(this.state.plots, Array(16).fill(null));
        }

        this._stopSound();
        this._save();

        // Save session entry to Firestore history
        this._saveHistoryEntry(s.minutes, s.species);

        // Sound chime / beep
        playBeep(880, 300, 3);

        // Check unlocked new species
        var afterMinutes = totalGardenMinutes(this.state);
        var newlyUnlocked = GARDEN_SPECIES.filter(function (sp) {
            return (sp.unlockMinutes || 0) > beforeMinutes && (sp.unlockMinutes || 0) <= afterMinutes;
        });

        var lang = currentLang === 'en' ? 'en' : 'vi';
        if (newlyUnlocked.length > 0) {
            var names = newlyUnlocked.map(function (sp) { return sp.name[lang] || sp.name.vi; }).join(', ');
            toast(t('unlockSpeciesToast').replace('{names}', names));
        } else {
            toast(t('sessionCompleteToast'));
        }

        this.selectedPlot = this.state.plots.findIndex(function (p) { return !p; });
        if (this.selectedPlot < 0) this.selectedPlot = 0;
        this._render();
    };

    PomodoroTimer.prototype._saveHistoryEntry = function (minutes, speciesId) {
        if (!currentUser) return;
        var sp = GARDEN_SPECIES.find(function (s) { return s.id === speciesId; }) || GARDEN_SPECIES[0];
        var lang = currentLang === 'en' ? 'en' : 'vi';
        var entry = {
            mode: 'garden',
            duration: minutes,
            species: speciesId,
            speciesName: sp.name[lang] || sp.name.vi,
            speciesIcon: sp.icon,
            completedAt: getTimeStr(),
            date: getTodayStr()
        };
        var self = this;
        userDocRef('pomodoro_history').add(entry).then(function () {
            self._loadHistory();
        }).catch(function () {});
    };

    PomodoroTimer.prototype._loadHistory = function () {
        if (!currentUser) {
            if (this.historyListEl) {
                this.historyListEl.innerHTML = '<div class="history-empty">' + t('noHistory') + '</div>';
            }
            return;
        }
        var self = this;
        // Also check and load cloud garden state
        this._loadCloudGarden();

        userDocRef('pomodoro_history').orderBy('date', 'desc').get().then(function (snap) {
            var history = {};
            snap.forEach(function (doc) {
                var d = doc.data();
                if (!history[d.date]) history[d.date] = [];
                history[d.date].push(d);
            });
            self._renderHistory(history);
        }).catch(function (e) {
            console.warn('History load error:', e);
        });
    };

    PomodoroTimer.prototype._renderHistory = function (history) {
        if (!this.historyListEl) return;
        var days = Object.keys(history).sort().reverse();
        if (days.length === 0) {
            this.historyListEl.innerHTML = '<div class="history-empty" style="text-align:center; padding:24px 0; color:var(--garden-muted); font-size:13px;">' + t('noHistory') + '</div>';
            return;
        }
        var html = '';
        var locale = currentLang === 'vi' ? 'vi-VN' : 'en-US';
        days.forEach(function (day) {
            var items = history[day];
            var dateObj = new Date(day + 'T00:00:00');
            var dateStr = dateObj.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            html += '<div class="history-day" style="margin-bottom:14px;"><div class="history-date" style="font-size:12px; font-weight:600; color:var(--garden-mint); margin-bottom:6px;">' + dateStr + '</div>';
            items.forEach(function (item) {
                var icon = item.speciesIcon || '🌱';
                var name = item.speciesName || (item.species ? item.species : 'Cây trồng');
                var mins = item.duration || item.minutes || (item.mode === '50' ? 40 : 25);
                html += '<div class="history-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(36,95,84,0.3); border:1px solid rgba(213,233,167,0.15); border-radius:10px; margin-bottom:6px; font-size:13px;">' +
                    '<span>' + icon + ' ' + name + ' · ' + mins + 'm</span>' +
                    '<span style="color:var(--garden-muted); font-size:12px;">' + (item.completedAt || '') + '</span></div>';
            });
            html += '</div>';
        });
        this.historyListEl.innerHTML = html;
    };

    // Ambient Sound Manager
    PomodoroTimer.prototype._startSound = function () {
        var self = this;
        this._stopSound();
        var req = ++this.soundRequest;
        var trackUrl = GARDEN_SOUNDS[this.state.sound] || GARDEN_SOUNDS.rain;
        var player = new Audio(trackUrl);
        this.audio = player;
        player.loop = true;
        player.volume = (this.state.volume || 35) / 100;
        player.preload = 'auto';

        player.addEventListener('error', function () {
            if (self.audio === player) {
                self._stopSound();
                toast('Không tải được âm thanh. Hãy kết nối mạng một lần để Service Worker lưu ngoại tuyến.');
            }
        });

        player.play().then(function () {
            if (req !== self.soundRequest || self.audio !== player) {
                player.pause();
                return;
            }
            self.audioPlaying = true;
            if (self.soundToggleBtn) {
                self.soundToggleBtn.textContent = '⏸';
                self.soundToggleBtn.setAttribute('aria-pressed', 'true');
            }
        }).catch(function () {
            if (req === self.soundRequest) {
                self._stopSound();
            }
        });
    };

    PomodoroTimer.prototype._stopSound = function () {
        this.soundRequest++;
        if (this.audio) {
            this.audio.pause();
            this.audio.removeAttribute('src');
            this.audio.load();
        }
        this.audio = null;
        this.audioPlaying = false;
        if (this.soundToggleBtn) {
            this.soundToggleBtn.textContent = '♫';
            this.soundToggleBtn.setAttribute('aria-pressed', 'false');
        }
    };

    PomodoroTimer.prototype._onLanguageChange = function () {
        this._render();
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
    //  QUICK NOTES (NOTION-STYLE & FOLDER SYSTEM)
    // =========================================================
    function sanitizeNoteHtml(html) {
        if (!html) return '';
        var div = document.createElement('div');
        div.innerHTML = html;
        div.querySelectorAll('script, style, iframe, object, embed, form').forEach(function (el) {
            el.remove();
        });
        var allEls = div.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
            var el = allEls[i];
            for (var j = el.attributes.length - 1; j >= 0; j--) {
                var attr = el.attributes[j];
                if (attr.name.startsWith('on') || attr.name === 'formaction' || (attr.name === 'href' && attr.value.toLowerCase().startsWith('javascript:'))) {
                    el.removeAttribute(attr.name);
                }
            }
        }
        return div.innerHTML;
    }

    function formatInlineMarkdown(text) {
        if (!text) return '';
        var res = escapeHtml(text);

        // LaTeX arrows & mathematical arrows
        res = res
            .replace(/&dollar;\\rightarrow&dollar;/gi, '→')
            .replace(/\$\\rightarrow\$/gi, '→')
            .replace(/\\rightarrow/gi, '→')
            .replace(/&dollar;\\leftarrow&dollar;/gi, '←')
            .replace(/\$\\leftarrow\$/gi, '←')
            .replace(/\\leftarrow/gi, '←')
            .replace(/&dollar;\\leftrightarrow&dollar;/gi, '↔')
            .replace(/\$\\leftrightarrow\$/gi, '↔')
            .replace(/\\leftrightarrow/gi, '↔')
            .replace(/&dollar;\\Rightarrow&dollar;/gi, '⇒')
            .replace(/\$\\Rightarrow\$/gi, '⇒')
            .replace(/\\Rightarrow/gi, '⇒')
            .replace(/\s-&gt;\s/g, ' → ')
            .replace(/\s&lt;-\s/g, ' ← ');

        // Timestamps [MM:SS] or [HH:MM:SS]
        res = res.replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g, '<span class="notion-timestamp">[$1]</span>');

        // Inline code `code`
        res = res.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        // Bold **text** or __text__
        res = res.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        res = res.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        // Italic *text* or _text_
        res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        res = res.replace(/_([^_]+)_/g, '<em>$1</em>');
        // Strikethrough ~~text~~
        res = res.replace(/~~([^~]+)~~/g, '<s>$1</s>');

        return res;
    }

    function childrenToMarkdown(el) {
        if (!el || !el.childNodes) return '';
        var out = '';
        for (var i = 0; i < el.childNodes.length; i++) {
            out += nodeToMarkdown(el.childNodes[i]);
        }
        return out;
    }

    function nodeToMarkdown(node) {
        if (!node) return '';
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.replace(/\u00A0/g, ' ');
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        var tag = node.tagName.toLowerCase();

        // Skip toolbar or helper buttons
        if (node.classList.contains('notion-copy-code-btn') ||
            node.classList.contains('notion-code-header') ||
            node.classList.contains('callout-header')) {
            return '';
        }

        // Notion Callout block
        if (node.classList.contains('notion-callout')) {
            var type = 'NOTE';
            if (node.classList.contains('tip')) type = 'TIP';
            else if (node.classList.contains('important')) type = 'IMPORTANT';
            else if (node.classList.contains('warning')) type = 'WARNING';
            else if (node.classList.contains('info')) type = 'INFO';

            var bodyEl = node.querySelector('.notion-callout-body') || node.querySelector('.callout-content') || node;
            var bodyMd = childrenToMarkdown(bodyEl).trim();
            var calloutLines = bodyMd.split('\n').map(function (l) { return '> ' + l; }).join('\n');
            return '\n\n> [!' + type + ']\n' + calloutLines + '\n\n';
        }

        // Notion Code block wrapper
        if (node.classList.contains('notion-code-wrapper')) {
            var langEl = node.querySelector('.notion-code-lang');
            var lang = langEl ? langEl.textContent.trim() : '';
            var codeEl = node.querySelector('code');
            var codeText = codeEl ? codeEl.textContent : '';
            return '\n\n```' + lang + '\n' + codeText.replace(/\r\n/g, '\n').trim() + '\n```\n\n';
        }

        // Table container or table element
        if (node.classList.contains('notion-table-container')) {
            var tbl = node.querySelector('table');
            return tbl ? nodeToMarkdown(tbl) : '';
        }

        if (tag === 'table') {
            var trs = Array.from(node.querySelectorAll('tr'));
            if (trs.length === 0) return '';
            var mdRows = [];
            var maxCols = 0;

            trs.forEach(function (tr, rIdx) {
                var ths = tr.querySelectorAll('th');
                var tds = tr.querySelectorAll('td');
                var cells = ths.length > 0 ? ths : tds;
                var isHead = ths.length > 0 || rIdx === 0;
                if (cells.length === 0) return;

                if (cells.length > maxCols) maxCols = cells.length;

                var rowCells = Array.from(cells).map(function (c) {
                    var cellText = childrenToMarkdown(c).trim();
                    return cellText.replace(/\|/g, '\\|').replace(/\r?\n+/g, ' ');
                });
                mdRows.push('| ' + rowCells.join(' | ') + ' |');

                if (isHead && mdRows.length === 1) {
                    var seps = [];
                    for (var s = 0; s < rowCells.length; s++) seps.push(':---');
                    mdRows.push('| ' + seps.join(' | ') + ' |');
                }
            });

            return '\n\n' + mdRows.join('\n') + '\n\n';
        }

        // Todo rows
        if (node.classList.contains('notion-todo-row')) {
            var chk = node.querySelector('.notion-todo-checkbox');
            var isChecked = chk ? chk.checked : node.classList.contains('done');
            var txtEl = node.querySelector('.notion-todo-text') || node;
            var tText = childrenToMarkdown(txtEl).trim();
            return (isChecked ? '- [x] ' : '- [ ] ') + tText + '\n';
        }

        // Headings
        if (/^h[1-6]$/.test(tag)) {
            var hLevel = parseInt(tag.charAt(1), 10);
            var hPrefix = '#'.repeat(hLevel);
            return '\n\n' + hPrefix + ' ' + childrenToMarkdown(node).trim() + '\n\n';
        }

        // Unordered lists
        if (tag === 'ul') {
            var ulItems = [];
            for (var u = 0; u < node.children.length; u++) {
                ulItems.push(nodeToMarkdown(node.children[u]));
            }
            return '\n' + ulItems.join('') + '\n';
        }

        // Ordered lists
        if (tag === 'ol') {
            var startNum = parseInt(node.getAttribute('start') || '1', 10);
            var olItems = [];
            var currNum = startNum;
            for (var o = 0; o < node.children.length; o++) {
                var child = node.children[o];
                if (child.tagName.toLowerCase() === 'li') {
                    olItems.push(currNum + '. ' + childrenToMarkdown(child).trim() + '\n');
                    currNum++;
                } else {
                    olItems.push(nodeToMarkdown(child));
                }
            }
            return '\n' + olItems.join('') + '\n';
        }

        // List item
        if (tag === 'li') {
            var parts = [];
            for (var k = 0; k < node.childNodes.length; k++) {
                var cn = node.childNodes[k];
                if (cn.tagName && (cn.tagName.toLowerCase() === 'ul' || cn.tagName.toLowerCase() === 'ol')) {
                    var sub = nodeToMarkdown(cn).trim().split('\n').map(function (sl) {
                        return '   ' + sl;
                    }).join('\n');
                    parts.push('\n' + sub);
                } else {
                    parts.push(nodeToMarkdown(cn));
                }
            }
            return '- ' + parts.join('').trim() + '\n';
        }

        // Pre / Code
        if (tag === 'pre') {
            var codeEl = node.querySelector('code');
            var langMatch = codeEl ? (codeEl.className || '').match(/language-([a-zA-Z0-9_-]+)/) : null;
            var lang = langMatch ? langMatch[1] : '';
            var cText = codeEl ? codeEl.textContent : node.textContent;
            return '\n\n```' + lang + '\n' + cText.replace(/\r\n/g, '\n').trim() + '\n```\n\n';
        }

    if (node.classList && node.classList.contains('notion-timestamp')) {
        return node.textContent.trim();
    }

    // Block elements
    if (tag === 'p') {
        var pContent = childrenToMarkdown(node).trim();
        return pContent ? ('\n\n' + pContent + '\n\n') : '\n\n';
    }

    if (tag === 'div') {
        var divContent = childrenToMarkdown(node).trim();
        return divContent ? ('\n' + divContent + '\n') : '\n';
    }

    if (tag === 'blockquote') {
        var bqLines = childrenToMarkdown(node).trim().split('\n');
        return '\n\n' + bqLines.map(function (bl) { return '> ' + bl; }).join('\n') + '\n\n';
    }

    if (tag === 'hr') {
        return '\n\n---\n\n';
    }

    // Inline elements
    if (tag === 'strong' || tag === 'b') {
        return '**' + childrenToMarkdown(node) + '**';
    }
    if (tag === 'em' || tag === 'i') {
        return '*' + childrenToMarkdown(node) + '*';
    }
    if (tag === 'del' || tag === 's') {
        return '~~' + childrenToMarkdown(node) + '~~';
    }
    if (tag === 'code') {
        return '`' + node.textContent + '`';
    }
    if (tag === 'a') {
        var href = node.getAttribute('href') || '';
        return '[' + childrenToMarkdown(node) + '](' + href + ')';
    }
    if (tag === 'br') {
        return '\n';
    }

    return childrenToMarkdown(node);
    }

    function notionHtmlToMarkdown(contentOrEl) {
        if (!contentOrEl) return '';
        if (typeof contentOrEl === 'string') {
            if (!/<[a-z][\s\S]*>/i.test(contentOrEl)) {
                return contentOrEl;
            }
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentOrEl;
            return nodeToMarkdown(tempDiv).trim().replace(/\n{3,}/g, '\n\n');
        }
        if (contentOrEl.nodeType) {
            return nodeToMarkdown(contentOrEl).trim().replace(/\n{3,}/g, '\n\n');
        }
        return '';
    }

    function containsMarkdownSyntax(str) {
        if (!str) return false;
        if (/```/.test(str)) return true;
        if (/`[^`\n]+`/.test(str)) return true;
        if (/(?:^|\n)\s*#{1,6}\s+\S/m.test(str)) return true;
        if (/(?:^|\n)\s*>\s+\S/m.test(str)) return true;
        if (/(?:^|\n)\s*[-*+]\s+\S/m.test(str)) return true;
        if (/(?:^|\n)\s*\d+\.\s+\S/m.test(str)) return true;
        if (/\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_/.test(str)) return true;
        if (/~~[^~\n]+~~/.test(str)) return true;
        if (/(?:^|\n)\s*(?:---|___|\*\*\*)\s*(?:$|\n)/m.test(str)) return true;
        if (/\[[ xX]\]/.test(str)) return true;
        if (/\|[^\n]+\|/.test(str)) return true;
        if (/\$\\rightarrow\$/i.test(str) || /\\rightarrow/i.test(str)) return true;
        return false;
    }

    function postProcessNotionHtml(html) {
        if (!html) return '';
        var div = document.createElement('div');
        div.innerHTML = html;

        // Convert task-list-item or li with checkbox into .notion-todo-row
        div.querySelectorAll('li').forEach(function (li) {
            var checkbox = li.querySelector('input[type="checkbox"]');
            if (checkbox) {
                var isChecked = checkbox.checked || checkbox.hasAttribute('checked');
                checkbox.remove();
                var text = li.innerHTML.trim();

                var todoRow = document.createElement('div');
                todoRow.className = 'notion-todo-row' + (isChecked ? ' done' : '');
                todoRow.innerHTML = '<input type="checkbox" class="notion-todo-checkbox"' + (isChecked ? ' checked' : '') + '>' +
                    '<div class="notion-todo-text">' + text + '</div>';

                li.replaceWith(todoRow);
            }
        });

        // Unwrap todo-rows from parent <ul> if parent only has todo-rows
        div.querySelectorAll('ul').forEach(function (ul) {
            var rows = ul.querySelectorAll(':scope > .notion-todo-row');
            if (rows.length > 0 && ul.children.length === rows.length) {
                rows.forEach(function (r) { ul.before(r); });
                ul.remove();
            }
        });

        // Ensure links open safely in new tab
        div.querySelectorAll('a').forEach(function (a) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });

        return div.innerHTML;
    }

    function fallbackMarkdownParser(text) {
        if (!text) return '';
        var lines = text.split('\n');
        var html = '';
        var inList = false;
        var inCodeBlock = false;
        var codeBlockContent = [];
        var codeBlockLang = '';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var trimmed = line.trim();

            // Fenced code block start/end
            if (trimmed.startsWith('```')) {
                if (inCodeBlock) {
                    html += '<pre><code class="language-' + escapeHtml(codeBlockLang) + '">' +
                        escapeHtml(codeBlockContent.join('\n')) + '</code></pre>';
                    inCodeBlock = false;
                    codeBlockContent = [];
                    codeBlockLang = '';
                } else {
                    if (inList) { html += '</ul>'; inList = false; }
                    inCodeBlock = true;
                    codeBlockLang = trimmed.substring(3).trim();
                    codeBlockContent = [];
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            // Headings
            if (trimmed.startsWith('###### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h6>' + formatInlineMarkdown(trimmed.substring(7)) + '</h6>';
            } else if (trimmed.startsWith('##### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h5>' + formatInlineMarkdown(trimmed.substring(6)) + '</h5>';
            } else if (trimmed.startsWith('#### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h4>' + formatInlineMarkdown(trimmed.substring(5)) + '</h4>';
            } else if (trimmed.startsWith('### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h3>' + formatInlineMarkdown(trimmed.substring(4)) + '</h3>';
            } else if (trimmed.startsWith('## ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h2>' + formatInlineMarkdown(trimmed.substring(3)) + '</h2>';
            } else if (trimmed.startsWith('# ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h1>' + formatInlineMarkdown(trimmed.substring(2)) + '</h1>';
            } else if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('[] ')) {
                if (inList) { html += '</ul>'; inList = false; }
                var todoText = trimmed.replace(/^(- \[ \] |\[\] )/, '');
                html += '<div class="notion-todo-row"><input type="checkbox" class="notion-todo-checkbox"><div class="notion-todo-text">' + formatInlineMarkdown(todoText) + '</div></div>';
            } else if (trimmed.startsWith('- [x] ') || trimmed.startsWith('[x] ') || trimmed.startsWith('- [X] ') || trimmed.startsWith('[X] ')) {
                if (inList) { html += '</ul>'; inList = false; }
                var todoTextDone = trimmed.replace(/^(- \[[xX]\] |\[[xX]\] )/, '');
                html += '<div class="notion-todo-row done"><input type="checkbox" class="notion-todo-checkbox" checked><div class="notion-todo-text">' + formatInlineMarkdown(todoTextDone) + '</div></div>';
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += '<li>' + formatInlineMarkdown(trimmed.substring(2)) + '</li>';
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (inList) { html += '</ul>'; inList = false; }
                var numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
                html += '<ol><li value="' + numMatch[1] + '">' + formatInlineMarkdown(numMatch[2]) + '</li></ol>';
            } else if (trimmed.startsWith('> ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<blockquote><p>' + formatInlineMarkdown(trimmed.substring(2)) + '</p></blockquote>';
            } else if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<hr>';
            } else if (trimmed === '') {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<p><br></p>';
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<p>' + formatInlineMarkdown(line) + '</p>';
            }
        }

        if (inCodeBlock) {
            html += '<pre><code>' + escapeHtml(codeBlockContent.join('\n')) + '</code></pre>';
        }
        if (inList) html += '</ul>';
        return html;
    }

    function renderNotionMarkdown(markdown) {
        if (!markdown) return '';

        var text = String(markdown);

        // Preprocess math arrows (LaTeX & symbols)
        text = text
            .replace(/\$\s*\\rightarrow\s*\$/gi, '→')
            .replace(/\\rightarrow/gi, '→')
            .replace(/\$\s*\\leftarrow\s*\$/gi, '←')
            .replace(/\\leftarrow/gi, '←')
            .replace(/\$\s*\\leftrightarrow\s*\$/gi, '↔')
            .replace(/\\leftrightarrow/gi, '↔')
            .replace(/\$\s*\\Rightarrow\s*\$/gi, '⇒')
            .replace(/\\Rightarrow/gi, '⇒');

        // Preprocess callouts > [!TIP], > [!NOTE], > [!IMPORTANT], > [!WARNING], > [!INFO]
        var callouts = [];
        text = text.replace(/(?:^>[^\n]*(?:\r?\n>[^\n]*)*)/gm, function (blockMatch) {
            var lines = blockMatch.split(/\r?\n/);
            var firstLine = lines[0];
            var calloutMatch = firstLine.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|INFO)\]\s*(.*)$/i);

            if (calloutMatch) {
                var type = calloutMatch[1].toLowerCase();
                var titleMap = {
                    note: { icon: 'ℹ️', title: 'Ghi chú' },
                    tip: { icon: '💡', title: 'Mẹo hay' },
                    important: { icon: '⚠️', title: 'Quan trọng' },
                    warning: { icon: '⚠️', title: 'Cảnh báo' },
                    info: { icon: 'ℹ️', title: 'Thông tin' }
                };
                var meta = titleMap[type] || { icon: '📌', title: type.toUpperCase() };

                var remainingLines = lines.slice(1).map(function (l) { return l.replace(/^>\s?/, ''); });
                if (calloutMatch[2] && calloutMatch[2].trim()) {
                    remainingLines.unshift(calloutMatch[2].trim());
                }
                var innerContent = remainingLines.map(function (l) { return formatInlineMarkdown(l); }).join('<br/>');
                var id = '__CALLOUT_BLOCK_' + callouts.length + '__';
                var calloutHtml = '<div class="notion-callout ' + type + '">' +
                    '<div class="callout-header"><span class="callout-icon">' + meta.icon + '</span><span class="callout-title">' + meta.title + '</span></div>' +
                    '<div class="callout-content">' + innerContent + '</div>' +
                    '</div>';
                callouts.push(calloutHtml);
                return id;
            }

            return blockMatch;
        });

        // Preprocess GFM Tables: (?:\|[^\r\n]+\|(?:\r?\n|$))+
        var tables = [];
        text = text.replace(/(?:\|[^\r\n]+\|(?:\r?\n|$))+/g, function (tableMatch) {
            var lines = tableMatch.trim().split(/\r?\n/);
            if (lines.length < 2) return tableMatch;

            var html = '<div class="notion-table-container"><table class="notion-table">';
            var isHeader = true;

            lines.forEach(function (line, index) {
                // Skip separator line |---|---|
                if (line.match(/^\|[\s-:]+\|$/) || line.replace(/\|/g, '').trim().match(/^[-:\s]+$/)) {
                    isHeader = false;
                    return;
                }

                var cells = line.split('|').filter(function (_, i, arr) { return i > 0 && i < arr.length - 1; });
                if (cells.length === 0) return;

                if (index === 0 && isHeader) {
                    html += '<thead><tr>';
                    cells.forEach(function (cell) {
                        html += '<th>' + formatInlineMarkdown(cell.trim()) + '</th>';
                    });
                    html += '</tr></thead><tbody>';
                } else {
                    html += '<tr>';
                    cells.forEach(function (cell) {
                        html += '<td>' + formatInlineMarkdown(cell.trim()) + '</td>';
                    });
                    html += '</tr>';
                }
            });

            html += '</tbody></table></div>';
            var id = '__NOTION_TABLE_' + tables.length + '__';
            tables.push(html);
            return '\n\n' + id + '\n\n';
        });

        // Preprocess Code Blocks
        var codeBlocks = [];
        text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
            var cleanLang = lang.trim() || 'text';
            var escapedCode = escapeHtml(code.trim());
            var id = '__NOTION_CODE_' + codeBlocks.length + '__';
            var codeBlockHtml = '<div class="notion-code-wrapper">' +
                '<div class="notion-code-header">' +
                '<span class="notion-code-lang">' + escapeHtml(cleanLang) + '</span>' +
                '<button class="notion-copy-code-btn" type="button" data-code="' + encodeURIComponent(code.trim()) + '">' +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
                '<span>Sao chép</span>' +
                '</button>' +
                '</div>' +
                '<pre class="notion-pre"><code class="language-' + escapeHtml(cleanLang) + '">' + escapedCode + '</code></pre>' +
                '</div>';
            codeBlocks.push(codeBlockHtml);
            return '\n\n' + id + '\n\n';
        });

        // Normalize Todo items
        text = text
            .replace(/(^|\n)\s*\[ \]\s*/g, '$1- [ ] ')
            .replace(/(^|\n)\s*\[[xX]\]\s*/g, '$1- [x] ');

        // Parse remaining blocks using marked (if available) or robust fallback
        var parsed = '';
        var markedLib = (typeof marked !== 'undefined') ? (marked.parse || marked) : (window.marked && (window.marked.parse || window.marked));
        if (typeof markedLib === 'function') {
            try {
                parsed = markedLib(text, { gfm: true, breaks: true });
            } catch (err) {
                console.warn('Marked parse error, fallback to built-in parser:', err);
                parsed = fallbackMarkdownParser(text);
            }
        } else {
            parsed = fallbackMarkdownParser(text);
        }

        // Restore Tables
        tables.forEach(function (tableHtml, index) {
            var placeholder = '__NOTION_TABLE_' + index + '__';
            parsed = parsed.replace(new RegExp('<p>\\s*' + placeholder + '\\s*<\\/p>|' + placeholder, 'g'), tableHtml);
        });

        // Restore Callouts
        callouts.forEach(function (calloutHtml, index) {
            var placeholder = '__CALLOUT_BLOCK_' + index + '__';
            parsed = parsed.replace(new RegExp('<p>\\s*' + placeholder + '\\s*<\\/p>|' + placeholder, 'g'), calloutHtml);
        });

        // Restore Code Blocks
        codeBlocks.forEach(function (codeHtml, index) {
            var placeholder = '__NOTION_CODE_' + index + '__';
            parsed = parsed.replace(new RegExp('<p>\\s*' + placeholder + '\\s*<\\/p>|' + placeholder, 'g'), codeHtml);
        });

        // Post-process HTML (todos, links, etc.)
        return postProcessNotionHtml(parsed);
    }

    function legacyToNotionHtml(text) {
        if (!text) return '';

        if (window.MarkdownRenderer && typeof window.MarkdownRenderer.render === 'function') {
            return window.MarkdownRenderer.render(text);
        }

        // If text is already rich HTML containing notion table or callout or code block:
        if (text.indexOf('notion-table-container') !== -1 || text.indexOf('notion-callout') !== -1 || text.indexOf('notion-code-wrapper') !== -1) {
            return sanitizeNoteHtml(text);
        }

        // If text has HTML tags, convert to markdown first so it is canonical
        if (/<[a-z][\s\S]*>/i.test(text)) {
            var md = notionHtmlToMarkdown(text);
            return renderNotionMarkdown(md);
        }

        // Pure markdown string
        return renderNotionMarkdown(text);
    }

    function NoteApp() {
        this.notes = [];
        this.folders = [];
        this.selectedIds = new Set();
        this.activeFolderId = 'all'; // 'all' | 'uncategorized' | folderId
        this.editingNoteId = null;
        this.currentColor = 'default';
        this.editingFolderId = null;
        this.activeDropdownFolderId = null;
        this.isEditing = false;
        this.pendingImageUploads = 0;
        this.activeImageUploadXhrs = [];
        this.imageUploadBatchId = 0;

        this._cacheElements();
        this._bindEvents();
        this._loadNotes();
    }

    NoteApp.prototype._cacheElements = function () {
        this.gridEl = document.getElementById('notes-grid');
        this.deleteBtn = document.getElementById('note-delete-selected');
        this.moveBtn = document.getElementById('note-move-selected');
        this.foldersBar = document.getElementById('notes-folders-bar');
        this.newFolderBtn = document.getElementById('folder-new-btn');

        // Note Modal
        this.overlay = document.getElementById('note-modal-overlay');
        this.modalContainer = this.overlay ? (this.overlay.querySelector('.notion-modal-container') || this.overlay.querySelector('.modal-container')) : null;
        this.modalTitle = document.getElementById('note-modal-title');
        this.titleInput = document.getElementById('note-title-input');
        this.rawTextarea = document.getElementById('note-content-editor-raw');
        this.contentEditor = document.getElementById('note-content-editor');
        this.folderSelect = document.getElementById('note-folder-select');
        this.colorDots = document.querySelectorAll('#note-modal-overlay .color-dot');
        this.toolbar = document.getElementById('notion-toolbar');
        this.modeToggleBtn = document.getElementById('note-mode-toggle-btn');
        this.modeBtnText = document.getElementById('note-mode-btn-text');
        this.modalTip = document.getElementById('notion-modal-tip');
        this.closeViewBtn = document.getElementById('note-modal-close-view');
        this.imageFileInput = document.getElementById('note-image-file-input');
        this.imageUploadBtn = document.getElementById('note-image-upload-btn');
        this.imageUploadStatus = document.getElementById('note-image-upload-status');
        this.modalSaveBtn = document.getElementById('note-modal-save');

        // Folder Modal
        this.folderOverlay = document.getElementById('folder-modal-overlay');
        this.folderTitle = document.getElementById('folder-modal-title');
        this.folderNameInput = document.getElementById('folder-name-input');
        this.folderSaveBtn = document.getElementById('folder-modal-save');
        this.folderCancelBtn = document.getElementById('folder-modal-cancel');
        this.folderCloseBtn = document.getElementById('folder-modal-close');
        this.folderModalDeleteBtn = document.getElementById('folder-modal-delete-btn');

        // Floating Folder Context Menu
        this.folderDropdownMenu = document.getElementById('folder-dropdown-menu');
        this.folderDropdownEditBtn = document.getElementById('folder-dropdown-edit-btn');
        this.folderDropdownDeleteBtn = document.getElementById('folder-dropdown-delete-btn');

        // Move Modal
        this.moveOverlay = document.getElementById('note-move-modal-overlay');
        this.moveList = document.getElementById('note-move-folder-list');
        this.moveCloseBtn = document.getElementById('note-move-modal-close');
    };

    NoteApp.prototype._showFolderDropdown = function (folderId, x, y) {
        if (!this.folderDropdownMenu) return;
        this.activeDropdownFolderId = String(folderId);

        this.folderDropdownMenu.style.display = 'flex';
        this.folderDropdownMenu.style.visibility = 'hidden';

        var menuWidth = this.folderDropdownMenu.offsetWidth || 160;
        var menuHeight = this.folderDropdownMenu.offsetHeight || 90;

        var posX = x;
        var posY = y;
        if (posX + menuWidth > window.innerWidth - 10) {
            posX = window.innerWidth - menuWidth - 10;
        }
        if (posX < 10) posX = 10;
        if (posY + menuHeight > window.innerHeight - 10) {
            posY = posY - menuHeight - 10;
        }
        if (posY < 10) posY = 10;

        this.folderDropdownMenu.style.left = posX + 'px';
        this.folderDropdownMenu.style.top = posY + 'px';
        this.folderDropdownMenu.style.visibility = 'visible';
    };

    NoteApp.prototype._hideFolderDropdown = function () {
        if (this.folderDropdownMenu) {
            this.folderDropdownMenu.style.display = 'none';
        }
        this.activeDropdownFolderId = null;
    };

    NoteApp.prototype._bindEvents = function () {
        var self = this;

        // Add note & batch actions
        var addBtn = document.getElementById('note-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function () { self._openModal(null); });
        }
        if (this.deleteBtn) this.deleteBtn.addEventListener('click', function () { self._deleteSelected(); });
        if (this.moveBtn) this.moveBtn.addEventListener('click', function () { self._openMoveModal(); });

        // Folder Bar click & New Folder
        if (this.newFolderBtn) {
            this.newFolderBtn.addEventListener('click', function () {
                self._hideFolderDropdown();
                self._openFolderModal(null);
            });
        }

        if (this.foldersBar) {
            this.foldersBar.addEventListener('click', function (e) {
                var menuTrigger = e.target.closest('.folder-menu-trigger');
                if (menuTrigger) {
                    e.stopPropagation();
                    e.preventDefault();
                    var fid = menuTrigger.getAttribute('data-folder-id');
                    if (self.activeDropdownFolderId === String(fid)) {
                        self._hideFolderDropdown();
                    } else {
                        var rect = menuTrigger.getBoundingClientRect();
                        self._showFolderDropdown(fid, rect.right - 145, rect.bottom + 6);
                    }
                    return;
                }

                var pill = e.target.closest('.folder-pill');
                if (pill) {
                    var folderId = pill.getAttribute('data-folder-id');
                    self.activeFolderId = folderId;
                    self._hideFolderDropdown();
                    self._renderFolders();
                    self._render();
                }
            });

            // Right-click contextmenu on folder pills
            this.foldersBar.addEventListener('contextmenu', function (e) {
                var pill = e.target.closest('.folder-pill');
                if (pill && pill.hasAttribute('data-folder-id')) {
                    var fid = pill.getAttribute('data-folder-id');
                    if (fid && fid !== 'all' && fid !== 'uncategorized') {
                        e.preventDefault();
                        e.stopPropagation();
                        self._showFolderDropdown(fid, e.clientX, e.clientY);
                    }
                }
            });
        }

        // Global dropdown item clicks
        if (this.folderDropdownEditBtn) {
            this.folderDropdownEditBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var fid = self.activeDropdownFolderId;
                self._hideFolderDropdown();
                if (fid) self._openFolderModal(fid);
            });
        }

        if (this.folderDropdownDeleteBtn) {
            this.folderDropdownDeleteBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var fid = self.activeDropdownFolderId;
                self._hideFolderDropdown();
                if (fid) self._confirmDeleteFolder(fid);
            });
        }

        // Close dropdown when clicking outside, resizing, or scrolling
        document.addEventListener('click', function (e) {
            if (self.activeDropdownFolderId) {
                if (!e.target.closest('#folder-dropdown-menu') && !e.target.closest('.folder-menu-trigger')) {
                    self._hideFolderDropdown();
                }
            }
        });
        window.addEventListener('resize', function () {
            self._hideFolderDropdown();
        });
        window.addEventListener('scroll', function () {
            self._hideFolderDropdown();
        }, true);

        // Note Modal events
        var modalClose = document.getElementById('note-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', function () { self._closeModal(); });
        }
        var modalCancel = document.getElementById('note-modal-cancel');
        if (modalCancel) {
            modalCancel.addEventListener('click', function () { self._closeModal(); });
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', function (e) { if (e.target === self.overlay) self._closeModal(); });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (self.overlay && self.overlay.classList.contains('active')) self._closeModal();
                if (self.folderOverlay && self.folderOverlay.classList.contains('active')) self._closeFolderModal();
                if (self.moveOverlay && self.moveOverlay.classList.contains('active')) self._closeMoveModal();
            }
        });
        var modalSave = document.getElementById('note-modal-save');
        if (modalSave) {
            modalSave.addEventListener('click', function () { self._saveFromModal(); });
        }
        if (this.modeToggleBtn) {
            this.modeToggleBtn.addEventListener('click', function () {
                self._toggleNoteModalMode();
            });
        }
        if (this.closeViewBtn) {
            this.closeViewBtn.addEventListener('click', function () {
                self._closeModal();
            });
        }

        if (this.colorDots) {
            this.colorDots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    self.colorDots.forEach(function (d) { d.classList.remove('active'); });
                    dot.classList.add('active');
                    self.currentColor = dot.getAttribute('data-color');
                });
            });
        }

        // Notion Toolbar events
        if (this.toolbar) {
            this.toolbar.addEventListener('click', function (e) {
                var btn = e.target.closest('.notion-tool-btn');
                if (!btn) return;
                var cmd = btn.getAttribute('data-command');
                self._handleToolbarCommand(cmd);
            });
        }

        if (this.imageUploadBtn) {
            this.imageUploadBtn.title = t('noteImageUploadTitle');
        }
        if (this.imageFileInput) {
            this.imageFileInput.addEventListener('change', function () {
                var files = Array.from(self.imageFileInput.files || []);
                self.imageFileInput.value = '';
                if (files.length) self._uploadAndInsertNoteImages(files);
            });
        }

        // Notion Editor keydown & auto-markdown conversion
        if (this.contentEditor) {
            this.contentEditor.addEventListener('keydown', function (e) {
                self._handleEditorKeydown(e);
            });

            // Paste markdown text -> auto-convert to rich Notion HTML!
            this.contentEditor.addEventListener('paste', function (e) {
                var clipboardData = e.clipboardData || window.clipboardData;
                if (!clipboardData) return;
                var text = clipboardData.getData('text/plain');
                if (!text) return;

                if (containsMarkdownSyntax(text) || text.indexOf('\n') !== -1) {
                    e.preventDefault();
                    var richHtml = legacyToNotionHtml(text);
                    if (document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
                        document.execCommand('insertHTML', false, richHtml);
                    } else {
                        var sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            var range = sel.getRangeAt(0);
                            range.deleteContents();
                            var temp = document.createElement('div');
                            temp.innerHTML = richHtml;
                            var frag = document.createDocumentFragment(), node, lastNode;
                            while ((node = temp.firstChild)) {
                                lastNode = frag.appendChild(node);
                            }
                            range.insertNode(frag);
                            if (lastNode) {
                                range = range.cloneRange();
                                range.setStartAfter(lastNode);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                }
            });

            // Interactive checkboxes inside editor
            this.contentEditor.addEventListener('change', function (e) {
                if (e.target.classList.contains('notion-todo-checkbox')) {
                    var allCheckboxes = Array.from(self.contentEditor.querySelectorAll('.notion-todo-checkbox'));
                    var index = allCheckboxes.indexOf(e.target);
                    var isChecked = e.target.checked;
                    var row = e.target.closest('.notion-todo-row');
                    if (row) {
                        row.classList[isChecked ? 'add' : 'remove']('done');
                    }
                    if (index !== -1 && self.editingNoteId) {
                        var note = self.notes.find(function (n) { return n.id === self.editingNoteId; });
                        if (note && note.content) {
                            var count = 0;
                            note.content = note.content.replace(/(^|\n)(\s*-\s*\[)([ xX])(\]\s+)/g, function (match, p1, p2, p3, p4) {
                                if (count === index) {
                                    count++;
                                    return p1 + p2 + (isChecked ? 'x' : ' ') + p4;
                                }
                                count++;
                                return match;
                            });
                            if (self.rawTextarea) self.rawTextarea.value = note.content;
                            note.updatedAt = new Date().toISOString();
                            self._saveNotes();
                            self._render();
                        }
                    }
                }
            });

        if (this.rawTextarea) {
            this.rawTextarea.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    var val = this.value;
                    this.value = val.substring(0, start) + '  ' + val.substring(end);
                    this.selectionStart = this.selectionEnd = start + 2;
                }
            });
            this.rawTextarea.addEventListener('paste', function (e) {
                var clipboardData = e.clipboardData || window.clipboardData;
                if (!clipboardData || !clipboardData.items) return;
                var imageFiles = [];
                Array.from(clipboardData.items).forEach(function (item) {
                    if (item.kind === 'file' && item.type && item.type.indexOf('image/') === 0) {
                        var file = item.getAsFile();
                        if (file) imageFiles.push(file);
                    }
                });
                if (!imageFiles.length) return;
                e.preventDefault();
                self._uploadAndInsertNoteImages(imageFiles);
            });
        }

            // Copy code block button
            this.contentEditor.addEventListener('click', function (e) {
                var copyBtn = e.target.closest('.notion-copy-code-btn');
                if (!copyBtn) return;
                e.preventDefault();
                e.stopPropagation();
                var code = decodeURIComponent(copyBtn.getAttribute('data-code') || '');
                if (!code) {
                    var wrapper = copyBtn.closest('.notion-code-wrapper');
                    var codeEl = wrapper ? wrapper.querySelector('code') : null;
                    code = codeEl ? codeEl.textContent : '';
                }
                if (code && navigator.clipboard) {
                    navigator.clipboard.writeText(code).then(function () {
                        var span = copyBtn.querySelector('span');
                        if (span) {
                            var old = span.textContent;
                            span.textContent = 'Đã chép!';
                            setTimeout(function () { span.textContent = old; }, 2000);
                        }
                    }).catch(function (err) {
                        console.warn('Clipboard write failed:', err);
                    });
                }
            });
        }

        // Folder Modal events
        if (this.folderCloseBtn) this.folderCloseBtn.addEventListener('click', function () { self._closeFolderModal(); });
        if (this.folderCancelBtn) this.folderCancelBtn.addEventListener('click', function () { self._closeFolderModal(); });
        if (this.folderOverlay) {
            this.folderOverlay.addEventListener('click', function (e) {
                if (e.target === self.folderOverlay) self._closeFolderModal();
            });
        }
        if (this.folderSaveBtn) this.folderSaveBtn.addEventListener('click', function () { self._saveFolderFromModal(); });
        if (this.folderModalDeleteBtn) {
            this.folderModalDeleteBtn.addEventListener('click', function () {
                var fid = self.editingFolderId;
                if (fid) {
                    self._closeFolderModal();
                    self._confirmDeleteFolder(fid);
                }
            });
        }
        if (this.folderNameInput) {
            this.folderNameInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') self._saveFolderFromModal();
            });
        }

        // Move Modal events
        if (this.moveCloseBtn) this.moveCloseBtn.addEventListener('click', function () { self._closeMoveModal(); });
        if (this.moveOverlay) {
            this.moveOverlay.addEventListener('click', function (e) {
                if (e.target === self.moveOverlay) self._closeMoveModal();
            });
        }

        // Grid selection events
        this.gridEl.addEventListener('change', function (e) {
            if (e.target.classList.contains('note-select')) {
                var nid = e.target.getAttribute('data-note-id');
                if (e.target.checked) self.selectedIds.add(nid); else self.selectedIds.delete(nid);
                self._updateDeleteBtn();
                self._updateCardSelection();
            }
        });

        // Long press logic for mobile and desktop
        var longPressTimer = null;
        var isLongPress = false;
        var startX = 0, startY = 0;

        var startPress = function (e) {
            if (e.target.classList.contains('note-select') || e.target.closest('.note-card-folder')) return;
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

            // Click folder badge on note card -> filter by that folder
            var folderBadge = e.target.closest('.note-card-folder');
            if (folderBadge) {
                e.stopPropagation();
                var fid = folderBadge.getAttribute('data-folder-id');
                if (fid) {
                    self.activeFolderId = fid;
                    self._renderFolders();
                    self._render();
                }
                return;
            }

            // Click add note button in empty state
            var emptyAddBtn = e.target.closest('#empty-folder-add-btn');
            if (emptyAddBtn) {
                self._openModal(null);
                return;
            }

            if (e.target.classList.contains('note-select')) return;
            var card = e.target.closest('.note-card');
            if (card) self._openModal(card.getAttribute('data-id'));
        });
    };

    // =========================================================
    //  NOTION TOOLBAR & KEYBOARD SHORTCUTS
    // =========================================================
    // =========================================================
    //  NOTION TOOLBAR & EDITING ACTIONS
    // =========================================================
    NoteApp.prototype._insertHtml = function (html) {
        if (!this.contentEditor) return;
        this.contentEditor.focus();
        if (document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
            try {
                var ok = document.execCommand('insertHTML', false, html);
                if (ok) return;
            } catch (e) {}
        }
        var sel = window.getSelection();
        if (sel && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            range.deleteContents();
            var temp = document.createElement('div');
            temp.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = temp.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else {
            this.contentEditor.innerHTML += html;
        }
    };

    NoteApp.prototype._handleToolbarCommand = function (cmd) {
        if (!this.isEditing) {
            this._setNoteModalMode(true);
        }

        var ta = this.rawTextarea;
        if (!ta) return;
        ta.focus();
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var val = ta.value;
        var selected = val.substring(start, end);

        function wrap(before, after, defaultText) {
            var textToWrap = selected || defaultText || '';
            var replacement = before + textToWrap + after;
            ta.value = val.substring(0, start) + replacement + val.substring(end);
            var cursorStart = start + before.length;
            var cursorEnd = cursorStart + textToWrap.length;
            ta.focus();
            ta.setSelectionRange(cursorStart, cursorEnd);
            ta.dispatchEvent(new Event('input'));
        }

        function prefixLine(pref) {
            var lineStart = val.lastIndexOf('\n', start - 1) + 1;
            ta.value = val.substring(0, lineStart) + pref + val.substring(lineStart);
            ta.focus();
            ta.setSelectionRange(start + pref.length, start + pref.length);
            ta.dispatchEvent(new Event('input'));
        }

        switch (cmd) {
            case 'h1': prefixLine('# '); break;
            case 'h2': prefixLine('## '); break;
            case 'h3': prefixLine('### '); break;
            case 'bold': wrap('**', '**', 'chữ đậm'); break;
            case 'italic': wrap('*', '*', 'chữ nghiêng'); break;
            case 'strike': wrap('~~', '~~', 'chữ gạch'); break;
            case 'bullet': prefixLine('- '); break;
            case 'number': prefixLine('1. '); break;
            case 'todo': prefixLine('- [ ] '); break;
            case 'quote': prefixLine('> '); break;
            case 'table':
                wrap('\n| Tiêu đề 1 | Tiêu đề 2 | Tiêu đề 3 |\n| :--- | :--- | :--- |\n| Mục 1 | Mục 2 | Mục 3 |\n| Mục 4 | Mục 5 | Mục 6 |\n\n', '', '');
                break;
            case 'code':
                wrap('```javascript\n', '\n```\n', '// code...');
                break;
            case 'divider':
                wrap('\n---\n', '', '');
                break;
            case 'image':
                if (this.imageFileInput) this.imageFileInput.click();
                break;
        }
    };

    NoteApp.prototype._setImageUploadStatus = function (message, isError) {
        if (!this.imageUploadStatus) return;
        this.imageUploadStatus.hidden = !message;
        this.imageUploadStatus.textContent = message || '';
        this.imageUploadStatus.classList.toggle('error', !!isError);
    };

    NoteApp.prototype._resetImageUploadUi = function () {
        this.pendingImageUploads = 0;
        this.activeImageUploadXhrs = [];
        if (this.imageUploadBtn) this.imageUploadBtn.disabled = false;
        if (this.modeToggleBtn) this.modeToggleBtn.disabled = false;
        if (this.modalSaveBtn) this.modalSaveBtn.disabled = false;
        if (this.rawTextarea) this.rawTextarea.readOnly = false;
    };

    NoteApp.prototype._cancelImageUploads = function () {
        this.imageUploadBatchId++;
        this.activeImageUploadXhrs.forEach(function (xhr) {
            if (xhr && xhr.readyState !== 4) {
                try { xhr.abort(); } catch (e) {}
            }
        });
        this._resetImageUploadUi();
        this._setImageUploadStatus('', false);
    };

    NoteApp.prototype._uploadNoteImageToCloudinary = function (file, onProgress) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (typeof cloudinaryConfig === 'undefined' || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
                var configError = new Error('cloudinary-not-configured');
                configError.code = 'cloudinary-not-configured';
                reject(configError);
                return;
            }

            var xhr = new XMLHttpRequest();
            var url = 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(cloudinaryConfig.cloudName) + '/image/upload';
            var formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);
            if (cloudinaryConfig.folder) {
                formData.append('folder', cloudinaryConfig.folder);
            }

            self.activeImageUploadXhrs.push(xhr);
            xhr.timeout = 60000;
            xhr.upload.addEventListener('progress', function (event) {
                if (event.lengthComputable && typeof onProgress === 'function') {
                    onProgress(Math.round((event.loaded / event.total) * 100));
                }
            });
            xhr.onload = function () {
                var response = null;
                try { response = JSON.parse(xhr.responseText || '{}'); } catch (e) {}
                if (xhr.status >= 200 && xhr.status < 300 && response && response.secure_url) {
                    resolve({
                        url: response.secure_url,
                        publicId: response.public_id || null,
                        alt: (file.name || 'Ảnh ghi chú').replace(/\.[^.]+$/, '')
                    });
                    return;
                }
                var message = response && response.error && response.error.message
                    ? response.error.message
                    : 'cloudinary-upload-failed';
                reject(new Error(message));
            };
            xhr.onerror = function () { reject(new Error('cloudinary-network-error')); };
            xhr.ontimeout = function () {
                var timeoutError = new Error('cloudinary-upload-timeout');
                timeoutError.code = 'cloudinary-upload-timeout';
                reject(timeoutError);
            };
            xhr.onabort = function () {
                var cancelError = new Error('cloudinary-upload-cancelled');
                cancelError.code = 'cloudinary-upload-cancelled';
                reject(cancelError);
            };
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    };

    NoteApp.prototype._insertMarkdownAtCursor = function (markdown, start, end) {
        if (!this.rawTextarea) return;
        var textarea = this.rawTextarea;
        var value = textarea.value;
        var insertStart = typeof start === 'number' ? start : textarea.selectionStart;
        var insertEnd = typeof end === 'number' ? end : textarea.selectionEnd;
        var prefix = insertStart > 0 && value.charAt(insertStart - 1) !== '\n' ? '\n\n' : '';
        var suffix = insertEnd < value.length && value.charAt(insertEnd) !== '\n' ? '\n\n' : '\n';
        var insertion = prefix + markdown + suffix;
        textarea.value = value.substring(0, insertStart) + insertion + value.substring(insertEnd);
        var nextCursor = insertStart + insertion.length;
        textarea.focus();
        textarea.setSelectionRange(nextCursor, nextCursor);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    NoteApp.prototype._uploadAndInsertNoteImages = function (files) {
        var self = this;
        if (this.pendingImageUploads > 0) {
            this._setImageUploadStatus(t('noteImageUploadPending'), true);
            return;
        }
        var validFiles = files.filter(function (file) {
            return file && file.type && file.type.indexOf('image/') === 0;
        });
        if (!validFiles.length) return;
        if (!currentUser) {
            this._setImageUploadStatus(t('noteImageUploadError'), true);
            return;
        }
        var oversized = validFiles.some(function (file) { return file.size > 10 * 1024 * 1024; });
        if (oversized) {
            this._setImageUploadStatus(t('noteImageTooLarge'), true);
            return;
        }

        var insertionStart = this.rawTextarea ? this.rawTextarea.selectionStart : 0;
        var insertionEnd = this.rawTextarea ? this.rawTextarea.selectionEnd : insertionStart;
        var batchId = ++this.imageUploadBatchId;
        this.pendingImageUploads += validFiles.length;
        if (this.imageUploadBtn) this.imageUploadBtn.disabled = true;
        if (this.modeToggleBtn) this.modeToggleBtn.disabled = true;
        if (this.modalSaveBtn) this.modalSaveBtn.disabled = true;
        if (this.rawTextarea) this.rawTextarea.readOnly = true;
        this._setImageUploadStatus(t('noteImageUploading').replace('{count}', validFiles.length), false);

        var progressByFile = validFiles.map(function () { return 0; });
        var uploads = validFiles.map(function (file, index) {
            return self._uploadNoteImageToCloudinary(file, function (percent) {
                progressByFile[index] = percent;
                var total = progressByFile.reduce(function (sum, value) { return sum + value; }, 0);
                var average = Math.round(total / progressByFile.length);
                self._setImageUploadStatus(
                    t('noteImageUploadingProgress')
                        .replace('{count}', validFiles.length)
                        .replace('{percent}', average),
                    false
                );
            });
        });

        Promise.all(uploads).then(function (images) {
            if (batchId !== self.imageUploadBatchId) return;
            var markdown = images.map(function (image) {
                var alt = image.alt.replace(/[\[\]]/g, '').trim() || 'Ảnh ghi chú';
                return '![' + alt + '](' + image.url + ')';
            }).join('\n\n');
            self._insertMarkdownAtCursor(markdown, insertionStart, insertionEnd);
            self._setImageUploadStatus(t('noteImageUploadSuccess'), false);
            setTimeout(function () {
                if (self.pendingImageUploads === 0) self._setImageUploadStatus('', false);
            }, 2500);
        }).catch(function (error) {
            if (batchId !== self.imageUploadBatchId) return;
            console.error('Note image upload failed:', error);
            self.activeImageUploadXhrs.forEach(function (xhr) {
                if (xhr && xhr.readyState !== 4) {
                    try { xhr.abort(); } catch (e) {}
                }
            });
            var messageKey = 'noteImageUploadError';
            if (error && error.code === 'cloudinary-upload-timeout') messageKey = 'noteImageUploadTimeout';
            if (error && error.code === 'cloudinary-not-configured') messageKey = 'noteImageUploadConfigError';
            if (!error || error.code !== 'cloudinary-upload-cancelled') {
                self._setImageUploadStatus(t(messageKey), true);
            }
        }).then(function () {
            if (batchId !== self.imageUploadBatchId) return;
            self._resetImageUploadUi();
        });
    };

    // =========================================================
    //  NOTE MODAL (NOTION-STYLE VIEW / EDIT MODE)
    // =========================================================
    NoteApp.prototype._setNoteModalMode = function (isEditing) {
        this.isEditing = isEditing;
        if (this.modalContainer) {
            this.modalContainer.classList[isEditing ? 'add' : 'remove']('edit-mode');
            this.modalContainer.classList[isEditing ? 'remove' : 'add']('view-mode');
        }
        if (this.modeToggleBtn) {
            this.modeToggleBtn.classList[isEditing ? 'add' : 'remove']('editing');
            var icon = this.modeToggleBtn.querySelector('.mode-icon');
            if (icon) icon.textContent = isEditing ? '✓' : '✏️';
            if (this.modeBtnText) this.modeBtnText.textContent = isEditing ? t('doneBtn') : t('editNoteBtn');
        }
        if (this.titleInput) {
            this.titleInput.readOnly = !isEditing;
        }
        if (this.modalTip) {
            this.modalTip.textContent = isEditing ? t('notionShortcutsTip') : t('tapToEditTip');
        }
    };

    NoteApp.prototype._toggleNoteModalMode = function () {
        var self = this;
        if (this.pendingImageUploads > 0) {
            this._setImageUploadStatus(t('noteImageUploadPending'), true);
            return;
        }
        if (this.isEditing) {
            // User clicked "✓ Xong" -> Save content and return to safe View Mode!
            this._saveFromModal(true);
            this._setNoteModalMode(false);
            if (document.activeElement) document.activeElement.blur();
        } else {
            // User clicked "✏️ Chỉnh sửa" -> Enter Edit Mode & Focus raw textarea
            this._setNoteModalMode(true);
            setTimeout(function () {
                if (self.rawTextarea) {
                    self.rawTextarea.focus();
                }
            }, 100);
        }
    };

    NoteApp.prototype._openModal = function (noteId) {
        this.editingNoteId = noteId;
        if (this.pendingImageUploads === 0) this._setImageUploadStatus('', false);
        if (this.colorDots) {
            this.colorDots.forEach(function (d) { d.classList.remove('active'); });
        }
        this._updateFolderSelectDropdown();

        var self = this;
        if (noteId) {
            var note = this.notes.find(function (n) { return n.id === noteId; });
            if (!note) return;
            if (this.modalTitle) this.modalTitle.textContent = '';
            if (this.titleInput) this.titleInput.value = note.title || '';
            var contentVal = note.content || '';
            if (this.rawTextarea) this.rawTextarea.value = contentVal;
            if (this.contentEditor) {
                this.contentEditor.innerHTML = (window.MarkdownRenderer && typeof window.MarkdownRenderer.render === 'function')
                    ? window.MarkdownRenderer.render(contentVal)
                    : legacyToNotionHtml(contentVal);
            }
            this.currentColor = note.color || 'default';
            if (this.folderSelect) this.folderSelect.value = note.folderId || '';

            // Open existing note in View Mode
            this._setNoteModalMode(false);
        } else {
            if (this.modalTitle) this.modalTitle.textContent = '';
            if (this.titleInput) this.titleInput.value = '';
            if (this.rawTextarea) this.rawTextarea.value = '';
            if (this.contentEditor) this.contentEditor.innerHTML = '';
            this.currentColor = 'default';
            if (this.folderSelect) {
                if (this.activeFolderId !== 'all' && this.activeFolderId !== 'uncategorized') {
                    this.folderSelect.value = this.activeFolderId;
                } else {
                    this.folderSelect.value = '';
                }
            }

            // Open new note directly in Edit Mode
            this._setNoteModalMode(true);
            setTimeout(function () {
                if (self.titleInput) self.titleInput.focus();
            }, 200);
        }

        if (this.colorDots) {
            this.colorDots.forEach(function (d) {
                if (d.getAttribute('data-color') === self.currentColor) d.classList.add('active');
            });
        }

        if (this.overlay) {
            this.overlay.classList.add('active');
        }
    };

    NoteApp.prototype._closeModal = function () {
        if (this.pendingImageUploads > 0) {
            this._cancelImageUploads();
        }
        if (this.overlay) this.overlay.classList.remove('active');
        this.editingNoteId = null;
        this.isEditing = false;
    };

    NoteApp.prototype._saveFromModal = function (keepOpen) {
        if (this.pendingImageUploads > 0) {
            this._setImageUploadStatus(t('noteImageUploadPending'), true);
            return;
        }
        var title = this.titleInput ? this.titleInput.value.trim() : '';
        var markdownContent = this.rawTextarea ? this.rawTextarea.value.trim() : '';

        if (!title && !markdownContent) {
            if (!keepOpen) this._closeModal();
            return;
        }

        var selectedFolderId = this.folderSelect ? this.folderSelect.value : null;

        if (this.editingNoteId) {
            var note = this.notes.find(function (n) { return n.id === this.editingNoteId; }.bind(this));
            if (note) {
                note.title = title;
                note.content = markdownContent;
                note.color = this.currentColor;
                note.folderId = selectedFolderId || null;
                note.updatedAt = new Date().toISOString();
            }
        } else {
            var newNote = {
                id: generateId(),
                title: title,
                content: markdownContent,
                color: this.currentColor,
                folderId: selectedFolderId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.notes.unshift(newNote);
            this.editingNoteId = newNote.id;
        }

        if (this.contentEditor) {
            this.contentEditor.innerHTML = (window.MarkdownRenderer && typeof window.MarkdownRenderer.render === 'function')
                ? window.MarkdownRenderer.render(markdownContent)
                : legacyToNotionHtml(markdownContent);
        }

        this._saveNotes();
        this._renderFolders();
        this._render();

        if (!keepOpen) {
            this._closeModal();
        }
    };

    // =========================================================
    //  FOLDER SYSTEM MANAGEMENT
    // =========================================================
    NoteApp.prototype._updateFolderSelectDropdown = function () {
        if (!this.folderSelect) return;
        var html = '<option value="">📄 ' + t('uncategorized') + '</option>';
        this.folders.forEach(function (f) {
            html += '<option value="' + f.id + '">📁 ' + escapeHtml(f.name) + '</option>';
        });
        this.folderSelect.innerHTML = html;
    };

    NoteApp.prototype._renderFolders = function () {
        if (!this.foldersBar) return;

        // Calculate counts
        var totalCount = this.notes.length;
        var uncategorizedCount = 0;
        var folderCounts = {};
        this.folders.forEach(function (f) { folderCounts[f.id] = 0; });

        this.notes.forEach(function (n) {
            if (!n.folderId) {
                uncategorizedCount++;
            } else if (folderCounts[n.folderId] !== undefined) {
                folderCounts[n.folderId]++;
            } else {
                uncategorizedCount++;
            }
        });

        var html = '';

        // 1. All Notes
        var allActive = (this.activeFolderId === 'all') ? ' active' : '';
        html += '<button class="folder-pill' + allActive + '" data-folder-id="all">' +
            '<span>📑 ' + t('allNotes') + '</span>' +
            '<span class="folder-count">' + totalCount + '</span>' +
            '</button>';

        // 2. Uncategorized
        var uncatActive = (this.activeFolderId === 'uncategorized') ? ' active' : '';
        html += '<button class="folder-pill' + uncatActive + '" data-folder-id="uncategorized">' +
            '<span>📄 ' + t('uncategorized') + '</span>' +
            '<span class="folder-count">' + uncategorizedCount + '</span>' +
            '</button>';

        // 3. User Folders
        var self = this;
        this.folders.forEach(function (f) {
            var isActive = (String(self.activeFolderId) === String(f.id)) ? ' active' : '';
            var count = folderCounts[f.id] || 0;

            html += '<div class="folder-pill' + isActive + '" data-folder-id="' + f.id + '">' +
                '<span>📁 ' + escapeHtml(f.name) + '</span>' +
                '<span class="folder-count">' + count + '</span>' +
                '<span class="folder-pill-actions">' +
                '<button type="button" class="folder-menu-trigger" data-folder-id="' + f.id + '" title="Tùy chọn">⋮</button>' +
                '</span>' +
                '</div>';
        });

        this.foldersBar.innerHTML = html;
    };

    NoteApp.prototype._openFolderModal = function (folderId) {
        this.editingFolderId = folderId ? String(folderId) : null;
        if (this.editingFolderId) {
            var editId = this.editingFolderId;
            var folder = this.folders.find(function (f) { return String(f.id) === String(editId); });
            if (!folder) return;
            this.folderTitle.textContent = t('editFolder');
            this.folderNameInput.value = folder.name;
            if (this.folderModalDeleteBtn) this.folderModalDeleteBtn.style.display = 'inline-flex';
        } else {
            this.folderTitle.textContent = t('newFolder');
            this.folderNameInput.value = '';
            if (this.folderModalDeleteBtn) this.folderModalDeleteBtn.style.display = 'none';
        }
        this.folderOverlay.classList.add('active');
        var self = this;
        setTimeout(function () { self.folderNameInput.focus(); }, 200);
    };

    NoteApp.prototype._closeFolderModal = function () {
        if (this.folderOverlay) this.folderOverlay.classList.remove('active');
        this.editingFolderId = null;
    };

    NoteApp.prototype._saveFolderFromModal = function () {
        var name = this.folderNameInput.value.trim();
        if (!name) return;

        if (this.editingFolderId) {
            var editId = this.editingFolderId;
            var folder = this.folders.find(function (f) { return String(f.id) === String(editId); });
            if (folder) {
                folder.name = name;
            }
        } else {
            var newFolder = {
                id: generateId(),
                name: name,
                createdAt: new Date().toISOString()
            };
            this.folders.push(newFolder);
            this.activeFolderId = newFolder.id;
        }

        this._saveNotes();
        this._renderFolders();
        this._render();
        this._closeFolderModal();
    };

    NoteApp.prototype._confirmDeleteFolder = function (folderId) {
        var strFid = String(folderId);
        var folder = this.folders.find(function (f) { return String(f.id) === strFid; });
        if (!folder) return;
        var self = this;

        showConfirmModal({
            title: t('deleteFolder'),
            message: t('confirmDeleteFolderMsg'),
            confirmText: t('confirmDelete'),
            onConfirm: function () {
                // Move notes in this folder to uncategorized
                self.notes.forEach(function (n) {
                    if (String(n.folderId) === strFid) {
                        n.folderId = null;
                    }
                });

                // Remove folder
                self.folders = self.folders.filter(function (f) { return String(f.id) !== strFid; });

                if (String(self.activeFolderId) === strFid) {
                    self.activeFolderId = 'all';
                }

                self._saveNotes();
                self._renderFolders();
                self._render();
            }
        });
    };

    // =========================================================
    //  BATCH MOVE & DELETE
    // =========================================================
    NoteApp.prototype._openMoveModal = function () {
        if (this.selectedIds.size === 0) return;
        var self = this;

        var html = '<div class="folder-select-item" data-folder-id="">' +
            '<span>📄 ' + t('removeFromFolder') + '</span>' +
            '</div>';

        this.folders.forEach(function (f) {
            html += '<div class="folder-select-item" data-folder-id="' + f.id + '">' +
                '<span>📁 ' + escapeHtml(f.name) + '</span>' +
                '</div>';
        });

        this.moveList.innerHTML = html;

        // Bind click on items
        this.moveList.querySelectorAll('.folder-select-item').forEach(function (item) {
            item.addEventListener('click', function () {
                var targetFid = item.getAttribute('data-folder-id') || null;
                self._moveSelectedToFolder(targetFid);
            });
        });

        this.moveOverlay.classList.add('active');
    };

    NoteApp.prototype._closeMoveModal = function () {
        if (this.moveOverlay) this.moveOverlay.classList.remove('active');
    };

    NoteApp.prototype._moveSelectedToFolder = function (targetFolderId) {
        var sel = this.selectedIds;
        this.notes.forEach(function (n) {
            if (sel.has(n.id)) {
                n.folderId = targetFolderId;
                n.updatedAt = new Date().toISOString();
            }
        });

        this.selectedIds.clear();
        this._updateDeleteBtn();
        this._closeMoveModal();
        this._saveNotes();
        this._renderFolders();
        this._render();
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
                self._renderFolders();
                self._render();
            }
        });
    };

    NoteApp.prototype._updateDeleteBtn = function () {
        var hasSelection = this.selectedIds.size > 0;
        if (this.deleteBtn) {
            this.deleteBtn.classList[hasSelection ? 'add' : 'remove']('visible');
            if (hasSelection) {
                this.deleteBtn.textContent = '🗑 ' + t('confirmDelete') + ' (' + this.selectedIds.size + ')';
            }
        }
        if (this.moveBtn) {
            this.moveBtn.classList[hasSelection ? 'add' : 'remove']('visible');
            if (hasSelection) {
                this.moveBtn.textContent = '📁 ' + t('moveSelected') + ' (' + this.selectedIds.size + ')';
            }
        }
    };

    NoteApp.prototype._updateCardSelection = function () {
        var sel = this.selectedIds;
        this.gridEl.querySelectorAll('.note-card').forEach(function (c) {
            c.classList[sel.has(c.getAttribute('data-id')) ? 'add' : 'remove']('selected');
        });
    };

    // =========================================================
    //  RENDER (FILTER BY FOLDER & NOTION RICH CARDS)
    // =========================================================
    NoteApp.prototype._render = function () {
        // Filter notes by activeFolderId
        var self = this;
        var filtered = this.notes.filter(function (n) {
            if (self.activeFolderId === 'all') return true;
            if (self.activeFolderId === 'uncategorized') return !n.folderId;
            return n.folderId === self.activeFolderId;
        });

        if (filtered.length === 0) {
            if (this.activeFolderId !== 'all') {
                this.gridEl.innerHTML = '<div class="notes-empty">' +
                    '<span class="empty-icon">📁</span>' +
                    '<p>' + t('emptyFolderNotes') + '</p>' +
                    '<button type="button" class="note-add-btn" id="empty-folder-add-btn" style="margin-top:14px; display:inline-block;">' + t('addNoteToFolder') + '</button>' +
                    '</div>';
            } else {
                this.gridEl.innerHTML = '<div class="notes-empty"><span class="empty-icon">📌</span><p>' + t('emptyNotes') + '</p></div>';
            }
            return;
        }

        var html = '', locale = currentLang === 'vi' ? 'vi-VN' : 'en-US', sel = this.selectedIds;

        // Lookup map for folder names
        var folderMap = {};
        this.folders.forEach(function (f) { folderMap[f.id] = f.name; });

        filtered.forEach(function (note) {
            var checked = sel.has(note.id);
            var colorAttr = note.color && note.color !== 'default' ? ' data-color="' + note.color + '"' : '';
            var dateObj = new Date(note.updatedAt || note.createdAt);
            var dateStr = dateObj.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
                dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

            var folderBadge = '';
            if (note.folderId && folderMap[note.folderId]) {
                folderBadge = '<div class="note-card-folder" data-folder-id="' + note.folderId + '" title="' + escapeHtml(folderMap[note.folderId]) + '">📁 ' + escapeHtml(folderMap[note.folderId]) + '</div>';
            }

            var bodyHtml = (window.MarkdownRenderer && typeof window.MarkdownRenderer.render === 'function')
                ? window.MarkdownRenderer.render(note.content || '')
                : legacyToNotionHtml(note.content || '');

            html += '<div class="note-card' + (checked ? ' selected' : '') + '" data-id="' + note.id + '"' + colorAttr + '>' +
                '<input type="checkbox" class="note-select" data-note-id="' + note.id + '"' + (checked ? ' checked' : '') + ' />' +
                folderBadge +
                (note.title ? '<div class="note-title">' + escapeHtml(note.title) + '</div>' : '') +
                (bodyHtml ? '<div class="note-body">' + bodyHtml + '</div>' : '') +
                '<div class="note-date">' + dateStr + '</div></div>';
        });

        this.gridEl.innerHTML = html;
    };

    // =========================================================
    //  FIRESTORE PERSISTENCE
    // =========================================================
    NoteApp.prototype._saveNotes = function () {
        try {
            localStorage.setItem('flowhub_notes_backup', JSON.stringify({
                items: this.notes,
                folders: this.folders
            }));
        } catch (e) {}

        if (!currentUser) return;
        userDocRef('data').doc('notes').set({
            items: this.notes,
            folders: this.folders
        });
    };

    NoteApp.prototype._loadNotes = function () {
        try {
            var cached = localStorage.getItem('flowhub_notes_backup');
            if (cached) {
                var data = JSON.parse(cached);
                if (data) {
                    if (Array.isArray(data.items)) this.notes = data.items;
                    if (Array.isArray(data.folders)) this.folders = data.folders;
                    this._renderFolders();
                    this._render();
                }
            }
        } catch (e) {}

        if (!currentUser) {
            if (!this.notes) this.notes = [];
            if (!this.folders) this.folders = [];
            this._renderFolders();
            this._render();
            return;
        }
        var self = this;
        userDocRef('data').doc('notes').get().then(function (doc) {
            if (doc.exists && doc.data()) {
                self.notes = doc.data().items || [];
                self.folders = doc.data().folders || [];
                try {
                    localStorage.setItem('flowhub_notes_backup', JSON.stringify({
                        items: self.notes,
                        folders: self.folders
                    }));
                } catch (e) {}
            }
            self._renderFolders();
            self._render();
        }).catch(function (err) {
            console.error('Error loading notes:', err);
            self._renderFolders();
            self._render();
        });
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

        // Capture readiness immediately, even before the UI is initialized.
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            showInstallPrompts();
        });

        window.addEventListener('appinstalled', function () {
            isStandalone = true;
            deferredPrompt = null;
            hideInstallPrompts();
            showToast(t('installedToast'), '🎉');
        });

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
            hideInstallPrompts();

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

            // If on iOS Safari, install is supported via Add to Home Screen
            if (deferredPrompt || isIOS) {
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
            if (isStandalone || (!deferredPrompt && !isIOS)) return;
            if (headerBtn) headerBtn.style.display = '';
            var loginWrapper = document.getElementById('login-install-wrapper');
            if (loginWrapper) loginWrapper.style.display = '';
            var dismissed = sessionStorage.getItem('pwa_banner_dismissed');
            if (!dismissed && banner) {
                setTimeout(function () {
                    if (banner && !sessionStorage.getItem('pwa_banner_dismissed') && !isStandalone && (deferredPrompt || isIOS)) {
                        banner.style.display = 'flex';
                    }
                }, 1200);
            }
        }

        function hideInstallPrompts() {
            // Keep the user's install entry point visible while browsing.
            // Only promotional banners depend on the native prompt being ready.
            if (headerBtn) headerBtn.style.display = isStandalone ? 'none' : '';
            if (banner) banner.style.display = 'none';
            var loginWrapper = document.getElementById('login-install-wrapper');
            if (loginWrapper) loginWrapper.style.display = isStandalone ? 'none' : '';
        }

        async function handleInstallClick() {
            if (isStandalone) {
                showToast(t('alreadyInstalledToast'), '✨');
                return;
            }

            // 1. If deferredPrompt exists (Chrome/Android/Edge)
            if (deferredPrompt) {
                var promptEvent = deferredPrompt;
                deferredPrompt = null;
                hideInstallPrompts();
                try {
                    await promptEvent.prompt();
                    await promptEvent.userChoice;
                } catch (error) {
                    console.error('[PWA] Installation prompt failed:', error);
                    showToast(t('installFailedToast'), '⚠️');
                }
                return;
            }

            // iOS requires the browser's Share menu; Android uses the native prompt.
            if (isIOS) openGuideModal();
            else showToast(t('installNotReadyToast'), 'ℹ️');
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
    function initGardenViewport() {
        var section = document.getElementById('pomodoro-section');
        var header = document.querySelector('.app-header');
        var subnav = section.querySelector('.garden-subnav');
        var pending = false;

        function update() {
            pending = false;
            if (window.innerWidth >= 768 || !section.classList.contains('active') || !section.offsetHeight) return;
            var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            var bottomPadding = parseFloat(getComputedStyle(section.parentElement).paddingBottom) || 10;
            var top = section.getBoundingClientRect().top + window.scrollY;
            var available = viewportHeight - top - subnav.offsetHeight - 10 - bottomPadding;

            [['.garden-focus-card', '.garden-scene', '--garden-phone-scene', 220],
             ['.garden-land-card', '.garden-land', '--garden-phone-land', 420]].forEach(function (config) {
                var card = section.querySelector(config[0]);
                if (!card.offsetHeight) return;
                var style = getComputedStyle(card);
                var overhead = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
                    + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
                var count = 0;
                Array.from(card.children).forEach(function (child) {
                    var childStyle = getComputedStyle(child);
                    if (childStyle.display === 'none') return;
                    count++;
                    overhead += (parseFloat(childStyle.marginTop) || 0) + (parseFloat(childStyle.marginBottom) || 0);
                    if (!child.matches(config[1])) overhead += child.getBoundingClientRect().height;
                });
                overhead += Math.max(0, count - 1) * (parseFloat(style.rowGap) || 0);
                var size = Math.floor(Math.max(120, Math.min(config[3], available - overhead - 4))) + 'px';
                if (section.style.getPropertyValue(config[2]) !== size) section.style.setProperty(config[2], size);
            });
        }

        function schedule() {
            if (!pending) { pending = true; requestAnimationFrame(update); }
        }
        if ('ResizeObserver' in window) {
            var observer = new ResizeObserver(schedule);
            [header, subnav].concat(Array.from(section.querySelectorAll('.garden-card'))).forEach(function (element) {
                observer.observe(element);
            });
        }
        new MutationObserver(schedule).observe(section, { attributes: true, attributeFilter: ['class'] });
        window.addEventListener('resize', schedule);
        if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
        schedule();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        initGardenViewport();
        setLanguage();
        initThemeToggle();
        initAuth();
        initConfirmModal();
        initBatteryGuideModal();
        PwaManager.init();

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
        window.__habitApp = new HabitApp();
    });
})();
