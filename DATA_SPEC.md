# LAGOM CET-6 · 数据规范

站点是纯静态单页应用，数据以普通 `<script>` 加载，挂到 `window` 上。所有内容必须原创，不得复制真实六级真题原文。中文用于解析与提示，英文用于题目正文。

## 1. 单元（Unit）通用结构

每个文件导出一个数组：

```js
window.CET6_MOCK_UNITS = [
  {
    id: 'm1-l-1',                 // 全局唯一，见下方 ID 表
    module: 'listening',          // listening | reading | translation | writing
    kind: 'conversation',         // conversation | news | lecture | passage | task
    title: 'Conversation One · 校园采访',
    instructions: 'Listen to the conversation and choose the best answer.',
    passage: '',                  // 仅阅读单元：英文文章；段落用 \n\n 分隔
    audio: 'assets/audio/m1-l-1.mp3', // 仅听力单元
    transcript: '...',            // 仅听力单元，英文原文
    difficulty: 2,                // 1 | 2 | 3
    tags: ['校园', '细节题'],      // 单元主题标签
    questions: [ /* 见下 */ ]
  }
];
```

### 1.1 选择题 Question

```js
{
  id: 'm1-l-1-q1',               // 全局唯一
  type: 'choice',
  stem: 'What does the woman want to know?',
  options: ['A ...', 'B ...', 'C ...', 'D ...'], // 固定 4 项，不要带 A/B/C/D 前缀
  answer: 1,                     // 正确选项索引 0-3
  explanation: '中文解析，1-3 句。',
  tag: '细节题',                 // 详见题型标签
  points: 1
}
```

### 1.2 翻译 / 写作 Question

```js
{
  id: 'm1-t-1-q1',
  type: 'translation',
  stem: '请将上面的段落翻译成英文。',
  reference: '英文参考译文 / 范文',
  keyPoints: ['要点一', '要点二'],   // 中文，3-5 条
  minWords: 120,
  points: 1
}
```

翻译单元的 `prompt` 放中文原文（放在 unit 上，不是 question 上）；写作单元的 `prompt` 放英文 Directions。两者都需要 `instructions`（中文操作说明）。

## 2. 内容文件与 ID 约定

### 2.1 `data/units-mock.js` → `window.CET6_MOCK_UNITS`

两套全真模拟。每套 8 个单元、19 道题：

| 单元 ID | 类型 | 题量 | 要求 |
|---|---|---|---|
| `m1-w-1` / `m2-w-1` | writing | 1 | 英文 Directions，范文 160-200 词，议论文 |
| `m1-l-1` | conversation | 3 | `transcript` 用 `M:` / `W:` 分行；约 180 词 |
| `m1-l-2` | news | 2 | 新闻播报，约 130 词 |
| `m1-l-3` | lecture | 3 | 讲座，约 220 词 |
| `m1-r-1` / `m1-r-2` / `m1-r-3` | passage | 各 3 | 每篇 220-300 词，CET-6 难度 |
| `m1-t-1` | translation | 1 | 中文段落 120-160 字，文化/社会主题 |
| `m2-*` | 同上 | 同上 | 主题与 m1 不同 |

- 听力题 ID：`m1-l-1-q1` … `m1-l-1-q3`
- 阅读题 ID：`m1-r-1-q1` … `m1-r-1-q3`
- 音频路径严格为 `assets/audio/<unitId>.mp3`（脚本稍后自动生成音频）。
- 对话 transcript 以 `Questions 1 to 3 are based on the conversation you have just heard.` 开头，随后用 `M:` / `W:` 分行。新闻/讲座用普通英文段落，可以包含 `Questions ...` 开头。
- 阅读文章不要出现题号或答案标记。

### 2.2 `data/units-sets.js` → `window.CET6_SET_UNITS`

三套「套题训练」，每套 6 个单元、10 道题：

| 单元 ID | 类型 | 题量 |
|---|---|---|
| `s1-w-1` | writing | 1 |
| `s1-l-1` | conversation | 2 |
| `s1-l-2` | lecture | 2 |
| `s1-r-1` | passage | 2 |
| `s1-r-2` | passage | 2 |
| `s1-t-1` | translation | 1 |

`s2-*`、`s3-*` 同理。英文难度与 mock 接近，但篇幅可略短。主题建议：s1 科技与教育；s2 环境与城市；s3 职场与健康。

### 2.3 `data/units-drills.js` → `window.CET6_DRILL_UNITS`

专项练习，共 24 题：

| 单元 ID | 模块 | 题量 | 内容 |
|---|---|---|---|
| `dr-list-1` … `dr-list-6` | listening | 各 1-2 题 | 6 段短材料，每段 80-140 词，音频同规则 |
| `dr-read-1` … `dr-read-3` | reading | 各 2 题 | 3 篇短文，每篇 180-240 词 |
| `dr-trans-1` … `dr-trans-5` | translation | 各 1 题 | 5 段中文（文化、社会、科技、经济、生态） |
| `dr-write-1` … `dr-write-4` | writing | 各 1 题 | 4 个写作题（议论文、图表、书信、现象解释） |

题 ID 统一 `<unitId>-q1` 起。

### 2.4 `data/words.js` → `window.CET6_WORDS`

120 个 CET-6 核心词，按数组顺序即学习顺序。每项：

```js
{
  id: 'w001',
  word: 'abandon',
  phonetic: '/əˈbændən/',
  pos: 'v.',
  meaning: '放弃；抛弃；遗弃',
  example: 'The research team had to abandon the original plan.',
  exampleZh: '研究团队不得不放弃最初的计划。',
  tags: ['高频', '动词']
}
```

要求：词不重复；id 从 `w001` 到 `w120`；音标用国际音标；例句 8-16 词；中文释义准确；优先 CET-6 高频词，避免过于简单的四级词。

## 3. 题型标签

- 听力：`主旨题`、`细节题`、`推断题`、`态度题`
- 阅读：`主旨题`、`细节题`、`推断题`、`词义题`、`态度题`
- 翻译：单元 `tags` 用 `文化类`、`社会类`、`科技类`、`经济类`、`生态类`
- 写作：单元 `tags` 用 `议论文`、`图表作文`、`书信`、`现象解释`

每道选择题必须有 `tag`；每个单元至少 1 个主题 tag。写作/翻译题的 `tag` 可省略。

## 4. 质量与校验

1. 只写分配给你的文件，不要碰 `index.html`、`css/`、`js/`、`data/papers.js` 或其他人的数据文件。
2. 用模板字符串（反引号）写长英文段落，避免转义地狱；字符串里不要出现未转义的反引号。
3. 写完后用 Node 校验语法与字段：
   ```powershell
   node -e "global.window={}; require('./data/units-mock.js'); const u=window.CET6_MOCK_UNITS; console.log(u.length, u.reduce((n,x)=>n+x.questions.length,0));"
   ```
   再检查 ID 唯一、选择题 4 个选项、answer 在 0-3、所有字段齐全。
4. 解析用中文，题干/选项/文章用英文；不要出现真实考试年份或「真题原文」字样，使用原创模拟内容。

