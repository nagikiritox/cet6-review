/* ============================================================
   LAGOM CET-6 · pages/words.js
   Vocabulary dashboard, word list, focus session.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var data = CET6.data;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var filterState = { mode: 'all', query: '', limit: 24 };

  var FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'learning', label: '学习中' },
    { id: 'known', label: '已掌握' },
    { id: 'wrong', label: '错词' },
    { id: 'starred', label: '生词' },
    { id: 'new', label: '未学' }
  ];

  function wordMatches(w) {
    var p = store.getWordProgress(w.id);
    if (filterState.mode === 'learning') return p && p.seen && p.status === 'learning';
    if (filterState.mode === 'known') return p && p.status === 'known';
    if (filterState.mode === 'wrong') return p && p.wrong > 0;
    if (filterState.mode === 'starred') return p && p.starred;
    if (filterState.mode === 'new') return !p || !p.seen;
    return true;
  }

  function filteredWords() {
    var q = filterState.query.trim().toLowerCase();
    return data.words.filter(function (w) {
      if (!wordMatches(w)) return false;
      if (!q) return true;
      return w.word.toLowerCase().indexOf(q) >= 0 || w.meaning.indexOf(q) >= 0;
    });
  }

  function wordRow(w) {
    var p = store.getWordProgress(w.id);
    var status = ui.wordStatus(p);
    var starred = p && p.starred;
    return '<div class="word-row" data-word-row="' + w.id + '">' +
      '<button class="word-speak" type="button" data-speak="' + esc(w.word) + '" aria-label="朗读 ' + esc(w.word) + '">' + icon('volume') + '</button>' +
      '<div class="word-row-main">' +
        '<div class="word-row-title"><b class="en">' + esc(w.word) + '</b><span class="word-phonetic en">' + esc(w.phonetic) + '</span><span class="word-pos">' + esc(w.pos) + '</span>' + status + '</div>' +
        '<p class="word-meaning">' + esc(w.meaning) + '</p>' +
        '<p class="word-example en">' + esc(w.example) + '</p>' +
      '</div>' +
      '<div class="word-row-actions">' +
        '<button class="star-btn' + (starred ? ' active' : '') + '" type="button" data-action="star-word" data-id="' + w.id + '" title="' + (starred ? '取消生词标记' : '标记为生词') + '">' + icon('star') + '</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-action="word-detail" data-id="' + w.id + '">详情</button>' +
      '</div>' +
    '</div>';
  }

  function renderWordList() {
    var list = filteredWords();
    var visible = list.slice(0, filterState.limit);
    var listEl = document.getElementById('wordList');
    if (!listEl) return;
    listEl.innerHTML = visible.length
      ? '<div class="word-list">' + visible.map(wordRow).join('') + '</div>' +
        '<div class="word-list-foot"><span class="small muted">显示 ' + visible.length + ' / ' + list.length + ' 个单词</span>' +
        (visible.length < list.length ? '<button class="btn btn-soft btn-sm" type="button" data-action="load-more">加载更多 ' + icon('chevronDown') + '</button>' : '') + '</div>'
      : ui.emptyState({ title: '没有匹配的单词', text: '换个筛选条件或搜索词试试。', action: '<button class="btn btn-soft btn-sm" type="button" data-action="reset-filter">清除筛选</button>' });
    ui.bindSpeak(listEl);
  }

  function wordBars(logs) {
    var max = Math.max.apply(null, logs.map(function (l) { return l.total; }).concat([1]));
    return '<div class="word-bars">' + logs.map(function (l) {
      var h = Math.max(3, Math.round((l.total / max) * 100));
      var isToday = l.date === CET6.todayKey();
      var d = new Date(l.date + 'T00:00:00');
      var wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
      return '<div class="word-bar-col" title="' + l.date + ' · ' + l.total + ' 词">' +
        '<span class="word-bar-value num">' + (l.total || '') + '</span>' +
        '<span class="word-bar-track"><i class="' + (isToday ? 'today' : '') + '" style="height:' + h + '%"></i></span>' +
        '<span class="word-bar-day">' + (isToday ? '今' : wd) + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function todayCard(ws) {
    var nextWord = data.words.find(function (w) { var p = store.getWordProgress(w.id); return !p || !p.seen; }) || data.words[0];
    return '<div class="word-today-card">' +
      '<div class="word-today-main">' +
        '<span class="eyebrow light"><span class="dot"></span> TODAY\'S WORDS</span>' +
        '<h2>今天，先认识 <em class="num">' + ws.goal + '</em> 个词。</h2>' +
        '<p>不贪多。新词和复习词混在一起，刚刚好。</p>' +
        '<div class="word-today-actions"><a class="btn btn-soft" href="#/words/session/today">' + icon('play') + ' 开始背词</a>' +
        '<a class="btn btn-ghost" href="#/words/session/review">复习待学 ' + icon('arrowRight') + '</a></div>' +
      '</div>' +
      '<div class="word-today-ring">' + CET6.ringSVG(ws.goalPct, 130, 9, 'rgba(255,255,255,.9)') +
        '<div class="word-today-ring-text"><b class="num">' + ws.todayTotal + '</b><span>/ ' + ws.goal + '</span></div>' +
      '</div>' +
      '<div class="word-today-peek">' +
        '<span class="wod-label">待学</span>' +
        '<strong class="en">' + esc(nextWord ? nextWord.word : 'lagom') + '</strong>' +
        '<span>' + esc(nextWord ? nextWord.meaning : '刚刚好') + '</span>' +
      '</div>' +
    '</div>';
  }

  function wordDetail(w) {
    var p = store.getWordProgress(w.id);
    var starred = p && p.starred;
    var status = p && p.status;
    var html = '<div class="word-detail">' +
      '<div class="wd-head"><div><h2 class="en">' + esc(w.word) + '</h2><span class="word-phonetic en">' + esc(w.phonetic) + '</span><span class="word-pos">' + esc(w.pos) + '</span></div>' +
        '<div class="wd-head-actions">' + ui.speakBtn(w.word) + '<button class="star-btn' + (starred ? ' active' : '') + '" type="button" data-action="modal-star">' + icon('star') + '</button></div></div>' +
      '<p class="wd-meaning">' + esc(w.meaning) + '</p>' +
      '<div class="wd-example"><p class="en">' + esc(w.example) + '</p><p class="muted">' + esc(w.exampleZh) + '</p></div>' +
      '<div class="wd-tags">' + (w.tags || []).map(function (t) { return ui.tag(t); }).join(' ') + ui.wordStatus(p) + '</div>' +
      '<div class="wd-actions"><span class="small muted">标记状态：</span>' +
        '<button class="btn btn-sm ' + (status === 'known' ? 'btn-accent' : 'btn-soft') + '" type="button" data-action="modal-status" data-status="known">已掌握</button>' +
        '<button class="btn btn-sm ' + (status === 'learning' ? 'btn-accent' : 'btn-soft') + '" type="button" data-action="modal-status" data-status="learning">学习中</button>' +
        '<button class="btn btn-sm ' + (!p || !p.seen ? 'btn-accent' : 'btn-soft') + '" type="button" data-action="modal-status" data-status="new">未学</button>' +
      '</div>' +
    '</div>';
    var modal = CET6.openModal(html, { wide: true });
    if (!modal) return;
    ui.bindSpeak(modal);
    modal.addEventListener('click', function (e) {
      var star = e.target.closest('[data-action="modal-star"]');
      if (star) {
        store.toggleStarWord(w.id);
        modal.querySelector('[data-action="modal-star"]').classList.toggle('active');
        CET6.toast(store.getWordProgress(w.id).starred ? '已标记为生词' : '已取消生词标记');
        return;
      }
      var st = e.target.closest('[data-action="modal-status"]');
      if (st) {
        store.setWordStatus(w.id, st.getAttribute('data-status'));
        if (st.getAttribute('data-status') === 'new') {
          // remove progress so it returns to the new-word pool
          var state = store.getState();
          delete state.wordProgress[w.id];
          store.save();
        }
        CET6.toast('单词状态已更新');
        CET6.closeModal();
        CET6.rerender();
      }
    });
  }

  /* ----------------------------------------------------------
     Words home
     ---------------------------------------------------------- */
  CET6.pages.words = {
    crumb: '背单词 · 词书',
    render: function () {
      var ws = store.getWordStats();
      var logs = ws.logs;
      filterState = { mode: 'all', query: '', limit: 24 };
      return '<div class="page words-page">' +
        ui.demoBanner() +
        ui.pageHead({
          eyebrow: 'VOCABULARY · 背单词',
          title: '一点一点，词汇就长出来了。',
          desc: '翻卡记忆，标出生词与错词。每认识一个词，都是六级路上的一小块砖。',
          actions: '<a class="btn btn-primary" href="#/words/session/today">' + icon('play') + ' 开始今日背词</a>'
        }) +
        '<div class="word-stats">' +
          '<div class="word-stat-card"><span class="stat-label">今日已学</span><b class="num">' + ws.todayTotal + '<em>/' + ws.goal + '</em></b><div class="progress ochre"><i style="width:' + ws.goalPct + '%"></i></div></div>' +
          '<div class="word-stat-card"><span class="stat-label">已掌握</span><b class="num">' + ws.known + '<em>/' + ws.total + '</em></b><span class="stat-foot">' + (ws.total ? Math.round((ws.known / ws.total) * 100) : 0) + '% 词书进度</span></div>' +
          '<div class="word-stat-card"><span class="stat-label">错词</span><b class="num">' + ws.wrong + '<em>个</em></b><a class="stat-link" href="#/words/session/wrong">去复习 ' + icon('arrowRight') + '</a></div>' +
          '<div class="word-stat-card"><span class="stat-label">生词标记</span><b class="num">' + ws.starred + '<em>个</em></b><a class="stat-link" href="#/words/session/star">查看生词 ' + icon('arrowRight') + '</a></div>' +
        '</div>' +
        todayCard(ws) +
        '<section class="section word-record">' +
          '<div class="section-head"><div><span class="eyebrow"><span class="dot"></span> 背诵记录</span><h2>最近 14 天</h2><p>每天学一点，比一次学很多更容易记住。</p></div>' +
          '<div class="head-side"><span class="chip">' + icon('flame') + ' 连续 <b>' + store.getStreak() + '</b> 天</span></div></div>' +
          '<div class="word-record-grid">' +
            '<div class="word-chart-card card"><div class="card-head"><div><span class="eyebrow">每日词量</span><b class="num">' + logs.reduce(function (n, l) { return n + l.total; }, 0) + ' 词 / 14 天</b></div><span class="tag">今 ' + ws.todayTotal + '</span></div>' + wordBars(logs) + '</div>' +
            '<div class="word-goal-card card"><div class="goal-ring">' + CET6.ringSVG(ws.goalPct, 122, 9, 'var(--ochre)') + '<div class="goal-ring-text"><b class="num">' + ws.goalPct + '%</b><span>今日目标</span></div></div>' +
              '<div class="goal-copy"><b>今日 ' + ws.todayTotal + ' / ' + ws.goal + ' 词</b><p>' + (ws.goalPct >= 100 ? '今天的词量完成了，去休息一下。' : '还差 ' + Math.max(0, ws.goal - ws.todayTotal) + ' 个词，慢慢来。') + '</p><a class="btn btn-sm btn-soft" href="#/words/session/today">继续背词 ' + icon('arrowRight') + '</a></div></div>' +
          '</div>' +
        '</section>' +
        '<section class="section">' +
          '<div class="section-head"><div><span class="eyebrow"><span class="dot"></span> 词书</span><h2>' + ws.total + ' 个六级核心词</h2><p>搜索、筛选，或点开任意单词查看例句与状态。</p></div><div class="head-side"><a class="link-arrow" href="#/words/session/new">背新词 ' + icon('arrowRight') + '</a></div></div>' +
          '<div class="word-toolbar"><div class="segmented word-filter">' + FILTERS.map(function (f) {
            return '<button type="button" data-filter="' + f.id + '" class="' + (f.id === 'all' ? 'active' : '') + '">' + f.label + '</button>';
          }).join('') + '</div>' +
          '<div class="search-box word-search">' + icon('search') + '<input class="input" type="search" placeholder="搜索单词或中文释义" data-word-search></div></div>' +
          '<div id="wordList"></div>' +
        '</section>' +
      '</div>';
    },
    mount: function () {
      renderWordList();
      var page = document.querySelector('.words-page');
      if (!page) return;
      page.addEventListener('click', function (e) {
        var filter = e.target.closest('[data-filter]');
        if (filter) {
          filterState.mode = filter.getAttribute('data-filter');
          filterState.limit = 24;
          page.querySelectorAll('.word-filter button').forEach(function (b) { b.classList.toggle('active', b === filter); });
          renderWordList();
          return;
        }
        var more = e.target.closest('[data-action="load-more"]');
        if (more) { filterState.limit += 24; renderWordList(); return; }
        var reset = e.target.closest('[data-action="reset-filter"]');
        if (reset) {
          filterState = { mode: 'all', query: '', limit: 24 };
          page.querySelectorAll('.word-filter button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-filter') === 'all'); });
          var input = page.querySelector('[data-word-search]');
          if (input) input.value = '';
          renderWordList();
          return;
        }
        var star = e.target.closest('[data-action="star-word"]');
        if (star) {
          var wasDemo = store.state.demo;
          var starred = store.toggleStarWord(star.getAttribute('data-id'));
          CET6.toast(starred ? '已标记为生词' : '已取消生词标记');
          if (wasDemo) CET6.rerender();
          else star.classList.toggle('active', starred);
          return;
        }
        var detail = e.target.closest('[data-action="word-detail"]');
        if (detail) {
          var w = data.getWord(detail.getAttribute('data-id'));
          if (w) wordDetail(w);
        }
      });
      var search = page.querySelector('[data-word-search]');
      if (search) {
        var timer = null;
        search.addEventListener('input', function () {
          filterState.query = search.value;
          filterState.limit = 24;
          clearTimeout(timer);
          timer = setTimeout(renderWordList, 140);
        });
      }
      ui.bindSpeak(page);
    },
    cleanup: function () {}
  };

  /* ----------------------------------------------------------
     Focus session
     ---------------------------------------------------------- */
  var deck = [];
  var deckIndex = 0;
  var revealed = false;
  var ratings = { known: 0, fuzzy: 0, unknown: 0 };
  var sessionMode = 'today';
  var finished = false;
  var sessionRoot = null;

  var MODE_LABEL = {
    today: '今日单词',
    new: '新词',
    review: '复习词',
    wrong: '错词复习',
    star: '生词本'
  };

  function buildDeck(mode) {
    sessionMode = mode;
    deckIndex = 0;
    revealed = false;
    ratings = { known: 0, fuzzy: 0, unknown: 0 };
    finished = false;
    var ws = store.getWordStats();
    var size = mode === 'today' ? Math.max(10, ws.goal) : 60;
    deck = store.getWordDeck(mode === 'known' ? 'all' : mode, size);
  }

  function currentWord() { return deck[deckIndex] || null; }

  function sessionTop() {
    var total = deck.length;
    var pct = total ? Math.round((deckIndex / total) * 100) : 0;
    return '<div class="ws-top">' +
      '<a class="back-link" href="#/words">' + icon('arrowLeft') + ' 返回词书</a>' +
      '<div class="ws-progress"><div class="spread small"><span>' + MODE_LABEL[sessionMode] + '</span><span class="num">' + Math.min(deckIndex + 1, total) + ' / ' + total + '</span></div><div class="progress ochre"><i style="width:' + pct + '%"></i></div></div>' +
      '<span class="chip">' + icon('flame') + ' 连续 <b>' + store.getStreak() + '</b> 天</span>' +
    '</div>';
  }

  function sessionCard(w) {
    var p = store.getWordProgress(w.id);
    var starred = p && p.starred;
    var status = ui.wordStatus(p);
    return '<div class="ws-stage">' +
      '<div class="ws-card">' +
        '<div class="ws-card-top"><span class="tag ochre">' + (p && p.seen ? '复习' : '新词') + '</span><div class="ws-card-tools">' + status +
          '<button class="star-btn' + (starred ? ' active' : '') + '" type="button" data-action="session-star" aria-label="标记生词">' + icon('star') + '</button></div></div>' +
        '<div class="ws-word"><h1 class="en">' + esc(w.word) + '</h1>' + ui.speakBtn(w.word, 'speak-lg') + '</div>' +
        '<div class="ws-phonetic"><span class="en">' + esc(w.phonetic) + '</span><span class="word-pos">' + esc(w.pos) + '</span></div>' +
        '<div class="ws-reveal-box' + (revealed ? ' revealed' : '') + '">' +
          (revealed
            ? '<p class="ws-meaning">' + esc(w.meaning) + '</p>' +
              '<div class="ws-example"><p class="en">' + esc(w.example) + '</p><p class="muted">' + esc(w.exampleZh) + '</p></div>' +
              '<div class="ws-tags">' + (w.tags || []).map(function (t) { return ui.tag(t); }).join(' ') + '</div>'
            : '<button class="reveal-btn" type="button" data-action="reveal">' + icon('eye') + ' 想好了，显示释义 <span class="kbd">Space</span></button>') +
        '</div>' +
        '<div class="ws-actions">' +
          '<button class="ws-rate unknown" type="button" data-action="rate" data-rate="unknown"><span>不认识</span><small>再看一遍</small><em class="kbd">1</em></button>' +
          '<button class="ws-rate fuzzy" type="button" data-action="rate" data-rate="fuzzy"><span>有点模糊</span><small>明天再见</small><em class="kbd">2</em></button>' +
          '<button class="ws-rate known" type="button" data-action="rate" data-rate="known"><span>认识</span><small>记下了</small><em class="kbd">3</em></button>' +
        '</div>' +
        '<div class="ws-hint">' + icon('info') + ' 不认识也没关系，它会被收进错词，之后再来。</div>' +
      '</div>' +
      '<aside class="ws-side">' +
        '<div class="ws-side-card"><span class="eyebrow"><span class="dot"></span> 本组进度</span>' +
          '<div class="ws-side-stats"><div><b class="num">' + ratings.known + '</b><span>认识</span></div><div><b class="num">' + ratings.fuzzy + '</b><span>模糊</span></div><div><b class="num">' + ratings.unknown + '</b><span>不认识</span></div></div>' +
          '<div class="ws-side-bar"><i style="width:' + (deck.length ? Math.round((deckIndex / deck.length) * 100) : 0) + '%"></i></div>' +
        '</div>' +
        '<div class="ws-side-card ws-side-quiet"><span class="eyebrow">' + icon('lightbulb') + ' 小提示</span><p>先回想，再看释义。主动回忆一次，比读十遍更有效。</p></div>' +
        '<a class="ws-side-link" href="#/words/session/wrong">' + icon('refresh') + ' 换一组错词复习 ' + icon('arrowRight') + '</a>' +
      '</aside>' +
    '</div>';
  }

  function completeScreen() {
    var total = ratings.known + ratings.fuzzy + ratings.unknown;
    var knownPct = total ? Math.round((ratings.known / total) * 100) : 0;
    return '<div class="ws-complete">' +
      '<div class="ws-complete-art">' + CET6.ringSVG(knownPct, 190, 13, 'var(--accent)') +
        '<div class="ws-complete-ring"><b class="num">' + knownPct + '%</b><span>认识率</span></div>' +
      '</div>' +
      '<span class="eyebrow"><span class="dot"></span> 本组完成</span>' +
      '<h1 class="h1">刚刚好，够了。</h1>' +
      '<p class="lead">这一组记住了 <b>' + ratings.known + '</b> 个，模糊 <b>' + ratings.fuzzy + '</b> 个，不认识 <b>' + ratings.unknown + '</b> 个。模糊和不认识的词，之后会再出现。</p>' +
      '<div class="ws-complete-stats">' +
        '<div><b class="num">' + ratings.known + '</b><span>认识</span></div>' +
        '<div><b class="num">' + ratings.fuzzy + '</b><span>模糊</span></div>' +
        '<div><b class="num">' + ratings.unknown + '</b><span>不认识</span></div>' +
      '</div>' +
      '<div class="ws-complete-actions">' +
        '<button class="btn btn-primary" type="button" data-action="restart-session">' + icon('refresh') + ' 再来一组</button>' +
        '<a class="btn btn-soft" href="#/words">' + icon('bookOpen') + ' 返回词书</a>' +
        '<a class="btn btn-ghost" href="#/stats">' + icon('chart') + ' 查看数据</a>' +
      '</div>' +
    '</div>';
  }

  function renderStage() {
    if (!sessionRoot) return;
    var body = sessionRoot.querySelector('#wsBody');
    if (!body) return;
    if (!deck.length) {
      body.innerHTML = ui.emptyState({
        title: '这一组已经清空了',
        text: sessionMode === 'wrong' ? '目前没有需要复习的错词。去背几个新词吧。' : '换一组单词，或者回到词书继续。',
        action: '<a class="btn btn-primary" href="#/words/session/today">开始今日背词</a>'
      });
      return;
    }
    if (finished) { body.innerHTML = completeScreen(); return; }
    var w = currentWord();
    body.innerHTML = sessionCard(w);
    ui.bindSpeak(body);
  }

  function rate(rating) {
    var w = currentWord();
    if (!w) return;
    store.recordWord(w.id, rating);
    ratings[rating] = (ratings[rating] || 0) + 1;
    deckIndex++;
    revealed = false;
    if (deckIndex >= deck.length) finished = true;
    // update top progress
    var progress = sessionRoot && sessionRoot.querySelector('.ws-progress');
    if (progress) {
      var total = deck.length;
      var pct = total ? Math.round((deckIndex / total) * 100) : 0;
      progress.innerHTML = '<div class="spread small"><span>' + MODE_LABEL[sessionMode] + '</span><span class="num">' + Math.min(deckIndex + 1, total) + ' / ' + total + '</span></div><div class="progress ochre"><i style="width:' + pct + '%"></i></div>';
    }
    renderStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  CET6.pages.wordSession = {
    crumb: '背单词 · 专注模式',
    render: function (ctx) {
      var mode = ctx.param || 'today';
      if (['today', 'new', 'review', 'wrong', 'star'].indexOf(mode) < 0) mode = 'today';
      buildDeck(mode);
      return '<div class="page word-session-page">' + sessionTop() +
        '<div id="wsBody"></div>' +
      '</div>';
    },
    mount: function () {
      sessionRoot = document.querySelector('.word-session-page');
      if (!sessionRoot) return;
      renderStage();
      sessionRoot.addEventListener('click', function (e) {
        var action = e.target.closest('[data-action]');
        if (!action) return;
        var name = action.getAttribute('data-action');
        if (name === 'reveal') { revealed = true; renderStage(); }
        else if (name === 'rate') rate(action.getAttribute('data-rate'));
        else if (name === 'restart-session') { CET6.rerender(); }
        else if (name === 'session-star') {
          var w = currentWord();
          if (w) { var s = store.toggleStarWord(w.id); action.classList.toggle('active', s); CET6.toast(s ? '已标记为生词' : '已取消生词标记'); }
        }
      });
      document.addEventListener('keydown', sessionKey);
    },
    cleanup: function () {
      document.removeEventListener('keydown', sessionKey);
      sessionRoot = null;
      deck = [];
    }
  };

  function sessionKey(e) {
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!revealed) { revealed = true; renderStage(); }
    } else if (e.key === '1') { e.preventDefault(); rate('unknown'); }
    else if (e.key === '2') { e.preventDefault(); rate('fuzzy'); }
    else if (e.key === '3') { e.preventDefault(); rate('known'); }
  }
})();
