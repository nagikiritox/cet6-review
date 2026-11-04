/* ============================================================
   LAGOM CET-6 · pages/imports.js
   Import wizard for local real-exam papers and audio.
   ============================================================ */
(function () {
  'use strict';

  var CET6 = window.CET6;
  var ui = CET6.ui;
  var icon = CET6.icon;
  var esc = CET6.escapeHtml;

  var selectedQuestionFile = null;
  var selectedAudioFiles = [];
  var selectedAnswerFile = null;
  var pending = null;       // { record, errors, warnings, sourceKind }
  var audioMap = {};        // unit.id -> File

  function fileKey(file) {
    return file ? (file.name + '|' + file.size + '|' + (file.lastModified || 0)) : '';
  }

  function readText(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsText(file, 'utf-8');
    });
  }

  function formatSize(n) {
    if (!n) return '';
    if (n < 1024 * 1024) return Math.max(1, Math.round(n / 1024)) + ' KB';
    return (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function fileChips(files, emptyText) {
    if (!files || !files.length) return '<span class="import-file-empty">' + emptyText + '</span>';
    return files.map(function (f) {
      return '<span class="import-file-chip">' + icon('fileText') + '<b>' + esc(f.name) + '</b><small>' + formatSize(f.size) + '</small></span>';
    }).join('');
  }

  function audioUnitRows(record) {
    var rows = [];
    (record.sections || []).forEach(function (section) {
      (section.units || []).forEach(function (unit) {
        if (section.module === 'listening') rows.push({ section: section, unit: unit });
      });
    });
    return rows;
  }

  function renderAudioMapping() {
    var el = document.getElementById('importAudioMapping');
    if (!el || !pending) return;
    var rows = audioUnitRows(pending.record);
    if (!rows.length) {
      el.innerHTML = '<div class="import-audio-empty">' + icon('info') + ' 这套卷没有听力单元，不需要绑定音频。</div>';
      return;
    }
    el.innerHTML = rows.map(function (row) {
      var unit = row.unit;
      var bound = audioMap[unit.id];
      var options = '<option value="">— 不绑定 —</option>' + selectedAudioFiles.map(function (f) {
        return '<option value="' + esc(fileKey(f)) + '"' + (bound && fileKey(bound) === fileKey(f) ? ' selected' : '') + '>' + esc(f.name) + '</option>';
      }).join('');
      return '<div class="import-audio-row">' +
        '<div class="import-audio-main"><b>' + esc(unit.title) + '</b><small>' + (unit.questions || []).length + ' 题 · ' + (unit.audioName ? '题目文件中指定：' + esc(unit.audioName) : '题目文件未指定文件名') + '</small></div>' +
        '<select class="select import-audio-select" data-audio-unit="' + esc(unit.id) + '">' + options + '</select>' +
        '<span class="import-audio-status ' + (bound ? 'ok' : 'missing') + '">' + (bound ? icon('check') + ' 已绑定' : icon('alertCircle') + ' 未绑定') + '</span>' +
      '</div>';
    }).join('');
  }

  function renderPreview() {
    var el = document.getElementById('importPreview');
    if (!el) return;
    if (!pending) {
      el.innerHTML = '<div class="import-preview-placeholder">' + icon('upload') + '<b>还没有解析题目文件</b><p>选择题目文件或粘贴文本后，点击「解析并预览」。</p></div>';
      return;
    }
    var record = pending.record;
    var qCount = (record.sections || []).reduce(function (n, s) {
      return n + (s.units || []).reduce(function (m, u) { return m + (u.questions || []).length; }, 0);
    }, 0);
    var aCount = audioUnitRows(record).length;
    var sections = (record.sections || []).map(function (s, i) {
      var unitCount = (s.units || []).length;
      var sq = (s.units || []).reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
      return '<div class="import-section-row"><span class="import-section-index num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="import-section-main"><b>' + esc(s.title) + '</b><small>' + ui.tag(dataModuleName(s.module)) + ' · ' + unitCount + ' 组材料 · ' + sq + ' 题</small></span>' +
        '<span class="tag ' + (s.module === 'listening' ? 'blue' : s.module === 'reading' ? 'accent' : s.module === 'writing' ? 'clay' : 'ochre') + '">' + Math.round(s.points) + ' 分</span></div>';
    }).join('');
    var issueHtml = '';
    if (pending.sourceKind === 'pdf') {
      issueHtml += '<div class="import-issues warnings"><b>' + icon('fileText') + ' PDF 文本已提取' + (pending.pdfPages ? '（' + pending.pdfPages + ' 页）' : '') + '</b><p>如果题目顺序或选项错乱，可以直接在上方编辑提取出的文字，再点「按编辑文本重新解析」。</p></div>';
    }
    if (pending.errors && pending.errors.length) {
      issueHtml += '<div class="import-issues errors"><b>' + icon('alertCircle') + ' 需要先修正 ' + pending.errors.length + ' 个问题</b><ul>' + pending.errors.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
    }
    if (pending.warnings && pending.warnings.length) {
      issueHtml += '<div class="import-issues warnings"><b>' + icon('info') + ' ' + pending.warnings.length + ' 个提醒（仍可保存）</b><ul>' + pending.warnings.slice(0, 8).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
    }
    if (!selectedAudioFiles.length && aCount) {
      issueHtml += '<div class="import-issues warnings"><b>' + icon('headphones') + ' 还没有选择听力音频</b><p>可以先保存，但听力题将没有声音；建议现在选择对应的 MP3/WAV 文件。</p></div>';
    }
    el.innerHTML = '<div class="import-preview-head"><div><span class="eyebrow"><span class="dot"></span> 预览与校正</span><h2>确认这套真题</h2></div><span class="tag ' + (pending.errors.length ? 'rose' : 'accent') + '">' + (pending.errors.length ? '待修正' : '可保存') + '</span></div>' +
      '<div class="import-meta-grid">' +
        '<label class="field"><span>试卷名称</span><input class="input" data-import-meta="title" value="' + esc(record.title) + '"></label>' +
        '<label class="field"><span>来源 / 年份</span><input class="input" data-import-meta="subtitle" value="' + esc(record.subtitle) + '"></label>' +
        '<label class="field"><span>考试时长（分钟）</span><input class="input" type="number" min="10" max="300" data-import-meta="durationMin" value="' + record.durationMin + '"></label>' +
        '<label class="field"><span>总分</span><input class="input" type="number" min="10" max="1000" data-import-meta="totalPoints" value="' + record.totalPoints + '"></label>' +
      '</div>' +
      '<div class="import-stats"><span><b class="num">' + qCount + '</b> 题</span><span><b class="num">' + record.sections.length + '</b> 个部分</span><span><b class="num">' + aCount + '</b> 段听力</span></div>' +
      issueHtml +
      '<div class="import-section-list">' + sections + '</div>' +
      '<div class="import-sub-head"><div><span class="eyebrow"><span class="dot"></span> 听力绑定</span><h3>把音频放到对应材料</h3></div><button class="btn btn-ghost btn-sm" type="button" data-action="auto-map-audio">' + icon('sparkles') + ' 重新自动匹配</button></div>' +
      '<div id="importAudioMapping"></div>' +
      '<div class="import-preview-actions">' +
        (pending.sourceKind === 'pdf' ? '<button class="btn btn-soft" type="button" data-action="reparse-pdf">' + icon('refresh') + ' 按编辑文本重新解析</button>' : '') +
        '<button class="btn btn-primary btn-lg" type="button" data-action="save-import" ' + (pending.errors.length ? 'disabled' : '') + '>' + icon('check') + ' 保存并加入刷题</button>' +
        '<button class="btn btn-ghost" type="button" data-action="discard-preview">放弃预览</button></div>';
    renderAudioMapping();
  }

  function dataModuleName(module) {
    return CET6.data.moduleName(module);
  }

  function resetPending() {
    pending = null;
    audioMap = {};
    selectedQuestionFile = null;
    selectedAudioFiles = [];
    selectedAnswerFile = null;
    var q = document.getElementById('questionFile');
    var a = document.getElementById('audioFiles');
    var ans = document.getElementById('answerFile');
    if (q) q.value = '';
    if (a) a.value = '';
    if (ans) ans.value = '';
    updateFileInfo();
    renderPreview();
  }

  function updateFileInfo() {
    var qInfo = document.getElementById('questionFileInfo');
    if (qInfo) qInfo.innerHTML = fileChips(selectedQuestionFile ? [selectedQuestionFile] : [], '还没有选择题目文件');
    var aInfo = document.getElementById('audioFilesInfo');
    if (aInfo) aInfo.innerHTML = fileChips(selectedAudioFiles, '还没有选择听力音频');
    var ansInfo = document.getElementById('answerFileInfo');
    if (ansInfo) ansInfo.innerHTML = selectedAnswerFile ? fileChips([selectedAnswerFile], '') : '<span class="import-file-empty">可选：答案单独放在文本文件里时再选择</span>';
  }

  function autoMap() {
    if (!pending) return;
    audioMap = CET6.imports.autoMapAudio(pending.record, selectedAudioFiles);
    renderAudioMapping();
  }

  async function parseCurrent() {
    var text = '';
    var sourceKind = 'text';
    try {
      if (selectedQuestionFile) {
        sourceKind = selectedQuestionFile.name.split('.').pop().toLowerCase();
        if (sourceKind === 'pdf') {
          if (!CET6.pdf) throw new Error('PDF 解析组件未加载，请刷新页面后重试');
          CET6.toast('正在提取 PDF 文本…', 'clock');
          var extracted = await CET6.pdf.extract(selectedQuestionFile);
          if (!extracted.text || extracted.chars < 20) {
            throw new Error('这个 PDF 没有可提取的文字，可能是扫描版。请先 OCR，或把题目文字复制到 TXT 模板再导入。');
          }
          text = extracted.text;
          var ta = document.getElementById('importTextarea');
          if (ta) ta.value = text;
          var result = CET6.pdf.parseExamText(text, { sourceName: selectedQuestionFile.name, title: selectedQuestionFile.name.replace(/\.pdf$/i, '') });
          if (selectedAnswerFile) {
            try {
              var pdfAnswerText = await readText(selectedAnswerFile);
              CET6.imports.applyAnswerKey(result.record, CET6.imports.parseAnswerKey(pdfAnswerText));
              result.errors = result.errors.filter(function (e) { return !/缺少可识别的答案/.test(e); });
            } catch (e) { result.warnings.push('答案文件读取失败：' + e.message); }
          }
          pending = { record: result.record || { title: '', sections: [] }, errors: result.errors || [], warnings: result.warnings || [], sourceKind: 'pdf', pdfPages: extracted.pages };
          if (pending.record && pending.record.id) {
            audioMap = CET6.imports.autoMapAudio(pending.record, selectedAudioFiles);
          }
          updateFileInfo();
          renderPreview();
          var p = document.getElementById('importPreview');
          if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (pending.errors.length) CET6.toast('PDF 已提取，但还有 ' + pending.errors.length + ' 个问题需要修正', 'alertCircle');
          else CET6.toast('PDF 解析完成，请检查预览');
          return;
        }
        text = await readText(selectedQuestionFile);
      } else {
        var ta2 = document.getElementById('importTextarea');
        text = ta2 ? ta2.value : '';
      }
      if (!text.trim()) { CET6.toast('先选择题目文件或粘贴题目文本', 'info'); return; }
      var result;
      if (sourceKind === 'json') {
        var parsed;
        try { parsed = JSON.parse(text); }
        catch (err) { throw new Error('JSON 格式错误：' + err.message); }
        result = CET6.imports.normalizePaper(parsed, { sourceName: selectedQuestionFile ? selectedQuestionFile.name : '粘贴文本' });
      } else {
        result = CET6.imports.parseText(text, { sourceName: selectedQuestionFile ? selectedQuestionFile.name : '粘贴文本' });
      }
      if (selectedAnswerFile) {
        try {
          var answerText = await readText(selectedAnswerFile);
          var answerMap = CET6.imports.parseAnswerKey(answerText);
          CET6.imports.applyAnswerKey(result.record, answerMap);
          // Answer-key merge can fix choice questions; recompute by removing old answer errors and re-normalizing is overkill.
          result.errors = result.errors.filter(function (e) { return !/缺少可识别的答案/.test(e); });
        } catch (e) { result.warnings.push('答案文件读取失败：' + e.message); }
      }
      if (!result.record) {
        pending = { record: { title: '', sections: [] }, errors: result.errors, warnings: result.warnings, sourceKind: sourceKind };
      } else {
        pending = { record: result.record, errors: result.errors, warnings: result.warnings, sourceKind: sourceKind };
        audioMap = CET6.imports.autoMapAudio(result.record, selectedAudioFiles);
      }
      updateFileInfo();
      renderPreview();
      var p2 = document.getElementById('importPreview');
      if (p2) p2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (pending.errors.length) CET6.toast('解析完成，但还有 ' + pending.errors.length + ' 个问题需要修正', 'alertCircle');
      else CET6.toast('解析完成，可以检查后保存');
    } catch (err) {
      pending = null;
      renderPreview();
      CET6.toast(err.message || '解析失败，请检查文件格式', 'alertCircle');
    }
  }

  async function reparsePdfText() {
    var ta = document.getElementById('importTextarea');
    if (!ta || !CET6.pdf) return;
    if (!ta.value.trim()) { CET6.toast('编辑区没有文本可以解析', 'info'); return; }
    try {
      var result = CET6.pdf.parseExamText(ta.value, { sourceName: selectedQuestionFile ? selectedQuestionFile.name : 'PDF 文本' });
      pending = { record: result.record || { title: '', sections: [] }, errors: result.errors || [], warnings: result.warnings || [], sourceKind: 'pdf', pdfPages: pending ? pending.pdfPages : null };
      if (pending.record && pending.record.id) audioMap = CET6.imports.autoMapAudio(pending.record, selectedAudioFiles);
      renderPreview();
      if (!pending.errors.length) CET6.toast('已按编辑后的文本重新解析');
      else CET6.toast('已重新解析，仍有 ' + pending.errors.length + ' 个问题', 'alertCircle');
    } catch (err) {
      CET6.toast(err.message || '重新解析失败', 'alertCircle');
    }
  }

  async function savePending() {
    if (!pending || !pending.record) return;
    if (pending.errors.length) { CET6.toast('还有问题需要修正，暂时不能保存', 'alertCircle'); return; }
    var title = pending.record.title.trim();
    if (!title) { CET6.toast('请填写试卷名称', 'info'); return; }
    try {
      await CET6.imports.save(pending.record, audioMap);
      CET6.toast(CET6.imports.isMemoryOnly() ? '已导入本次会话（浏览器不支持持久存储）' : '真题已导入，可以开始作答');
      pending = null;
      audioMap = {};
      selectedQuestionFile = null;
      selectedAudioFiles = [];
      selectedAnswerFile = null;
      location.hash = '#/practice/imports';
    } catch (err) {
      console.error(err);
      CET6.toast('保存失败：' + (err.message || '浏览器存储空间可能不足'), 'alertCircle');
    }
  }

  function bindDropzone(drop, input, multiple) {
    if (!drop || !input) return;
    ['dragenter', 'dragover'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag-over'); });
    });
    drop.addEventListener('drop', function (e) {
      var files = Array.prototype.slice.call(e.dataTransfer.files || []);
      if (!files.length) return;
      if (multiple) {
        var seen = {};
        selectedAudioFiles.forEach(function (f) { seen[fileKey(f)] = true; });
        files.forEach(function (f) { if (!seen[fileKey(f)]) selectedAudioFiles.push(f); });
      } else {
        selectedQuestionFile = files[0];
      }
      updateFileInfo();
      pending = null;
      renderPreview();
    });
  }

  function existingList() {
    var papers = CET6.imports.list();
    if (!papers.length) return '<div class="import-side-empty">' + icon('fileText') + '<p>还没有导入真题。导入后会显示在这里，也会出现在「刷题 → 导入真题」。</p></div>';
    return papers.map(function (p) {
      var q = CET6.data.paperQuestionCount(p);
      return '<div class="import-side-item"><span class="import-side-ico">' + icon('fileText') + '</span><span class="import-side-main"><b>' + esc(p.title) + '</b><small>' + q + ' 题 · ' + (p.durationMin || 130) + ' 分钟</small></span>' +
        '<button class="icon-btn" type="button" data-action="delete-import" data-id="' + p.id + '" title="删除">' + icon('trash') + '</button></div>';
    }).join('');
  }

  function renderPage() {
    return '<div class="page imports-page">' +
      '<a class="back-link" href="#/practice/imports">' + icon('arrowLeft') + ' 返回导入真题</a>' +
      ui.pageHead({
        eyebrow: 'IMPORT · 导入真题',
        title: '把你手里的真题，放进来。',
        desc: '题目文件与听力音频分开上传，解析后可以检查、校正、绑定音频，再保存成一套可计时、可估分、可进错题本的完整试卷。',
        actions: '<button class="btn btn-soft btn-sm" type="button" data-action="download-template">' + icon('download') + ' JSON 模板</button>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="download-text-template">' + icon('download') + ' TXT 模板</button>'
      }) +
      '<div class="import-notice">' + icon('info') + '<span><b>隐私提示：</b>导入的题目和音频只保存在这台设备的浏览器中，不会上传到 GitHub，也不会自动同步到手机。部署更新不会删除它们，但清理浏览器站点数据会。</span></div>' +
      '<div class="import-layout">' +
        '<div class="import-workbench">' +
          '<section class="import-step card">' +
            '<div class="import-step-head"><span class="import-step-no">01</span><div><span class="eyebrow"><span class="dot"></span> 选择文件</span><h2>题目文件 + 听力音频</h2><p>JSON 最稳；TXT / Markdown 使用页面提供的简单格式。音频可以多选。</p></div></div>' +
            '<div class="import-drop-grid">' +
              '<label class="import-drop" data-drop="question" for="questionFile">' +
                '<input id="questionFile" type="file" accept=".json,.txt,.md,.pdf,application/json,text/plain,text/markdown,application/pdf" hidden>' +
                '<span class="import-drop-ico">' + icon('fileText') + '</span><b>选择题目文件</b><small>PDF / JSON / TXT / MD · 点击或拖入</small><span id="questionFileInfo" class="import-file-list">' + fileChips([], '还没有选择题目文件') + '</span>' +
              '</label>' +
              '<label class="import-drop" data-drop="audio" for="audioFiles">' +
                '<input id="audioFiles" type="file" accept=".mp3,.wav,.m4a,.ogg,.aac,audio/*" multiple hidden>' +
                '<span class="import-drop-ico">' + icon('headphones') + '</span><b>选择听力音频</b><small>MP3 / WAV / M4A · 可以多选</small><span id="audioFilesInfo" class="import-file-list">' + fileChips([], '还没有选择听力音频') + '</span>' +
              '</label>' +
            '</div>' +
            '<div class="import-file-extra"><label class="import-answer-file"><span>' + icon('fileText') + ' 答案文件（可选，答案与题目分开时使用）</span><input id="answerFile" type="file" accept=".txt,.md,text/plain" hidden><button class="btn btn-ghost btn-sm" type="button" data-action="pick-answer">' + icon('upload') + ' 选择答案文本</button><span id="answerFileInfo" class="import-file-list">' + fileChips([], '可选：答案单独放在文本文件里时再选择') + '</span></label></div>' +
            '<div class="import-or"><span>或者直接粘贴题目文本</span></div>' +
            '<textarea id="importTextarea" class="textarea import-textarea" placeholder="粘贴从 PDF / Word 复制出来的题目文本，按模板整理后点击解析。&#10;&#10;如果使用 JSON 文件，可以跳过这里。"></textarea>' +
            '<div class="import-parse-actions"><button class="btn btn-primary" type="button" data-action="parse-import">' + icon('sparkles') + ' 解析并预览</button><span class="small muted">解析只在本地浏览器进行，不会上传服务器。</span></div>' +
          '</section>' +
          '<section id="importPreview" class="import-preview card"></section>' +
        '</div>' +
        '<aside class="import-aside">' +
          '<div class="import-aside-card card">' +
            '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 格式说明</span><h3 class="h3">怎么准备文件</h3></div></div>' +
            '<div class="import-format-list">' +
              '<div><b>PDF（文本型）</b><p>直接从 PDF 提取文字并尝试识别 Part、题目、选项和答案。扫描版 PDF 没有文字层，需要先 OCR。</p></div>' +
              '<div><b>JSON</b><p>推荐的稳定格式。先下载模板，把题目、选项、答案、解析和音频文件名填进去。</p></div>' +
              '<div><b>TXT / Markdown</b><p>使用 <code>## Part</code> 分区、<code>### 材料</code>、<code>1.</code> 题号、<code>A.</code> 选项、<code>答案：</code> 和 <code>解析：</code>。模板里有完整示例。</p></div>' +
              '<div><b>听力音频</b><p>单独上传 MP3/WAV/M4A。文件名与题目里的 <code>audio</code> 一致会自动绑定，也可以在预览里手动选择。</p></div>' +
              '<div><b>解析限制</b><p>PDF 版式千差万别。选词填空和长篇匹配等复杂版式目前可能跳过；扫描件需先 OCR。</p></div>' +
            '</div>' +
            '<details class="import-json-hint"><summary>查看 JSON 结构</summary><pre>{\n  "title": "2025年12月真题",\n  "durationMin": 130,\n  "totalPoints": 710,\n  "sections": [{\n    "title": "Part II Listening",\n    "module": "listening",\n    "points": 248.5,\n    "units": [{\n      "title": "Conversation One",\n      "audio": "01.mp3",\n      "transcript": "...",\n      "questions": [{\n        "stem": "...",\n        "options": ["A", "B", "C", "D"],\n        "answer": 1,\n        "explanation": "...",\n        "tag": "细节题"\n      }]\n    }]\n  }]\n}</pre></details>' +
            '<a class="import-doc-link link-arrow" href="IMPORT_FORMAT.md" target="_blank" rel="noopener">完整格式说明 ' + icon('arrowUpRight') + '</a>' +
          '</div>' +
          '<div class="import-aside-card card">' +
            '<div class="card-head"><div><span class="eyebrow"><span class="dot"></span> 已导入</span><h3 class="h3">' + CET6.imports.count() + ' 套真题</h3></div></div>' +
            '<div class="import-side-list">' + existingList() + '</div>' +
          '</div>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }

  CET6.pages.imports = {
    crumb: '刷题 · 导入真题',
    render: function () {
      return renderPage();
    },
    mount: function () {
      var page = document.querySelector('.imports-page');
      if (!page) return;
      var qInput = document.getElementById('questionFile');
      var aInput = document.getElementById('audioFiles');
      var ansInput = document.getElementById('answerFile');
      if (qInput) qInput.addEventListener('change', function () { selectedQuestionFile = qInput.files[0] || null; pending = null; updateFileInfo(); renderPreview(); });
      if (aInput) aInput.addEventListener('change', function () {
        var seen = {};
        selectedAudioFiles.forEach(function (f) { seen[fileKey(f)] = true; });
        Array.prototype.slice.call(aInput.files || []).forEach(function (f) { if (!seen[fileKey(f)]) selectedAudioFiles.push(f); });
        updateFileInfo();
      });
      if (ansInput) ansInput.addEventListener('change', function () { selectedAnswerFile = ansInput.files[0] || null; updateFileInfo(); });
      bindDropzone(page.querySelector('[data-drop="question"]'), qInput, false);
      bindDropzone(page.querySelector('[data-drop="audio"]'), aInput, true);
      page.addEventListener('click', function (e) {
        if (e.target.closest('[data-action="download-template"]')) { CET6.imports.downloadTemplate('json'); return; }
        if (e.target.closest('[data-action="download-text-template"]')) { CET6.imports.downloadTemplate('txt'); return; }
        if (e.target.closest('[data-action="pick-answer"]')) { if (ansInput) ansInput.click(); return; }
        if (e.target.closest('[data-action="parse-import"]')) { parseCurrent(); return; }
        if (e.target.closest('[data-action="reparse-pdf"]')) { reparsePdfText(); return; }
        if (e.target.closest('[data-action="auto-map-audio"]')) { autoMap(); return; }
        if (e.target.closest('[data-action="discard-preview"]')) { resetPending(); return; }
        if (e.target.closest('[data-action="save-import"]')) { savePending(); return; }
        var del = e.target.closest('[data-action="delete-import"]');
        if (del) {
          var id = del.getAttribute('data-id');
          CET6.confirmDialog({
            title: '删除这套导入真题？',
            message: '题目和听力音频会从本机移除。已产生的练习记录仍保留。',
            confirmText: '删除',
            cancelText: '保留',
            danger: true
          }).then(function (ok) {
            if (!ok) return;
            CET6.imports.remove(id).then(function () { CET6.toast('已删除'); CET6.rerender(); });
          });
        }
      });
      page.addEventListener('input', function (e) {
        var meta = e.target.closest('[data-import-meta]');
        if (meta && pending) {
          var key = meta.getAttribute('data-import-meta');
          var val = key === 'title' || key === 'subtitle' ? meta.value : Number(meta.value);
          pending.record[key] = val;
        }
        var audioSel = e.target.closest('[data-audio-unit]');
        if (audioSel) {
          var unitId = audioSel.getAttribute('data-audio-unit');
          var selectedKey = audioSel.value;
          var file = selectedAudioFiles.find(function (f) { return fileKey(f) === selectedKey; });
          if (file) audioMap[unitId] = file;
          else delete audioMap[unitId];
          renderAudioMapping();
        }
      });
      updateFileInfo();
      renderPreview();
    },
    cleanup: function () {}
  };
})();
