/* ============================================================
   LAGOM CET-6 · utils.js
   Global namespace, icons, formatting, data index, UI helpers.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = (window.CET6 = window.CET6 || {});

  /* ----------------------------------------------------------
     Icons (Lucide-style, 24×24 stroke)
     ---------------------------------------------------------- */
  var ICONS = {
    home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    bookOpen: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    flame: '<path d="M12 22c4.4 0 7-2.8 7-6.5 0-2.7-1.4-5-4-7.5-.5 2-1.5 3-2.5 3.5.3-2.8-1-5.5-3.5-7.5.3 3.2-1.7 5-3.3 7C4.2 12.7 5 22 12 22Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    theme: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/><path d="M5 5 19 19" stroke-dasharray="2 4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 15h2M14 15h2"/>',
    headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 14v3a3 3 0 0 1-3 3h-1v-6h4ZM3 14v3a3 3 0 0 0 3 3h1v-6H3Z"/>',
    translate: '<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1"/><path d="m22 22-5-10-5 10M14 18h6"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronLeft: '<path d="m15 6-6 6 6 6"/>',
    check: '<path d="m4 12.5 5 5L20 6.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sparkles: '<path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8Z"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    trendingUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    trendingDown: '<path d="m3 7 6 6 4-4 8 8"/><path d="M21 17h-6v-6"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    alertCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    flag: '<path d="M5 22V4M5 4h12l-2 4 2 4H5"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    barChart: '<path d="M3 3v18h18M7 16v-5M12 16V8M17 16v-8"/>',
    pieChart: '<path d="M21 12A9 9 0 1 1 12 3v9Z"/><path d="M21 12A9 9 0 0 0 12 3"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    quote: '<path d="M10 11H6a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3M20 11h-4a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3"/><path d="M10 11v3a5 5 0 0 1-5 5M20 11v3a5 5 0 0 1-5 5"/>',
    lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z"/>',
    leaf: '<path d="M20 4 9 15"/><path d="M20 4c-9 0-16 4-16 12a5 5 0 0 0 5 5c8 0 11-7 11-17Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
    coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 10h2a3 3 0 0 1 0 6h-2M7 2v2M11 2v2M15 2v2"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    skipForward: '<path d="M5 4l10 8-10 8zM19 5v14"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M8 17h8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    arrowDown: '<path d="M12 5v14M18 13l-6 6-6-6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || ICONS.info;
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (node) {
      node.innerHTML = icon(node.getAttribute('data-icon'));
    });
  }

  /* ----------------------------------------------------------
     Data index
     ---------------------------------------------------------- */
  var data = (CET6.data = {
    units: [],
    unitById: {},
    questionById: {},
    papers: [],
    paperById: {},
    words: [],
    wordById: {}
  });

  function initData() {
    var mock = window.CET6_MOCK_UNITS || [];
    var sets = window.CET6_SET_UNITS || [];
    var drills = window.CET6_DRILL_UNITS || [];
    data.units = [].concat(mock, sets, drills);
    data.papers = [].concat(window.CET6_PAPERS || [], window.CET6_SETS || []);
    data.words = window.CET6_WORDS || [];
    data.drillMeta = window.CET6_DRILL_META || {};

    data.unitById = {};
    data.questionById = {};
    data.paperById = {};
    data.wordById = {};

    function hashString(str) {
      var h = 2166136261;
      for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    }
    function seededRandom(seed) {
      var a = seed >>> 0;
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    // Display-order shuffle: keeps the correct answer mapped, but avoids
    // answer-position patterns (e.g. every set answer being B or C).
    function shuffleOptions(q) {
      if (!Array.isArray(q.options) || q.options.length !== 4) return;
      var order = [0, 1, 2, 3];
      var rnd = seededRandom(hashString(String(q.id)));
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      var original = q.options.slice();
      q.options = order.map(function (idx) { return original[idx]; });
      q.answer = order.indexOf(q.answer);
      q._optionOrder = order;
    }

    data.units.forEach(function (unit) {
      if (!unit || !unit.id) return;
      data.unitById[unit.id] = unit;
      (unit.questions || []).forEach(function (q) {
        if (!q || !q.id) return;
        shuffleOptions(q);
        q.unitId = unit.id;
        q.module = unit.module;
        q.unit = unit;
        data.questionById[q.id] = q;
      });
    });
    data.papers.forEach(function (p) { data.paperById[p.id] = p; });
    data.words.forEach(function (w) { if (w && w.id) data.wordById[w.id] = w; });
  }
  initData();

  data.getUnit = function (id) { return data.unitById[id]; };
  data.getQuestion = function (id) { return data.questionById[id]; };
  data.getPaper = function (id) { return data.paperById[id]; };
  data.getWord = function (id) { return data.wordById[id]; };

  data.getDrillUnits = function (module) {
    return data.units.filter(function (u) { return u.module === module && /^dr-/.test(u.id); });
  };

  data.getUnitsForPaper = function (paper) {
    if (!paper) return [];
    var out = [];
    (paper.sections || []).forEach(function (section) {
      (section.unitIds || []).forEach(function (uid) {
        var unit = data.unitById[uid];
        if (unit) out.push({ unit: unit, section: section });
      });
    });
    return out;
  };

  data.getPaperQuestions = function (paper) {
    var out = [];
    if (!paper) return out;
    (paper.sections || []).forEach(function (section) {
      var units = [];
      (section.unitIds || []).forEach(function (uid) {
        var u = data.unitById[uid];
        if (u) units.push(u);
      });
      var count = units.reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
      var per = count ? (section.points || 0) / count : 0;
      units.forEach(function (unit) {
        (unit.questions || []).forEach(function (q) {
          out.push({ unit: unit, question: q, section: section, points: per });
        });
      });
    });
    return out;
  };

  data.getUnitQuestions = function (units) {
    var out = [];
    (units || []).forEach(function (unit) {
      (unit.questions || []).forEach(function (q) {
        out.push({ unit: unit, question: q, section: null, points: 1 });
      });
    });
    return out;
  };

  data.paperQuestionCount = function (paper) {
    return data.getPaperQuestions(paper).length;
  };

  data.drillQuestionCount = function (module) {
    return data.getDrillUnits(module).reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
  };

  data.modules = ['listening', 'reading', 'translation', 'writing'];

  data.moduleName = function (module) {
    var meta = data.drillMeta[module];
    return meta ? meta.name : ({ listening: '听力', reading: '阅读', translation: '翻译', writing: '写作' }[module] || module);
  };

  data.moduleMeta = function (module) {
    return data.drillMeta[module] || { name: module, short: module, icon: 'grid', accent: 'pine', description: '' };
  };

  /* ----------------------------------------------------------
     Escaping & misc
     ---------------------------------------------------------- */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function nl2br(value) {
    return escapeHtml(value).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function dateKey(date) {
    var d = date instanceof Date ? date : new Date(date);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function todayKey() { return dateKey(new Date()); }

  function startOfDay(date) {
    var d = new Date(date || Date.now());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, n) {
    var d = new Date(date || Date.now());
    d.setDate(d.getDate() + n);
    return d;
  }

  function dayDiff(a, b) {
    return Math.round((startOfDay(a) - startOfDay(b)) / 86400000);
  }

  function fmtDate(ts, withTime) {
    var d = new Date(ts);
    if (isNaN(d)) return '';
    var base = (d.getMonth() + 1) + '月' + d.getDate() + '日';
    return withTime ? base + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : base;
  }

  function fmtDateFull(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }

  function relativeDay(ts) {
    var d = dayDiff(Date.now(), ts);
    if (d <= 0) return '今天';
    if (d === 1) return '昨天';
    if (d === 2) return '前天';
    if (d < 7) return d + ' 天前';
    return fmtDate(ts);
  }

  function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h > 0) return h + ' 小时 ' + m + ' 分';
    if (m > 0) return m + ' 分 ' + s + ' 秒';
    return s + ' 秒';
  }

  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
  }

  function pct(part, total) {
    if (!total) return 0;
    return Math.round((part / total) * 100);
  }

  function wordCount(text) {
    var t = String(text || '').trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  }

  function scoreTone(p) {
    if (p >= 80) return 'good';
    if (p >= 60) return 'mid';
    return 'low';
  }

  function scoreColor(p) {
    if (p >= 80) return 'var(--accent)';
    if (p >= 60) return 'var(--ochre)';
    return 'var(--rose)';
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  function groupBy(arr, fn) {
    return arr.reduce(function (acc, item) {
      var key = fn(item);
      (acc[key] = acc[key] || []).push(item);
      return acc;
    }, {});
  }

  function unique(arr) {
    return arr.filter(function (v, i) { return arr.indexOf(v) === i; });
  }

  function getParam(name, fallback) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.hash);
    return m ? decodeURIComponent(m[1]) : fallback;
  }

  /* ----------------------------------------------------------
     Storage
     ---------------------------------------------------------- */
  function storageGet(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  /* ----------------------------------------------------------
     Speech
     ---------------------------------------------------------- */
  function speak(text, opts) {
    if (!('speechSynthesis' in window)) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'en-US';
      u.rate = (opts && opts.rate) || 0.9;
      u.pitch = 1;
      var voices = window.speechSynthesis.getVoices();
      var preferred = voices.find(function (v) { return /en-US/i.test(v.lang) && /Zira|Samantha|Aria|Jenny|Google US/i.test(v.name); });
      if (preferred) u.voice = preferred;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  /* ----------------------------------------------------------
     UI: toast / modal
     ---------------------------------------------------------- */
  var toastRoot = null;
  function toast(message, iconName) {
    if (!toastRoot) toastRoot = document.getElementById('toastRoot');
    if (!toastRoot) return;
    var node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = icon(iconName || 'checkCircle') + '<span>' + escapeHtml(message) + '</span>';
    toastRoot.appendChild(node);
    setTimeout(function () {
      node.classList.add('leaving');
      setTimeout(function () { node.remove(); }, 260);
    }, 2600);
  }

  function openModal(innerHtml, options) {
    var root = document.getElementById('modalRoot');
    if (!root) return;
    var opts = options || {};
    root.innerHTML = '<div class="modal-overlay" data-modal-overlay><div class="modal ' + (opts.wide ? 'wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><div>' + (opts.title ? '<h3>' + escapeHtml(opts.title) + '</h3>' : '') + (opts.subtitle ? '<p>' + escapeHtml(opts.subtitle) + '</p>' : '') + '</div>' +
      '<button class="modal-close" type="button" data-close-modal aria-label="关闭">' + icon('x') + '</button></div>' +
      (opts.body ? opts.body : innerHtml) + '</div></div>';
    root.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    root.querySelector('[data-modal-overlay]').addEventListener('mousedown', function (e) {
      if (e.target === e.currentTarget && !opts.locked) closeModal();
    });
    document.addEventListener('keydown', escClose);
    document.body.style.overflow = 'hidden';
    var focusEl = root.querySelector('[data-autofocus]');
    if (focusEl) setTimeout(function () { focusEl.focus(); }, 60);
    return root.querySelector('.modal');
  }

  function escClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  function closeModal() {
    var root = document.getElementById('modalRoot');
    if (!root) return;
    root.innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
  }

  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var modal = openModal(
        '<div class="modal-actions">' +
        '<button class="btn btn-soft" type="button" data-cancel>' + escapeHtml(opts.cancelText || '取消') + '</button>' +
        '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" type="button" data-ok data-autofocus>' + escapeHtml(opts.confirmText || '确定') + '</button>' +
        '</div>',
        { title: opts.title || '请确认', subtitle: opts.message || '', body: '' }
      );
      modal.querySelector('[data-cancel]').addEventListener('click', function () { closeModal(); resolve(false); });
      modal.querySelector('[data-ok]').addEventListener('click', function () { closeModal(); resolve(true); });
      modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-close-modal]')) resolve(false);
      });
    });
  }

  function modalHtml(title, bodyHtml, actionsHtml, opts) {
    var root = document.getElementById('modalRoot');
    if (!root) return null;
    root.innerHTML = '<div class="modal-overlay" data-modal-overlay><div class="modal ' + ((opts && opts.wide) ? 'wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><div><h3>' + title + '</h3>' + (opts && opts.subtitle ? '<p>' + opts.subtitle + '</p>' : '') + '</div>' +
      '<button class="modal-close" type="button" data-close-modal aria-label="关闭">' + icon('x') + '</button></div>' +
      bodyHtml + (actionsHtml || '') + '</div></div>';
    root.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    root.querySelector('[data-modal-overlay]').addEventListener('mousedown', function (e) {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', escClose);
    document.body.style.overflow = 'hidden';
    return root.querySelector('.modal');
  }

  /* ----------------------------------------------------------
     SVG helpers
     ---------------------------------------------------------- */
  function ringSVG(percent, size, stroke, color) {
    percent = clamp(Number(percent) || 0, 0, 100);
    size = size || 120;
    stroke = stroke || 9;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var dash = (percent / 100) * c;
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (color || 'var(--accent)') + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + dash + ' ' + c + '"/>' +
      '</svg></div>';
  }

  /* ----------------------------------------------------------
     Theme
     ---------------------------------------------------------- */
  var THEME_KEY = 'lagom-cet6-theme';

  function resolveTheme(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(pref) {
    var value = pref || 'system';
    var resolved = resolveTheme(value);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePref = value;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#101311' : '#f4f2ee');
    document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === value);
    });
    return resolved;
  }
  applyTheme(storageGet(THEME_KEY, 'system'));

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () {
      if (storageGet(THEME_KEY, 'system') === 'system') applyTheme('system');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ----------------------------------------------------------
     Exports
     ---------------------------------------------------------- */
  CET6.icon = icon;
  CET6.hydrateIcons = hydrateIcons;
  CET6.escapeHtml = escapeHtml;
  CET6.nl2br = nl2br;
  CET6.clamp = clamp;
  CET6.pad = pad;
  CET6.dateKey = dateKey;
  CET6.todayKey = todayKey;
  CET6.startOfDay = startOfDay;
  CET6.addDays = addDays;
  CET6.dayDiff = dayDiff;
  CET6.fmtDate = fmtDate;
  CET6.fmtDateFull = fmtDateFull;
  CET6.relativeDay = relativeDay;
  CET6.fmtDuration = fmtDuration;
  CET6.fmtClock = fmtClock;
  CET6.pct = pct;
  CET6.wordCount = wordCount;
  CET6.scoreTone = scoreTone;
  CET6.scoreColor = scoreColor;
  CET6.uid = uid;
  CET6.shuffle = shuffle;
  CET6.groupBy = groupBy;
  CET6.unique = unique;
  CET6.getParam = getParam;
  CET6.storageGet = storageGet;
  CET6.storageSet = storageSet;
  CET6.storageRemove = storageRemove;
  CET6.speak = speak;
  CET6.toast = toast;
  CET6.openModal = openModal;
  CET6.closeModal = closeModal;
  CET6.confirmDialog = confirmDialog;
  CET6.modalHtml = modalHtml;
  CET6.ringSVG = ringSVG;
  CET6.applyTheme = applyTheme;
  CET6.resolveTheme = resolveTheme;
  CET6.THEME_KEY = THEME_KEY;
})();
