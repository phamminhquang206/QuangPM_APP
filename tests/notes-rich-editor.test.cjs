const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const marked = require('../marked.min.js');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const methods = ['_renderNoteMarkdown', '_renderNoteContent', '_restoreEditorSelection', '_runEditorCommand', '_updateInlineToolbarState', '_handleToolbarCommand', '_insertTodoRow', '_insertList', '_getTodoLevel', '_setTodoLevel', '_getLastTodoBranchRow', '_adjustEditorIndent', '_insertNextTodoRow', '_addTableRow', '_addTableColumn', '_openModal', '_captureNoteDraft', '_hasUnsavedChanges', '_hideUnsavedDialog', '_closeModal', '_saveFromModal'].map((name) => {
    const start = source.indexOf(`NoteApp.prototype.${name} = function`);
    assert.notEqual(start, -1, `Missing ${name}`);
    const end = source.indexOf('\n    };', start);
    assert.notEqual(end, -1, `Missing end of ${name}`);
    return source.slice(start, end + '\n    };'.length);
}).join('\n');

marked.setOptions({ gfm: true, breaks: true });
const context = {
    NoteApp: function NoteApp() {},
    window: {
        MarkdownRenderer: { render: (markdown) => marked.parse(markdown) },
        getSelection: () => ({ anchorNode: {}, toString: () => 'selected text' })
    },
    sanitizeNoteHtml: (html) => html,
    notionHtmlToMarkdown: () => 'fallback Markdown (not the display source)',
    escapeHtml: (text) => text,
    generateId: () => 'new-note',
    setTimeout: () => {},
    Date
};
vm.runInNewContext(methods, context);

const markdown = [
    '# Heading', '', '**bold** and *italic* with [link](https://example.com)', '',
    '- [x] done', '- [ ] pending', '',
    '| Name | Value |', '| :--- | ---: |', '| A | 42 |', '',
    '> [!TIP]', '> Keep the original Markdown.', '',
    '```js', 'const text = "**not bold**";', '```', '',
    '![alt](https://example.com/image.png)', ''
].join('\n');

const app = new context.NoteApp();
app.notes = [{ id: 'existing', title: 'Existing', content: markdown, color: 'default' }];
app.titleInput = { value: 'Existing' };
app.contentEditor = {
    innerHTML: '', textContent: 'Note body',
    querySelectorAll: () => [], querySelector: () => null, contains: () => true
};
app.folderSelect = { value: '' };
app.colorDots = [];
app.currentColor = 'default';
app._saveNotes = () => {};
app._renderFolders = () => {};
app._render = () => {};
app._updateFolderSelectDropdown = () => {};
app._setNoteModalMode = () => {};
app._protectEditorChrome = () => {};
app._restoreEditorSelection = () => {};

app._openModal('existing');
assert.match(app.contentEditor.innerHTML, /<h1>Heading<\/h1>/);
app._saveFromModal(true);
assert.equal(app.notes[0].content, markdown, 'Saving without edits must keep legacy Markdown unchanged');
assert.equal(app.notes[0].contentHtml, undefined, 'Saving without edits must not migrate the note');

const richHtml = marked.parse(markdown);
app.contentEditor.innerHTML = richHtml;
app.editorDirty = true;
app._saveFromModal(true);
assert.equal(app.notes[0].contentHtml, richHtml, 'Rich HTML must be saved as the display source');
assert.equal(app.notes[0].originalMarkdown, markdown, 'The pre-conversion Markdown must remain recoverable');

app._openModal('existing');
assert.equal(app.contentEditor.innerHTML, richHtml, 'Reopening must show exactly the saved rich formatting');

const inserted = [];
const commands = [];
app._insertHtml = (html) => inserted.push(html);
app._runEditorCommand = (command) => commands.push(command);
app._insertTodoRow = (text) => commands.push(`todo:${text}`);
app._getCurrentEditorBlock = () => null;
app.isEditing = true;
app._handleToolbarCommand('bold');
app._handleToolbarCommand('bold');
app._handleToolbarCommand('bullet');
app._handleToolbarCommand('number');
app._handleToolbarCommand('todo');
app._handleToolbarCommand('table');
assert.deepEqual(commands, ['bold', 'bold', 'insertUnorderedList', 'insertOrderedList', 'todo:selected text'], 'Bold must toggle, and lists must use native editor commands without placeholder text');
assert.match(inserted[0], /<table>/, 'Table command must insert a rendered table');
context.window.getSelection = () => ({ anchorNode: {}, toString: () => '' });
app._handleToolbarCommand('todo');
assert.equal(commands.at(-1), 'todo:', 'A new to-do must start empty, without sample text');

for (const [label, pattern] of Object.entries({
    heading: /<h1>Heading<\/h1>/,
    bold: /<strong>bold<\/strong>/,
    italic: /<em>italic<\/em>/,
    link: /href="https:\/\/example\.com"/,
    checklist: /type="checkbox"/,
    table: /<table>/,
    codeFence: /<pre><code class="language-js">/,
    image: /<img src="https:\/\/example\.com\/image\.png"/
})) {
    assert.match(app.contentEditor.innerHTML, pattern, `${label} must survive save and reopen`);
}

app.editingNoteId = null;
app.contentEditor.innerHTML = richHtml;
app.importedMarkdown = markdown;
app.editorDirty = true;
app._saveFromModal(true);
assert.equal(app.notes[0].contentHtml, richHtml, 'A new note must save the rich formatting');
assert.equal(app.notes[0].originalMarkdown, markdown, 'A pasted Markdown source must be retained as a backup');

const classes = new Set();
app.overlay = { classList: { remove: (name) => classes.delete(`note:${name}`) } };
app.unsavedOverlay = { classList: { add: (name) => classes.add(`warning:${name}`), remove: (name) => classes.delete(`warning:${name}`) } };
app.unsavedContinueBtn = { focus: () => {} };
app.isEditing = true;
app.pendingImageUploads = 0;
app.titleInput.value = 'Draft title';
assert.equal(app._hasUnsavedChanges(), true, 'A changed title must be detected as an unsaved draft');
assert.equal(app._closeModal(), false, 'Closing an unsaved draft must be intercepted');
assert.equal(classes.has('warning:active'), true, 'The unsaved-note dialog must appear');
assert.equal(app.editingNoteId !== null, true, 'Intercepted close must retain the current note');
app._hideUnsavedDialog();
assert.equal(classes.has('warning:active'), false, 'Continue editing must hide the warning');
assert.equal(app._saveFromModal(true), true, 'Saving a draft must succeed');
assert.equal(app._hasUnsavedChanges(), false, 'Saved content must no longer trigger the warning');
assert.equal(app._closeModal(), true, 'Saved note must close without a warning');

const makeRow = (parent) => ({
    parentElement: parent, children: [],
    appendChild(cell) { this.children.push(cell); return cell; },
    get firstElementChild() { return this.children[0]; }
});
const head = { tagName: 'THEAD' };
const body = { tagName: 'TBODY', appendChild(row) { row.parentElement = this; table.rows.push(row); return row; } };
const table = {
    rows: [], tBodies: [body],
    querySelector: (selector) => selector === 'tr' ? table.rows[0] : null,
    querySelectorAll: (selector) => selector === 'tr' ? table.rows : []
};
const headerRow = makeRow(head);
const contentRow = makeRow(body);
headerRow.appendChild({ tagName: 'TH' }); headerRow.appendChild({ tagName: 'TH' });
contentRow.appendChild({ tagName: 'TD' }); contentRow.appendChild({ tagName: 'TD' });
table.rows.push(headerRow, contentRow);
context.document = { createElement: (tagName) => tagName === 'tr' ? makeRow(body) : { tagName: tagName.toUpperCase(), innerHTML: '' } };
app._getActiveTable = () => table;
app._focusEditorNode = () => {};
app._addTableRow();
assert.equal(table.rows.length, 3, 'Add-row must append a body row');
assert.equal(table.rows[2].children.length, 2, 'New row must match the current column count');
app._addTableColumn();
assert.deepEqual(table.rows.map((row) => row.children.length), [3, 3, 3], 'Add-column must expand every table row');
assert.equal(headerRow.children.at(-1).tagName, 'TH', 'Header column must remain a header cell');

const insertedBlocks = [];
const todoBlock = {
    classList: { contains: (name) => name === 'notion-todo-row' },
    getAttribute: () => null,
    nextElementSibling: null,
    after: (node) => insertedBlocks.push(node)
};
context.document = {
    createElement: (tagName) => ({
        tagName: tagName.toUpperCase(),
        children: [],
        setAttribute(name, value) { this[name] = value; },
        removeAttribute(name) { delete this[name]; },
        appendChild(node) { this.children.push(node); },
        querySelector: () => ({ textContent: '', innerHTML: '' })
    })
};
context.window.getSelection = () => ({ rangeCount: 0 });
const todoApp = new context.NoteApp();
todoApp.contentEditor = { appendChild: (node) => insertedBlocks.push(node), contains: () => true };
todoApp._getCurrentEditorBlock = () => todoBlock;
todoApp._focusEditorNode = () => {};
todoApp._insertTodoRow('');
todoApp._insertTodoRow('');
assert.equal(insertedBlocks.length, 2, 'Repeated To-do clicks must create two sibling rows');
assert.equal(insertedBlocks[0].className, 'notion-todo-row');
assert.equal(insertedBlocks[1].className, 'notion-todo-row');
todoApp._insertList(false, '');
assert.equal(insertedBlocks[2].tagName, 'UL', 'List after To-do must be a sibling, not nested inside the checkbox row');
assert.equal(insertedBlocks[2].children[0].tagName, 'LI');
context.window.getSelection = () => ({ rangeCount: 1, anchorNode: { nodeType: 1, closest: (selector) => selector === 'li, ul, ol' } });
assert.equal(todoApp._insertNextTodoRow(), false, 'Enter in a list must not create a checkbox row');

let boldActive = false;
let restoredOldSelection = false;
const pressedValues = [];
const liveSelection = {
    anchorNode: {}, rangeCount: 1,
    removeAllRanges: () => { restoredOldSelection = true; },
    addRange: () => {}
};
context.window.getSelection = () => liveSelection;
context.document = {
    execCommand: (command) => { if (command === 'bold') boldActive = !boldActive; return true; },
    queryCommandState: () => boldActive
};
const boldApp = new context.NoteApp();
boldApp.contentEditor = { contains: () => true, focus: () => {} };
boldApp.editorSelection = { commonAncestorContainer: {}, cloneRange: () => ({}) };
boldApp._rememberEditorSelection = () => {};
boldApp.toolbar = { querySelector: () => ({ setAttribute: (_, value) => pressedValues.push(value) }) };
boldApp._runEditorCommand('bold');
boldApp._runEditorCommand('bold');
assert.deepEqual(pressedValues, ['true', 'false'], 'Bold button must visibly toggle on and off');
assert.equal(restoredOldSelection, false, 'An old selection must not override the current editing cursor');

const makeTodo = (level) => {
    const attrs = level ? { 'data-level': String(level) } : {};
    return {
        nodeType: 1, classList: { contains: (name) => name === 'notion-todo-row' },
        getAttribute: (name) => attrs[name] || null,
        setAttribute: (name, value) => { attrs[name] = value; },
        removeAttribute: (name) => { delete attrs[name]; }
    };
};
const parentTodo = makeTodo(0);
const childTodo = makeTodo(0);
const grandchildTodo = makeTodo(1);
parentTodo.nextElementSibling = childTodo;
childTodo.previousElementSibling = parentTodo;
childTodo.nextElementSibling = grandchildTodo;
grandchildTodo.previousElementSibling = childTodo;
grandchildTodo.nextElementSibling = null;
const indentApp = new context.NoteApp();
indentApp.contentEditor = { contains: () => true };
indentApp._restoreEditorSelection = () => {};
indentApp._rememberEditorSelection = () => {};
context.window.getSelection = () => ({ anchorNode: { nodeType: 1, closest: (selector) => selector === '.notion-todo-row' ? childTodo : null } });
assert.equal(indentApp._adjustEditorIndent(1), true);
assert.equal(indentApp._getTodoLevel(childTodo), 1, 'To-do item must indent under the previous item');
assert.equal(indentApp._getTodoLevel(grandchildTodo), 2, 'Indenting a parent must retain its child hierarchy');
assert.equal(indentApp._adjustEditorIndent(-1), true);
assert.equal(indentApp._getTodoLevel(childTodo), 0, 'To-do item must outdent');
assert.equal(indentApp._getTodoLevel(grandchildTodo), 1, 'Outdenting a parent must retain its child hierarchy');

let nestedList;
const rootList = { tagName: 'UL' };
const firstItem = {
    tagName: 'LI', children: [], parentElement: rootList,
    appendChild(node) { node.parentElement = this; this.children.push(node); },
    after(node) {
        node.parentElement.children = node.parentElement.children.filter((child) => child !== node);
        node.parentElement = rootList;
    }
};
const secondItem = { tagName: 'LI', parentElement: rootList, previousElementSibling: firstItem };
context.document = {
    createElement: (tagName) => {
        nestedList = {
            tagName: tagName.toUpperCase(), children: [],
            appendChild(node) { node.parentElement = this; this.children.push(node); },
            remove() { this.removed = true; }
        };
        return nestedList;
    }
};
context.window.getSelection = () => ({ anchorNode: { nodeType: 1, closest: (selector) => selector === 'li' ? secondItem : null } });
assert.equal(indentApp._adjustEditorIndent(1), true);
assert.equal(secondItem.parentElement, nestedList, 'List item must become a nested sub-item');
assert.equal(nestedList.parentElement, firstItem);
assert.equal(indentApp._adjustEditorIndent(-1), true);
assert.equal(secondItem.parentElement, rootList, 'Shift+Tab must return a sub-item to the parent list');
assert.equal(nestedList.removed, true, 'Empty nested list must be removed');

const activeTodo = makeTodo(2);
activeTodo.nextElementSibling = null;
let createdTodo;
activeTodo.after = (node) => { createdTodo = node; };
const currentText = { nodeType: 1, hasChildNodes: () => true, closest: (selector) => selector === '.notion-todo-text' ? currentText : selector === '.notion-todo-row' ? activeTodo : null };
const nextText = { textContent: '', children: [], appendChild(node) { this.children.push(node); }, hasChildNodes() { return this.children.length > 0; }, querySelector: () => null };
const caretRange = { startContainer: currentText, startOffset: 0, deleteContents: () => {} };
context.document = {
    createRange: () => ({ selectNodeContents: () => {}, setStart: () => {}, extractContents: () => ({}) }),
    createElement: () => {
        const row = makeTodo(0);
        row.querySelector = () => nextText;
        return row;
    }
};
context.window.getSelection = () => ({ rangeCount: 1, anchorNode: currentText, getRangeAt: () => caretRange });
indentApp._focusEditorNode = () => {};
assert.equal(indentApp._insertNextTodoRow(), true);
assert.equal(indentApp._getTodoLevel(createdTodo), 2, 'Enter on a sub-To-do must keep the same level');

app.editingNoteId = app.notes[0].id;
app._setImageUploadStatus = () => {};
app.overlay = null;
app.contentEditor.innerHTML = '<div class="notion-todo-row" data-level="1"><input type="checkbox"><div class="notion-todo-text">Sub task</div></div>';
app.editorDirty = true;
app._saveFromModal(true);
app._openModal(app.notes[0].id);
assert.match(app.contentEditor.innerHTML, /data-level="1"/, 'To-do nesting must survive save and reopen');

console.log('Notes rich-editor formatting, nested lists/To-dos, table, draft and save/reopen regression tests passed.');
