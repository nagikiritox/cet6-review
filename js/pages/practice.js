/* ============================================================
   LAGOM CET-6 · pages/practice.js
   Practice hub (papers, sets, drills) and drill detail.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var TABS = [
    { id: 'mock', label: '真题模拟', href: '#/practice/mock', icon: 'fileText' },
    { id: 'sets', label: '套题训练', href: '#/practice/sets', icon: 'layers' },
    { id: 'drills', label: '专项练习', href: '#/practice/drills', icon: 'target' },
    { id: 'imports', label: '导入真题', href: '#/practice/imports', icon: 'upload' }
  ];

  function practiceHeader(tab) {
    var sub = {
      mock: '完整流程、严格计时，一次性走完写作、听力、阅读与翻译。',
      sets: '45 分钟轻量套卷，保持手感，也保持节奏。',
      drills: '把听力、阅读、翻译、写作拆开来，一处一处地练。',
      imports: '导入你自己的真题题目与听力音频，和内置套卷一起作答、一起统计。'
    }[tab];
    return ui.pageHead({
      eyebrow: 'PRACTICE · 刷题',
      title: '今天，练哪一块？',
      desc: sub,
      actions: '<a class="btn btn-soft btn-sm" href="#/imports">' + icon('upload') + ' 导入真题</a><a class="btn btn-soft btn-sm" href="#/stats/wrong">' + icon('refresh') + ' 错题重练</a>'
    });
  }

  function tabs(active) {
    return '<div class="segmented pill-lg tab-bar">' + TABS.map(function (t) {
      return '<a href="' + t.href + '" class="' + (t.id === active ? 'active' : '') + '">' + icon(t.icon) + ' ' + t.label + '</a>';
    }).join('') + '</div>';
  }

  function paperCard(paper) {
    var count = CET6.data.paperQuestionCount(paper);
    var progress = store.getPaperProgress(paper.id);
    var best = progress ? progress.best : null;
    var isMock = paper.type === 'mock';
    return '<article class="paper-card accent-' + (paper.accent || 'pine') + '">' +
      '<div class="paper-cover">' +
        '<div class="paper-cover-top"><span class="paper-badge">' + (isMock ? '全真模拟' : '套题训练') + '</span><span class="paper-date">' + esc(paper.subtitle.split(' · ')[0]) + '</span></div>' +
        '<div class="paper-cover-art">' + coverArt(paper.accent) + '</div>' +
        '<div class="paper-cover-bottom"><span>' + esc(paper.subtitle) + '</span><span class="num">' + (isMock ? '710' : '100') + '<em> 分</em></span></div>' +
      '</div>' +
      '<div class="paper-body">' +
        '<div class="paper-head"><h3>' + esc(paper.title) + '</h3>' + ui.difficulty(paper.difficulty) + '</div>' +
        '<p class="paper-desc">' + esc(paper.description) + '</p>' +
        '<div class="paper-specs">' +
          '<span>' + icon('list') + ' ' + count + ' 题</span>' +
          '<span>' + icon('clock') + ' ' + paper.durationMin + ' 分钟</span>' +
          '<span>' + icon('layers') + ' ' + paper.sections.length + ' 部分</span>' +
        '</div>' +
        '<div class="paper-progress">' +
          (best
            ? '<div class="spread small"><span>已练 ' + progress.count + ' 次</span><span>最佳 <b class="num">' + (isMock ? Math.round(best.earned) + ' / 710' : best.scorePct + '%') + '</b></span></div><div class="progress' + (isMock ? '' : ' blue') + '"><i style="width:' + (isMock ? Math.round((best.earned / 710) * 100) : best.scorePct) + '%"></i></div>'
            : '<div class="spread small muted"><span>还没有练过</span><span class="num">—</span></div><div class="progress"><i style="width:0%"></i></div>') +
        '</div>' +
        '<div class="paper-actions">' +
          '<a class="btn btn-primary" href="#/quiz/paper/' + paper.id + '">' + icon('play') + ' ' + (best ? '再练一次' : '开始' + (isMock ? '模拟' : '训练')) + '</a>' +
          (best ? '<a class="btn btn-ghost btn-sm" href="#/result/' + best.id + '">上次报告 ' + icon('arrowRight') + '</a>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function coverArt(accent) {
    return '<svg viewBox="0 0 360 150" fill="none" aria-hidden="true">' +
      '<circle cx="292" cy="58" r="56" stroke="rgba(255,255,255,.34)" stroke-width="1.4"/>' +
      '<circle cx="292" cy="58" r="34" stroke="rgba(255,255,255,.22)" stroke-width="1.4"/>' +
      '<path d="M-10 128c69-46 130-61 186-46 51 14 104 48 196 76" stroke="rgba(255,255,255,.3)" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M-10 146c78-34 143-43 196-28 51 14 109 38 186 55" stroke="rgba(255,255,255,.18)" stroke-width="1.4" stroke-linecap="round"/>' +
      '<text x="28" y="68" fill="rgba(255,255,255,.92)" font-family="Schibsted Grotesk, sans-serif" font-size="30" font-weight="600" letter-spacing="-1">LAGOM</text>' +
      '<text x="28" y="88" fill="rgba(255,255,255,.55)" font-family="Schibsted Grotesk, sans-serif" font-size="9" letter-spacing="3">CET-6 PRACTICE</text>' +
      '</svg>';
  }

  function importsSection() {
    var papers = CET6.imports ? CET6.imports.list() : [];
    if (!papers.length) {
      return '<section class="practice-section">' +
        '<div class="import-empty-card">' +
          '<div class="import-empty-art">' + icon('upload') + '</div>' +
          '<span class="eyebrow"><span class="dot"></span> IMPORT · 导入真题</span>' +
          '<h2>把你手里的真题，<br>放进同一个练习场。</h2>' +
          '<p>上传 <b>题目文件（JSON / TXT / MD）</b> 和 <b>听力音频（MP3 / WAV / M4A）</b>，导入后会生成一套完整的真题卷，和内置模拟卷一样计时、交卷、估分、进错题本。</p>' +
          '<div class="import-empty-actions">' +
            '<a class="btn btn-primary btn-lg" href="#/imports">' + icon('upload') + ' 导入第一套真题</a>' +
            '<button class="btn btn-soft" type="button" data-action="download-template">' + icon('download') + ' 下载 JSON 模板</button>' +
          '</div>' +
          '<div class="import-empty-meta">' + icon('info') + ' 导入数据只保存在本机浏览器，不会上传到 GitHub；换设备需要重新导入。</div>' +
        '</div>' +
        '<div class="practice-tip-row">' +
          tip('fileText', '题目文件', 'JSON 结构最稳；TXT/MD 可使用页面提供的简单格式。') +
          tip('headphones', '听力音频', '上传多个音频后会自动按文件名或顺序绑定，可在预览中调整。') +
          tip('target', '自动统计', '导入卷同样计入分数趋势、题型强弱、错题本与练习记录。') +
        '</div>' +
      '</section>';
    }
    var questionCount = papers.reduce(function (n, p) { return n + CET6.data.paperQuestionCount(p); }, 0);
    var audioCount = papers.reduce(function (n, p) {
      var rows = CET6.data.getUnitsForPaper(p);
      return n + rows.filter(function (r) { return r.unit.module === 'listening' && r.unit.audio; }).length;
    }, 0);
    return '<section class="practice-section">' +
      '<div class="practice-summary">' +
        '<div class="ps-item"><span class="ps-ico accent-blue">' + icon('upload') + '</span><div><b class="num">' + papers.length + '</b><small>套导入真题</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-ochre">' + icon('list') + '</span><div><b class="num">' + questionCount + '</b><small>道题</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-pine">' + icon('headphones') + '</span><div><b class="num">' + audioCount + '</b><small>段听力音频</small></div></div>' +
        '<div class="ps-note">' + icon('info') + ' 导入卷保存在本机，可随时删除。</div>' +
      '</div>' +
      '<div class="paper-grid">' + papers.map(importCard).join('') + '</div>' +
      '<div class="import-list-actions"><a class="btn btn-primary" href="#/imports">' + icon('upload') + ' 导入新的真题</a>' +
        '<button class="btn btn-soft" type="button" data-action="download-template">' + icon('download') + ' 下载 JSON 模板</button></div>' +
      '<div class="practice-tip-row">' +
        tip('fileText', '导入卷可编辑', '删除后该卷的听力音频和题目会从本机移除，但历史作答记录仍保留。') +
        tip('headphones', '音频绑定', '如果自动绑定不准确，可以在导入预览里逐个听力单元选择文件。') +
        tip('chart', '计入统计', '导入卷的得分、错题和题型数据会自动进入我的数据。') +
      '</div>' +
    '</section>';
  }

  function importCard(paper) {
    var count = CET6.data.paperQuestionCount(paper);
    var progress = store.getPaperProgress(paper.id);
    var best = progress ? progress.best : null;
    var total = paper.totalPoints || 710;
    var pct = best ? Math.round((best.earned / total) * 100) : 0;
    var audioCount = CET6.data.getUnitsForPaper(paper).filter(function (r) {
      return r.unit.module === 'listening' && r.unit.audio;
    }).length;
    return '<article class="paper-card accent-blue import-paper-card">' +
      '<div class="paper-cover">' +
        '<div class="paper-cover-top"><span class="paper-badge">导入真题</span><span class="paper-date">' + esc(paper.sourceName || '本地导入') + '</span></div>' +
        '<div class="paper-cover-art">' + coverArt('blue') + '</div>' +
        '<div class="paper-cover-bottom"><span>' + esc(paper.subtitle || '导入真题') + '</span><span class="num">' + Math.round(total) + '<em> 分</em></span></div>' +
      '</div>' +
      '<div class="paper-body">' +
        '<div class="paper-head"><h3>' + esc(paper.title) + '</h3><span class="tag blue">' + icon('upload') + ' 已导入</span></div>' +
        '<p class="paper-desc">' + esc(paper.description || '从本地真题文件导入的练习卷。') + '</p>' +
        '<div class="paper-specs">' +
          '<span>' + icon('list') + ' ' + count + ' 题</span>' +
          '<span>' + icon('clock') + ' ' + (paper.durationMin || 130) + ' 分钟</span>' +
          '<span>' + icon('headphones') + ' ' + audioCount + ' 段音频</span>' +
        '</div>' +
        '<div class="paper-progress">' +
          (best
            ? '<div class="spread small"><span>已练 ' + progress.count + ' 次</span><span>最佳 <b class="num">' + Math.round(best.earned) + ' / ' + Math.round(total) + '</b></span></div><div class="progress blue"><i style="width:' + pct + '%"></i></div>'
            : '<div class="spread small muted"><span>还没有练过</span><span class="num">—</span></div><div class="progress"><i style="width:0%"></i></div>') +
        '</div>' +
        '<div class="paper-actions">' +
          '<a class="btn btn-primary" href="#/quiz/paper/' + paper.id + '">' + icon('play') + ' ' + (best ? '再练一次' : '开始作答') + '</a>' +
          (best ? '<a class="btn btn-ghost btn-sm" href="#/result/' + best.id + '">上次报告 ' + icon('arrowRight') + '</a>' : '') +
          '<button class="btn btn-ghost btn-sm import-delete" type="button" data-action="delete-import" data-id="' + paper.id + '" title="删除这套导入真题">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function mockSection() {
    var papers = CET6.data.papers.filter(function (p) { return p.type === 'mock'; });
    return '<section class="practice-section">' +
      '<div class="practice-summary">' +
        '<div class="ps-item"><span class="ps-ico accent-pine">' + icon('fileText') + '</span><div><b class="num">' + papers.length + '</b><small>套全真模拟</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-ochre">' + icon('clock') + '</span><div><b class="num">130</b><small>分钟 / 套</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-blue">' + icon('headphones') + '</span><div><b>听力音频</b><small>可回放</small></div></div>' +
        '<div class="ps-note">' + icon('info') + ' 交卷后主观题可自评，估分按 710 分制换算。</div>' +
      '</div>' +
      '<div class="paper-grid">' + papers.map(paperCard).join('') + '</div>' +
      '<div class="practice-tip-row">' +
        tip('clock', '严格计时', '从写作开始，按 130 分钟完整走一遍，训练考场节奏。') +
        tip('headphones', '听力一次成型', '模拟时尽量不暂停音频；对答案时再回放精听。') +
        tip('target', '先易后难', '遇到卡住的阅读先标记，最后统一回来处理。') +
      '</div>' +
    '</section>';
  }

  function setsSection() {
    var sets = CET6.data.papers.filter(function (p) { return p.type === 'set'; });
    return '<section class="practice-section">' +
      '<div class="practice-summary">' +
        '<div class="ps-item"><span class="ps-ico accent-blue">' + icon('layers') + '</span><div><b class="num">' + sets.length + '</b><small>套短程套题</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-ochre">' + icon('clock') + '</span><div><b class="num">45</b><small>分钟 / 套</small></div></div>' +
        '<div class="ps-divider"></div>' +
        '<div class="ps-item"><span class="ps-ico accent-pine">' + icon('sparkles') + '</span><div><b>原创语料</b><small>主题化训练</small></div></div>' +
        '<div class="ps-note">' + icon('info') + ' 套题按 100 分制计分，适合碎片时间保持手感。</div>' +
      '</div>' +
      '<div class="paper-grid set-grid">' + sets.map(paperCard).join('') + '</div>' +
    '</section>';
  }

  function drillsSection() {
    var cards = CET6.data.modules.map(function (module) {
      var meta = CET6.data.moduleMeta(module);
      var units = CET6.data.getDrillUnits(module);
      var count = CET6.data.drillQuestionCount(module);
      var mod = store.getModuleStats()[module];
      var done = CET6.store.state.attempts.some(function (a) {
        return a.items && a.items.some(function (i) { return i.module === module; });
      });
      return '<div class="drill-card accent-' + (meta.accent || 'pine') + '">' +
        '<div class="drill-head"><span class="module-icon accent-' + (meta.accent || 'pine') + '">' + icon(meta.icon) + '</span>' +
          '<span class="tag ' + (meta.accent === 'ochre' ? 'ochre' : meta.accent === 'blue' ? 'blue' : meta.accent === 'clay' ? 'clay' : 'accent') + '">' + units.length + ' 组</span>' +
        '</div>' +
        '<h3>' + meta.name + '</h3>' +
        '<p>' + esc(meta.description) + '</p>' +
        '<div class="drill-stats">' +
          '<span><b class="num">' + count + '</b> 题</span>' +
          '<span><b class="num">' + (mod.total ? mod.accuracy + '%' : '—') + '</b> 正确率</span>' +
          '<span><b class="num">' + (mod.total || 0) + '</b> 已答</span>' +
        '</div>' +
        '<div class="drill-actions">' +
          '<a class="btn btn-primary btn-sm" href="#/quiz/drill/' + module + '">' + icon('play') + ' 开始练习</a>' +
          '<a class="btn btn-ghost btn-sm" href="#/drill/' + module + '">选择单元 ' + icon('arrowRight') + '</a>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<section class="practice-section">' +
      '<div class="drill-grid">' + cards + '</div>' +
      '<div class="drill-bottom">' +
        '<div class="practice-tip-row">' +
          tip('headphones', '听力先精听后刷题', '听不懂的句子先看原文，再回到音频里找声音。') +
          tip('bookOpen', '阅读限时 8 分钟', '一篇阅读 2-3 题，训练定位速度和排除法。') +
          tip('pen', '主观题先写再对照', '不要先看范文；写完再比较结构与表达。') +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function tip(iconName, title, text) {
    return '<div class="tip-card"><span class="tip-ico">' + icon(iconName) + '</span><div><b>' + title + '</b><p>' + text + '</p></div></div>';
  }

  CET6.pages.practice = {
    crumb: '刷题 · 练习',
    render: function (ctx) {
      var tab = ctx.tab || 'mock';
      if (['mock', 'sets', 'drills', 'imports'].indexOf(tab) < 0) tab = 'mock';
      return '<div class="page practice-page">' +
        ui.demoBanner() +
        practiceHeader(tab) +
        tabs(tab) +
        (tab === 'mock' ? mockSection() : tab === 'sets' ? setsSection() : tab === 'drills' ? drillsSection() : importsSection()) +
      '</div>';
    },
    mount: function () {
      var page = document.querySelector('.practice-page');
      if (!page) return;
      page.addEventListener('click', function (e) {
        if (e.target.closest('[data-action="download-template"]')) {
          if (CET6.imports) CET6.imports.downloadTemplate();
          return;
        }
        var del = e.target.closest('[data-action="delete-import"]');
        if (del) {
          var id = del.getAttribute('data-id');
          CET6.confirmDialog({
            title: '删除这套导入真题？',
            message: '题目和已保存的听力音频会从本机移除。已经产生的练习记录仍会保留，但报告里的题目可能无法再打开。',
            confirmText: '删除',
            cancelText: '保留',
            danger: true
          }).then(function (ok) {
            if (!ok) return;
            CET6.imports.remove(id).then(function () {
              CET6.toast('导入真题已删除');
              CET6.rerender();
            }).catch(function () { CET6.toast('删除失败，请稍后重试', 'alertCircle'); });
          });
        }
      });
    }
  };

  /* ----------------------------------------------------------
     Drill detail
     ---------------------------------------------------------- */
  CET6.pages.drill = {
    crumb: '专项练习 · 单元',
    render: function (ctx) {
      var module = ctx.module;
      var meta = CET6.data.moduleMeta(module);
      var units = CET6.data.getDrillUnits(module);
      if (!meta || !units.length) {
        return '<div class="page">' + ui.emptyState({ title: '没有找到这个专项', text: '回到刷题页重新选择。', action: '<a class="btn btn-soft" href="#/practice/drills">返回专项练习</a>' }) + '</div>';
      }
      var mod = store.getModuleStats()[module] || { total: 0, accuracy: 0 };
      var doneQids = {};
      store.state.attempts.forEach(function (a) {
        (a.items || []).forEach(function (it) { if (it.answered) doneQids[it.qid] = true; });
      });

      var unitCards = units.map(function (unit, idx) {
        var qs = unit.questions || [];
        var done = qs.filter(function (q) { return doneQids[q.id]; }).length;
        var isTask = qs.some(function (q) { return q.type === 'writing'; });
        return '<a class="unit-row" href="#/quiz/unit/' + unit.id + '">' +
          '<span class="unit-index num">' + String(idx + 1).padStart(2, '0') + '</span>' +
          '<span class="unit-main">' +
            '<span class="unit-title">' + esc(unit.title) + '</span>' +
            '<span class="unit-meta">' + (unit.tags || []).slice(0, 2).map(function (t) { return ui.tag(t); }).join(' ') +
              '<span class="unit-dot">·</span>' + qs.length + ' 题' +
              (unit.module === 'listening' ? '<span class="unit-dot">·</span>' + icon('headphones') + ' 音频' : '') +
              (unit.module === 'writing' || unit.module === 'translation' ? '<span class="unit-dot">·</span>约 ' + (unit.module === 'writing' ? '30' : '20') + ' 分钟' : '') +
            '</span>' +
          '</span>' +
          '<span class="unit-status">' + (done === qs.length ? '<span class="tag accent">' + icon('check') + ' 已完成</span>' : done ? '<span class="tag ochre">' + done + '/' + qs.length + '</span>' : ui.difficulty(unit.difficulty || 2)) + '</span>' +
          '<span class="unit-arrow">' + icon('chevronRight') + '</span>' +
        '</a>';
      }).join('');

      return '<div class="page drill-page">' +
        '<a class="back-link" href="#/practice/drills">' + icon('arrowLeft') + ' 全部专项</a>' +
        '<section class="drill-hero accent-' + (meta.accent || 'pine') + '">' +
          '<div class="drill-hero-main">' +
            '<span class="module-icon lg accent-' + (meta.accent || 'pine') + '">' + icon(meta.icon) + '</span>' +
            '<div><span class="eyebrow"><span class="dot"></span> DRILL · ' + meta.name + '</span>' +
            '<h1 class="h1">' + meta.name + '专项</h1>' +
            '<p>' + esc(meta.instructions || meta.description) + '</p></div>' +
          '</div>' +
          '<div class="drill-hero-side">' +
            '<div class="drill-hero-stat"><b class="num">' + units.length + '</b><span>组材料</span></div>' +
            '<div class="drill-hero-stat"><b class="num">' + CET6.data.drillQuestionCount(module) + '</b><span>道题</span></div>' +
            '<div class="drill-hero-stat"><b class="num">' + (mod.total ? mod.accuracy + '%' : '—') + '</b><span>正确率</span></div>' +
            '<a class="btn btn-primary" href="#/quiz/drill/' + module + '">' + icon('play') + ' 开始整套</a>' +
          '</div>' +
        '</section>' +
        '<section class="section">' +
          '<div class="section-head"><div><h2>选择一组材料</h2><p>也可以直接开始整套，按顺序完成全部 ' + CET6.data.drillQuestionCount(module) + ' 题。</p></div></div>' +
          '<div class="unit-list">' + unitCards + '</div>' +
        '</section>' +
        '<div class="drill-footnote">' + icon('info') + ' 每道题提交后会立即显示答案与解析；' + (module === 'listening' ? '音频可反复回放。' : module === 'reading' ? '文章与题目同屏，方便定位。' : '参考译文/范文在提交后开放。') + '</div>' +
      '</div>';
    },
    mount: function () {}
  };
})();
