/*!
 * LAGOM CET-6 · 全真模拟题（Mock Test 1 / Mock Test 2）
 * 数据文件：window.CET6_MOCK_UNITS
 * 内容全部原创，难度与题型参照大学英语六级考试，仅供练习。
 */

window.CET6_MOCK_UNITS = [
  /* ==================== MOCK TEST 1 ==================== */

  // ---------- m1-w-1 写作 ----------
  {
    id: 'm1-w-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing · 议论文：志愿服务应否成为毕业要求',
    instructions: '请在 30 分钟内完成写作：立场明确、论证充分、结构清晰，字数 160–200 词。',
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on whether volunteering should be a graduation requirement for university students. You should state your opinion clearly and support it with reasons. You should write at least 160 words but no more than 200 words.',
    passage: '',
    difficulty: 2,
    tags: ['议论文', '教育'],
    questions: [
      {
        id: 'm1-w-1-q1',
        type: 'writing',
        stem: 'Write an essay on whether volunteering should be a graduation requirement for university students.',
        reference: "Universities increasingly ask students to do more than pass examinations, and some now propose that community service become a graduation requirement. In my view, such a requirement is reasonable, provided that it is designed with flexibility.\n\nFirst, volunteering pushes students out of the classroom and into real social problems. A student who spends one afternoon a week helping elderly residents use smartphones understands isolation far better than any lecture could teach. Second, service builds skills that employers value: communication, patience and the ability to work with people whose backgrounds differ from our own. Third, a shared obligation creates a sense of community, since everyone contributes instead of a few enthusiasts doing all the work.\n\nYet a requirement can easily become a box-ticking exercise. If students are forced into a single kind of activity, or if their hours are counted but their reflection is ignored, the programme will produce resentment instead of growth. The solution is not to abandon the idea but to offer a wide range of placements and to ask for a short reflection at the end.\n\nIn short, compulsory service is worth adopting if it respects students' choices and treats them as partners rather than unpaid labour.",
        keyPoints: [
          '开门见山表明自己支持或反对的立场',
          '给出 2–3 条理由并配具体例子（能力、社区、就业）',
          '指出强制要求可能带来的问题并提出改进办法',
          '结尾总结立场，语言简洁有力'
        ],
        minWords: 160,
        points: 1
      }
    ]
  },

  // ---------- m1-l-1 对话（3 题） ----------
  {
    id: 'm1-l-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation One · 校园二手书交换架',
    instructions: 'Listen to the conversation and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m1-l-1.mp3',
    transcript: `Questions 1 to 3 are based on the conversation you have just heard.

W: Good morning, and welcome to Campus Weekly. I'm with Daniel, a third-year economics student who started the Swap Shelf. Daniel, what exactly is it?
M: It's a wooden shelf outside the library where students leave textbooks they no longer need and take whatever they can use. No money, no registration.
W: How did the idea come to you?
M: Last summer I worked out that I had spent nearly six hundred yuan on books in two years, and half were sitting unopened. Meanwhile a friend in the year below was paying postage to buy exactly those titles online.
W: Has the university been supportive?
M: The library gave us a shelf and a notice board. The students' union was more cautious; they wanted records of who takes what. I argued that trust was the whole point, and we agreed to trial it for one semester without any paperwork.
W: And the results?
M: In ten weeks about four hundred books have moved, and only two people have complained. What surprised me most is that the shelf has become a meeting place. People linger and talk about their courses.`,
    difficulty: 2,
    tags: ['校园', '环保'],
    questions: [
      {
        id: 'm1-l-1-q1',
        type: 'choice',
        stem: 'What is the Swap Shelf?',
        options: [
          'Online platform for selling used textbooks',
          'Shelf outside the library where students exchange books',
          'Service that rents textbooks to first-year students',
          'Charity that gives free books to poor students'
        ],
        answer: 1,
        explanation: '对话开头男士介绍：书架设在图书馆外，学生把不再需要的教材放在那里，也可以取用自己需要的书，不收钱、不需登记，因此选“图书馆外的换书架”。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-l-1-q2',
        type: 'choice',
        stem: 'Why did Daniel start the Swap Shelf?',
        options: [
          'He wanted to reduce the cost of books for himself and others',
          'He was asked to do so by the students union',
          'He hoped to make a profit from second-hand books',
          'He needed data for his economics project'
        ],
        answer: 0,
        explanation: '男士说他两年买书花了近六百元且一半未拆封，而低年级的朋友正花钱网购这些书，可见他想让自己和他人都少花钱。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-l-1-q3',
        type: 'choice',
        stem: "What can be learned about the students' union's attitude?",
        options: [
          'It refused to support the project at all',
          'It demanded a share of the income',
          'It was cautious but agreed to a trial semester',
          'It wanted the shelf moved inside the library'
        ],
        answer: 2,
        explanation: '男士说学生会态度更谨慎，要求记录取书情况，最后同意在不填表的情况下试用一学期，说明其态度是“谨慎但同意试用”。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m1-l-2 新闻（2 题） ----------
  {
    id: 'm1-l-2',
    module: 'listening',
    kind: 'news',
    title: 'News Report One · 城市图书馆延时开放',
    instructions: 'Listen to the news report and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m1-l-2.mp3',
    transcript: `Questions 1 to 2 are based on the news report you have just heard.

The city of Linhe has announced that its central library will keep one reading room open until midnight from next month, following a two-month trial in which more than nine thousand visits were recorded after ten in the evening. Officials say the trial attracted mostly students preparing for public examinations, night-shift nurses and delivery workers who finish late. The library will add thirty study seats and a coffee counter, and the extra cost, about half a million yuan a year, will be covered by a local technology firm rather than by public funds. However, the library's director admitted that security and cleaning staff must also work longer hours, and that a permanent service will depend on whether other businesses are willing to help. A survey conducted during the trial found that seven out of ten readers said they would renew their library cards.`,
    difficulty: 2,
    tags: ['社会', '公共文化'],
    questions: [
      {
        id: 'm1-l-2-q1',
        type: 'choice',
        stem: 'What will the central library in Linhe do from next month?',
        options: [
          "Keep one reading room open until midnight",
          'Build a new branch in the south of the city',
          'Offer free delivery of books to readers',
          'Close its main hall for renovation'
        ],
        answer: 0,
        explanation: '新闻开头即说明：该市中央图书馆将从下月起把一间阅览室开放至午夜，此前已试行两个月。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-l-2-q2',
        type: 'choice',
        stem: "What concern did the library's director mention?",
        options: [
          'The collection is too small for the readers',
          'The noise may disturb nearby residents',
          'Longer hours mean extra staffing and operating costs',
          'Local firms have refused to fund the project'
        ],
        answer: 2,
        explanation: '馆长承认保安和清洁人员也要延长工作时间，长期服务还取决于其他商家是否愿意资助，可见顾虑在于延长开放带来的人手与运营成本。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m1-l-3 讲座（3 题） ----------
  {
    id: 'm1-l-3',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture One · 城市热岛效应',
    instructions: 'Listen to the lecture and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m1-l-3.mp3',
    transcript: `Questions 1 to 3 are based on the lecture you have just heard.

Good afternoon. Today I want to talk about something everyone in this room has experienced but few can measure: the fact that a city is warmer than the countryside around it. On a summer afternoon the difference can reach five degrees. The cause is not mysterious. Dark roofs and asphalt absorb sunlight through the day and release it slowly at night. Cars and air conditioners add heat directly. And tall buildings on both sides of a street prevent warm air from escaping, so the heat sits there like water in a bathtub.

For planners, heat now matters because it is the deadliest weather hazard in many countries, and it kills unevenly. Neighbourhoods with little vegetation and old housing are more dangerous than leafy districts only a kilometre away.

The good news is that the remedies are cheap compared with, say, rebuilding roads. Painting roofs in lighter colours can lower surface temperatures dramatically. Street trees cool the air both by shading and by releasing water vapour. Replacing dark pavement with light-coloured material or grass also reduces the amount of heat stored.

The lesson is simple: before we design another car park, we should ask how it will feel at four o'clock on the hottest day of July.`,
    difficulty: 3,
    tags: ['环境', '城市'],
    questions: [
      {
        id: 'm1-l-3-q1',
        type: 'choice',
        stem: 'What is the lecture mainly about?',
        options: [
          'Why cities are hotter than the countryside and how to cool them',
          'How to design more efficient air conditioners',
          'Why young people are leaving rural areas',
          'The history of road construction in cities'
        ],
        answer: 0,
        explanation: '讲者在开头即点明主题：城市为何比周边乡村更热，随后又介绍了可行的降温办法，故选“城市更热的原因及降温手段”。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm1-l-3-q2',
        type: 'choice',
        stem: 'According to the speaker, what prevents warm air from escaping?',
        options: [
          'Dark roofs that release heat at night',
          'Tall buildings on both sides of streets',
          'Air conditioners running in shops',
          'Shortage of water in the city'
        ],
        answer: 1,
        explanation: '讲者说街道两侧的高楼使热空气无法散出，热量像浴缸里的水一样积在那里。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-l-3-q3',
        type: 'choice',
        stem: 'What does the speaker suggest city planners should do?',
        options: [
          'Rebuild existing roads with concrete',
          'Move residents out of the densest districts',
          'Consider heat when designing new spaces',
          'Plant trees only in wealthy neighbourhoods'
        ],
        answer: 2,
        explanation: '结尾建议：在设计新的停车场之类空间之前，先想一想它在最热的七月下午会是什么感受，即规划时就要把热量因素考虑进去。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m1-r-1 阅读一 ----------
  {
    id: 'm1-r-1',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage One · 社区修补咖啡馆',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `Not long ago, throwing away a broken toaster and buying a new one was the obvious choice for most households in wealthy economies. Repair cafés, small volunteer-run gatherings where people bring damaged objects and are helped to fix them, have quietly challenged that habit. The first opened in Amsterdam in 2009; there are now thousands across Europe and North America.\n\nThe appeal is partly financial, but mostly social. Volunteers are not experts so much as people who enjoy taking things apart. A visitor with a broken lamp is not simply handed a repaired lamp; they sit beside a volunteer, look at the wiring, and learn why the switch failed. Many organisations report that once people have repaired an object themselves, they are far less willing to discard a similar one in future.\n\nRepair cafés also generate knowledge that manufacturers no longer provide. Operating manuals have shrunk as products became cheaper and more complex, and some devices are deliberately sealed so that they cannot be opened without special tools. In this situation, a table of volunteers with screwdrivers and a box of spare plugs can do what an official service centre, often charging more than the object is worth, will not.\n\nCritics point out that repair cafés cannot address the scale of the problem. They depend on the goodwill of a few hundred volunteers, they open for a few hours a week, and they cannot mend a sealed battery. Yet their significance may lie elsewhere: they show that a product need not be treated as disposable, and they give ordinary people a practical vocabulary for questioning how things are designed.`,
    difficulty: 2,
    tags: ['环境', '消费'],
    questions: [
      {
        id: 'm1-r-1-q1',
        type: 'choice',
        stem: 'What is the passage mainly about?',
        options: [
          'Why household appliances are made so poorly',
          'The social and educational value of repair cafés',
          'How volunteers earn money by repairing objects',
          'The history of recycling in Europe'
        ],
        answer: 1,
        explanation: '文章介绍修补咖啡馆的兴起，重点讲其社会与教育价值（动手学习、传递知识、改变消费观念），同时承认其局限，故主旨为第二项。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm1-r-1-q2',
        type: 'choice',
        stem: 'What do many organisations report about people who repair an object themselves?',
        options: [
          'They are less likely to discard similar objects later',
          'They tend to buy more new appliances',
          'They often become volunteers in other projects',
          'They complain about the price of repairs'
        ],
        answer: 0,
        explanation: '第二段末指出，许多组织报告说，人们亲手修好一件物品之后，将来更不愿意丢弃类似的东西。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-r-1-q3',
        type: 'choice',
        stem: 'The word "sealed" in the third paragraph most probably means ___.',
        options: [
          'sold only in official shops',
          'covered with a protective label',
          'designed so that they are hard to open',
          'made of expensive materials'
        ],
        answer: 2,
        explanation: '第三段说有些设备被故意“封住”，不用特殊工具就打不开，因此 sealed 意为“被设计成难以打开的”。',
        tag: '词义题',
        points: 1
      }
    ]
  },

  // ---------- m1-r-2 阅读二 ----------
  {
    id: 'm1-r-2',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage Two · 人工智能与医疗诊断',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `Few areas of medicine have attracted as much excitement, or as much anxiety, as artificial intelligence. Algorithms can now read a chest image or a retinal scan with an accuracy that matches, and occasionally exceeds, that of experienced specialists. The temptation is to conclude that machines will soon replace a substantial part of a doctor's work. That conclusion is premature.\n\nThe first reason is context. A skilled diagnostician does not simply look at one image; she interprets it in the light of a patient's history, medication, previous results and present circumstances. An algorithm trained on images taken in one hospital may perform poorly on images from another, because cameras, patients and working practices differ. The apparent expertise of a system, in other words, depends heavily on where and how it was trained.\n\nThe second reason is accountability. When a diagnosis is wrong, someone must explain why — to the patient and, if necessary, to a regulator. A system that produces a probability without a reason does not fit easily into that conversation.\n\nNone of this means AI has no place in medicine. Its most convincing successes so far are in narrow, high-volume tasks: screening large numbers of scans so that urgent cases rise to the top, or reminding a busy doctor that two drugs may interact. Such uses leave decisions where they belong while saving hours that can be spent with patients. The technology is not replacing the doctor; it is changing what the doctor spends time on.`,
    difficulty: 3,
    tags: ['科技', '医疗'],
    questions: [
      {
        id: 'm1-r-2-q1',
        type: 'choice',
        stem: "What is the author's main point about AI in medicine?",
        options: [
          'It will soon replace most doctors in hospitals',
          'It is best used as a tool that supports rather than replaces doctors',
          'It is less accurate than doctors in every field',
          'It should be banned until it can explain itself'
        ],
        answer: 1,
        explanation: '作者承认 AI 在影像判读上的准确度，但用“情境”和“可问责性”两点说明其局限，最终主张 AI 是辅助而非替代医生的工具。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm1-r-2-q2',
        type: 'choice',
        stem: 'Why may an algorithm trained in one hospital perform poorly in another?',
        options: [
          'Because doctors there refuse to use new technology',
          'Because the algorithm needs more computing power',
          'Because imaging equipment and patient groups differ',
          'Because patients are unwilling to share their scans'
        ],
        answer: 2,
        explanation: '第二段指出，在别家医院拍摄的图像上，算法可能表现不佳，原因是设备、患者和操作流程都不同。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-r-2-q3',
        type: 'choice',
        stem: 'Which use of AI does the author consider convincing?',
        options: [
          'Replacing radiologists in large hospitals',
          'Reading images without any human supervision',
          'Deciding which patients should receive treatment',
          'Sorting urgent scans so that serious cases are seen first'
        ],
        answer: 3,
        explanation: '末段说 AI 最令人信服的用途是筛查大量影像、让紧急病例排在前面，或提醒医生注意药物相互作用，即排序与提示，而非替代决策。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m1-r-3 阅读三 ----------
  {
    id: 'm1-r-3',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage Three · 夜行列车的复兴',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `For decades, night trains seemed an obsolete relic. Cheap flights made it possible to cross a continent in two hours, and rail companies found sleeper cars expensive to run and difficult to fill. Services shrank year after year.\n\nNow the direction has reversed. A new generation of travellers, uneasy about the carbon footprint of flying, has rediscovered the pleasure — and the practicality — of falling asleep in one city and waking in another. A growing number of start-ups have ordered new sleeping cars, and several established operators have returned to routes they abandoned a decade ago.\n\nPart of the appeal is that a night train saves a hotel bill and a working day at the same time. Yet the economics remain awkward. A sleeper car carries fewer passengers than a seated coach, consumes more energy per person, and needs staff through the night. Ticket prices therefore have to be high enough to cover costs but low enough to compete with budget airlines — a narrow window that few routes manage to hit.\n\nThe infrastructure problem is harder still. Cross-border services need timetables and safety rules to be coordinated between countries, and a train that waits three hours at a border is useless to everyone. European governments have begun to discuss common booking systems, but progress is slow. The revival of night trains, then, depends less on nostalgia than on whether governments are willing to treat rail as public infrastructure rather than as a business alone.`,
    difficulty: 2,
    tags: ['交通', '环境'],
    questions: [
      {
        id: 'm1-r-3-q1',
        type: 'choice',
        stem: 'What is the passage mainly about?',
        options: [
          'The environmental cost of cheap short flights',
          'Why night trains are returning and what limits their growth',
          'The history of European railway companies',
          'How travellers can book cheap sleeper tickets'
        ],
        answer: 1,
        explanation: '文章先说夜行列车衰落、如今需求回升，再分析其经济与跨境基础设施方面的限制，主旨为“夜行列车复兴的原因与制约”。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm1-r-3-q2',
        type: 'choice',
        stem: 'According to the passage, why are sleeper tickets expensive to price?',
        options: [
          'Sleeper cars carry fewer passengers and need staff at night',
          'Rail companies must pay high taxes on night services',
          'Sleeper cars are older than ordinary coaches',
          'Few travellers are willing to share a compartment'
        ],
        answer: 0,
        explanation: '第三段指出卧铺车厢载客少于普通车厢、人均能耗更高，且整夜需要乘务人员，因此票价必须在成本与廉价航空的竞争之间找平衡。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm1-r-3-q3',
        type: 'choice',
        stem: 'What does the author suggest is the key to the revival of night trains?',
        options: [
          'Nostalgia among older travellers',
          'Lower ticket prices than short flights',
          'Governments treating rail as public infrastructure',
          'Orders for new sleeping cars from start-ups'
        ],
        answer: 2,
        explanation: '末段总结说，复兴“与其说取决于怀旧，不如说取决于政府是否愿意把铁路当作公共基础设施，而不仅是一门生意”。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m1-t-1 翻译 ----------
  {
    id: 'm1-t-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation · 中国茶文化',
    instructions: '请将下面的段落翻译成英文，注意用词准确、语法正确、语篇连贯。',
    prompt: '茶在中国人的日常生活中占有重要地位。相传数千年前，中国人就开始种茶、饮茶。唐代以后，饮茶逐渐从贵族的享受变成普通百姓的习惯。如今无论城乡，人们常以一杯茶待客，或在忙碌之余独自品茶。茶馆不仅是饮茶的地方，也是人们交谈、下棋、听书的社交空间。中国的茶文化强调和谐与耐心：烧水、泡茶、品茶都需要时间。这种慢节奏的生活方式，吸引了越来越多希望放慢脚步的年轻人。',
    passage: '',
    difficulty: 2,
    tags: ['文化类'],
    questions: [
      {
        id: 'm1-t-1-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: "Tea occupies an important place in the daily life of the Chinese people. Legend has it that the Chinese began to grow and drink tea several thousand years ago. After the Tang Dynasty, tea drinking gradually changed from a luxury enjoyed by the nobility into a habit of ordinary people. Today, in both cities and the countryside, people often welcome guests with a cup of tea, or enjoy tea alone in their spare moments. Tea houses are not only places for drinking tea; they are also social spaces where people talk, play chess and listen to storytelling. Chinese tea culture stresses harmony and patience: boiling water, brewing tea and tasting it all take time. This slower way of life has attracted a growing number of young people who wish to slow down.",
        keyPoints: [
          '茶在国人日常生活中的重要地位',
          '饮茶从贵族享受普及为百姓习惯的历史变化',
          '以茶待客与茶馆的社交功能',
          '茶文化强调和谐与耐心、讲究时间',
          '慢节奏生活吸引希望放慢脚步的年轻人'
        ],
        minWords: 120,
        points: 1
      }
    ]
  },

  /* ==================== MOCK TEST 2 ==================== */

  // ---------- m2-w-1 写作 ----------
  {
    id: 'm2-w-1',
    module: 'writing',
    kind: 'task',
    title: 'Writing · 议论文：四天工作制',
    instructions: '请在 30 分钟内完成写作：观点明确、论证有层次、语言准确，字数 160–200 词。',
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on whether companies should move to a four-day working week. You should state your opinion and support it with reasons. You should write at least 160 words but no more than 200 words.',
    passage: '',
    difficulty: 2,
    tags: ['议论文', '职场'],
    questions: [
      {
        id: 'm2-w-1-q1',
        type: 'writing',
        stem: 'Write an essay on whether companies should move to a four-day working week.',
        reference: "A number of firms have recently experimented with paying staff the same salary for four days of work instead of five, and the results are more interesting than the headlines suggest. In my view, the four-day week deserves serious trials, though it does not suit every industry.\n\nThe strongest argument is about attention rather than hours. In many offices the fifth day is the least productive: meetings are squeezed in and work is stretched to fill the time available. Removing a day forces managers to cut unnecessary meetings and to decide what actually matters. Trials in several countries have reported fewer sick days and lower staff turnover, which offset part of the cost of hiring.\n\nThere are limits. A hospital cannot close on Fridays, and a small shop may need its staff present when customers are. For such workplaces, shorter daily shifts or flexible rotas are more realistic than a shared day off.\n\nThe four-day week should therefore be judged case by case, with clear measures of output rather than enthusiasm. If it works, we may discover that much of what we call busyness was never work at all.",
        keyPoints: [
          '开篇明确表态：值得试行但并非适用于所有行业',
          '从效率与注意力角度论证减少一天的好处',
          '用试验数据说明病假与离职率下降',
          '指出医院、店铺等行业的限制并提出替代方案',
          '结尾强调按行业分别评估、看产出而非热情'
        ],
        minWords: 160,
        points: 1
      }
    ]
  },

  // ---------- m2-l-1 对话（3 题） ----------
  {
    id: 'm2-l-1',
    module: 'listening',
    kind: 'conversation',
    title: 'Conversation Two · 暑期考古田野学校',
    instructions: 'Listen to the conversation and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m2-l-1.mp3',
    transcript: `Questions 1 to 3 are based on the conversation you have just heard.

M: Professor Hale, do you have a minute? I wanted to ask about the field school in Shaanxi this summer.
W: Of course. Applications close on Friday. Have you done any excavation work before?
M: Only a week of survey work on a Roman site in my first year. I mostly drew maps.
W: That is more useful than you think. Half of what we do is recording: drawing, photographing, writing labels. People imagine we spend our days discovering things.
M: Is there anything I should do to prepare?
W: Read the site report from last season — I will email it to you. And learn some basic photography; a badly lit photograph of a pot is almost worthless. You need patience too. Excavation is slow, and the most interesting objects tend to appear in the last week.
M: The last week? Why?
W: Because by then we finally understand the site. The first three weeks are mostly removing soil and arguing about what it means.
M: And the cost? I read that there is a fee.
W: There is, but the department offers four grants that cover most of it. I will forward the form.`,
    difficulty: 2,
    tags: ['学术', '校园'],
    questions: [
      {
        id: 'm2-l-1-q1',
        type: 'choice',
        stem: 'What does the man want to ask the woman about?',
        options: [
          'The deadline for a written assignment',
          'The summer field school in Shaanxi',
          'The grant for his first-year project',
          'Course in map drawing'
        ],
        answer: 1,
        explanation: '对话开头男生就问能否占用教授一点时间，想了解今年夏天陕西的田野学校（field school），即暑期考古实践项目。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-l-1-q2',
        type: 'choice',
        stem: 'What does the woman say surprises people about excavation?',
        options: [
          'Most of the time is spent recording rather than discovering',
          'The physical work is easier than expected',
          'Objects are usually found in the first week',
          'Few students enjoy the work'
        ],
        answer: 0,
        explanation: '女士说人们以为他们整天在“发现”东西，其实一半的工作是记录：绘图、拍照、写标签。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-l-1-q3',
        type: 'choice',
        stem: 'What does the woman advise the man to do to prepare?',
        options: [
          'Buy his own camera before the trip',
          'Apply for the grant before Friday',
          'Take a course in drawing maps',
          "Read last season's report and learn basic photography"
        ],
        answer: 3,
        explanation: '女士明确建议他读上一季的工地报告，并学一点基础摄影，因为光线不好的照片几乎没有价值。',
        tag: '细节题',
        points: 1
      }
    ]
  },

  // ---------- m2-l-2 新闻（2 题） ----------
  {
    id: 'm2-l-2',
    module: 'listening',
    kind: 'news',
    title: 'News Report Two · 海岛海草床修复',
    instructions: 'Listen to the news report and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m2-l-2.mp3',
    transcript: `Questions 1 to 2 are based on the news report you have just heard.

Volunteers on the island of Breda have finished replanting four hectares of seagrass along the coast, in what marine biologists describe as the largest project of its kind attempted in the region. Seagrass meadows were once common here but were destroyed by pollution and by boats dropping anchors in shallow water. The new plants were grown in tanks from seeds collected locally, and divers fixed them to the seabed in spring, when the water is still cold and the plants are less likely to be disturbed. Researchers will monitor the area for three years. They warn that the work could fail if water quality does not improve, and the island council is expected to decide next month whether to extend an existing ban on anchoring near the shore.`,
    difficulty: 2,
    tags: ['生态', '海洋'],
    questions: [
      {
        id: 'm2-l-2-q1',
        type: 'choice',
        stem: 'What have volunteers on the island of Breda done?',
        options: [
          'They have replanted seagrass along the coast',
          'They have cleaned up a polluted harbour',
          'They have built a new marine research centre',
          'They have banned fishing in shallow water'
        ],
        answer: 0,
        explanation: '新闻首句即说明，志愿者已完成海岸四公顷海草的重植，这是该地区同类项目中规模最大的一个。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-l-2-q2',
        type: 'choice',
        stem: 'What do the researchers warn about?',
        options: [
          'The plants were grown in the wrong season',
          'Divers could not fix the plants to the seabed',
          'The project may fail if water quality does not improve',
          'The council has banned all diving near the shore'
        ],
        answer: 2,
        explanation: '研究人员提醒，如果水质不改善，这项工作可能失败；因此项目成败在很大程度上取决于当地水质。',
        tag: '细节题',
        points: 1
      }
    ]
  },

  // ---------- m2-l-3 讲座（3 题） ----------
  {
    id: 'm2-l-3',
    module: 'listening',
    kind: 'lecture',
    title: 'Lecture Two · 打断如何消耗注意力',
    instructions: 'Listen to the lecture and choose the best answer.',
    passage: '',
    audio: 'assets/audio/m2-l-3.mp3',
    transcript: `Questions 1 to 3 are based on the lecture you have just heard.

Today we are going to examine what interruptions actually do to the mind. Most of us assume that an interruption costs us only the minutes it takes, and then we return to work. Research suggests something quite different.

In one well-known study, office workers were watched for a full day and their responses to each interruption were recorded. On average, it took the workers about twenty minutes to return to the original task. And when they did return, they often repeated work they had already done, because they had forgotten where they were.

There is a second, less obvious cost. When we know that a message may arrive at any moment, part of our attention stays on guard, waiting for it. This is why even a silent phone on the desk can lower performance: the possibility of interruption is itself distracting.

The practical lesson is not that we should forbid all communication. It is that certain kinds of work — writing, planning, solving a difficult problem — need long unbroken stretches, while other kinds can be done in the gaps. If you arrange your day so that your best hours are protected, you will not need more willpower. You will simply have removed the competition.`,
    difficulty: 3,
    tags: ['心理', '学习'],
    questions: [
      {
        id: 'm2-l-3-q1',
        type: 'choice',
        stem: 'What is the lecture mainly about?',
        options: [
          'How interruptions affect attention and work',
          'How to choose the right mobile phone',
          'Why office workers dislike meetings',
          'The history of workplace design'
        ],
        answer: 0,
        explanation: '讲座开头即点明主题：打断究竟对头脑做了什么，随后讲研究发现的两种代价，属于“打断对注意力与工作的影响”。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm2-l-3-q2',
        type: 'choice',
        stem: 'According to the study, what often happened when workers returned to their task?',
        options: [
          'They finished it more quickly than before',
          'They repeated work they had already done',
          'They asked a colleague for help',
          'They gave up and started something else'
        ],
        answer: 1,
        explanation: '讲座提到，员工平均要花约二十分钟回到原任务，回去后还常常重复已经做过的工作，因为忘了做到哪里。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-l-3-q3',
        type: 'choice',
        stem: 'What does the speaker recommend?',
        options: [
          'Banning all messages during office hours',
          'Working longer hours to catch up',
          'Protecting long unbroken periods for demanding work',
          'Doing difficult tasks in the gaps between meetings'
        ],
        answer: 2,
        explanation: '讲者建议把写作、规划、解决难题等需要长时间专注的工作安排在不受打断的时段，即“保护最好的时段”，并非禁止一切沟通。',
        tag: '推断题',
        points: 1
      }
    ]
  },

  // ---------- m2-r-1 阅读一 ----------
  {
    id: 'm2-r-1',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage One · 老龄化与岗位再设计',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `Discussions about population ageing usually begin with a warning: too few young people will be available to support too many old ones. The arithmetic is familiar, and the policy responses — later retirement, higher immigration, larger savings — are debated everywhere. What receives less attention is the way work itself must change if experienced employees are to stay on.\n\nIn many companies, the design of a job has barely altered since the workforce was young and cheap. Promotion depends on a willingness to move city every three years; expertise is valued less than stamina; retraining is offered to new staff and rarely to anyone over fifty. It is hardly surprising that older workers leave early, and equally unsurprising that firms then complain of skill shortages.\n\nA more promising approach treats long experience as an asset that needs reconfiguring. Part-time and project-based roles allow a senior engineer to contribute without the travel that used to be assumed. Pairing an experienced worker with a junior colleague transfers knowledge that no handbook contains. Flexible hours help those caring for grandchildren or for a partner in poor health.\n\nNone of these changes is expensive, but all require managers to abandon a simple assumption: that a career is a straight line rising from graduation to retirement. In an economy where most people will work for five decades, the sensible goal is not to keep older employees in the same jobs but to let them move into new ones.`,
    difficulty: 2,
    tags: ['社会', '职场'],
    questions: [
      {
        id: 'm2-r-1-q1',
        type: 'choice',
        stem: 'What is the passage mainly about?',
        options: [
          'Why immigration cannot solve labour shortages',
          'How to persuade older employees to retire earlier',
          'The financial cost of raising the retirement age',
          'Why companies need to redesign jobs to keep experienced staff'
        ],
        answer: 3,
        explanation: '文章指出，讨论老龄化时人们多关注政策手段，却忽视工作本身的设计；作者主张重新设计岗位，让有经验的员工留下来。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm2-r-1-q2',
        type: 'choice',
        stem: 'What is mentioned as a way to pass on knowledge?',
        options: [
          'Pairing experienced workers with junior colleagues',
          'Sending senior staff on training courses',
          'Recording experts explaining their work on video',
          'Hiring more graduates every year'
        ],
        answer: 0,
        explanation: '第三段提到，让有经验的员工与年轻同事结对，可以传递手册里没有的知识。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-r-1-q3',
        type: 'choice',
        stem: "What is the author's attitude towards these flexible arrangements?",
        options: [
          'Doubtful',
          'Indifferent',
          'Supportive',
          'Strongly critical'
        ],
        answer: 2,
        explanation: '作者说这些改变“并不昂贵”，并主张把职业看作可转换的路径而非一条直线，态度明显是支持的。',
        tag: '态度题',
        points: 1
      }
    ]
  },

  // ---------- m2-r-2 阅读二 ----------
  {
    id: 'm2-r-2',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage Two · 食物浪费为何难减',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `When a supermarket throws away bread that is edible but past its best, shoppers tend to blame the supermarket. The chain, in turn, points to customers who refuse to buy a loaf unless it is soft and evenly browned. Both are right, which is why food waste has proved so difficult to reduce.\n\nA surprising share of waste never reaches a shop at all. Crops are discarded at the farm because they are the wrong size, shape or colour for a buyer's contract. A potato that is too small for the frozen chip market is still perfectly good food, but the cost of sorting, packing and transporting it may exceed the price it can command.\n\nDate labels complicate matters further. In many countries the phrase "best before" is a quality guide, not a safety warning, yet it is widely read as a deadline. Supermarkets keen to protect their reputation have added labels and shortened them, and research suggests that this alone accounts for a measurable slice of household waste.\n\nExperiments that remove some labels, or that move discounts from two-for-one offers to reductions on older stock, have produced modest but consistent savings. The most effective measure, however, is separation: cities that collect food waste separately from general rubbish gather cleaner data and can direct edible surplus to community kitchens. Technology cannot solve a problem whose causes begin with expectations.`,
    difficulty: 3,
    tags: ['环境', '消费'],
    questions: [
      {
        id: 'm2-r-2-q1',
        type: 'choice',
        stem: 'What is the passage mainly about?',
        options: [
          'How supermarkets can increase their profits',
          'Why food waste is hard to reduce and what helps',
          'The health effects of eating stale bread',
          'How to grow vegetables at home'
        ],
        answer: 1,
        explanation: '文章从超市、农场、日期标签和城市收运几个环节说明食物浪费难以减少的原因，并介绍一些有效做法，主旨是“食物浪费为何难减以及什么措施有效”。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm2-r-2-q2',
        type: 'choice',
        stem: 'What does the author say about "best before" labels?',
        options: [
          'They are required by law in every country',
          'They always show that the food is unsafe',
          'They are quality guides that many people read as deadlines',
          'They have been removed from most products'
        ],
        answer: 2,
        explanation: '第三段指出，“best before”本是品质提示而非安全警告，但被广泛误读为最后期限，反而造成浪费。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-r-2-q3',
        type: 'choice',
        stem: 'Which measure does the author consider most effective?',
        options: [
          'Removing all date labels from products',
          'Offering two-for-one discounts',
          'Persuading shoppers to buy smaller loaves',
          'Collecting food waste separately from general rubbish'
        ],
        answer: 3,
        explanation: '末段说最有效的措施是“separation”，即把厨余垃圾与普通垃圾分开收运，这样能获得更清晰的数据并合理分配可食用余量。',
        tag: '细节题',
        points: 1
      }
    ]
  },

  // ---------- m2-r-3 阅读三 ----------
  {
    id: 'm2-r-3',
    module: 'reading',
    kind: 'passage',
    title: 'Reading Passage Three · 年轻人重返传统手工艺',
    instructions: 'Read the passage and choose the best answer to each question.',
    passage: `Look at the programme of almost any craft school in Europe and you will notice an odd thing: the average age of students is falling. Classes in cabinet-making, weaving and bookbinding that a decade ago were filled with retired people now receive applications from graduates in their twenties, many of whom left comfortable office jobs to enrol.\n\nThe reasons vary. Some students mention the pleasure of working with material that does not send notifications. Others speak of a desire for work they can see at the end of the day. A third group is quietly practical: a handmade chair that can be repaired is an increasingly attractive object in a world of furniture designed to be replaced.\n\nThere are difficulties. Craft work pays poorly at the beginning, and workshops in city centres are expensive places to rent. Many students combine their training with part-time work, and some eventually abandon the trade. Yet the revival has changed the conversation in one important respect. Apprenticeships in traditional skills used to be presented as heritage protection, a matter of preserving what would otherwise vanish. Now they are increasingly understood as research: a way of finding out how bamboo can replace plastic, or how a lost joinery technique can make modern buildings cheaper to maintain.\n\nThat shift matters, because it turns craftspeople from guardians of the past into colleagues in the present.`,
    difficulty: 2,
    tags: ['文化', '教育'],
    questions: [
      {
        id: 'm2-r-3-q1',
        type: 'choice',
        stem: 'What is the passage mainly about?',
        options: [
          'The growing interest of young people in traditional crafts',
          'Why craft schools are closing across Europe',
          'The history of European furniture making',
          'How to rent a workshop in a city centre'
        ],
        answer: 0,
        explanation: '文章讲欧洲工艺学校学生平均年龄下降、二十多岁的毕业生投身传统手工艺的现象，并分析原因与意义。',
        tag: '主旨题',
        points: 1
      },
      {
        id: 'm2-r-3-q2',
        type: 'choice',
        stem: 'What difficulty is mentioned in the passage?',
        options: [
          'Craft schools refuse to accept older students',
          'Handmade objects are too expensive to sell',
          'Workshops in city centres are expensive to rent',
          'There are no teachers left in traditional skills'
        ],
        answer: 2,
        explanation: '第四段开头列举困难：手艺工作初期收入低，而且市中心的工作室租金昂贵。',
        tag: '细节题',
        points: 1
      },
      {
        id: 'm2-r-3-q3',
        type: 'choice',
        stem: 'How does the author view the change in how apprenticeships are understood?',
        options: [
          'As a loss of respect for heritage',
          'As a positive shift towards research and innovation',
          'As a temporary fashion among graduates',
          'As a threat to modern building methods'
        ],
        answer: 1,
        explanation: '作者认为学徒制从“保护传统”转为“研究创新”，使手艺人从过去的守护者变成当下的同行，结尾“That shift matters”表明是积极评价。',
        tag: '态度题',
        points: 1
      }
    ]
  },

  // ---------- m2-t-1 翻译 ----------
  {
    id: 'm2-t-1',
    module: 'translation',
    kind: 'task',
    title: 'Translation · 中国高铁',
    instructions: '请将下面的段落翻译成英文，注意用词准确、语法正确、语篇连贯。',
    prompt: '高铁极大改变了中国人的出行方式。过去，从北京到上海需要一整天，如今乘坐高铁只需四个多小时。中国已建成世界规模最大的高铁网，连接数百座城市。高铁不仅缩短了城市之间的距离，也让许多小城市获得了新的发展机会。周末乘高铁去邻近城市旅行、探亲或看演出，已成为普遍的生活方式。同时，高铁站多建在城市外围，如何让旅客便捷到达市中心，仍是许多城市需要解决的问题。',
    passage: '',
    difficulty: 2,
    tags: ['社会类'],
    questions: [
      {
        id: 'm2-t-1-q1',
        type: 'translation',
        stem: '请将上面的段落翻译成英文。',
        reference: "High-speed rail has greatly changed the way Chinese people travel. In the past, it took a whole day to go from Beijing to Shanghai; today the journey by high-speed train takes just over four hours. China has now built the largest high-speed railway network in the world, connecting hundreds of cities. High-speed rail has not only shortened distances between cities but also given many smaller cities new opportunities for development. Travelling by high-speed train to a nearby city at the weekend, whether to go sightseeing, visit relatives or attend a performance, has become a common way of life. At the same time, high-speed railway stations are often built on the outskirts of cities, and how to allow passengers to reach the city centre conveniently remains a problem that many cities still need to solve.",
        keyPoints: [
          '高铁对出行方式的巨大改变',
          '北京到上海所用时间的前后对比',
          '最大高铁网与连接数百座城市',
          '缩短城际距离、带动小城市发展',
          '高铁站位置偏外围带来的接驳问题'
        ],
        minWords: 120,
        points: 1
      }
    ]
  }
];


