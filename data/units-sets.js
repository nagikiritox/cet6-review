// LAGOM CET-6 · 套题训练（window.CET6_SET_UNITS）
// 三套原创套题训练：s1 科技与教育 / s2 环境与城市 / s3 职场与健康
// 每套 6 单元 10 题：写作 1、会话 2、讲座 2、阅读 2×2、翻译 1
window.CET6_SET_UNITS = [
  /* ==================== Set 1 · 科技与教育 ==================== */
  {
    id: 's1-w-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing · 人工智能与学习方式',
    instructions: `阅读下面的英文题目，完成一篇 160-190 词的议论文。`,
    passage: '',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay on how artificial intelligence is changing the way students learn. Your essay should include the benefits and the risks of this change, and you should give your own view. You should write at least 160 words but no more than 200 words.`,
    difficulty: 2,
    tags: ['科技与教育', '议论文'],
    questions: [
      {
        id: 's1-w-1-q1',
        type: 'writing',
        stem: `Write an essay on how artificial intelligence is changing the way students learn, discussing both its benefits and its risks.`,
        reference: `Artificial intelligence has moved from the laboratory into the classroom faster than most schools were prepared for. Its appeal is easy to understand: a patient tutor that never sleeps can explain a difficult concept at two in the morning and adapt the next exercise to a learner's weakest point. For students who are too shy to raise a hand in class, such tools can be a quiet source of confidence.

Yet convenience has a cost. When an application produces a polished answer in three seconds, the struggle that actually builds understanding disappears. Students may hand in fluent essays they could not have written and pass tests without owning the knowledge behind them. Not every family can afford the best subscriptions, either, so the technology may widen the gap it promises to close.

The sensible response is neither worship nor rejection. Schools should teach students to question a machine's output, to use AI for practice rather than substitution, and to keep the habit of thinking before clicking. Technology can widen access to good teaching, but only if we decide what it is for.`,
        keyPoints: [
          '人工智能能提供随时可用的个性化辅导与即时反馈',
          '过度依赖会削弱独立思考与真实写作能力',
          '付费工具可能扩大而非缩小教育差距',
          '学校应教会学生质疑机器输出、把 AI 用于练习而非替代'
        ],
        minWords: 160,
        points: 1
      }
    ]
  },
  {
    id: 's1-l-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation One · 智能笔记应用',
    instructions: `Listen to the conversation and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s1-l-1.mp3',
    transcript: `Questions 1 to 2 are based on the conversation you have just heard.
M: Professor Lin, do you have a minute? I want to ask about the note-taking app you mentioned in class.
W: Sure, come in. Are you thinking of trying it for your research project?
M: I installed it last week, and it turns a forty-minute lecture into a one-page summary. But I am worried I am not really learning anything. My notes look wonderful, yet I could not explain the main argument to my roommate.
W: That is a common experience. The tool is good at organising what you have already understood; it cannot do the understanding for you. I usually ask students to write three sentences in their own words after each lecture.
M: So I should summarise it myself instead of letting the app do it?
W: Keep the app for recording and searching, but handwrite the summary. It takes ten minutes, and that is where the learning happens.
M: That makes sense. I will try it this week and tell you how it goes.`,
    difficulty: 2,
    tags: ['科技与教育', '校园'],
    questions: [
      {
        id: 's1-l-1-q1',
        type: 'choice',
        stem: `What does the man say worries him about the note-taking app?`,
        options: [
          `It is too expensive for students to afford.`,
          `It records lectures without the professor's permission.`,
          `It makes his notes look good without real understanding.`,
          `It cannot search through long recordings quickly.`
        ],
        answer: 2,
        explanation: `男士说笔记"看起来很漂亮"，但他无法向室友解释讲座的主要论点，因此担心自己并没有真正学会。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's1-l-1-q2',
        type: 'choice',
        stem: `What does the woman advise the man to do?`,
        options: [
          `Stop using the app and return to paper notes only.`,
          `Write a short summary in his own words after each lecture.`,
          `Ask the professor to provide summaries of each class.`,
          `Record the lecture twice to check the app's accuracy.`
        ],
        answer: 1,
        explanation: `女士建议保留应用的录音和检索功能，但每次讲座后用自己的话手写三句话总结，她强调这正是学习发生的地方。`,
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 's1-l-2',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture · 屏幕阅读的代价',
    instructions: `Listen to the lecture and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s1-l-2.mp3',
    transcript: `Good morning. Today I want to challenge a belief that many schools take for granted: that digital textbooks are simply a cheaper and more convenient version of printed ones. In several experiments, students who read the same text on a screen performed slightly worse on questions that required them to connect ideas from different paragraphs. Interestingly, they did just as well on questions about isolated facts. One explanation is that a screen encourages scanning. We scroll, we skim, and we rarely build a mental map of where an argument is going. A printed page, by contrast, gives us a physical sense of progress; our fingers know how much is left. This does not mean we should throw away tablets. It means we should teach students to read differently on them: to slow down, to highlight sparingly, and to write a brief summary without looking back.`,
    difficulty: 3,
    tags: ['科技与教育', '阅读'],
    questions: [
      {
        id: 's1-l-2-q1',
        type: 'choice',
        stem: `What finding does the speaker mention about reading on screens?`,
        options: [
          `Students remember isolated facts better on paper than on screens.`,
          `Students connect ideas across paragraphs less well on screens.`,
          `Students read digital textbooks much faster than printed ones.`,
          `Students prefer printed books when the text is difficult.`
        ],
        answer: 1,
        explanation: `讲座提到，在需要把不同段落观点联系起来的题目上，屏幕阅读者表现略差，但在孤立事实题上表现相同。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's1-l-2-q2',
        type: 'choice',
        stem: `What is the speaker's attitude towards tablets in the classroom?`,
        options: [
          `They should be banned until further research is done.`,
          `They are useful if students are taught to read more carefully on them.`,
          `They are no more than a cheap replacement for printed books.`,
          `They are most effective for teaching factual knowledge.`
        ],
        answer: 1,
        explanation: `讲者明确说"这不意味着我们该扔掉平板"，而是应教学生放慢速度、少做标记、不回头看就写摘要，态度是有条件地支持。`,
        tag: '态度题',
        points: 1
      }
    ]
  },
  {
    id: 's1-r-1',
    module: 'reading',
    kind: 'passage',
    title: 'Passage One · 翻转课堂的意外发现',
    instructions: `Read the passage and choose the best answer.`,
    passage: `When teachers first began recording their lectures and asking students to watch them at home, the idea seemed efficient: class time could be spent on questions and exercises instead of one-way explanation. Early results were mixed. Some students arrived prepared and the classroom came alive; others arrived confused, having watched the video without understanding it, and the lesson collapsed into a second lecture.

Researchers now suspect that the videos were never the important part. What mattered was what replaced the lecture: short and frequent checks in class, immediate feedback, and activities that forced students to apply an idea rather than copy it down. The video simply freed the minutes needed for that. In schools where the recordings were used as a substitute for teaching, with no change to what happened in class, outcomes barely moved.

The lesson for anyone tempted by a new educational tool is to ask what it replaces, not what it provides. A podcast does not improve learning unless it buys time for something better. Technology is valuable when it reshuffles attention, and it is useless when it merely repackages the old routine in a shinier box.`,
    difficulty: 3,
    tags: ['科技与教育', '教学法'],
    questions: [
      {
        id: 's1-r-1-q1',
        type: 'choice',
        stem: `What is the main point of the passage?`,
        options: [
          `Recorded lectures should replace classroom teaching entirely.`,
          `The value of the flipped classroom lies in what it makes room for in class.`,
          `Students learn better at home than in a traditional classroom.`,
          `Teachers should spend more time producing high-quality videos.`
        ],
        answer: 1,
        explanation: `文章指出视频本身并非关键，真正起作用的是课堂上替代讲授的小测、即时反馈与应用活动，即"翻转"为课堂腾出的空间。`,
        tag: '主旨题',
        points: 1
      },
      {
        id: 's1-r-1-q2',
        type: 'choice',
        stem: `What can be inferred about a school that only adds online videos to its existing lessons?`,
        options: [
          `Its test scores will rise sharply within a year.`,
          `Its students will watch the videos more carefully than before.`,
          `Its teaching will change very little despite the new tool.`,
          `Its teachers will have more free time for personal research.`
        ],
        answer: 2,
        explanation: `文中提到，若录像只是替代讲授、课堂没有任何改变，学习效果几乎不变，可推知仅添加视频的学校教学实质变化很小。`,
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 's1-r-2',
    module: 'reading',
    kind: 'passage',
    title: 'Passage Two · “数字原住民”的神话',
    instructions: `Read the passage and choose the best answer.`,
    passage: `Every few years a phrase appears that seems to explain a generation. The current favourite is "digital native": the idea that young people who grew up with smartphones and social media are naturally skilled with technology, and that teachers merely need to give them room.

The evidence is less tidy. Surveys consistently find that students are fluent at the tasks they do every day — messaging, sharing photographs, finding a song — and surprisingly weak at others. Many cannot judge whether a website is trustworthy, search beyond the first few results, or explain how their data is used. Confidence, it turns out, is not the same as competence.

This distinction matters because a common mistake in schools is to assume that a generation's comfort with screens means the skills can be taken for granted. In practice, the opposite is true: familiarity with a tool can hide ignorance of how it works. A student who has never considered who benefits from an app's design is poorly equipped for citizenship, let alone work.

The conclusion is not that young people are failing. It is that "native" is the wrong metaphor. No one is born knowing how to evaluate a source. These are habits, and they must be taught.`,
    difficulty: 2,
    tags: ['科技与教育', '媒介素养'],
    questions: [
      {
        id: 's1-r-2-q1',
        type: 'choice',
        stem: `According to the passage, what are many young people unable to do?`,
        options: [
          `Send photographs to their friends instantly.`,
          `Search for music on popular platforms.`,
          `Judge whether an online source is reliable.`,
          `Use more than one social-media app at a time.`
        ],
        answer: 2,
        explanation: `文章第二段明确指出，许多学生无法判断网站是否可信、无法检索到前几条结果之外的内容，也说不清自己的数据如何被使用。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's1-r-2-q2',
        type: 'choice',
        stem: `What is the author's main argument?`,
        options: [
          `Young people today know much less about technology than their parents.`,
          `Being comfortable with devices does not mean being skilled with them.`,
          `Schools should stop using digital tools in the classroom.`,
          `Social media is mainly responsible for students' poor reading habits.`
        ],
        answer: 1,
        explanation: `全文围绕"熟悉工具不等于具备能力"展开，指出所谓数字原住民的神话会让人误以为相关技能无需教授。`,
        tag: '主旨题',
        points: 1
      }
    ]
  },
  {
    id: 's1-t-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation · 人工智能进课堂',
    instructions: `阅读下面的中文段落，将其翻译成英文。`,
    passage: '',
    prompt: `近年来，人工智能正在悄然改变大学课堂。越来越多的高校使用智能教学平台，为不同专业的学生推荐个性化学习资源。学生可以随时提问，系统会立即解答并记录他们的薄弱环节。支持者认为，这让优质教育不再局限于少数名校。不过，也有教师担心学生因此失去独立思考的习惯。`,
    difficulty: 2,
    tags: ['科技类', '科技与教育'],
    questions: [
      {
        id: 's1-t-1-q1',
        type: 'translation',
        stem: `请将上面的段落翻译成英文。`,
        reference: `In recent years, artificial intelligence has been quietly changing university classrooms. More and more universities are using intelligent teaching platforms to recommend personalised learning resources to students from different majors. Students can ask questions at any time, and the system gives an immediate answer while recording their weak points. Supporters believe that this means high-quality education is no longer limited to a handful of prestigious universities. However, some teachers worry that students may gradually lose the habit of independent thinking.`,
        keyPoints: [
          '人工智能正在悄然改变大学课堂',
          '智能教学平台为不同专业学生推荐个性化资源',
          '系统即时答疑并记录薄弱环节',
          '支持者认为有助于教育公平',
          '教师担心学生失去独立思考习惯'
        ],
        minWords: 80,
        points: 1
      }
    ]
  },

  /* ==================== Set 2 · 环境与城市 ==================== */
  {
    id: 's2-w-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing · 城市中心该不该禁车',
    instructions: `阅读下面的英文题目，完成一篇 160-190 词的议论文。`,
    passage: '',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay on whether private cars should be banned from city centres. You should explain the arguments on both sides and then state your own opinion. You should write at least 160 words but no more than 200 words.`,
    difficulty: 2,
    tags: ['环境与城市', '议论文'],
    questions: [
      {
        id: 's2-w-1-q1',
        type: 'writing',
        stem: `Write an essay on whether private cars should be banned from city centres, presenting both sides and your own opinion.`,
        reference: `Few urban debates become personal as quickly as the question of cars. To a delivery driver, a ban on private vehicles in the city centre looks like a threat to a living; to a parent pushing a pram along the pavement, it looks like fresher air and less noise. Both are describing the same street.

The strongest argument for restriction is that the costs of driving are paid by everyone, while the benefits are enjoyed by the driver. Congestion, pollution and accidents do not stay inside the vehicle. City centres, with their short distances and dense bus networks, are precisely where cars add the least. Several European cities have shown that closing a few streets to private traffic can raise footfall in local shops.

Yet a ban is only fair if a real alternative exists. Restrictions imposed before reliable buses and safe cycle lanes are in place simply punish people who have no choice. The sequence matters more than the policy.

The question, then, is not whether to remove cars from the centre, but what the city will offer people on the day it does.`,
        keyPoints: [
          '禁车对不同群体意味着不同代价',
          '开车的外部成本由所有人承担，市中心短途出行获益最小',
          '欧洲案例显示部分封街可带动沿街商业',
          '若无可靠公交与自行车道，禁令不公平',
          '结论应落在"先给替代方案，再限制"'
        ],
        minWords: 160,
        points: 1
      }
    ]
  },
  {
    id: 's2-l-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation One · 社区花园',
    instructions: `Listen to the conversation and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s2-l-1.mp3',
    transcript: `Questions 1 to 2 are based on the conversation you have just heard.
W: I saw you digging in the courtyard yesterday. Is that the community garden the notice mentioned?
M: Yes, we finally got permission. The council gave us the strip of land behind the bicycle racks, and twenty families have already signed up.
W: Very nice. What are you planning to grow?
M: Herbs and beans, mostly, because they survive if people forget to water them. But the real reason I joined is the food waste bin. Each household puts in its vegetable scraps, and the garden uses the compost.
W: So the garden does not just produce food; it also reduces what goes to the landfill.
M: Exactly. And it has changed the courtyard. People stop and talk now, which never happened before.
W: Then count me in. I have no experience, though.
M: That is fine. There is a workshop on Saturday for beginners. Bring gloves and a hat.`,
    difficulty: 1,
    tags: ['环境与城市', '社区'],
    questions: [
      {
        id: 's2-l-1-q1',
        type: 'choice',
        stem: `What does the man say is the main reason he joined the garden?`,
        options: [
          `He wants to sell vegetables to other families.`,
          `He was asked to look after the bicycles.`,
          `The garden turns household food waste into compost.`,
          `He has always wanted to design a garden.`
        ],
        answer: 2,
        explanation: `男士说他种香草和豆类主要是好养活，而"真正的原因"是餐厨垃圾桶——花园利用堆肥，减少送往垃圾填埋场的垃圾。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's2-l-1-q2',
        type: 'choice',
        stem: `What does the woman decide to do?`,
        options: [
          `Attend a beginner workshop on Saturday.`,
          `Ask the council for a larger piece of land.`,
          `Organise a meeting for the twenty families.`,
          `Buy seeds for her own balcony.`
        ],
        answer: 0,
        explanation: `女士说"算我一个"，但表示自己没有经验，男士便告诉她周六有初学者工作坊，让她带好手套和帽子，因此她会去参加工作坊。`,
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 's2-l-2',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture · 城市热岛',
    instructions: `Listen to the lecture and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s2-l-2.mp3',
    transcript: `Today we are going to look at a problem that is invisible on most city maps: heat. On a hot afternoon, the air above a paved square can be several degrees warmer than the air above a park a few streets away. The reason is that concrete and asphalt absorb solar energy during the day and release it slowly at night, while trees cool their surroundings by releasing water vapour. As cities grow, this difference becomes a public-health issue, because the people who live in the hottest districts are often those who can least afford air conditioning.

The good news is that the solutions do not require a single grand design. Painting roofs white, planting trees along streets, and replacing a fraction of the pavement with soil and plants can each lower local temperatures noticeably. The challenge is maintenance: a tree planted and forgotten dies, and a white roof becomes grey within a couple of years. Cities that succeed treat shade as infrastructure, funded and repaired like any road.`,
    difficulty: 3,
    tags: ['环境与城市', '气候'],
    questions: [
      {
        id: 's2-l-2-q1',
        type: 'choice',
        stem: `Why does the speaker mention people in the hottest districts?`,
        options: [
          `To show that heat is also a question of social fairness.`,
          `To explain why air conditioning is becoming cheaper.`,
          `To argue that these districts should be rebuilt completely.`,
          `To suggest that heat affects wealthy households most.`
        ],
        answer: 0,
        explanation: `讲者指出最热城区居民往往最负担不起空调，把热岛效应与公共健康和社会公平联系起来。`,
        tag: '推断题',
        points: 1
      },
      {
        id: 's2-l-2-q2',
        type: 'choice',
        stem: `What does the speaker say is the main challenge of cooling measures?`,
        options: [
          `They are too expensive to test in real cities.`,
          `They need continuous care to remain effective.`,
          `Scientists disagree about how they work.`,
          `Residents usually dislike trees in their streets.`
        ],
        answer: 1,
        explanation: `讲者强调真正的挑战是维护：种下就忘的树会死，白色屋顶几年就变灰，成功城市把树荫当作需要持续投入的基础设施。`,
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 's2-r-1',
    module: 'reading',
    kind: 'passage',
    title: 'Passage One · 十五分钟城市',
    instructions: `Read the passage and choose the best answer.`,
    passage: `For most of the last century, city planners assumed that a good city was one in which people could travel far and fast. Work, home, school and entertainment were separated into zones, and roads were built to connect them. The result was efficient for cars and exhausting for people who had to spend two hours a day moving between them.

The "fifteen-minute city" offers a different test. Rather than asking how quickly someone can cross the city, it asks whether most daily needs can be met within a short walk or cycle: a shop, a clinic, a school, a park, a post office. The idea is not that people should never leave their neighbourhood, but that they should not be forced to.

Critics point out that wealthy districts are easy to make walkable, while poorer ones often have fewer shops and worse pavements. There is also a risk of creating comfortable enclaves that ignore the jobs, hospitals and universities that genuinely need to be centralised. The concept works best, then, as a measure of inequality as much as a design goal: it forces a city to ask which of its neighbourhoods have been quietly left out.`,
    difficulty: 3,
    tags: ['环境与城市', '城市规划'],
    questions: [
      {
        id: 's2-r-1-q1',
        type: 'choice',
        stem: `What is the main purpose of the passage?`,
        options: [
          `To argue that cities should be redesigned so that daily needs are within easy reach.`,
          `To prove that people in rich areas walk more than people in poor ones.`,
          `To explain why hospitals and universities must move to the edge of cities.`,
          `To describe how roads were built in the last century.`
        ],
        answer: 0,
        explanation: `文章先对比旧式分区规划，再提出"十五分钟城市"以步行可达日常需求为标准，并讨论其局限，主旨是支持这一规划思路。`,
        tag: '主旨题',
        points: 1
      },
      {
        id: 's2-r-1-q2',
        type: 'choice',
        stem: `What can be inferred from the last paragraph?`,
        options: [
          `The concept may reveal neglected neighbourhoods rather than only guide design.`,
          `Wealthy districts cannot be made walkable without banning cars.`,
          `Centralised hospitals should be closed to make cities denser.`,
          `People should never travel outside their own neighbourhood.`
        ],
        answer: 0,
        explanation: `末段说该概念"既是大设计目标，也是衡量不平等的尺度"，因为它迫使城市审视哪些社区被悄悄忽略，故可推知其诊断价值。`,
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 's2-r-2',
    module: 'reading',
    kind: 'passage',
    title: 'Passage Two · 种树的隐忧',
    instructions: `Read the passage and choose the best answer.`,
    passage: `Tree planting has become the favourite gesture of the environmental age. It is visible, photogenic and easy to promise: a company can announce a million new trees and print the photographs within a week. Yet ecologists have grown uneasy about what happens after the cameras leave.

The first problem is where the trees are planted. A field of a single species, planted in straight rows, is a crop rather than a forest. It stores some carbon, but it offers little to insects and birds, and it may dry out the soil that nearby farmers depend on. The second problem is time. Young trees can die in their first dry summer, and plantations that are not watered and protected for years may quietly fail. The third is that a forest is not only a collection of trunks; it is a community of fungi, mosses and animals that takes decades to form.

None of this means planting is pointless. It means the goal should be described more honestly: not "a million trees", but a functioning habitat and the long commitment that a habitat requires.`,
    difficulty: 3,
    tags: ['环境与城市', '生态'],
    questions: [
      {
        id: 's2-r-2-q1',
        type: 'choice',
        stem: `What does the author say about a field of a single species in straight rows?`,
        options: [
          `It is the most effective way to store carbon.`,
          `It supports more birds than a natural forest.`,
          `It is a crop rather than a real forest.`,
          `It usually improves the soil for nearby farms.`
        ],
        answer: 2,
        explanation: `第二段明确指出，单一树种、成排种植的林地"是庄稼而不是森林"，对昆虫鸟类帮助有限，甚至可能使附近农田依赖的土壤变干。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's2-r-2-q2',
        type: 'choice',
        stem: `What is the author's main message?`,
        options: [
          `Tree planting should be abandoned because it rarely works.`,
          `The aim of planting should be a lasting habitat, not a number of trees.`,
          `Companies should photograph their plantations more often.`,
          `Single-species forests are better for farmers than for wildlife.`
        ],
        answer: 1,
        explanation: `末段说这不代表种树没有意义，而是目标应被更诚实地描述：不是"一百万棵树"，而是能长期维系的栖息地。`,
        tag: '主旨题',
        points: 1
      }
    ]
  },
  {
    id: 's2-t-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation · 海绵城市',
    instructions: `阅读下面的中文段落，将其翻译成英文。`,
    passage: '',
    prompt: `近年来，许多城市开始建设"海绵城市"，以应对暴雨内涝。城市像海绵一样，能够吸收、储存并慢慢释放雨水，做法包括增加绿地、铺设透水路面和修建蓄水池。支持者认为，这既能减少洪涝灾害，也能补充地下水。不过，改造老城区需要大量资金，还会影响居民出行。如何在不干扰市民生活的前提下推进改造，仍需认真考虑。`,
    difficulty: 2,
    tags: ['生态类', '环境与城市'],
    questions: [
      {
        id: 's2-t-1-q1',
        type: 'translation',
        stem: `请将上面的段落翻译成英文。`,
        reference: `In recent years, many cities have begun to build "sponge cities" in order to cope with waterlogging caused by heavy rain. Like a sponge, a city can absorb, store and slowly release rainwater. Specific measures include adding green spaces, laying permeable pavements and building small reservoirs in residential areas. Supporters believe that this can not only reduce floods but also replenish groundwater. However, renovating old urban areas requires a great deal of money and will also affect residents' daily travel. How to carry out such renovation without disturbing citizens' lives still requires careful consideration.`,
        keyPoints: [
          '建设"海绵城市"以应对暴雨内涝',
          '城市像海绵一样吸收、储存并缓慢释放雨水',
          '具体做法：增加绿地、透水路面、小型蓄水池',
          '支持者认为可减少洪涝并补充地下水',
          '老城区改造耗资大且影响出行，需谨慎推进'
        ],
        minWords: 80,
        points: 1
      }
    ]
  },

  /* ==================== Set 3 · 职场与健康 ==================== */
  {
    id: 's3-w-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing · 下班后的消息',
    instructions: `阅读下面的英文题目，完成一篇 160-190 词的议论文。`,
    passage: '',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay on whether employers should be allowed to contact employees outside working hours. You should state your view clearly and support it with reasons. You should write at least 160 words but no more than 200 words.`,
    difficulty: 2,
    tags: ['职场与健康', '议论文'],
    questions: [
      {
        id: 's3-w-1-q1',
        type: 'writing',
        stem: `Write an essay on whether employers should be allowed to contact employees outside working hours, stating your view and supporting it with reasons.`,
        reference: `A message from the office at ten in the evening seems like a small thing. It takes thirty seconds to read and perhaps a minute to answer. Yet repeated often enough, it quietly removes the border between work and rest, and it is the border, not the message, that employees need.

Those who defend after-hours contact usually argue that flexibility must run both ways: if staff may leave early on a Friday, managers should be able to reach them on a Sunday. That is reasonable, but only when the arrangement is explicit and reciprocal. The problem is that the freedom to ignore a message rarely survives a culture in which silence looks like a lack of commitment.

The better solution is not a strict law for every industry, but a clear expectation set in advance: a shared understanding of what counts as urgent, a right to switch off that managers themselves respect, and the knowledge that someone unavailable on Sunday can still be ambitious on Monday.

Boundaries are not a reward for good behaviour; they are part of what makes long careers possible.`,
        keyPoints: [
          '单条消息很小，但重复会侵蚀工作与休息的边界',
          '支持者认为弹性应当双向，但需明确且对等',
          '真正的问题是不回消息会被视为不投入的文化',
          '解决方案是事先约定何为紧急、管理层带头尊重下班权',
          '边界不是奖励，而是长期职业生涯的基础'
        ],
        minWords: 160,
        points: 1
      }
    ]
  },
  {
    id: 's3-l-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation One · 员工健康计划',
    instructions: `Listen to the conversation and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s3-l-1.mp3',
    transcript: `Questions 1 to 2 are based on the conversation you have just heard.
M: Ms. Reyes, do you have a moment? I want to talk about the wellness programme you launched last month.
W: Of course. Are the lunchtime walking groups not working?
M: They are fine, but most of us in the design team cannot leave at noon. We are in meetings from twelve to one almost every day. The yoga class at seven in the morning is the same problem.
W: So the programme aims at people who have time rather than people who need it. What would help your team?
M: Short breaks we can take when we choose. Even ten minutes of stretching between meetings would help, as long as it is not scheduled and people do not feel guilty.
W: That is a fair point. Let me ask the provider whether they can record short sessions people can play at their desks, and I will mention the scheduling issue at the next team meeting.
M: Thank you. I think many people will use them.`,
    difficulty: 2,
    tags: ['职场与健康', '办公室'],
    questions: [
      {
        id: 's3-l-1-q1',
        type: 'choice',
        stem: `What problem does the man describe?`,
        options: [
          `The walking groups are too far from the office.`,
          `The programme's sessions do not fit his team's schedule.`,
          `The yoga instructor has cancelled all classes.`,
          `His team is not interested in health at all.`
        ],
        answer: 1,
        explanation: `男士说设计团队中午几乎每天开会、早上七点的瑜伽课也有同样问题，即健康计划的活动时间与团队日程不符。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's3-l-1-q2',
        type: 'choice',
        stem: `What will the woman most probably do next?`,
        options: [
          `Cancel the lunchtime walking groups.`,
          `Ask for recorded sessions and raise the scheduling issue.`,
          `Move the design team's meetings to the afternoon.`,
          `Hire a full-time fitness coach for the office.`
        ],
        answer: 1,
        explanation: `女士表示会询问服务商能否录制可在工位播放的短课程，并表示会在下次团队会议上提出排期问题，故 B 最可能。`,
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 's3-l-2',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture · 睡眠与免疫力',
    instructions: `Listen to the lecture and choose the best answer.`,
    passage: '',
    audio: 'assets/audio/s3-l-2.mp3',
    transcript: `Let me begin with a number that surprises most of my students. Adults who regularly sleep less than six hours a night are roughly four times more likely to catch a cold after exposure to the virus than those who sleep more than seven. Sleep, in other words, is not a luxury that we can borrow against during a busy month; it is part of the immune system.

The modern workplace makes this difficult. Bright screens, evening meetings and the habit of answering email in bed all signal to the body that the day has not ended. Shift workers face a harder version of the same problem, because no amount of discipline can persuade the body that three in the morning is noon. What research does suggest is that small changes matter more than grand ones: a consistent wake-up time, a dark bedroom, and a rule that the phone charges in another room. None of these requires willpower for very long, which is precisely why they work.`,
    difficulty: 3,
    tags: ['职场与健康', '睡眠'],
    questions: [
      {
        id: 's3-l-2-q1',
        type: 'choice',
        stem: `What does the speaker say about sleep?`,
        options: [
          `It can be safely reduced during a busy month.`,
          `It is closely connected with the body's ability to fight infection.`,
          `It matters less for shift workers than for other employees.`,
          `It is mainly a question of personal willpower.`
        ],
        answer: 1,
        explanation: `讲者用睡眠不足者更易感冒的数据说明睡眠不是可以透支的奢侈品，而是免疫系统的一部分。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's3-l-2-q2',
        type: 'choice',
        stem: `What does the speaker recommend?`,
        options: [
          `A single long lie-in at the weekend.`,
          `Grand changes to one's whole daily routine.`,
          `Small, consistent habits such as a fixed wake-up time.`,
          `Working only during daylight hours whenever possible.`
        ],
        answer: 2,
        explanation: `讲者明确说小的改变比大的改变更重要，例如固定起床时间、卧室保持黑暗、手机在另一个房间充电。`,
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 's3-r-1',
    module: 'reading',
    kind: 'passage',
    title: 'Passage One · 四天工作制',
    instructions: `Read the passage and choose the best answer.`,
    passage: `When a small British company announced in 2022 that it would move to a four-day week without cutting pay, the reaction was split. Supporters called it evidence that productivity is not tied to hours. Sceptics suspected a publicity stunt, or a benefit that only comfortable office firms could afford.

The results of larger trials have been more interesting than either camp expected. Most participating companies reported stable or slightly higher output, fewer staff leaving, and a marked drop in sick days. But the reports also show how much the outcome depended on how the change was implemented. Firms that simply made people work longer on four days, or expected them to answer messages on the fifth, saw the benefits disappear. The ones that succeeded redesigned their meetings, shortened reports and protected periods of quiet work.

This is the part that rarely makes the headline. A four-day week is not a gift of free time; it is a demand for better organisation. An organisation that cannot cut unnecessary meetings will not become more productive by removing a day from the calendar. It will simply compress the same chaos into less space, and the people who absorb the pressure will be those with the least power to refuse.`,
    difficulty: 3,
    tags: ['职场与健康', '工作制度'],
    questions: [
      {
        id: 's3-r-1-q1',
        type: 'choice',
        stem: `What did most companies in the larger trials report?`,
        options: [
          `A sharp fall in output during the first months.`,
          `Higher output and fewer staff leaving.`,
          `More sick days taken by employees.`,
          `A need to hire additional staff.`
        ],
        answer: 1,
        explanation: `第二段指出多数参与公司报告产出稳定或略升、离职人数减少、病假明显下降。`,
        tag: '细节题',
        points: 1
      },
      {
        id: 's3-r-1-q2',
        type: 'choice',
        stem: `What is the author's attitude towards the four-day week?`,
        options: [
          `Uncritically enthusiastic.`,
          `Cautiously supportive but aware of the conditions for success.`,
          `Completely opposed because trials were unreliable.`,
          `Indifferent, since the evidence is too limited to judge.`
        ],
        answer: 1,
        explanation: `作者承认试验的积极结果，但反复强调成效取决于实施方式与组织效率，并提醒压力会转嫁给弱势员工，态度是谨慎支持。`,
        tag: '态度题',
        points: 1
      }
    ]
  },
  {
    id: 's3-r-2',
    module: 'reading',
    kind: 'passage',
    title: 'Passage Two · 职业倦怠',
    instructions: `Read the passage and choose the best answer.`,
    passage: `The word "burnout" was once reserved for people in a handful of professions: nurses, teachers, social workers. Today it appears in job advertisements and in conversations among graduates in their first year of employment. Something has changed, and it is not simply that young workers are less tough than their parents.

One explanation lies in the nature of modern office work. A clear boundary used to exist between finishing a task and leaving it behind. That boundary depended on place: the office closed, the tools stayed there. When the tools moved into our pockets, the task began to follow us home, and with it the feeling that we could always be doing more. The result is a kind of fatigue that sleep does not repair, because the mind never receives a clear signal that the work is finished.

The individual solutions sold to us — meditation apps, digital detox weekends — treat the symptom and leave the cause untouched. They assume that rest is a personal discipline rather than a collective arrangement. Yet no one can unplug from a workplace that rewards immediate replies. The most effective detox, it turns out, is other people agreeing to switch off at the same time.`,
    difficulty: 3,
    tags: ['职场与健康', '心理'],
    questions: [
      {
        id: 's3-r-2-q1',
        type: 'choice',
        stem: `What does the author mean by "a kind of fatigue that sleep does not repair" (Paragraph 2)?`,
        options: [
          `A tiredness caused by the mind never being told the work is over.`,
          `A physical injury caused by sitting too long at a desk.`,
          `A lack of sleep that a longer weekend can easily fix.`,
          `A temporary reaction to a single busy project.`
        ],
        answer: 0,
        explanation: `该短语指工作随工具进入日常后，头脑始终没有收到"工作已结束"的信号，因此这种疲惫不是靠睡眠能修复的。`,
        tag: '词义题',
        points: 1
      },
      {
        id: 's3-r-2-q2',
        type: 'choice',
        stem: `What is the main point of the last paragraph?`,
        options: [
          `Meditation apps are the most reliable cure for burnout.`,
          `Rest depends on shared arrangements, not only individual effort.`,
          `Digital detox weekends should be longer.`,
          `Employees should be rewarded for replying immediately.`
        ],
        answer: 1,
        explanation: `末段批评把休息视为个人自律的"个人化方案"，指出最有效的"排毒"是大家约定同时下线，即休息需要集体安排。`,
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 's3-t-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation · 职场心理健康',
    instructions: `阅读下面的中文段落，将其翻译成英文。`,
    passage: '',
    prompt: `近年来，越来越多的企业开始重视员工的心理健康。一些公司开设了心理咨询热线，提供免费的健身课程，并鼓励员工按时下班。研究者发现，当员工感到被尊重、能够自由安排部分工作时间时，他们的效率往往更高。不过，也有管理者担心，过于宽松的制度会让团队失去紧迫感。专家建议，企业应在信任与责任之间找到平衡。`,
    difficulty: 2,
    tags: ['社会类', '职场与健康'],
    questions: [
      {
        id: 's3-t-1-q1',
        type: 'translation',
        stem: `请将上面的段落翻译成英文。`,
        reference: `In recent years, more and more companies have begun to pay attention to their employees' mental health. Some companies have set up psychological counselling hotlines, offered free fitness classes and encouraged employees to leave work on time. Researchers have found that when employees feel respected and are free to arrange part of their working time, they tend to be more efficient. However, some managers worry that an overly relaxed system will make the team lose its sense of urgency. Experts suggest that companies should find a balance between trust and responsibility.`,
        keyPoints: [
          '越来越多企业重视员工心理健康',
          '具体举措：心理咨询热线、免费健身课程、鼓励按时下班',
          '研究发现被尊重、可自主安排部分时间时效率更高',
          '管理者担心制度过宽会使团队失去紧迫感',
          '专家建议在信任与责任之间取得平衡'
        ],
        minWords: 80,
        points: 1
      }
    ]
  }
];

