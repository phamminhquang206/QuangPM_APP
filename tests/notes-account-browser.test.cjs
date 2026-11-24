// Run with Node 22+ and a Chromium browser at BROWSER_PATH (or Microsoft Edge).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*>/gi, '');
const methodNames = ['_protectEditorChrome', '_setNoteModalMode', '_renderNoteContent', '_captureNoteDraft', '_saveFromModal'];
const methods = methodNames.map((name) => {
    const start = source.indexOf(`NoteApp.prototype.${name} = function`);
    return source.slice(start, source.indexOf('\n    };', start) + 7);
}).join('\n');
const sanitizerStart = source.indexOf('    function sanitizeNoteHtml(');
const sanitizer = source.slice(sanitizerStart, source.indexOf('\n    }', sanitizerStart) + 6);
const authStart = source.indexOf('        var accountMenu =');
const authMenu = source.slice(authStart, source.indexOf('        // Google login', authStart));

(async () => {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'flowhub-ui-test-'));
    const browser = spawn(process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-allow-origins=*', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
        { stdio: ['ignore', 'ignore', 'pipe'] });
    let socket;
    try {
        const endpoint = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Browser startup timed out')), 20000);
            let output = '';
            browser.on('error', reject);
            browser.stderr.on('data', (data) => {
                output += data;
                const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
                if (match) { clearTimeout(timeout); resolve(match[1]); }
            });
        });
        socket = new WebSocket(endpoint.replace('localhost', '127.0.0.1'));
        await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = event => reject(new Error(`Cannot connect to ${endpoint}: ${event.message || event.error || 'WebSocket error'}`)); });
        let nextId = 0;
        const pending = new Map();
        socket.onmessage = ({ data }) => {
            const message = JSON.parse(data);
            if (!pending.has(message.id)) return;
            const { resolve, reject, timer } = pending.get(message.id);
            clearTimeout(timer);
            pending.delete(message.id);
            if (message.error) reject(new Error(JSON.stringify(message.error)));
            else resolve(message.result);
        };
        const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
            const id = ++nextId;
            const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
            pending.set(id, { resolve, reject, timer });
            socket.send(JSON.stringify({ id, method, params, sessionId }));
        });
        const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
        const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
        const evaluate = async (expression) => {
            const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
            assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
            return result.result.value;
        };
        await evaluate(`document.open(); document.write(${JSON.stringify(html)}); document.close();
            var style = document.createElement('style'); style.textContent = ${JSON.stringify(css + '\n* { animation: none !important; transition: none !important; }')}; document.head.appendChild(style);
            document.getElementById('app-container').classList.remove('hidden');
            document.getElementById('app-container').style.display = 'block';
            document.getElementById('login-page').remove(); document.getElementById('loading-overlay').remove();
            ${authMenu}
            function NoteApp() {};
            function t(key) { return key; }
            function notionHtmlToMarkdown(html) { return html; }
            ${sanitizer}
            ${methods}
            var app = new NoteApp();
            app.contentEditor = document.getElementById('note-content-editor');
            app.modalContainer = document.querySelector('#note-modal-overlay .notion-modal-container');
            app.titleInput = document.getElementById('note-title-input') || document.createElement('input');
            app.notes = [{id: 'nested', contentHtml: '<div contenteditable="false"><ul><li>Parent<ul><li id="child" contenteditable="false">Child</li></ul></li></ul><div class="notion-todo-row" data-level="1" contenteditable="false"><div class="notion-todo-text" id="todo-child" contenteditable="false">Task</div></div><div class="notion-callout"><div class="callout-header">NOTE</div><div class="callout-content" id="callout-child" contenteditable="false">Details</div></div></div>'}];
            app.editingNoteId = 'nested'; app.pendingImageUploads = 0;
            app._saveNotes = app._renderFolders = app._render = function() {};
            app._renderNoteContent(app.notes[0]); app._setNoteModalMode(true);
            document.getElementById('note-modal-overlay').classList.add('active');`);
        for (const [width, height] of [[1440, 900], [390, 844], [320, 568]]) {
            await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 }, sessionId);
            for (const theme of ['dark', 'light']) {
                await evaluate(`document.documentElement.dataset.theme = '${theme}';
                    document.getElementById('note-modal-overlay').classList.add('active'); app._setNoteModalMode(true);`);
                for (const id of ['child', 'todo-child', 'callout-child']) {
                    assert.equal(await evaluate(`(function() {
                        var child = document.getElementById('${id}');
                        if (!child.isContentEditable) return false;
                        var range = document.createRange(); range.selectNodeContents(child);
                        var selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
                        document.execCommand('insertText', false, 'Updated ${id}');
                        return child.textContent === 'Updated ${id}';
                    })()`), true, `${id} editable at ${width}px in ${theme}`);
                }
                assert.equal(await evaluate(`document.querySelector('#note-content-editor .callout-header').isContentEditable`), false, 'Callout labels stay protected');
                assert.equal(await evaluate(`app.editorDirty = true; app._saveFromModal(true);
                    app._renderNoteContent(app.notes[0]); app._setNoteModalMode(false);
                    ['child', 'todo-child', 'callout-child'].every(id => !document.getElementById(id).isContentEditable && document.getElementById(id).textContent === 'Updated ' + id)`), true);
                const menuState = await evaluate(`document.getElementById('note-modal-overlay').classList.remove('active');
                    document.getElementById('account-menu-toggle').click();
                    new Promise(resolve => setTimeout(resolve, 400)).then(() => {
                        var popover = document.getElementById('account-popover');
                        var r = popover.getBoundingClientRect();
                        return {hidden: popover.hidden, rect: r.toJSON(), viewport: [innerWidth, innerHeight],
                            targets: [r.top + 8, r.bottom - 8].map(y => {var el = document.elementFromPoint(r.left + r.width / 2, y); return el && [el.tagName, el.id, el.className];}),
                            visible: !popover.hidden && r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight &&
                            [r.top + 8, r.bottom - 8].every(y => popover.contains(document.elementFromPoint(r.left + r.width / 2, y)))};
                    })`);
                assert.equal(menuState.visible, true, `Account menu visible at ${width}px in ${theme}: ${JSON.stringify(menuState)}`);
                assert.equal(await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})); document.getElementById('account-popover').hidden`), true);
                assert.equal(await evaluate(`document.getElementById('account-menu-toggle').click(); document.body.click(); document.getElementById('account-popover').hidden`), true, 'Outside click closes account menu');
            }
        }
        console.log('Browser checks passed: nested note edits/save/reopen and account menu visibility at 1440, 390 and 320px, light and dark.');
    } finally {
        if (socket) socket.close();
        browser.kill();
        // Only remove the unique temporary profile created by this test.
        await new Promise(resolve => browser.exitCode !== null ? resolve() : browser.once('exit', resolve));
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
