(function (root) {
    'use strict';
    function dateKey(date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }
    function nextDate(key) {
        var parts = key.split('-').map(Number);
        return dateKey(new Date(parts[0], parts[1] - 1, parts[2] + 1));
    }
    function dueOn(profile, date) {
        var versions = profile.scoring.schedules;
        var selected = [];
        versions.forEach(function (v) { if (v.date <= date) selected = v.habits; });
        return selected.filter(function (h) { return (!h.startDate || h.startDate <= date) && h.active !== false; });
    }
    function dayResult(habits, entries) {
        var done = habits.filter(function (h) {
            var entry = entries[h.id];
            return entry && (h.type === 'numeric' ? Number(entry.value) >= h.target : entry.completed === true);
        }).length;
        return { total: habits.length, done: done, earned: done * 10 + (habits.length && done === habits.length ? 20 : 0), penalty: Math.min(20, (habits.length - done) * 5), qualifies: habits.length > 0 && done * 2 >= habits.length };
    }
    function calculate(profile, logs, today) {
        var config = profile.scoring;
        var xp = config.baseXP;
        var points = config.basePoints;
        var streak = 0, longest = 0, penalties = [], perfect = [], days = {};
        for (var date = config.startDate; date <= today; date = nextDate(date)) {
            var habits = dueOn(profile, date);
            var entries = ((logs[date.slice(0, 7)] || {}).days || {})[date] || {};
            var result = dayResult(habits, entries);
            var closed = date < today;
            if (result.total) {
                // An unfinished current day must not break yesterday's streak.
                if (result.qualifies && closed) streak++;
                else if (closed) streak = 0;
                longest = Math.max(longest, streak);
                var bonus = closed && result.qualifies ? (streak === 7 ? 30 : streak === 30 ? 100 : 0) : 0;
                var credit = date === config.startDate ? (config.migrationCredit || 0) : 0;
                var earned = Math.max(0, result.earned + bonus - credit);
                if (closed) {
                    xp += earned;
                    points = Math.max(0, points + earned - result.penalty);
                    if (result.done === result.total) perfect.push(date);
                    if (result.penalty && !(config.hiddenPenalties || []).includes(date)) {
                        penalties.push({ id: 'day_' + date, date: date, missed: result.total - result.done, points: result.penalty });
                    }
                }
                result.bonus = bonus;
                result.closed = closed;
                days[date] = result;
            }
            (config.redemptions || []).filter(function (r) { return r.date === date; }).forEach(function (r) { points = Math.max(0, points - r.cost); });
        }
        var current = days[today];
        if (current && current.qualifies) streak++;
        longest = Math.max(longest, streak);
        return { xp: xp, points: points, currentStreak: streak, longestStreak: longest, penalties: penalties.reverse(), perfectDays: perfect, days: days };
    }
    var api = { dateKey: dateKey, nextDate: nextDate, dueOn: dueOn, dayResult: dayResult, calculate: calculate };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.HabitScoring = api;
})(typeof window !== 'undefined' ? window : globalThis);
