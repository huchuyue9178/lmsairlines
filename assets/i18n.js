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
        '个人制作网站仅供模拟、娱乐、学习使用，请勿用于非法用途': 'Personal demo site, for simulation, recreation and study only. Do not use for unlawful purposes.',

        /* ---- 首页 ---- */
        'Hello, Welcome to': 'Hello, welcome to',
        '虔诚 · 严谨 · 安心，像牧师般守护每一段飞行': 'Discreet, precise, reassuring — every flight, watched over.',
        '查询航班': 'Search flights',
        '了解更多': 'Learn more',
        '全球通航城市': 'Cities served',
        '在役机队': 'Aircraft',
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
        '官方邮箱：3686319507@qq.com': 'Email: 3686319507@qq.com',
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
        /* ---- 通用 ---- */
        '返回首页': 'Back to home',
        '关闭': 'Close',
        '取消': 'Cancel',
        '确定': 'Confirm',
        '下一步': 'Next',
        '上一步': 'Back'
    };

    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1 };

    function translate(text) {
        var trimmed = text.trim();
        if (!trimmed) return null;
        var hit = DICT[trimmed];
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

    function apply() {
        if (lang !== 'en') return;
        try {
            document.documentElement.lang = 'en';
            walk(document.body);
            if (document.title) {
                var dt = translate(document.title);
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

    function bind() {
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
    [80, 260, 600].forEach(function (ms) { setTimeout(function () { apply(); bind(); }, ms); });

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
