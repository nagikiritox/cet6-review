/* ============================================================
   LAGOM CET-6 · app.js
   Boot, hash router, global chrome and shared interactions.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var data = CET6.data;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var view = document.getElementById('view');
  var currentCtx = null;
  var currentPage = null;
  var currentName = '';

  /* ----------------------------------------------------------
     Router
     ---------------------------------------------------------- */
  function parseHash() {
    var raw = (location.hash || '').replace(/^#\/?/, '').replace(/\?.*$/, '');
    var parts = raw.split('/').filter(Boolean);
    if (!parts.length) return { name: 'home', page: 'home', title: '首页' };

    if (parts[0] === 'home') return { name: 'home', page: 'home', title: '首页' };
    if (parts[0] === 'practice') {
      var tab = parts[1] || 'mock';
      if (['mock', 'sets', 'drills', 'imports'].indexOf(tab) < 0) tab = 'mock';
      return { name: 'practice', page: 'practice', tab: tab, title: '刷题', crumb: '刷题 · ' + ({ mock: '真题模拟', sets: '套题训练', drills: '专项练习', imports: '导入真题' })[tab] };
    }
    if (parts[0] === 'imports') return { name: 'imports', page: 'imports', title: '导入真题', crumb: '刷题 · 导入真题' };
    if (parts[0] === 'drill' && parts[1]) return { name: 'drill', page: 'drill', module: parts[1], title: '专项练习', crumb: '专项练习 · 单元' };
    if (parts[0] === 'quiz') {
      if (parts[1] === 'paper' && parts[2]) return { name: 'quiz', page: 'quiz', quizKind: 'paper', param: parts[2], title: '答题', crumb: '答题' };
      if (parts[1] === 'drill' && parts[2]) return { name: 'quiz', page: 'quiz', quizKind: 'drill', param: parts[2], title: '专项练习', crumb: '答题' };
      if (parts[1] === 'unit' && parts[2]) return { name: 'quiz', page: 'quiz', quizKind: 'unit', param: parts[2], title: '单项训练', crumb: '答题' };
      if (parts[1] === 'wrong') return { name: 'quiz', page: 'quiz', quizKind: 'wrong', param: null, title: '错题重练', crumb: '答题' };
    }
    if (parts[0] === 'result' && parts[1]) return { name: 'result', page: 'result', param: parts[1], title: '学习报告', crumb: '学习报告' };
    if (parts[0] === 'review' && parts[1]) return { name: 'result', page: 'result', param: parts[1], title: '学习报告', crumb: '学习报告' };
    if (parts[0] === 'words') {
      if (parts[1] === 'session') return { name: 'wordSession', page: 'wordSession', param: parts[2] || 'today', title: '背单词', crumb: '背单词 · 专注模式' };
      return { name: 'words', page: 'words', title: '背单词', crumb: '背单词 · 词书' };
    }
    if (parts[0] === 'stats') {
      if (parts[1] === 'wrong') return { name: 'wrong', page: 'wrong', title: '错题本', crumb: '我的数据 · 错题本' };
      if (parts[1] === 'history') return { name: 'history', page: 'history', title: '练习记录', crumb: '我的数据 · 练习记录' };
      return { name: 'stats', page: 'stats', title: '我的数据', crumb: '我的数据 · 总览' };
    }
    return { name: 'notFound', page: 'notFound', title: '页面不存在', crumb: '迷路了', raw: raw };
  }

  var NAV_MAP = {
    home: 'home',
    practice: 'practice',
    drill: 'practice',
    imports: 'practice',
    quiz: 'practice',
    result: 'practice',
    words: 'words',
    wordSession: 'words',
    stats: 'stats',
    wrong: 'stats',
    history: 'stats',
    notFound: 'home'
  };

  var CRUMB_ICON = {
    home: 'home', practice: 'layers', drill: 'target', imports: 'upload', quiz: 'pen', result: 'award',
    words: 'bookOpen', wordSession: 'bookOpen', stats: 'chart', wrong: 'bookmark', history: 'list', notFound: 'compass'
  };

  function renderRoute() {
    var ctx = parseHash();
    if (currentPage && currentPage.cleanup) {
      try { currentPage.cleanup(); } catch (e) { console.error(e); }
    }
    ui.stopAudio();
    CET6.closeModal();
    document.body.style.overflow = '';

    var page = CET6.pages[ctx.page];
    if (!page) {
      view.innerHTML = notFoundPage();
      currentCtx = ctx;
      currentPage = null;
      currentName = ctx.name;
      updateChrome(ctx);
      document.title = '页面不存在 · LAGOM CET-6';
      window.scrollTo(0, 0);
      return;
    }

    currentCtx = ctx;
    currentPage = page;
    currentName = ctx.name;
    var html;
    try {
      html = page.render(ctx);
    } catch (err) {
      console.error(err);
      html = '<div class="page">' + ui.emptyState({
        title: '页面加载时遇到一点问题',
        text: '刷新页面再试一次。如果仍然出现，可能是题库数据没有加载完整。',
        action: '<a class="btn btn-soft" href="#/home">回到首页</a>'
      }) + '</div>';
    }
    view.innerHTML = html;
    try { page.mount(ctx); } catch (err) { console.error(err); }
    updateChrome(ctx);
    document.title = (ctx.crumb || ctx.title || '') + ' · LAGOM CET-6';
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  }

  function notFoundPage() {
    return '<div class="page notfound-page">' +
      '<div class="notfound-art">' + icon('compass') + '</div>' +
      '<span class="eyebrow"><span class="dot"></span> 404 · LOST</span>' +
      '<h1 class="display">这条小路<br>还没有铺好。</h1>' +
      '<p class="lead">你要找的页面不存在，或者已经搬家了。回首页，继续今天的节奏。</p>' +
      '<div class="row gap-10"><a class="btn btn-primary" href="#/home">' + icon('home') + ' 回到首页</a><a class="btn btn-soft" href="#/practice">' + icon('layers') + ' 去刷题</a></div>' +
    '</div>';
  }

  function updateChrome(ctx) {
    var navKey = NAV_MAP[ctx.name] || '';
    document.querySelectorAll('.side-nav a, .mobile-nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === navKey);
    });
    var crumb = document.getElementById('crumbText');
    if (crumb) crumb.textContent = ctx.crumb || ctx.title || '学习空间';
    var crumbIcon = document.querySelector('.crumb-icon');
    if (crumbIcon) crumbIcon.innerHTML = icon(CRUMB_ICON[ctx.name] || 'compass');
    refreshChrome();
  }

  function refreshChrome() {
    var summary = store.getSummary();
    var streak = document.getElementById('topStreak');
    if (streak) streak.textContent = summary.streak;
    var countdown = store.getExamCountdown();
    var side = document.getElementById('sideCountdown');
    if (side) side.innerHTML = countdown.days + ' <em>天</em>';
    var sideDate = document.getElementById('sideExamDate');
    if (sideDate) sideDate.textContent = String(countdown.date || '').replace(/-/g, '.') + ' · 六级考试';
  }

  CET6.onStoreChange = refreshChrome;

  /* ----------------------------------------------------------
     Re-render current page (used after self-assessment / settings)
     ---------------------------------------------------------- */
  CET6.rerender = function () {
    if (!currentCtx || currentName === 'quiz') return;
    var y = window.scrollY;
    var ctx = currentCtx;
    if (currentPage && currentPage.cleanup) {
      try { currentPage.cleanup(); } catch (e) { console.error(e); }
    }
    ui.stopAudio();
    CET6.closeModal();
    var page = CET6.pages[ctx.page];
    if (!page) return;
    try {
      view.innerHTML = page.render(ctx);
      page.mount(ctx);
    } catch (err) {
      console.error(err);
    }
    updateChrome(ctx);
    requestAnimationFrame(function () { window.scrollTo(0, y); });
  };

  /* ----------------------------------------------------------
     Theme
     ---------------------------------------------------------- */
  function currentThemePref() {
    return CET6.storageGet(CET6.THEME_KEY, 'system');
  }

  function setTheme(pref) {
    CET6.storageSet(CET6.THEME_KEY, pref);
    CET6.applyTheme(pref);
    updateThemeButtons();
  }

  function updateThemeButtons() {
    var pref = currentThemePref();
    document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === pref);
    });
    var quick = document.querySelector('[data-action="theme-quick"]');
    if (quick) {
      var resolved = document.documentElement.dataset.theme;
      quick.innerHTML = icon(resolved === 'dark' ? 'sun' : 'moon');
      quick.setAttribute('aria-label', resolved === 'dark' ? '切换到浅色' : '切换到深色');
    }
  }

  /* ----------------------------------------------------------
     Global events
     ---------------------------------------------------------- */
  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var themeBtn = e.target.closest('[data-theme-choice]');
      if (themeBtn) {
        setTheme(themeBtn.getAttribute('data-theme-choice'));
        CET6.toast('外观已切换为「' + ({ system: '跟随系统', light: '浅色', dark: '深色' })[themeBtn.getAttribute('data-theme-choice')] + '」');
        return;
      }
      if (e.target.closest('[data-action="theme-quick"]')) {
        var resolved = document.documentElement.dataset.theme;
        setTheme(resolved === 'dark' ? 'light' : 'dark');
        return;
      }
      var clear = e.target.closest('[data-action="clear-demo"]');
      if (clear) {
        store.clearDemoData();
        CET6.toast('示例数据已清除，开始记录你的学习');
        CET6.rerender();
        return;
      }
      var skip = e.target.closest('.skip-link');
      if (skip) {
        e.preventDefault();
        view.focus();
      }
    });

    window.addEventListener('hashchange', renderRoute);

    // ensure theme is coherent before first paint (utils already resolved it)
    updateThemeButtons();
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function boot() {
    CET6.hydrateIcons(document);
    var ready = CET6.imports && CET6.imports.init ? CET6.imports.init() : Promise.resolve();
    ready.then(function () {
      store.ensureDemo();
      if (!location.hash || location.hash === '#') {
        history.replaceState(null, '', '#/home');
      }
      bindGlobal();
      updateThemeButtons();
      refreshChrome();
      renderRoute();
    }).catch(function (err) {
      console.error(err);
      store.ensureDemo();
      bindGlobal();
      updateThemeButtons();
      refreshChrome();
      renderRoute();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
