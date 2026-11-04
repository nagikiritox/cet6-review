/* ============================================================
   LAGOM CET-6 · pdf-import.js
   PDF text extraction (pdf.js) + a tolerant CET-6 paper parser.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var imports = CET6.imports;

  if (window.pdfjsLib) {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdf.worker.min.js';
    } catch (e) {}
  }

  var MODULE_DEFAULT_POINTS = { writing: 106.5, listening: 248.5, reading: 248.5, translation: 106.5 };
  var MODULE_DEFAULT_MINUTES = { writing: 30, listening: 30, reading: 40, translation: 30 };

  function norm(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }
  function asArray(v) { return Array.isArray(v) ? v : []; }

  function moduleOf(value) {
    var s = String(value || '').toLowerCase();
    if (/writing|写作|作文/.test(s)) return 'writing';
    if (/listening|听力/.test(s)) return 'listening';
    if (/reading|阅读/.test(s)) return 'reading';
    if (/translation|翻译/.test(s)) return 'translation';
    return '';
  }

  function defaultTag(module) {
    return module === 'listening' || module === 'reading' ? '细节题' : module === 'translation' ? '文化类' : '议论文';
  }

  /* ----------------------------------------------------------
     PDF.js text extraction
     ---------------------------------------------------------- */
  function reconstructPage(items) {
    var rows = [];
    (items || []).forEach(function (item) {
      var text = String(item.str || '');
      if (!text.trim()) return;
      var x = item.transform ? item.transform[4] : 0;
      var y = item.transform ? item.transform[5] : 0;
      var h = Math.max(6, item.height || 10);
      var w = item.width || 0;
      var row = null;
      for (var i = 0; i < rows.length; i++) {
        if (Math.abs(rows[i].y - y) <= Math.max(2, h * 0.48)) { row = rows[i]; break; }
      }
      if (!row) { row = { y: y, h: h, items: [] }; rows.push(row); }
      row.items.push({ x: x, w: w, h: h, str: text });
    });
    rows.sort(function (a, b) { return b.y - a.y; });
    return rows.map(function (row) {
      row.items.sort(function (a, b) { return a.x - b.x; });
      var out = '';
      var last = null;
      row.items.forEach(function (it) {
        if (last) {
          var gap = it.x - (last.x + last.w);
          if (gap > Math.max(1.5, it.h * 0.13) && !/^[,.;:!?)\]】]/.test(it.str)) out += ' ';
          else if (gap > Math.max(6, it.h * 0.6)) out += ' ';
        }
        out += it.str;
        last = it;
      });
      return out.replace(/[ \t]+/g, ' ').trim();
    }).filter(Boolean).join('\n');
  }

  function extract(file) {
    return new Promise(function (resolve, reject) {
      if (!window.pdfjsLib) {
        reject(new Error('PDF 解析库未加载，请刷新页面后重试'));
        return;
      }
      if (!file) { reject(new Error('没有选择 PDF 文件')); return; }
      file.arrayBuffer().then(function (buffer) {
        return window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      }).then(function (pdf) {
        var pages = [];
        var chain = Promise.resolve();
        for (var p = 1; p <= pdf.numPages; p++) {
          (function (pageNo) {
            chain = chain.then(function () {
              return pdf.getPage(pageNo).then(function (page) {
                return page.getTextContent();
              }).then(function (content) {
                pages.push(reconstructPage(content.items));
              });
            });
          })(p);
        }
        return chain.then(function () {
          var text = pages.join('\n\n').replace(/\r\n?/g, '\n');
          return { text: text, pages: pdf.numPages, chars: text.replace(/\s/g, '').length };
        });
      }).then(resolve).catch(function (err) {
        reject(new Error('PDF 读取失败：' + (err && err.message ? err.message : '文件可能已加密或损坏')));
      });
    });
  }

  /* ----------------------------------------------------------
     Line-based CET-6 parser
     ---------------------------------------------------------- */
  function cleanLines(text) {
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    lines.forEach(function (line) {
      var l = line.replace(/\s+/g, ' ').trim();
      if (!l) return;
      if (/^\d{1,3}$/.test(l)) return; // page number
      if (/^第\s*\d+\s*页/.test(l)) return;
      if (/^LAGOM/i.test(l)) return;
      out.push(l);
    });
    return out;
  }

  function splitParts(lines) {
    var parts = [];
    var current = null;
    lines.forEach(function (line) {
      var m = /^Part\s*(I{1,3}|IV|V)\b[\.:：]?\s*(.*)$/i.exec(line);
      if (m) {
        if (current) parts.push(current);
        var rest = m[2] || '';
        var module = moduleOf(rest);
        current = { title: line, rest: rest, module: module, lines: [rest] };
        return;
      }
      if (current) current.lines.push(line);
    });
    if (current) parts.push(current);
    // If no Part headings, treat the whole document as one reading part.
    if (!parts.length && lines.length) {
      parts.push({ title: '综合题', rest: '', module: 'reading', lines: lines });
    }
    return parts.filter(function (p) { return p.module; });
  }

  function splitBy(lines, test) {
    var groups = [];
    var current = [];
    lines.forEach(function (line) {
      if (test(line) && current.length) {
        groups.push(current);
        current = [];
      }
      current.push(line);
    });
    if (current.length) groups.push(current);
    return groups;
  }

  function questionNumber(line) {
    var m = /^(\d{1,3})\s*[\.、\)]\s*(.*)$/.exec(line);
    if (!m) return null;
    var rest = m[2];
    // Avoid treating a lone answer-key line like "1.B" as a question.
    if (/^[A-Da-d]\s*$/.test(rest)) return null;
    return { number: Number(m[1]), text: rest };
  }

  function optionLine(line) {
    var m = /^([A-Da-d])\s*[\.、\):：]\s*(.*)$/.exec(line);
    if (!m) return null;
    return { key: m[1].toUpperCase(), text: m[2].trim() };
  }

  function parseInlineOptions(line, question) {
    // Some PDFs put "A) ... B) ... C) ... D) ..." on one line.
    var parts = line.split(/(?=\b[A-D][\)\.、]\s)/);
    if (parts.length < 3) return false;
    var added = false;
    parts.forEach(function (p) {
      var m = /^([A-Da-d])\s*[\.、\):：]\s*(.*)$/.exec(p.trim());
      if (m) {
        question.options[m[1].toUpperCase().charCodeAt(0) - 65] = m[2].trim();
        added = true;
      }
    });
    return added;
  }

  function parseQuestions(lines, module, warnings) {
    var questions = [];
    var current = null;
    lines.forEach(function (line) {
      var qn = questionNumber(line);
      if (qn) {
        if (current && current.options.length >= 2) questions.push(current);
        current = { number: qn.number, stem: qn.text, options: [], answer: '', explanation: '', tag: defaultTag(module) };        return;
      }
      if (!current) return;
      var ans = /^(?:答案|正确答案|Answer)\s*[:：]\s*(.+)$/i.exec(line);
      if (ans) { current.answer = ans[1].trim(); return; }
      var exp = /^(?:解析|答案解析|Explanation)\s*[:：]\s*(.*)$/i.exec(line);
      if (exp) { current.explanation = exp[1].trim(); return; }
      var opt = optionLine(line);
      if (opt) {
        current.options[opt.key.charCodeAt(0) - 65] = opt.text;
        return;
      }
      if (parseInlineOptions(line, current)) return;
      // Continuation text belongs to the question stem if no options yet,
      // otherwise to the most recent option or explanation.
      if (!current.options.length) {
        current.stem += ' ' + line;
      } else if (line.length > 20 && !/^(Directions|Section|Part|Questions)\b/i.test(line)) {
        current.explanation = (current.explanation ? current.explanation + ' ' : '') + line;
      }
    });
    if (current && current.options.length >= 2) questions.push(current);
    return questions.map(function (q) {
      if (q.options.length !== 4) warnings.push('第 ' + q.number + ' 题的选项数量不是 4（解析为 ' + q.options.length + ' 个），已跳过或请手动检查');
      return {
        stem: q.stem,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        tag: q.tag,
        number: q.number,
        sourceNumber: q.number
      };
    }).filter(function (q) { return q.options.length === 4; });
  }

  function taskUnit(part) {
    var body = part.lines.join('\n').trim();
    var prompt = body;
    var directions = '';
    var dirIndex = body.search(/Directions?\s*:/i);
    if (dirIndex >= 0) {
      directions = 'Directions' + body.slice(dirIndex + 10).split(/Directions?\s*:/i)[0];
      prompt = body.slice(dirIndex).replace(/^Directions?\s*:\s*/i, '').trim();
    }
    if (part.module === 'translation') {
      // Translation source is usually the Chinese paragraph after Directions/instructions.
      var cn = body.match(/[\u4e00-\u9fa5][\s\S]*/);
      if (cn && cn[0].length > 20) prompt = cn[0].trim();
    }
    var isTranslation = part.module === 'translation';
    return {
      sectionTitle: part.title,
      module: part.module,
      minutes: MODULE_DEFAULT_MINUTES[part.module],
      points: MODULE_DEFAULT_POINTS[part.module],
      units: [{
        title: isTranslation ? 'Translation · PDF 导入' : 'Writing · PDF 导入',
        instructions: directions || (isTranslation ? '将下面的段落翻译成英文。' : '根据题目完成一篇短文。'),
        prompt: prompt || part.rest || part.title,
        reference: '',
        minWords: isTranslation ? 120 : 150,
        questions: [{
          stem: isTranslation ? '请将上面的段落翻译成英文。' : 'Write an essay based on the directions.',
          reference: '',
          minWords: isTranslation ? 120 : 150
        }]
      }]
    };
  }

  function listeningSections(part, warnings) {
    // Split by Section A/B/C if present; otherwise split by the standard
    // "Questions 1 to 3 are based on ..." direction lines.
    var lines = part.lines;
    var hasSection = lines.some(function (l) { return /^Section\s+[A-C]\b/i.test(l); });
    var groups = [];
    var current = null;
    lines.forEach(function (line) {
      var sectionStart = /^Section\s+[A-C]\b/i.test(line);
      var qDir = /^Questions?\s+\d+\s+(?:to|and)\s+\d+\s+are based on/i.test(line);
      if (sectionStart || (qDir && !hasSection)) {
        if (current && current.lines.length) groups.push(current);
        current = { title: sectionStart ? line : ('Listening ' + (groups.length + 1)), lines: [] };
        current.lines.push(line);
        return;
      }
      if (current) current.lines.push(line);
    });
    if (current && current.lines.length) groups.push(current);
    if (!groups.length) groups = [{ title: 'Listening', lines: lines }];
    return groups.map(function (g, i) {
      var qs = parseQuestions(g.lines, 'listening', warnings);
      if (!qs.length) return null;
      return {
        title: g.title || ('Listening ' + (i + 1)),
        module: 'listening',
        minutes: 0,
        points: 0,
        units: [{
          title: g.title || ('Listening ' + (i + 1)),
          kind: 'conversation',
          instructions: '听音频，选择最合适的答案。',
          transcript: '',
          audio: '',
          tags: ['PDF 导入'],
          questions: qs
        }]
      };
    }).filter(Boolean);
  }

  function splitPassages(lines) {
    var groups = [];
    var current = null;
    lines.forEach(function (line) {
      var heading = /^(Passage|Section)\s+(One|Two|Three|Four|[A-C])\b/i.exec(line);
      if (heading) {
        if (current && current.lines.length) groups.push(current);
        current = { title: line, lines: [] };
        return;
      }
      if (current) current.lines.push(line);
    });
    if (current && current.lines.length) groups.push(current);
    if (!groups.length) groups = [{ title: 'Reading', lines: lines }];
    return groups;
  }

  function readingUnits(part, warnings) {
    var lines = part.lines;
    var hasSections = lines.some(function (l) { return /^Section\s+[A-C]\b/i.test(l); });
    if (hasSections) {
      var sections = splitBy(lines, function (l) { return /^Section\s+[A-C]\b/i.test(l); });
      var units = [];
      sections.forEach(function (sec) {
        if (!sec.length) return;
        var head = sec[0];
        var hasCloze = /^\s*Section\s+A\b/i.test(head);
        var hasMatch = /^\s*Section\s+B\b/i.test(head);
        if (hasCloze || hasMatch) {
          warnings.push('阅读 ' + head + '（选词填空/长篇匹配）版式较复杂，PDF 自动解析暂不导入这一部分；建议单独用 TXT 模板补录。');
          return;
        }
        var passages = splitPassages(sec);
        passages.forEach(function (p) {
          var qs = parseQuestions(p.lines, 'reading', warnings);
          if (!qs.length) return;
          var passageLines = [];
          var seenQ = false;
          p.lines.forEach(function (line) {
            if (questionNumber(line)) { seenQ = true; return; }
            if (!seenQ && !/^Section\b/i.test(line) && !/^Directions?\b/i.test(line)) passageLines.push(line);
          });
          units.push({
            title: p.title || 'Reading Passage',
            module: 'reading',
            minutes: 0,
            points: 0,
            units: [{
              title: p.title || 'Reading Passage',
              kind: 'passage',
              passage: passageLines.join('\n\n'),
              tags: ['PDF 导入'],
              questions: qs
            }]
          });
        });
      });
      if (units.length) return units;
    }
    var passages = splitPassages(lines);
    return passages.map(function (p, i) {
      var qs = parseQuestions(p.lines, 'reading', warnings);
      if (!qs.length) return null;
      var passageLines = [];
      var seenQ = false;
      p.lines.forEach(function (line) {
        if (questionNumber(line)) { seenQ = true; return; }
        if (!seenQ && !/^Directions?\b/i.test(line)) passageLines.push(line);
      });
      return {
        title: p.title || ('Reading ' + (i + 1)),
        module: 'reading',
        minutes: 0,
        points: 0,
        units: [{
          title: p.title || ('Reading ' + (i + 1)),
          kind: 'passage',
          passage: passageLines.join('\n\n'),
          tags: ['PDF 导入'],
          questions: qs
        }]
      };
    }).filter(Boolean);
  }

  function parseExamText(text, options) {
    options = options || {};
    var warnings = [];
    var lines = cleanLines(text);
    if (!lines.length) {
      return { record: null, errors: ['PDF 中没有提取到文字。它可能是扫描版，需要先 OCR 或手动复制题目文本。'], warnings: warnings };
    }
    var parts = splitParts(lines);
    if (!parts.length) {
      return { record: null, errors: ['没有识别到 Part I/II/III/IV 等分区，无法自动解析。请用模板手动整理，或在上方编辑提取文本后重试。'], warnings: warnings };
    }
    var rawSections = [];
    parts.forEach(function (part) {
      if (part.module === 'writing' || part.module === 'translation') {
        var t = taskUnit(part);
        if (t) rawSections.push(t);
      } else if (part.module === 'listening') {
        var ls = listeningSections(part, warnings);
        ls.forEach(function (g) { rawSections.push(g); });
      } else if (part.module === 'reading') {
        var rs = readingUnits(part, warnings);
        rs.forEach(function (g) { rawSections.push(g); });
      }
    });
    if (!rawSections.length) {
      return { record: null, errors: ['PDF 中识别到了分区，但没有解析出可用题目。版式可能较复杂，建议复制文字到 TXT 模板后导入。'], warnings: warnings };
    }
    // Merge groups of the same module into one section so section points
    // (e.g. listening 248.5) are not counted multiple times.
    var mergedSections = [];
    rawSections.forEach(function (section) {
      var existing = mergedSections.find(function (s) { return s.module === section.module; });
      if (existing) {
        existing.units = existing.units.concat(section.units || []);
      } else {
        mergedSections.push({
          title: section.title,
          module: section.module,
          minutes: section.minutes,
          points: section.points,
          units: (section.units || []).slice()
        });
      }
    });
    var normalizedSections = mergedSections.map(function (s) {
      return {
        title: s.title,
        module: s.module,
        minutes: s.minutes || MODULE_DEFAULT_MINUTES[s.module],
        points: s.points || MODULE_DEFAULT_POINTS[s.module],
        units: s.units
      };
    });
    var result = imports.normalizePaper({
      title: options.title || 'PDF 导入真题',
      subtitle: options.subtitle || 'PDF 导入',
      description: '从 PDF 真题文件自动提取的练习卷。',
      durationMin: 130,
      totalPoints: 710,
      sections: normalizedSections
    }, { sourceName: options.sourceName || 'PDF 文件' });
    // Merge an answer key found inside the PDF.
    var answerMap = imports.parseAnswerKey(text);
    if (Object.keys(answerMap).length) {
      imports.applyAnswerKey(result.record, answerMap);
      result.errors = result.errors.filter(function (e) { return !/缺少可识别的答案/.test(e); });
    } else {
      warnings.push('没有在 PDF 中识别到答案。可以在导入页选择「答案文件」，或在 TXT 编辑区补充答案后重新解析。');
    }
    var audioCount = rawSections.filter(function (s) { return s.module === 'listening'; }).length;
    if (audioCount) warnings.push('PDF 通常不包含听力原文；已保留听力题，音频请在上传区选择，原文可在导入后自行补充。');
    return { record: result.record, errors: result.errors, warnings: warnings.concat(result.warnings || []) };
  }

  CET6.pdf = {
    extract: extract,
    parseExamText: parseExamText
  };
})();
