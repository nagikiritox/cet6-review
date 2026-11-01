/*
 * LAGOM CET-6 · 专项练习数据
 * window.CET6_DRILL_UNITS：18 个单元（听力 6 / 阅读 3 / 翻译 5 / 写作 4），共 24 题。
 * 全部材料为原创模拟内容，不包含任何真实考试原文。
 */

window.CET6_DRILL_UNITS = [
  /* ==================== 听力 ==================== */
  {
    id: 'dr-list-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation One · 图书馆媒体室',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-1.mp3',
    transcript: `Questions 1 to 2 are based on the conversation you have just heard.
W: I am looking for the media room. The website map says it is on the second floor, but all I can find are study desks.
M: The map is out of date. The room moved to the basement last summer when they renovated the second floor. Take the stairs next to the periodicals section.
W: Do I have to book it in advance, or can I just walk in?
M: You can walk in, but the recording equipment must be reserved a day ahead. And bring your student card, because the door only opens with it.
W: I am recording a podcast for my journalism course, so I will book the equipment tonight.
M: The room closes at eight, and food is not allowed inside.`,
    difficulty: 2,
    tags: ['校园', '细节题'],
    questions: [
      {
        id: 'dr-list-1-q1',
        type: 'choice',
        stem: 'What does the man say about the library map?',
        options: [
          'It no longer shows the correct location.',
          'It was removed from the library website.',
          'It is printed only once a year.',
          'It belongs to the periodicals section.'
        ],
        answer: 0,
        explanation: '男士说地图已经过时，媒体室去年已搬到地下一层，因此地图上的位置不再准确。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'dr-list-1-q2',
        type: 'choice',
        stem: 'What will the woman most probably do tonight?',
        options: [
          'Book the recording equipment.',
          'Interview a journalist.',
          'Move the study desks.',
          'Visit the periodicals section.'
        ],
        answer: 0,
        explanation: '女士说她要为新闻课录制播客，因此今晚会预订录音设备。',
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-list-2',
    module: 'listening',
    kind: 'news',
    title: 'News Report One · 共享工具图书馆',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-2.mp3',
    transcript: `Questions 1 to 2 are based on the news report you have just heard.
The city of Riverton will begin lending household tools, camping gear and small kitchen appliances from next Monday, in an effort to reduce waste. The pilot programme, called the Library of Things, will open in three neighbourhood centres and will be free for residents. Officials say most power drills are used for less than twenty minutes in their entire lifetime, and that sharing such items could keep hundreds of tonnes of metal out of landfills each year. Items can be borrowed for up to a week, but users must return them clean. The city plans to add gardening equipment in spring if the pilot proves popular.`,
    difficulty: 2,
    tags: ['城市', '主旨题'],
    questions: [
      {
        id: 'dr-list-2-q1',
        type: 'choice',
        stem: 'What is the main purpose of the programme?',
        options: [
          'To help residents repair their tools.',
          'To reduce waste by sharing rarely used items.',
          'To raise money for neighbourhood centres.',
          'To collect metal for local factories.'
        ],
        answer: 1,
        explanation: '新闻开头明确指出，该项目通过出借工具等物品来减少浪费，居民可免费借用。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'dr-list-2-q2',
        type: 'choice',
        stem: 'What will the city do if the pilot succeeds?',
        options: [
          'Charge a small membership fee.',
          'Open the centres seven days a week.',
          'Add gardening equipment in spring.',
          'Extend the borrowing period to a month.'
        ],
        answer: 2,
        explanation: '新闻结尾提到，如果试点受到欢迎，市政府计划在春季增加园艺工具。',
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-list-3',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture One · 注意力残留',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-3.mp3',
    transcript: `Questions 1 to 2 are based on the lecture you have just heard.
Good morning. Today I want to talk about what psychologists call attention residue, the mental fog that stays with us after we switch from one task to another. When you answer a message during a lecture, part of your mind remains on the conversation even after you put the phone away. One experiment found that students who switched tasks took nearly twice as long to return to their reading, and they remembered less of it. The lesson is not that phones are evil, but that the cost of interruption is invisible. If you must switch, write down where you stopped; a short note helps your brain close the old task before opening a new one.`,
    difficulty: 2,
    tags: ['学习心理', '细节题'],
    questions: [
      {
        id: 'dr-list-3-q1',
        type: 'choice',
        stem: 'What does the speaker mean by "attention residue"?',
        options: [
          'The mental fog left after switching tasks.',
          'A habit of checking messages during lectures.',
          'The time needed to finish a long reading task.',
          'The memory of facts learned before a break.'
        ],
        answer: 0,
        explanation: '讲者把 attention residue 解释为切换任务后仍留在脑海中的“精神迷雾”，即注意力残留。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'dr-list-3-q2',
        type: 'choice',
        stem: 'How does the speaker view smartphones in learning?',
        options: [
          'They are the main cause of poor memory.',
          'They are less harmful than students believe.',
          'They are useful if notes are written down.',
          'They are not the real problem behind distraction.'
        ],
        answer: 3,
        explanation: '讲者说“问题不在于手机本身”，真正的代价是打断注意力的隐藏成本。',
        tag: '态度题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-list-4',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation Two · 周末兼职面试',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-4.mp3',
    transcript: `Question 1 is based on the conversation you have just heard.
M: Morning, I am here about the weekend job advert, the bike repair shop on Mill Street.
W: Great. Have you worked with bikes before?
M: I fixed bikes for a rental company two summers ago, mostly brakes and gears. I can also do basic wheel truing.
W: That is more than we expected. The job is six hours on Saturdays, starting at nine. We pay twelve pounds an hour, and staff get a discount on parts. Could you start this weekend?
M: Yes, though I would need to finish by four because I have a class in the evening.
W: Fine. Bring your ID on Saturday and ask for me, Nora.`,
    difficulty: 2,
    tags: ['求职', '细节题'],
    questions: [
      {
        id: 'dr-list-4-q1',
        type: 'choice',
        stem: 'What do we learn about the man?',
        options: [
          'He has repaired bikes before.',
          'He works at the rental company now.',
          'He has never ridden a bike.',
          'He is a student at Mill Street.'
        ],
        answer: 0,
        explanation: '男士说两个夏天前他曾为一家租车公司修自行车，说明他有相关经验。',
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-list-5',
    module: 'listening',
    kind: 'news',
    title: 'News Report Two · 博物馆归还文物',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-5.mp3',
    transcript: `Question 1 is based on the news report you have just heard.
A university museum in the town of Ashfield has agreed to return four bronze sculptures to the island community where they were taken more than a century ago. The decision follows two years of talks between curators and community leaders. The sculptures will travel by sea next month and go on display in a new cultural centre built with support from the museum. In exchange, the museum will receive high-quality digital scans and will help train two local conservators. The director said the agreement was not a loss but a new kind of partnership.`,
    difficulty: 2,
    tags: ['文化', '细节题'],
    questions: [
      {
        id: 'dr-list-5-q1',
        type: 'choice',
        stem: 'What will the museum receive in return?',
        options: [
          'The right to keep two sculptures.',
          'A share of ticket sales.',
          'Digital scans and conservation training.',
          'A new cultural centre for its collection.'
        ],
        answer: 2,
        explanation: '新闻提到，作为交换，博物馆将获得高质量的数字扫描件，并帮助培训两名当地文物修复人员。',
        tag: '细节题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-list-6',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture Two · 城市热岛',
    instructions: '听录音，选择最佳答案。',
    audio: 'assets/audio/dr-list-6.mp3',
    transcript: `Question 1 is based on the lecture you have just heard.
Today we will look at why cities are often several degrees warmer than the countryside around them. Concrete and asphalt absorb heat during the day and release it slowly at night, while tall buildings trap warm air in the streets below. Even a single mature tree can cool the air around it by shading surfaces and releasing water vapour. Some cities now require new roofs to be painted white or covered with plants, and others have replaced dark car parks with small parks. The results are modest but measurable, and they benefit the poorest neighbourhoods most, because those areas usually have the least shade.`,
    difficulty: 3,
    tags: ['环境', '主旨题'],
    questions: [
      {
        id: 'dr-list-6-q1',
        type: 'choice',
        stem: 'What is the lecture mainly about?',
        options: [
          'Why cities are hotter and how they can be cooled.',
          'Why trees grow faster in the countryside.',
          'How to design car parks for new buildings.',
          'How weather records are collected in cities.'
        ],
        answer: 0,
        explanation: '讲座先解释城市为何更热（建材吸热、建筑困住热空气），再介绍降温措施，主旨即城市热岛及应对。',
        tag: '主旨题',
        points: 1
      }
    ]
  },

  /* ==================== 阅读 ==================== */
  {
    id: 'dr-read-1',
    module: 'reading',
    kind: 'passage',
    title: 'Passage One · 城市的第三空间',
    instructions: '阅读短文，选择最佳答案。',
    passage: `Ask people where they spend their days and most will name two places: home and work. Sociologists have long argued that a healthy community needs a third — a place that is neither, where people meet without an appointment. The cafe on the corner, the public library, the swimming pool and the community garden all qualify. What matters is not the activity but the easy, repeated contact: the same faces, the same time of day, the small exchanges that gradually turn strangers into acquaintances.

Such places are easy to take for granted until they disappear. When a local bookshop closes or a park is fenced off for redevelopment, residents lose more than a service; they lose the chance encounters that make a neighbourhood feel safe. Research on urban life suggests that weak ties — the nods and brief conversations with people we barely know — do more for our sense of belonging than close friendships, precisely because they are undemanding.

The challenge for planners is that third places rarely make much money. They survive on modest rents, volunteer effort and public funding, and they are the first to go when budgets are cut. Yet cities that protect them often discover that the investment pays back in ways that are hard to measure: lower loneliness, livelier streets and neighbours who are more willing to help one another.`,
    difficulty: 3,
    tags: ['城市生活', '细节题', '推断题'],
    questions: [
      {
        id: 'dr-read-1-q1',
        type: 'choice',
        stem: 'According to the passage, what makes a place a "third place"?',
        options: [
          'It is financed by the local government.',
          'It is neither home nor work and allows easy repeated contact.',
          'It hosts regular special events for residents.',
          'It is visited mainly by close friends.'
        ],
        answer: 1,
        explanation: '第一段指出，第三空间既不是家也不是工作场所，关键在于“轻松而重复的接触”，而非具体活动。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'dr-read-1-q2',
        type: 'choice',
        stem: 'What can be inferred about third places from the last paragraph?',
        options: [
          'They are socially valuable but financially fragile.',
          'They are becoming more profitable each year.',
          'They are best run by private companies.',
          'They are less important than close friendships.'
        ],
        answer: 0,
        explanation: '最后一段说第三空间“很少赚钱”、预算削减时最先被牺牲，却带来难以量化的社会回报，可见其社会价值高而经济上脆弱。',
        tag: '推断题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-read-2',
    module: 'reading',
    kind: 'passage',
    title: 'Passage Two · 算法推荐的代价',
    instructions: '阅读短文，选择最佳答案。',
    passage: `Every time we open a news app, an invisible editor has already decided what we will see. Recommendation systems rank stories by the likelihood that we will click, pause or share, and they learn from every choice we make. The result can feel convenient: the headlines that appear are usually the ones we find most engaging. But engagement is not the same as importance, and the two can pull in opposite directions.

Consider what happens when a story is merely interesting. It earns a moment of attention, while a story that is genuinely significant but difficult may be scrolled past. Over months, a diet of easy clicks can leave readers well informed about celebrities and poorly informed about the decisions that shape their lives — budget votes, planning meetings, the quiet work of local councils.

Some newsrooms are experimenting with what they call constructive journalism: reporting that explains how a problem might be addressed rather than simply describing it. Early studies suggest such stories hold attention almost as well as dramatic ones, and leave readers feeling more capable rather than more anxious. That is a useful lesson. Attention is a resource, and whoever designs the system decides, in advance, how much of it we spend and on what.`,
    difficulty: 3,
    tags: ['科技媒体', '细节题', '态度题'],
    questions: [
      {
        id: 'dr-read-2-q1',
        type: 'choice',
        stem: 'What does the author say about recommendation systems?',
        options: [
          'They rank stories by engagement rather than importance.',
          'They are designed by professional journalists.',
          'They hide all stories about local councils.',
          'They have replaced traditional newspapers.'
        ],
        answer: 0,
        explanation: '第一段说明推荐系统按点击、停留和分享的可能性给新闻排序，而“吸引力”并不等于“重要性”。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'dr-read-2-q2',
        type: 'choice',
        stem: "What is the author's attitude toward constructive journalism?",
        options: [
          'Doubtful, because it is too expensive to produce.',
          'Indifferent, since readers prefer dramatic stories.',
          'Cautiously supportive, as it may inform without increasing anxiety.',
          'Critical, because it avoids explaining the causes of problems.'
        ],
        answer: 2,
        explanation: '作者引用早期研究说明建设性新闻同样能吸引注意力，且让读者更有行动感，末句称其为“有用的经验”，态度是谨慎支持。',
        tag: '态度题',
        points: 1
      }
    ]
  },
  {
    id: 'dr-read-3',
    module: 'reading',
    kind: 'passage',
    title: 'Passage Three · 老手艺的新生',
    instructions: '阅读短文，选择最佳答案。',
    passage: `For centuries, the potters of a small valley in the east made bowls and jars from local clay, firing them in wood-burning kilns that had been rebuilt by the same families for generations. Then, within twenty years, plastic containers and cheap imports almost ended the craft. Today only a handful of workshops remain, and most of their owners are over sixty.

What saved them was not nostalgia but a change in customers. Younger buyers began to value objects that were made slowly and could be repaired, and they were willing to pay for the story behind them. Some potters started running weekend classes, which brought in income and, more importantly, apprentices. Others joined forces to share a single kiln and a website, cutting costs that no workshop could have carried alone.

Still, the revival is fragile. A single bad season, a rent increase or the retirement of one master can close a workshop for good. Those who study craft economies argue that the most effective support is not a grant for a single project but steady demand: public buildings that commission hand-made tiles, restaurants that use local tableware, schools that invite makers into classrooms. A tradition survives, in other words, not because it is preserved in a museum, but because people keep using what it produces.`,
    difficulty: 3,
    tags: ['传统文化', '细节题', '推断题'],
    questions: [
      {
        id: 'dr-read-3-q1',
        type: 'choice',
        stem: 'What helped the potters survive according to the passage?',
        options: [
          'Government grants for building new kilns.',
          'A change in customers who valued slow, repairable objects.',
          'The invention of a cheaper kind of clay.',
          'Museums that bought their whole collections.'
        ],
        answer: 1,
        explanation: '第二段开头说挽救他们的不是怀旧，而是顾客观念的变化：年轻买家开始看重慢工制作、可以修补的器物。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'dr-read-3-q2',
        type: 'choice',
        stem: 'What does the author imply is the best way to support crafts?',
        options: [
          'Preserving old tools in museums.',
          'Paying masters a monthly pension.',
          'Creating steady everyday demand for handmade goods.',
          'Restricting cheaper imported products by law.'
        ],
        answer: 2,
        explanation: '末段指出最有效的支持不是单笔资助，而是“稳定的需求”，即公共建筑、餐厅、学校持续使用手工制品。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  /* ==================== 翻译 ==================== */
  {
    id: 'dr-trans-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation One · 老城茶馆',
    instructions: '阅读下面的中文段落，将其翻译成英文。',
    prompt: `在老城区，茶馆不只是喝茶的地方。清晨，老人们提着鸟笼来此下棋、听评书；午后，年轻人带着电脑来工作；傍晚，邻居们围坐一桌，聊聊当天的新鲜事。茶馆的经营者并不富有，却愿意为熟客留一张空桌，为路人提供免费热水。近些年，一些茶馆加入小型演出和手作课堂，让传统曲艺与年轻人的生活重新连接。这种普通的空间承载着城市记忆，也让陌生人在一杯茶的距离内变成朋友。`,
    difficulty: 3,
    tags: ['文化类'],
    questions: [
      {
        id: 'dr-trans-1-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: `In many old neighbourhoods, a teahouse is more than a place to drink tea. In the early morning, elderly people arrive with their bird cages to play chess and listen to storytelling; in the afternoon, young people sit and work on their laptops; by evening, neighbours gather around a table and talk about the day's small events. The owners of these teahouses are often far from rich, yet they are willing to keep an empty table for regulars and to offer a free cup of hot water to passers-by. In recent years, some teahouses have begun to host small performances and handicraft classes, reconnecting traditional folk arts with the lives of younger people. This ordinary-looking space carries the memory of a city, and it turns strangers into friends within the distance of a cup of tea.`,
        keyPoints: [
          '老城区茶馆兼具饮茶、社交与文化功能',
          '茶馆经营者对熟客与路人的善意',
          '近年茶馆通过演出与手作课堂实现创新',
          '茶馆承载城市记忆并连接陌生人'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },
  {
    id: 'dr-trans-2',
    module: 'translation',
    kind: 'task',
    title: 'Translation Two · 社区便民食堂',
    instructions: '阅读下面的中文段落，将其翻译成英文。',
    prompt: `近年来，许多城市社区办起了便民食堂。它们多设在居民楼附近，价格不高，菜品简单，却解决了不少老人的困难：做饭费时费力，一个人吃饭又常凑合。食堂的厨师会记住谁不吃辣、谁需要少盐；志愿者在午餐时帮行动不便的老人把饭菜送到家。一些社区把食堂旁的空房间改成活动室，饭前可以量血压，饭后可以下棋、做手工。这些安排看似琐碎，却让邻里重新来往，也让独居老人不必整天在家。`,
    difficulty: 3,
    tags: ['社会类'],
    questions: [
      {
        id: 'dr-trans-2-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: `In recent years, more and more urban communities have opened low-cost canteens for residents. Most are located close to apartment buildings, and although prices are low and the dishes are simple, they solve a real difficulty for many elderly people: cooking takes time and energy, and eating alone often means making do with something quick. The cooks remember who cannot eat spicy food and who needs less salt, while volunteers deliver meals to the homes of older residents who have difficulty moving around. Some communities have turned the empty rooms beside the canteens into activity rooms, where people can have their blood pressure checked before lunch and play chess or do handicrafts afterwards. These arrangements may look minor, but they have brought neighbours into contact again, so that people who live alone no longer have to stay indoors all day.`,
        keyPoints: [
          '社区便民食堂的兴起与低价定位',
          '食堂解决老人做饭与独自吃饭的困难',
          '厨师与志愿者提供个性化服务',
          '活动室让邻里交往重新恢复'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },
  {
    id: 'dr-trans-3',
    module: 'translation',
    kind: 'task',
    title: 'Translation Three · 博物馆数字化',
    instructions: '阅读下面的中文段落，将其翻译成英文。',
    prompt: `如今，许多博物馆正把展厅搬到网上。观众只需轻点屏幕，就能放大观看古画的笔触，甚至通过虚拟现实走进一座早已消失的庭院。数字技术不只带来方便：对脆弱的手稿，高精度扫描可在不接触原件的情况下记录每处细节，为后人修复提供依据。不过，专家也提醒，技术无法代替亲眼观看原作的感受。因此，更好的做法是让线上展览承担普及知识，而把博物馆留给愿意静下心来观看的人。`,
    difficulty: 3,
    tags: ['科技类'],
    questions: [
      {
        id: 'dr-trans-3-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: `Today, many museums are moving their exhibition halls onto the internet. With a single tap on the screen, visitors can zoom in on the brushwork of an ancient painting or even, through virtual reality, walk into a courtyard that disappeared long ago. The value of digital technology goes beyond convenience: for fragile manuscripts, high-precision scanning can record every detail without touching the original, providing evidence for future restoration. Experts remind us, however, that technology cannot replace the experience of seeing a work in person. A better approach, therefore, is to let online exhibitions spread knowledge while leaving the museum to those who are truly willing to slow down and look closely at the real thing. Used in this way, the two kinds of experience support each other rather than compete.`,
        keyPoints: [
          '博物馆将展览搬到线上并借助虚拟现实',
          '高精度扫描对脆弱文物的保护价值',
          '数字技术无法替代亲眼观看的体验',
          '线上普及与线下观看的合理分工'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },
  {
    id: 'dr-trans-4',
    module: 'translation',
    kind: 'task',
    title: 'Translation Four · 小店数字化',
    instructions: '阅读下面的中文段落，将其翻译成英文。',
    prompt: `过去，小店主记账靠本子，进货靠经验和熟人。如今，越来越多夫妻店开始用简单的数字工具：手机一扫，就知道哪种商品卖得快、库存还剩多少；系统还会提醒，某个品牌的饮料在周末更受欢迎。这些工具并不昂贵，却让小店在大型超市和电商的夹击下多了底气。专家认为，帮助小微商户数字化，关键不是推销昂贵设备，而是提供便宜、易学、能解决问题的服务，同时留出时间让他们与顾客打交道。`,
    difficulty: 3,
    tags: ['经济类'],
    questions: [
      {
        id: 'dr-trans-4-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: `In the past, a shop owner kept accounts in a notebook and decided what to order on the basis of experience and personal contacts. Today, more and more family-run stores are using simple digital tools: with one scan on a phone, the owner knows which goods are selling quickly and how much stock is left, and the system reminds them that a certain brand of drink tends to sell better at weekends. These tools are not expensive, yet they give small shops more confidence when competing with large supermarkets and online retailers. In the view of experts, the key to helping small businesses go digital is not to sell them expensive equipment, but to provide services that are cheap, easy to learn and genuinely useful, while leaving them enough time to talk with their customers.`,
        keyPoints: [
          '小店过去依靠本子与经验的经营方式',
          '数字工具帮助店主了解销售与库存',
          '数字工具让小店更有竞争力',
          '小微商户数字化的关键在于实用与低成本'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },
  {
    id: 'dr-trans-5',
    module: 'translation',
    kind: 'task',
    title: 'Translation Five · 湿地与候鸟',
    instructions: '阅读下面的中文段落，将其翻译成英文。',
    prompt: `每年秋天，候鸟会沿着海岸线向南迁徙，在滩涂上停留、觅食。过去，这些地方常被视为荒地，被填平后盖起工厂和住宅。近十年，一些城市开始把滩涂恢复成湿地，拆除围堰，控制污染，并在周边设立安静区，减少灯光和噪声的干扰。当地渔民也被邀请参与巡护，成为湿地的守护者。如今，候鸟的数量逐年回升，观鸟爱好者带来了新的收入，孩子们也终于能在课本之外认识这些远道而来的客人。`,
    difficulty: 3,
    tags: ['生态类'],
    questions: [
      {
        id: 'dr-trans-5-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: `Every autumn, flocks of migratory birds travel south along the coastline, stopping to rest and feed on stretches of tidal flats. In the past, these places were often regarded as useless wasteland and were filled in to make room for factories and housing. Over the past decade, some cities have begun to restore the flats into wetlands, removing dikes, controlling pollution and creating quiet zones nearby to reduce disturbance from light and noise. Local fishermen have also been invited to join patrols and become guardians of the wetlands. Today, the number of migratory birds is rising year by year, birdwatchers bring new income, and children can finally meet these guests from afar outside their textbooks. The wetlands have thus become a place where protection and daily life support each other.`,
        keyPoints: [
          '候鸟迁徙在滩涂停留觅食',
          '过去滩涂被填埋建厂建房的现实',
          '近十年湿地恢复的具体措施',
          '渔民参与巡护并带来生态与经济收益'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },

  /* ==================== 写作 ==================== */
  {
    id: 'dr-write-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing One · 议论文：毕业前社区服务',
    instructions: '根据提示完成写作任务，注意字数要求。',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay on whether university students should be required to complete a community service project before graduation. You should state your opinion and support it with reasons. Write at least 150 words but no more than 200 words.`,
    difficulty: 3,
    tags: ['议论文'],
    questions: [
      {
        id: 'dr-write-1-q1',
        type: 'writing',
        stem: 'Write your essay on the answer sheet according to the directions above.',
        reference: `Some universities now require students to complete a community service project before they graduate. In my view, such a requirement is reasonable, provided that it is flexible and well organised.

The strongest argument for community service is that it turns abstract ideas into experience. A student who spends a few hours a week helping at a care home or tutoring children learns things no lecture can teach: how to listen, how to explain, and how to deal with people whose lives are very different from their own. These skills are exactly what employers say they value.

Critics worry that a compulsory requirement may become a box-ticking exercise. That risk is real, but it can be reduced. Universities should offer a wide range of placements, allow students to count existing volunteering, and assess reflection rather than hours. If the design is careful, the requirement does not take freedom away; it gives students a reason to step outside the campus and discover what they are good at.`,
        keyPoints: [
          '明确表明对毕业前社区服务要求的立场',
          '以技能与经验论证其价值',
          '回应“流于形式”的担忧并提出改进建议',
          '总结要求并不限制自由'
        ],
        minWords: 150,
        points: 1
      }
    ]
  },
  {
    id: 'dr-write-2',
    module: 'writing',
    kind: 'task',
    title: 'Writing Two · 图表作文：图书馆借阅方式',
    instructions: '根据提示完成写作任务，注意字数要求。',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay based on the table below. The table shows how residents of the city of Riverton borrowed books from the public library between 2018 and 2024.

Year: 2018 — in person 72%, online 28%
Year: 2021 — in person 54%, online 46%
Year: 2024 — in person 38%, online 62%

You should describe the information, explain the trend, and predict one further change. Write at least 150 words but no more than 200 words.`,
    difficulty: 3,
    tags: ['图表作文'],
    questions: [
      {
        id: 'dr-write-2-q1',
        type: 'writing',
        stem: 'Write your essay on the answer sheet according to the directions above.',
        reference: `The table compares how residents of Riverton borrowed library books between 2018 and 2024. Two trends stand out.

First, visits to the physical library fell sharply, from 72 per cent of users in 2018 to 38 per cent in 2024. Second, use of the online service rose from 28 per cent to 62 per cent, overtaking in-person borrowing sometime between 2021 and 2024. The two figures are, of course, two sides of the same change: as borrowing moved onto phones, the building became less busy.

Several factors explain the shift. Digital catalogues are easier to search, e-books never need returning, and the habit formed during the years when many buildings were closed proved hard to break. Convenience, in short, won.

What might happen next? I expect libraries to invest further in digital collections, but also to redesign their physical space around what screens cannot offer: quiet study rooms, children's reading corners and free help with research. The library may become less a warehouse of books than a place where people come to learn together.`,
        keyPoints: [
          '概括两类借阅方式的变化趋势',
          '引用具体数据对比 2018 与 2024 年',
          '解释变化背后的原因',
          '对图书馆的未来提出合理预测'
        ],
        minWords: 150,
        points: 1
      }
    ]
  },
  {
    id: 'dr-write-3',
    module: 'writing',
    kind: 'task',
    title: 'Writing Three · 书信：致报社编辑的建议信',
    instructions: '根据提示完成写作任务，注意书信格式与字数要求。',
    prompt: `Directions: For this part, you are allowed 30 minutes to write a letter to the editor of your local newspaper. In the letter, you should propose that Market Street in the town centre be closed to cars on Sunday mornings, explain the benefits, and suggest how to deal with possible problems. Write at least 150 words but no more than 200 words. Do not sign your own name at the end of the letter; use "Li Ming" instead.`,
    difficulty: 3,
    tags: ['书信'],
    questions: [
      {
        id: 'dr-write-3-q1',
        type: 'writing',
        stem: 'Write your letter on the answer sheet according to the directions above.',
        reference: `Dear Editor,

I am writing to suggest that Market Street, in the centre of our town, should be closed to cars on Sunday mornings. I believe this small change would make the town more pleasant for everyone.

At present, the street is crowded and noisy, and the pavement is too narrow for families with pushchairs or for people in wheelchairs. If cars were kept out for four hours, cafes could put tables outside, children could cycle safely, and the weekly market could expand onto the road. Shops might actually gain customers, because people tend to stay longer where they feel comfortable.

Some readers will worry about deliveries and access. These concerns are reasonable, and they can be solved: deliveries could be allowed before ten o'clock, and nearby car parks could offer two hours of free parking on Sundays. A six-month trial would show whether the idea works.

I hope you will consider publishing this letter so that residents can share their views.

Yours faithfully,
Li Ming`,
        keyPoints: [
          '说明写信目的与具体建议',
          '阐述步行街区带来的好处',
          '回应送货与停车等顾虑',
          '提出试行方案并请求刊发'
        ],
        minWords: 150,
        points: 1
      }
    ]
  },
  {
    id: 'dr-write-4',
    module: 'writing',
    kind: 'task',
    title: 'Writing Four · 现象解释：数字排毒周末',
    instructions: '根据提示完成写作任务，注意字数要求。',
    prompt: `Directions: For this part, you are allowed 30 minutes to write an essay explaining why a growing number of young people in cities have started to spend their weekends doing a "digital detox" — leaving their phones at home and spending the day outdoors or with friends. You should explain the likely reasons for this phenomenon and comment on it. Write at least 150 words but no more than 200 words.`,
    difficulty: 3,
    tags: ['现象解释'],
    questions: [
      {
        id: 'dr-write-4-q1',
        type: 'writing',
        stem: 'Write your essay on the answer sheet according to the directions above.',
        reference: `Walk into any park on a sunny Saturday and you will notice a small but growing group of young people who have deliberately left their phones at home. The "digital detox weekend" has become a quiet fashion, and it is worth asking why.

One reason is exhaustion. Many young office workers spend eight hours a day in front of screens and are then expected to answer messages in the evening. By Saturday, the phone has stopped feeling like a tool and started feeling like a supervisor. Another reason is the search for real experience: a hike, a cooking class or an afternoon of board games gives a sense of time passing that a scrolling session never does. Finally, these weekends have become social. Friends arrange them together, which makes putting the phone away easier and more enjoyable.

I find the trend encouraging, though I would avoid treating it as a cure. A day offline does not fix an unreasonable workload, and it should not become another performance to photograph. Used sensibly, however, it is a useful reminder: attention is ours to spend, and we should spend some of it on the world in front of us.`,
        keyPoints: [
          '描述“数字排毒周末”这一现象',
          '分析现象背后的原因：疲劳、真实体验、社交',
          '评价该现象并指出其局限',
          '给出自己的结论与建议'
        ],
        minWords: 150,
        points: 1
      }
    ]
  }
];
