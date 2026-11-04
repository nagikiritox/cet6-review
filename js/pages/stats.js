/* ============================================================
   LAGOM CET-6 · pages/stats.js
   Personal dashboard, wrong-question book, practice history.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var data = CET6.data;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var trendFilter = 'all';
  var wrongFilter = { module: 'all', includeMastered: false };
  var LETTERS = 'ABCDEFGHIJKLMNO'.split('');

  function statsTabs(active) {
    return '<div class="segmented stats-tabs">' +
      '<a href="#/stats" class="' + (active === 'overview' ? 'active' : '') + '">' + icon('chart') + ' 总览</a>' +
      '<a href="#/stats/wrong" class="' + (active === 'wrong' ? 'active' : '') + '">' + icon('bookmark') + ' 错题本</a>' +
      '<a href="#/stats/history" class="' + (active === 'history' ? 'active' : '') + '">' + icon('list') + ' 练习记录</a>' +
    '</div>';
  }

  /* ----------------------------------------------------------
     Overview
     ---------------------------------------------------------- */
  function trendSection(trends) {
    return '<div class="trend-card card">' +
      '<div class="card-head">' +
        '<div><span class="eyebrow"><span class="dot"></span> 分数变化</span><h3 class="h3">一点一点，往上走</h3></div>' +
        '<div class="segmented trend-filter">' +
          '<button type="button" data-trend="all" class="' + (trendFilter === 'all' ? 'active' : '') + '">全部</button>' +
          '<button type="button" data-trend="mock" class="' + (trendFilter === 'mock' ? 'active' : '') + '">全真模拟</button>' +
          '<button type="button" data-trend="set" class="' + (trendFilter === 'set' ? 'active' : '') + '">套题</button>' +
          '<button type="button" data-trend="import" class="' + (trendFilter === 'import' ? 'active' : '') + '">导入</button>' +
        '</div>' +
      '</div>' +
      '<div id="trendChart">' + ui.lineChart(filterTrend(trends)) + '</div>' +
    '</div>';
  }

  function filterTrend(trends) {
    if (trendFilter === 'all') return trends;
    return trends.filter(function (t) { return t.kind === trendFilter; });
  }

  function trendView(trends) {
    if (!trends.length) return '';
    var first = trends[0], last = trends[trends.length - 1];
    var diff = last.scorePct - first.scorePct;
    return '<div class="trend-summary"><div><span>最近一次</span><b class="num">' + last.scorePct + '%</b></div><div><span>较首次</span><b class="num ' + (diff >= 0 ? 'up' : 'down') + '">' + (diff >= 0 ? '+' : '') + diff + '%</b></div><div><span>最佳</span><b class="num">' + Math.max.apply(null, trends.map(function (t) { return t.scorePct; })) + '%</b></div></div>';
  }

  function moduleSection(mods) {
    var allValid = Object.keys(mods).filter(function (m) { return mods[m].total > 0; });
    var valid = allValid.filter(function (m) { return mods[m].total >= 3; });
    var pool = valid.length ? valid : allValid;
    var strongest = null, weakest = null;
    pool.forEach(function (m) {
      if (!strongest || mods[m].accuracy > mods[strongest].accuracy) strongest = m;
      if (!weakest || mods[m].accuracy < mods[weakest].accuracy) weakest = m;
    });
    var advice = weakest
      ? '建议把下一组练习留给「' + data.moduleName(weakest) + '」，先从正确率最低的题型开始。' + (valid.length ? '' : '（当前样本较少，先多练几组再判断。）')
      : '完成几组练习后，这里会给出强弱项与下一步建议。';
    return '<div class="module-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 题型强弱</span><h3 class="h3">四块能力，各自走到哪了</h3></div></div>' +
      ui.moduleBars(mods) +
      '<div class="strength-row">' +
        (strongest ? '<div class="strength-pill good">' + icon('trendingUp') + '<span><small>强项</small><b>' + data.moduleName(strongest) + ' ' + mods[strongest].accuracy + '%</b></span></div>' : '') +
        (weakest ? '<div class="strength-pill weak">' + icon('target') + '<span><small>待补</small><b>' + data.moduleName(weakest) + ' ' + mods[weakest].accuracy + '%</b></span></div>' : '') +
      '</div>' +
      '<p class="module-advice">' + icon('lightbulb') + ' ' + advice + '</p>' +
    '</div>';
  }

  function radarSection(tags) {
    return '<div class="radar-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 题型雷达</span><h3 class="h3">强项与短板</h3></div></div>' +
      ui.radarChart(tags) +
      '<div class="radar-legend">' + tags.slice(0, 5).map(function (t) {
        return '<span><i></i>' + esc(t.tag) + ' <b>' + t.accuracy + '%</b></span>';
      }).join('') + '</div>' +
    '</div>';
  }

  function wrongDonutSection(wrong) {
    var counts = { listening: 0, reading: 0, translation: 0, writing: 0 };
    wrong.forEach(function (w) { counts[w.module] = (counts[w.module] || 0) + 1; });
    var colors = { listening: 'var(--blue)', reading: 'var(--accent)', translation: 'var(--ochre)', writing: 'var(--clay)' };
    var items = data.modules.map(function (m) {
      return { label: data.moduleName(m), value: counts[m] || 0, color: colors[m] };
    }).filter(function (i) { return i.value > 0; });
    return '<div class="wrong-donut-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 错题分布</span><h3 class="h3">错在哪里</h3></div><a class="link-arrow" href="#/stats/wrong">错题本 ' + icon('arrowRight') + '</a></div>' +
      ui.donut(items, '道待掌握') +
    '</div>';
  }

  function activitySection() {
    return '<div class="activity-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 学习节奏</span><h3 class="h3">过去 12 周</h3></div><span class="tag">' + store.getStudyDays() + ' 个学习日</span></div>' +
      ui.heatmap(store.getActivity(84)) +
      '<p class="activity-note">' + icon('leaf') + ' 每个小格代表一天。空着的日子不算失败，第二天回来就好。</p>' +
    '</div>';
  }

  function recentSection() {
    var recent = store.getRecentAttempts(5);
    return '<div class="recent-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 最近练习</span><h3 class="h3">你做过的事</h3></div><a class="link-arrow" href="#/stats/history">全部记录 ' + icon('arrowRight') + '</a></div>' +
      (recent.length ? '<div class="attempt-list">' + recent.map(function (a) { return ui.attemptRow(a); }).join('') + '</div>' : ui.emptyState({ title: '还没有练习记录', text: '完成第一套练习后，这里会记录你的每一次作答。', action: '<a class="btn btn-sm btn-soft" href="#/practice">去刷题</a>' })) +
    '</div>';
  }

  function wrongPreviewSection(wrong) {
    var list = wrong.slice(0, 3);
    return '<div class="wrong-preview-card card">' +
      '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 错题提醒</span><h3 class="h3">这些题还在等你</h3></div><span class="tag">' + wrong.length + ' 道</span></div>' +
      (list.length ? '<div class="wrong-preview-list">' + list.map(function (w) {
        return '<a class="wrong-preview-item" href="#/stats/wrong">' +
          '<span class="tag ' + (w.module === 'listening' ? 'blue' : w.module === 'reading' ? 'accent' : w.module === 'writing' ? 'clay' : 'ochre') + '">' + data.moduleName(w.module) + '</span>' +
          '<p class="en">' + esc(w.question.stem || w.unit.title) + '</p>' +
          '<span class="small muted">' + esc(w.question.tag || '') + ' · 错过 ' + w.wrongCount + ' 次 ' + icon('chevronRight') + '</span>' +
        '</a>';
      }).join('') + '</div>' : ui.emptyState({ title: '错题本是干净的', text: '继续保持。做错的题会自动收进这里。' })) +
    '</div>';
  }

  CET6.pages.stats = {
    crumb: '我的数据 · 总览',
    render: function () {
      var s = store.getSummary();
      var ws = s.wordStats;
      var mods = store.getModuleStats();
      var tags = store.getTagStats();
      var wrong = store.getWrongQuestions();
      var trends = store.getScoreTrend();
      var mockTrends = store.getScoreTrend('mock');
      var latestMock = mockTrends.length ? mockTrends[mockTrends.length - 1] : null;
      var countdown = store.getExamCountdown();
      var target = store.state.settings.targetScore || 550;
      var targetPct = Math.round((target / 710) * 100);

      return '<div class="page stats-page">' +
        ui.demoBanner() +
        ui.pageHead({
          eyebrow: 'MY DATA · 个人数据',
          title: '看见自己，正在变好。',
          desc: '分数不是全部。你的坚持、错题和强项，都在这里留下痕迹。',
          actions: '<button class="btn btn-soft btn-sm" type="button" data-action="open-settings">' + icon('settings') + ' 学习设置</button>' +
            '<a class="btn btn-primary btn-sm" href="#/practice">' + icon('play') + ' 继续练习</a>'
        }) +
        statsTabs('overview') +

        '<section class="stats-hero">' +
          '<div class="stats-hero-copy">' +
            '<span class="eyebrow light"><span class="dot"></span> LEARNING OVERVIEW</span>' +
            '<h2>你好，今天也在<br>慢慢靠近目标。</h2>' +
            '<p>已连续学习 <b>' + s.streak + '</b> 天，共留下 <b>' + s.studyDays + '</b> 个学习日。</p>' +
            '<div class="stats-hero-meta">' +
              '<span>' + icon('calendar') + ' 距考试 <b class="num">' + countdown.days + '</b> 天</span>' +
              '<span>' + icon('fileText') + ' 完成 <b class="num">' + s.attemptCount + '</b> 次练习</span>' +
              '<span>' + icon('clock') + ' 共 <b class="num">' + Math.round(s.totalTime / 60) + '</b> 分钟</span>' +
            '</div>' +
          '</div>' +
          '<div class="stats-hero-score">' +
            CET6.ringSVG(s.objectiveAccuracy, 152, 11, 'rgba(255,255,255,.92)') +
            '<div class="stats-hero-ring"><b class="num">' + s.objectiveAccuracy + '%</b><span>客观题正确率</span></div>' +
          '</div>' +
          '<div class="stats-hero-target">' +
            '<span class="target-label">目标分数</span>' +
            '<b class="num">' + target + '<em>/710</em></b>' +
            '<div class="target-bar"><i style="width:' + Math.min(100, targetPct) + '%"></i></div>' +
            '<span class="target-note">' + (latestMock ? '最近模拟估分 ' + Math.round(latestMock.earned) + ' / 710' : '完成一次全真模拟，看看当前水平') + '</span>' +
          '</div>' +
        '</section>' +

        '<div class="stat-grid">' +
          ui.statCard({ label: '累计练习', value: s.attemptCount, unit: '次', icon: 'layers', accent: 'pine', foot: '模拟 / 套题 / 专项' }) +
          ui.statCard({ label: '完成题目', value: s.completedQuestions, unit: '题', icon: 'checkCircle', accent: 'blue', foot: '去重后的作答题目' }) +
          ui.statCard({ label: '综合正确率', value: s.accuracy, unit: '%', icon: 'target', accent: 'ochre', foot: '含自评后的主观题' }) +
          ui.statCard({ label: '已背单词', value: ws.learned, unit: '/ ' + ws.total, icon: 'bookOpen', accent: 'clay', foot: '已掌握 ' + ws.known + ' 个' }) +
        '</div>' +

        '<div class="dashboard-grid">' +
          '<div class="dash-span-8">' + trendSection(trends) + trendView(filterTrend(trends)) + '</div>' +
          '<div class="dash-span-4">' + moduleSection(mods) + '</div>' +
          '<div class="dash-span-4">' + radarSection(tags) + '</div>' +
          '<div class="dash-span-4">' + wrongDonutSection(wrong) + '</div>' +
          '<div class="dash-span-4">' + activitySection() + '</div>' +
          '<div class="dash-span-7">' + recentSection() + '</div>' +
          '<div class="dash-span-5">' + wrongPreviewSection(wrong) + '</div>' +
        '</div>' +
      '</div>';
    },
    mount: function () {
      var page = document.querySelector('.stats-page');
      if (!page) return;
      page.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-trend]');
        if (btn) {
          trendFilter = btn.getAttribute('data-trend');
          page.querySelectorAll('[data-trend]').forEach(function (b) { b.classList.toggle('active', b === btn); });
          var chart = document.getElementById('trendChart');
          var trends = store.getScoreTrend();
          if (chart) chart.innerHTML = ui.lineChart(filterTrend(trends));
          var view = page.querySelector('.trend-summary');
          if (view) view.outerHTML = trendView(filterTrend(trends));
          return;
        }
        if (e.target.closest('[data-action="open-settings"]')) openSettings();
      });
    },
    cleanup: function () {}
  };

  function openSettings() {
    var s = store.state.settings;
    var themePref = CET6.storageGet(CET6.THEME_KEY, 'system');
    var themeChoices = [['system', '跟随系统', 'monitor'], ['light', '浅色', 'sun'], ['dark', '深色', 'moon']];
    var html = '<div class="settings-form">' +
      '<div class="field"><label>外观主题</label><div class="segmented settings-theme">' + themeChoices.map(function (t) {
        return '<button type="button" data-theme-choice="' + t[0] + '" class="' + (themePref === t[0] ? 'active' : '') + '">' + icon(t[2]) + ' ' + t[1] + '</button>';
      }).join('') + '</div></div>' +
      '<div class="field"><label>每日背词目标</label><input class="input" type="number" min="5" max="100" step="5" data-setting="dailyWordGoal" value="' + s.dailyWordGoal + '"></div>' +
      '<div class="field"><label>目标分数（710 分制）</label><input class="input" type="number" min="425" max="710" step="5" data-setting="targetScore" value="' + s.targetScore + '"></div>' +
      '<div class="field"><label>考试日期</label><input class="input" type="date" data-setting="examDate" value="' + s.examDate + '"></div>' +
      '<div class="settings-note">' + icon('info') + ' 数据保存在本机浏览器，换设备不会自动同步。</div>' +
      '<div class="settings-danger"><span><b>导出与重置</b><small>导出 JSON 备份，或清空全部学习数据。</small></span>' +
        '<div><button class="btn btn-sm btn-soft" type="button" data-action="export-data">' + icon('download') + ' 导出</button>' +
        '<button class="btn btn-sm btn-danger" type="button" data-action="reset-data">' + icon('trash') + ' 清空数据</button></div>' +
      '</div>' +
      '<div class="modal-actions"><button class="btn btn-soft" type="button" data-close-modal>取消</button><button class="btn btn-primary" type="button" data-action="save-settings">保存设置</button></div>' +
    '</div>';
    var modal = CET6.modalHtml('学习设置', html, '', {});
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="save-settings"]')) {
        modal.querySelectorAll('[data-setting]').forEach(function (input) {
          var key = input.getAttribute('data-setting');
          var val = key === 'examDate' ? input.value : Number(input.value);
          if (key === 'examDate' && !val) return;
          store.setSetting(key, val);
        });
        CET6.closeModal();
        CET6.toast('设置已保存');
        CET6.rerender();
      }
      if (e.target.closest('[data-action="export-data"]')) {
        exportData();
      }
      if (e.target.closest('[data-action="reset-data"]')) {
        CET6.confirmDialog({
          title: '清空全部学习数据？',
          message: '练习记录、错题、单词进度都会被删除，且无法恢复。建议先导出备份。',
          confirmText: '清空',
          cancelText: '保留数据',
          danger: true
        }).then(function (ok) {
          if (!ok) return;
          store.clearAllData();
          CET6.closeModal();
          CET6.toast('学习数据已清空');
          location.hash = '#/home';
        });
      }
    });
  }

  function exportData() {
    try {
      var blob = new Blob([store.exportJSON()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'lagom-cet6-data-' + CET6.todayKey() + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      CET6.toast('数据已导出');
    } catch (e) {
      CET6.toast('导出失败，请稍后重试', 'alertCircle');
    }
  }

  /* ----------------------------------------------------------
     Wrong book
     ---------------------------------------------------------- */
  function wrongCard(w) {
    var q = w.question;
    var task = w.type === 'writing' || w.type === 'translation';
    var your = task
      ? (typeof w.userAnswer === 'string' && w.userAnswer ? w.userAnswer : '未作答')
      : (typeof w.userAnswer === 'number' && q.options ? LETTERS[w.userAnswer] + '. ' + q.options[w.userAnswer] : '未作答');
    var right = task
      ? (w.scorePct != null ? '自评 ' + w.scorePct + ' 分' : '参考译文/范文')
      : LETTERS[q.answer] + '. ' + q.options[q.answer];
    return '<article class="wrong-card">' +
      '<div class="wrong-card-head">' +
        '<div class="wrong-card-tags">' +
          '<span class="tag ' + (w.module === 'listening' ? 'blue' : w.module === 'reading' ? 'accent' : w.module === 'writing' ? 'clay' : 'ochre') + '">' + data.moduleName(w.module) + '</span>' +
          (q.tag ? ui.tag(q.tag) : '') +
          '<span class="tag outline">错过 ' + w.wrongCount + ' 次</span>' +
          (w.mastered ? '<span class="tag accent">' + icon('check') + ' 已掌握</span>' : '') +
        '</div>' +
        '<span class="small muted">' + CET6.relativeDay(w.lastAt) + '</span>' +
      '</div>' +
      '<h3 class="wrong-card-stem en">' + esc(q.stem || w.unit.title) + '</h3>' +
      '<div class="wrong-answer-line"><span><em>你的答案</em><b class="en wrong">' + esc(your) + '</b></span><span><em>正确答案</em><b class="en right">' + esc(right) + '</b></span></div>' +
      (q.explanation ? '<p class="wrong-card-explain">' + esc(q.explanation) + '</p>' : '') +
      (task && q.reference ? '<details class="transcript"><summary>参考译文 / 范文</summary><div class="transcript-text en">' + String(q.reference).split(/\n\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></details>' : '') +
      '<div class="wrong-card-foot">' +
        '<span class="small muted">' + esc(w.attemptTitle || '') + '</span>' +
        '<div class="row gap-8">' +
          (w.mastered
            ? '<button class="btn btn-ghost btn-sm" type="button" data-action="unmaster" data-qid="' + w.qid + '">' + icon('rotate') + ' 重新加入</button>'
            : '<button class="btn btn-soft btn-sm" type="button" data-action="master" data-qid="' + w.qid + '">' + icon('check') + ' 标记已掌握</button>') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderWrongList() {
    var el = document.getElementById('wrongList');
    if (!el) return;
    var list = store.getWrongQuestions({ includeMastered: wrongFilter.includeMastered, module: wrongFilter.module === 'all' ? undefined : wrongFilter.module });
    var countEl = document.getElementById('wrongCount');
    if (countEl) countEl.textContent = list.length;
    el.innerHTML = list.length
      ? '<div class="wrong-list">' + list.map(wrongCard).join('') + '</div>'
      : ui.emptyState({ title: wrongFilter.includeMastered ? '还没有错题记录' : '没有待掌握的错题', text: wrongFilter.includeMastered ? '做错的题会自动收进这里。' : '继续保持。也可以打开「显示已掌握」回看之前的错题。', action: '<a class="btn btn-soft btn-sm" href="#/practice">去刷题</a>' });
  }

  CET6.pages.wrong = {
    crumb: '我的数据 · 错题本',
    render: function () {
      var total = store.getWrongQuestions().length;
      var all = store.getWrongQuestions({ includeMastered: true });
      wrongFilter = { module: 'all', includeMastered: false };
      return '<div class="page wrong-page">' +
        ui.demoBanner() +
        ui.pageHead({
          eyebrow: 'WRONG ANSWERS · 错题本',
          title: '错题，是下一次的分数。',
          desc: '把错题留下来，弄懂它，然后再标记为已掌握。',
          actions: '<a class="btn btn-primary btn-sm" href="#/quiz/wrong">' + icon('refresh') + ' 开始错题重练</a>'
        }) +
        statsTabs('wrong') +
        '<div class="wrong-board">' +
          '<div class="wrong-board-hero">' +
            '<span class="eyebrow light"><span class="dot"></span> TO REVIEW</span>' +
            '<h2><b class="num" id="wrongCount">' + total + '</b> 道待掌握</h2>' +
            '<p>已累计收录 ' + all.length + ' 道错题。答对一次，就可以把它移出待办。</p>' +
            '<a class="btn btn-soft btn-sm" href="#/quiz/wrong">' + icon('play') + ' 重练全部</a>' +
          '</div>' +
          '<div class="wrong-board-breakdown">' + data.modules.map(function (m) {
            var n = all.filter(function (w) { return w.module === m; }).length;
            return '<div><span class="tag ' + (m === 'listening' ? 'blue' : m === 'reading' ? 'accent' : m === 'writing' ? 'clay' : 'ochre') + '">' + data.moduleName(m) + '</span><b class="num">' + n + '</b></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="wrong-toolbar">' +
          '<div class="segmented wrong-module-filter">' +
            '<button type="button" data-wrong-module="all" class="active">全部</button>' +
            data.modules.map(function (m) { return '<button type="button" data-wrong-module="' + m + '">' + data.moduleName(m) + '</button>'; }).join('') +
          '</div>' +
          '<label class="toggle-line"><input type="checkbox" data-wrong-mastered> 显示已掌握</label>' +
        '</div>' +
        '<div id="wrongList"></div>' +
      '</div>';
    },
    mount: function () {
      renderWrongList();
      var page = document.querySelector('.wrong-page');
      if (!page) return;
      page.addEventListener('click', function (e) {
        var moduleBtn = e.target.closest('[data-wrong-module]');
        if (moduleBtn) {
          wrongFilter.module = moduleBtn.getAttribute('data-wrong-module');
          page.querySelectorAll('[data-wrong-module]').forEach(function (b) { b.classList.toggle('active', b === moduleBtn); });
          renderWrongList();
          return;
        }
        var master = e.target.closest('[data-action="master"]');
        if (master) {
          store.markMastered(master.getAttribute('data-qid'), true);
          CET6.toast('已标记为掌握');
          renderWrongList();
          return;
        }
        var unmaster = e.target.closest('[data-action="unmaster"]');
        if (unmaster) {
          store.markMastered(unmaster.getAttribute('data-qid'), false);
          CET6.toast('已重新加入错题本');
          renderWrongList();
        }
      });
      var toggle = page.querySelector('[data-wrong-mastered]');
      if (toggle) toggle.addEventListener('change', function () { wrongFilter.includeMastered = toggle.checked; renderWrongList(); });
    },
    cleanup: function () {}
  };

  /* ----------------------------------------------------------
     History
     ---------------------------------------------------------- */
  var historyFilter = 'all';

  function renderHistoryList() {
    var el = document.getElementById('historyList');
    if (!el) return;
    var attempts = store.getAttempts();
    if (historyFilter !== 'all') attempts = attempts.filter(function (a) { return a.kind === historyFilter; });
    if (!attempts.length) {
      el.innerHTML = ui.emptyState({ title: '没有符合条件的记录', text: '换个筛选条件，或者去完成一次练习。', action: '<a class="btn btn-soft btn-sm" href="#/practice">去刷题</a>' });
      return;
    }
    var groups = {};
    attempts.forEach(function (a) {
      var d = new Date(a.finishedAt);
      var key = d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月';
      (groups[key] = groups[key] || []).push(a);
    });
    el.innerHTML = Object.keys(groups).map(function (key) {
      return '<div class="history-group"><div class="history-group-head"><span>' + key + '</span><em>' + groups[key].length + ' 次</em></div>' +
        groups[key].map(function (a) {
          var kindLabel = a.kind === 'mock' ? '全真模拟' : a.kind === 'set' ? '套题训练' : a.kind === 'import' ? '导入真题' : a.kind === 'wrong' ? '错题重练' : '专项练习';
          var score = a.kind === 'mock' ? Math.round(a.earned) + ' / 710' : a.kind === 'import' ? Math.round(a.earned) + ' / ' + Math.round(a.totalPoints || 710) : a.kind === 'set' ? Math.round(a.earned) + ' / 100' : a.accuracy + '%';
          return '<a class="history-row" href="#/result/' + a.id + '">' +
            '<span class="history-date"><b>' + CET6.fmtDate(a.finishedAt) + '</b><small>' + new Date(a.finishedAt).getFullYear() + '</small></span>' +
            '<span class="history-main"><b>' + esc(a.title) + (a.demo ? ' <span class="tag">示例</span>' : '') + '</b><small>' + kindLabel + ' · ' + a.totalQuestions + ' 题 · ' + CET6.fmtDuration(a.durationSec) + '</small></span>' +
            '<span class="history-bar"><i class="' + CET6.scoreTone(a.scorePct) + '" style="width:' + a.scorePct + '%"></i></span>' +
            '<span class="history-score num ' + CET6.scoreTone(a.scorePct) + '">' + score + '<small>得分率 ' + a.scorePct + '%</small></span>' +
            '<span class="history-arrow">' + icon('chevronRight') + '</span>' +
          '</a>';
        }).join('') + '</div>';
    }).join('');
  }

  CET6.pages.history = {
    crumb: '我的数据 · 练习记录',
    render: function () {
      var all = store.getAttempts();
      var totalQ = all.reduce(function (n, a) { return n + a.totalQuestions; }, 0);
      var totalTime = all.reduce(function (n, a) { return n + a.durationSec; }, 0);
      historyFilter = 'all';
      return '<div class="page history-page">' +
        ui.demoBanner() +
        ui.pageHead({
          eyebrow: 'HISTORY · 练习记录',
          title: '做过的每一道题，都算数。',
          desc: '这里保留每一次练习的答卷、分数与用时，可以随时打开复盘。',
          actions: '<button class="btn btn-soft btn-sm" type="button" data-action="export">' + icon('download') + ' 导出数据</button>'
        }) +
        statsTabs('history') +
        '<div class="history-summary">' +
          '<div><span>练习次数</span><b class="num">' + all.length + '</b></div>' +
          '<div><span>累计题量</span><b class="num">' + totalQ + '</b></div>' +
          '<div><span>累计时长</span><b class="num">' + Math.round(totalTime / 60) + '<em>分钟</em></b></div>' +
          '<div><span>学习天数</span><b class="num">' + store.getStudyDays() + '</b></div>' +
        '</div>' +
        '<div class="segmented history-filter">' +
          '<button type="button" data-history="all" class="active">全部</button>' +
          '<button type="button" data-history="mock">全真模拟</button>' +
          '<button type="button" data-history="set">套题训练</button>' +
          '<button type="button" data-history="import">导入真题</button>' +
          '<button type="button" data-history="drill">专项练习</button>' +
          '<button type="button" data-history="wrong">错题重练</button>' +
        '</div>' +
        '<div id="historyList"></div>' +
      '</div>';
    },
    mount: function () {
      renderHistoryList();
      var page = document.querySelector('.history-page');
      if (!page) return;
      page.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-history]');
        if (btn) {
          historyFilter = btn.getAttribute('data-history');
          page.querySelectorAll('[data-history]').forEach(function (b) { b.classList.toggle('active', b === btn); });
          renderHistoryList();
          return;
        }
        if (e.target.closest('[data-action="export"]')) exportData();
      });
    },
    cleanup: function () {}
  };
})();

