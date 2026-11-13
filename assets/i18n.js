/* 中英双语：以中文原文为键做整站替换，切换语言后重新加载页面
   覆盖外壳（导航 / 页脚）、首页、会员中心、出行预订、牧师商城
   航班、订单、商品等业务数据本身是中文录入，保持原样不机翻 */
(function () {
    var KEY = 'lms_lang';
    var lang = 'zh';
    try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'; } catch (e) { lang = 'zh'; }

    var DICT = {
        /* ---- 品牌 ---- */
        '老牧师航空': 'Laomusi Airlines',
        '老牧师航空首页': 'Laomusi Airlines home',

        /* ---- 顶部导航 ---- */
        '首页': 'Home',
        '机票预订': 'Book flights',
        '在线值机': 'Check in',
        '我的订单': 'My trips',
        '更多': 'More',
        '航班动态': 'Flight status',
        '特殊服务': 'Special services',
        '购物车': 'Shop cart',
        '服务指南': 'Travel guide',
        '关于我们': 'About us',
        '在线客服': 'Support',
        '会员中心': 'Mileage plan',
        '登录 / 注册': 'Sign in / Join',
        '主题：跟随系统': 'Theme: system',
        '主题：浅色': 'Theme: light',
        '主题：深色': 'Theme: dark',
        'EN': '中文',

        /* ---- 页脚 ---- */
        '出行政策': 'Policies',
        '退改签政策': 'Refunds & changes',
        '行李规定': 'Baggage',
        '登机须知': 'Boarding',
        '快速链接': 'Quick links',
        '客服中心': 'Help center',
        '背景音乐：关': 'Music: off',
        '背景音乐：开': 'Music: on',
        '联系我们': 'Contact us',
        '官方邮箱': 'Email',
        '服务时间': 'Hours',
        '企业地址': 'Address',
        '更新公告': 'Updates',
        '开发者模式': 'Developer mode',
        '输入兑换码': 'Coupon code',
        '兑换': 'Redeem',
        '版权所有': 'All rights reserved',
        '站内城市与商品图片均为站方自制演示素材，仅用于界面展示，不作商业用途。': 'All city and product images on this site are demo assets made by the site owner, for interface display only and not for commercial use.',
        '个人制作网站仅供模拟、娱乐、学习使用，请勿用于非法用途': 'Personal demo site, for simulation, recreation and study only. Do not use for unlawful purposes.',

        /* ---- 首页 ---- */
        'Hello, Welcome to': 'Hello, welcome to',
        '虔诚 · 严谨 · 安心，像牧师般守护每一段飞行': 'Discreet, precise, reassuring — every flight, watched over.',
        '查询航班': 'Search flights',
        '了解更多': 'Learn more',
        '全球通航城市': 'Cities served',
        '在役机队': 'In service',
        '航班准点率': 'On-time rate',
        '年承运旅客': 'Guests per year',
        '以上为演示数据': 'Illustrative figures only',
        'SPECIAL FARES': 'SPECIAL FARES',
        '特价活动': 'Special fares',
        '国内': 'Domestic',
        '国际及港澳台': 'International',
        '热门航线': 'Popular routes',
        '机票预订 · 全球航线，一次锁定': 'Flights · locked in once',
        '空铁联运 · 飞机+高铁，一票直达': 'Air + rail · one ticket',
        '在线值机 · 选好座位，轻装出行': 'Check-in · pick your seat',
        '航班动态 · 实时掌握每一次起落': 'Flight status · every movement',
        '会员中心 · 常旅客礼遇与里程': 'Mileage plan · tiers and miles',
        '购物车 · 确认行程，安心支付': 'Cart · review and pay',

        /* ---- 会员中心 ---- */
        '会员中心': 'Mileage plan',
        '老牧师航空常旅客计划 · 消费即累积里程，里程可兑换代金券与出行权益': 'The Laomusi frequent flyer program — every purchase earns miles, redeemable for vouchers and travel perks.',
        '常旅客等级权益': 'Tier benefits',
        '注册会员': 'Join the program',
        '会员姓名': 'Name',
        '手机号码': 'Mobile number',
        '设置密码': 'Password',
        '确认密码': 'Confirm password',
        '注册并开通会员': 'Register and activate',
        '已有账号？登录': 'Already a member? Sign in',
        '登录密码': 'Password',
        '登录': 'Sign in',
        '本地数据备份': 'Local data backup',
        '导出备份码': 'Export backup code',
        '导入备份码': 'Import backup code',

        /* ---- 出行预订 ---- */
        '出行预订': 'Book a trip',
        '空铁联运': 'Air + rail',
        '出发城市': 'From',
        '到达城市': 'To',
        '出发日期': 'Departure date',
        '搜索航班': 'Search flights',
        '天气查询（模拟随机）': 'Weather check (simulated)',
        '查询天气': 'Check weather',
        '最近搜索': 'Recent searches',

        /* ---- 牧师商城 ---- */
        '牧师商城': 'The Shop',
        '老牧师航空官方周边，下单 → 支付 → 发货 → 收货，全程模拟体验': 'Official Laomusi merchandise — order, pay, ship, receive, all simulated.',
        '我的商城订单': 'My shop orders',
        '立即购买': 'Buy now',
        '热卖': 'Bestseller',
        '推荐': 'Recommended',
        '新品': 'New',
        '文创': 'Stationery',
        '权益': 'Perk',


        /* ---- 导航下拉 ---- */
        '会员中心首页': 'Plan home',
        '里程兑换': 'Redeem miles',
        '会员权益与等级': 'Tiers & benefits',
        '黑钻至尊卡': 'Black Diamond',

        /* ---- 首页补充 ---- */
        '以上为演示数据': 'Illustrative figures only',
        '* 以上为演示数据': 'Illustrative figures only',
        '架': 'aircraft',
        '万+': 'M+',
        '全球航线，一次锁定': 'Global routes, one booking',
        '飞机 + 高铁，一票直达': 'Plane + rail, one ticket',
        '飞机+高铁，一票直达': 'Plane + rail, one ticket',
        '选好座位，轻装出行': 'Pick a seat, travel light',
        '实时掌握每一次起落': 'Every take-off and landing',
        '常旅客礼遇与里程': 'Tiers and miles',
        '确认行程，安心支付': 'Review and pay',
        '更多特价': 'More fares',
        '精选全球目的地，含地标风景大片': 'Hand-picked destinations',
        '国内热门干线': 'Domestic trunk routes',
        '国内旅游城市': 'Domestic leisure cities',
        '国际及地区航线': 'International routes',

        /* ---- 会员中心补充 ---- */
        '普卡': 'Basic',
        '银卡': 'Silver',
        '金卡': 'Gold',
        '铂金卡': 'Platinum',
        '钻石卡': 'Diamond',
        '黑钻卡': 'Black Diamond',
        '：注册即享 · 里程累积、会员专属客服、会员价购票': 'On joining: mileage, dedicated support, member fares',
        '（1万里程）：优先值机、额外10%里程加成、生日礼遇': '(10,000 miles): priority check-in, +10% miles, birthday perk',
        '（3万里程）：免费选座、贵宾安检通道、额外25%里程、优先登机': '(30,000 miles): free seat selection, fast-track security, +25% miles, priority boarding',
        '（6万里程）：贵宾休息室、免费升舱券×1/年、额外50%里程': '(60,000 miles): lounge access, one upgrade voucher a year, +50% miles',
        '（10万里程）：专属行程管家、无限贵宾休息室、额外100%里程': '(100,000 miles): personal trip manager, unlimited lounge, +100% miles',
        '（100万里程+¥28888开通）：黑钻至尊会籍，私人管家、无限休息室、全年升舱、黑钻通道': '(1,000,000 miles + ¥28,888): Black Diamond status, private concierge, unlimited lounge, year-round upgrades',
        '会员卡号': 'Member no.',
        '当前等级': 'Current tier',
        '累计里程': 'Lifetime miles',
        '可用里程': 'Available miles',
        '退出登录': 'Sign out',
        '账户余额（模拟）': 'Balance (simulated)',
        '充值': 'Top up',
        '余额流水': 'Transactions',
        '支付方式': 'Payment methods',
        '黑钻至尊专属权益': 'Black Diamond privileges',
        '黑钻卡会员尊享 · 凌驾于钻石卡之上的顶级礼遇': 'Reserved for Black Diamond members — above and beyond Diamond',
        '里程兑换中心': 'Mile redemption',
        '当前可用里程': 'Available miles',
        '我的优惠券': 'My coupons',
        '我的权益': 'My perks',
        '里程明细（来源于购票订单）': 'Mile activity from flight orders',
        '请输入 2-20 位姓名': 'Enter a name of 2-20 characters',
        '请输入 11 位有效手机号': 'Enter a valid 11-digit mobile number',
        '密码需为 6-20 位': 'Password must be 6-20 characters',
        '两次输入的密码不一致': 'Passwords do not match',
        '请输入密码': 'Enter your password',
        '账号与会员账号互通，也可前往': 'Accounts and membership are linked — you can also go to the',
        '账号登录页': 'sign-in page',

        '加入于': 'joined',
        '会员': 'Member',
        '机票、商城与升舱补差价均从余额扣款；充值即时到账，全程模拟，不产生真实扣款。': 'Flight, shop and upgrade payments come out of your balance. Top-ups credit instantly — everything here is simulated.',
        '充值余额前需绑定至少一种支付方式，可绑定多个并设置默认。仅保存掩码信息，不涉及真实账户与真实扣款。': 'Link at least one payment method before topping up. You can link several and set a default. Only masked details are stored — no real accounts, no real charges.',
        '累计消费': 'Lifetime spend',
        '里程有效期': 'Mile validity',
        '升级进度': 'Progress to next tier',
        '距离下一等级还需': 'Miles to next tier: ',
        '暂无记录': 'No records yet',
        '暂无优惠券': 'No coupons yet',
        '暂无权益': 'No perks yet',
        '选择兑换': 'Redeem',

        '丽江': 'Lijiang',
        '舟山': 'Zhoushan',
        '喀什': 'Kashgar',
        '伊宁': 'Yining',
        '阿勒泰': 'Altay',
        '漠河': 'Mohe',
        '长白山': 'Changbaishan',
        '稻城': 'Daocheng',
        '林芝': 'Nyingchi',
        '西双版纳': 'Xishuangbanna',
        '泉州': 'Quanzhou',
        '北海': 'Beihai',
        '香格里拉': 'Shangri-La',
        '敦煌': 'Dunhuang',
        '芽庄': 'Nha Trang',
        '富国岛': 'Phu Quoc',
        '清迈': 'Chiang Mai',
        '普吉岛': 'Phuket',
        '暹粒': 'Siem Reap',
        '岘港': 'Da Nang',
        '全部航线': 'All routes',
        '🇨🇳 国内热门干线': '🇨🇳 Popular domestic trunk routes',
        '小众宝藏目的地': 'Hidden-gem destinations',
        '国际长途航线': 'Long-haul international routes',
        '周边短途航线': 'Short-haul regional routes',
        '像牧师守护灵魂那样': 'Like a pastor watching over a soul',
        '守护每一段航程': 'we watch over every journey',
        '老牧师航空成立于 2025 年，是一家主打小众高端轻奢出行的模拟航空公司。': 'Founded in 2025, Laomusi Airlines is a simulated carrier focused on understated, premium travel.',
        '成立年份': 'Founded',
        '精选航线': 'Curated routes',
        '覆盖城市': 'Cities served',
        '旅客满意度': 'Guest satisfaction',
        '品牌故事': 'Our story',
        '我们坚持的四件事': 'Four things we stand by',
        '虔诚': 'Reverence',
        '以敬畏之心对待每一次起飞与降落，把每一位乘客的旅程当作自己的旅程。': 'We treat every take-off and landing with reverence, and every passenger\'s journey as our own.',
        '严谨': 'Rigour',
        '从票价规则到退改签政策，公开透明，无隐藏消费，每一个数字都经得起推敲。': 'Fare rules and refund policies are open and transparent, with no hidden charges and every figure defensible.',
        '安心': 'Reassurance',
        '高安全标准、完整的订单追踪、值机与改签闭环，让出行全程心中有数。': 'High safety standards, full order tracking and a closed loop from check-in to rebooking — so you always know where you stand.',
        '静谧': 'Quiet',
        '不喧哗、不打扰，用克制的服务设计，还给旅客一段属于自己的高空时光。': 'No noise, no interruptions — restrained service design that gives the time above the clouds back to you.',
        '发展历程': 'Timeline',
        '2025 · 起步': '2025 · Beginnings',
        '老牧师航空官网上线，首批 24 条国内热门干线启航，服务模拟出行体验。': 'The Laomusi site went live with the first 24 domestic trunk routes, built for simulated travel.',
        '2026 春 · 扩展': 'Spring 2026 · Expansion',
        '航线扩展至 80+ 城市，覆盖东南亚、中东、欧洲与北美，上线会员常旅客体系与里程兑换。': 'Routes grew past 80 cities across Southeast Asia, the Middle East, Europe and North America; the frequent flyer programme and mile redemption launched.',
        '2026 夏 · 升级': 'Summer 2026 · Upgrade',
        '完成 iOS 液态玻璃视觉改版，推出空铁联运、在线值机、特殊服务申请、牧师商城等完整业务闭环。': 'A liquid-glass visual refresh shipped, alongside air + rail, online check-in, special service requests and the Laomusi shop.',
        '未来 · 继续': 'Ahead · Continuing',
        '持续打磨每一个细节，做你云端上那位可靠的老牧师。': 'We keep refining every detail, staying the dependable pastor up in the clouds.',
        '服务承诺': 'Our promise',
        '透明定价，无隐藏消费': 'Transparent pricing, no hidden charges',
        '所有票价均在下单前完整展示，包含机建、燃油、行李额等全部费用。退改签规则公开可查，绝不以模糊条款在最后一步加价。': 'Every fare is shown in full before you book — airport fees, fuel surcharge and baggage allowance included. Refund and change rules are public, and we never add charges at the last step.',
        '安全为底，严谨规范': 'Safety first, held to standard',
        '从航班生成、到值机座位分配、再到特殊旅客服务审批，全流程模拟真实航司标准。任何异常状态都有明确的下一步指引。': 'From flight generation to seat assignment to special-service approval, the whole flow follows real airline standards — and every unusual state comes with a clear next step.',
        '静谧舒适，克制服务': 'Calm and quiet, restrained service',
        '不做过度推销、不弹窗打扰，只在你需要的地方出现。背景音乐可一键关闭，界面信息层级克制而清晰。': 'No hard selling, no interrupting pop-ups — we appear only where you need us. Background music switches off in one click, and the interface stays quiet and clear.',
        '全程闭环，售后无忧': 'A closed loop, end to end',
        '购票 → 值机 → 升降舱 → 退改签 → 里程兑换 → 商城购物，每一步都有完整状态反馈。遇到问题随时通过页面右上角邮箱联系我们。': 'Book → check in → upgrade → refund or rebook → redeem miles → shop. Every step reports its status. If anything goes wrong, reach us by email.',
        '准备好开启下一段旅程了吗？': 'Ready for your next journey?',
        '立即查询航班': 'Search flights',
        '服务政策指南': 'Service policy guide',
        '一、行李托运政策': '1. Baggage allowance',
        '• 经济舱：免费托运行李额度20KG，随身行李1件5KG以内': '• Economy: 20 kg checked in, one carry-on up to 5 kg',
        '• 超级经济舱：免费托运行李额度25KG，随身行李1件8KG以内': '• Premium economy: 25 kg checked in, one carry-on up to 8 kg',
        '• 商务舱：免费托运行李额度30KG，随身行李2件各8KG以内': '• Business: 30 kg checked in, two carry-ons up to 8 kg each',
        '• 头等舱：免费托运行李额度40KG，随身行李2件各8KG以内': '• First: 40 kg checked in, two carry-ons up to 8 kg each',
        '• 超重行李将按照每公斤对应航线票价1.5%收取超重费用。': '• Overweight bags are charged at 1.5% of the route fare per kilogram.',
        '• 国际长途航线额外增加10KG免费行李额度。': '• Long-haul international routes add 10 kg of free allowance.',
        '二、退改签政策': '2. Refunds and changes',
        '1、起飞前24小时以上退票：收取票价15%手续费': '1. More than 24 hours before departure: 15% fee',
        '2、起飞前4-24小时退票：收取票价30%手续费': '2. Between 4 and 24 hours before departure: 30% fee',
        '3、起飞前4小时以内以及航班起飞后退票：收取票价50%手续费': '3. Within 4 hours of departure, or after departure: 50% fee',
        '4、改签：同等舱位可免费改签一次，差价多退少补。特价机票不可退改。': '4. Changes: one free change in the same cabin; any fare difference is settled either way. Special fares cannot be refunded or changed.',
        '5、国际航线退改需提前48小时申请。': '5. International refunds and changes must be requested 48 hours in advance.',
        '三、登机须知': '3. Before you fly',
        '国内航班建议起飞前2小时到达机场办理值机；起飞前45分钟停止值机。': 'For domestic flights, arrive 2 hours before departure to check in; check-in closes 45 minutes before.',
        '国际航班建议起飞前3小时到达机场，携带本人有效护照以及签证文件。': 'For international flights, arrive 3 hours before with your valid passport and visa documents.',
        '乘机请携带购票时登记的有效身份证件原件。': 'Bring the original ID document you used at booking.',
        '特殊旅客（老人、孕妇、病患、无人陪伴儿童）可提前申请专属服务。': 'Passengers who need support — elderly, pregnant, unwell, or unaccompanied minors — can request dedicated service in advance.',
        '记录老牧师航空的每一次成长与迭代': 'Every release, every step',
        '在线值机页面直接展示本人可值机订单，支持一键值机，无需进入订单详情': 'Online check-in now lists your eligible orders right on the page — one click, no need to open the order.',
        '已值机的机票在订单中直接显示为已完成状态': 'Checked-in tickets now show as completed in your orders.',
        '更新公告改为独立页面，页脚按钮一键跳转查看完整记录': 'Release notes moved to their own page, linked from the footer.',
        '购买界面改为全屏左右分栏，不再是小窗弹窗': 'The purchase flow is now a full-screen split view instead of a small dialog.',
        '修复滚动时导航栏变黑，改为与雾蓝主题协调的半透明玻璃': 'Fixed the header turning black on scroll; it now uses translucent glass matched to the misty-blue theme.',
        '兑换码改为输入任意数字即可领 50 元券（每天一次）': 'The redeem code now accepts any number for a ¥50 voucher, once per day.',
        '我的订单支持按日期、订单号、乘机人姓名搜索筛选': 'My orders can be searched by date, order number or passenger name.',
        '全新雾蓝雾白主题，液态玻璃升级为水滴折射效果，配色优化为深雾蓝灰': 'A new misty-blue and mist-white theme, with liquid glass upgraded to water-drop refraction.',
        '页脚新增兑换码与神秘彩蛋：输入彩蛋码可抽奖吴景雕像、偷吃乌龟模型与代金券': 'Redeem codes and a mystery easter egg arrived in the footer — enter the egg code to win a Wu Jing statue, the sneaky turtle figurine or vouchers.',
        '新增背景音乐：右上角一键播放/暂停，双击可调进度与音量，跨页面保持进度': 'Background music added: play or pause, double-click for progress and volume, continuing across pages.',
        '首页改版为 Apple 风格英文大标题，加入圆润动画与全站液态玻璃效果': 'The homepage adopted an Apple-style English headline, with rounded motion and liquid glass throughout.',
        '会员常旅客体系上线，含黑钻顶级卡；里程兑换支持实物邮寄': 'The frequent flyer programme launched, including Black Diamond; mile redemption now covers physical delivery.',
        '订单支持升降舱（多退少补），单次最多可购 50 张票': 'Orders support cabin upgrades and downgrades, with up to 50 tickets per purchase.',
        '空铁联运支持铁路选座、在线值机、登机牌打印': 'Air + rail now includes train seat selection, online check-in and boarding pass printing.',
        '新增模拟天气、特殊申请（餐食/无陪儿童/宠物/大电池托运）': 'Simulated weather and special requests (meals, unaccompanied minors, pets, large batteries).',
        '修复改签按钮、里程兑换中心、实物领取等多项问题': 'Fixed the rebooking button, the mileage redemption centre and physical prize collection.',
        '天气模块改为模拟随机天气，航班可能取消（80%概率）可免费改签或补偿': 'Weather became simulated and random: flights may be cancelled (80% chance), with free rebooking or compensation.',
        '页底新增友情链接：12306 官网与国内四大航司官网': 'Footer links added: 12306 and the four major Chinese airlines.',
        '不同会员等级界面差异化，等级越高界面越尊贵': 'Member tiers now look different, with higher tiers feeling more exclusive.',
        '新增顶级黑钻会员：累计消费超 100 万 + 28888 开通': 'Black Diamond introduced: ¥1,000,000 lifetime spend plus ¥28,888 to unlock.',
        '购票数量支持一次最多 50 张': 'Up to 50 tickets per purchase.',
        '里程兑换扩充：超额行李、贵宾厅、优先安检、Wi-Fi、联名行李箱、手办、咖啡券': 'Mile redemption expanded: extra baggage, lounge access, priority security, Wi-Fi, the co-branded suitcase, figurines and coffee vouchers.',
        '机票预订加入天气查询模块': 'Weather lookup added to booking.',
        '完成空铁联运、在线值机、登机牌打印、服务指南等核心出行链路': 'Air + rail, online check-in, boarding pass printing and the service guide completed the core journey.',
        '上线特殊申请（特殊餐食/无陪儿童/宠物上机/大容量电池托运）与模拟天气模块': 'Special requests (meals, unaccompanied minors, pets, large batteries) and simulated weather launched.',
        '完善会员常旅客里程体系与会员中心': 'The frequent flyer mileage system and member centre were fleshed out.',
        '新增订单系统、航班动态查询、积分与优惠券能力': 'Orders, flight status lookup, points and coupons added.',
        '上线机票预订、航班搜索、购物车与在线支付流程': 'Booking, flight search, cart and checkout went live.',
        '项目初始化，搭建老牧师航空基础框架与品牌首页': 'Project started: the Laomusi framework and brand homepage.',
        '我们以"虔诚、严谨、安心"为服务内核，为每一位乘客打造静谧、舒适、可信赖的飞行体验。': 'Our service rests on reverence, rigour and reassurance, shaping a calm, comfortable and dependable flight for every passenger.',
        '"老牧师"这个名字，源自一个朴素的愿望——在喧闹、匆忙、充满不确定的出行世界里， 做那个沉稳、可靠、始终在线的同行者。我们相信，飞行不该只是一张机票， 而应是一段被认真对待的时光。': 'The name Laomusi comes from a simple wish: in a noisy, hurried and uncertain world of travel, to be the steady, dependable companion who is always there. We believe a flight should be more than a ticket — it should be time taken seriously.',
        '从订票的那一刻起，到落地后的再次重逢，我们希望每一个细节都经得住推敲： 透明无隐藏的价格、安静有序的机舱、恰到好处的服务、随时响应的售后。 这是老牧师航空的承诺，也是我们日复一日打磨的方向。': 'From the moment you book to the moment we meet again after landing, we want every detail to hold up: transparent pricing with nothing hidden, a quiet and orderly cabin, service that is exactly enough, and support that answers whenever you need it. That is our promise, and the direction we polish day after day.',
        '精简顶部导航，次要功能收进最右侧"更多"下拉': 'Streamlined the top navigation; secondary items moved into a More menu on the right.',
        '2026 影像创作征集计划': '2026 Film & Video Open Call',
        '光影星踪 · 影像创作计划': 'Light & Shadow Trail · Film & Video Programme',
        '以镜头捕捉光影，以影像记录独特故事': 'Catch the light with a lens, tell a singular story in moving images',
        '光影流动，故事永存。每一段值得记录的瞬间，都值得被镜头珍藏。为鼓励更多人用影像记录生活、分享创作，老牧师航空特开启"光影星踪"影像创作征集计划，面向所有热爱视频创作、乐于表达的社会各界人士，征集与吴烨尧相关的原创影像作品。': 'Light moves, stories endure. Every moment worth keeping deserves to be held on camera. To encourage more people to record their lives and share their work, Laomusi Airlines is opening "Light & Shadow Trail", an original video call open to anyone who loves making and sharing films — works related to Wu Yeyao are invited.',
        '活动基本信息': 'Activity details',
        '活动主题：': 'Theme:',
        '光影星踪，影像创作': 'Light & Shadow Trail, film & video',
        '活动时间：': 'Dates:',
        '2026年09月21日 — 2026年10月21日（全程 31 天）': '21 September 2026 — 21 October 2026 (31 days)',
        '主办单位：': 'Organiser:',
        '参与对象：': 'Who can join:',
        '所有热爱影像创作、愿意分享原创作品的社会各界人士（个人、团体均可参与）': 'Anyone who loves making and sharing original films — individuals or groups.',
        '作品征集要求': 'Entry requirements',
        '1. 主题要求': '1. Theme',
        '作品须与吴烨尧相关，内容可包括人物记录、创意剪辑、生活片段、致敬创作等多种形式。': 'Entries should relate to Wu Yeyao — portraits, creative edits, slices of life or homage pieces are all welcome.',
        '2. 原创要求': '2. Originality',
        '必须本人原创创作，严禁抄袭、搬运、未经授权使用他人素材。鼓励多元风格与个人表达。': 'Work must be your own. Copying, re-uploading or using others\' material without permission is prohibited. Varied styles and personal voices are encouraged.',
        '3. 时长要求': '3. Length',
        '视频时长建议 15 秒以上，画面清晰、内容完整、逻辑连贯。': 'At least 15 seconds, with a clear image, complete content and coherent structure.',
        '4. 内容要求': '4. Content',
        '积极正向、健康向上，无低俗、暴力、涉密或其他违规内容，遵守相关法律法规。': 'Positive and healthy — no vulgar, violent, classified or otherwise unlawful content, and full compliance with the law.',
        '参与方式': 'How to enter',
        '活动期间，将原创视频作品发送至官方投稿邮箱：': 'During the campaign, send your original video to the official submission email:',
        '邮件请备注：姓名/昵称、联系方式、作品原创声明、作品简短文案介绍。审核通过即成功参与。': 'Note your name or nickname, contact details, a statement that the work is original, and a short introduction. Your entry counts once approved.',
        '奖项设置': 'Prizes',
        '优秀创作大奖': 'Grand creation award',
        '评选一、二、三等奖及优秀奖，获奖作品将在官方渠道展示，并获得专属荣誉奖励。': 'First, second, third and merit awards; winning works are shown on official channels and receive dedicated honours.',
        '参与纪念福利': 'Participation gift',
        '所有合规投稿者均可获得老牧师航空定制纪念品与会员积分奖励。': 'Every valid entry receives a Laomusi keepsake and member points.',
        '最佳创意奖': 'Best creative award',
        '风格独特、创意突出的作品将额外获得高端文创礼盒及出行礼遇。': 'Distinctive, inventive works also receive a premium gift box and travel perks.',
        '注：奖项不可叠加，获奖名单活动结束后官网公示，全程免费参与。': 'Note: awards do not stack; winners are published on the official site after the campaign. Entry is free throughout.',
        '活动须知': 'Terms',
        '作品须为本人原创，严禁抄袭、搬运、二次加工他人素材，一经查实取消资格。': 'Works must be original. Copying, re-uploading or reworking others\' material forfeits your entry.',
        '投稿即授权主办方在非商业宣传场景无偿使用（保留署名权）。': 'Submitting grants the organiser free use in non-commercial promotion, with your authorship credited.',
        '作品不得含违规内容、商业广告或第三方水印。': 'No unlawful content, advertising or third-party watermarks.',
        '活动全程免费，不收取任何费用，谨防诈骗。': 'The campaign is free of charge — beware of scams.',
        '本活动最终解释权归老牧师航空所有。': 'Laomusi Airlines holds final interpretation rights.',
        '每一段影像，都是时间的琥珀；每一次创作，都是对热爱的最好回应。期待你的镜头，记录下独属于你的光影故事。': 'Every piece of film is amber for time; every act of creation is the best answer to what you love. We look forward to your lens and your own story of light.',
        '老牧师航空 · 2026.09.21': 'Laomusi Airlines · 21 Sep 2026',
        '人工客服': 'Human support',
        '客服热线：400-888-9999': 'Hotline: 400-888-9999',
        '服务时间：每日 07:00 — 23:00': 'Hours: daily 07:00 — 23:00',
        '开启在线智能客服': 'Open the AI assistant',
        '其他联系方式': 'Other ways to reach us',
        '本站为演示项目，留言会进入上述渠道，但不会有真实客服人员跟进出票或退款。': 'This is a demo site. Messages reach the channels above, but no real agents will follow up on ticketing or refunds.',
        '投诉与反馈': 'Complaints and feedback',
        '填写内容后，任选一种方式发送。三种方式都会自动带上你填写的信息，无需重复输入。': 'Fill this in, then pick any one channel. All three carry your details automatically — no retyping.',
        '您的姓名': 'Your name',
        '联系电话': 'Contact number',
        '反馈内容': 'Your message',
        '请填写反馈内容（至少 5 个字）': 'Please write your message (at least 5 characters)',
        '选择发送方式': 'Choose how to send',
        '通过短信发送': 'Send by text',
        '发送至 187-7538-0130 · 内容自动填入短信': 'To 187-7538-0130 · pre-filled in your SMS app',
        '通过邮件发送': 'Send by email',
        '3686319507@qq.com · 自动打开邮箱应用': '3686319507@qq.com · opens your mail app',
        '通过 GitHub 留言': 'Post on GitHub',
        '进入仓库留言页，标题与正文自动填好（手机号打码）': 'Opens the repo issue page with title and body pre-filled (phone masked)',
        '点击后内容交由对应应用处理，本站不上传任何数据。': 'Your message is handed to the chosen app; this site uploads nothing.',
        '复制完整内容': 'Copy the full message',
        '常见自助问题': 'Common questions',
        'Q：如何办理退票改签？': 'Q: How do I refund or change a ticket?',
        'A：登录【我的订单】页面，可申请退票或免费改签。退票按起飞时间窗口收取手续费（起飞前24小时以上15%、4-24小时30%、4小时以内及起飞后50%）；同等舱位免费改签一次。': 'A: Open My orders and request a refund or a free change. Refund fees depend on timing: 15% more than 24 hours before departure, 30% between 4 and 24 hours, 50% within 4 hours or after departure. One free change in the same cabin.',
        'Q：行李超重收费标准？': 'Q: What does overweight baggage cost?',
        'A：行李收费详情查看【服务指南-行李托运政策】。': 'A: See Service guide → Baggage allowance for details.',
        'Q：如何开具行程单发票？': 'Q: How do I get an itinerary invoice?',
        'A：航班出行结束后，前往订单详情页申请开具。': 'A: After your flight, request it from the order detail page.',
        '老牧师航空智能客服': 'Laomusi AI assistant',
        '发送': 'Send',
        '访问环境说明': 'Access and environment',
        '老牧师航空 · 最佳浏览器、设备与网络要求': 'Laomusi Airlines · recommended browsers, devices and network',
        '我的设备自检': 'My device check',
        '检测到的浏览器': 'Browser detected',
        '操作系统': 'Operating system',
        '要求最低版本': 'Minimum version',
        '已启用': 'Enabled',
        '本地存储': 'Local storage',
        '可用': 'Available',
        '你的设备符合要求，推荐访问本站': 'Your device meets the requirements — you\'re good to go',
        '支持的浏览器版本': 'Supported browser versions',
        '浏览器': 'Browser',
        '最低版本': 'Minimum version',
        '发布年份': 'Released',
        '79 及以上': '79 or later',
        '2019 年初': 'Early 2019',
        '79 及以上（Chromium 内核）': '79 or later (Chromium)',
        '2020 年初': 'Early 2020',
        '13.1 及以上': '13.1 or later',
        '2019 年中': 'Mid 2019',
        '75 及以上': '75 or later',
        '2020 年中': 'Mid 2020',
        'iOS 13.4 及以上': 'iOS 13.4 or later',
        '2020 年': '2020',
        'Chrome / Edge（安卓）': 'Chrome / Edge (Android)',
        '2019 年起': '2019 onwards',
        '不支持：Internet Explorer 全系列、2018 年以前的老旧浏览器、未升级的微信内置浏览器（iOS 端）。': 'Not supported: any Internet Explorer version, browsers older than 2018, and the un-updated WeChat in-app browser on iOS.',
        '支持的设备': 'Supported devices',
        '桌面 / 笔记本': 'Desktop / laptop',
        '· 屏幕宽度 ≥ 1280px 体验最佳': '· Best at 1280px and wider',
        '· 系统：Windows 10/11、macOS 10.15+': '· OS: Windows 10/11, macOS 10.15+',
        '· 内存 ≥ 4GB': '· 4 GB RAM or more',
        '手机 / 平板': 'Phone / tablet',
        '· iPhone：iOS 13.4 及以上（SE 及更新）': '· iPhone: iOS 13.4 or later (SE and newer)',
        '· 安卓：Android 8.0 及以上': '· Android: 8.0 or later',
        '· 屏幕宽度 ≥ 360px（再窄会挤压）': '· At least 360px wide (narrower gets cramped)',
        '网络与浏览器设置': 'Network and browser settings',
        '必须联网': 'Stay online',
        '：网站依赖 Tailwind CDN、Font Awesome 图标、Google Fonts 在线加载': ': the site loads Tailwind CDN, Font Awesome icons and Google Fonts online',
        '建议带宽': 'Suggested bandwidth',
        '：4G / WiFi；首屏约 1-2MB，图片懒加载': ': 4G or Wi-Fi; about 1-2 MB for the first screen, images lazy-load',
        '开启 JavaScript': 'Enable JavaScript',
        '：购票、值机、会员等所有交互均由 JS 驱动': ': booking, check-in and membership all run on JS',
        '允许本地存储（localStorage）': 'Allow local storage',
        '：订单、会员等级、兑换记录保存在本机；无痕模式下数据不保留': ': orders, tier and redemption records live on this device; private mode keeps nothing',
        '如需背景音乐': 'For background music',
        '：浏览器需允许自动播放/用户手势触发音频': ': the browser must allow autoplay or gesture-triggered audio',
        '如何判断自己的设备是否支持': 'How to tell whether your device is supported',
        '看上面"我的设备自检"卡片': 'Check the device card above',
        '：本站已自动读取你的浏览器类型、版本、操作系统，并给出"': ': it reads your browser, version and OS, then concludes "',
        '推荐访问"或"': 'recommended" or "',
        '建议升级"的结论。': 'please upgrade".',
        '视觉自检': 'Visual check',
        '：如果首页有明显的毛玻璃模糊效果（导航栏、卡片背景半透明）、标题圆润饱满、滚动时模块依次滑入浮现，说明你的浏览器支持完整效果。': ': if the homepage shows real frosted-glass blur (translucent nav and cards), rounded bold headings and modules sliding in as you scroll, your browser supports the full effect.',
        '功能自检': 'Function check',
        '：尝试点击顶部导航、首页热门航线卡片切换标签——若能正常点击、切换、跳转，说明 JS 与交互正常。': ': try the top navigation and the route-card tabs — if clicks, switches and links work, JS and interaction are fine.',
        '升级浏览器': 'Upgrade your browser',
        '：若页面错位、模糊消失、按钮无反应，请到浏览器官网下载最新版（Chrome / Edge / Safari 均为免费自动更新）。': ': if the layout breaks, blur disappears or buttons stop responding, download the latest build from the browser\'s own site (Chrome, Edge and Safari all update free).',
        '当前仍可购票，若航班取消将提供免费改签或补偿方案': 'You can still buy a ticket; if the flight is cancelled we offer free rebooking or compensation.',
        '恶劣天气预警': 'Severe weather alert',
        '全部虚拟航班': 'All simulated flights',
        '经济舱': 'Economy',
        '超级经济舱': 'Premium economy',
        '商务舱': 'Business',
        '头等舱': 'First',
        '待支付': 'Pending payment',
        '已支付': 'Paid',
        '已完成': 'Completed',
        '已退票': 'Refunded',
        '支付处理中': 'Payment processing',
        '恶劣天气取消': 'Cancelled · weather',
        '已补偿': 'Compensated',
        '升舱/降舱': 'Upgrade / downgrade',
        '升舱': 'Upgrade',
        '降舱': 'Downgrade',
        '免费改签': 'Free rebooking',
        '已改签（免费机会已用）': 'Rebooked (free change used)',
        '免费改签（免差价）': 'Free rebooking (no fare difference)',
        '选择其他补偿方案': 'Choose another compensation',
        '航班天气评估通过，行程不受影响。': 'Weather check passed — your trip is unaffected.',
        '因恶劣天气，航班已取消。请选择处理方案：': 'The flight was cancelled due to severe weather. Choose an option:',
        '在线值机': 'Online check-in',
        '查看登机牌': 'view boarding pass',
        '余额支付': 'Balance',
        '支付宝': 'Alipay',
        '微信支付': 'WeChat Pay',
        '银行卡': 'Bank card',
        '余额不足': 'Insufficient balance',
        '充值': 'Top up',
        '暂不支持': 'Not supported',
        '二等座': 'Second class',
        '一等座': 'First class',
        '商务座': 'Business class',
        '空铁联运暂不支持在线改签，如需调整行程请联系客服': 'Air + rail orders cannot be changed online — contact support to adjust your trip.',
        '含高铁': 'incl. rail',
        '苏州': 'Suzhou',
        '嘉兴': 'Jiaxing',
        'BOARDING PASS · 登机牌': 'BOARDING PASS',
        '已值机': 'Checked in',
        '航班号': 'Flight',
        '乘客': 'Passenger',
        '舱位': 'Cabin',
        '座位': 'Seat',
        '航线': 'Route',
        '日期': 'Date',
        '起飞时间': 'Departure',
        '登机口': 'Gate',
        '登机时间': 'Boarding',
        '非会员': 'Non-member',
        '打印登机牌': 'Print boarding pass',
        '取消值机': 'Cancel check-in',
        '删除': 'Remove',
        '购物车总计': 'Cart total',
        '立即支付': 'Pay now',
        '合计': 'Total',
        '欢迎使用老牧师航空': 'Welcome to Laomusi Airlines',
        '本站含大量液态玻璃与动效，建议设备内存 ≥ 4GB，Chrome 79+/Safari 13.1+': 'This site uses plenty of liquid glass and motion; 4 GB RAM with Chrome 79+ or Safari 13.1+ is recommended.',
        '设备类型': 'Device type',
        '电脑端': 'Desktop',
        '触控端': 'Touch',
        '性能模式': 'Performance mode',
        '完整版': 'Full',
        '全部动效+玻璃': 'All motion + glass',
        '节省性能版': 'Lite',
        '保留玻璃+减动画': 'Glass kept, less motion',
        '系统判断：您的设备推荐使用节省性能版': 'Detected: Lite is recommended for your device',
        '详细信息': 'Details',
        '开始体验': 'Start',
        '11 位手机号，将作为登录账号': '11-digit phone number, used as your login',
        '11位手机号，将作为登录账号': '11-digit phone number, used as your login',
        '11位手机号': '11-digit phone number',
        '6-20 位密码': '6-20 character password',
        '例如：Beijing': 'e.g. Beijing',
        '例如：New York': 'e.g. New York',
        '例如：Suzhou': 'e.g. Suzhou',
        '注册时手机号': 'Phone number used at sign-up',
        '省/市/区 + 详细街道门牌号': 'Province / city / district + street and number',
        '请再次输入密码': 'Re-enter your password',
        '请详细描述您遇到的问题或建议': 'Describe the issue or suggestion in detail',
        '请输入11位手机号': 'Enter an 11-digit phone number',
        '请输入充值金额': 'Enter a top-up amount',
        '请输入姓名': 'Enter your name',
        '请输入您的姓名': 'Your name',
        '请输入您的联系电话': 'Your contact number',
        '请输入您的问题…': 'Describe your question…',
        '请输入收件人姓名': 'Recipient name',
        '请输入收货人姓名': 'Recipient name',
        '请输入注册时的 11 位手机号': 'Enter the 11-digit phone number you registered with',
        '请输入证件号码': 'Enter your ID number',
        '请输入详细收货地址': 'Enter the full delivery address',
        '输入乘机人姓名': 'Enter a passenger name',
        '输入城市，如：Beijing / Shanghai / Guangzhou / New York': 'Enter a city, e.g. Beijing / Shanghai / Guangzhou / New York',
        '输入订单号': 'Enter an order number',
        /* ---- 出行预订补充 ---- */
        '搜索空铁联运方案': 'Search air + rail options',
        '您正在预订': 'You are booking',
        '航班确认': 'Flight confirmation',
        '乘客信息': 'Passenger details',
        '乘客姓名': 'Passenger name',
        '身份证号 / 护照号': 'ID / passport no.',
        '请输入 18 位身份证号或有效护照号': 'Enter an 18-digit ID or a valid passport number',
        '订单摘要': 'Order summary',
        '应付总额': 'Total due',
        '加入购物袋': 'Add to cart',

        /* ---- 牧师商城补充 ---- */
        '暂无商城订单。挑选喜欢的周边，体验完整购物流程吧。': 'No shop orders yet. Pick something you like and try the full flow.',
        '确认购买': 'Confirm purchase',
        '购买数量': 'Quantity',
        '单价': 'Unit price',
        '收货人': 'Recipient',
        '收货地址': 'Delivery address',
        '合计': 'Total',
        '去支付': 'Go to payment',
        '订单支付': 'Order payment',
        '会员账户余额（模拟支付）': 'Member balance (simulated payment)',
        '去充值': 'Top up',
        '确认支付': 'Confirm payment',
        '模拟支付环境：从会员账户余额扣款，不产生真实支付': 'Simulated: deducted from your member balance, no real payment is made',

        /* ---- 页脚与合作链接 ---- */
        '虔诚 · 严谨 · 安心': 'Discreet · Precise · Reassuring',
        '像牧师般严谨负责、温柔守护每一段航程': 'Every journey, watched over with care',
        '客服通道：短信 · 邮箱 · GitHub': 'Support: SMS · Email · GitHub',
        '服务时间：07:00-23:00': 'Hours: 07:00-23:00',
        '企业地址：民航商务区A座': 'Address: Block A, Civil Aviation Business District',
        '兑换码：': 'Redeem code: ',
        '友情链接：': 'Partners: ',
        '12306 铁路官网': '12306 Rail',
        '中国国际航空': 'Air China',
        '中国南方航空': 'China Southern',
        '中国东方航空': 'China Eastern',
        '海南航空': 'Hainan Airlines',


        /* ---- 购物车 / 订单 / 值机 / 登录 ---- */
        '购物车为空，请先去预订航班。': 'Your cart is empty. Start by booking a flight.',
        '在线支付': 'Pay online',
        '优惠券（会员里程兑换）': 'Coupons (redeemed with miles)',
        '铁路坐席（空铁联运）': 'Rail seat (air + rail)',
        '返回': 'Back',
        '订单号': 'Order no.',
        '乘机人姓名': 'Passenger',
        '重置': 'Reset',
        '暂无订单，请前往机票预订页面购买航班。': 'No orders yet. Book a flight to get started.',
        '免费改签': 'Free change',
        '选择新出发日期': 'New departure date',
        '确认改签': 'Confirm change',
        '升舱 / 降舱': 'Upgrade / downgrade',
        '请选择舱位': 'Select a cabin',
        '选择补偿方案': 'Compensation options',
        '全额退款': 'Full refund',
        '按实付金额原路退回': 'Refunded to the original payment method',
        '下次购票可抵扣': 'Credit toward your next booking',
        '累积至会员账户': 'Credited to your member account',
        '线上值机': 'Check in online',
        '我的可值机订单': 'My eligible trips',
        '暂无待值机的机票订单，请先完成购票。': 'Nothing to check in yet. Please complete a booking first.',
        '账号登录': 'Sign in',
        '您已登录': 'You are signed in',
        '账号：': 'Account: ',
        '会员姓名：': 'Name: ',
        '会员卡号：': 'Member no.: ',
        '当前等级：': 'Tier: ',
        '· 可用里程': '· Available miles',
        '进入会员中心': 'Go to Mileage plan',
        '注册': 'Join',
        '登 录': 'Sign in',
        '还没有账号？': 'No account yet?',
        '立即注册': 'Join now',
        '姓名': 'Name',
        '注册并登录': 'Register and sign in',
        '注册即成为老牧师航空会员，账号与会员账号互通': 'Joining makes you a Laomusi member — your account and membership are linked',

        /* ---- 充值 / 支付 / 绑卡弹窗 ---- */
        '账户充值': 'Top up balance',
        '模拟充值，确认后立即到账，不产生真实扣款。': 'Simulated top-up: credited instantly, no real charge.',
        '快捷金额': 'Quick amounts',
        '自定义金额（元，单次上限 ¥100,000）': 'Custom amount (CNY, max ¥100,000)',
        '确认充值': 'Confirm top-up',
        '绑定': 'Link',
        '确认绑定': 'Confirm',
        '已绑定': 'Linked',
        '填写收货信息': 'Delivery details',
        '收件人姓名': 'Recipient name',
        '里程，可到下方兑换中心换取代金券与出行权益。': ' miles — redeem them below for vouchers and travel perks.',
        '趣味': 'Fun',
        '支付宝': 'Alipay',
        '微信支付': 'WeChat Pay',
        '银行卡': 'Bank card',
        '订单支付': 'Order payment',
        '支付': 'Pay',

        '详细地址': 'Street address',
        '确认兑换': 'Confirm redemption',

        '每消费 ¥1 累积 1 里程，购买机票支付后自动到账；黑钻卡需累积消费满 ¥100 万并额外支付 ¥28,888 开通。': 'Every ¥1 spent earns 1 mile, credited after payment. Black Diamond requires ¥1,000,000 lifetime spend plus ¥28,888.',
        '会员等级、里程、余额、优惠券和订单都保存在这台浏览器里。换电脑、换浏览器或清理缓存前，先导出一份备份码；到新设备上用同一段码导入即可恢复。': 'Tier, miles, balance, coupons and orders all live in this browser. Export a backup code before switching computers or clearing cache, then import it on the new device.',
        '胡楚粤 · 老牧师航空 ©2026 版权所有': 'Hu Chuyue · Laomusi Airlines ©2026 All rights reserved',
        '个人制作网站仅供模拟、娱乐、学习使用，请勿用于非法用途': 'Personal demo site, for simulation, recreation and study only. Do not use for unlawful purposes.',
        '本网站为个人制作，仅用于模拟、娱乐与学习交流，不提供任何真实航班、真实票务或真实支付服务': 'This is a personal demo site for simulation, recreation and study. It does not offer real flights, real ticketing or real payments.',

        '胡楚粤 · 老牧师航空 ©2026 版权所有 | 个人制作网站仅供模拟、娱乐、学习使用，请勿用于非法用途': 'Hu Chuyue · Laomusi Airlines ©2026 All rights reserved | Personal demo site for simulation, recreation and study only. Do not use for unlawful purposes.',
        '上海': 'Shanghai',
        '南京': 'Nanjing',
        '温州': 'Wenzhou',
        '武汉': 'Wuhan',
        '合肥': 'Hefei',
        '杭州': 'Hangzhou',
        '成都': 'Chengdu',
        '西安': 'Xi\'an',
        '广州': 'Guangzhou',
        '北京': 'Beijing',
        '深圳': 'Shenzhen',
        '重庆': 'Chongqing',
        '天津': 'Tianjin',
        '青岛': 'Qingdao',
        '厦门': 'Xiamen',
        '昆明': 'Kunming',
        '长沙': 'Changsha',
        '郑州': 'Zhengzhou',
        '沈阳': 'Shenyang',
        '大连': 'Dalian',
        '福州': 'Fuzhou',
        '济南': 'Jinan',
        '三亚': 'Sanya',
        '海口': 'Haikou',
        '桂林': 'Guilin',
        '贵阳': 'Guiyang',
        '兰州': 'Lanzhou',
        '南昌': 'Nanchang',
        '宁波': 'Ningbo',
        '无锡': 'Wuxi',
        '珠海': 'Zhuhai',
        '南宁': 'Nanning',
        '太原': 'Taiyuan',
        '石家庄': 'Shijiazhuang',
        '银川': 'Yinchuan',
        '西宁': 'Xining',
        '拉萨': 'Lhasa',
        '呼和浩特': 'Hohhot',
        '乌鲁木齐': 'Urumqi',
        '哈尔滨': 'Harbin',
        '长春': 'Changchun',
        '香港': 'Hong Kong',
        '澳门': 'Macau',
        '台北': 'Taipei',
        '东京': 'Tokyo',
        '大阪': 'Osaka',
        '首尔': 'Seoul',
        '新加坡': 'Singapore',
        '曼谷': 'Bangkok',
        '吉隆坡': 'Kuala Lumpur',
        '伦敦': 'London',
        '巴黎': 'Paris',
        '纽约': 'New York',
        '悉尼': 'Sydney',
        '迪拜': 'Dubai',
        '洛杉矶': 'Los Angeles',
        '法兰克福': 'Frankfurt',
        '温哥华': 'Vancouver',
        '墨尔本': 'Melbourne',
        '更多热门航线': 'More popular routes',
        '更多活动': 'More campaigns',
        '更多商品': 'More products',
        '进入商城': 'Enter the shop',
        '视频征集 · 已结束': 'Video call for entries · Closed',
        '逐梦云天 · 定格航影': 'Chasing the Sky · Frozen Flight',
        '活动已结束，后续获奖名单等待官方公布。': 'The campaign has ended. Winners will be announced officially.',
        '老牧师航空官方周边 · 下单→支付→发货→收货全程模拟': 'Laomusi official merchandise · order → pay → ship → receive, fully simulated',
        '波音787 飞机模型（1:400）': 'Boeing 787 model (1:400)',
        '老牧师航空 联名登机行李箱': 'Laomusi co-branded carry-on suitcase',
        '机长熊公仔': 'Captain Bear plush',
        '查询出发 / 到达城市的模拟天气（随机生成，同一天同一城市保持稳定）。若起降地出现恶劣天气（暴雨、雷暴、大雪、大风等），航班可能取消。恶劣天气航班仍可购票，若航班取消将自动提供免费改签或其他补偿方案。': 'Look up simulated weather for your departure and arrival cities (randomised, but stable for the same city and day). Severe weather — downpours, thunderstorms, heavy snow, high winds — may cancel a flight. You can still buy a ticket in bad weather; if the flight is cancelled we offer a free rebooking or other compensation.',
        '空铁联运：飞机 + 高铁组合出行，一单搞定两段行程。先飞后铁 / 先铁后飞均可匹配。': 'Air + rail: combine a flight with a high-speed train in one booking. Flight-first or train-first, both supported.',
        '输入航班号': 'Enter a flight number',
        '查询航班状态': 'Check flight status',
        '余额不足时无法支付，可先到会员中心充值（模拟充值，即时到账）。': 'Payment fails when your balance is short — top up in the Member centre first (simulated, credited instantly).',
        '手机号 + 密码登录。账号数据保存在本机，与会员账号互通，登录后即可查看里程与权益。': 'Sign in with your phone number and password. Accounts live on this device and are linked to your membership, so miles and perks appear right away.',
        '银色涂装 · 老牧师航空定制': 'Silver livery · Laomusi custom',
        '20寸 · 雾蓝磨砂 · 航空徽章': '20-inch · misty blue matte · airline badge',
        '飞行员制服 · 限量版': 'Pilot uniform · limited edition',
        '偷吃乌龟模型': 'Sneaky turtle figurine',
        '树脂摆件 · 可爱珍藏': 'Resin piece · collectible',
        '航空徽章套装（4枚）': 'Airline badge set (4 pieces)',
        '飞机/云朵/翅膀/跑道': 'Plane / cloud / wing / runway',
        '飞行日志手账本': 'Flight log journal',
        '深蓝皮面 · 烫金飞机': 'Navy leather · gold-stamped plane',
        '云端咖啡兑换券': 'Cloud coffee voucher',
        '贵宾厅咖啡 · 电子券': 'Lounge coffee · e-voucher',
        '全部特价机票': 'All special fares',
        '上海出发 · 16 个热门目的地，低至 ¥301 起': 'From Shanghai · 16 popular destinations, from ¥301',
        '恭喜你发现了神秘彩蛋！': 'You found the mystery easter egg!',
        '这只爱比耶的小袋鼠送你一次抽奖机会，每天可抽一次': 'This little kangaroo has a free draw for you — one per day.',
        '我的奖品': 'My prizes',
        '还没有奖品，快抽一次吧～': 'No prizes yet — give it a spin.',
        '哎呀，这个页面好像飞丢了': 'Oops — this page seems to have flown away',
        '您访问的页面不存在或已被移动，请检查地址是否正确，或返回首页继续旅程': 'The page doesn\'t exist or has moved. Check the address, or head home to continue your journey.',
        '特殊服务申请': 'Special service request',
        '定制特殊餐食、特殊旅客、无陪伴儿童、宠物上机、大容量电池托运等出行服务，提交后由客服审核确认。': 'Special meals, passenger assistance, unaccompanied minors, pets in cabin, large-battery carriage and more. Every request is reviewed by our service team.',
        '选择服务类型': 'Choose a service type',
        '定制特殊餐食': 'Special meal',
        '特殊旅客申请': 'Passenger assistance',
        '无陪伴儿童申请': 'Unaccompanied minor',
        '宠物上机申请': 'Pet in cabin',
        '大容量电池托运申请': 'Large battery in checked baggage',
        '关联航班': 'Linked flight',
        '提交申请': 'Submit request',
        '我的申请记录': 'My requests',
        '暂无申请记录。选择上方服务类型提交申请后，可在这里查看审核进度。': 'No requests yet. Pick a service above and submit — progress will show up here.',
        /* ---- 通用 ---- */
        '返回首页': 'Back to home',
        '关闭': 'Close',
        '取消': 'Cancel',
        '确定': 'Confirm',
        '下一步': 'Next',
        '上一步': 'Back'
    };

    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1 };

    var CAB2 = { '经济舱': 'Economy', '超级经济舱': 'Premium economy', '商务舱': 'Business', '头等舱': 'First' };
    var SEATV = { '二等座': 'second class', '一等座': 'first class', '商务座': 'business class' };
    var CITYMAP = {};
    function stationEn(str) {
        var en = cityEn(str);
        en = en.replace('虹桥', ' Hongqiao').replace('浦东', ' Pudong').replace('首都', ' Capital');
        en = en.replace(/南$/, ' South').replace(/东$/, ' East').replace(/北$/, ' North').replace(/西$/, ' West');
        return en.replace(/\s+/g, ' ').trim();
    }
    ["苏州","嘉兴","上海","南京","温州","武汉","合肥","杭州","成都","西安","广州","北京","深圳","重庆","天津","青岛","厦门","昆明","长沙","郑州","沈阳","大连","福州","济南","三亚","海口","桂林","贵阳","兰州","南昌","宁波","无锡","珠海","南宁","太原","石家庄","银川","西宁","拉萨","呼和浩特","乌鲁木齐","哈尔滨","长春","香港","澳门","台北","东京","大阪","首尔","新加坡","曼谷","吉隆坡","伦敦","巴黎","纽约","悉尼","迪拜","洛杉矶","法兰克福","温哥华","墨尔本","丽江","舟山","喀什","伊宁","阿勒泰","漠河","长白山","稻城","林芝","西双版纳","泉州","北海","香格里拉","敦煌","芽庄","富国岛","清迈","普吉岛","暹粒","岘港"].forEach(function (k) { if (DICT[k]) CITYMAP[k] = DICT[k]; });

    function cityEn(str) {
        var keys = Object.keys(CITYMAP), out = str;
        for (var i = 0; i < keys.length; i++) out = out.split(keys[i]).join(CITYMAP[keys[i]]);
        return out;
    }

    function translate(text) {
        var trimmed = text.trim();
        if (!trimmed) return null;
        var norm = trimmed.replace(/\s+/g, ' ');
        var hit = DICT[trimmed] || DICT[norm];
        if (hit) return text.replace(trimmed, hit);
        var m = trimmed.match(/^¥(\d+)起$/);
        if (m) return text.replace(trimmed, 'from ¥' + m[1]);
        var m2 = trimmed.match(/^(\d+)小时(\d+)分/);
        if (m2) return text.replace(trimmed, m2[1] + 'h ' + m2[2] + 'm');
        var m3 = trimmed.match(/^余额 ¥([\d,]+)$/);
        if (m3) return text.replace(trimmed, 'Balance ¥' + m3[1]);
        var m4 = trimmed.match(/^共 (\d+) 个订单$/);
        if (m4) return text.replace(trimmed, m4[1] + ' order(s)');
        var m5 = trimmed.match(/^可用里程 ([\d,]+)/);
        if (m5) return text.replace(trimmed, 'Available miles ' + m5[1]);
        var m6 = trimmed.match(/^¥(\d+) 优惠券$/);
        if (m6) return text.replace(trimmed, '¥' + m6[1] + ' voucher');
        var m7 = trimmed.match(/^([\d,]+) 里程$/);
        if (m7) return text.replace(trimmed, m7[1] + ' miles');
        var TIER = { '普卡': 'Basic', '银卡': 'Silver', '金卡': 'Gold', '铂金卡': 'Platinum', '钻石卡': 'Diamond', '黑钻卡': 'Black Diamond' };
        var m8 = trimmed.match(/^(普卡|银卡|金卡|铂金卡|钻石卡|黑钻卡) · (.+)$/);
        if (m8) return text.replace(trimmed, TIER[m8[1]] + ' · ' + m8[2]);
        var m9 = trimmed.match(/^(.+?)  ·  加入于 (.+)$/);
        if (m9) return text.replace(trimmed, m9[1] + ' · joined ' + m9[2]);
        /* 航线与出发城市：城市名先转写，再处理“出发 / 约 X 小时 / 每日多班” */
        var m10 = trimmed.match(/^(.+) 出发 · 约 (.+) 小时 · 每日多班$/);
        if (m10) return text.replace(trimmed, 'Departures from ' + cityEn(m10[1]) + ' · about ' + m10[2] + 'h · multiple daily flights');
        var m11 = trimmed.match(/^(.+) 出发 · ([\d,]+) 个热门目的地，低至 ¥([\d,]+) 起$/);
        if (m11) return text.replace(trimmed, 'From ' + cityEn(m11[1]) + ' · ' + m11[2] + ' popular destinations, from ¥' + m11[3]);
        var m12 = trimmed.match(/^(.+) 出发$/);
        if (m12) return text.replace(trimmed, 'From ' + cityEn(m12[1]));
        var m41 = trimmed.match(/^例如：(.+)$/);
        if (m41) return text.replace(trimmed, 'e.g. ' + m41[1]);
        var m33 = trimmed.match(/^(.+?)\s*→\s*(.+?)：补差价 ¥([\d,]+)$/);
        if (m33) return text.replace(trimmed, (CAB2[m33[1]] || m33[1]) + ' → ' + (CAB2[m33[2]] || m33[2]) + ': extra ¥' + m33[3]);
        var m34 = trimmed.match(/^(.+?)\s*→\s*(.+?)：退回差价 ¥([\d,]+)$/);
        if (m34) return text.replace(trimmed, (CAB2[m34[1]] || m34[1]) + ' → ' + (CAB2[m34[2]] || m34[2]) + ': refund ¥' + m34[3]);
        var m13 = trimmed.match(/^(.+) → (.+)$/);
        if (m13) return text.replace(trimmed, cityEn(m13[1]) + ' → ' + cityEn(m13[2]));
        var m15 = trimmed.match(/^(.+) 出发 · 约 (.+) 小时 · (.+)$/);
        if (m15) {
            var FREQ = { '直飞': 'nonstop', '周末班': 'weekend service', '每周多班': 'several weekly flights', '季节性': 'seasonal', '包机': 'charter', '每日多班': 'multiple daily flights' };
            return text.replace(trimmed, 'Departures from ' + cityEn(m15[1]) + ' · about ' + m15[2] + 'h · ' + (FREQ[m15[3]] || m15[3]));
        }
        var PAYV = { '余额支付': 'Balance', '支付宝': 'Alipay', '微信支付': 'WeChat Pay', '银行卡': 'Bank card' };
        var m39 = trimmed.match(/^请于登机时间（起飞前 40 分钟）前抵达 (.+) 登机口，并出示有效证件与登机牌；未及时登机可能无法乘机。$/);
        if (m39) return text.replace(trimmed, 'Please reach gate ' + m39[1] + ' by boarding time (40 minutes before departure) with valid ID and your boarding pass; missing the flight may not be recoverable.');
        var m35 = trimmed.match(/^空铁联运：(.+?)\s*→\s*(.+)$/);
        if (m35) return text.replace(trimmed, 'Air + rail: ' + stationEn(m35[1]) + ' → ' + stationEn(m35[2]));
        var m36 = trimmed.match(/^航班 ([A-Z0-9]+)：(.+?)\s*→\s*(.+)$/);
        if (m36) return text.replace(trimmed, 'Flight ' + m36[1] + ': ' + stationEn(m36[2]) + ' → ' + stationEn(m36[3]));
        var m37 = trimmed.match(/^高铁 ([A-Z0-9]+)：(.+?)[\s\u3000]+(.+)（(.+)）$/);
        if (m37) return text.replace(trimmed, 'Rail ' + m37[1] + ': ' + stationEn(m37[2]) + ' · ' + m37[3] + ' (' + m37[4] + ')');
        var m38 = trimmed.match(/^票价：¥([\d,]+)（含高铁(.+)）$/);
        if (m38) return text.replace(trimmed, 'Fare ¥' + m38[1] + ' (incl. rail ' + (SEATV[m38[2]] || m38[2]) + ')');
        var m20 = trimmed.match(/^订单号：(.+)$/); if (m20) return text.replace(trimmed, 'Order no. ' + m20[1]);
        var m21 = trimmed.match(/^航班：([A-Z0-9]+)\s+(.+?)→(.+)$/); if (m21) return text.replace(trimmed, 'Flight: ' + m21[1] + ' · ' + cityEn(m21[2]) + ' → ' + cityEn(m21[3]));
        var m22 = trimmed.match(/^日期：(.+)$/); if (m22) return text.replace(trimmed, 'Date: ' + m22[1]);
        var m23 = trimmed.match(/^舱位：(.+)$/); if (m23) return text.replace(trimmed, 'Cabin: ' + (CAB2[m23[1]] || m23[1]));
        var m24 = trimmed.match(/^乘客：(.+)$/); if (m24) return text.replace(trimmed, 'Passenger: ' + m24[1]);
        var m25 = trimmed.match(/^票价：¥([\d,]+)（实付 ¥([\d,]+)(，券抵扣 ¥([\d,]+))?）$/);
        if (m25) return text.replace(trimmed, 'Fare ¥' + m25[1] + ' (paid ¥' + m25[2] + (m25[4] ? ', voucher ¥' + m25[4] : '') + ')');
        var m25b = trimmed.match(/^票价：¥([\d,]+)$/); if (m25b) return text.replace(trimmed, 'Fare ¥' + m25b[1]);
        var m26 = trimmed.match(/^支付方式：(.+)$/); if (m26) return text.replace(trimmed, 'Payment: ' + (PAYV[m26[1]] || m26[1]));
        var m27 = trimmed.match(/^申请退票（手续费(\d+)% · 退¥([\d,]+)）$/); if (m27) return text.replace(trimmed, 'Request refund (fee ' + m27[1] + '% · refund ¥' + m27[2] + ')');
        var m28 = trimmed.match(/^已值机 · *(.*?)（查看登机牌）$/); if (m28) return text.replace(trimmed, 'Checked in · ' + m28[1] + ' (boarding pass)');
        var m29 = trimmed.match(/^已退票，手续费 ¥([\d,]+)，已退还 ¥([\d,]+)$/); if (m29) return text.replace(trimmed, 'Refunded — fee ¥' + m29[1] + ', refunded ¥' + m29[2]);
        var m30 = trimmed.match(/^已发放 ¥([\d,]+) 补偿优惠券$/); if (m30) return text.replace(trimmed, '¥' + m30[1] + ' compensation voucher issued');
        var m31 = trimmed.match(/^会员 (.+) · 获得里程 \+([\d,]+)$/); if (m31) return text.replace(trimmed, 'Member ' + m31[1] + ' · miles +' + m31[2]);
        var m32 = trimmed.match(/^会员 (.+)$/); if (m32) return text.replace(trimmed, 'Member ' + m32[1]);
        var m17 = trimmed.match(/^全部虚拟航班（共 ([\d,]+) 个航班）$/);
        if (m17) return text.replace(trimmed, 'All simulated flights (' + m17[1] + ' total)');
        var m18 = trimmed.match(/^(经济舱|超级经济舱|商务舱|头等舱) ¥([\d,]+)$/);
        if (m18) {
            var CAB = { '经济舱': 'Economy', '超级经济舱': 'Premium economy', '商务舱': 'Business', '头等舱': 'First' };
            return text.replace(trimmed, CAB[m18[1]] + ' ¥' + m18[2]);
        }
        var m19 = trimmed.match(/^恶劣天气预警：(.+?) (暴雨|雷暴|大雪|大风|大雾|冰雹|高温|台风)，航班可能取消$/);
        if (m19) {
            var WX = { '暴雨': 'heavy rain', '雷暴': 'thunderstorms', '大雪': 'heavy snow', '大风': 'high winds', '大雾': 'dense fog', '冰雹': 'hail', '高温': 'extreme heat', '台风': 'a typhoon' };
            return text.replace(trimmed, 'Severe weather alert: ' + cityEn(m19[1]) + ' ' + (WX[m19[2]] || m19[2]) + ' — flights may be cancelled');
        }
        var m16 = trimmed.match(/^([\d,]+) 条精选航线，覆盖全球热门与小众目的地$/);
        if (m16) return text.replace(trimmed, m16[1] + ' curated routes across popular and off-the-beaten-path destinations');
        var m14 = trimmed.match(/^点击抽奖（今日剩 ([\d,]+) 次）$/);
        if (m14) return text.replace(trimmed, 'Draw (' + m14[1] + ' left today)');
        var cityOnly = cityEn(trimmed);
        if (cityOnly !== trimmed) return text.replace(trimmed, cityOnly);
        return null;
    }

    function walk(node) {
        var kids = node.childNodes;
        for (var i = 0; i < kids.length; i++) {
            var child = kids[i];
            if (child.nodeType === 3) {
                var t = translate(child.nodeValue);
                if (t !== null) child.nodeValue = t;
            } else if (child.nodeType === 1) {
                if (SKIP_TAGS[child.tagName]) continue;
                if (child.hasAttribute('data-no-i18n')) continue;
                var attrs = ['placeholder', 'title', 'aria-label', 'alt'];
                for (var a = 0; a < attrs.length; a++) {
                    var v = child.getAttribute(attrs[a]);
                    if (!v) continue;
                    var tv = translate(v);
                    if (tv !== null) child.setAttribute(attrs[a], tv);
                }
                walk(child);
            }
        }
    }

    /* 输入框提示语与 title 属性（i18n 只处理文本节点，属性要单独过一遍） */
    function attrPass() {
        if (lang !== 'en') return;
        var i, els;
        els = document.querySelectorAll('[placeholder]');
        for (i = 0; i < els.length; i++) {
            var el = els[i];
            var zh = el.getAttribute('placeholder-zh');
            var cur = el.getAttribute('placeholder');
            /* 自愈：历史上被错误写成字符串 null 的，先恢复 */
            if (!zh) {
                if (!cur || cur === 'null') { el.removeAttribute('placeholder-zh'); continue; }
                zh = cur;
                el.setAttribute('placeholder-zh', zh);
            }
            var en = translate(zh);
            if (typeof en === 'string' && en && en !== cur) {
                el.setAttribute('placeholder', en);
            } else if (cur === 'null') {
                el.setAttribute('placeholder', zh);
            }
        }
        els = document.querySelectorAll('[title]');
        for (i = 0; i < els.length; i++) {
            var e2 = els[i];
            var t2 = e2.getAttribute('title-zh');
            var cur2 = e2.getAttribute('title');
            if (!t2) {
                if (!cur2 || cur2 === 'null') { e2.removeAttribute('title-zh'); continue; }
                t2 = cur2;
                e2.setAttribute('title-zh', t2);
            }
            var e3 = translate(t2);
            if (typeof e3 === 'string' && e3 && e3 !== cur2) {
                e2.setAttribute('title', e3);
            } else if (cur2 === 'null') {
                e2.setAttribute('title', t2);
            }
        }
    }

    // 英文页标题：整串精确映射，避免出现半中半英
    var TITLE_EN = {
        '老牧师航空 - 首页': 'Laomusi Airlines — Home',
        '页面未找到 | 老牧师航空': 'Page not found | Laomusi Airlines',
        '关于我们 | 老牧师航空': 'About us | Laomusi Airlines',
        '光影星踪·影像创作计划 | 老牧师航空': 'Light & Shadow · Image Creation | Laomusi Airlines',
        '出行预订 | 老牧师航空': 'Book a flight | Laomusi Airlines',
        '购物车 | 老牧师航空': 'Cart | Laomusi Airlines',
        '在线值机 | 老牧师航空': 'Online check-in | Laomusi Airlines',
        '在线客服 | 老牧师航空': 'Support | Laomusi Airlines',
        '全部特价 | 老牧师航空': 'All fares | Laomusi Airlines',
        '神秘彩蛋 | 老牧师航空': 'Easter egg | Laomusi Airlines',
        '航班动态 | 老牧师航空': 'Flight status | Laomusi Airlines',
        '账号登录 | 老牧师航空': 'Sign in | Laomusi Airlines',
        '会员中心 | 老牧师航空': 'Member centre | Laomusi Airlines',
        '我的订单 | 老牧师航空': 'My orders | Laomusi Airlines',
        '服务指南 | 老牧师航空': 'Service guide | Laomusi Airlines',
        '全部航线 | 老牧师航空': 'All routes | Laomusi Airlines',
        '牧师商城 | 老牧师航空': 'Laomusi shop | Laomusi Airlines',
        '特殊服务申请 | 老牧师航空': 'Special assistance | Laomusi Airlines',
        '访问环境说明 | 老牧师航空': 'Browser support | Laomusi Airlines',
        '更新公告 | 老牧师航空': 'Announcements | Laomusi Airlines'
    };

    // 统计数字在英文下按量级重写（"1,200万+" 应为 12M+，不能直译成 1,200M+）
    function statEn() {
        document.querySelectorAll('.stat-num[data-en-num]').forEach(function (el) {
            var n = el.getAttribute('data-en-num'), u = el.getAttribute('data-en-unit') || '';
            if (!n) return;
            el.textContent = n;
            if (u) {
                var s = document.createElement('span');
                s.textContent = u;
                el.appendChild(s);
            }
        });
    }

    function apply() {
        try { document.documentElement.lang = (lang === 'en' ? 'en' : 'zh-CN'); } catch (e) {}
        if (lang !== 'en') return;
        try {
            walk(document.body);
            attrPass();
            statEn();
            var t = (document.title || '').trim();
            if (TITLE_EN[t]) {
                document.title = TITLE_EN[t];
            } else {
                var dt = translate(t);
                if (dt !== null) document.title = dt;
            }
        } catch (e) {}
        syncButton();
    }

    function syncButton() {
        var b = document.getElementById('langToggle');
        if (b) {
            b.textContent = lang === 'en' ? '中文' : 'EN';
            b.setAttribute('title', lang === 'en' ? '切换到中文' : 'Switch to English');
            b.setAttribute('aria-label', lang === 'en' ? '切换到中文' : 'Switch to English');
        }
        var m = document.getElementById('langToggleMobile');
        if (m) m.textContent = lang === 'en' ? 'Language: 中文' : '语言 / Language';
    }

    function toggle() {
        var next = lang === 'en' ? 'zh' : 'en';
        try { localStorage.setItem(KEY, next); } catch (e) {}
        location.reload();
    }

    /* 兜底：若导航里没有语言按钮（旧版 common.js 缓存），自己补一个 */
    function ensureLangButton() {
        if (document.getElementById('langToggle')) return false;
        var header = document.querySelector('header');
        if (!header) return false;
        var btn = document.createElement('button');
        btn.id = 'langToggle';
        btn.type = 'button';
        var anchor = document.getElementById('themeToggle') || header.querySelector('#menuBtn');
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        else header.appendChild(btn);
        btn.addEventListener('click', toggle);
        syncButton();
        return true;
    }

    function bind() {
        ensureLangButton();
        var b = document.getElementById('langToggle');
        if (b && !b._bound) { b._bound = true; b.addEventListener('click', toggle); }
        var m = document.getElementById('langToggleMobile');
        if (m && !m._bound) { m._bound = true; m.addEventListener('click', function (e) { e.preventDefault(); toggle(); }); }
        syncButton();
    }

    apply();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { apply(); bind(); });
    } else {
        bind();
    }
    /* 导航/页脚由 common.js 异步渲染，稍后再跑一遍 */
    var tries = 0, poll = setInterval(function () {
        ensureLangButton(); apply(); bind();
        if (++tries > 30) clearInterval(poll);
    }, 100);

    /* 动态渲染的列表/弹窗出来后自动补译，150ms 防抖 */
    if (lang === 'en' && window.MutationObserver) {
        var timer = null;
        var obs = new MutationObserver(function () {
            if (timer) return;
            timer = setTimeout(function () { timer = null; apply(); }, 150);
        });
        try { obs.observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) {}
    }

    window.LMSI18n = { apply: apply, lang: lang, dict: DICT };
})();
