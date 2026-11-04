# LAGOM CET-6 · 导入真题格式说明

网站支持把本地真题导入为可作答的套卷。导入内容保存在浏览器 `IndexedDB`，不会上传到 GitHub。

入口：**刷题 → 导入真题 → 导入新的真题**（`#/imports`）。

支持的题目文件：

| 格式 | 说明 |
|---|---|
| `.json` | 推荐，结构稳定，可一次导入整套卷 |
| `.txt` / `.md` | 适合从 PDF / Word 复制文本后按下方简单格式整理 |
| 听力音频 | `.mp3` / `.wav` / `.m4a` / `.ogg` / `.aac`，可多选 |
| 答案文件（可选） | 答案与题目分开时，上传含 `1.B 2.C` 或 `1-5 BCDAB` 的文本 |

> PDF / Word 不直接解析。请先在阅读器里复制文字保存为 TXT，或使用导入页的 TXT 模板；扫描版 PDF 需手动录入。

---

## 一、JSON 格式

下载入口：导入页 → `JSON 模板`。

最小结构：

```json
{
  "title": "2025年12月六级真题",
  "subtitle": "2025.12 · 导入",
  "durationMin": 130,
  "totalPoints": 710,
  "sections": [
    {
      "title": "Part II Listening Comprehension",
      "module": "listening",
      "minutes": 30,
      "points": 248.5,
      "units": [
        {
          "title": "Conversation One",
          "audio": "01.mp3",
          "transcript": "M: ...\nW: ...",
          "questions": [
            {
              "stem": "What does the man want?",
              "options": ["A ...", "B ...", "C ...", "D ..."],
              "answer": 1,
              "explanation": "中文解析",
              "tag": "细节题"
            }
          ]
        }
      ]
    }
  ]
}
```

### 字段说明

- `module`：`listening` / `reading` / `translation` / `writing`。
- `sections[].units[]`：阅读文章放 `passage`，听力原文放 `transcript`，写作/翻译题干放 `prompt`，参考译文/范文放 `reference`。
- `sections[].units[].questions[]`：
  - 选择题：`options` 四个选项，`answer` 使用 **0-3** 索引（也接受 `"A"`/`"B"`），`tag` 建议用 `主旨题`、`细节题`、`推断题`、`词义题`、`态度题`。
  - 写作/翻译：可以没有 `options`，提供 `reference`、`keyPoints`、`minWords` 即可。
- `audio`：填音频文件名（如 `01.mp3`）。上传音频后会自动按文件名匹配，也可以在预览中手动改选。
- 如果题目文件里没有答案，可把答案单独放在文本文件里，导入时选择「答案文件」。
- `durationMin` 默认 130；`totalPoints` 默认 710。导入卷的估分、分项得分和趋势都会使用这些值。

---

## 二、TXT / Markdown 格式

下载入口：导入页 → `TXT 模板`。

```text
# 2025年12月六级真题

@duration: 130
@points: 710

## Part I Writing
@module: writing
@minutes: 30
@points: 106.5
@instructions: 阅读下面的题目，完成一篇作文。
@prompt: |
  Directions: ...
@reference: |
  ...
@minWords: 160

## Part II Listening Comprehension
@module: listening
@minutes: 30
@points: 248.5

### Conversation One
@audio: 01.mp3
@transcript: |
  M: ...
  W: ...

1. What does the man want?
A. ...
B. ...
C. ...
D. ...
答案：B
解析：中文解析
```

规则：

- `#`：试卷标题。
- `@key: value`：试卷或当前分区的属性；`@transcript: |`、`@passage: |`、`@prompt: |`、`@reference: |` 使用缩进的多行块。
- `##` 或 `Part I ...`：新的部分。`@module` 决定题型。
- `###`：听力/阅读材料。
- `1.`：题目；`A.` / `B.` / `C.` / `D.`：选项。
- `答案：B` / `Answer: B`：答案；`解析：...`：解析。
- 答案文件支持 `1.B 2.C`、`1-5 BCDAB`。

---

## 三、导入后的行为

- 导入卷出现在 **刷题 → 导入真题**，可像内置卷一样计时、答题卡跳题、交卷、估分、自评。
- 导入卷的记录会进入我的数据：分数趋势、题型强弱、错题本、练习记录。
- 删除导入卷会移除题目与音频，但历史作答记录仍会保留（报告中的题目可能无法再打开）。
- 导入内容只存在于当前浏览器；换设备需要重新导入。GitHub Pages 更新不会清空导入数据，但清理浏览器站点数据会。
