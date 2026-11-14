const assert = require('node:assert/strict');
const { test } = require('node:test');
const { todayTasks, promptContents } = require('../assistant.js');

test('Today groups unfinished tasks once and orders their local dates', () => {
    const now = new Date(2026, 10, 14, 12);
    const reminder = new Date(2026, 10, 14, 13).getTime();
    const tasks = [
        { id: 'late', endDate: '2026-11-13', reminder },
        { id: 'today', endDate: '2026-11-14', reminder },
        { id: 'later-today', endDate: '2026-11-14T19:00' },
        { id: 'remind', endDate: '2026-11-16', reminder },
        { id: 'done', endDate: '2026-11-14', reminder, completed: true },
        { id: 'unscheduled' }
    ];
    const groups = todayTasks(tasks, task => task.reminder, now);
    assert.deepEqual(groups.map(group => group.map(({ task }) => task.id)), [
        ['late'], ['later-today', 'today'], ['remind']
    ]);
});

test('Gemini gets a bounded dialogue and only the current preview as an attachment', () => {
    const history = Array.from({ length: 8 }, (_, index) => ({
        question: 'Question ' + index, reply: 'Reply ' + index, attachment: 'Previous private attachment'
    }));
    const excerpt = 'Selected note excerpt\n  Exact preview whitespace  ';
    const payload = promptContents(history, 'New question', excerpt);
    assert.equal(payload.length, 13);
    assert.equal(payload[0].parts[0].text, 'Question 2');
    assert.deepEqual(payload.at(-1), {
        role: 'user', parts: [{ text: 'New question' }, { text: excerpt }]
    });
    assert.equal(JSON.stringify(payload).includes('Previous private attachment'), false);
});
