(function (root) {
    'use strict';

    // Each model also stores its original price for purchases made before price tracking.
    const categories = {
        desk: ['Bàn', [['Bàn gỗ thông', 50, 'IKEA', 50], ['Bàn gỗ sồi', 160, 'IKEA', 125], ['Bàn có ngăn kéo', 330, 'IKEA', 225], ['Bàn nâng hạ', 680, 'FlexiSpot', 400]]],
        chair: ['Ghế', [['Ghế gỗ', 45, 'IKEA', 50], ['Ghế đệm vải', 125, 'IKEA', 100], ['Ghế lưới', 300, 'Steelcase', 200], ['Ghế công thái học', 620, 'Herman Miller', 350]]],
        lamp: ['Đèn bàn', [['Đèn kẹp', 25, 'IKEA', 25], ['Đèn chụp vải', 75, 'IKEA', 60], ['Đèn tay gập', 185, 'Anglepoise', 125], ['Đèn kính hổ phách', 370, 'IKEA', 225]]],
        laptop: ['Laptop', [['Laptop bạc', 100, 'Acer', 75], ['Laptop xanh rêu', 250, 'ASUS', 150], ['Laptop siêu mỏng', 560, 'Lenovo', 275], ['Laptop màn hình rộng', 1050, 'Dell', 450]]],
        phone: ['Điện thoại', [['Điện thoại mini', 120, 'Apple', 100], ['Điện thoại xanh lam', 280, 'Google', 175], ['Điện thoại màn hình lớn', 590, 'Samsung', 300], ['Điện thoại gập', 1100, 'Motorola', 450]]],
        console: ['Máy chơi game', [['Máy cầm tay đơn sắc', 100, 'Nintendo', 150], ['Máy cầm tay màu', 240, 'Anbernic', 225], ['Máy cầm tay màn hình rộng', 520, 'Valve', 350], ['Máy cầm tay dạng gập', 900, 'Nintendo', 500]]],
        sofa: ['Sofa', [['Sofa một chỗ', 100, 'IKEA', 100], ['Sofa hai chỗ', 245, 'IKEA', 175], ['Sofa vải nhung', 540, 'West Elm', 300], ['Sofa góc', 1000, 'IKEA', 500]]],
        rug: ['Thảm', [['Thảm đan tròn', 25, 'IKEA', 25], ['Thảm sọc', 75, 'IKEA', 60], ['Thảm họa tiết hình học', 175, 'Ruggable', 125], ['Thảm lông mềm', 350, 'IKEA', 225]]],
        shelf: ['Kệ sách', [['Kệ thấp', 65, 'IKEA', 75], ['Kệ ba tầng', 160, 'MUJI', 125], ['Kệ bậc thang', 345, 'West Elm', 225], ['Tủ sách kính', 690, 'IKEA', 375]]],
        wall: ['Trang trí tường', [['Tranh bưu thiếp', 25, 'IKEA', 25], ['Tranh khung gỗ', 70, 'IKEA', 60], ['Đồng hồ treo tường', 160, 'Seiko', 125], ['Bộ tranh ba khung', 330, 'IKEA', 225]]],
        bed: ['Giường', [['Giường gỗ thông', 125, 'IKEA', 125], ['Giường chăn xanh sage', 280, 'IKEA', 225], ['Giường thấp chăn màu đất nung', 580, 'MUJI', 350], ['Giường đầu bọc vải', 1050, 'West Elm', 500]]]
    };
    const catalog = Object.entries(categories).flatMap(([slot, [, models]]) =>
        models.map(([name, price, brand, legacyPrice], variant) => ({
            id: slot + '-' + (variant + 1), slot, name: name + ' ' + brand, price, brand, variant, legacyPrice
        })));
    const items = Object.fromEntries(catalog.map(item => [item.id, item]));
    const coins = new Intl.NumberFormat('vi-VN');
    const deskItems = ['lamp', 'laptop', 'phone', 'console'];
    const canInteractWith = slot => ['sofa', 'phone', 'console', 'bed'].includes(slot);
    const testEmail = 'quangphamminh704@gmail.com';
    const sampleLayout = {
        desk: 'desk-1', chair: 'chair-2', lamp: 'lamp-1', laptop: 'laptop-1',
        phone: 'phone-1', console: 'console-1', sofa: 'sofa-3', rug: 'rug-2',
        shelf: 'shelf-2', wall: 'wall-4', bed: 'bed-4'
    };

    function canTestRoom(account) {
        return Boolean(account?.uid && account.emailVerified === true &&
            account.email?.toLowerCase() === testEmail);
    }

    function roomState(data = {}) {
        const owned = Array.isArray(data.owned) ? [...new Set(data.owned.filter(id => Object.hasOwn(items, id)))] : [];
        const placed = {};
        for (const slot of Object.keys(categories)) {
            const id = data.placed?.[slot];
            if (owned.includes(id) && items[id].slot === slot) placed[slot] = id;
        }
        if (!placed.desk) deskItems.forEach(slot => delete placed[slot]);
        const balance = typeof data.balance === 'number' && Number.isSafeInteger(data.balance * 2) && data.balance >= 0
            ? data.balance : 0;
        const paidPrices = {};
        for (const id of owned) {
            const price = data.paidPrices?.[id];
            if (Number.isSafeInteger(price) && price >= 0) paidPrices[id] = price;
        }
        return { balance, owned, placed, paidPrices };
    }

    function replacementQuote(state, item) {
        const oldId = state.placed[item.slot];
        const oldItem = oldId && oldId !== item.id ? items[oldId] : null;
        const credit = oldItem ? (state.paidPrices[oldId] ?? oldItem.legacyPrice) / 2 : 0;
        const price = state.owned.includes(item.id) ? 0 : item.price;
        return { oldItem, credit, due: price - credit };
    }

    function changeRoom(data, action, id, expectedTrade, testing = false) {
        const state = roomState(data);
        const item = items[id];
        if (!Object.hasOwn(items, id)) throw new Error('Món đồ này không còn trong cửa hàng.');
        const placing = action === 'place' || action === 'buy-place';
        if (placing && deskItems.includes(item.slot) && !state.placed.desk) throw new Error('Hãy đặt bàn trước.');
        const { oldItem, credit, due } = replacementQuote(state, item);
        if (placing && expectedTrade && (oldItem?.id !== expectedTrade.oldItem?.id || due !== expectedTrade.due)) {
            throw new Error('Báo giá đã thay đổi. Hãy kiểm tra lại rồi đổi đồ.');
        }
        if (action === 'buy' || action === 'buy-place') {
            if (state.owned.includes(id)) throw new Error('Bạn đã sở hữu món này.');
            const cost = placing ? due : item.price;
            if (state.balance < cost) throw new Error('Bạn chưa đủ xu.');
            state.balance -= cost;
            state.owned.push(id);
            state.paidPrices[id] = item.price;
        }
        if (placing) {
            if (!state.owned.includes(id)) throw new Error('Mua món này trước khi đặt.');
            if (oldItem && !testing) {
                if (action === 'place') state.balance += credit;
                state.owned = state.owned.filter(ownedId => ownedId !== oldItem.id);
                delete state.paidPrices[oldItem.id];
            }
            state.placed[item.slot] = id;
        } else if (action === 'store') {
            if (state.placed[item.slot] !== id) throw new Error('Món này hiện không ở trong phòng.');
            delete state.placed[item.slot];
            if (item.slot === 'desk') deskItems.forEach(slot => delete state.placed[slot]);
        } else if (action !== 'buy') {
            throw new Error('Thao tác này không được hỗ trợ.');
        }
        return state;
    }

    function validSession(session) {
        return session && typeof session.id === 'string' && /^[\w-]{1,100}$/.test(session.id) &&
            Number.isSafeInteger(session.minutes) && session.minutes > 0 && session.minutes <= (session.legacy ? 180 : 60) &&
            Number.isSafeInteger(session.startedAt) && session.startedAt > 0 &&
            session.endsAt === session.startedAt + session.minutes * 60000;
    }

    function historyEntry(session) {
        const end = new Date(session.endsAt);
        const pad = number => String(number).padStart(2, '0');
        const entry = {
            mode: session.legacy ? 'garden' : 'room',
            duration: session.minutes,
            date: [end.getFullYear(), pad(end.getMonth() + 1), pad(end.getDate())].join('-'),
            completedAt: pad(end.getHours()) + ':' + pad(end.getMinutes()),
            endedAt: session.endsAt
        };
        if (session.legacy) {
            entry.speciesName = session.speciesName || 'Khu vườn';
            entry.speciesIcon = session.speciesIcon || '🌱';
        } else entry.coins = session.minutes;
        return entry;
    }

    function read(key) {
        try { return JSON.parse(localStorage.getItem(key)); }
        catch { return null; }
    }

    async function syncCompletion(db, user, session) {
        if (!validSession(session) || session.endsAt > Date.now()) return;
        const history = user.collection('pomodoro_history').doc('focus-' + session.id);
        const wallet = user.collection('data').doc('focus_room');
        return db.runTransaction(async transaction => {
            if ((await transaction.get(history)).exists) return false;
            if (!session.legacy) {
                const state = roomState((await transaction.get(wallet)).data());
                state.balance += session.minutes;
                transaction.set(wallet, state);
            }
            transaction.set(history, historyEntry(session));
            return true;
        });
    }

    function node(tag, className, value) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (value !== undefined) el.textContent = value;
        return el;
    }

    function button(label, action, className = 'room-btn') {
        const el = node('button', className, label);
        el.type = 'button';
        el.addEventListener('click', action);
        return el;
    }

    class FocusRoom {
        constructor(timer, db) {
            this.timer = timer;
            this.db = db;
            this.state = roomState();
            this.testAllowed = false;
            this.testState = null;
            this.testFocus = false;
            this.uid = null;
            this.filter = 'all';
            this.category = 'all';
            this.dialog = document.getElementById('room-shop');
            this.list = document.getElementById('room-shop-items');
            this.placed = document.getElementById('room-placed');
            this.status = document.getElementById('room-status');
            this.focusScene = new root.FocusRoomArt.Scene(document.getElementById('room-focus-scene'));
            this.roomScene = new root.FocusRoomArt.Scene(document.getElementById('room-scene'), slot => this.interact(slot));
            this.previewScene = new root.FocusRoomArt.Scene(document.getElementById('room-preview-scene'));
            this.previewPanel = document.getElementById('room-preview');
            this.previewItem = document.getElementById('room-preview-item');
            this.previewPlay = document.getElementById('room-preview-play');
            this.zoomDialog = document.getElementById('room-zoom');
            this.zoomViewport = document.getElementById('room-zoom-viewport');
            document.querySelectorAll('[data-room-zoom]').forEach(button => {
                button.addEventListener('click', () => this.openZoom(button));
            });
            document.getElementById('room-zoom-close').addEventListener('click', () => this.zoomDialog.close());
            this.zoomDialog.addEventListener('close', () => this.restoreZoom());
            this.sceneNote = document.getElementById('room-action-label');
            this.catalogOpen = document.getElementById('room-open-shop');
            this.testToggle = document.getElementById('room-test-toggle');
            this.testControls = document.getElementById('room-test-controls');
            this.testToggle.addEventListener('click', () => this.setTestMode(!this.testState));
            document.getElementById('room-test-sample').addEventListener('click', () => this.setTestLayout(sampleLayout));
            document.getElementById('room-test-empty').addEventListener('click', () => this.setTestLayout({}));
            document.getElementById('room-test-idle').addEventListener('click', () => this.playTest('idle'));
            document.getElementById('room-test-focus').addEventListener('click', () => this.playTest('focus'));
            document.getElementById('room-test-finish').addEventListener('click', () => this.playTest('finished'));
            this.catalogOpen.addEventListener('click', () => {
                this.renderShop();
                this.dialog.showModal();
            });
            document.getElementById('room-shop-close').addEventListener('click', () => this.dialog.close());
            document.getElementById('room-preview-close').addEventListener('click', () => this.setPreview(null, true));
            this.previewPlay.addEventListener('click', () => {
                if (this.preview && !this.previewPlay.hidden) this.previewScene.play(this.preview.slot, 'manual');
            });
            this.dialog.addEventListener('close', () => {
                this.setPreview(null);
                this.catalogOpen.focus();
            });
            const category = document.getElementById('room-category');
            for (const [id, [name]] of Object.entries(categories)) category.add(new Option(name, id));
            category.addEventListener('change', () => {
                this.category = category.value;
                this.setPreview(null);
                this.renderShop();
            });
            document.getElementById('room-filter').addEventListener('change', event => {
                this.filter = event.target.value;
                this.setPreview(null);
                this.renderShop();
            });
            window.addEventListener('online', () => {
                this.render();
                this.flush();
            });
            window.addEventListener('offline', () => this.render());
            window.addEventListener('storage', event => {
                if (!this.uid || !event.key?.startsWith(this.prefix)) return;
                if (event.key === this.prefix + 'active') this.restore();
                if (event.key.startsWith(this.prefix + 'pending:')) {
                    this.render();
                    this.flush();
                }
            });
            document.addEventListener('visibilitychange', () => { if (!document.hidden) this.flush(); });
            setInterval(() => this.flush(), 30000);
        }

        setAccount(account, legacy) {
            const uid = account?.uid || null;
            this.testAllowed = canTestRoom(account);
            if (this.uid === uid) {
                if (!this.testAllowed && this.testState) this.setTestMode(false);
                else this.render();
                return;
            }
            this.unsubscribe?.();
            this.unsubscribe = null;
            this.timer._stopSound();
            this.timer.state.session = null;
            this.uid = uid;
            this.ready = false;
            this.busy = false;
            this.state = roomState();
            this.testState = null;
            this.testFocus = false;
            if (this.zoomDialog.open) this.zoomDialog.close();
            this.restoreZoom();
            this.preview = null;
            this.previewPanel.hidden = true;
            if (this.dialog.open) this.dialog.close();
            this.roomScene.clearBreak();
            this.focusScene.clearBreak();
            this.notice('');
            this.sceneNote.textContent = '';
            if (uid) {
                this.prefix = 'flowhub_focus_room:' + uid + ':';
                this.user = this.db.collection('users').doc(uid);
                this.wallet = this.user.collection('data').doc('focus_room');
                this.unsubscribe = this.wallet.onSnapshot({ includeMetadataChanges: true }, snapshot => {
                    if (this.uid !== uid) return;
                    this.ready = !snapshot.metadata.fromCache || this.ready;
                    this.state = roomState(snapshot.data());
                    this.render();
                }, () => {
                    if (this.uid === uid) this.notice('Chưa tải được phòng. Hãy thử tải lại trang.', true);
                });
                this.restore(legacy);
            } else {
                this.user = this.wallet = null;
                if (this.dialog.open) this.dialog.close();
                this.timer._render();
            }
        }

        restore(legacy) {
            if (!this.uid) return;
            let active = read(this.prefix + 'active');
            // Old installations have one unscoped local timer. Claim it once and leave the garden archive intact.
            if (legacy && !read('flowhub_focus_room:legacy_owner')) {
                try {
                    if (!active && validSession(legacy)) {
                        localStorage.setItem(this.prefix + 'active', JSON.stringify(legacy));
                        localStorage.setItem('flowhub_focus_room:legacy_owner', JSON.stringify(this.uid));
                        active = legacy;
                    }
                } catch {
                    this.notice('Không thể khôi phục phiên cũ trên thiết bị này.', true);
                }
            }
            this.timer.state.session = validSession(active) ? active : null;
            if (this.timer.state.session && this.testState) this.setTestMode(false);
            if (!this.timer.state.session) this.timer._stopSound();
            this.timer._tick();
            this.timer._render();
            this.flush();
        }

        start(minutes) {
            if (!this.uid || this.testState) return;
            const previous = read(this.prefix + 'active');
            if (validSession(previous)) {
                this.restore();
                return;
            }
            const startedAt = Date.now();
            const id = root.crypto?.randomUUID?.() || startedAt + '-' + Math.random().toString(36).slice(2);
            const session = { id, minutes, startedAt, endsAt: startedAt + minutes * 60000 };
            try {
                localStorage.setItem(this.prefix + 'active', JSON.stringify(session));
                this.timer.state.session = session;
                this.timer._render();
                if (this.state.placed.phone && this.state.placed.desk) {
                    for (const scene of [this.focusScene, this.roomScene]) {
                        if (!scene.action) scene.play('phone', 'quiet');
                    }
                }
            } catch {
                this.notice('Không thể lưu phiên tập trung trên thiết bị này.', true);
            }
        }

        end(session, cancel = false) {
            if (!this.uid || this.timer.state.session?.id !== session.id) return false;
            const key = this.prefix + 'active';
            if (read(key)?.id !== session.id) {
                this.restore();
                return false;
            }
            // A cancellation confirmation left open past the deadline still completes the session.
            cancel = cancel && Date.now() < session.endsAt;
            try {
                if (!cancel) localStorage.setItem(this.prefix + 'pending:' + session.id, JSON.stringify(session));
                localStorage.removeItem(key);
            } catch {
                this.notice('Chưa thể lưu kết quả. Sẽ thử lại.', true);
                return false;
            }
            this.timer.state.session = null;
            this.timer._stopSound();
            this.timer._render();
            if (!cancel) {
                this.focusScene.play('chair', 'finished');
                this.roomScene.play('chair', 'finished');
                this.notice(session.legacy ? 'Đã hoàn thành phiên MyGarden.' : '+' + session.minutes + ' xu · Đang đồng bộ');
                this.flush();
            } else this.notice('Đã kết thúc sớm. Phiên này không nhận xu.');
            return !cancel;
        }

        pending() {
            if (!this.uid) return [];
            const prefix = this.prefix + 'pending:';
            try {
                return Object.keys(localStorage).filter(key => key.startsWith(prefix))
                    .map(key => [key, read(key)]).filter(([, value]) => validSession(value));
            } catch { return []; }
        }

        async flush() {
            const { uid, user } = this;
            if (!uid || this.syncing === uid || !navigator.onLine) return;
            const pending = this.pending().filter(([, session]) => session.endsAt <= Date.now());
            if (!pending.length) return;
            this.syncing = uid;
            let success = false;
            let coins = 0;
            try {
                for (const [key, session] of pending) {
                    if (this.uid !== uid) break;
                    if (await syncCompletion(this.db, user, session) && !session.legacy) coins += session.minutes;
                    localStorage.removeItem(key);
                }
                success = true;
            } catch {
                if (this.uid === uid) this.notice('Kết quả đang chờ đồng bộ. Bạn vẫn có thể tập trung.', true);
            } finally {
                if (this.syncing === uid) this.syncing = null;
                if (this.uid === uid) {
                    this.render();
                    if (success) {
                        this.timer._loadHistory();
                        if (coins) this.notice('+' + coins + ' xu · Đã ghi nhận');
                        else if (this.status.textContent.includes('Đang đồng bộ')) this.notice('Phiên đã được ghi nhận.');
                        if (this.pending().some(([, session]) => session.endsAt <= Date.now())) this.flush();
                    }
                }
            }
        }

        notice(message, error = false) {
            this.status.textContent = message;
            this.status.classList.toggle('room-error', error);
            const focus = document.getElementById('room-focus-feedback');
            focus.textContent = message;
            focus.classList.toggle('room-error', error);
            document.getElementById('room-shop-status').textContent = message;
        }

        setTestMode(enabled) {
            if (enabled && (!this.testAllowed || this.timer.state.session || this.busy)) return;
            if (this.dialog.open) this.dialog.close();
            this.roomScene.clearBreak();
            this.testFocus = false;
            this.testState = enabled
                ? roomState({ owned: catalog.map(item => item.id), placed: this.state.placed })
                : null;
            this.filter = 'all';
            this.category = 'all';
            document.getElementById('room-filter').value = 'all';
            document.getElementById('room-category').value = 'all';
            this.notice('');
            this.timer._render();
        }

        setTestLayout(placed) {
            if (!this.testAllowed || !this.testState) return;
            this.roomScene.clearBreak();
            this.testFocus = false;
            this.testState = roomState({ ...this.testState, placed });
            this.notice('');
            this.render();
        }

        playTest(pose) {
            if (!this.testAllowed || !this.testState || this.timer.state.session) return;
            if (pose === 'idle') this.roomScene.clearBreak();
            this.testFocus = pose === 'focus';
            this.render();
            if (pose === 'finished') this.roomScene.play('chair', 'finished');
            if (pose === 'focus' && this.testState.placed.phone && !this.roomScene.action) this.roomScene.play('phone', 'quiet');
        }

        changeTestRoom(action, id) {
            if (!this.testAllowed || !['place', 'store'].includes(action)) return;
            try {
                this.testState = changeRoom(this.testState, action, id, undefined, true);
                this.notice(action === 'place' ? 'Đã đặt thử ' + items[id].name + '.' : 'Đã cất ' + items[id].name + ' khỏi phòng thử.');
            } catch (error) {
                this.notice(error.message, true);
            }
            this.render();
        }

        async change(action, id, source, expectedTrade) {
            if (this.testState) {
                this.changeTestRoom(action, id);
                return;
            }
            if (this.busy || !this.ready || !this.wallet || !navigator.onLine) {
                this.notice('Cần kết nối để cập nhật căn phòng.', true);
                return;
            }
            if (this.timer.state.session) {
                this.notice('Bạn có thể cập nhật căn phòng sau phiên tập trung.', true);
                return;
            }
            const { uid, wallet } = this;
            this.busy = true;
            this.testToggle.disabled = true;
            if (source) source.disabled = true;
            try {
                const trade = await this.db.runTransaction(async transaction => {
                    const snapshot = await transaction.get(wallet);
                    const updated = changeRoom(snapshot.data(), action, id, expectedTrade);
                    transaction.set(wallet, updated);
                    return expectedTrade?.oldItem ? expectedTrade : null;
                });
                if (this.uid !== uid) return;
                const name = items[id].name;
                if (trade) {
                    this.notice('Đã đặt ' + name + ' và bán lại ' + trade.oldItem.name + ' với giá ' +
                        coins.format(trade.credit) + ' xu.');
                } else {
                    this.notice(action === 'buy' ? 'Đã thêm ' + name + ' vào kho.' :
                        action === 'store' ? 'Đã cất ' + name + ' vào kho.' : 'Đã đặt ' + name + ' vào phòng.');
                }
            } catch (error) {
                if (this.uid === uid) this.notice(error.code ? 'Chưa lưu được thay đổi. Hãy thử lại.' : error.message, true);
            } finally {
                if (this.uid === uid) {
                    this.busy = false;
                    this.render();
                }
            }
        }

        interact(slot) {
            if (!canInteractWith(slot) || this.timer.state.session || this.roomScene.action || this.testFocus) return;
            const item = items[(this.testState || this.state).placed[slot]];
            if (!item) return;
            const labels = {
                phone: item.variant === 3 ? 'Mở điện thoại gập' : 'Xem điện thoại',
                console: item.variant === 3 ? 'Mở máy gập và chơi' : 'Chơi máy cầm tay',
                sofa: item.variant === 3 ? 'Tựa lưng và duỗi chân' : 'Ngồi nghỉ trên sofa',
                bed: 'Nằm nghỉ trên giường'
            };
            this.sceneNote.textContent = labels[slot];
            this.roomScene.play(slot, 'manual', () => { this.sceneNote.textContent = ''; });
        }

        setPreview(item, returnFocus = false) {
            this.preview = item;
            this.previewPanel.hidden = !item;
            if (item) {
                const placed = (this.testState || this.state).placed;
                const needsDesk = deskItems.includes(item.slot) && !placed.desk;
                const animate = !needsDesk && canInteractWith(item.slot);
                document.getElementById('room-preview-title').textContent = item.name;
                document.getElementById('room-preview-note').textContent =
                    needsDesk ? 'Bạn có thể xem riêng món này. Hãy đặt bàn trước để dùng trong phòng.' : '';
                this.previewItem.hidden = !needsDesk;
                this.previewPlay.hidden = !animate;
                document.getElementById('room-preview-scene').hidden = needsDesk;
                this.previewScene.stop();
                if (needsDesk) root.FocusRoomArt.thumbnail(this.previewItem, item);
                else {
                    this.previewScene.update({ ...placed, [item.slot]: item.id }, false);
                    if (animate) this.previewScene.play(item.slot, 'manual');
                }
                document.getElementById('room-preview-close').focus();
                this.previewPanel.scrollIntoView({ block: 'nearest' });
            } else {
                this.previewScene.stop();
                if (returnFocus) this.list.querySelector('[data-preview="' + this.lastPreview + '"]')?.focus();
            }
        }

        openZoom(button) {
            if (this.zoomDialog.open) return;
            const scene = document.getElementById(button.dataset.roomZoom);
            const marker = document.createComment('Room scene position');
            scene.before(marker);
            this.zoomed = { marker, scene };
            this.zoomViewport.append(scene);
            this.zoomDialog.showModal();
            this.zoomViewport.scrollLeft = (this.zoomViewport.scrollWidth - this.zoomViewport.clientWidth) / 2;
        }

        restoreZoom() {
            if (!this.zoomed) return;
            const { marker, scene } = this.zoomed;
            marker.replaceWith(scene);
            this.zoomed = null;
        }

        render() {
            const active = document.activeElement?.dataset.roomControl;
            const running = !!this.timer.state.session;
            const pending = this.pending().length;
            const testing = Boolean(this.testState);
            const placed = (this.testState || this.state).placed;
            this.testToggle.hidden = !this.testAllowed;
            this.testToggle.disabled = running || this.busy;
            this.testToggle.textContent = testing ? 'Thoát Test Mode' : 'Bật Test Mode';
            this.testToggle.setAttribute('aria-pressed', String(testing));
            this.testControls.hidden = !testing;
            document.getElementById('room-test-focus-hint').hidden = !testing;
            document.getElementById('room-shop-status-mode').hidden = !testing;
            document.getElementById('room-shop-filter-label').hidden = testing;
            document.getElementById('room-test-idle').setAttribute('aria-pressed', String(testing && !this.testFocus));
            document.getElementById('room-test-focus').setAttribute('aria-pressed', String(testing && this.testFocus));
            document.querySelectorAll('[data-room-coins]').forEach(el => {
                el.textContent = testing ? 'Test Mode' : coins.format(this.state.balance) + ' xu';
            });
            document.getElementById('room-pending').textContent = pending ? pending + ' phiên chờ đồng bộ' : '';
            document.getElementById('room-shop-connection').textContent = testing ? '' : !navigator.onLine
                ? 'Đang ngoại tuyến. Kết nối lại để mua hoặc đổi đồ.'
                : !this.ready ? 'Đang tải số dư và đồ đã sở hữu…' : '';
            this.focusScene.update(this.state.placed, running);
            this.roomScene.update(placed, testing ? this.testFocus : running, !running && !this.testFocus);
            this.catalogOpen.disabled = running;
            if (running && this.dialog.open) this.dialog.close();
            this.placed.replaceChildren();
            for (const item of Object.values(placed).map(id => items[id])) {
                const row = node('li', 'room-placed-row');
                const store = button('Cất', event => this.change('store', item.id, event.currentTarget), 'room-btn room-store-btn');
                store.dataset.roomControl = 'store-' + item.id;
                store.setAttribute('aria-label', 'Cất ' + item.name);
                store.disabled = running || (!testing && (!this.ready || this.busy || !navigator.onLine));
                const thumbnail = node('canvas', 'room-thumbnail room-placed-thumb');
                thumbnail.width = 256;
                thumbnail.height = 150;
                thumbnail.setAttribute('aria-hidden', 'true');
                root.FocusRoomArt.thumbnail(thumbnail, item);
                row.append(thumbnail, node('span', '', item.name));
                if (canInteractWith(item.slot)) {
                    const use = button('Tương tác', () => this.interact(item.slot));
                    use.dataset.roomControl = 'interact-' + item.id;
                    use.setAttribute('aria-label', 'Tương tác với ' + item.name);
                    use.disabled = running || this.testFocus;
                    row.append(use);
                }
                row.append(store);
                this.placed.append(row);
            }
            if (!this.placed.children.length) this.placed.append(node('li', 'room-empty', testing
                ? 'Phòng thử đang trống. Chọn món trong cửa hàng hoặc dùng bố trí mẫu.'
                : 'Phòng còn trống. Hoàn thành phiên tập trung để sắm món đầu tiên.'));
            if (this.dialog.open) this.renderShop();
            if (active) {
                const restored = [...document.querySelectorAll('[data-room-control]')].find(el => el.dataset.roomControl === active && !el.disabled);
                restored?.focus({ preventScroll: true });
            }
        }

        renderShop() {
            this.list.replaceChildren();
            const testing = Boolean(this.testState);
            const state = this.testState || this.state;
            const rows = catalog.filter(item => {
                const owned = state.owned.includes(item.id);
                return (this.category === 'all' || this.category === item.slot) &&
                    (testing || this.filter === 'all' ||
                        (this.filter === 'owned' ? owned : !owned && replacementQuote(state, item).due <= state.balance));
            });
            document.getElementById('room-item-count').textContent = rows.length + ' mẫu';
            for (const item of rows) {
                const card = node('article', 'room-item');
                const thumbnail = node('canvas', 'room-thumbnail');
                thumbnail.width = 256;
                thumbnail.height = 150;
                thumbnail.setAttribute('aria-hidden', 'true');
                root.FocusRoomArt.thumbnail(thumbnail, item);
                const title = node('h3', '', item.name);
                const price = node('p', 'room-price', coins.format(item.price) + ' xu');
                const isOwned = state.owned.includes(item.id);
                const isPlaced = state.placed[item.slot] === item.id;
                const needsDesk = deskItems.includes(item.slot) && !state.placed.desk;
                const quote = replacementQuote(state, item);
                const isTrade = !testing && !!quote.oldItem;
                const action = isOwned ? 'place' : isTrade ? 'buy-place' : 'buy';
                const canAfford = quote.due <= state.balance;
                let label = isOwned ? 'Đặt vào phòng' : 'Mua';
                if (isPlaced) label = 'Đang đặt';
                else if (isOwned && needsDesk) label = 'Cần đặt bàn';
                else if (testing) label = 'Đặt thử';
                else if (!canAfford) label = 'Chưa đủ xu';
                else if (isTrade) {
                    label = quote.due > 0 ? 'Đổi · Trả ' + coins.format(quote.due) + ' xu' :
                        quote.due < 0 ? 'Đổi · Nhận ' + coins.format(-quote.due) + ' xu' : 'Đổi · 0 xu';
                }
                const primary = button(label, event => this.change(action, item.id, event.currentTarget, quote), 'room-btn room-accent');
                primary.disabled = isPlaced || (isOwned && needsDesk) || (!testing &&
                    (!this.ready || this.busy || !navigator.onLine || !canAfford));
                primary.dataset.roomControl = action + '-' + item.id;
                primary.setAttribute('aria-label', label + ' · ' + item.name);
                const preview = button('Xem thử trong phòng', () => {
                    this.lastPreview = item.id;
                    this.setPreview(item);
                });
                preview.dataset.preview = item.id;
                preview.dataset.roomControl = 'preview-' + item.id;
                preview.setAttribute('aria-label', 'Xem thử ' + item.name + ' trong phòng');
                if (isTrade) {
                    const detail = node('span', 'room-trade-credit',
                        'Bán lại ' + quote.oldItem.name + ' · ' + coins.format(quote.credit) + ' xu');
                    detail.id = 'room-trade-' + item.id;
                    price.append(detail);
                    primary.setAttribute('aria-describedby', detail.id);
                }
                card.append(thumbnail, title, price, preview, primary);
                this.list.append(card);
            }
            if (!rows.length) this.list.append(node('p', 'room-empty', 'Không có món nào phù hợp bộ lọc.'));
        }
    }

    const api = { FocusRoom, catalog, items, roomState, changeRoom, validSession, historyEntry, syncCompletion, canTestRoom, canInteractWith };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.FlowHubFocusRoom = api;
})(typeof window !== 'undefined' ? window : globalThis);
