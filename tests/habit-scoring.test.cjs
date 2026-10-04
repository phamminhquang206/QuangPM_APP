const assert = require('node:assert/strict');
const scoring = require('../habit-scoring.js');
const habits = Array.from({length: 5}, (_, i) => ({id: String(i), type: 'checkbox'}));
const entries = n => Object.fromEntries(habits.slice(0,n).map(h => [h.id, {completed:true}]));
assert.equal(scoring.dayResult(habits, entries(2)).qualifies, false);
assert.equal(scoring.dayResult(habits, entries(3)).qualifies, true);
assert.equal(scoring.dayResult(habits.slice(0,4), entries(2)).qualifies, true);
assert.deepEqual([0,1,3,5].map(n => {let r=scoring.dayResult(habits, entries(n)); return [r.earned,r.penalty];}), [[0,20],[10,20],[30,10],[70,0]]);
assert.equal(scoring.dayResult([{id:'n',type:'numeric',target:20}], {n:{value:40}}).earned, 30);
function profile(start='2026-09-28', base=100) {
 return {scoring:{startDate:start, baseXP:base, basePoints:base, schedules:[{date:start,habits}], redemptions:[], hiddenPenalties:[]}};
}
function logDays(start,count,n=3) {
 const logs={}; let date=start;
 for(let i=0;i<count;i++,date=scoring.nextDate(date)) {
  (logs[date.slice(0,7)] ||= {days:{}}).days[date]=entries(n);
 }
 return logs;
}
const p=profile(); const logs=logDays('2026-09-28',7);
let r=scoring.calculate(p,logs,'2026-10-05');
assert.equal(r.xp,340); // 7 * 30 + milestone 30 + baseline 100
assert.equal(r.points,270); // 7 * 20 + milestone 30 + baseline 100
assert.equal(r.currentStreak,7, 'Unfinished today preserves yesterday streak across month');
assert.equal(r.penalties.length,7);
assert.deepEqual(scoring.calculate(p,logs,'2026-10-05'),r,'Repeated calculation is idempotent');
// Today's XP is provisional. Undo does not cause an extra deduction.
logs['2026-10'].days['2026-10-05']=entries(5);
assert.equal(scoring.calculate(p,logs,'2026-10-05').xp,r.xp);
logs['2026-10'].days['2026-10-05']=entries(0);
assert.equal(scoring.calculate(p,logs,'2026-10-05').points,r.points);
// Editing past days recomputes rewards, penalties and milestones.
logs['2026-09'].days['2026-09-28']=entries(5);
let edited=scoring.calculate(p,logs,'2026-10-05');
assert.equal(edited.xp,r.xp+40);
assert.equal(edited.points,r.points+50);
p.scoring.hiddenPenalties=['2026-09-29'];
assert.equal(scoring.calculate(p,logs,'2026-10-05').points,edited.points);
assert.equal(scoring.calculate(p,logs,'2026-10-05').penalties.length,5);
p.scoring.redemptions.push({date:'2026-10-05',cost:100});
assert.equal(scoring.calculate(p,logs,'2026-10-05').xp,edited.xp);
assert.equal(scoring.calculate(p,logs,'2026-10-05').points,edited.points-100);
// Changing/deleting today's requirements preserves older dates.
p.scoring.schedules.push({date:'2026-10-05',habits:[]});
assert.equal(scoring.dueOn(p,'2026-10-04').length,5);
assert.equal(scoring.dueOn(p,'2026-10-05').length,0);
const thirty=profile('2026-09-01',0);
let long=scoring.calculate(thirty,logDays('2026-09-01',30),'2026-10-01');
assert.equal(long.xp,1030); // 900 + 30 + 100
assert.equal(long.currentStreak,30);
// A new streak receives its own milestones.
const repeatedLogs=logDays('2026-09-01',7);
Object.assign((repeatedLogs['2026-09'] ||= {days:{}}).days,logDays('2026-09-09',7)['2026-09'].days);
assert.equal(scoring.calculate(thirty,repeatedLogs,'2026-09-16').xp,480);
assert.equal(scoring.calculate(profile('2026-10-01',0),{},'2026-10-04').points,0);
const migrated=profile('2026-10-01',500);migrated.scoring.migrationCredit=70;
assert.equal(scoring.calculate(migrated,logDays('2026-10-01',1,5),'2026-10-02').xp,500);
console.log('Habit scoring tests passed');
// Verify the app wiring uses provisional scoring instead of click-based rewards.
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const names = ['_recordHabitSchedule','_calculateStreaks','_toggleCheckbox'];
const methods = names.map(name => {
 const start=source.indexOf('HabitApp.prototype.'+name+' = function');
 const end=source.indexOf('\n    };',start)+'\n    };'.length;
 assert.ok(start>=0);
 return source.slice(start,end);
}).join('\n');
const context={HabitApp:function(){},HabitScoring:scoring,Date,currentUser:null,ALL_HABIT_BADGES:[],playChime(){},PwaManager:{showToast(){}},t(){return '{title}';}};
vm.runInNewContext(methods,context);
const app=new context.HabitApp();
app.habits=[{id:'one',type:'checkbox',title:'One'}];app.habitLogs={};app.habitProfile={xp:100,badges:[],penalties:[]};
let saved=0;app._saveProfile=()=>saved++;app._renderStats=()=>{};app._saveMonthLogs=()=>{};app._renderMatrix=()=>{};
const today=scoring.dateKey(new Date());app._getMonthKey=()=>today.slice(0,7);
app._calculateStreaks();assert.equal(app.habitProfile.points,100);
const initialSaved=saved;app._calculateStreaks();assert.equal(saved,initialSaved,'No redundant profile write on repeat');
app._toggleCheckbox(today,'one');assert.equal(app.habitProfile.xp,100);assert.equal(app.habitProfile.points,100);
app._toggleCheckbox(today,'one');assert.equal(app.habitProfile.xp,100);assert.equal(app.habitProfile.points,100,'Undoing a provisional completion never charges points');
console.log('Habit app integration tests passed');
