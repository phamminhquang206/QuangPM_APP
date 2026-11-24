const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { FocusRoom, catalog, changeRoom, historyEntry, syncCompletion, canTestRoom, roomState } = require('../focus-room.js');

test('test mode is scoped to the signed-in account with the verified email', () => {
    const account = { uid: 'tester', email: 'QuangPhamMinh704@gmail.com', emailVerified: true };
    assert.equal(canTestRoom(account), true);
    assert.equal(canTestRoom({ ...account, uid: '' }), false);
    assert.equal(canTestRoom({ ...account, emailVerified: false }), false);
    assert.equal(canTestRoom({ ...account, email: 'someone@example.com' }), false);
    assert.equal(canTestRoom(null), false);
});

test('placing, removing and playing with test items does not write to the real room', async () => {
    const room = Object.create(FocusRoom.prototype);
    room.state = roomState({ balance: 25, owned: ['rug-1'], placed: { rug: 'rug-1' } });
    room.testAllowed = true;
    room.testState = roomState({ owned: catalog.map(item => item.id), placed: room.state.placed });
    room.timer = { state: { session: null } };
    room.db = { runTransaction: () => assert.fail('Test edits must not reach Firestore') };
    room.notice = room.render = () => {};
    const motions = [];
    room.roomScene = { stop() {}, play(...args) { motions.push(args); } };
    await room.change('place', 'phone-4');
    assert.deepEqual(room.testState.placed, { rug: 'rug-1' });
    await room.change('place', 'desk-1');
    await room.change('place', 'phone-4');
    assert.deepEqual(room.testState.placed, { desk: 'desk-1', phone: 'phone-4', rug: 'rug-1' });
    room.playTest('focus');
    assert.equal(room.testFocus, true);
    room.playTest('finished');
    assert.equal(room.testFocus, false);
    assert.deepEqual(motions, [['phone', 'quiet'], ['chair', 'finished']]);
    await room.change('place', 'desk-4');
    assert.ok(room.testState.owned.includes('desk-1'));
    assert.equal(room.testState.balance, 0);
    await room.change('place', 'desk-1');
    await room.change('store', 'desk-1');
    assert.deepEqual(room.testState.placed, { rug: 'rug-1' });
    assert.deepEqual(room.state, { balance: 25, owned: ['rug-1'], placed: { rug: 'rug-1' }, paidPrices: {} });
    room.testAllowed = false;
    await room.change('place', 'desk-4');
    assert.deepEqual(room.testState.placed, { rug: 'rug-1' });
});

test('all shop variants and character poses have cutouts available offline', () => {
    const root = path.join(__dirname, '..');
    const folder = path.join(root, 'focus-room-assets');
    const index = JSON.parse(fs.readFileSync(path.join(folder, 'frames-v2.json'), 'utf8').replace(/^\uFEFF/, ''));
    const cached = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
    for (const file of [
        ...index.sheets, 'room-painted.webp', 'sleeping-person.webp', 'sofa-seated-angled.webp',
        'rest-sofa-phone.webp', 'rest-sofa-console.webp', 'frames-v2.json'
    ]) {
        assert.ok(fs.statSync(path.join(folder, file)).size > 0);
        assert.ok(cached.includes('./focus-room-assets/' + file), file);
    }
    const sprites = catalog.map(item => item.id).concat(Array.from({ length: 19 }, (_, i) => 'person-' + i));
    for (const id of sprites) {
        const frame = index.sprites[id];
        assert.ok(frame?.length === 5, id);
        const [sheet, x, y, w, h] = frame;
        assert.ok(frame.every(Number.isInteger) && index.sheets[sheet] && x >= 0 && y >= 0 && w > 0 && h > 0, id);
    }
});

test('bed rest stays asleep with devices placed and the next session starts with a walk back', () => {
    let now = 1;
    const window = { FlowHubFocusRoom: { items: {} } };
    const source = fs.readFileSync(path.join(__dirname, '../focus-room-art.js'), 'utf8');
    vm.runInNewContext(source, {
        window,
        fetch: () => new Promise(() => {}),
        performance: { now: () => now },
        setTimeout: () => 1,
        clearTimeout() {}
    });
    const scene = Object.assign(Object.create(window.FocusRoomArt.Scene.prototype), {
        layout: {}, reduced: { matches: false }, draw() {}
    });
    const layout = { bed: 'bed-1', desk: 'desk-1', chair: 'chair-1', laptop: 'laptop-1', phone: 'phone-1', console: 'console-1' };
    scene.update(layout, true, false);
    scene.update(layout, false, true);
    scene.play('chair', 'finished');
    assert.equal(scene.avatarAt(0, true).pose[2], 'stretch');
    assert.equal(scene.avatarAt(2000, true).pose[2], 'walk');
    now += scene.action.duration;
    scene.stop();
    for (const delay of [0, 4000, 11000]) {
        const avatar = scene.avatarAt(0, true, now + delay);
        assert.equal(avatar.pose[2], 'bed');
        assert.equal(avatar.heldDevice, undefined);
    }
    scene.update(layout, true, false);
    assert.equal(scene.avatarAt(0, true).pose[2], 'walk');
    assert.equal(scene.avatarAt(scene.action.duration, true).pose[2], 'type');
});

test('all eleven shop categories have branded models and four increasing price tiers', () => {
    assert.equal(catalog.length, 44);
    assert.equal(new Set(catalog.map(item => item.id)).size, 44);
    const slots = new Set(catalog.map(item => item.slot));
    assert.equal(slots.size, 11);
    for (const slot of slots) {
        const models = catalog.filter(item => item.slot === slot);
        assert.equal(models.length, 4);
        assert.ok(models.every(item => item.brand && item.name.endsWith(item.brand)));
        assert.ok(models.slice(1).every((item, index) => item.price > models[index].price));
    }
});

test('buying for inventory and shelving an item do not sell any items', () => {
    const bareRoom = changeRoom({ balance: 120 }, 'buy', 'phone-1');
    assert.deepEqual(bareRoom.placed, {});
    assert.deepEqual(bareRoom.owned, ['phone-1']);
    assert.throws(() => changeRoom(bareRoom, 'place', 'phone-1'), /đặt bàn trước/);
    const initial = { balance: 175 };
    assert.throws(() => changeRoom(initial, 'buy', 'invalid'));
    assert.throws(() => changeRoom({ balance: 49 }, 'buy', 'desk-1'), /đủ xu/);
    let room = changeRoom(initial, 'buy', 'desk-1');
    room = changeRoom(room, 'place', 'desk-1');
    room = changeRoom(room, 'buy', 'laptop-1');
    room = changeRoom(room, 'place', 'laptop-1');
    room = changeRoom(room, 'buy', 'rug-1');
    room = changeRoom(room, 'place', 'rug-1');
    assert.throws(() => changeRoom(room, 'buy', 'desk-1'), /đã sở hữu/);
    room = changeRoom(room, 'store', 'desk-1');
    assert.deepEqual(room.placed, { rug: 'rug-1' });
    assert.ok(room.owned.includes('desk-1') && room.owned.includes('laptop-1'));
    assert.equal(room.balance, 0);
    assert.throws(() => changeRoom(room, 'place', 'laptop-1'), /đặt bàn trước/);
});

test('exchanging an equipped item credits half its historic price and preserves desk accessories', () => {
    const before = {
        balance: 267.5,
        owned: ['desk-1', 'desk-2', 'phone-1'],
        placed: { desk: 'desk-2', phone: 'phone-1' }
    };
    const quote = { oldItem: { id: 'desk-2' }, due: 267.5 };
    assert.throws(() => changeRoom({ ...before, balance: 267 }, 'buy-place', 'desk-3', quote), /đủ xu/);
    const after = changeRoom(before, 'buy-place', 'desk-3', quote);
    assert.deepEqual(after, {
        balance: 0,
        owned: ['desk-1', 'phone-1', 'desk-3'],
        placed: { desk: 'desk-3', phone: 'phone-1' },
        paidPrices: { 'desk-3': 330 }
    });
    assert.throws(() => changeRoom(after, 'buy-place', 'desk-3', quote), /Báo giá đã thay đổi/);
    const usingAnOwnedItem = changeRoom(after, 'place', 'desk-1');
    assert.equal(usingAnOwnedItem.balance, 165);
    assert.deepEqual(usingAnOwnedItem.owned, ['desk-1', 'phone-1']);
    const halfCoin = changeRoom({ ...before, balance: 0 }, 'place', 'desk-1');
    assert.equal(roomState(halfCoin).balance, 62.5);
});

test('completion uses one history entry as the reward receipt and keeps legacy sessions reward-free', async () => {
    const documents = new Map();
    const user = { collection: name => ({ doc: id => name + '/' + id }) };
    // Serialize transactions as Firestore does after contention checks and retries.
    let queue = Promise.resolve();
    const db = {
        runTransaction(callback) {
            const result = queue.then(async () => {
                const writes = new Map();
                const value = await callback({
                    get: async ref => ({ exists: documents.has(ref), data: () => documents.get(ref) }),
                    set: (ref, value) => writes.set(ref, value)
                });
                writes.forEach((value, ref) => documents.set(ref, value));
                return value;
            });
            queue = result.catch(() => {});
            return result;
        }
    };
    const ended = Date.now() - 10_000;
    const session = { id: 'a25', minutes: 25, startedAt: ended - 25 * 60_000, endsAt: ended };
    assert.deepEqual(await Promise.all([syncCompletion(db, user, session), syncCompletion(db, user, session)]), [true, false]);
    await syncCompletion(db, user, { ...session, id: 'old', legacy: true });
    await syncCompletion(db, user, { ...session, id: 'future', startedAt: Date.now(), endsAt: Date.now() + 25 * 60_000 });
    assert.equal(documents.get('data/focus_room').balance, 25);
    assert.equal(documents.get('pomodoro_history/focus-a25').coins, 25);
    assert.equal(documents.get('pomodoro_history/focus-old').mode, 'garden');
    assert.equal(documents.get('pomodoro_history/focus-old').coins, undefined);
    assert.equal(documents.has('pomodoro_history/focus-future'), false);
    assert.equal(historyEntry(session).endedAt, ended);
});
