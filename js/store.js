/* ============================================================
   LAGOM CET-6 · store.js
   Local-first persistence, learning records and derived stats.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var data = CET6.data;
  var KEY = 'lagom-cet6-v1';
  var DEMO_FLAG = 'lagom-cet6-demo-dismissed';

  function defaultState() {
    return {
      version: 2,
      createdAt: Date.now(),
      demo: false,
      demoDismissed: false,
      attempts: [],
      wrongMeta: {},
      wordProgress: {},
      wordLog: {},
      settings: {
        dailyWordGoal: 20,
        examDate: '2026-12-19',
        targetScore: 550
      }
    };
  }

  function loadState() {
    var raw = CET6.storageGet(KEY, null);
    if (!raw || typeof raw !== 'object' || raw.version !== 2) return defaultState();
    var base = defaultState();
    return Object.assign(base, raw, {
      settings: Object.assign(base.settings, raw.settings || {}),
      attempts: Array.isArray(raw.attempts) ? raw.attempts : [],
      wrongMeta: raw.wrongMeta || {},
      wordProgress: raw.wordProgress || {},
      wordLog: raw.wordLog || {}
    });
  }

  var state = loadState();

  function save() {
    try {
      CET6.storageSet(KEY, state);
    } catch (e) {}
    if (CET6.onStoreChange) CET6.onStoreChange();
  }

  /* ----------------------------------------------------------
     Attempt summarisation
     ---------------------------------------------------------- */
  function summarizeItems(items, meta) {
    var totalPoints = 0;
    var earned = 0;
    var correct = 0;
    var rated = 0;
    var pending = 0;
    var answered = 0;
    var sectionMap = {};

    items.forEach(function (it) {
      var points = Number(it.points || 0);
      totalPoints += points;
      var isTask = it.type === 'writing' || it.type === 'translation';
      if (it.answered) answered++;
      if (isTask) {
        if (it.answered === false) {
          // An empty writing/translation response is not "pending self-review".
        } else if (it.scorePct == null) {
          pending++;
        } else {
          rated++;
          if (it.scorePct >= 60) correct++;
          earned += points * (it.scorePct / 100);
        }
      } else if (it.answered !== false) {
        rated++;
        if (it.correct) { correct++; earned += points; }
      }
      if (it.sectionId) {
        var s = sectionMap[it.sectionId] || (sectionMap[it.sectionId] = {
          id: it.sectionId,
          title: it.sectionTitle || it.sectionId,
          module: it.module,
          points: 0,
          earned: 0,
          total: 0,
          correct: 0
        });
        s.points += points;
        s.total++;
        if (it.correct) s.correct++;
        if (isTask) {
          if (it.scorePct != null) s.earned += points * (it.scorePct / 100);
        } else if (it.correct) {
          s.earned += points;
        }
      }
    });

    var accuracy = rated ? Math.round((correct / rated) * 100) : 0;
    var scorePct = totalPoints ? Math.round((earned / totalPoints) * 100) : 0;
    var sectionScores = Object.keys(sectionMap).map(function (k) {
      var s = sectionMap[k];
      s.pct = s.points ? Math.round((s.earned / s.points) * 100) : 0;
      return s;
    });

    return {
      totalQuestions: items.length,
      answered: answered,
      correct: correct,
      pending: pending,
      rated: rated,
      accuracy: accuracy,
      earned: Math.round(earned * 100) / 100,
      totalPoints: Math.round(totalPoints * 100) / 100,
      scorePct: scorePct,
      sectionScores: sectionScores
    };
  }

  function buildAttempt(input) {
    var items = input.items || [];
    var summary = summarizeItems(items, input);
    var totalPoints = input.totalPoints || summary.totalPoints;
    var earned = summary.earned;
    if (input.totalPoints && summary.totalPoints && Math.abs(input.totalPoints - summary.totalPoints) > 0.01) {
      earned = summary.earned * (input.totalPoints / summary.totalPoints);
    }
    var scorePct = totalPoints ? Math.round((earned / totalPoints) * 100) : summary.scorePct;
    return {
      id: input.id || CET6.uid('attempt'),
      kind: input.kind || 'drill',
      refId: input.refId || '',
      title: input.title || '练习记录',
      subtitle: input.subtitle || '',
      module: input.module || 'mixed',
      startedAt: input.startedAt || Date.now(),
      finishedAt: input.finishedAt || Date.now(),
      durationSec: input.durationSec || 0,
      totalQuestions: summary.totalQuestions,
      answered: summary.answered,
      correct: summary.correct,
      pending: summary.pending,
      rated: summary.rated,
      accuracy: summary.accuracy,
      earned: Math.round(earned * 100) / 100,
      totalPoints: Math.round(totalPoints * 100) / 100,
      scorePct: scorePct,
      items: items,
      sectionScores: summary.sectionScores,
      demo: !!input.demo
    };
  }

  function recordAttempt(attempt) {
    dropDemo(true);
    state.attempts.push(attempt);
    // keep storage bounded: newest 200 attempts
    if (state.attempts.length > 200) state.attempts = state.attempts.slice(-200);
    attempt.items.forEach(function (it) {
      if (it.answered === false) return;
      if (it.correct || it.type !== 'choice') return;
      var meta = state.wrongMeta[it.qid] || (state.wrongMeta[it.qid] = { wrongCount: 0, mastered: false, firstAt: Date.now() });
      meta.wrongCount = (meta.wrongCount || 0) + 1;
      meta.lastAt = attempt.finishedAt;
      meta.mastered = false;
      meta.lastAttemptId = attempt.id;
    });
    save();
    return attempt;
  }

  function updateAttempt(id, patch) {
    var a = getAttempt(id);
    if (!a) return null;
    Object.assign(a, patch);
    save();
    return a;
  }

  function getAttempt(id) {
    return state.attempts.find(function (a) { return a.id === id; }) || null;
  }

  function getAttempts() {
    return state.attempts.slice().sort(function (a, b) { return b.finishedAt - a.finishedAt; });
  }

  function clearAllData() {
    var fresh = defaultState();
    fresh.demoDismissed = true;
    Object.keys(state).forEach(function (key) { delete state[key]; });
    Object.assign(state, fresh);
    save();
    return state;
  }

  function clearDemoData() {
    state.attempts = state.attempts.filter(function (a) { return !a.demo; });
    state.wordProgress = {};
    state.wordLog = {};
    state.wrongMeta = {};
    state.demo = false;
    state.demoDismissed = true;
    try { CET6.storageSet(DEMO_FLAG, true); } catch (e) {}
    save();
  }

  function dropDemo(silent) {
    if (!state.demo) return false;
    clearDemoData();
    if (!silent && CET6.toast) CET6.toast('示例数据已清除，开始记录你的学习');
    return true;
  }

  /* ----------------------------------------------------------
     Demo data — gives the dashboard a heartbeat on first visit.
     Cleared automatically as soon as the learner does anything.
     ---------------------------------------------------------- */
  function pseudo(n, seed) {
    return (n * 37 + seed * 17 + 11) % 100;
  }

  function makeDemoAttempt(paper, daysAgo, target, seed) {
    var flat = data.getPaperQuestions(paper);
    if (!flat.length) return null;
    var moduleLift = { listening: -2, reading: 7, writing: 9, translation: 4 };
    var items = [];
    var started = new Date();
    started.setDate(started.getDate() - daysAgo);
    started.setHours(19, 30, 0, 0);
    var finished = new Date(started.getTime() + (paper.type === 'mock' ? 108 : 38) * 60 * 1000);

    flat.forEach(function (row, idx) {
      var q = row.question;
      var module = row.unit.module;
      var isTask = q.type === 'writing' || q.type === 'translation';
      var lift = moduleLift[module] || 0;
      var item = {
        qid: q.id,
        unitId: row.unit.id,
        module: module,
        tag: q.tag || (row.unit.tags || [])[0] || data.moduleName(module),
        type: isTask ? 'writing' : 'choice',
        points: Math.round(row.points * 10) / 10,
        answered: true,
        sectionId: row.section ? row.section.id : '',
        sectionTitle: row.section ? row.section.title : ''
      };
      if (isTask) {
        item.scorePct = CET6.clamp(target + lift + (pseudo(idx, seed) % 9) - 4, 35, 94);
        item.correct = item.scorePct >= 60;
        item.userAnswer = '';
      } else {
        item.correct = pseudo(idx, seed) < CET6.clamp(target + lift, 25, 93);
        item.userAnswer = item.correct ? q.answer : (q.answer + 1 + (idx % 3)) % 4;
        item.scorePct = item.correct ? 100 : 0;
      }
      items.push(item);
    });

    return buildAttempt({
      id: 'demo-' + paper.id + '-' + daysAgo,
      kind: paper.type,
      refId: paper.id,
      title: paper.title,
      subtitle: paper.subtitle,
      module: 'mixed',
      startedAt: started.getTime(),
      finishedAt: finished.getTime(),
      durationSec: (paper.type === 'mock' ? 96 : 29) * 60 + seed * 13,
      items: items,
      totalPoints: paper.totalPoints,
      demo: true
    });
  }

  function makeDemoDrill(module, daysAgo, target, seed) {
    var units = data.getDrillUnits(module);
    if (!units.length) return null;
    var flat = data.getUnitQuestions(units).filter(function (row, i) { return i < 8; });
    var items = flat.map(function (row, idx) {
      var q = row.question;
      var correct = pseudo(idx, seed) < target;
      return {
        qid: q.id,
        unitId: row.unit.id,
        module: module,
        tag: q.tag || (row.unit.tags || [])[0] || '细节题',
        type: 'choice',
        points: 1,
        answered: true,
        correct: correct,
        userAnswer: correct ? q.answer : (q.answer + 2) % 4,
        scorePct: correct ? 100 : 0,
        sectionId: '',
        sectionTitle: ''
      };
    });
    var started = new Date();
    started.setDate(started.getDate() - daysAgo);
    started.setHours(21, 10, 0, 0);
    return buildAttempt({
      id: 'demo-drill-' + module + '-' + daysAgo,
      kind: 'drill',
      refId: 'drill-' + module,
      title: '专项练习 · ' + data.moduleName(module),
      subtitle: '示例专项训练',
      module: module,
      startedAt: started.getTime(),
      finishedAt: started.getTime() + 11 * 60 * 1000,
      durationSec: 9 * 60 + seed * 17,
      items: items,
      totalPoints: items.length,
      demo: true
    });
  }

  function seedDemo() {
    var p = data.paperById;
    var demoAttempts = [
      makeDemoAttempt(p['set-02'], 27, 50, 3),
      makeDemoAttempt(p['set-01'], 22, 56, 5),
      makeDemoAttempt(p['mock-01'], 17, 58, 7),
      makeDemoAttempt(p['set-03'], 13, 64, 9),
      makeDemoDrill('reading', 10, 68, 11),
      makeDemoAttempt(p['mock-02'], 6, 69, 13),
      makeDemoDrill('listening', 2, 61, 15)
    ].filter(Boolean);
    if (!demoAttempts.length) return false;

    state.attempts = demoAttempts;
    demoAttempts.forEach(function (attempt) {
      attempt.items.forEach(function (it) {
        if (it.correct || it.type !== 'choice') return;
        var meta = state.wrongMeta[it.qid] || (state.wrongMeta[it.qid] = { wrongCount: 0, mastered: false, firstAt: attempt.finishedAt });
        meta.wrongCount += 1;
        meta.lastAt = attempt.finishedAt;
      });
    });

    // words: a believable two-week learning trail
    if (data.words.length) {
      data.words.slice(0, 52).forEach(function (w, i) {
        if (i % 7 === 6) return;
        var status = i % 5 === 0 ? 'known' : (i % 3 === 0 ? 'learning' : 'known');
        var wrong = i % 9 === 0 ? 2 : (i % 6 === 0 ? 1 : 0);
        state.wordProgress[w.id] = {
          status: status,
          seen: 1 + (i % 3),
          correct: status === 'known' ? 1 : 0,
          wrong: wrong,
          starred: i % 11 === 0,
          lastAt: Date.now() - (i % 11) * 86400000,
          nextAt: Date.now() + (i % 4) * 86400000
        };
      });
      for (var d = 13; d >= 0; d--) {
        var key = CET6.dateKey(CET6.addDays(new Date(), -d));
        var learned = [16, 20, 0, 12, 24, 8, 18, 22, 0, 14, 20, 6, 18, 10][d] || 0;
        if (learned) state.wordLog[key] = { new: Math.round(learned * 0.6), review: Math.round(learned * 0.4), known: Math.round(learned * 0.4) };
      }
    }

    state.demo = true;
    save();
    return true;
  }

  function ensureDemo() {
    if (state.demo) return true;
    if (state.attempts.length || Object.keys(state.wordProgress).length) return false;
    if (CET6.storageGet(DEMO_FLAG, false)) return false;
    if (!data.papers.length || !data.words.length) return false;
    return seedDemo();
  }

  /* ----------------------------------------------------------
     Word learning
     ---------------------------------------------------------- */
  function ensureWord(id) {
    return state.wordProgress[id] || (state.wordProgress[id] = {
      status: 'new', seen: 0, correct: 0, wrong: 0, starred: false, lastAt: 0, nextAt: 0
    });
  }

  function logWord(kind) {
    var key = CET6.todayKey();
    var log = state.wordLog[key] || (state.wordLog[key] = { new: 0, review: 0, known: 0 });
    log[kind] = (log[kind] || 0) + 1;
  }

  function recordWord(id, rating) {
    dropDemo(true);
    var w = data.wordById[id];
    if (!w) return null;
    var p = state.wordProgress[id];
    var first = !p || !p.seen;
    p = ensureWord(id);
    p.seen += 1;
    p.lastAt = Date.now();
    if (rating === 'known') {
      p.status = 'known';
      p.correct += 1;
      p.nextAt = Date.now() + 7 * 86400000;
      logWord(first ? 'new' : 'review');
      logWord('known');
    } else if (rating === 'fuzzy') {
      p.status = p.status === 'known' ? 'known' : 'learning';
      p.nextAt = Date.now() + 86400000;
      logWord(first ? 'new' : 'review');
    } else {
      p.status = 'learning';
      p.wrong += 1;
      p.nextAt = Date.now() + 6 * 3600000;
      logWord(first ? 'new' : 'review');
    }
    save();
    return p;
  }

  function setWordStatus(id, status) {
    dropDemo(true);
    var p = ensureWord(id);
    p.status = status;
    p.lastAt = Date.now();
    if (status === 'new') {
      p.seen = 0;
      p.nextAt = 0;
    } else {
      p.seen = Math.max(1, p.seen || 0);
      if (status === 'known') p.nextAt = Date.now() + 7 * 86400000;
    }
    save();
    return p;
  }

  function toggleStarWord(id) {
    dropDemo(true);
    var p = ensureWord(id);
    p.starred = !p.starred;
    p.lastAt = Date.now();
    save();
    return p.starred;
  }

  function getWordProgress(id) {
    return state.wordProgress[id] || null;
  }

  function getWordStats() {
    var total = data.words.length;
    var learned = 0, known = 0, learning = 0, wrong = 0, starred = 0, due = 0;
    var now = Date.now();
    data.words.forEach(function (w) {
      var p = state.wordProgress[w.id];
      if (!p || !p.seen) return;
      learned++;
      if (p.status === 'known') known++;
      else learning++;
      if (p.wrong > 0) wrong++;
      if (p.starred) starred++;
      if (p.status !== 'known' && p.nextAt && p.nextAt <= now) due++;
    });
    var today = state.wordLog[CET6.todayKey()] || { new: 0, review: 0, known: 0 };
    var goal = state.settings.dailyWordGoal || 20;
    var todayTotal = (today.new || 0) + (today.review || 0);
    var logs = [];
    for (var i = 13; i >= 0; i--) {
      var key = CET6.dateKey(CET6.addDays(new Date(), -i));
      var l = state.wordLog[key] || { new: 0, review: 0, known: 0 };
      logs.push({ date: key, total: (l.new || 0) + (l.review || 0), new: l.new || 0, review: l.review || 0 });
    }
    return {
      total: total,
      learned: learned,
      known: known,
      learning: learning,
      wrong: wrong,
      starred: starred,
      due: due,
      remaining: Math.max(0, total - learned),
      todayNew: today.new || 0,
      todayReview: today.review || 0,
      todayTotal: todayTotal,
      goal: goal,
      goalPct: Math.min(100, Math.round((todayTotal / goal) * 100)),
      logs: logs
    };
  }

  function getWordDeck(mode, size) {
    var now = Date.now();
    var words = data.words;
    var out;
    if (mode === 'wrong') {
      out = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return p && p.wrong > 0;
      }).sort(function (a, b) {
        var pa = state.wordProgress[a.id], pb = state.wordProgress[b.id];
        return (pb.wrong || 0) - (pa.wrong || 0);
      });
    } else if (mode === 'star') {
      out = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return p && p.starred;
      });
    } else if (mode === 'new') {
      out = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return !p || !p.seen;
      });
    } else if (mode === 'review') {
      out = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return p && p.seen && p.status !== 'known' && (!p.nextAt || p.nextAt <= now);
      });
    } else {
      // today's mix: due review first, then new words up to goal
      var dueWords = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return p && p.seen && p.status !== 'known' && (!p.nextAt || p.nextAt <= now);
      });
      var newWords = words.filter(function (w) {
        var p = state.wordProgress[w.id];
        return !p || !p.seen;
      });
      out = dueWords.concat(newWords);
    }
    out = out.slice();
    if (size && out.length > size) out = out.slice(0, size);
    return out;
  }

  /* ----------------------------------------------------------
     Wrong questions
     ---------------------------------------------------------- */
  function getWrongQuestions(opts) {
    opts = opts || {};
    var includeMastered = !!opts.includeMastered;
    var byQid = {};
    getAttempts().slice().reverse().forEach(function (attempt) {
      (attempt.items || []).forEach(function (it) {
        if (it.correct || it.answered === false) return;
        if ((it.type === 'writing' || it.type === 'translation') && it.scorePct == null) return;
        var meta = state.wrongMeta[it.qid] || {};
        var entry = byQid[it.qid];
        if (!entry) {
          entry = byQid[it.qid] = {
            qid: it.qid,
            unitId: it.unitId,
            module: it.module,
            tag: it.tag,
            type: it.type,
            wrongCount: meta.wrongCount || 1,
            mastered: !!meta.mastered,
            lastAt: attempt.finishedAt,
            userAnswer: it.userAnswer,
            scorePct: it.scorePct,
            attemptId: attempt.id,
            attemptTitle: attempt.title
          };
        }
        entry.lastAt = Math.max(entry.lastAt, attempt.finishedAt);
        entry.userAnswer = it.userAnswer;
        entry.scorePct = it.scorePct;
        entry.attemptId = attempt.id;
        entry.attemptTitle = attempt.title;
      });
    });
    var list = Object.keys(byQid).map(function (qid) {
      var e = byQid[qid];
      var q = data.questionById[qid];
      var u = data.unitById[e.unitId];
      if (!q || !u) return null;
      return Object.assign(e, {
        question: q,
        unit: u,
        mastered: !!(state.wrongMeta[qid] && state.wrongMeta[qid].mastered)
      });
    }).filter(Boolean);
    if (!includeMastered) list = list.filter(function (e) { return !e.mastered; });
    if (opts.module) list = list.filter(function (e) { return e.module === opts.module; });
    if (opts.tag) list = list.filter(function (e) { return e.tag === opts.tag; });
    return list.sort(function (a, b) { return b.lastAt - a.lastAt; });
  }

  function markMastered(qid, mastered) {
    var meta = state.wrongMeta[qid] || (state.wrongMeta[qid] = { wrongCount: 0, mastered: false });
    meta.mastered = !!mastered;
    meta.masteredAt = mastered ? Date.now() : null;
    save();
  }

  /* ----------------------------------------------------------
     Derived stats
     ---------------------------------------------------------- */
  function getStreak() {
    var days = {};
    state.attempts.forEach(function (a) {
      if (a.items && a.items.length) days[CET6.dateKey(a.finishedAt)] = true;
    });
    Object.keys(state.wordLog).forEach(function (k) {
      var l = state.wordLog[k];
      if (l && (l.new || l.review || l.known)) days[k] = true;
    });
    var d = new Date();
    if (!days[CET6.dateKey(d)]) d = CET6.addDays(d, -1);
    var streak = 0;
    while (days[CET6.dateKey(d)]) {
      streak++;
      d = CET6.addDays(d, -1);
    }
    return streak;
  }

  function getStudyDays() {
    var days = {};
    state.attempts.forEach(function (a) { days[CET6.dateKey(a.finishedAt)] = true; });
    Object.keys(state.wordLog).forEach(function (k) {
      var l = state.wordLog[k];
      if (l && (l.new || l.review || l.known)) days[k] = true;
    });
    return Object.keys(days).length;
  }

  function getSummary() {
    var attempts = state.attempts;
    var correct = 0, rated = 0, objectiveCorrect = 0, objectiveRated = 0;
    var uniqueQids = {};
    var totalTime = 0;
    attempts.forEach(function (a) {
      totalTime += a.durationSec || 0;
      (a.items || []).forEach(function (it) {
        if (it.answered) uniqueQids[it.qid] = true;
        var isTask = it.type === 'writing' || it.type === 'translation';
        if (isTask) {
          if (it.scorePct == null) return;
          rated++;
          if (it.scorePct >= 60) correct++;
        } else {
          rated++;
          objectiveRated++;
          if (it.correct) { correct++; objectiveCorrect++; }
        }
      });
    });
    var ws = getWordStats();
    return {
      attemptCount: attempts.length,
      completedQuestions: Object.keys(uniqueQids).length,
      totalAnswers: rated,
      correct: correct,
      accuracy: rated ? Math.round((correct / rated) * 100) : 0,
      objectiveAccuracy: objectiveRated ? Math.round((objectiveCorrect / objectiveRated) * 100) : 0,
      studyDays: getStudyDays(),
      streak: getStreak(),
      totalTime: totalTime,
      wordsLearned: ws.learned,
      wordsKnown: ws.known,
      wordStats: ws
    };
  }

  function getModuleStats() {
    var acc = {};
    data.modules.forEach(function (m) {
      acc[m] = { module: m, total: 0, correct: 0, accuracy: 0, pending: 0 };
    });
    state.attempts.forEach(function (a) {
      (a.items || []).forEach(function (it) {
        var row = acc[it.module];
        if (!row) return;
        var isTask = it.type === 'writing' || it.type === 'translation';
        if (isTask && it.scorePct == null) { if (it.answered !== false) row.pending++; return; }
        if (it.answered === false) { row.pending++; return; }
        row.total++;
        if (isTask ? it.scorePct >= 60 : it.correct) row.correct++;
      });
    });
    Object.keys(acc).forEach(function (m) {
      var r = acc[m];
      r.accuracy = r.total ? Math.round((r.correct / r.total) * 100) : 0;
      r.name = data.moduleName(m);
    });
    return acc;
  }

  function getTagStats() {
    var acc = {};
    state.attempts.forEach(function (a) {
      (a.items || []).forEach(function (it) {
        if (it.type !== 'choice' || !it.tag) return;
        if (it.answered === false) return;
        var row = acc[it.tag] || (acc[it.tag] = { tag: it.tag, total: 0, correct: 0, accuracy: 0, module: it.module });
        row.total++;
        if (it.correct) row.correct++;
      });
    });
    return Object.keys(acc).map(function (k) {
      var r = acc[k];
      r.accuracy = r.total ? Math.round((r.correct / r.total) * 100) : 0;
      return r;
    }).sort(function (a, b) { return b.total - a.total; });
  }

  function getScoreTrend(kind) {
    var list = state.attempts.filter(function (a) {
      if (a.kind !== 'mock' && a.kind !== 'set') return false;
      if (kind === 'mock' && a.kind !== 'mock') return false;
      if (kind === 'set' && a.kind !== 'set') return false;
      return true;
    }).sort(function (a, b) { return a.finishedAt - b.finishedAt; });
    return list.slice(-12).map(function (a) {
      return {
        attemptId: a.id,
        title: a.title,
        kind: a.kind,
        date: a.finishedAt,
        scorePct: a.scorePct,
        accuracy: a.accuracy,
        earned: a.earned,
        totalPoints: a.totalPoints
      };
    });
  }

  function getActivity(days) {
    days = days || 84;
    var map = {};
    var start = CET6.startOfDay(CET6.addDays(new Date(), -(days - 1)));
    for (var i = 0; i < days; i++) {
      var key = CET6.dateKey(CET6.addDays(start, i));
      map[key] = { date: key, questions: 0, words: 0, attempts: 0, total: 0 };
    }
    state.attempts.forEach(function (a) {
      var key = CET6.dateKey(a.finishedAt);
      var row = map[key];
      if (!row) return;
      row.attempts++;
      row.questions += (a.items || []).length;
      row.total += (a.items || []).length;
    });
    Object.keys(state.wordLog).forEach(function (key) {
      var row = map[key];
      if (!row) return;
      var l = state.wordLog[key];
      var words = (l.new || 0) + (l.review || 0);
      row.words += words;
      row.total += words;
    });
    return map;
  }

  function getRecentAttempts(n) {
    return getAttempts().slice(0, n || 5);
  }

  function getBest(refId) {
    var list = state.attempts.filter(function (a) { return a.refId === refId; });
    if (!list.length) return null;
    return list.reduce(function (best, a) { return a.scorePct > best.scorePct ? a : best; });
  }

  function getPaperProgress(paper) {
    var refId = typeof paper === 'string' ? paper : (paper && paper.id);
    var attempts = state.attempts.filter(function (a) { return a.refId === refId; });
    if (!attempts.length) return null;
    var best = attempts.reduce(function (b, a) { return a.scorePct > b.scorePct ? a : b; });
    return { count: attempts.length, best: best, last: attempts[attempts.length - 1] };
  }

  function getExamCountdown() {
    var exam = new Date((state.settings.examDate || '2026-12-19') + 'T09:00:00');
    var diff = Math.ceil((exam - new Date()) / 86400000);
    return { days: Math.max(0, diff), date: state.settings.examDate };
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    save();
  }

  function exportJSON() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      attempts: state.attempts,
      wrongMeta: state.wrongMeta,
      wordProgress: state.wordProgress,
      wordLog: state.wordLog
    }, null, 2);
  }

  /* ----------------------------------------------------------
     Exports
     ---------------------------------------------------------- */
  CET6.store = {
    state: state,
    getState: function () { return state; },
    save: save,
    summarizeItems: summarizeItems,
    buildAttempt: buildAttempt,
    recordAttempt: recordAttempt,
    updateAttempt: updateAttempt,
    getAttempt: getAttempt,
    getAttempts: getAttempts,
    clearAllData: clearAllData,
    clearDemoData: clearDemoData,
    dropDemo: dropDemo,
    ensureDemo: ensureDemo,
    seedDemo: seedDemo,
    recordWord: recordWord,
    setWordStatus: setWordStatus,
    toggleStarWord: toggleStarWord,
    getWordProgress: getWordProgress,
    getWordStats: getWordStats,
    getWordDeck: getWordDeck,
    getWrongQuestions: getWrongQuestions,
    markMastered: markMastered,
    getStreak: getStreak,
    getStudyDays: getStudyDays,
    getSummary: getSummary,
    getModuleStats: getModuleStats,
    getTagStats: getTagStats,
    getScoreTrend: getScoreTrend,
    getActivity: getActivity,
    getRecentAttempts: getRecentAttempts,
    getBest: getBest,
    getPaperProgress: getPaperProgress,
    getExamCountdown: getExamCountdown,
    setSetting: setSetting,
    exportJSON: exportJSON
  };
})();
