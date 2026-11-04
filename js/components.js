/* ============================================================
   LAGOM CET-6 · components.js
   Shared UI pieces, charts and the custom audio player.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var store = CET6.store;
  var esc = CET6.escapeHtml;
  var icon = CET6.icon;

  var components = (CET6.ui = {});

  /* ----------------------------------------------------------
     Small pieces
     ---------------------------------------------------------- */
  components.demoBanner = function () {
    if (!store.state.demo) return '';
    return '<div class="demo-banner">' + icon('sparkles') +
      '<span><b>示例预览</b> · 下面是你将看到的学习报告。开始任意练习或背词后，示例会自动清除并换成你的真实记录。</span>' +
      '<button class="btn btn-sm btn-soft" type="button" data-action="clear-demo">清除示例</button>' +
      '</div>';
  };

  components.pageHead = function (opts) {
    return '<header class="page-head">' +
      '<div class="page-head-main">' +
      (opts.eyebrow ? '<span class="eyebrow"><span class="dot"></span>' + opts.eyebrow + '</span>' : '') +
      '<h1 class="' + (opts.big ? 'display' : 'h1') + '">' + opts.title + '</h1>' +
      (opts.desc ? '<p class="page-desc">' + opts.desc + '</p>' : '') +
      '</div>' +
      (opts.actions ? '<div class="page-head-actions">' + opts.actions + '</div>' : '') +
      '</header>';
  };

  components.iconBadge = function (name, accent, size) {
    return '<span class="icon-badge accent-' + (accent || 'pine') + (size ? ' ' + size : '') + '">' + icon(name) + '</span>';
  };

  components.statCard = function (opts) {
    return '<div class="stat-card' + (opts.className ? ' ' + opts.className : '') + '">' +
      '<div class="stat-top">' +
      '<span class="stat-label">' + opts.label + '</span>' +
      (opts.icon ? '<span class="stat-ico accent-' + (opts.accent || 'pine') + '">' + icon(opts.icon) + '</span>' : '') +
      '</div>' +
      '<div class="stat-value num">' + opts.value + (opts.unit ? '<em>' + opts.unit + '</em>' : '') + '</div>' +
      (opts.foot ? '<div class="stat-foot">' + opts.foot + '</div>' : '') +
      '</div>';
  };

  components.tag = function (text, tone) {
    return '<span class="tag ' + (tone || '') + '">' + esc(text) + '</span>';
  };

  components.difficulty = function (level) {
    var out = '<span class="difficulty" title="难度 ' + level + '/3">';
    for (var i = 1; i <= 3; i++) out += '<i class="' + (i <= level ? 'on' : '') + '"></i>';
    return out + '</span>';
  };

  components.emptyState = function (opts) {
    return '<div class="empty">' +
      '<div class="empty-art">' + (opts.art || emptyArt()) + '</div>' +
      '<h4>' + (opts.title || '这里还是空的') + '</h4>' +
      '<p>' + (opts.text || '开始练习后，这里会自动长出你的学习记录。') + '</p>' +
      (opts.action || '') +
      '</div>';
  };

  function emptyArt() {
    return '<svg viewBox="0 0 120 100" fill="none" aria-hidden="true">' +
      '<path d="M10 76c18-30 39-44 62-38 14 3 26 15 38 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M10 86c22-22 42-30 60-24 14 5 24 14 34 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".55"/>' +
      '<circle cx="84" cy="28" r="9" fill="currentColor" opacity=".25"/>' +
      '<circle cx="31" cy="30" r="4" fill="currentColor" opacity=".5"/>' +
      '</svg>';
  }

  components.attemptRow = function (a, opts) {
    opts = opts || {};
    var kindLabel = a.kind === 'mock' ? '全真模拟' : a.kind === 'set' ? '套题训练' : a.kind === 'import' ? '导入真题' : a.kind === 'wrong' ? '错题重练' : '专项练习';
    var tone = a.kind === 'mock' ? 'pine' : a.kind === 'set' ? 'blue' : a.kind === 'import' ? 'ochre' : a.module === 'listening' ? 'blue' : a.module === 'reading' ? 'accent' : a.module === 'writing' ? 'clay' : 'ochre';
    var href = '#/result/' + a.id;
    var score = (a.kind === 'mock' || a.kind === 'import') ? Math.round(a.earned) + ' / ' + Math.round(a.totalPoints || 710) : a.scorePct + '%';
    return '<a class="attempt-row" href="' + href + '">' +
      '<span class="attempt-ico accent-' + tone + '">' + icon(a.kind === 'drill' ? (CET6.data.moduleMeta(a.module).icon || 'sparkles') : a.kind === 'wrong' ? 'refresh' : a.kind === 'import' ? 'upload' : 'fileText') + '</span>' +
      '<span class="attempt-main">' +
      '<span class="attempt-title">' + esc(a.title) + (a.demo ? ' <span class="tag">示例</span>' : '') + '</span>' +
      '<span class="attempt-meta">' + kindLabel + ' · ' + CET6.relativeDay(a.finishedAt) + ' · 正确率 ' + a.accuracy + '%</span>' +
      '</span>' +
      '<span class="attempt-score num ' + CET6.scoreTone(a.scorePct) + '">' + score + '</span>' +
      '<span class="attempt-arrow">' + icon('chevronRight') + '</span>' +
      '</a>';
  };

  components.scoreBadge = function (pct, label) {
    return '<span class="score-badge ' + CET6.scoreTone(pct) + '"><b class="num">' + pct + '</b><small>%</small>' + (label ? '<em>' + label + '</em>' : '') + '</span>';
  };

  components.moduleIcon = function (module) {
    var meta = CET6.data.moduleMeta(module);
    return '<span class="module-icon accent-' + (meta.accent || 'pine') + '">' + icon(meta.icon || 'grid') + '</span>';
  };

  /* ----------------------------------------------------------
     Audio player
     ---------------------------------------------------------- */
  var audioBindings = [];

  components.audioPlayer = function (src, title) {
    return '<div class="audio-card" data-audio-card data-src="' + esc(src) + '">' +
      '<button class="audio-play" type="button" data-audio-toggle aria-label="播放听力音频">' + icon('play') + '</button>' +
      '<div class="audio-body">' +
      '<div class="audio-meta"><span class="audio-title">' + icon('headphones') + ' ' + esc(title || '听力音频') + '</span><span class="audio-time" data-audio-current>00:00</span></div>' +
      '<div class="audio-track" data-audio-track role="slider" tabindex="0" aria-label="音频进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i data-audio-fill></i></div>' +
      '</div>' +
      '<div class="audio-actions">' +
      '<span class="audio-time" data-audio-duration>--:--</span>' +
      '<button class="audio-btn" type="button" data-audio-replay aria-label="重新播放">' + icon('rotate') + '</button>' +
      '</div>' +
      '<audio preload="metadata" src="' + esc(src) + '"></audio>' +
      '</div>';
  };

  components.mountAudio = function (root) {
    components.stopAudio();
    var cards = (root || document).querySelectorAll('[data-audio-card]');
    cards.forEach(function (card) {
      var audio = card.querySelector('audio');
      if (!audio) return;
      var toggle = card.querySelector('[data-audio-toggle]');
      var fill = card.querySelector('[data-audio-fill]');
      var current = card.querySelector('[data-audio-current]');
      var duration = card.querySelector('[data-audio-duration]');
      var track = card.querySelector('[data-audio-track]');

      function setIcon(playing) {
        toggle.innerHTML = icon(playing ? 'pause' : 'play');
        toggle.setAttribute('aria-label', playing ? '暂停听力音频' : '播放听力音频');
        card.classList.toggle('playing', playing);
      }
      function update() {
        var dur = isFinite(audio.duration) ? audio.duration : 0;
        var cur = audio.currentTime || 0;
        if (fill) fill.style.width = (dur ? (cur / dur) * 100 : 0) + '%';
        if (current) current.textContent = CET6.fmtClock(cur);
        if (duration) duration.textContent = dur ? CET6.fmtClock(dur) : '--:--';
        if (track && dur) track.setAttribute('aria-valuenow', String(Math.round((cur / dur) * 100)));
      }
      function play() {
        components.stopAudio();
        var p = audio.play();
        if (p && p.catch) p.catch(function () {
          CET6.toast('音频暂时无法播放，请检查文件是否生成', 'alertCircle');
          setIcon(false);
        });
        setIcon(true);
      }
      toggle.addEventListener('click', function () {
        if (audio.paused) play(); else { audio.pause(); setIcon(false); }
      });
      var replay = card.querySelector('[data-audio-replay]');
      if (replay) replay.addEventListener('click', function () { audio.currentTime = 0; play(); });
      audio.addEventListener('timeupdate', update);
      audio.addEventListener('loadedmetadata', update);
      audio.addEventListener('ended', function () { setIcon(false); update(); });
      audio.addEventListener('pause', function () { setIcon(false); });
      audio.addEventListener('play', function () { setIcon(true); });
      audio.addEventListener('error', function () {
        card.classList.add('audio-error');
        var meta = card.querySelector('.audio-title');
        if (meta) meta.innerHTML = icon('alertCircle') + ' 音频文件缺失';
        if (duration) duration.textContent = '--:--';
      });
      if (track) {
        track.addEventListener('click', function (e) {
          if (!isFinite(audio.duration)) return;
          var rect = track.getBoundingClientRect();
          audio.currentTime = CET6.clamp((e.clientX - rect.left) / rect.width, 0, 1) * audio.duration;
          update();
        });
        track.addEventListener('keydown', function (e) {
          if (!isFinite(audio.duration)) return;
          if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); update(); }
          if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); update(); }
        });
      }
      audioBindings.push({ card: card, audio: audio, setIcon: setIcon });
    });
  };

  components.stopAudio = function () {
    audioBindings.forEach(function (b) {
      try { b.audio.pause(); b.setIcon(false); } catch (e) {}
    });
    audioBindings = [];
    if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  };

  /* ----------------------------------------------------------
     Charts
     ---------------------------------------------------------- */
  components.lineChart = function (points, opts) {
    opts = opts || {};
    if (!points || !points.length) {
      return components.emptyState({ title: '还没有分数轨迹', text: '完成一套全真模拟、套题训练或导入真题，这里会画出你的分数变化。', action: '<a class="btn btn-sm btn-soft" href="#/practice/mock">去刷一套</a>' });
    }
    var W = 720, H = 260;
    var padL = 42, padR = 20, padT = 22, padB = 40;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var n = points.length;
    var coords = points.map(function (p, i) {
      var x = n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW;
      var y = padT + (1 - CET6.clamp(p.scorePct, 0, 100) / 100) * plotH;
      return { x: x, y: y, p: p };
    });
    var line = coords.map(function (c, i) { return (i ? 'L' : 'M') + c.x.toFixed(1) + ' ' + c.y.toFixed(1); }).join(' ');
    var area = line + ' L' + coords[coords.length - 1].x.toFixed(1) + ' ' + (padT + plotH) + ' L' + coords[0].x.toFixed(1) + ' ' + (padT + plotH) + ' Z';
    var gid = 'grad-' + Math.random().toString(36).slice(2, 8);

    var grid = '';
    [0, 25, 50, 75, 100].forEach(function (v) {
      var y = padT + (1 - v / 100) * plotH;
      grid += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--line)" stroke-width="1" stroke-dasharray="' + (v === 0 ? '0' : '3 6') + '"/>' +
        '<text x="' + (padL - 12) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10.5" fill="var(--faint)" font-family="var(--font-en)">' + v + '</text>';
    });

    var dots = coords.map(function (c) {
      return '<g class="chart-point">' +
        '<circle cx="' + c.x + '" cy="' + c.y + '" r="9" fill="var(--surface)" stroke="none" opacity="0"/>' +
        '<circle cx="' + c.x + '" cy="' + c.y + '" r="4.5" fill="var(--surface)" stroke="' + (c.p.kind === 'mock' ? 'var(--accent)' : c.p.kind === 'import' ? 'var(--ochre)' : 'var(--blue)') + '" stroke-width="2.4"/>' +
        '<title>' + esc(c.p.title + ' · ' + c.p.scorePct + '%') + '</title>' +
        '</g>';
    }).join('');

    var labels = '';
    var idxs = n > 4 ? [0, Math.round((n - 1) / 2), n - 1] : coords.map(function (_, i) { return i; });
    idxs.forEach(function (i) {
      var c = coords[i];
      labels += '<text x="' + c.x + '" y="' + (H - 14) + '" text-anchor="' + (i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle') + '" font-size="10.5" fill="var(--faint)" font-family="var(--font-sans)">' + CET6.fmtDate(c.p.date) + '</text>';
    });

    return '<div class="chart-wrap">' +
      '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="分数变化趋势">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".18"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#' + gid + ')"/>' +
      '<path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots + labels +
      '</svg>' +
      '<div class="chart-legend"><span><i class="dot accent"></i>全真模拟</span><span><i class="dot blue"></i>套题训练</span><span><i class="dot ochre"></i>导入真题</span><span class="chart-note">纵轴为得分率 %</span></div>' +
      '</div>';
  };

  components.moduleBars = function (stats) {
    var list = ['listening', 'reading', 'translation', 'writing'].map(function (m) {
      var s = stats[m] || { accuracy: 0, total: 0 };
      var meta = CET6.data.moduleMeta(m);
      return '<div class="module-bar-row">' +
        '<span class="module-bar-name">' + icon(meta.icon) + ' ' + meta.name + '<em>' + s.total + ' 题</em></span>' +
        '<span class="module-bar-track"><i class="accent-' + (meta.accent || 'pine') + '" style="width:' + (s.total ? s.accuracy : 0) + '%"></i></span>' +
        '<span class="module-bar-pct num">' + (s.total ? s.accuracy + '%' : '—') + '</span>' +
        '</div>';
    }).join('');
    return '<div class="module-bars">' + list + '</div>';
  };

  components.radarChart = function (tagStats) {
    var tags = ['主旨题', '细节题', '推断题', '词义题', '态度题'];
    var map = {};
    (tagStats || []).forEach(function (t) { map[t.tag] = t; });
    var values = tags.map(function (t) { return map[t] ? map[t].accuracy : 0; });
    var total = (tagStats || []).reduce(function (n, t) {
      return n + (tags.indexOf(t.tag) >= 0 ? t.total : 0);
    }, 0);
    if (!total) return components.emptyState({ title: '还没有题型数据', text: '完成一些听力与阅读练习后，会生成题型强弱雷达。' });
    var size = 300, cx = size / 2, cy = size / 2 + 2, R = 92;
    function pt(i, v) {
      var angle = -Math.PI / 2 + (i / tags.length) * Math.PI * 2;
      return [cx + Math.cos(angle) * R * (v / 100), cy + Math.sin(angle) * R * (v / 100)];
    }
    var grid = '';
    [25, 50, 75, 100].forEach(function (level) {
      var pts = tags.map(function (_, i) { return pt(i, level).map(function (n) { return n.toFixed(1); }).join(','); }).join(' ');
      grid += '<polygon points="' + pts + '" fill="none" stroke="var(--line)" stroke-width="1"/>';
    });
    tags.forEach(function (_, i) {
      var p = pt(i, 100);
      grid += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="var(--line)" stroke-width="1"/>';
      var lp = pt(i, 128);
      var anchor = lp[0] < cx - 4 ? 'end' : lp[0] > cx + 4 ? 'start' : 'middle';
      grid += '<text x="' + lp[0] + '" y="' + (lp[1] + 4) + '" text-anchor="' + anchor + '" font-size="11" fill="var(--muted)" font-family="var(--font-sans)">' + tags[i] + '</text>';
    });
    var poly = tags.map(function (_, i) { return pt(i, values[i]).map(function (n) { return n.toFixed(1); }).join(','); }).join(' ');
    var dots = tags.map(function (_, i) {
      var p = pt(i, values[i]);
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="var(--accent)"><title>' + tags[i] + ' ' + values[i] + '%</title></circle>';
    }).join('');
    return '<div class="radar-wrap"><svg viewBox="0 0 ' + size + ' ' + size + '" class="radar-svg" role="img" aria-label="题型强弱雷达图">' +
      grid + '<polygon points="' + poly + '" fill="color-mix(in srgb, var(--accent) 18%, transparent)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>' + dots +
      '</svg></div>';
  };

  components.donut = function (items, centerLabel) {
    var valid = (items || []).filter(function (i) { return i.value > 0; });
    var total = valid.reduce(function (n, i) { return n + i.value; }, 0);
    if (!total) return components.emptyState({ title: '还没有错题', text: '继续保持。做错的题会自动收进这里。' });
    var size = 150, stroke = 17, r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var offset = 0;
    var segs = valid.map(function (item, i) {
      var frac = item.value / total;
      var dash = frac * c;
      var color = item.color || ['var(--accent)', 'var(--blue)', 'var(--ochre)', 'var(--clay)', 'var(--rose)'][i % 5];
      var seg = '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-dasharray="' + Math.max(0, dash - 2) + ' ' + (c - dash + 2) + '" stroke-dashoffset="' + (-offset) + '" stroke-linecap="round"><title>' + esc(item.label) + ' ' + item.value + '</title></circle>';
      offset += dash;
      return seg;
    }).join('');
    var legend = valid.map(function (item, i) {
      var color = item.color || ['var(--accent)', 'var(--blue)', 'var(--ochre)', 'var(--clay)', 'var(--rose)'][i % 5];
      return '<li><i style="background:' + color + '"></i><span>' + esc(item.label) + '</span><b class="num">' + item.value + '</b></li>';
    }).join('');
    return '<div class="donut-flex"><div class="donut-svg">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="' + stroke + '"/>' + segs + '</svg>' +
      '<div class="donut-center"><b class="num">' + total + '</b><small>' + (centerLabel || '错题') + '</small></div>' +
      '</div><ul class="donut-legend">' + legend + '</ul></div>';
  };

  components.heatmap = function (activity, days) {
    days = days || 84;
    var dates = Object.keys(activity).sort();
    if (!dates.length) return '';
    var active = dates.filter(function (k) { return activity[k].total > 0; }).length;
    var total = dates.reduce(function (n, k) { return n + activity[k].total; }, 0);
    var max = Math.max.apply(null, dates.map(function (k) { return activity[k].total; }).concat([1]));
    var cells = dates.map(function (key) {
      var v = activity[key].total;
      var level = v === 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4));
      return '<span class="heat-cell lv' + level + '" title="' + key + ' · ' + v + ' 项学习"><i></i></span>';
    }).join('');
    return '<div class="heatmap-wrap">' +
      '<div class="heatmap">' + cells + '</div>' +
      '<div class="heatmap-foot"><span>' + active + ' 天有学习 · 共 ' + total + ' 项</span><span class="heatmap-legend">少 <i class="heat-cell lv1"></i><i class="heat-cell lv2"></i><i class="heat-cell lv3"></i><i class="heat-cell lv4"></i> 多</span></div>' +
      '</div>';
  };

  /* ----------------------------------------------------------
     Word helpers
     ---------------------------------------------------------- */
  components.wordStatus = function (p) {
    if (!p || !p.seen) return '<span class="tag outline">未学</span>';
    if (p.status === 'known') return '<span class="tag accent">已掌握</span>';
    if (p.wrong > 0) return '<span class="tag rose">错词</span>';
    return '<span class="tag ochre">学习中</span>';
  };

  components.speakBtn = function (text, cls) {
    return '<button class="icon-btn speak-btn' + (cls ? ' ' + cls : '') + '" type="button" data-speak="' + esc(text) + '" aria-label="朗读 ' + esc(text) + '">' + icon('volume') + '</button>';
  };

  components.bindSpeak = function (root) {
    (root || document).querySelectorAll('[data-speak]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        CET6.speak(btn.getAttribute('data-speak'));
      });
    });
  };

  /* ----------------------------------------------------------
     Mini progress ring markup
     ---------------------------------------------------------- */
  components.ringCard = function (pct, label, size, color) {
    return '<div class="ring-inline">' + CET6.ringSVG(pct, size || 74, 7, color) +
      '<div class="ring-inline-text"><b class="num">' + pct + '%</b><span>' + label + '</span></div></div>';
  };

})();
