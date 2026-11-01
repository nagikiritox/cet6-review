/*
 * LAGOM CET-6 · 套卷配置
 * 所有题目单元来自 units-mock.js / units-sets.js / units-drills.js。
 * 题目为原创模拟内容，不包含任何真实考试原文。
 */
window.CET6_PAPERS = [
  {
    id: 'mock-01',
    type: 'mock',
    title: '全真模拟 · 第一套',
    subtitle: '原创模拟 · 卷一',
    description: '按六级完整结构编排：写作、听力、阅读、翻译一次走完，适合考前整卷计时。',
    difficulty: 3,
    durationMin: 130,
    totalPoints: 710,
    accent: 'pine',
    sections: [
      { id: 'writing', title: 'Part I · Writing', module: 'writing', minutes: 30, points: 106.5, unitIds: ['m1-w-1'] },
      { id: 'listening', title: 'Part II · Listening', module: 'listening', minutes: 30, points: 248.5, unitIds: ['m1-l-1', 'm1-l-2', 'm1-l-3'] },
      { id: 'reading', title: 'Part III · Reading', module: 'reading', minutes: 40, points: 248.5, unitIds: ['m1-r-1', 'm1-r-2', 'm1-r-3'] },
      { id: 'translation', title: 'Part IV · Translation', module: 'translation', minutes: 30, points: 106.5, unitIds: ['m1-t-1'] }
    ]
  },
  {
    id: 'mock-02',
    type: 'mock',
    title: '全真模拟 · 第二套',
    subtitle: '原创模拟 · 卷二',
    description: '换一套话题与语料，检验稳定的答题节奏。建议与前一套间隔两天完成。',
    difficulty: 3,
    durationMin: 130,
    totalPoints: 710,
    accent: 'ochre',
    sections: [
      { id: 'writing', title: 'Part I · Writing', module: 'writing', minutes: 30, points: 106.5, unitIds: ['m2-w-1'] },
      { id: 'listening', title: 'Part II · Listening', module: 'listening', minutes: 30, points: 248.5, unitIds: ['m2-l-1', 'm2-l-2', 'm2-l-3'] },
      { id: 'reading', title: 'Part III · Reading', module: 'reading', minutes: 40, points: 248.5, unitIds: ['m2-r-1', 'm2-r-2', 'm2-r-3'] },
      { id: 'translation', title: 'Part IV · Translation', module: 'translation', minutes: 30, points: 106.5, unitIds: ['m2-t-1'] }
    ]
  }
];

window.CET6_SETS = [
  {
    id: 'set-01',
    type: 'set',
    title: '套题训练 · No.1',
    subtitle: '科技与教育',
    description: '科技如何改变课堂与学习方式。适合专项后的一次短程套卷训练。',
    difficulty: 2,
    durationMin: 45,
    totalPoints: 100,
    accent: 'blue',
    sections: [
      { id: 'writing', title: 'Writing', module: 'writing', minutes: 12, points: 15, unitIds: ['s1-w-1'] },
      { id: 'listening', title: 'Listening', module: 'listening', minutes: 12, points: 40, unitIds: ['s1-l-1', 's1-l-2'] },
      { id: 'reading', title: 'Reading', module: 'reading', minutes: 15, points: 30, unitIds: ['s1-r-1', 's1-r-2'] },
      { id: 'translation', title: 'Translation', module: 'translation', minutes: 6, points: 15, unitIds: ['s1-t-1'] }
    ]
  },
  {
    id: 'set-02',
    type: 'set',
    title: '套题训练 · No.2',
    subtitle: '环境与城市',
    description: '从城市更新到日常低碳，训练环境类高频表达与篇章理解。',
    difficulty: 2,
    durationMin: 45,
    totalPoints: 100,
    accent: 'sage',
    sections: [
      { id: 'writing', title: 'Writing', module: 'writing', minutes: 12, points: 15, unitIds: ['s2-w-1'] },
      { id: 'listening', title: 'Listening', module: 'listening', minutes: 12, points: 40, unitIds: ['s2-l-1', 's2-l-2'] },
      { id: 'reading', title: 'Reading', module: 'reading', minutes: 15, points: 30, unitIds: ['s2-r-1', 's2-r-2'] },
      { id: 'translation', title: 'Translation', module: 'translation', minutes: 6, points: 15, unitIds: ['s2-t-1'] }
    ]
  },
  {
    id: 'set-03',
    type: 'set',
    title: '套题训练 · No.3',
    subtitle: '职场与健康',
    description: '工作方式、身心健康与生活平衡，贴近六级社会类话题。',
    difficulty: 2,
    durationMin: 45,
    totalPoints: 100,
    accent: 'clay',
    sections: [
      { id: 'writing', title: 'Writing', module: 'writing', minutes: 12, points: 15, unitIds: ['s3-w-1'] },
      { id: 'listening', title: 'Listening', module: 'listening', minutes: 12, points: 40, unitIds: ['s3-l-1', 's3-l-2'] },
      { id: 'reading', title: 'Reading', module: 'reading', minutes: 15, points: 30, unitIds: ['s3-r-1', 's3-r-2'] },
      { id: 'translation', title: 'Translation', module: 'translation', minutes: 6, points: 15, unitIds: ['s3-t-1'] }
    ]
  }
];

window.CET6_DRILL_META = {
  listening: {
    name: '听力题',
    short: '听力',
    icon: 'headphones',
    accent: 'blue',
    description: '短对话、新闻与讲座，按题型拆解，磨耳朵也磨方法。',
    instructions: '先听音频，再作答。音频可回放，原文在提交后开放。'
  },
  reading: {
    name: '阅读题',
    short: '阅读',
    icon: 'bookOpen',
    accent: 'pine',
    description: '细节、推断、主旨与词义，练的是定位，也是判断。',
    instructions: '先读文章再作答，建议控制在 8 分钟内完成一篇。'
  },
  translation: {
    name: '翻译题',
    short: '翻译',
    icon: 'translate',
    accent: 'ochre',
    description: '中国文化、社会与科技主题，积累可迁移的句式与表达。',
    instructions: '先自己动笔翻译，提交后对照参考译文与采分点。'
  },
  writing: {
    name: '作文题',
    short: '写作',
    icon: 'pen',
    accent: 'clay',
    description: '议论文、图表、书信与现象解释，搭好框架再落笔。',
    instructions: '先列提纲，再完成全文；提交后对照范文并自评。'
  }
};

