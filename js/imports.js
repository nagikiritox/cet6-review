/* ============================================================
   LAGOM CET-6 · imports.js
   Local import pipeline for real exam papers:
   - IndexedDB persistence (papers + audio blobs)
   - JSON / TXT-Markdown parsing and validation
   - Registration into CET6.data so the normal quiz runner works
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var data = CET6.data;

  var DB_NAME = 'lagom-cet6-imports';
  var DB_VERSION = 1;
  var MODULES = ['listening', 'reading', 'translation', 'writing'];
  var DEFAULT_POINTS = { writing: 106.5, listening: 248.5, reading: 248.5, translation: 106.5 };
  var DEFAULT_MINUTES = { writing: 30, listening: 30, reading: 40, translation: 30 };

  var state = {
    db: null,
    ready: false,
    memoryOnly: false,
    records: [],
    papers: [],
    runtime: [],
    audioBlobs: {},
    audioUrls: {}
  };

  var memory = { papers: [], audio: {} };

  /* ----------------------------------------------------------
     Tiny helpers
     ---------------------------------------------------------- */
  function uid(prefix) {
    return (prefix || 'imp') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function str(v) {
    return v == null ? '' : String(v);
  }

  function num(v, fallback) {
    var n = Number(v);
    return isFinite(n) && n > 0 ? n : fallback;
  }

  function asArray(v) {
    if (Array.isArray(v)) return v;
    return v == null || v === '' ? [] : [v];
  }

  function basename(name) {
    return String(name || '').split(/[\\/]/).pop();
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function moduleKey(value, title) {
    var v = str(value).toLowerCase();
    if (/listen|听力|audio|听/.test(v)) return 'listening';
    if (/translat|翻译/.test(v)) return 'translation';
    if (/writ|写作|作文/.test(v)) return 'writing';
    if (/read|阅读/.test(v)) return 'reading';
    var t = str(title).toLowerCase();
    if (/listening|听力/.test(t)) return 'listening';
    if (/translation|翻译/.test(t)) return 'translation';
    if (/writing|写作/.test(t)) return 'writing';
    return 'reading';
  }

  function moduleName(module) {
    return data.moduleName(module);
  }

  function defaultTag(module) {
    return module === 'listening' ? '细节题' : module === 'reading' ? '细节题' : module === 'translation' ? '文化类' : '议论文';
  }

  function normalizeAnswer(answer, options) {
    if (typeof answer === 'number' && isFinite(answer)) {
      if (answer >= 0 && answer < 4) return answer;
      if (answer >= 1 && answer <= 4) return answer - 1;
      return -1;
    }
    var a = str(answer).trim();
    if (!a) return -1;
    var m = /^([A-Da-d])(?:[\.\)、].*)?$/.exec(a);
    if (m) return m[1].toUpperCase().charCodeAt(0) - 65;
    if (/^[0-3]$/.test(a)) return Number(a);
    // An answer such as "B. text" is handled above; an explicit index "4" is 1-based.
    if (/^4$/.test(a)) return 3;
    if (/^[1-4]$/.test(a)) return Number(a) - 1;
    if (options && options.length) {
      for (var i = 0; i < options.length; i++) {
        if (str(options[i]).trim() === a) return i;
      }
    }
    return -1;
  }

  function normalizeOptions(options) {
    if (!options) return [];
    if (Array.isArray(options)) return options.map(function (o) { return str(o); });
    if (typeof options === 'object') {
      return ['A', 'B', 'C', 'D'].map(function (k) { return str(options[k] || options[k.toLowerCase()] || ''); });
    }
    return [];
  }

  function normalizeTextBlock(v) {
    if (Array.isArray(v)) return v.join('\n\n');
    return str(v);
  }

  function normalizeKeyPoints(v) {
    if (Array.isArray(v)) return v.map(str).filter(Boolean);
    var s = str(v).trim();
    if (!s) return [];
    return s.split(/\r?\n/).map(function (x) { return x.replace(/^[\-\*\d\.\s]+/, '').trim(); }).filter(Boolean);
  }

  function normalizeQuestion(raw, module, index, errors) {
    var q = raw || {};
    var options = normalizeOptions(q.options || q.choices);
    var stem = str(q.stem || q.question || q.text || q.prompt || q.title);
    var reference = normalizeTextBlock(q.reference || q.sample || q.answerText || q.translation);
    var isTask = module === 'writing' || module === 'translation' || (!options.length && !!reference);
    var question = {
      id: '',
      type: isTask ? (module === 'translation' ? 'translation' : 'writing') : 'choice',
      stem: stem || (isTask ? '请完成本题。' : ''),
      options: options,
      answer: -1,
      explanation: str(q.explanation || q.analysis || q.parse || ''),
      tag: str(q.tag || q.typeTag || defaultTag(module)),
      points: num(q.points, 1),
      sourceNumber: q.sourceNumber || q.number || null,
      reference: reference,
      keyPoints: normalizeKeyPoints(q.keyPoints || q.keypoints),
      minWords: num(q.minWords || q.words, module === 'translation' ? 120 : (isTask ? 150 : 0)) || 0
    };
    if (!isTask) {
      if (options.length !== 4) {
        errors.push('第 ' + (index + 1) + ' 题：选择题需要 4 个选项（当前 ' + options.length + ' 个）');
      }
      question.answer = normalizeAnswer(q.answer !== undefined ? q.answer : q.correct, options);
      if (question.answer < 0) errors.push('第 ' + (index + 1) + ' 题：缺少可识别的答案');
    }
    if (!question.stem) errors.push('第 ' + (index + 1) + ' 题：缺少题干');
    return question;
  }

  function normalizeUnits(section, module, errors) {
    var rawUnits = asArray(section.units || section.unit || section.materials);
    if (!rawUnits.length) {
      var qs = asArray(section.questions || section.items || section.question);
      rawUnits = [{
        title: section.unitTitle || section.title || moduleName(module),
        passage: section.passage,
        transcript: section.transcript,
        audio: section.audio || section.audioFile || section.listeningFile,
        instructions: section.instructions,
        prompt: section.prompt,
        reference: section.reference,
        keyPoints: section.keyPoints,
        minWords: section.minWords,
        tags: section.tags,
        difficulty: section.difficulty,
        questions: qs
      }];
    }
    return rawUnits.map(function (rawUnit, ui) {
      var u = rawUnit || {};
      var unitModule = moduleKey(u.module, u.title || section.title) || module;
      // A section usually has one module; keep the section's module for consistency.
      unitModule = module;
      var rawQs = asArray(u.questions || u.items || u.question);
      var isTask = unitModule === 'writing' || unitModule === 'translation';
      if (!rawQs.length && isTask) {
        rawQs = [{
          stem: u.instructions || u.prompt || '请完成本题。',
          reference: u.reference,
          keyPoints: u.keyPoints,
          minWords: u.minWords,
          type: unitModule
        }];
      }
      var questions = rawQs.map(function (q, qi) { return normalizeQuestion(q, unitModule, qi, errors); });
      return {
        id: '',
        title: str(u.title || u.name || section.title || (moduleName(unitModule) + ' ' + (ui + 1))),
        kind: str(u.kind || (unitModule === 'listening' ? 'conversation' : unitModule === 'reading' ? 'passage' : 'task')),
        instructions: str(u.instructions || section.instructions || ''),
        passage: normalizeTextBlock(u.passage || section.passage || ''),
        prompt: normalizeTextBlock(u.prompt || section.prompt || ''),
        transcript: normalizeTextBlock(u.transcript || section.transcript || ''),
        audioName: basename(u.audio || u.audioFile || u.listeningFile || ''),
        audioKey: null,
        tags: asArray(u.tags || section.tags).map(str).filter(Boolean),
        difficulty: num(u.difficulty, 3),
        questions: questions
      };
    });
  }

  function normalizePaper(raw, options) {
    options = options || {};
    var errors = [];
    var warnings = [];
    var root = raw && raw.paper ? raw.paper : raw;
    if (!root || typeof root !== 'object') {
      return { record: null, errors: ['题目文件内容不是有效的 JSON 对象'], warnings: [] };
    }
    var title = str(root.title || root.name || options.title || '未命名真题').trim();
    var totalPoints = num(root.totalPoints || root.points, 710);
    var durationMin = num(root.durationMin || root.duration || root.minutes, 130);
    var rawSections = asArray(root.sections || root.parts || root.modules);
    if (!rawSections.length && asArray(root.questions).length) {
      rawSections = [{
        title: root.sectionTitle || '综合题',
        module: root.module || 'reading',
        questions: root.questions
      }];
    }
    if (!rawSections.length) errors.push('没有找到任何 section / part / 题目分区');
    var recordId = uid('imp');
    var sections = rawSections.map(function (rawSection, si) {
      var s = rawSection || {};
      var module = moduleKey(s.module || s.type, s.title);
      var units = normalizeUnits(s, module, errors);
      var sectionId = recordId + '-s' + (si + 1);
      units.forEach(function (unit, ui) {
        unit.id = recordId + '-u' + (si * 100 + ui + 1);
        unit.questions.forEach(function (q, qi) { q.id = unit.id + '-q' + (qi + 1); });
      });
      var sectionPoints = num(s.points, DEFAULT_POINTS[module] || 100);
      var sectionMinutes = num(s.minutes, DEFAULT_MINUTES[module] || 30);
      var qCount = units.reduce(function (n, u) { return n + u.questions.length; }, 0);
      if (!qCount) errors.push('「' + str(s.title || moduleName(module)) + '」没有题目');
      if (module === 'listening') {
        units.forEach(function (unit) {
          if (!unit.audioName) warnings.push('「' + unit.title + '」未指定听力文件名，可在预览中手动绑定');
          if (!unit.transcript) warnings.push('「' + unit.title + '」没有听力原文，提交后无法查看原文');
        });
      }
      return {
        id: sectionId,
        title: str(s.title || s.name || ('Part ' + (si + 1) + ' · ' + moduleName(module))),
        module: module,
        minutes: sectionMinutes,
        points: sectionPoints,
        units: units
      };
    });
    var record = {
      id: recordId,
      type: 'import',
      title: title,
      subtitle: str(root.subtitle || root.source || options.subtitle || '导入真题'),
      description: str(root.description || '从本地真题文件导入的练习卷。'),
      sourceName: str(options.sourceName || ''),
      createdAt: Date.now(),
      durationMin: durationMin,
      totalPoints: totalPoints,
      difficulty: num(root.difficulty, 3),
      accent: str(root.accent || 'blue'),
      sections: sections
    };
    var qTotal = sections.reduce(function (n, s) {
      return n + s.units.reduce(function (m, u) { return m + u.questions.length; }, 0);
    }, 0);
    if (!qTotal) errors.push('导入文件中没有可用题目');
    return { record: record, errors: errors, warnings: warnings };
  }

  /* ----------------------------------------------------------
     Text / Markdown parser
     Format documented in README + template.
     ---------------------------------------------------------- */
  function parseText(text, options) {
    options = options || {};
    var errors = [];
    var warnings = [];
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    var paper = { title: '', subtitle: options.subtitle || '', durationMin: 130, totalPoints: 710, sections: [] };
    var currentSection = null;
    var currentUnit = null;
    var currentQuestion = null;
    var blockKey = null;
    var blockIndent = 0;
    var blockLines = [];

    function flushBlock() {
      if (!blockKey) return;
      var value = blockLines.join('\n').replace(/^\n+|\n+$/g, '');
      var target = currentUnit || currentSection;
      if (blockKey === 'transcript' || blockKey === 'passage' || blockKey === 'prompt' || blockKey === 'reference' || blockKey === 'instructions') {
        if (target) target[blockKey] = value;
      } else if (blockKey === 'stem' && currentQuestion) {
        currentQuestion.stem = value;
      } else if (blockKey === 'explanation' && currentQuestion) {
        currentQuestion.explanation = value;
      }
      blockKey = null;
      blockLines = [];
    }

    function ensureSection(title) {
      flushBlock();
      currentSection = { title: title || ('Part ' + (paper.sections.length + 1)), module: '', minutes: 0, points: 0, units: [] };
      paper.sections.push(currentSection);
      currentUnit = null;
      currentQuestion = null;
    }

    function ensureUnit(title) {
      if (!currentSection) ensureSection('综合题');
      flushBlock();
      currentUnit = { title: title || ('材料 ' + (currentSection.units.length + 1)), questions: [], tags: [] };
      currentSection.units.push(currentUnit);
      currentQuestion = null;
    }

    function ensureQuestion(stem, sourceNumber) {
      if (!currentUnit) ensureUnit(currentSection ? currentSection.title : '综合题');
      flushBlock();
      currentQuestion = { stem: stem || '', options: [], answer: '', explanation: '', sourceNumber: sourceNumber || null };
      currentUnit.questions.push(currentQuestion);
    }

    for (var i = 0; i < lines.length; i++) {
      var rawLine = lines[i];
      var line = rawLine.trim();
      if (blockKey) {
        var indent = rawLine.match(/^\s*/)[0].length;
        if (!line) { blockLines.push(''); continue; }
        if (indent > blockIndent || /^\s/.test(rawLine)) { blockLines.push(rawLine.replace(/^\s{0,4}/, '')); continue; }
        flushBlock();
      }
      if (!line) continue;

      // Paper title: leading # or a standalone non-metadata first line.
      var h1 = /^#\s+(.+)$/.exec(line);
      if (h1 && !/^##/.test(line)) { paper.title = h1[1].trim(); continue; }
      if (!paper.title && /^LAGOM|^CET-?6\s*真题/i.test(line) === false && !/^@/.test(line) && !/^##/.test(line) && !/^###/.test(line) && !/^\d+[\.、]/.test(line) && !/^Part\s/i.test(line) && paper.sections.length === 0 && !currentSection) {
        paper.title = line;
        continue;
      }

      // Metadata lines.
      var meta = /^@([a-zA-Z][\w-]*)\s*:\s*(.*)$/.exec(line);
      if (meta) {
        var key = meta[1].toLowerCase();
        var val = meta[2].trim();
        if (!currentSection) {
          if (key === 'title') paper.title = val;
          else if (key === 'subtitle' || key === 'source') paper.subtitle = val;
          else if (key === 'duration' || key === 'durationmin' || key === 'minutes') paper.durationMin = num(val, 130);
          else if (key === 'points' || key === 'totalpoints') paper.totalPoints = num(val, 710);
          continue;
        }
        if (!currentUnit && key !== 'module' && key !== 'points' && key !== 'minutes') {
          // Metadata belonging to a section with no unit yet still lands on the section;
          // ensure a unit for text blocks/questions below.
        }
        if (key === 'module') currentSection.module = val;
        else if (key === 'points') currentSection.points = num(val, 0);
        else if (key === 'minutes') currentSection.minutes = num(val, 0);
        else if (key === 'audio') { if (!currentUnit) ensureUnit('Listening'); currentUnit.audio = val; }
        else if (key === 'tag' || key === 'tags') { if (!currentUnit) ensureUnit(); currentUnit.tags = val.split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean); }
        else if (['instructions', 'transcript', 'passage', 'prompt', 'reference'].indexOf(key) >= 0) {
          if (!currentUnit) ensureUnit();
          if (val === '|' || val === '') {
            blockKey = key; blockIndent = 0; blockLines = [];
          } else {
            currentUnit[key] = val;
          }
        } else if (key === 'minwords') {
          if (!currentUnit) ensureUnit();
          currentUnit.minWords = num(val, 0);
        }
        continue;
      }

      // Headings.
      var h3 = /^###\s+(.+)$/.exec(line);
      if (h3) { ensureUnit(h3[1].trim()); continue; }
      var h2 = /^##\s+(.+)$/.exec(line);
      if (h2) {
        var secTitle = h2[1].trim();
        ensureSection(secTitle);
        currentSection.module = moduleKey('', secTitle);
        continue;
      }
      var partLine = /^Part\s+[IVX]+[\.:：]?\s*(.*)$/i.exec(line);
      if (partLine) {
        ensureSection(partLine[1].trim() || line);
        currentSection.module = moduleKey('', line);
        continue;
      }

      // Options and answers.
      var opt = /^([A-Da-d])\s*[\.\)、:：]\s*(.+)$/.exec(line);
      if (opt) {
        if (!currentQuestion) ensureQuestion('');
        currentQuestion.options[opt[1].toUpperCase().charCodeAt(0) - 65] = opt[2].trim();
        continue;
      }
      var ans = /^(?:答案|正确答案|Answer)\s*[:：]\s*(.+)$/i.exec(line);
      if (ans) {
        if (!currentQuestion) ensureQuestion('');
        currentQuestion.answer = ans[1].trim();
        continue;
      }
      var exp = /^(?:解析|答案解析|Explanation)\s*[:：]\s*(.*)$/i.exec(line);
      if (exp) {
        if (!currentQuestion) ensureQuestion('');
        currentQuestion.explanation = exp[1].trim();
        continue;
      }
      var qLine = /^(\d+)\s*[\.、\)]\s*(.+)$/.exec(line);
      if (qLine) {
        ensureQuestion(qLine[2].trim(), Number(qLine[1]));
        continue;
      }

      // Continuation of a question stem or option text.
      if (currentQuestion) {
        if (currentQuestion.options.length && line.length && line.length < 200) {
          // A line after options is usually explanation prose; keep it as explanation.
          currentQuestion.explanation = (currentQuestion.explanation ? currentQuestion.explanation + ' ' : '') + line;
        } else {
          currentQuestion.stem = (currentQuestion.stem ? currentQuestion.stem + ' ' : '') + line;
        }
      }
    }
    flushBlock();

    // Normalize parsed sections into the JSON-compatible shape.
    var normalizedSections = paper.sections.map(function (section, si) {
      var module = moduleKey(section.module, section.title);
      var units = section.units.map(function (unit, ui) {
        var questions = unit.questions.map(function (q) {
          return {
            stem: q.stem,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            sourceNumber: q.sourceNumber,
            reference: unit.reference,
            keyPoints: unit.keyPoints,
            minWords: unit.minWords
          };
        });
        if (!questions.length && (module === 'writing' || module === 'translation')) {
          questions = [{
            stem: unit.prompt || unit.instructions || section.title,
            reference: unit.reference,
            keyPoints: unit.keyPoints,
            minWords: unit.minWords
          }];
        }
        return {
          title: unit.title,
          module: module,
          audio: unit.audio,
          transcript: unit.transcript,
          passage: unit.passage,
          prompt: unit.prompt,
          instructions: unit.instructions,
          reference: unit.reference,
          keyPoints: unit.keyPoints,
          minWords: unit.minWords,
          tags: unit.tags,
          questions: questions
        };
      });
      if (!units.length) {
        units = [{
          title: section.title,
          module: module,
          prompt: section.prompt,
          reference: section.reference,
          questions: []
        }];
      }
      return {
        title: section.title,
        module: module,
        minutes: section.minutes,
        points: section.points,
        units: units
      };
    }).filter(function (section) { return section.units.some(function (u) { return u.questions.length; }) || section.units.length; });

    return normalizePaper({
      title: paper.title,
      subtitle: paper.subtitle,
      durationMin: paper.durationMin,
      totalPoints: paper.totalPoints,
      sections: normalizedSections
    }, options);
  }

  /* ----------------------------------------------------------
     Optional answer-key merging
     ---------------------------------------------------------- */
  function parseAnswerKey(text) {
    var map = {};
    var source = String(text || '').replace(/\r\n?/g, '\n');
    var range = /(\d+)\s*[-–~]\s*(\d+)\s*[:：]?\s*([A-Da-d\s,，]+)/g;
    var m;
    while ((m = range.exec(source))) {
      var start = Number(m[1]);
      var letters = m[3].replace(/[^A-Da-d]/g, '').split('');
      letters.forEach(function (l, i) { map[start + i] = l; });
    }
    var pair = /(\d+)\s*[\.、:：\)]?\s*([A-Da-d])\b/g;
    while ((m = pair.exec(source))) map[Number(m[1])] = m[2];
    return map;
  }

  function applyAnswerKey(record, answerMap) {
    var fallback = 0;
    record.sections.forEach(function (section) {
      section.units.forEach(function (unit) {
        unit.questions.forEach(function (q) {
          var num = q.sourceNumber || (++fallback);
          if (q.sourceNumber) fallback = q.sourceNumber;
          if (q.type === 'choice' && q.answer < 0 && answerMap[num]) q.answer = normalizeAnswer(answerMap[num], q.options);
        });
      });
    });
  }

  /* ----------------------------------------------------------
     IndexedDB persistence
     ---------------------------------------------------------- */
  function openDb() {
    return new Promise(function (resolve) {
      if (!('indexedDB' in window)) {
        state.memoryOnly = true;
        resolve(null);
        return;
      }
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { state.memoryOnly = true; resolve(null); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('papers')) db.createObjectStore('papers', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('audio')) db.createObjectStore('audio', { keyPath: 'key' });
      };
      req.onsuccess = function () { state.db = req.result; resolve(req.result); };
      req.onerror = function () { state.memoryOnly = true; resolve(null); };
      req.onblocked = function () { state.memoryOnly = true; resolve(null); };
    });
  }

  function dbGetAll(storeName) {
    return new Promise(function (resolve, reject) {
      if (!state.db) { resolve([]); return; }
      var tx = state.db.transaction(storeName, 'readonly');
      var req = tx.objectStore(storeName).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function dbPut(storeName, value) {
    return new Promise(function (resolve, reject) {
      if (!state.db) { resolve(); return; }
      var tx = state.db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(value);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error); };
    });
  }

  function dbDelete(storeName, key) {
    return new Promise(function (resolve, reject) {
      if (!state.db) { resolve(); return; }
      var tx = state.db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  }

  /* ----------------------------------------------------------
     Registration into CET6.data
     ---------------------------------------------------------- */
  function audioUrl(key) {
    if (!key) return '';
    if (state.audioUrls[key]) return state.audioUrls[key];
    var blob = state.audioBlobs[key];
    if (!blob) return '';
    try {
      state.audioUrls[key] = URL.createObjectURL(blob);
      return state.audioUrls[key];
    } catch (e) { return ''; }
  }

  function allUnits(record) {
    var out = [];
    (record.sections || []).forEach(function (s) { (s.units || []).forEach(function (u) { out.push(u); }); });
    return out;
  }

  function register(record) {
    if (!record || data.paperById[record.id]) return null;
    var paper = {
      id: record.id,
      type: 'import',
      imported: true,
      title: record.title,
      subtitle: record.subtitle,
      description: record.description,
      sourceName: record.sourceName,
      createdAt: record.createdAt,
      durationMin: record.durationMin,
      totalPoints: record.totalPoints,
      difficulty: record.difficulty,
      accent: record.accent || 'blue',
      sections: []
    };
    var unitIds = [];
    var urls = [];
    (record.sections || []).forEach(function (section) {
      var ids = [];
      (section.units || []).forEach(function (rawUnit) {
        var unit = clone(rawUnit);
        unit.module = section.module;
        if (unit.audioKey) {
          var url = audioUrl(unit.audioKey);
          if (url) { unit.audio = url; urls.push(unit.audioKey); }
        }
        data.unitById[unit.id] = unit;
        if (data.units.indexOf(unit) < 0) data.units.push(unit);
        (unit.questions || []).forEach(function (q) {
          q.unitId = unit.id;
          q.module = unit.module;
          q.unit = unit;
          data.questionById[q.id] = q;
        });
        ids.push(unit.id);
        unitIds.push(unit.id);
      });
      paper.sections.push({
        id: section.id,
        title: section.title,
        module: section.module,
        minutes: section.minutes,
        points: section.points,
        unitIds: ids
      });
    });
    data.paperById[paper.id] = paper;
    data.papers.push(paper);
    state.papers.push(paper);
    state.runtime.push({ record: record, paper: paper, unitIds: unitIds, audioKeys: urls });
    return paper;
  }

  function unregister(paperId) {
    var idx = state.runtime.findIndex(function (r) { return r.record.id === paperId; });
    if (idx < 0) return;
    var rt = state.runtime[idx];
    (rt.unitIds || []).forEach(function (uid) {
      var unit = data.unitById[uid];
      if (unit) {
        (unit.questions || []).forEach(function (q) { delete data.questionById[q.id]; });
        delete data.unitById[uid];
        var ui = data.units.indexOf(unit);
        if (ui >= 0) data.units.splice(ui, 1);
      }
    });
    var pi = data.papers.findIndex(function (p) { return p.id === paperId; });
    if (pi >= 0) data.papers.splice(pi, 1);
    delete data.paperById[paperId];
    var spi = state.papers.findIndex(function (p) { return p.id === paperId; });
    if (spi >= 0) state.papers.splice(spi, 1);
    (rt.audioKeys || []).forEach(function (key) {
      if (state.audioUrls[key]) { try { URL.revokeObjectURL(state.audioUrls[key]); } catch (e) {} delete state.audioUrls[key]; }
      delete state.audioBlobs[key];
    });
    state.runtime.splice(idx, 1);
  }

  /* ----------------------------------------------------------
     Public save / delete / load
     ---------------------------------------------------------- */
  function saveAudioFiles(record, mapping) {
    // mapping: unit.id -> File (or compatible {name,type,blob})
    var audioRecords = [];
    var map = mapping || {};
    var n = 0;
    var keyByFile = {};
    (record.sections || []).forEach(function (section) {
      (section.units || []).forEach(function (unit) {
        var file = map[unit.id];
        if (!file) { unit.audioKey = null; return; }
        var fk = file.name + '|' + file.size + '|' + (file.lastModified || 0);
        var key = keyByFile[fk];
        if (!key) {
          n++;
          key = record.id + '-a' + n;
          keyByFile[fk] = key;
          var blob = file.blob ? file.blob : file;
          audioRecords.push({ key: key, name: file.name || ('audio-' + n), type: file.type || '', size: file.size || (blob && blob.size) || 0, blob: blob });
          state.audioBlobs[key] = blob;
        }
        unit.audioKey = key;
      });
    });
    return audioRecords;
  }

  async function saveImport(record, mapping) {
    if (!record) throw new Error('没有可保存的真题');
    var audioRecords = saveAudioFiles(record, mapping);
    record.updatedAt = Date.now();
    // Persist paper first, then audio blobs.
    await dbPut('papers', record);
    for (var i = 0; i < audioRecords.length; i++) await dbPut('audio', audioRecords[i]);
    if (state.memoryOnly) {
      memory.papers.push(record);
      audioRecords.forEach(function (a) { memory.audio[a.key] = a; });
    }
    state.records.push(record);
    register(record);
    state.ready = true;
    return record;
  }

  async function deleteImport(paperId) {
    var rec = state.records.find(function (r) { return r.id === paperId; });
    if (!rec) return false;
    unregister(paperId);
    await dbDelete('papers', paperId);
    var keys = [];
    (rec.sections || []).forEach(function (s) { (s.units || []).forEach(function (u) { if (u.audioKey) keys.push(u.audioKey); }); });
    for (var i = 0; i < keys.length; i++) await dbDelete('audio', keys[i]);
    state.records = state.records.filter(function (r) { return r.id !== paperId; });
    if (state.memoryOnly) {
      memory.papers = memory.papers.filter(function (r) { return r.id !== paperId; });
      keys.forEach(function (k) { delete memory.audio[k]; });
    }
    return true;
  }

  async function loadAll() {
    if (state.ready) return state;
    await openDb();
    var papers = [];
    var audio = [];
    try {
      if (state.db) {
        papers = await dbGetAll('papers');
        audio = await dbGetAll('audio');
      } else {
        papers = memory.papers.slice();
        audio = Object.keys(memory.audio).map(function (k) { return memory.audio[k]; });
      }
    } catch (e) {
      state.memoryOnly = true;
    }
    audio.forEach(function (a) { state.audioBlobs[a.key] = a.blob; });
    papers.sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
    state.records = papers;
    papers.forEach(register);
    state.ready = true;
    return state;
  }

  function listPapers() {
    return state.papers.slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
  }

  function getRecord(id) {
    return state.records.find(function (r) { return r.id === id; }) || null;
  }

  function count() {
    return state.records.length;
  }

  function isMemoryOnly() { return state.memoryOnly; }

  function downloadBlob(name, content, type) {
    try {
      var blob = new Blob([content], { type: type || 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      return true;
    } catch (e) { return false; }
  }

  function downloadTemplate(format) {
    if (format === 'txt') return downloadBlob('cet6-import-template.txt', templateText(), 'text/plain;charset=utf-8');
    return downloadBlob('cet6-import-template.json', templateJSON(), 'application/json;charset=utf-8');
  }

  function init() {
    return loadAll();
  }

  function getAudioFileForUnit(record, unitId) {
    // Used by the import preview: find the bound File by name/mapping.
    var unit = null;
    allUnits(record).some(function (u) { if (u.id === unitId) { unit = u; return true; } return false; });
    if (!unit) return null;
    return unit.audioName || '';
  }

  function templateJSON() {
    return JSON.stringify({
      title: '2025 年 12 月六级真题（示例）',
      subtitle: '导入示例 · 请替换为你的真题',
      description: '把题目文件按这个结构整理后导入；听力音频在页面中选择对应文件。',
      durationMin: 130,
      totalPoints: 710,
      sections: [
        {
          title: 'Part I Writing',
          module: 'writing',
          minutes: 30,
          points: 106.5,
          units: [{
            title: 'Writing · 议论文',
            instructions: '阅读下面的英文题目，完成一篇 160-200 词的议论文。',
            prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on whether university students should be required to do volunteer work. You should write at least 160 words but no more than 200 words.',
            reference: 'Volunteering should be encouraged, but making it a graduation requirement deserves careful thought. ...',
            keyPoints: ['明确立场', '给出两到三个论据', '收束全文'],
            minWords: 160,
            questions: [{ stem: 'Write an essay on the answer sheet.', reference: 'Volunteering should be encouraged, but...' }]
          }]
        },
        {
          title: 'Part II Listening Comprehension',
          module: 'listening',
          minutes: 30,
          points: 248.5,
          units: [{
            title: 'Conversation One',
            kind: 'conversation',
            audio: '01.mp3',
            transcript: 'M: Good morning. I am here about the library card.\nW: Sure. Have you brought your student card?',
            questions: [
              { stem: 'What is the man going to do?', options: ['Apply for a library card.', 'Return some books.', 'Meet a friend.', 'Attend a lecture.'], answer: 0, explanation: '男士开头说明来意是为借书证而来。', tag: '细节题' },
              { stem: 'What does the woman ask for?', options: ['A passport photo.', 'A student card.', 'A payment receipt.', 'A recommendation letter.'], answer: 1, explanation: '女士询问是否带了学生证。', tag: '细节题' }
            ]
          }]
        },
        {
          title: 'Part III Reading Comprehension',
          module: 'reading',
          minutes: 40,
          points: 248.5,
          units: [{
            title: 'Passage One',
            kind: 'passage',
            passage: 'Replace this with the reading passage text. ...',
            questions: [
              { stem: 'What is the passage mainly about?', options: ['A new library service.', 'The history of a town.', 'A study on reading habits.', 'The cost of higher education.'], answer: 2, explanation: '文章围绕阅读习惯研究展开。', tag: '主旨题' },
              { stem: 'What can be inferred from the passage?', options: ['Reading habits are easy to change.', 'The study has practical implications.', 'Students dislike printed books.', 'The research was inconclusive.'], answer: 1, explanation: '末段指出研究对教学设计有实际启示。', tag: '推断题' }
            ]
          }]
        },
        {
          title: 'Part IV Translation',
          module: 'translation',
          minutes: 30,
          points: 106.5,
          units: [{
            title: 'Translation · 中国文化',
            instructions: '将下面的段落翻译成英文。',
            prompt: '中国的茶文化源远流长。人们不仅把茶当作一种饮品，也把它当作一种生活方式。',
            reference: 'Tea culture in China has a long history. People regard tea not only as a drink but also as a way of life.',
            keyPoints: ['茶文化历史悠久', '茶既是饮品也是生活方式'],
            minWords: 120,
            questions: [{ stem: '请将上面的段落翻译成英文。', reference: 'Tea culture in China has a long history. ...' }]
          }]
        }
      ]
    }, null, 2);
  }

  function templateText() {
    return [
      '# 2025 年 12 月六级真题（文本示例）',
      '@duration: 130',
      '@points: 710',
      '',
      '## Part I Writing',
      '@module: writing',
      '@minutes: 30',
      '@points: 106.5',
      '@instructions: 阅读下面的英文题目，完成一篇 160-200 词的议论文。',
      '@prompt: |',
      '  Directions: For this part, write an essay on whether university students should be required to do volunteer work. You should write at least 160 words but no more than 200 words.',
      '@reference: |',
      '  Volunteering should be encouraged, but making it a graduation requirement deserves careful thought. ...',
      '@minWords: 160',
      '',
      '## Part II Listening Comprehension',
      '@module: listening',
      '@minutes: 30',
      '@points: 248.5',
      '',
      '### Conversation One',
      '@audio: 01.mp3',
      '@transcript: |',
      '  M: Good morning. I am here about the library card.',
      '  W: Sure. Have you brought your student card?',
      '',
      '1. What is the man going to do?',
      'A. Apply for a library card.',
      'B. Return some books.',
      'C. Meet a friend.',
      'D. Attend a lecture.',
      '答案：A',
      '解析：男士开头说明来意是为借书证而来。',
      '',
      '2. What does the woman ask for?',
      'A. A passport photo.',
      'B. A student card.',
      'C. A payment receipt.',
      'D. A recommendation letter.',
      '答案：B',
      '解析：女士询问是否带了学生证。',
      '',
      '## Part III Reading Comprehension',
      '@module: reading',
      '@minutes: 40',
      '@points: 248.5',
      '',
      '### Passage One',
      '@passage: |',
      '  Replace this with the reading passage text. ...',
      '',
      '1. What is the passage mainly about?',
      'A. A new library service.',
      'B. The history of a town.',
      'C. A study on reading habits.',
      'D. The cost of higher education.',
      '答案：C',
      '解析：文章围绕阅读习惯研究展开。',
      '',
      '## Part IV Translation',
      '@module: translation',
      '@minutes: 30',
      '@points: 106.5',
      '@instructions: 将下面的段落翻译成英文。',
      '@prompt: 中国的茶文化源远流长。人们不仅把茶当作一种饮品，也把它当作一种生活方式。',
      '@reference: Tea culture in China has a long history. People regard tea not only as a drink but also as a way of life.',
      '@minWords: 120'
    ].join('\n');
  }

  CET6.imports = {
    init: init,
    loadAll: loadAll,
    list: listPapers,
    count: count,
    getRecord: getRecord,
    getPaper: function (id) { return data.paperById[id] || null; },
    save: saveImport,
    remove: deleteImport,
    normalizePaper: normalizePaper,
    parseText: parseText,
    parseAnswerKey: parseAnswerKey,
    applyAnswerKey: applyAnswerKey,
    normalizeAnswer: normalizeAnswer,
    templateJSON: templateJSON,
    templateText: templateText,
    downloadTemplate: downloadTemplate,
    downloadBlob: downloadBlob,
    autoMapAudio: function (record, files) {
      var listening = [];
      (record.sections || []).forEach(function (s) {
        if (s.module === 'listening') (s.units || []).forEach(function (u) { listening.push(u); });
      });
      var used = {};
      var mapping = {};
      files = files || [];
      if (files.length === 1) {
        listening.forEach(function (unit) { mapping[unit.id] = files[0]; });
        return mapping;
      }
      listening.forEach(function (unit) {
        var wanted = basename(unit.audioName).toLowerCase();
        var exact = files.find(function (f) { return basename(f.name).toLowerCase() === wanted && !used[f.name]; });
        if (exact) { mapping[unit.id] = exact; used[exact.name] = true; }
      });
      listening.forEach(function (unit) {
        if (mapping[unit.id]) return;
        var next = files.find(function (f) { return !used[f.name]; });
        if (next) { mapping[unit.id] = next; used[next.name] = true; }
      });
      return mapping;
    },
    isMemoryOnly: isMemoryOnly,
    _state: state
  };
})();
