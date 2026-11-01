/* ============================================================
   LAGOM CET-6 · pages/home.js
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  CET6.pages = CET6.pages || {};
  CET6.pages.home = {
    crumb: '首页 · 学习空间',

    render: function () {
      var summary = store.getSummary();
      var ws = store.getWordStats();
      var countdown = store.getExamCountdown();
      var attempts = store.getAttempts();
      var todayAttempts = attempts.filter(function (a) { return CET6.dateKey(a.finishedAt) === CET6.todayKey(); });
      var wrong = store.getWrongQuestions();
      var recent = store.getRecentAttempts(3);
      var words = CET6.data.words;
      var dayOfYear = Math.floor((CET6.startOfDay(new Date()) - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      var wotd = words.length ? words[dayOfYear % words.length] : null;
      var todayDone = todayAttempts.length > 0;
      var wordDone = ws.todayTotal >= ws.goal;
      var wrongDone = todayAttempts.some(function (a) { return a.kind === 'wrong'; });
      var planDone = [todayDone, wordDone, wrongDone].filter(Boolean).length;
      var nextWord = words.find(function (w) { var p = store.getWordProgress(w.id); return !p || !p.seen; }) || wotd;
      var targetScore = store.state.settings.targetScore || 550;

      var heroAction = summary.attemptCount
        ? '<a class="btn btn-primary btn-lg" href="#/practice">' + icon('play') + ' 继续刷题</a>'
        : '<a class="btn btn-primary btn-lg" href="#/practice">' + icon('play') + ' 开始第一套</a>';

      return '<div class="page home-page">' +
        ui.demoBanner() +
        '<section class="home-hero">' +
          '<div class="hero-copy">' +
            '<span class="eyebrow"><span class="dot"></span> 2026 · CET-6 备考空间</span>' +
            '<h1 class="display">把六级，<br>过成一件<span class="hero-mark">刚刚好</span>的事。</h1>' +
            '<p class="hero-lead">不追赶，也不松懈。每天一段听力、一篇阅读、一组单词，<br class="desktop-only">按自己的节奏，把分数一点点攒起来。</p>' +
            '<div class="hero-actions">' + heroAction +
              '<a class="btn btn-soft btn-lg" href="#/words">' + icon('bookOpen') + ' 背今日单词</a>' +
            '</div>' +
            '<div class="hero-meta">' +
              '<span class="hero-meta-item">' + icon('calendar') + ' 距考试 <b class="num">' + countdown.days + '</b> 天</span>' +
              '<span class="hero-meta-item">' + icon('flame') + ' 连续 <b class="num">' + summary.streak + '</b> 天</span>' +
              '<span class="hero-meta-item">' + icon('target') + ' 目标 <b class="num">' + targetScore + '</b> 分</span>' +
            '</div>' +
          '</div>' +
          '<div class="hero-visual" aria-hidden="true">' +
            '<div class="hero-sun"></div>' +
            '<div class="hero-orbit orbit-one"></div>' +
            '<div class="hero-orbit orbit-two"></div>' +
            '<div class="hero-focus">' +
              CET6.ringSVG(ws.goalPct, 178, 12, 'var(--accent)') +
              '<div class="hero-focus-text"><span>今日背词</span><b class="num">' + ws.todayTotal + '<em>/' + ws.goal + '</em></b><small>' + ws.goalPct + '% · 刚刚好</small></div>' +
            '</div>' +
            '<div class="hero-float float-word">' +
              '<span class="float-label">今日一词</span>' +
              '<strong class="en">' + esc(wotd ? wotd.word : 'lagom') + '</strong>' +
              '<span class="float-sub">' + esc(wotd ? wotd.meaning : '刚刚好') + '</span>' +
            '</div>' +
            '<div class="hero-float float-score">' +
              '<span class="float-label">最近正确率</span>' +
              '<strong class="num">' + summary.objectiveAccuracy + '<em>%</em></strong>' +
              '<span class="float-trend">' + icon(summary.objectiveAccuracy >= 65 ? 'trendingUp' : 'target') + ' ' + summary.completedQuestions + ' 题已完成</span>' +
            '</div>' +
            '<div class="hero-float float-tag">' + icon('sparkles') + ' 按自己的节奏</div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<div class="section-head">' +
            '<div><span class="eyebrow"><span class="dot"></span> 三个板块</span><h2>今天，从哪里开始？</h2></div>' +
            '<div class="head-side"><span class="small muted">所有记录只保存在这台设备</span></div>' +
          '</div>' +
          '<div class="board-grid">' +
            '<a class="board-card board-practice" href="#/practice">' +
              '<div class="board-top">' + ui.iconBadge('layers', 'pine') + '<span class="board-arrow">' + icon('arrowUpRight') + '</span></div>' +
              '<h3>刷题</h3>' +
              '<p>全真模拟、套题训练与四类专项。听力音频就在题里，随时回放。</p>' +
              '<div class="board-meta"><span><b class="num">' + CET6.data.papers.length + '</b> 套卷</span><span><b class="num">' + CET6.data.units.length + '</b> 个单元</span><span class="board-link">进入练习 ' + icon('arrowRight') + '</span></div>' +
            '</a>' +
            '<a class="board-card board-words" href="#/words">' +
              '<div class="board-top">' + ui.iconBadge('bookOpen', 'ochre') + '<span class="board-arrow">' + icon('arrowUpRight') + '</span></div>' +
              '<h3>背单词</h3>' +
              '<p>翻卡记忆，标出生词与错词。每次认识或不认识，都会被认真记下来。</p>' +
              '<div class="board-progress"><div class="spread small"><span>已学 ' + ws.learned + ' / ' + ws.total + '</span><span class="num">' + (ws.total ? Math.round((ws.learned / ws.total) * 100) : 0) + '%</span></div><div class="progress ochre"><i style="width:' + (ws.total ? (ws.learned / ws.total) * 100 : 0) + '%"></i></div></div>' +
              '<div class="board-meta"><span>已掌握 <b>' + ws.known + '</b></span><span>错词 <b>' + ws.wrong + '</b></span><span class="board-link">去背词 ' + icon('arrowRight') + '</span></div>' +
            '</a>' +
            '<a class="board-card board-data" href="#/stats">' +
              '<div class="board-top">' + ui.iconBadge('chart', 'blue') + '<span class="board-arrow">' + icon('arrowUpRight') + '</span></div>' +
              '<h3>我的数据</h3>' +
              '<p>分数曲线、题型强弱、错题本与练习记录，看见自己正在变好的证据。</p>' +
              '<div class="board-meta"><span>正确率 <b>' + summary.objectiveAccuracy + '%</b></span><span>错题 <b>' + wrong.length + '</b></span><span class="board-link">查看数据 ' + icon('arrowRight') + '</span></div>' +
            '</a>' +
          '</div>' +
        '</section>' +

        '<section class="section home-split">' +
          '<div class="home-plan card">' +
            '<div class="card-head">' +
              '<div><span class="eyebrow"><span class="dot"></span> 今日计划</span><h3 class="h3">三件小事</h3></div>' +
              '<span class="plan-count"><b class="num">' + planDone + '</b> / 3</span>' +
            '</div>' +
            '<div class="plan-list">' +
              planItem(todayDone, '完成一组练习', todayAttempts.length ? '今天已完成 ' + todayAttempts.length + ' 次作答' : '任选一套模拟或一组专项', '#/practice', '开始') +
              planItem(wordDone, '背 ' + ws.goal + ' 个单词', ws.todayTotal ? '今天已学 ' + ws.todayTotal + ' 个' : '新词与复习词都算', '#/words', '去背词') +
              planItem(wrongDone, '复盘错题', wrong.length ? '错题本里有 ' + wrong.length + ' 道待掌握' : '做错的题会自动收进来', '#/stats/wrong', '去复盘') +
            '</div>' +
            '<div class="plan-tip">' + icon('lightbulb') + '<span>不必一次做完。今天只完成一件，也是在往前走。</span></div>' +
          '</div>' +

          '<div class="home-recent card">' +
            '<div class="card-head">' +
              '<div><span class="eyebrow"><span class="dot"></span> 最近</span><h3 class="h3">练习记录</h3></div>' +
              '<a class="link-arrow" href="#/stats/history">全部 ' + icon('arrowRight') + '</a>' +
            '</div>' +
            (recent.length
              ? '<div class="attempt-list">' + recent.map(function (a) { return ui.attemptRow(a); }).join('') + '</div>'
              : ui.emptyState({ title: '还没有练习记录', text: '从一套全真模拟开始，记录会出现在这里。', action: '<a class="btn btn-sm btn-soft" href="#/practice">去看看题库</a>' })) +
          '</div>' +
        '</section>' +

        '<section class="section home-bottom">' +
          '<div class="word-of-day">' +
            '<div class="wod-copy">' +
              '<span class="eyebrow light"><span class="dot"></span> 每日一词</span>' +
              '<div class="wod-word-row"><h2 class="en">' + esc(wotd ? wotd.word : 'lagom') + '</h2>' + (wotd ? ui.speakBtn(wotd.word) : '') + '</div>' +
              '<span class="wod-phonetic">' + esc(wotd ? wotd.phonetic + ' · ' + wotd.pos : '/ˈlɑːɡɔːm/ · n.') + '</span>' +
              '<p class="wod-meaning">' + esc(wotd ? wotd.meaning : '刚刚好；不多不少') + '</p>' +
              (wotd ? '<p class="wod-example en">“' + esc(wotd.example) + '”</p>' : '') +
              '<div class="wod-actions"><a class="btn btn-sm btn-soft" href="#/words">' + icon('bookOpen') + ' 开始背词</a>' +
              (nextWord && nextWord.id !== (wotd && wotd.id) ? '<a class="btn btn-sm btn-ghost" href="#/words">下一个：' + esc(nextWord.word) + ' ' + icon('arrowRight') + '</a>' : '') + '</div>' +
            '</div>' +
            '<div class="wod-art" aria-hidden="true">' +
              '<svg viewBox="0 0 300 240" fill="none">' +
                '<circle cx="210" cy="88" r="62" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>' +
                '<circle cx="210" cy="88" r="40" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>' +
                '<path d="M22 196c46-52 90-76 134-66 39 9 70 38 122 74" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round"/>' +
                '<path d="M22 216c52-38 94-54 132-46 37 8 68 28 122 56" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-linecap="round"/>' +
                '<text x="210" y="96" text-anchor="middle" fill="rgba(255,255,255,.9)" font-family="Schibsted Grotesk, sans-serif" font-size="22" font-weight="600">lagom</text>' +
                '<text x="210" y="116" text-anchor="middle" fill="rgba(255,255,255,.5)" font-family="Schibsted Grotesk, sans-serif" font-size="10" letter-spacing="2">JUST RIGHT</text>' +
              '</svg>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>';
    },

    mount: function () {
      ui.bindSpeak(document.getElementById('view'));
    }
  };

  function planItem(done, title, desc, href, action) {
    return '<a class="plan-item' + (done ? ' done' : '') + '" href="' + href + '">' +
      '<span class="plan-check">' + (done ? icon('check') : '') + '</span>' +
      '<span class="plan-text"><b>' + title + '</b><small>' + desc + '</small></span>' +
      '<span class="plan-action">' + (done ? '已完成' : action) + ' ' + icon('chevronRight') + '</span>' +
      '</a>';
  }
})();
