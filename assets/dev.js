/* ============================================================
   老牧师航空 · 开发者模式（dev.js）
   说明：密码以 SHA-256 分片哈希存储，页面源码中不含明文。
   开发模式下会员自动切换为"测试账号"，可自由调节等级与里程。
   ============================================================ */
(function () {
    'use strict';

    // 密码哈希分片（SHA-256 单向摘要，源码中无明文）
    var SEG = ['4e0b4e4c', 'a28dbb0a', 'b910e721', 'e449c19d', 'bf7cdb4a', '34d8c74d', 'ca562999', '9ad41e3f'];
    var DIGEST = SEG.join('');

    var K_ON = 'lmsDevMode';
    var K_BK = 'lmsDevMemberBackup';
    var K_MB = 'ffpMember';

    var TEST_MEMBER = {
        cardNo: 'LMSF9999',
        name: '测试账号',
        phone: '18888888888',
        level: '普卡',
        totalMiles: 0,
        miles: 0,
        elite: false,
        devTest: true
    };
    var LV_NAME = ['普卡', '银卡', '金卡', '铂金卡', '钻石卡', '黑钻卡'];
    var LV_MIN = [0, 10000, 30000, 60000, 100000, 1000000];

    function isDev() { return localStorage.getItem(K_ON) === '1'; }

    function sha256Hex(text) {
        if (!(window.crypto && window.crypto.subtle && window.TextEncoder)) return Promise.resolve('');
        var buf = new TextEncoder().encode(text);
        return window.crypto.subtle.digest('SHA-256', buf).then(function (d) {
            var arr = new Uint8Array(d), out = '';
            for (var i = 0; i < arr.length; i++) out += (arr[i] < 16 ? '0' : '') + arr[i].toString(16);
            return out;
        });
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
        if (!m || !m.devTest) {
            m = Object.assign({}, TEST_MEMBER);
            writeMember(m);
        }
        return m;
    }

    /* ---------------- 样式 ---------------- */
    function injectStyle() {
        if (document.getElementById('devStyle')) return;
        var css = ''
            + '.dev-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;'
            + 'background:rgba(30,38,48,0.42);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:20px;}'
            + '.dev-mask.dev-open{display:flex;}'
            + '.dev-card{width:100%;max-width:400px;border-radius:26px;padding:28px 26px 24px;'
            + 'background:linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78));'
            + 'border:1px solid rgba(255,255,255,0.9);box-shadow:0 24px 60px rgba(30,38,48,0.24);color:#3a4a5c;}'
            + '.dev-card h3{font-size:20px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px;color:#1d1d1f;}'
            + '.dev-card p{font-size:13px;line-height:1.6;color:rgba(58,74,92,0.7);}'
            + '.dev-card input{width:100%;box-sizing:border-box;margin-top:16px;padding:12px 16px;border-radius:14px;font-size:15px;outline:none;'
            + 'border:1px solid rgba(150,175,200,0.45);background:rgba(255,255,255,0.85);color:#1d1d1f;}'
            + '.dev-card input:focus{border-color:rgba(74,90,110,0.6);box-shadow:0 0 0 4px rgba(74,90,110,0.12);}'
            + '.dev-err{font-size:12px;color:#c0392b;height:16px;margin-top:8px;}'
            + '.dev-row{display:flex;gap:10px;margin-top:18px;}'
            + '.dev-btn{flex:1;padding:12px 0;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;'
            + 'border:1px solid rgba(74,90,110,0.28);background:rgba(255,255,255,0.6);box-sizing:border-box;color:#4a5a6e;'
            + 'transition:all .3s ease;}'
            + '.dev-btn:hover{background:rgba(255,255,255,0.9);}'
            + '.dev-btn-main{background:linear-gradient(135deg,#4a5a6e,#5d7085);border-color:transparent;color:#fff;'
            + 'box-shadow:0 10px 26px rgba(74,90,110,0.24);}'
            + '.dev-btn-main:hover{transform:translateY(-1px);box-shadow:0 14px 32px rgba(74,90,110,0.3);}'
            + '.dev-btn-danger{background:#c0392b;border-color:transparent;color:#fff;}'
            + '.dev-btn-danger:hover{background:#a93226;}'
            + '.dev-exit{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;'
            + 'font-size:11px;color:#4a5a6e;border:1px solid rgba(74,90,110,0.35);background:rgba(255,255,255,0.6);'
            + 'cursor:pointer;transition:all .3s ease;margin-left:2px;}'
            + '.dev-exit:hover{background:#4a5a6e;color:#fff;transform:translateY(-1px);}'
            + '.dev-fab{position:fixed;right:18px;bottom:20px;z-index:900;width:54px;height:54px;border-radius:50%;'
            + 'display:none;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:0.06em;'
            + 'color:#fff;background:linear-gradient(135deg,#4a5a6e,#6b8299);box-shadow:0 12px 30px rgba(30,38,48,0.35);'
            + 'cursor:pointer;border:none;}'
            + '.dev-fab.dev-on{display:flex;}'
            + '.dev-panel{position:fixed;right:18px;bottom:84px;z-index:950;width:312px;max-height:76vh;overflow:auto;'
            + 'display:none;border-radius:22px;padding:18px;'
            + 'background:linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,255,255,0.86));'
            + 'border:1px solid rgba(255,255,255,0.9);box-shadow:0 22px 60px rgba(30,38,48,0.26);color:#3a4a5c;}'
            + '.dev-panel.dev-open{display:block;}'
            + '.dev-panel h4{font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;'
            + 'color:rgba(58,74,92,0.5);margin:16px 0 8px;}'
            + '.dev-panel h4:first-of-type{margin-top:10px;}'
            + '.dev-panel .dev-head{display:flex;align-items:center;justify-content:space-between;}'
            + '.dev-panel .dev-head span{font-size:15px;font-weight:700;color:#1d1d1f;}'
            + '.dev-panel .dev-tag{font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(123,168,154,0.16);color:#3f7c6a;}'
            + '.dev-lvs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}'
            + '.dev-lv{padding:8px 0;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;'
            + 'border:1px solid rgba(150,175,200,0.4);background:rgba(255,255,255,0.6);color:#4a5a6e;transition:all .25s;}'
            + '.dev-lv.dev-cur{background:linear-gradient(135deg,#4a5a6e,#5d7085);color:#fff;border-color:transparent;}'
            + '.dev-mile{display:flex;gap:8px;margin-top:8px;}'
            + '.dev-mile input{flex:1;min-width:0;box-sizing:border-box;padding:9px 12px;border-radius:12px;font-size:13px;outline:none;'
            + 'border:1px solid rgba(150,175,200,0.45);background:rgba(255,255,255,0.85);color:#1d1d1f;}'
            + '.dev-mile button{padding:9px 16px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;'
            + 'background:#4a5a6e;color:#fff;border:none;}'
            + '.dev-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;}'
            + '.dev-stats div{padding:10px 4px;border-radius:12px;background:rgba(216,223,230,0.5);}'
            + '.dev-stats b{display:block;font-size:17px;color:#1d1d1f;}'
            + '.dev-stats i{font-style:normal;font-size:11px;color:rgba(58,74,92,0.6);}'
            + '.dev-links{display:flex;flex-wrap:wrap;gap:6px;}'
            + '.dev-links a{font-size:12px;padding:6px 10px;border-radius:999px;color:#4a5a6e;'
            + 'background:rgba(255,255,255,0.7);border:1px solid rgba(150,175,200,0.4);}'
            + '.dev-danger{width:100%;margin-top:6px;padding:10px 0;border-radius:12px;font-size:13px;font-weight:600;'
            + 'cursor:pointer;border:1px solid rgba(192,57,43,0.4);background:rgba(192,57,43,0.08);color:#c0392b;}'
            + '.dev-foot-link{display:block;margin:10px auto 0;font-size:11px;letter-spacing:0.1em;'
            + 'color:rgba(58,74,92,0.45);background:none;border:none;cursor:pointer;transition:color .3s;}'
            + '.dev-foot-link:hover{color:#4a5a6e;}'
            /* 深色模式 */
            + '@media (prefers-color-scheme: dark){'
            + '.dev-card{background:linear-gradient(135deg,rgba(38,48,60,0.95),rgba(30,38,48,0.92));'
            + 'border-color:rgba(255,255,255,0.12);color:#dbe6f0;}'
            + '.dev-card h3{color:#e8edf2;}'
            + '.dev-card p{color:rgba(232,237,242,0.65);}'
            + '.dev-card input{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16);color:#e8edf2;}'
            + '.dev-btn{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);color:#e8edf2;}'
            + '.dev-btn-main{background:linear-gradient(135deg,#5c7189,#708ba6);color:#fff;}'
            + '.dev-exit{color:#e8edf2;border-color:rgba(255,255,255,0.24);background:rgba(255,255,255,0.1);}'
            + '.dev-exit:hover{background:rgba(255,255,255,0.22);color:#fff;}'
            + '.dev-panel{background:linear-gradient(135deg,rgba(38,48,60,0.97),rgba(30,38,48,0.94));'
            + 'border-color:rgba(255,255,255,0.12);color:#dbe6f0;}'
            + '.dev-panel .dev-head span{color:#e8edf2;}'
            + '.dev-panel h4{color:rgba(232,237,242,0.5);}'
            + '.dev-panel .dev-tag{background:rgba(123,168,154,0.2);color:#9dd0be;}'
            + '.dev-lv{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.18);color:#dbe6f0;}'
            + '.dev-lv.dev-cur{background:linear-gradient(135deg,#5c7189,#708ba6);color:#fff;}'
            + '.dev-mile input{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16);color:#e8edf2;}'
            + '.dev-stats div{background:rgba(255,255,255,0.08);}'
            + '.dev-stats b{color:#e8edf2;}'
            + '.dev-stats i{color:rgba(232,237,242,0.6);}'
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

    /* ---------------- DOM 组装 ---------------- */
    function ensureFooterEntry() {
        var footer = document.querySelector('#siteFooter footer');
        if (!footer || document.getElementById('devFootLink')) return;
        var last = footer.querySelector('.container > div:last-child');
        var wrap = document.createElement('div');
        wrap.style.cssText = 'text-align:center;';
        wrap.innerHTML = '<button type="button" id="devFootLink" class="dev-foot-link">开发者模式</button>';
        (last ? last.parentNode : footer).appendChild(wrap);
        wrap.querySelector('#devFootLink').addEventListener('click', function () {
            if (isDev()) openPanel();
            else openPwd();
        });
        syncFooterLabel();
    }
    function syncFooterLabel() {
        var b = document.getElementById('devFootLink');
        if (!b) return;
        b.textContent = isDev() ? '开发者模式 · 已开启（点击打开面板）' : '开发者模式';
    }

    function ensureMasks() {
        if (document.getElementById('devPwdMask')) return;
        var pwd = document.createElement('div');
        pwd.id = 'devPwdMask'; pwd.className = 'dev-mask';
        pwd.innerHTML = ''
            + '<div class="dev-card" role="dialog" aria-modal="true" aria-labelledby="devPwdTitle">'
            + '<h3 id="devPwdTitle">开发者模式</h3>'
            + '<p>该模式仅供站长与开发调试使用，请输入开发者密码。</p>'
            + '<input id="devPwdInput" type="password" inputmode="text" autocomplete="off" placeholder="开发者密码">'
            + '<div class="dev-err" id="devPwdErr"></div>'
            + '<div class="dev-row">'
            + '<button type="button" class="dev-btn" id="devPwdCancel">取消</button>'
            + '<button type="button" class="dev-btn dev-btn-main" id="devPwdOk">进入</button>'
            + '</div></div>';
        document.body.appendChild(pwd);

        var exit = document.createElement('div');
        exit.id = 'devExitMask'; exit.className = 'dev-mask';
        exit.innerHTML = ''
            + '<div class="dev-card" role="dialog" aria-modal="true" aria-labelledby="devExitTitle">'
            + '<h3 id="devExitTitle">退出开发者模式？</h3>'
            + '<p>退出后将恢复为正常模式，当前测试账号与手动调节的等级、里程会被还原。</p>'
            + '<div class="dev-row">'
            + '<button type="button" class="dev-btn" id="devExitNo">取消</button>'
            + '<button type="button" class="dev-btn dev-btn-main" id="devExitYes">确定退出</button>'
            + '</div></div>';
        document.body.appendChild(exit);

        var panel = document.createElement('div');
        panel.id = 'devPanel'; panel.className = 'dev-panel';
        panel.innerHTML = ''
            + '<div class="dev-head"><span>开发者面板</span>'
            + '<button type="button" class="dev-exit" id="devPanelClose" title="关闭面板" aria-label="关闭面板"><i class="fa fa-times"></i></button>'
            + '</div>'
            + '<h4>当前身份</h4>'
            + '<p style="font-size:13px">测试账号 · LMSF9999 <span class="dev-tag" id="devCurLv">普卡</span></p>'
            + '<h4>会员等级（自由调节）</h4>'
            + '<div class="dev-lvs" id="devLvBox"></div>'
            + '<h4>里程</h4>'
            + '<div class="dev-mile"><input id="devMileInput" type="number" min="0" step="1" placeholder="输入里程值">'
            + '<button type="button" id="devMileApply">应用</button></div>'
            + '<h4>本地数据概览</h4>'
            + '<div class="dev-stats">'
            + '<div><b id="devStCart">0</b><i>购物车</i></div>'
            + '<div><b id="devStOrder">0</b><i>订单</i></div>'
            + '<div><b id="devStMember">0</b><i>会员</i></div>'
            + '</div>'
            + '<h4>快速跳转</h4>'
            + '<div class="dev-links">'
            + '<a href="booking.html">预订</a><a href="cart.html">购物车</a><a href="order.html">订单</a>'
            + '<a href="checkin.html">值机</a><a href="member.html">会员</a><a href="shop.html">商城</a>'
            + '</div>'
            + '<h4>危险操作</h4>'
            + '<button type="button" class="dev-danger" id="devWipe">清空本地测试数据</button>';
        document.body.appendChild(panel);

        // 密码弹窗事件
        var pwdMask = document.getElementById('devPwdMask');
        var inp = document.getElementById('devPwdInput');
        var err = document.getElementById('devPwdErr');
        document.getElementById('devPwdCancel').addEventListener('click', function () {
            pwdMask.classList.remove('dev-open'); err.textContent = ''; inp.value = '';
        });
        pwdMask.addEventListener('click', function (e) { if (e.target === pwdMask) { pwdMask.classList.remove('dev-open'); } });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
        document.getElementById('devPwdOk').addEventListener('click', tryEnter);

        function tryEnter() {
            var v = (inp.value || '').trim();
            err.textContent = '';
            if (!v) { err.textContent = '请输入密码'; return; }
            sha256Hex(v.toLowerCase()).then(function (h) {
                if (h && h === DIGEST) {
                    pwdMask.classList.remove('dev-open');
                    inp.value = '';
                    activate();
                } else {
                    err.textContent = '密码不正确，请重试';
                    inp.select();
                    if (typeof window.showToast === 'function') window.showToast('开发者密码错误', 'error');
                }
            });
        }

        // 退出确认
        var ex = document.getElementById('devExitMask');
        document.getElementById('devExitNo').addEventListener('click', function () { ex.classList.remove('dev-open'); });
        ex.addEventListener('click', function (e) { if (e.target === ex) ex.classList.remove('dev-open'); });
        document.getElementById('devExitYes').addEventListener('click', function () {
            ex.classList.remove('dev-open');
            deactivate();
        });

        // 面板
        document.getElementById('devPanelClose').addEventListener('click', closePanel);
        document.getElementById('devMileApply').addEventListener('click', applyMiles);
        document.getElementById('devWipe').addEventListener('click', wipeData);
        renderLvButtons();
    }

    function openPwd() {
        injectStyle(); ensureMasks();
        var mask = document.getElementById('devPwdMask');
        mask.classList.add('dev-open');
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

    /* ---------------- 面板内容 ---------------- */
    function renderLvButtons() {
        var box = document.getElementById('devLvBox');
        if (!box) return;
        box.innerHTML = LV_NAME.map(function (n, i) {
            return '<button type="button" class="dev-lv" data-i="' + i + '">' + n + '</button>';
        }).join('');
        Array.prototype.forEach.call(box.querySelectorAll('.dev-lv'), function (b) {
            b.addEventListener('click', function () { applyLevel(Number(b.getAttribute('data-i'))); });
        });
    }
    function refreshPanel() {
        if (!document.getElementById('devPanel')) return;
        var m = currentTestMember();
        var cur = m.level || '普卡';
        Array.prototype.forEach.call(document.querySelectorAll('#devLvBox .dev-lv'), function (b) {
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
    }

    function applyLevel(i) {
        var m = currentTestMember();
        m.level = LV_NAME[i];
        m.totalMiles = LV_MIN[i];
        m.miles = LV_MIN[i];
        m.elite = (LV_NAME[i] === '黑钻卡');
        writeMember(m);
        refreshPanel();
        if (typeof window.showToast === 'function') window.showToast('测试账号等级已设为「' + LV_NAME[i] + '」', 'success');
    }
    function applyMiles() {
        var inp = document.getElementById('devMileInput');
        if (!inp) return;
        var v = parseInt(inp.value, 10);
        if (isNaN(v) || v < 0) { if (typeof window.showToast === 'function') window.showToast('请输入有效的非负里程数', 'error'); return; }
        var m = currentTestMember();
        m.totalMiles = v;
        m.miles = v;
        // 依据里程自动同步等级（黑钻需另开通资格，这里按里程档位同步）
        var lv = 0;
        for (var i = 0; i < LV_MIN.length; i++) { if (v >= LV_MIN[i]) lv = i; }
        if (lv === 5 && !m.elite) lv = 4;
        m.level = LV_NAME[lv];
        writeMember(m);
        refreshPanel();
        if (typeof window.showToast === 'function') window.showToast('里程已设为 ' + v.toLocaleString() + '，等级同步为「' + LV_NAME[lv] + '」', 'success');
    }
    function wipeData() {
        var go = function () {
            var keep = isDev();
            try { localStorage.clear(); } catch (e) {}
            if (keep) localStorage.setItem(K_ON, '1');
            location.reload();
        };
        if (typeof window.showConfirm === 'function') {
            window.showConfirm('将清空本站全部本地数据（会员、订单、购物车、优惠券等），此操作不可恢复。确认继续？', go);
        } else if (window.confirm('清空本站全部本地数据？此操作不可恢复。')) {
            go();
        }
    }

    /* ---------------- 模式切换 ---------------- */
    function activate() {
        try { localStorage.setItem(K_BK, localStorage.getItem(K_MB) || 'null'); } catch (e) {}
        try { localStorage.setItem(K_ON, '1'); } catch (e) {}
        var m = Object.assign({}, TEST_MEMBER);
        writeMember(m);
        mountDevUi();
        syncFooterLabel();
        if (typeof window.showToast === 'function') window.showToast('开发者模式已开启，会员已切换为测试账号', 'info');
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
        if (typeof window.showToast === 'function') window.showToast('已退出开发者模式，恢复正常模式', 'success');
    }

    /* ---------------- 模式 UI（箭头 / FAB） ---------------- */
    function mountDevUi() {
        injectStyle(); ensureMasks();
        // 导航右上角小箭头
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
        // 移动菜单入口
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
        // 悬浮面板按钮
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
            if (!m || !m.devTest) { writeMember(Object.assign({}, TEST_MEMBER)); }
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();

    // 供其他页面/控制台调用
    window.lmsDev = { isOn: isDev, off: deactivate, panel: openPanel };
})();
