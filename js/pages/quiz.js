/* ============================================================
   LAGOM CET-6 · pages/quiz.js
   Exam / drill runner and the result & review screen.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var data = CET6.data;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var session = null;
  var timerId = null;
  var root = null;
  var keyHandler = null;
  var beforeUnload = null;

  var LETTERS = 'ABCDEFGHIJKLMNO'.split('');

  function isTaskQuestion(q, unit) {
    return q.type === 'writing' || q.type === 'translation' || unit.module === 'writing' || unit.module === 'translation';
  }

  function taskKind(q, unit) {
    if (q.type === 'translation' || unit.module === 'translation') return 'translation';
    return 'writing';
  }

  /* ----------------------------------------------------------
     Session creation
     ---------------------------------------------------------- */
  function buildSession(ctx) {
    var flat = [];
    var s = {
      mode: 'drill', kind: 'drill', refId: '', title: '', subtitle: '',
      flat: [], answers: {}, selfScores: {}, checked: {}, flagged: {},
      index: 0, startedAt: Date.now(), timeLimit: 0, paper: null, module: 'mixed',
      finished: false, allowLeave: false, passageOpen: {}, timerLabel: '用时'
    };

    if (ctx.quizKind === 'paper') {
      var paper = data.getPaper(ctx.param);
      if (!paper) return null;
      var rows = data.getPaperQuestions(paper);
      if (!rows.length) return null;
      flat = rows.map(function (r) {
        return {
          unit: r.unit, question: r.question, points: r.points,
          sectionId: r.section ? r.section.id : '',
          sectionTitle: r.section ? r.section.title : ''
        };
      });
      s.mode = paper.type === 'set' ? 'set' : 'mock';
      s.kind = paper.type;
      s.refId = paper.id;
      s.title = paper.title;
      s.subtitle = paper.subtitle;
      s.paper = paper;
      s.timeLimit = (paper.durationMin || 130) * 60;
      s.timerLabel = '剩余';
      s.module = 'mixed';
    } else if (ctx.quizKind === 'drill') {
      var units = data.getDrillUnits(ctx.param);
      if (!units.length) return null;
      flat = data.getUnitQuestions(units).map(function (r) {
        return { unit: r.unit, question: r.question, points: 1, sectionId: '', sectionTitle: r.unit.title };
      });
      s.mode = 'drill';
      s.kind = 'drill';
      s.refId = 'drill-' + ctx.param;
      s.module = ctx.param;
      s.title = data.moduleName(ctx.param) + '专项练习';
      s.subtitle = '共 ' + flat.length + ' 题 · 提交后立即查看解析';
    } else if (ctx.quizKind === 'unit') {
      var unit = data.getUnit(ctx.param);
      if (!unit) return null;
      flat = data.getUnitQuestions([unit]).map(function (r) {
        return { unit: r.unit, question: r.question, points: 1, sectionId: '', sectionTitle: unit.title };
      });
      s.mode = 'drill';
      s.kind = 'drill';
      s.refId = 'unit-' + unit.id;
      s.module = unit.module;
      s.title = unit.title;
      s.subtitle = '单项训练 · ' + flat.length + ' 题';
    } else if (ctx.quizKind === 'wrong') {
      var wrong = store.getWrongQuestions().filter(function (w) { return w.type === 'choice'; });
      if (!wrong.length) return null;
      flat = wrong.map(function (w) {
        return { unit: w.unit, question: w.question, points: 1, sectionId: '', sectionTitle: w.unit.title };
      });
      s.mode = 'wrong';
      s.kind = 'wrong';
      s.refId = 'wrong';
      s.module = 'mixed';
      s.title = '错题重练';
      s.subtitle = '共 ' + flat.length + ' 道 · 答对后自动标记为已掌握';
    } else {
      return null;
    }

    s.flat = flat;
    return s;
  }

  /* ----------------------------------------------------------
     Shell
     ---------------------------------------------------------- */
  function shell() {
    var isExam = session.mode === 'mock' || session.mode === 'set';
    var submitLabel = isExam ? '交卷' : '结束练习';
    return '<div class="page quiz-page">' +
      '<header class="quiz-topbar">' +
        '<div class="quiz-top-left">' +
          '<button class="quiz-exit" type="button" data-action="exit" aria-label="退出">' + icon('arrowLeft') + '</button>' +
          '<div class="quiz-title"><span class="quiz-kicker">' + modeLabel() + '</span><h1>' + esc(session.title) + '</h1></div>' +
        '</div>' +
        '<div class="quiz-top-center">' +
          '<span class="quiz-timer" id="quizTimer"><span class="timer-ico">' + icon('clock') + '</span><b class="num" id="quizTimerValue">--:--</b><small id="quizTimerLabel">' + session.timerLabel + '</small></span>' +
        '</div>' +
        '<div class="quiz-top-right">' +
          '<span class="quiz-answered">已答 <b id="quizAnsweredCount">0</b> / ' + session.flat.length + '</span>' +
          '<button class="btn btn-primary btn-sm" type="button" data-action="submit"><span id="quizSubmitLabel">' + submitLabel + '</span></button>' +
        '</div>' +
      '</header>' +
      '<div class="quiz-body">' +
        '<div class="quiz-main" id="quizQuestion"></div>' +
        '<aside class="quiz-side">' +
          '<div class="sheet-card">' +
            '<div class="sheet-head"><div><span class="eyebrow"><span class="dot"></span> 答题卡</span><b id="sheetProgress">0 / ' + session.flat.length + '</b></div><span class="small muted">' + (isExam ? '交卷后统一判分' : '提交后立即判分') + '</span></div>' +
            '<div id="quizSheet"></div>' +
            '<div class="sheet-legend"><span><i class="lg-done"></i>已答</span><span><i class="lg-current"></i>当前</span><span><i class="lg-flag"></i>标记</span></div>' +
            '<button class="btn btn-soft btn-block btn-sm" type="button" data-action="submit">' + icon('flag') + ' ' + submitLabel + '</button>' +
          '</div>' +
          (isExam ? '<div class="quiz-side-note">' + icon('info') + '<span>写作与翻译交卷后可对照参考并自评，估分按 710 分制换算。</span></div>' : '') +
          '<div class="quiz-side-note">' + icon('keyboard') + '<span>数字 1-4 选择，← → 切题，F 标记当前题。</span></div>' +
        '</aside>' +
      '</div>' +
      '<button class="quiz-sheet-fab" type="button" data-action="open-sheet">' + icon('grid') + ' 答题卡</button>' +
      '<div class="quiz-mobile-sheet" id="quizMobileSheet"></div>' +
    '</div>';
  }

  function modeLabel() {
    if (session.kind === 'import') return '导入真题 · IMPORT';
    if (session.mode === 'mock') return '全真模拟 · MOCK';
    if (session.mode === 'set') return '套题训练 · SET';
    if (session.mode === 'wrong') return '错题重练 · REVIEW';
    return '专项练习 · DRILL';
  }

  function current() { return session.flat[session.index]; }

  function hasAnswer(row) {
    var val = session.answers[row.question.id];
    if (isTaskQuestion(row.question, row.unit)) return !!(val && String(val).trim());
    return typeof val === 'number';
  }

  function answeredCount() {
    return session.flat.filter(hasAnswer).length;
  }

  /* ----------------------------------------------------------
     Question render
     ---------------------------------------------------------- */
  function renderQuestion() {
    var row = current();
    var q = row.question;
    var unit = row.unit;
    var task = isTaskQuestion(q, unit);
    var checked = !!session.checked[q.id];
    var answer = session.answers[q.id];
    var isExam = session.mode === 'mock' || session.mode === 'set';

    var context = '';
    if (unit.module === 'reading' && unit.passage) {
      var open = session.passageOpen[unit.id] !== false;
      context = '<article class="passage-card' + (open ? ' expanded' : '') + '">' +
        '<div class="passage-head"><div class="passage-title"><span class="passage-kicker">' + esc(unit.kind === 'passage' ? 'Reading Passage' : 'Reading') + '</span><h2>' + esc(unit.title) + '</h2></div>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="toggle-passage">' + (open ? '收起文章' : '展开全文') + ' ' + icon(open ? 'chevronDown' : 'chevronDown') + '</button></div>' +
        '<div class="passage-text">' + renderPassage(unit.passage) + '</div>' +
        '<div class="passage-foot"><span>' + icon('fileText') + ' ' + CET6.wordCount(unit.passage) + ' 词</span><span>' + icon('clock') + ' 建议 8 分钟</span></div>' +
      '</article>';
    } else if (unit.module === 'listening') {
      context = '<section class="listen-card">' +
        '<div class="listen-head"><span class="listen-kicker">' + icon('headphones') + ' LISTENING · ' + esc(listenKind(unit.kind)) + '</span>' + ui.difficulty(unit.difficulty || 2) + '</div>' +
        '<h2>' + esc(unit.title) + '</h2>' +
        '<p class="listen-desc">' + esc(unit.instructions || '听音频，选择最合适的答案。音频可回放。') + '</p>' +
        (unit.audio ? ui.audioPlayer(unit.audio, unit.title) : '<div class="audio-missing">' + icon('alertCircle') + ' 未绑定听力音频，请回到导入页重新绑定</div>') +
        (checked ? renderTranscript(unit, true) : '<div class="transcript-locked">' + icon('eye') + ' 听力原文将在提交后开放</div>') +
      '</section>';
    } else if (task) {
      context = renderTaskContext(unit, q);
    }

    var body;
    if (task) {
      body = renderTaskBody(row, taskKind(q, unit), checked, isExam);
    } else {
      body = renderChoiceBody(row, checked);
    }

    var nav = renderNav(row, checked, isExam);

    return '<div class="quiz-question-wrap">' +
      '<div class="q-context">' + context + '</div>' +
      '<article class="question-card" data-qid="' + q.id + '">' +
        '<div class="q-head">' +
          '<div class="q-head-left"><span class="q-index num">' + CET6.pad(session.index + 1) + '<em>/' + session.flat.length + '</em></span>' +
            '<span class="q-section-label">' + esc(row.sectionTitle || (isExam ? '' : unit.title)) + '</span>' +
            (q.tag ? ui.tag(q.tag, tagTone(q.tag)) : '') +
            (q.type === 'choice' && session.checked[q.id] ? (session.selectedCorrect === q.id ? '' : '') : '') +
          '</div>' +
          '<button class="flag-btn' + (session.flagged[q.id] ? ' active' : '') + '" type="button" data-action="flag" title="标记本题">' + icon('flag') + '<span>' + (session.flagged[q.id] ? '已标记' : '标记') + '</span></button>' +
        '</div>' +
        body +
      '</article>' +
      nav +
    '</div>';
  }

  function renderPassage(text) {
    return String(text || '').split(/\n\n+/).map(function (p) {
      return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function listenKind(kind) {
    return ({ conversation: '对话', news: '新闻', lecture: '讲座', passage: '短文' })[kind] || '听力材料';
  }

  function tagTone(tag) {
    if (/主旨/.test(tag)) return 'accent';
    if (/推断|态度/.test(tag)) return 'blue';
    if (/词义/.test(tag)) return 'ochre';
    return '';
  }

  function renderTranscript(unit, checked) {
    if (!unit.transcript) return '';
    return '<details class="transcript" ' + (checked ? 'open' : '') + '>' +
      '<summary>' + icon('fileText') + ' 听力原文 <span class="small muted">' + (checked ? '已解锁' : '可展开') + '</span></summary>' +
      '<div class="transcript-text">' + renderPassage(unit.transcript) + '</div>' +
    '</details>';
  }

  function renderChoiceBody(row, checked) {
    var q = row.question;
    var selected = session.answers[q.id];
    var options = (q.options || []).map(function (opt, i) {
      var cls = 'option';
      var mark = '';
      if (typeof selected === 'number' && selected === i) cls += ' selected';
      if (checked) {
        if (i === q.answer) { cls += ' correct'; mark = '<span class="option-mark">' + icon('check') + '</span>'; }
        else if (selected === i) { cls += ' wrong'; mark = '<span class="option-mark">' + icon('x') + '</span>'; }
      }
      return '<button class="' + cls + '" type="button" data-action="option" data-index="' + i + '" ' + (checked ? 'disabled' : '') + '>' +
        '<span class="option-key">' + LETTERS[i] + '</span>' +
        '<span class="option-text en">' + esc(opt) + '</span>' + mark +
      '</button>';
    }).join('');

    var feedback = '';
    if (checked) {
      var correct = selected === q.answer;
      feedback = '<div class="explain-card ' + (correct ? 'good' : 'bad') + '">' +
        '<div class="explain-head"><span class="explain-ico">' + icon(correct ? 'checkCircle' : 'alertCircle') + '</span>' +
        '<div><b>' + (correct ? '回答正确' : '再看一眼') + '</b><small>正确答案：' + LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) + '</small></div></div>' +
        '<p>' + esc(q.explanation || '暂无解析') + '</p>' +
        '</div>';
    }

    return '<h2 class="q-stem en">' + esc(q.stem) + '</h2>' +
      '<div class="option-list">' + options + '</div>' + feedback;
  }

  function renderTaskContext(unit, q) {
    var kind = taskKind(q, unit);
    var isTranslation = kind === 'translation';
    return '<section class="task-context">' +
      '<div class="task-context-head"><span class="tag ' + (isTranslation ? 'ochre' : 'clay') + '">' + (isTranslation ? '翻译' : '写作') + '</span>' +
        '<span class="task-words">' + (q.minWords ? '建议不少于 ' + q.minWords + ' 词' : '') + '</span></div>' +
      '<h2>' + esc(unit.title) + '</h2>' +
      (unit.instructions ? '<p class="task-instructions">' + esc(unit.instructions) + '</p>' : '') +
      '<div class="task-prompt ' + (isTranslation ? 'cn' : 'en') + '">' + renderPassage(unit.prompt || '') + '</div>' +
      (unit.tags && unit.tags.length ? '<div class="task-tags">' + unit.tags.map(function (t) { return ui.tag(t, isTranslation ? 'ochre' : 'clay'); }).join(' ') + '</div>' : '') +
    '</section>';
  }

  function renderTaskBody(row, kind, checked, isExam) {
    var q = row.question;
    var text = session.answers[q.id] || '';
    var count = CET6.wordCount(text);
    var min = q.minWords || (kind === 'translation' ? 120 : 150);
    var rating = session.selfScores[q.id];
    var reference = q.reference || '';
    var keyPoints = q.keyPoints || [];

    var editor = '<div class="task-editor">' +
      '<div class="task-editor-head"><span>你的' + (kind === 'translation' ? '译文' : '作文') + '</span><span class="wc" data-word-count><b class="num ' + (count && count < min ? 'warn' : '') + '">' + count + '</b> / ' + min + ' 词</span></div>' +
      '<textarea class="task-textarea" data-task-input data-qid="' + q.id + '" ' + (checked ? 'readonly' : '') + ' placeholder="' + (kind === 'translation' ? '在这里写下你的英文译文…' : '在这里写下你的英文作文…') + '">' + esc(text) + '</textarea>' +
    '</div>';

    var feedback = '';
    if (checked && !isExam) {
      var rateHtml = '<div class="self-rate"><span class="self-rate-label">对照后自评：</span>' + [90, 75, 60, 40].map(function (v) {
        var label = v === 90 ? '优秀' : v === 75 ? '良好' : v === 60 ? '合格' : '待提高';
        return '<button class="rate-btn' + (rating === v ? ' active' : '') + '" type="button" data-action="rate" data-score="' + v + '">' + label + ' <small>' + v + '</small></button>';
      }).join('') + '</div>';
      feedback = '<div class="reference-card">' +
        '<div class="reference-head"><span class="reference-tag">' + icon('sparkles') + (kind === 'translation' ? ' 参考译文' : ' 参考范文') + '</span><span class="small muted">' + CET6.wordCount(reference) + ' 词</span></div>' +
        '<div class="reference-text en">' + renderPassage(reference) + '</div>' +
        (keyPoints.length ? '<div class="keypoints"><b>采分点</b><ul>' + keyPoints.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></div>' : '') +
        rateHtml +
      '</div>';
    }
    return '<h2 class="q-stem">' + esc(q.stem || (kind === 'translation' ? '请将上面的段落翻译成英文。' : '根据提示完成一篇短文。')) + '</h2>' +
      editor + feedback;
  }

  function renderNav(row, checked, isExam) {
    var task = isTaskQuestion(row.question, row.unit);
    var isLast = session.index === session.flat.length - 1;
    var has = hasAnswer(row);
    var primary = '';
    if (!isExam && !checked) {
      primary = '<button class="btn btn-primary btn-lg" type="button" data-action="check" ' + (has ? '' : 'disabled') + '>' +
        (task ? '提交并对照参考' : '确认答案') + ' ' + icon('check') + '</button>';
    } else if (isLast) {
      primary = '<button class="btn btn-primary btn-lg" type="button" data-action="submit">' + (isExam ? '交卷并查看报告' : '结束练习') + ' ' + icon('arrowRight') + '</button>';
    } else {
      primary = '<button class="btn btn-primary btn-lg" type="button" data-action="next">下一题 ' + icon('arrowRight') + '</button>';
    }
    return '<div class="q-nav">' +
      '<button class="btn btn-soft" type="button" data-action="prev" ' + (session.index === 0 ? 'disabled' : '') + '>' + icon('arrowLeft') + ' 上一题</button>' +
      '<div class="q-nav-right">' + primary + '</div>' +
    '</div>';
  }

  /* ----------------------------------------------------------
     Answer sheet
     ---------------------------------------------------------- */
  function sheetGroups() {
    if (session.mode === 'mock' || session.mode === 'set') {
      var groups = [];
      session.flat.forEach(function (row, idx) {
        var g = groups.find(function (x) { return x.id === row.sectionId; });
        if (!g) { g = { id: row.sectionId, title: row.sectionTitle, items: [] }; groups.push(g); }
        g.items.push({ row: row, idx: idx });
      });
      return groups;
    }
    return [{ id: 'all', title: session.mode === 'wrong' ? '错题' : '本组题目', items: session.flat.map(function (row, idx) { return { row: row, idx: idx }; }) }];
  }

  function renderSheet() {
    return sheetGroups().map(function (group) {
      var done = group.items.filter(function (x) { return hasAnswer(x.row); }).length;
      var buttons = group.items.map(function (x) {
        var qid = x.row.question.id;
        var cls = 'sheet-btn';
        if (hasAnswer(x.row)) cls += ' answered';
        if (x.idx === session.index) cls += ' current';
        if (session.flagged[qid]) cls += ' flagged';
        if (session.checked[qid] && !isTaskQuestion(x.row.question, x.row.unit)) {
          var sel = session.answers[qid];
          cls += sel === x.row.question.answer ? ' right' : ' wrong';
        }
        return '<button class="' + cls + '" type="button" data-action="goto" data-index="' + x.idx + '" aria-label="第 ' + (x.idx + 1) + ' 题">' + (x.idx + 1) + '</button>';
      }).join('');
      return '<div class="sheet-group"><div class="sheet-group-title"><span>' + esc(group.title) + '</span><em class="num">' + done + ' / ' + group.items.length + '</em></div>' +
        '<div class="sheet-grid">' + buttons + '</div></div>';
    }).join('');
  }

  function syncChrome() {
    var timerEl = document.getElementById('quizTimerValue');
    if (timerEl) updateTimer();
    var answeredEl = document.getElementById('quizAnsweredCount');
    if (answeredEl) answeredEl.textContent = answeredCount();
    var sheet = document.getElementById('quizSheet');
    if (sheet) sheet.innerHTML = renderSheet();
    var progress = document.getElementById('sheetProgress');
    if (progress) progress.textContent = answeredCount() + ' / ' + session.flat.length;
    var submitLabel = document.getElementById('quizSubmitLabel');
    if (submitLabel) submitLabel.textContent = (session.mode === 'mock' || session.mode === 'set') ? '交卷' : '结束练习';
    var checkBtn = document.querySelector('[data-action="check"]');
    if (checkBtn) checkBtn.disabled = !hasAnswer(current());
  }

  function renderAll() {
    var main = document.getElementById('quizQuestion');
    if (main) {
      main.innerHTML = renderQuestion();
      if (current().unit.module === 'listening') ui.mountAudio(main);
    }
    syncChrome();
  }

  /* ----------------------------------------------------------
     Timer
     ---------------------------------------------------------- */
  function elapsedSec() {
    return Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000));
  }

  function updateTimer() {
    if (!session) return;
    var el = document.getElementById('quizTimerValue');
    var label = document.getElementById('quizTimerLabel');
    var chip = document.getElementById('quizTimer');
    if (!el) return;
    if (session.timeLimit) {
      var remain = session.timeLimit - elapsedSec();
      el.textContent = CET6.fmtClock(Math.max(0, remain));
      if (label) label.textContent = '剩余';
      if (chip) {
        chip.classList.toggle('warn', remain <= 300 && remain > 60);
        chip.classList.toggle('danger', remain <= 60);
      }
      if (remain <= 0 && !session.finished) {
        finishSession(true);
      }
    } else {
      el.textContent = CET6.fmtClock(elapsedSec());
      if (label) label.textContent = '用时';
    }
  }

  function startTimer() {
    stopTimer();
    updateTimer();
    timerId = setInterval(updateTimer, 1000);
  }
  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  /* ----------------------------------------------------------
     Interactions
     ---------------------------------------------------------- */
  function goTo(index) {
    session.index = CET6.clamp(index, 0, session.flat.length - 1);
    renderAll();
    var view = document.getElementById('view');
    if (view) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chooseOption(index) {
    var row = current();
    if (session.checked[row.question.id]) return;
    session.answers[row.question.id] = index;
    var card = document.querySelector('.question-card');
    if (card) {
      card.querySelectorAll('.option').forEach(function (btn, i) {
        btn.classList.toggle('selected', i === index);
      });
    }
    syncChrome();
  }

  function checkCurrent() {
    var row = current();
    var q = row.question;
    var task = isTaskQuestion(q, row.unit);
    if (!hasAnswer(row)) { CET6.toast(task ? '先写下你的答案' : '先选择一个选项', 'info'); return; }
    if (task && !session.selfScores[q.id] && !(session.answers[q.id] || '').trim()) {
      CET6.toast('先写下你的答案', 'info'); return;
    }
    session.checked[q.id] = true;
    if (!task && session.mode === 'wrong' && session.answers[q.id] === q.answer) {
      store.markMastered(q.id, true);
    }
    renderAll();
  }

  function rateTask(score) {
    var q = current().question;
    session.selfScores[q.id] = score;
    session.checked[q.id] = true;
    renderAll();
  }

  function nextQuestion() {
    if (session.index >= session.flat.length - 1) { requestSubmit(); return; }
    session.index++;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleFlag() {
    var qid = current().question.id;
    session.flagged[qid] = !session.flagged[qid];
    renderAll();
  }

  function buildAttemptItems() {
    return session.flat.map(function (row) {
      var q = row.question;
      var unit = row.unit;
      var task = isTaskQuestion(q, unit);
      var raw = session.answers[q.id];
      var text = task ? String(raw || '') : '';
      var answered = task ? !!text.trim() : typeof raw === 'number';
      var scorePct = null;
      var correct = false;
      if (task) {
        if (session.selfScores[q.id] != null) scorePct = session.selfScores[q.id];
        correct = scorePct != null && scorePct >= 60;
      } else {
        correct = answered && raw === q.answer;
      }
      return {
        qid: q.id,
        unitId: unit.id,
        module: unit.module,
        tag: q.tag || (unit.tags || [])[0] || data.moduleName(unit.module),
        type: task ? (taskKind(q, unit)) : 'choice',
        points: row.points,
        answered: answered,
        correct: correct,
        userAnswer: task ? text : raw,
        scorePct: task ? scorePct : (answered ? (correct ? 100 : 0) : null),
        sectionId: row.sectionId || '',
        sectionTitle: row.sectionTitle || ''
      };
    });
  }

  function finishSession(auto) {
    if (!session || session.finished) return;
    session.finished = true;
    stopTimer();
    var items = buildAttemptItems();
    var isPaper = session.mode === 'mock' || session.mode === 'set';
    var attempt = store.buildAttempt({
      kind: session.kind,
      refId: session.refId,
      title: session.title,
      subtitle: session.subtitle,
      module: session.module,
      startedAt: session.startedAt,
      finishedAt: Date.now(),
      durationSec: elapsedSec(),
      items: items,
      totalPoints: isPaper && session.paper ? session.paper.totalPoints : null
    });
    store.recordAttempt(attempt);
    session.allowLeave = true;
    ui.stopAudio();
    if (auto) CET6.toast('时间到，已自动交卷', 'clock');
    else CET6.toast('已生成学习报告', 'checkCircle');
    location.hash = '#/result/' + attempt.id;
  }

  function requestSubmit() {
    if (!session || session.finished) return;
    var unanswered = session.flat.filter(function (row) { return !hasAnswer(row); }).length;
    var isExam = session.mode === 'mock' || session.mode === 'set';
    var msg = unanswered
      ? '还有 ' + unanswered + ' 题没有作答。未作答的题按 0 分计入总分，不会自动进入错题本。'
      : (isExam ? '确认交卷并查看本次报告吗？' : '确认结束本次练习并查看报告吗？');
    CET6.confirmDialog({
      title: isExam ? '准备交卷' : '结束练习',
      message: msg,
      confirmText: isExam ? '交卷' : '结束并查看',
      cancelText: '继续作答'
    }).then(function (ok) { if (ok) finishSession(false); });
  }

  function confirmExit() {
    if (session.finished) { location.hash = '#/practice'; return; }
    var answered = answeredCount();
    if (!answered) { session.allowLeave = true; location.hash = '#/practice'; return; }
    CET6.confirmDialog({
      title: '退出本次练习？',
      message: '当前进度不会保存。已作答 ' + answered + ' 题，退出后需要重新开始。',
      confirmText: '退出',
      cancelText: '继续作答',
      danger: true
    }).then(function (ok) {
      if (ok) { session.allowLeave = true; location.hash = '#/practice'; }
    });
  }

  function openMobileSheet() {
    var isExam = session.mode === 'mock' || session.mode === 'set';
    var html = '<div class="mobile-sheet">' + renderSheet() +
      '<div class="sheet-legend"><span><i class="lg-done"></i>已答</span><span><i class="lg-current"></i>当前</span><span><i class="lg-flag"></i>标记</span></div>' +
      '<button class="btn btn-primary btn-block" type="button" data-action="submit">' + icon('flag') + ' ' + (isExam ? '交卷' : '结束并查看报告') + '</button></div>';
    var modal = CET6.modalHtml('答题卡', html, '', { wide: false });
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="goto"]');
      if (btn) { CET6.closeModal(); goTo(Number(btn.getAttribute('data-index'))); return; }
      var sub = e.target.closest('[data-action="submit"]');
      if (sub) { CET6.closeModal(); requestSubmit(); }
    });
  }

  function onClick(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'option') chooseOption(Number(btn.getAttribute('data-index')));
    else if (action === 'check') checkCurrent();
    else if (action === 'next') nextQuestion();
    else if (action === 'prev') goTo(session.index - 1);
    else if (action === 'flag') toggleFlag();
    else if (action === 'goto') { goTo(Number(btn.getAttribute('data-index'))); }
    else if (action === 'submit') requestSubmit();
    else if (action === 'exit') confirmExit();
    else if (action === 'rate') rateTask(Number(btn.getAttribute('data-score')));
    else if (action === 'open-sheet') openMobileSheet();
    else if (action === 'toggle-passage') {
      var row = current();
      session.passageOpen[row.unit.id] = session.passageOpen[row.unit.id] === false;
      renderAll();
    }
  }

  function onInput(e) {
    var ta = e.target.closest('[data-task-input]');
    if (!ta) return;
    var qid = ta.getAttribute('data-qid');
    session.answers[qid] = ta.value;
    var count = CET6.wordCount(ta.value);
    var wrap = ta.closest('.task-editor');
    if (wrap) {
      var wc = wrap.querySelector('[data-word-count] b');
      if (wc) {
        wc.textContent = count;
        var min = current().question.minWords || (taskKind(current().question, current().unit) === 'translation' ? 120 : 150);
        wc.classList.toggle('warn', count > 0 && count < min);
      }
    }
    syncChrome();
  }

  function onKey(e) {
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var row = current();
    var checked = !!session.checked[row.question.id];
    if (/^[1-4]$/.test(e.key) && row.question.options) {
      e.preventDefault();
      chooseOption(Number(e.key) - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (checked || session.mode === 'mock' || session.mode === 'set') nextQuestion();
      else checkCurrent();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(session.index - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      nextQuestion();
    } else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleFlag();
    }
  }

  function onBeforeUnload(e) {
    if (session && !session.finished && answeredCount() > 0) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  }

  function bind() {
    root = document.querySelector('.quiz-page');
    if (!root) return;
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    document.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
  }

  /* ----------------------------------------------------------
     Page module
     ---------------------------------------------------------- */
  CET6.pages.quiz = {
    crumb: '答题',
    render: function (ctx) {
      session = buildSession(ctx);
      if (!session) {
        return '<div class="page">' + ui.emptyState({
          title: ctx.quizKind === 'wrong' ? '错题本已经清空' : '没有找到这套题目',
          text: ctx.quizKind === 'wrong' ? '目前没有待重练的错题，继续保持。' : '可能是题库数据还在加载，或链接已经失效。',
          action: '<a class="btn btn-soft" href="#/practice">返回刷题</a>'
        }) + '</div>';
      }
      return shell();
    },
    mount: function () {
      if (!session) return;
      document.body.classList.add('quiz-mode');
      bind();
      renderAll();
      startTimer();
      setTimeout(function () { window.scrollTo(0, 0); }, 0);
    },
    cleanup: function () {
      stopTimer();
      ui.stopAudio();
      if (root) {
        root.removeEventListener('click', onClick);
        root.removeEventListener('input', onInput);
      }
      root = null;
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.body.classList.remove('quiz-mode');
      session = null;
    }
  };

  /* ----------------------------------------------------------
     Result / review
     ---------------------------------------------------------- */
  function recalcAttempt(attempt) {
    var summary = store.summarizeItems(attempt.items);
    attempt.totalQuestions = summary.totalQuestions;
    attempt.answered = summary.answered;
    attempt.correct = summary.correct;
    attempt.pending = summary.pending;
    attempt.rated = summary.rated;
    attempt.accuracy = summary.accuracy;
    attempt.earned = Math.round(summary.earned * 100) / 100;
    attempt.scorePct = attempt.totalPoints ? Math.round((summary.earned / attempt.totalPoints) * 100) : summary.scorePct;
    attempt.sectionScores = summary.sectionScores;
    return attempt;
  }

  function resultScoreBlock(attempt) {
    var pct = attempt.scorePct;
    var color = CET6.scoreColor(pct);
    var label;
    var value;
    if (attempt.kind === 'mock' || attempt.kind === 'import') {
      value = Math.round(attempt.earned);
      label = '估分 / ' + Math.round(attempt.totalPoints || 710);
    } else if (attempt.kind === 'set') {
      value = Math.round(attempt.earned);
      label = '得分 / 100';
    } else {
      value = attempt.scorePct;
      label = '得分率 %';
    }
    return '<div class="result-hero">' +
      '<div class="result-ring">' + CET6.ringSVG(pct, 190, 13, color) +
        '<div class="result-ring-text"><b class="num">' + value + '</b><span>' + label + '</span><small>得分率 ' + pct + '%</small></div>' +
      '</div>' +
      '<div class="result-hero-copy">' +
        '<span class="eyebrow"><span class="dot"></span> ' + (attempt.kind === 'import' ? '导入真题报告' : attempt.kind === 'mock' ? '全真模拟报告' : attempt.kind === 'set' ? '套题训练报告' : attempt.kind === 'wrong' ? '错题重练报告' : '专项练习报告') + '</span>' +
        '<h1 class="h1">' + esc(attempt.title) + '</h1>' +
        '<p class="muted">' + CET6.fmtDateFull(attempt.finishedAt) + ' · 用时 ' + CET6.fmtDuration(attempt.durationSec) + '</p>' +
        '<div class="result-hero-tags">' +
          '<span class="chip">' + icon('check') + ' 答对 <b>' + attempt.correct + '</b></span>' +
          '<span class="chip">' + icon('target') + ' 正确率 <b>' + attempt.accuracy + '%</b></span>' +
          '<span class="chip">' + icon('clock') + ' 用时 <b>' + CET6.fmtDuration(attempt.durationSec) + '</b></span>' +
          (attempt.pending ? '<span class="tag ochre">待自评 ' + attempt.pending + ' 题</span>' : '') +
          (attempt.demo ? '<span class="tag">示例数据</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function resultStats(attempt) {
    var avg = attempt.totalQuestions ? Math.round(attempt.durationSec / Math.max(1, attempt.answered || 1)) : 0;
    return '<div class="result-stat-grid">' +
      '<div class="result-stat"><span>' + icon('checkCircle') + ' 正确题数</span><b class="num">' + attempt.correct + '<em>/' + attempt.rated + '</em></b></div>' +
      '<div class="result-stat"><span>' + icon('list') + ' 完成题数</span><b class="num">' + attempt.answered + '<em>/' + attempt.totalQuestions + '</em></b></div>' +
      '<div class="result-stat"><span>' + icon('clock') + ' 平均每题</span><b class="num">' + avg + '<em>秒</em></b></div>' +
      '<div class="result-stat"><span>' + icon('sparkles') + ' 待自评</span><b class="num">' + attempt.pending + '<em>题</em></b></div>' +
    '</div>';
  }

  function sectionScores(attempt) {
    if (!attempt.sectionScores || !attempt.sectionScores.length) return '';
    return '<div class="section-score-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 分项</span><h3 class="h3">各部分得分</h3></div></div>' +
      attempt.sectionScores.map(function (s) {
        return '<div class="section-score-row"><span class="ssr-name">' + esc(s.title) + '</span><span class="ssr-track"><i style="width:' + s.pct + '%"></i></span><span class="ssr-val num">' + Math.round(s.earned) + ' / ' + Math.round(s.points) + '</span></div>';
      }).join('') +
    '</div>';
  }

  function selfAssessCards(attempt) {
    if (attempt.demo) return '';
    var tasks = (attempt.items || []).filter(function (it) {
      return (it.type === 'writing' || it.type === 'translation') && it.answered;
    });
    if (!tasks.length) return '';
    // pending first
    tasks.sort(function (a, b) { return (a.scorePct == null ? 0 : 1) - (b.scorePct == null ? 0 : 1); });
    var cards = tasks.map(function (it) {
      var q = data.getQuestion(it.qid);
      var unit = data.getUnit(it.unitId);
      if (!q || !unit) return '';
      var kind = it.type === 'translation' ? '翻译' : '写作';
      var ref = q.reference || '';
      var userText = typeof it.userAnswer === 'string' ? it.userAnswer : '';
      var rated = it.scorePct != null;
      return '<div class="assess-card card" data-assess="' + it.qid + '">' +
        '<div class="assess-head"><div><span class="tag ' + (it.type === 'translation' ? 'ochre' : 'clay') + '">' + kind + '自评</span>' +
          '<h3>' + esc(unit.title) + '</h3></div>' + (rated ? '<span class="tag accent">' + icon('check') + ' 已自评 ' + it.scorePct + '</span>' : '<span class="tag ochre">待自评</span>') + '</div>' +
        '<div class="assess-body">' +
          '<div class="assess-col"><b>' + (kind === '翻译' ? '你的译文' : '你的作文') + '</b><div class="assess-text en">' + (userText ? renderPassage(userText) : '<span class="muted">没有作答</span>') + '</div></div>' +
          '<div class="assess-col"><b>' + (kind === '翻译' ? '参考译文' : '参考范文') + '</b><div class="assess-text en reference">' + renderPassage(ref) + '</div></div>' +
        '</div>' +
        (q.keyPoints && q.keyPoints.length ? '<div class="keypoints"><b>采分点</b><ul>' + q.keyPoints.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div class="self-rate"><span class="self-rate-label">对照后自评：</span>' + [90, 75, 60, 40].map(function (v) {
          var label = v === 90 ? '优秀' : v === 75 ? '良好' : v === 60 ? '合格' : '待提高';
          return '<button class="rate-btn' + (it.scorePct === v ? ' active' : '') + '" type="button" data-action="rate-attempt" data-qid="' + it.qid + '" data-score="' + v + '">' + label + ' <small>' + v + '</small></button>';
        }).join('') + '</div>' +
      '</div>';
    }).join('');
    return '<section class="section"><div class="section-head"><div><span class="eyebrow"><span class="dot"></span> 主观题</span><h2>对照参考，给自己一个分数</h2><p>自评会同步更新总分、分数曲线与题型数据。</p></div></div><div class="assess-list">' + cards + '</div></section>';
  }

  function attemptDetail(attempt) {
    var items = attempt.items || [];
    if (!items.length) return '';
    var rows = items.map(function (it, idx) {
      var q = data.getQuestion(it.qid);
      var unit = data.getUnit(it.unitId);
      if (!q || !unit) return '';
      var task = it.type === 'writing' || it.type === 'translation';
      var status = '';
      var tone = '';
      if (task) {
        if (!it.answered) { status = '未作答'; tone = 'outline'; }
        else if (it.scorePct == null) { status = '待自评'; tone = 'ochre'; }
        else { status = '自评 ' + it.scorePct; tone = it.scorePct >= 60 ? 'accent' : 'rose'; }
      } else if (!it.answered) { status = '未作答'; tone = 'outline'; }
      else if (it.correct) { status = '正确'; tone = 'accent'; }
      else { status = '错误'; tone = 'rose'; }
      return '<div class="detail-row">' +
        '<span class="detail-index num">' + CET6.pad(idx + 1) + '</span>' +
        '<span class="detail-main"><span class="detail-tags"><b>' + esc(data.moduleName(it.module)) + '</b>' + (q.tag ? '<span>' + esc(q.tag) + '</span>' : '') + '</span>' +
          '<span class="detail-stem' + (task ? '' : ' en') + '">' + esc(task ? unit.title : (q.stem || unit.title)) + '</span></span>' +
        '<span class="tag ' + tone + '">' + status + '</span>' +
      '</div>';
    }).join('');
    return '<section class="section attempt-detail-section">' +
      '<details class="attempt-details">' +
        '<summary><div><span class="eyebrow"><span class="dot"></span> 作答明细</span><h2>本次做了哪些题</h2></div>' +
          '<span class="attempt-detail-count">' + items.length + ' 题 ' + icon('chevronDown') + '</span></summary>' +
        '<div class="attempt-detail-list">' + rows + '</div>' +
      '</details>' +
    '</section>';
  }

  function wrongReview(attempt) {
    var wrongItems = (attempt.items || []).filter(function (it) {
      if (it.correct || !it.answered) return false;
      if ((it.type === 'writing' || it.type === 'translation') && it.scorePct == null) return false;
      return true;
    });
    if (!wrongItems.length) {
      var perfect = attempt.answered > 0 && attempt.rated === attempt.totalQuestions && attempt.accuracy === 100 && attempt.scorePct >= 90;
      var title = perfect ? '这一组没有错题' : attempt.answered === 0 ? '本次没有作答记录' : '这次没有需要复盘的错题';
      var text = perfect
        ? '很干净的答卷。可以继续下一组，或者去数据页看看曲线。'
        : attempt.answered === 0
          ? '未作答的题按 0 分计入总分，但不会自动进入错题本。下次可以先做几题再交卷。'
          : attempt.pending > 0
            ? '主观题还有待自评的内容，可以在上方对照参考评分。'
            : '没有发现明显错题。可以继续下一组，或者去数据页看看曲线。';
      return '<section class="section"><div class="result-perfect">' + icon(perfect ? 'award' : 'info') + '<div><b>' + title + '</b><p>' + text + '</p></div><span class="result-perfect-mark">' + attempt.accuracy + '%</span></div></section>';
    }
    var cards = wrongItems.map(function (it) {
      var q = data.getQuestion(it.qid);
      var unit = data.getUnit(it.unitId);
      if (!q || !unit) return '';
      var task = it.type === 'writing' || it.type === 'translation';
      var your = task ? (typeof it.userAnswer === 'string' ? it.userAnswer : '') : optionText(q, typeof it.userAnswer === 'number' ? it.userAnswer : -1);
      var right = task ? (it.scorePct != null ? '自评 ' + it.scorePct + ' 分' : '待自评') : optionText(q, q.answer);
      return '<details class="wrong-review" data-wrong="' + it.qid + '">' +
        '<summary><span class="wrong-status">' + icon('x') + '</span><div class="wrong-summary"><span class="wrong-tag">' + esc(data.moduleName(it.module)) + (q.tag ? ' · ' + esc(q.tag) : '') + '</span><span class="wrong-stem en">' + esc(q.stem || unit.title) + '</span></div><span class="wrong-expand">' + icon('chevronDown') + '</span></summary>' +
        '<div class="wrong-detail">' +
          '<div class="wrong-answers"><div><span>你的答案</span><b class="en wrong">' + esc(your) + '</b></div><div><span>正确答案</span><b class="en right">' + esc(right) + '</b></div></div>' +
          (q.explanation ? '<p class="wrong-explain">' + esc(q.explanation) + '</p>' : '') +
          (unit.module === 'listening' && unit.transcript ? '<details class="transcript"><summary>听力原文</summary><div class="transcript-text">' + renderPassage(unit.transcript) + '</div></details>' : '') +
          (task && q.reference ? '<details class="transcript"><summary>参考译文 / 范文</summary><div class="transcript-text en">' + renderPassage(q.reference) + '</div></details>' : '') +
        '</div>' +
      '</details>';
    }).join('');
    return '<section class="section"><div class="section-head"><div><span class="eyebrow"><span class="dot"></span> 错题复盘</span><h2>做错的 ' + wrongItems.length + ' 题</h2><p>逐个展开，看看是定位问题，还是理解问题。</p></div><a class="link-arrow" href="#/stats/wrong">进入错题本 ' + icon('arrowRight') + '</a></div><div class="wrong-review-list">' + cards + '</div></section>';
  }

  function optionText(q, idx) {
    if (!q || idx == null || idx < 0) return '未作答';
    var t = q.options && q.options[idx] != null ? String(q.options[idx]) : '';
    if (!t || t === LETTERS[idx]) return LETTERS[idx];
    return LETTERS[idx] + '. ' + t;
  }

  function fullReview(attempt) {
    if (attempt.kind !== 'import' || !attempt.items || !attempt.items.length) return '';
    var objective = attempt.items.filter(function (it) {
      return it.type !== 'writing' && it.type !== 'translation';
    });
    if (!objective.length) return '';
    var cards = objective.map(function (it, idx) {
      var q = data.getQuestion(it.qid);
      var unit = data.getUnit(it.unitId);
      if (!q || !unit) return '';
      var right = optionText(q, q.answer);
      var your = optionText(q, typeof it.userAnswer === 'number' ? it.userAnswer : -1);
      var tone = it.answered ? (it.correct ? 'accent' : 'rose') : 'outline';
      var mark = it.answered ? (it.correct ? '正确' : '错误') : '未作答';
      return '<details class="wrong-review full-review-card" data-review="' + it.qid + '">' +
        '<summary><span class="wrong-index num">' + CET6.pad(idx + 1) + '</span><span class="wrong-status ' + tone + '">' + icon(it.correct ? 'check' : (it.answered ? 'x' : 'minus')) + '</span>' +
          '<div class="wrong-summary"><span class="wrong-tag">' + esc(data.moduleName(it.module)) + (q.tag ? ' · ' + esc(q.tag) : '') + ' · ' + mark + '</span>' +
          '<span class="wrong-stem en">' + esc(q.stem || unit.title) + '</span></div>' +
          '<span class="wrong-expand">' + icon('chevronDown') + '</span></summary>' +
        '<div class="wrong-detail">' +
          '<div class="wrong-answers"><div><span>你的答案</span><b class="en ' + (it.correct ? 'right' : 'wrong') + '">' + esc(your) + '</b></div><div><span>正确答案</span><b class="en right">' + esc(right) + '</b></div></div>' +
          (q.explanation ? '<p class="wrong-explain">' + esc(q.explanation) + '</p>' : '') +
        '</div>' +
      '</details>';
    }).join('');

    var seen = {};
    var units = [];
    attempt.items.forEach(function (it) {
      var unit = data.getUnit(it.unitId);
      if (!unit || unit.module !== 'listening' || !unit.transcript || seen[unit.id]) return;
      seen[unit.id] = true;
      units.push(unit);
    });
    var transcriptHtml = units.length ? '<details class="attempt-details full-transcripts"><summary><div><span class="eyebrow"><span class="dot"></span> 听力原文</span><h2>' + units.length + ' 篇听力材料</h2></div><span class="attempt-detail-count">展开 ' + icon('chevronDown') + '</span></summary><div class="full-transcript-list">' + units.map(function (unit) {
      return '<details class="transcript full-transcript"><summary>' + esc(unit.title) + '</summary><div class="transcript-text">' + renderPassage(unit.transcript) + '</div></details>';
    }).join('') + '</div></details>' : '';

    return '<section class="section full-review-section">' +
      '<div class="section-head"><div><span class="eyebrow"><span class="dot"></span> 全卷解析</span><h2>' + objective.length + ' 道客观题逐题对照</h2><p>不管对错，都可以展开查看正确答案与解析。</p></div></div>' +
      '<details class="attempt-details full-review-wrap"><summary><div><span class="eyebrow"><span class="dot"></span> 答案与解析</span><h2>展开全部 ' + objective.length + ' 题</h2></div><span class="attempt-detail-count">' + objective.length + ' 题 ' + icon('chevronDown') + '</span></summary><div class="wrong-review-list full-review-list">' + cards + '</div></details>' +
      transcriptHtml +
    '</section>';
  }

  function resultActions(attempt) {
    var retryHref = attempt.kind === 'mock' || attempt.kind === 'set' || attempt.kind === 'import'
      ? '#/quiz/paper/' + attempt.refId
      : attempt.kind === 'wrong' ? '#/quiz/wrong'
      : attempt.refId && attempt.refId.indexOf('drill-') === 0 ? '#/quiz/drill/' + attempt.refId.replace('drill-', '')
      : attempt.refId && attempt.refId.indexOf('unit-') === 0 ? '#/quiz/unit/' + attempt.refId.replace('unit-', '')
      : '#/practice';
    return '<div class="result-actions">' +
      '<a class="btn btn-primary" href="' + retryHref + '">' + icon('refresh') + ' 再练一次</a>' +
      '<a class="btn btn-soft" href="#/stats/wrong">' + icon('bookmark') + ' 查看错题本</a>' +
      '<a class="btn btn-ghost" href="#/stats">' + icon('chart') + ' 返回数据主页</a>' +
      '<a class="btn btn-ghost" href="#/practice">' + icon('layers') + ' 继续刷题</a>' +
    '</div>';
  }

  function bindResult(attempt) {
    var page = document.querySelector('.result-page');
    if (!page) return;
    page.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="rate-attempt"]');
      if (!btn) return;
      var qid = btn.getAttribute('data-qid');
      var score = Number(btn.getAttribute('data-score'));
      var item = attempt.items.find(function (it) { return it.qid === qid; });
      if (!item) return;
      item.scorePct = score;
      item.correct = score >= 60;
      item.answered = true;
      recalcAttempt(attempt);
      store.updateAttempt(attempt.id, attempt);
      CET6.toast('自评已更新，分数已重新计算');
      CET6.rerender();
    });
  }

  CET6.pages.result = {
    crumb: '学习报告',
    render: function (ctx) {
      var attempt = store.getAttempt(ctx.param);
      if (!attempt) {
        return '<div class="page">' + ui.emptyState({ title: '报告不存在', text: '这条记录可能已经被清除。', action: '<a class="btn btn-soft" href="#/stats/history">返回练习记录</a>' }) + '</div>';
      }
      var pending = attempt.pending > 0;
      return '<div class="page result-page">' +
        ui.demoBanner() +
        '<div class="result-topline"><a class="back-link" href="#/stats/history">' + icon('arrowLeft') + ' 练习记录</a>' +
          '<span class="result-date">' + CET6.fmtDate(attempt.finishedAt, true) + '</span></div>' +
        resultScoreBlock(attempt) +
        resultStats(attempt) +
        (pending ? '<div class="result-pending">' + icon('pen') + '<div><b>还有 ' + attempt.pending + ' 道主观题待自评</b><p>在下方对照参考给自己评分后，估分和趋势图会自动更新。</p></div></div>' : '') +
        '<div class="result-grid">' +
          sectionScores(attempt) +
          '<div class="result-tip-card card">' +
            '<span class="eyebrow"><span class="dot"></span> 下一步</span>' +
            '<h3>' + nextStepTitle(attempt) + '</h3>' +
            '<p>' + nextStepText(attempt) + '</p>' +
            resultActions(attempt) +
          '</div>' +
        '</div>' +
        selfAssessCards(attempt) +
        wrongReview(attempt) +
        fullReview(attempt) +
        attemptDetail(attempt) +
      '</div>';
    },
    mount: function (ctx) {
      var attempt = store.getAttempt(ctx.param);
      if (attempt) bindResult(attempt);
    },
    cleanup: function () {}
  };

  function nextStepTitle(attempt) {
    if (attempt.accuracy >= 80) return '状态很好，保持这个节奏';
    if (attempt.accuracy >= 60) return '基础稳住了，再补短板';
    return '先别急着刷下一套';
  }
  function nextStepText(attempt) {
    if (attempt.accuracy >= 80) return '可以尝试更高难度的套题，或者把错题再过一遍，确保不是蒙对的。';
    if (attempt.accuracy >= 60) return '去数据主页看看题型强弱，把正确率最低的那一类专项再练一组。';
    return '把这次错题逐个展开，对照解析弄懂；再回专项练习，从最小的那一组重新开始。';
  }
})();

