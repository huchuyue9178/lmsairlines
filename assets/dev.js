/* ============================================================
   老牧师航空 · 开发者模式（dev.js）
   密码以 SHA-256 分片哈希存储，源码中不含明文。
   开发模式下会员自动切换为"测试账号"，可调节等级、里程，
   并可伪造订单 / 购物车 / 优惠券 / 测试会员，查看本地存储。
   ============================================================ */
(function () {
    'use strict';

    // 密码哈希分片（SHA-256 单向摘要）
    var SEG = ['4e0b4e4c', 'a28dbb0a', 'b910e721', 'e449c19d', 'bf7cdb4a', '34d8c74d', 'ca562999', '9ad41e3f'];
    var DIGEST = SEG.join('');

    var K_ON = 'lmsDevMode';
    var K_BK = 'lmsDevMemberBackup';
    var K_MB = 'ffpMember';

    var TEST_MEMBER = {
        cardNo: 'LMSF9999', name: '测试账号', phone: '18888888888',
        level: '普卡', totalMiles: 0, miles: 0, elite: false, devTest: true
    };
    var LV_NAME = ['普卡', '银卡', '金卡', '铂金卡', '钻石卡', '黑钻卡'];
    var LV_MIN = [0, 10000, 30000, 60000, 100000, 1000000];

    // 测试航线（伪造订单 / 购物车用）
    // time 必须为"起飞-到达"格式（订单页据此计算退改费率）
    var FAKE_ROUTES = [
        { start: '北京', end: '上海', no: 'LM1001', time: '08:00-10:15', price: 1280, cabin: '经济舱' },
        { start: '广州', end: '成都', no: 'LM2201', time: '09:30-11:40', price: 1180, cabin: '经济舱' },
        { start: '北京', end: '深圳', no: 'LM3301', time: '10:20-13:35', price: 1680, cabin: '经济舱' },
        { start: '上海', end: '纽约', no: 'LM8801', time: '13:20-15:50+1', price: 6880, cabin: '经济舱' },
        { start: '北京', end: '广州', no: 'LM4401', time: '11:05-14:15', price: 1680, cabin: '商务舱' }
    ];

    function isDev() { return localStorage.getItem(K_ON) === '1'; }
    // 取同航线真实航班（订单页改签/升舱依赖 searchFlights），无则返回 null
    function realFlight(start, end) {
        try {
            if (typeof flightList !== 'undefined' && flightList && flightList.length) {
                var cand = flightList.filter(function (f) { return f.start === start && f.end === end; });
                if (cand.length) return pick(cand);
            }
        } catch (e) {}
        return null;
    }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function dateStr(offsetDays) {
        var d = new Date(Date.now() + offsetDays * 864e5);
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function sha256Hex(text) {
        if (!(window.crypto && window.crypto.subtle && window.TextEncoder)) return Promise.resolve('');
        var buf = new TextEncoder().encode(text);
        return window.crypto.subtle.digest('SHA-256', buf).then(function (d) {
            var arr = new Uint8Array(d), out = '';
            for (var i = 0; i < arr.length; i++) out += (arr[i] < 16 ? '0' : '') + arr[i].toString(16);
            return out;
        });
    }
    function toast(msg, type) {
        if (typeof window.showToast === 'function') window.showToast(msg, type || 'info');
    }
    function readMember() {
        try { return JSON.parse(localStorage.getItem(K_MB) || 'null'); } catch (e) { return null; }
    }
    function writeMember(m) {
        if (m) localStorage.setItem(K_MB, JSON.stringify(m));
        else localStorage.removeItem(K_MB);
        if (typeof window.renderMemberArea === 'function') window.renderMemberArea();
        if (typeof window.renderPage === 'function') { try { window.renderPage(); } catch (e) {} }
    }
    function currentTestMember() {
        var m = readMember();
        if (!m || !m.devTest) { m = Object.assign({}, TEST_MEMBER); writeMember(m); }
        return m;
    }

    /* ---------------- 样式 ---------------- */
    function injectStyle() {
        if (document.getElementById('devStyle')) return;
        var css = ''
            + '.dev-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;'
            + 'background:rgba(30,38,48,0.42);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:20px;}'
            + '.dev-mask.dev-open{display:flex;}'
            + '.dev-card{width:100%;max-width:400px;box-sizing:border-box;border-radius:26px;padding:28px 26px 24px;'
            + 'background:linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.8));'
            + 'border:1px solid rgba(255,255,255,0.9);box-shadow:0 24px 60px rgba(30,38,48,0.24);color:#3a4a5c;}'
            + '.dev-card h3{font-size:20px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px;color:#1d1d1f;}'
            + '.dev-card p{font-size:13px;line-height:1.6;color:rgba(58,74,92,0.7);}'
            + '.dev-card input{width:100%;box-sizing:border-box;margin-top:16px;padding:12px 16px;border-radius:14px;font-size:15px;outline:none;'
            + 'border:1px solid rgba(150,175,200,0.45);background:rgba(255,255,255,0.85);color:#1d1d1f;}'
            + '.dev-card input:focus{border-color:rgba(74,90,110,0.6);box-shadow:0 0 0 4px rgba(74,90,110,0.12);}'
            + '.dev-err{font-size:12px;color:#c0392b;height:16px;margin-top:8px;}'
            + '.dev-row{display:flex;gap:10px;margin-top:18px;}'
            + '.dev-btn{flex:1;box-sizing:border-box;padding:12px 0;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;'
            + 'border:1px solid rgba(74,90,110,0.28);background:rgba(255,255,255,0.6);color:#4a5a6e;transition:all .3s ease;}'
            + '.dev-btn:hover{background:rgba(255,255,255,0.9);}'
            + '.dev-btn-main{background:linear-gradient(135deg,#4a5a6e,#5d7085);border-color:transparent;color:#fff;'
            + 'box-shadow:0 10px 26px rgba(74,90,110,0.24);}'
            + '.dev-btn-main:hover{transform:translateY(-1px);box-shadow:0 14px 32px rgba(74,90,110,0.3);}'
            + '.dev-exit{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;'
            + 'font-size:11px;color:#4a5a6e;border:1px solid rgba(74,90,110,0.35);background:rgba(255,255,255,0.6);'
            + 'cursor:pointer;transition:all .3s ease;margin-left:2px;}'
            + '.dev-exit:hover{background:#4a5a6e;color:#fff;transform:translateY(-1px);}'
            + '.dev-fab{position:fixed;right:18px;bottom:20px;z-index:900;width:54px;height:54px;border-radius:50%;'
            + 'display:none;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:0.06em;'
            + 'color:#fff;background:linear-gradient(135deg,#4a5a6e,#6b8299);box-shadow:0 12px 30px rgba(30,38,48,0.35);'
            + 'cursor:pointer;border:none;}'
            + '.dev-fab.dev-on{display:flex;}'
            + '.dev-panel{position:fixed;right:18px;bottom:84px;z-index:950;width:334px;max-width:calc(100vw - 36px);max-height:78vh;'
            + 'overflow:auto;display:none;box-sizing:border-box;border-radius:22px;padding:16px 18px 20px;'
            + 'background:linear-gradient(135deg,rgba(255,255,255,0.99),rgba(255,255,255,0.94));'
            + 'border:1px solid rgba(255,255,255,0.9);box-shadow:0 22px 60px rgba(30,38,48,0.26);color:#3a4a5c;}'
            + '.dev-panel.dev-open{display:block;}'
            + '.dev-panel .dev-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;}'
            + '.dev-panel .dev-head span{font-size:15px;font-weight:700;color:#1d1d1f;}'
            + '.dev-panel .dev-tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:999px;'
            + 'background:rgba(123,168,154,0.18);color:#3f7c6a;}'
            + '.dev-idline{font-size:13px;margin:6px 0 2px;}'
            + '.dev-sec{border-top:1px solid rgba(150,175,200,0.22);}'
            + '.dev-sec h4{display:flex;align-items:center;justify-content:space-between;cursor:pointer;'
            + 'font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;'
            + 'color:rgba(58,74,92,0.5);margin:0;padding:11px 0;user-select:none;}'
            + '.dev-sec h4:hover{color:#4a5a6e;}'
            + '.dev-sec .dev-caret{font-size:10px;transition:transform .3s ease;}'
            + '.dev-sec.open .dev-caret{transform:rotate(180deg);}'
            + '.dev-body{display:none;padding:0 0 14px;}'
            + '.dev-sec.open .dev-body{display:block;}'
            + '.dev-lvs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}'
            + '.dev-lv{padding:8px 0;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;'
            + 'border:1px solid rgba(150,175,200,0.4);background:rgba(255,255,255,0.6);color:#4a5a6e;transition:all .25s;}'
            + '.dev-lv.dev-cur{background:linear-gradient(135deg,#4a5a6e,#5d7085);color:#fff;border-color:transparent;}'
            + '.dev-mile{display:flex;gap:8px;}'
            + '.dev-mile input{flex:1;min-width:0;box-sizing:border-box;padding:9px 12px;border-radius:12px;font-size:13px;outline:none;'
            + 'border:1px solid rgba(150,175,200,0.45);background:rgba(255,255,255,0.85);color:#1d1d1f;}'
            + '.dev-mini{box-sizing:border-box;padding:9px 14px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;'
            + 'background:#4a5a6e;color:#fff;border:none;transition:filter .25s;}'
            + '.dev-mini:hover{filter:brightness(1.08);}'
            + '.dev-form{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;}'
            + '.dev-form select{box-sizing:border-box;width:100%;padding:9px 10px;border-radius:12px;font-size:12.5px;outline:none;'
            + 'border:1px solid rgba(150,175,200,0.45);background:rgba(255,255,255,0.85);color:#1d1d1f;}'
            + '.dev-acts{display:grid;grid-template-columns:1fr 1fr;gap:8px;}'
            + '.dev-acts .dev-mini{width:100%;}'
            + '.dev-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin:10px 0 8px;}'
            + '.dev-stats div{padding:10px 4px;border-radius:12px;background:rgba(216,223,230,0.5);}'
            + '.dev-stats b{display:block;font-size:17px;color:#1d1d1f;}'
            + '.dev-stats i{font-style:normal;font-size:11px;color:rgba(58,74,92,0.6);}'
            + '.dev-kv{font-size:12px;line-height:1.7;max-height:150px;overflow:auto;border-radius:12px;'
            + 'background:rgba(216,223,230,0.4);padding:8px 10px;margin-bottom:8px;}'
            + '.dev-kv-row{display:flex;align-items:center;justify-content:space-between;gap:8px;}'
            + '.dev-kv-row .k{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#3a4a5c;}'
            + '.dev-kv-row .v{color:rgba(58,74,92,0.55);flex:none;}'
            + '.dev-kv-del{border:none;background:none;cursor:pointer;color:#c0392b;font-size:14px;padding:0 2px;flex:none;line-height:1;}'
            + '.dev-links{display:flex;flex-wrap:wrap;gap:6px;}'
            + '.dev-links a{font-size:12px;padding:6px 10px;border-radius:999px;color:#4a5a6e;'
            + 'background:rgba(255,255,255,0.7);border:1px solid rgba(150,175,200,0.4);}'
            + '.dev-danger{box-sizing:border-box;width:100%;padding:10px 0;border-radius:12px;font-size:13px;font-weight:600;'
            + 'cursor:pointer;border:1px solid rgba(192,57,43,0.4);background:rgba(192,57,43,0.08);color:#c0392b;margin-top:8px;}'
            + '.dev-danger:hover{background:rgba(192,57,43,0.14);}'
            + '.dev-foot-link{display:block;margin:10px auto 0;font-size:11px;letter-spacing:0.1em;'
            + 'color:rgba(58,74,92,0.45);background:none;border:none;cursor:pointer;transition:color .3s;}'
            + '.dev-foot-link:hover{color:#4a5a6e;}'
            + '@media (prefers-color-scheme: dark){'
            + '.dev-card{background:linear-gradient(135deg,rgba(38,48,60,0.96),rgba(30,38,48,0.93));'
            + 'border-color:rgba(255,255,255,0.12);color:#dbe6f0;}'
            + '.dev-card h3{color:#e8edf2;}'
            + '.dev-card p{color:rgba(232,237,242,0.65);}'
            + '.dev-card input{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16);color:#e8edf2;}'
            + '.dev-btn{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);color:#e8edf2;}'
            + '.dev-btn-main{background:linear-gradient(135deg,#5c7189,#708ba6);color:#fff;}'
            + '.dev-exit{color:#e8edf2;border-color:rgba(255,255,255,0.24);background:rgba(255,255,255,0.1);}'
            + '.dev-exit:hover{background:rgba(255,255,255,0.22);color:#fff;}'
            + '.dev-panel{background:linear-gradient(135deg,rgba(38,48,60,0.99),rgba(30,38,48,0.97));'
            + 'border-color:rgba(255,255,255,0.12);color:#dbe6f0;}'
            + '.dev-panel .dev-head span{color:#e8edf2;}'
            + '.dev-sec{border-top-color:rgba(255,255,255,0.12);}'
            + '.dev-sec h4{color:rgba(232,237,242,0.5);}'
            + '.dev-sec h4:hover{color:#e8edf2;}'
            + '.dev-panel .dev-tag{background:rgba(123,168,154,0.2);color:#9dd0be;}'
            + '.dev-lv{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.18);color:#dbe6f0;}'
            + '.dev-lv.dev-cur{background:linear-gradient(135deg,#5c7189,#708ba6);color:#fff;}'
            + '.dev-mile input,.dev-form select{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16);color:#e8edf2;}'
            + '.dev-form select option{background:#262f3a;color:#e8edf2;}'
            + '.dev-mini{background:#5c7189;}'
            + '.dev-stats div{background:rgba(255,255,255,0.08);}'
            + '.dev-stats b{color:#e8edf2;}'
            + '.dev-stats i{color:rgba(232,237,242,0.6);}'
            + '.dev-kv{background:rgba(255,255,255,0.06);}'
            + '.dev-kv-row .k{color:#dbe6f0;}'
            + '.dev-kv-row .v{color:rgba(232,237,242,0.55);}'
            + '.dev-links a{color:#b9cfe2;background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.18);}'
            + '.dev-danger{background:rgba(192,57,43,0.18);border-color:rgba(220,110,100,0.4);color:#f0a99e;}'
            + '.dev-foot-link{color:rgba(232,237,242,0.5);}'
            + '.dev-foot-link:hover{color:#e8edf2;}'
            + '}';
        var st = document.createElement('style');
        st.id = 'devStyle';
        st.textContent = css;
        document.head.appendChild(st);
    }

    /* ---------------- 页脚入口 ---------------- */
    function ensureFooterEntry() {
        var footer = document.querySelector('#siteFooter footer');
        if (!footer || document.getElementById('devFootLink')) return;
        var last = footer.querySelector('.container > div:last-child');
        var wrap = document.createElement('div');
        wrap.style.cssText = 'text-align:center;';
        wrap.innerHTML = '<button type="button" id="devFootLink" class="dev-foot-link">开发者模式</button>';
        (last ? last.parentNode : footer).appendChild(wrap);
        wrap.querySelector('#devFootLink').addEventListener('click', function () {
            if (isDev()) openPanel(); else openPwd();
        });
        syncFooterLabel();
    }
    function syncFooterLabel() {
        var b = document.getElementById('devFootLink');
        if (b) b.textContent = isDev() ? '开发者模式 · 已开启（点击打开面板）' : '开发者模式';
    }

    /* ---------------- 面板骨架 ---------------- */
    function sec(id, title, open) {
        return '<div class="dev-sec' + (open ? ' open' : '') + '" data-sec="' + id + '">'
            + '<h4><span>' + title + '</span><i class="fa fa-chevron-down dev-caret" aria-hidden="true"></i></h4>'
            + '<div class="dev-body" id="devBody_' + id + '"></div></div>';
    }

    function ensureMasks() {
        if (document.getElementById('devPwdMask')) return;

        var pwd = document.createElement('div');
        pwd.id = 'devPwdMask'; pwd.className = 'dev-mask';
        pwd.innerHTML = '<div class="dev-card" role="dialog" aria-modal="true" aria-labelledby="devPwdTitle">'
            + '<h3 id="devPwdTitle">开发者模式</h3>'
            + '<p>该模式仅供站长与开发调试使用，请输入开发者密码。</p>'
            + '<input id="devPwdInput" type="password" autocomplete="off" placeholder="开发者密码">'
            + '<div class="dev-err" id="devPwdErr"></div>'
            + '<div class="dev-row"><button type="button" class="dev-btn" id="devPwdCancel">取消</button>'
            + '<button type="button" class="dev-btn dev-btn-main" id="devPwdOk">进入</button></div></div>';
        document.body.appendChild(pwd);

        var exit = document.createElement('div');
        exit.id = 'devExitMask'; exit.className = 'dev-mask';
        exit.innerHTML = '<div class="dev-card" role="dialog" aria-modal="true" aria-labelledby="devExitTitle">'
            + '<h3 id="devExitTitle">退出开发者模式？</h3>'
            + '<p>退出后将恢复为正常模式，测试账号、调节的等级里程会还原，伪造的测试数据需自行清理。</p>'
            + '<div class="dev-row"><button type="button" class="dev-btn" id="devExitNo">取消</button>'
            + '<button type="button" class="dev-btn dev-btn-main" id="devExitYes">确定退出</button></div></div>';
        document.body.appendChild(exit);

        var panel = document.createElement('div');
        panel.id = 'devPanel'; panel.className = 'dev-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', '开发者面板');
        panel.innerHTML = '<div class="dev-head"><span>开发者面板</span>'
            + '<button type="button" class="dev-exit" id="devPanelClose" title="关闭面板" aria-label="关闭面板"><i class="fa fa-times"></i></button></div>'
            + '<p class="dev-idline">测试账号 · LMSF9999 <span class="dev-tag" id="devCurLv">普卡</span></p>'
            + sec('member', '会员等级与里程', true)
            + sec('order', '测试订单', true)
            + sec('cart', '购物车与优惠券', false)
            + sec('account', '测试会员账号', false)
            + sec('storage', '本地存储', false)
            + sec('jump', '快速跳转', false)
            + sec('danger', '危险操作', false);
        document.body.appendChild(panel);

        buildMemberBody();
        buildOrderBody();
        buildCartBody();
        buildAccountBody();
        buildStorageBody();
        buildJumpBody();
        buildDangerBody();
        bindPanel();
        bindPwd();
        bindExit();
    }

    /* ---------------- 各分组内容 ---------------- */
    function buildMemberBody() {
        document.getElementById('devBody_member').innerHTML =
            '<div class="dev-lvs" id="devLvBox"></div>'
            + '<div class="dev-mile" style="margin-top:10px;"><input id="devMileInput" type="number" min="0" step="1" placeholder="输入里程值">'
            + '<button type="button" class="dev-mini" id="devMileApply">应用</button></div>'
            + '<p style="font-size:11px;margin-top:8px;opacity:.65;">里程改变会同步匹配等级；黑钻需单独开通资格。</p>';
        var box = document.getElementById('devLvBox');
        box.innerHTML = LV_NAME.map(function (n, i) {
            return '<button type="button" class="dev-lv" data-i="' + i + '">' + n + '</button>';
        }).join('');
        Array.prototype.forEach.call(box.querySelectorAll('.dev-lv'), function (b) {
            b.addEventListener('click', function () { applyLevel(Number(b.getAttribute('data-i'))); });
        });
        document.getElementById('devMileApply').addEventListener('click', applyMiles);
    }

    function buildOrderBody() {
        document.getElementById('devBody_order').innerHTML =
            '<div class="dev-form">'
            + '<select id="devOrdRoute" aria-label="测试航线"><option value="-1">随机航线</option>'
            + FAKE_ROUTES.map(function (r, i) { return '<option value="' + i + '">' + r.start + ' → ' + r.end + '（' + r.no + '）</option>'; }).join('')
            + '</select>'
            + '<select id="devOrdStatus" aria-label="订单状态">'
            + '<option value="done">已完成（可值机/退改）</option>'
            + '<option value="paying">支付处理中（5 秒后完成）</option>'
            + '<option value="refund">已退票</option>'
            + '</select></div>'
            + '<div class="dev-acts">'
            + '<button type="button" class="dev-mini" id="devOrdOne">伪造 1 条订单</button>'
            + '<button type="button" class="dev-mini" id="devOrdThree">批量生成 3 条</button>'
            + '</div>'
            + '<div class="dev-stats"><div><b id="devStOrder">0</b><i>当前订单</i></div>'
            + '<div><b id="devStCart">0</b><i>购物车</i></div>'
            + '<div><b id="devStMember">0</b><i>注册会员</i></div></div>'
            + '<div class="dev-links"><a href="order.html">打开我的订单</a></div>';
        document.getElementById('devOrdOne').addEventListener('click', function () { genOrders(1); });
        document.getElementById('devOrdThree').addEventListener('click', function () { genOrders(3); });
    }

    function buildCartBody() {
        document.getElementById('devBody_cart').innerHTML =
            '<div class="dev-acts">'
            + '<button type="button" class="dev-mini" id="devCartAdd">注入 1 张测试机票</button>'
            + '<button type="button" class="dev-mini" id="devCartClear">清空购物车</button>'
            + '<button type="button" class="dev-mini" id="devCouponAdd">发放 ¥50 测试券</button>'
            + '<button type="button" class="dev-mini" id="devCouponClear">清空优惠券</button>'
            + '</div>'
            + '<div class="dev-links" style="margin-top:8px;"><a href="cart.html">打开购物车</a><a href="member.html#exchange">会员中心</a></div>';
        document.getElementById('devCartAdd').addEventListener('click', injectCart);
        document.getElementById('devCartClear').addEventListener('click', function () {
            confirmThen('清空购物车？', function () { localStorage.removeItem('airCart'); refreshPanel(); toast('购物车已清空', 'success'); });
        });
        document.getElementById('devCouponAdd').addEventListener('click', addCoupon);
        document.getElementById('devCouponClear').addEventListener('click', function () {
            confirmThen('清空全部优惠券？', function () { localStorage.removeItem('ffpCoupons'); refreshPanel(); toast('优惠券已清空', 'success'); });
        });
    }

    function buildAccountBody() {
        document.getElementById('devBody_account').innerHTML =
            '<div class="dev-acts">'
            + '<button type="button" class="dev-mini" id="devAccAdd">新增 1 个测试会员</button>'
            + '<button type="button" class="dev-mini" id="devAccClear">清空会员注册表</button>'
            + '</div>'
            + '<div class="dev-kv" id="devAccList" style="margin-top:8px;">加载中…</div>';
        document.getElementById('devAccAdd').addEventListener('click', addTestMember);
        document.getElementById('devAccClear').addEventListener('click', function () {
            confirmThen('清空会员注册表（ffpMembers）？当前登录的测试账号不受影响。', function () {
                localStorage.removeItem('ffpMembers'); refreshPanel(); toast('会员注册表已清空', 'success');
            });
        });
    }

    function buildStorageBody() {
        document.getElementById('devBody_storage').innerHTML =
            '<div class="dev-kv" id="devStorageList">加载中…</div>'
            + '<div class="dev-acts"><button type="button" class="dev-mini" id="devStorageRefresh">刷新</button>'
            + '<button type="button" class="dev-mini" id="devStorageReload">重载页面</button></div>';
        document.getElementById('devStorageRefresh').addEventListener('click', renderStorage);
        document.getElementById('devStorageReload').addEventListener('click', function () { location.reload(); });
    }

    function buildJumpBody() {
        document.getElementById('devBody_jump').innerHTML =
            '<div class="dev-links">'
            + '<a href="index.html">首页</a><a href="booking.html">预订</a><a href="cart.html">购物车</a>'
            + '<a href="order.html">订单</a><a href="checkin.html">值机</a><a href="member.html">会员</a>'
            + '<a href="shop.html">商城</a><a href="flight.html">航班动态</a><a href="login.html">登录</a></div>';
    }

    function buildDangerBody() {
        document.getElementById('devBody_danger').innerHTML =
            '<button type="button" class="dev-danger" id="devWipeOrders">清空全部订单</button>'
            + '<button type="button" class="dev-danger" id="devWipe">清空全部本地数据</button>';
        document.getElementById('devWipeOrders').addEventListener('click', function () {
            confirmThen('清空全部订单？', function () { localStorage.removeItem('airOrders'); refreshPanel(); toast('订单已清空', 'success'); });
        });
        document.getElementById('devWipe').addEventListener('click', wipeData);
    }

    /* ---------------- 事件绑定 ---------------- */
    function bindPwd() {
        var pwdMask = document.getElementById('devPwdMask');
        var inp = document.getElementById('devPwdInput');
        var err = document.getElementById('devPwdErr');
        document.getElementById('devPwdCancel').addEventListener('click', function () {
            pwdMask.classList.remove('dev-open'); err.textContent = ''; inp.value = '';
        });
        pwdMask.addEventListener('click', function (e) {
            if (e.target === pwdMask) { pwdMask.classList.remove('dev-open'); err.textContent = ''; }
        });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
        document.getElementById('devPwdOk').addEventListener('click', tryEnter);
        function tryEnter() {
            var v = (inp.value || '').trim();
            err.textContent = '';
            if (!v) { err.textContent = '请输入密码'; return; }
            sha256Hex(v.toLowerCase()).then(function (h) {
                if (h && h === DIGEST) {
                    pwdMask.classList.remove('dev-open'); inp.value = '';
                    activate();
                } else {
                    err.textContent = '密码不正确，请重试';
                    inp.select();
                    toast('开发者密码错误', 'error');
                }
            });
        }
    }
    function bindExit() {
        var ex = document.getElementById('devExitMask');
        document.getElementById('devExitNo').addEventListener('click', function () { ex.classList.remove('dev-open'); });
        ex.addEventListener('click', function (e) { if (e.target === ex) ex.classList.remove('dev-open'); });
        document.getElementById('devExitYes').addEventListener('click', function () {
            ex.classList.remove('dev-open');
            deactivate();
        });
    }
    function bindPanel() {
        var panel = document.getElementById('devPanel');
        document.getElementById('devPanelClose').addEventListener('click', closePanel);
        Array.prototype.forEach.call(panel.querySelectorAll('.dev-sec h4'), function (h) {
            h.addEventListener('click', function () {
                var s = h.parentNode;
                s.classList.toggle('open');
                if (s.classList.contains('open')) {
                    if (s.getAttribute('data-sec') === 'storage') renderStorage();
                    if (s.getAttribute('data-sec') === 'account') renderAccList();
                }
            });
        });
    }

    /* ---------------- 面板开关 ---------------- */
    function openPwd() {
        injectStyle(); ensureMasks();
        document.getElementById('devPwdMask').classList.add('dev-open');
        setTimeout(function () { var i = document.getElementById('devPwdInput'); if (i) i.focus(); }, 60);
    }
    function openExitConfirm() {
        injectStyle(); ensureMasks();
        document.getElementById('devExitMask').classList.add('dev-open');
    }
    function openPanel() {
        injectStyle(); ensureMasks();
        refreshPanel();
        document.getElementById('devPanel').classList.add('dev-open');
        var fab = document.getElementById('devFab');
        if (fab) fab.style.opacity = '0.55';
    }
    function closePanel() {
        var p = document.getElementById('devPanel');
        if (p) p.classList.remove('dev-open');
        var fab = document.getElementById('devFab');
        if (fab) fab.style.opacity = '1';
    }

    function refreshPanel() {
        var panel = document.getElementById('devPanel');
        if (!panel) return;
        var m = currentTestMember();
        var cur = m.level || '普卡';
        Array.prototype.forEach.call(panel.querySelectorAll('#devLvBox .dev-lv'), function (b) {
            b.classList.toggle('dev-cur', LV_NAME[Number(b.getAttribute('data-i'))] === cur);
        });
        var tag = document.getElementById('devCurLv');
        if (tag) tag.textContent = cur;
        var mi = document.getElementById('devMileInput');
        if (mi && document.activeElement !== mi) mi.value = m.totalMiles || 0;
        var cart = 0, orders = 0, members = 0;
        try { cart = (JSON.parse(localStorage.getItem('airCart') || '[]') || []).length; } catch (e) {}
        try { orders = (JSON.parse(localStorage.getItem('airOrders') || '[]') || []).length; } catch (e) {}
        try { members = (JSON.parse(localStorage.getItem('ffpMembers') || '[]') || []).length; } catch (e) {}
        var a = document.getElementById('devStCart'); if (a) a.textContent = cart;
        var b = document.getElementById('devStOrder'); if (b) b.textContent = orders;
        var c = document.getElementById('devStMember'); if (c) c.textContent = members;
        renderAccList();
    }

    function applyLevel(i) {
        var m = currentTestMember();
        m.level = LV_NAME[i];
        m.totalMiles = LV_MIN[i];
        m.miles = LV_MIN[i];
        m.elite = (LV_NAME[i] === '黑钻卡');
        writeMember(m);
        refreshPanel();
        toast('测试账号等级已设为「' + LV_NAME[i] + '」', 'success');
    }
    function applyMiles() {
        var inp = document.getElementById('devMileInput');
        if (!inp) return;
        var v = parseInt(inp.value, 10);
        if (isNaN(v) || v < 0) { toast('请输入有效的非负里程数', 'error'); return; }
        var m = currentTestMember();
        m.totalMiles = v; m.miles = v;
        var lv = 0;
        for (var i = 0; i < LV_MIN.length; i++) { if (v >= LV_MIN[i]) lv = i; }
        if (lv === 5 && !m.elite) lv = 4;
        m.level = LV_NAME[lv];
        writeMember(m);
        refreshPanel();
        toast('里程已设为 ' + v.toLocaleString() + '，等级同步为「' + LV_NAME[lv] + '」', 'success');
    }

    /* --------- 伪造订单 --------- */
    function makeOrder(statusKey, routeIdx) {
        var r = (typeof routeIdx === 'number' && routeIdx >= 0) ? FAKE_ROUTES[routeIdx] : pick(FAKE_ROUTES);
        var m = currentTestMember();
        var rf = realFlight(r.start, r.end);
        var CAB_KEY = { '经济舱': 'eco', '超级经济舱': 'superEco', '商务舱': 'business', '头等舱': 'first' };
        var basePrice = r.price;
        if (rf && rf.price) {
            basePrice = (typeof rf.price === 'number') ? rf.price : (rf.price[CAB_KEY[r.cabin] || 'eco'] || r.price);
        }
        var price = Math.round(Number(basePrice) * (rnd(900, 1100) / 1000));
        var offset = statusKey === 'refund' ? -rnd(3, 25) : rnd(1, 20);
        var now = Date.now();
        var o = {
            orderId: 'ORD' + now + rnd(100, 999),
            type: 'flight',
            status: '已完成',
            createTime: statusKey === 'paying' ? now : now - rnd(1, 6) * 864e5,
            date: (statusKey === 'refund' || !rf) ? dateStr(offset) : rf.date,
            time: rf ? rf.time : r.time,
            start: r.start,
            end: r.end,
            flightNo: rf ? rf.no : r.no,
            flightStart: r.start,
            flightEnd: r.end,
            cabin: r.cabin,
            price: price,
            payPrice: price,
            username: '测试乘机人',
            phone: '13800000000',
            idcard: '110101199001011234',
            checkedIn: false,
            weatherRisk: false,
            weatherReason: '',
            memberCardNo: m.cardNo,
            milesEarned: price,
            devFake: true
        };
        if (statusKey === 'paying') o.status = '支付处理中';
        if (statusKey === 'refund') {
            o.status = '已退票';
            o.fee = Math.round(price * 0.2);
            o.refundAmount = price - o.fee;
        }
        return o;
    }
    function genOrders(n) {
        var rSel = document.getElementById('devOrdRoute');
        var sSel = document.getElementById('devOrdStatus');
        var routeIdx = rSel ? Number(rSel.value) : -1;
        var statusKey = sSel ? sSel.value : 'done';
        var list = loadOrders();
        var made = [];
        for (var i = 0; i < n; i++) {
            var sk = statusKey;
            if (n > 1 && statusKey === 'done') sk = (i === 0 ? 'done' : (i === 1 ? 'paying' : 'refund'));
            var o = makeOrder(sk, routeIdx);
            made.push(o);
            list.unshift(o);
        }
        saveOrders(list);
        refreshPanel();
        var desc = n > 1 ? '（已完成 / 支付处理中 / 已退票各一条）' : '';
        toast('已生成 ' + made.length + ' 条测试订单 ' + made[0].orderId + desc, 'success');
    }

    /* --------- 购物车 / 优惠券 / 会员 --------- */
    function injectCart() {
        var r = pick(FAKE_ROUTES);
        var cart = getCart();
        cart.push({
            cartId: 'CART' + Date.now() + rnd(100, 999),
            flightNo: r.no, start: r.start, end: r.end,
            date: dateStr(rnd(1, 20)), time: r.time, cabin: r.cabin,
            price: r.price, username: '测试乘机人', idcard: '110101199001011234',
            weatherRisk: false, weatherReason: ''
        });
        saveCart(cart);
        refreshPanel();
        toast('已注入测试机票（' + r.start + ' → ' + r.end + '）', 'success');
    }
    function addCoupon() {
        var list = (typeof getCoupons === 'function') ? getCoupons() : [];
        list.push({ code: 'DEV50-' + Date.now(), value: 50, status: '可用', createdAt: Date.now() });
        if (typeof saveCoupons === 'function') saveCoupons(list);
        else localStorage.setItem('ffpCoupons', JSON.stringify(list));
        refreshPanel();
        toast('已发放 ¥50 测试优惠券', 'success');
    }
    function addTestMember() {
        var list = (typeof getMembers === 'function') ? getMembers() : [];
        var seq = list.length + 1;
        var card = 'LMSF' + ('000' + (900 + seq)).slice(-4);
        var lvIdx = rnd(0, 4);
        list.push({
            cardNo: card, name: '测试会员' + seq, phone: '139' + String(rnd(10000000, 99999999)),
            level: LV_NAME[lvIdx], totalMiles: LV_MIN[lvIdx], miles: LV_MIN[lvIdx],
            elite: false, devTest: true
        });
        if (typeof saveMembers === 'function') saveMembers(list);
        else localStorage.setItem('ffpMembers', JSON.stringify(list));
        refreshPanel();
        toast('已新增测试会员 ' + card, 'success');
    }
    function renderAccList() {
        var box = document.getElementById('devAccList');
        if (!box) return;
        var list = (typeof getMembers === 'function') ? getMembers() : [];
        if (!list.length) { box.innerHTML = '<span style="opacity:.6">暂无注册会员</span>'; return; }
        box.innerHTML = list.slice(-6).reverse().map(function (m) {
            return '<div class="dev-kv-row"><span class="k">' + (m.cardNo || '') + ' · ' + (m.name || '') + '</span>'
                + '<span class="v">' + (m.level || '普卡') + '</span></div>';
        }).join('') + (list.length > 6 ? '<div style="opacity:.6">…共 ' + list.length + ' 位</div>' : '');
    }

    /* --------- 存储查看 --------- */
    function renderStorage() {
        var box = document.getElementById('devStorageList');
        if (!box) return;
        var keys = Object.keys(localStorage);
        if (!keys.length) { box.innerHTML = '<span style="opacity:.6">本地存储为空</span>'; return; }
        var total = 0;
        keys.forEach(function (k) { total += (localStorage.getItem(k) || '').length; });
        var rows = keys.sort().map(function (k) {
            var v = localStorage.getItem(k) || '';
            var s = v.length;
            return '<div class="dev-kv-row"><span class="k">' + v_esc(k) + '</span>'
                + '<span class="v">' + (s > 1024 ? (s / 1024).toFixed(1) + 'KB' : s + 'B') + '</span>'
                + '<button type="button" class="dev-kv-del" data-k="' + v_esc(k) + '" title="删除该键">×</button></div>';
        }).join('');
        box.innerHTML = rows + '<div style="opacity:.6;margin-top:6px;">共 ' + keys.length + ' 项 · 约 ' + (total > 1024 ? (total / 1024).toFixed(1) + 'KB' : total + 'B') + '</div>';
        Array.prototype.forEach.call(box.querySelectorAll('.dev-kv-del'), function (b) {
            b.addEventListener('click', function () {
                var k = b.getAttribute('data-k');
                localStorage.removeItem(k);
                renderStorage(); refreshPanel();
                toast('已删除本地键 ' + k, 'info');
            });
        });
    }
    function v_esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* --------- 确认与重置 --------- */
    function confirmThen(msg, onOk) {
        if (typeof window.showConfirm === 'function') window.showConfirm(msg, onOk);
        else if (window.confirm(msg)) onOk();
    }
    function wipeData() {
        confirmThen('将清空本站全部本地数据（会员、订单、购物车、优惠券等），此操作不可恢复。确认继续？', function () {
            var keep = isDev();
            try { localStorage.clear(); } catch (e) {}
            if (keep) localStorage.setItem(K_ON, '1');
            location.reload();
        });
    }

    /* ---------------- 模式切换 ---------------- */
    function activate() {
        try { localStorage.setItem(K_BK, localStorage.getItem(K_MB) || 'null'); } catch (e) {}
        try { localStorage.setItem(K_ON, '1'); } catch (e) {}
        writeMember(Object.assign({}, TEST_MEMBER));
        mountDevUi();
        syncFooterLabel();
        toast('开发者模式已开启，会员已切换为测试账号', 'info');
    }
    function deactivate() {
        var bk = null;
        try { bk = JSON.parse(localStorage.getItem(K_BK) || 'null'); } catch (e) { bk = null; }
        if (bk) localStorage.setItem(K_MB, JSON.stringify(bk)); else localStorage.removeItem(K_MB);
        localStorage.removeItem(K_BK);
        localStorage.removeItem(K_ON);
        if (typeof window.renderMemberArea === 'function') window.renderMemberArea();
        if (typeof window.renderPage === 'function') { try { window.renderPage(); } catch (e) {} }
        unmountDevUi();
        syncFooterLabel();
        toast('已退出开发者模式，恢复正常模式', 'success');
    }

    /* ---------------- 模式 UI ---------------- */
    function mountDevUi() {
        injectStyle(); ensureMasks();
        var area = document.getElementById('memberArea');
        if (area && !document.getElementById('devExitBtn')) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'devExitBtn';
            btn.className = 'dev-exit';
            btn.title = '退出开发者模式';
            btn.setAttribute('aria-label', '退出开发者模式');
            btn.innerHTML = '<i class="fa fa-chevron-down"></i>';
            btn.addEventListener('click', openExitConfirm);
            area.parentNode.appendChild(btn);
        }
        var mm = document.getElementById('mobileMenu');
        if (mm && !document.getElementById('devExitMobile')) {
            var a = document.createElement('a');
            a.href = 'javascript:void(0)';
            a.id = 'devExitMobile';
            a.className = 'hover:text-gold transition-colors';
            a.textContent = '退出开发者模式';
            a.addEventListener('click', function (e) { e.preventDefault(); openExitConfirm(); });
            mm.insertBefore(a, mm.firstChild);
        }
        if (!document.getElementById('devFab')) {
            var fab = document.createElement('button');
            fab.type = 'button';
            fab.id = 'devFab';
            fab.className = 'dev-fab dev-on';
            fab.title = '打开开发者面板';
            fab.textContent = 'DEV';
            fab.addEventListener('click', function () {
                var p = document.getElementById('devPanel');
                if (p && p.classList.contains('dev-open')) closePanel(); else openPanel();
            });
            document.body.appendChild(fab);
        }
    }
    function unmountDevUi() {
        ['devExitBtn', 'devExitMobile', 'devFab'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.remove();
        });
        closePanel();
    }

    /* ---------------- 初始化 ---------------- */
    function boot(retry) {
        if (!document.getElementById('siteFooter')) {
            if (!retry) setTimeout(function () { boot(true); }, 200);
            return;
        }
        ensureFooterEntry();
        if (isDev()) {
            mountDevUi();
            var m = readMember();
            if (!m || !m.devTest) writeMember(Object.assign({}, TEST_MEMBER));
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();

    window.lmsDev = { isOn: isDev, off: deactivate, panel: openPanel };
})();
