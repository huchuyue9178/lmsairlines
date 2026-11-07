/* ============================================================
   站长身份模块
   - 手机号与口令均分片存放，页面源码中不出现明文
   - 站长登录后自动建档（黑钻卡），并弹出专属欢迎层，赠两张 ¥200,000 礼券
   - 礼券可购票抵扣，也可一键折入账户余额
   依赖 common.js 的 hashPwd / getAccounts / saveAccounts / getMembers /
   saveMembers / genCardNo / getMember / saveMember / getCoupons /
   saveCoupons / walletTxAdd / showToast / showConfirm
   ============================================================ */
(function () {
    'use strict';

    /* 手机号分片（运行时拼接） */
    var PH = ['18775', '38013', '0'];
    /* 口令摘要分片（hashPwd 单向摘要，与全站账号体系同源） */
    var HW = ['hyjx', 'r7a', '.9'];

    var K_SESS = 'lmsOwner';            // 本次会话为站长登录
    var K_GIFT = 'lmsOwnerGift';        // 礼遇是否已领取
    var K_SHOWN = 'lmsOwnerWelcomeShown';// 本会话是否已弹过欢迎层

    var GIFT_VALUE = 200000;
    var GIFT_COUNT = 2;

    function ownerPhone() { return PH.join(''); }

    function pwdOk(p) {
        var t = (p || '').trim();
        if (!t || typeof hashPwd !== 'function') return false;
        return hashPwd(t) === HW.join('');
    }

    function isOwnerSession() {
        try { return sessionStorage.getItem(K_SESS) === '1'; } catch (e) { return false; }
    }
    function giftDone() {
        try { return localStorage.getItem(K_GIFT) === '1'; } catch (e) { return false; }
    }
    function markGift() {
        try { localStorage.setItem(K_GIFT, '1'); } catch (e) {}
    }
    function markShown() {
        try { sessionStorage.setItem(K_SHOWN, '1'); } catch (e) {}
    }
    function shownThisSession() {
        try { return sessionStorage.getItem(K_SHOWN) === '1'; } catch (e) { return false; }
    }

    /* 会员记录里只留掩码号码，浏览器存储中不出现完整号码 */
    function maskPhone(p) {
        return p.slice(0, 3) + '****' + p.slice(7);
    }

    /* 站长首次登录时自动建档：黑钻卡 + 专属标记
       不在账号注册表里留档，只靠摘要比对；历史遗留的明文记录一并清理 */
    function ensureOwner() {
        var phone = ownerPhone();
        var phoneMask = maskPhone(phone);
        var members = getMembers();
        var i;

        try {
            var accs = getAccounts();
            var kept = accs.filter(function (a) { return a.phone !== phone; });
            if (kept.length !== accs.length) saveAccounts(kept);
        } catch (e) {}

        // 清掉早期版本用完整号码建档的会员记录（owner 那条会改写成掩码）
        members = members.filter(function (m) { return m && m.phone !== phone; });

        var mem = null;
        for (i = 0; i < members.length; i++) {
            if (members[i].owner === true) { mem = members[i]; break; }
        }
        if (!mem) {
            mem = {
                name: '站长', phone: phoneMask, cardNo: genCardNo(),
                level: '黑钻卡', miles: 1200000, totalMiles: 1200000,
                elite: true, balance: 0, joinedAt: Date.now(), owner: true
            };
            members.push(mem);
        } else {
            mem.phone = phoneMask;
            mem.owner = true;
            mem.elite = true;
            mem.level = '黑钻卡';
            if ((mem.totalMiles || 0) < 1200000) mem.totalMiles = 1200000;
            // 旧版建档时可用里程为 0，一次性与累计里程对齐（之后兑换消耗不再补回）
            if (!mem.mileSeeded && (mem.miles || 0) === 0 && (mem.totalMiles || 0) >= 1200000) {
                mem.miles = mem.totalMiles;
                mem.mileSeeded = 1;
            }
        }
        saveMembers(members);
        return mem;
    }

    /* 接管登录入口：命中站长凭证时直接合成会员身份，其余完全沿用原逻辑 */
    var baseLogin = window.loginAccount;
    window.loginAccount = function (phone, pwd) {
        var p = (phone || '').trim();
        var w = (pwd || '').trim();

        if (p === ownerPhone() && pwdOk(w)) {
            var mem = ensureOwner();
            if (typeof saveMember === 'function') saveMember(mem);
            try { sessionStorage.setItem(K_SESS, '1'); } catch (e) {}
            // 登录页会在 0.9 秒后跳转，欢迎层由目标页面加载时弹出
            return { ok: true, member: mem };
        }

        try { sessionStorage.removeItem(K_SESS); } catch (e) {}
        return baseLogin(p, w);
    };

    /* 发礼券 */
    function claimCoupons() {
        var list = getCoupons();
        var base = Date.now();
        for (var i = 0; i < GIFT_COUNT; i++) {
            list.push({
                code: 'OWN' + base + '-' + (i + 1),
                value: GIFT_VALUE,
                status: '可用',
                owner: true,
                name: '站长专属礼券',
                createdAt: base + i
            });
        }
        saveCoupons(list);
        markGift();
        showToast('两张站长专属礼券已存入券包', 'success');
        if (typeof renderCoupons === 'function') renderCoupons();
        if (typeof updatePayInfo === 'function') updatePayInfo();
    }

    /* 折入余额 */
    function toBalance(amount, title) {
        var m = getMember();
        if (!m) return;
        amount = Math.max(0, Math.round(Number(amount) || 0));
        m.balance = Math.max(0, Math.round(Number(m.balance) || 0)) + amount;
        saveMember(m);
        if (typeof walletTxAdd === 'function') {
            walletTxAdd({ type: 'gift', title: title || '站长礼券转存余额', amount: amount, balanceAfter: m.balance });
        }
        if (typeof renderWallet === 'function') renderWallet();
        if (typeof updatePayInfo === 'function') updatePayInfo();
    }

    function claimAllToBalance() {
        toBalance(GIFT_VALUE * GIFT_COUNT, '站长礼券折入余额');
        markGift();
        showToast('¥' + (GIFT_VALUE * GIFT_COUNT).toLocaleString() + ' 已存入账户余额', 'success');
    }

    /* 欢迎层 */
    function showWelcome() {
        if (document.getElementById('lmsOwnerWelcome')) return;
        markShown();

        var dark = false;
        try { dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) {}
        var T = {
            card: dark ? 'rgba(30,38,48,0.97)' : 'rgba(255,255,255,0.97)',
            text: dark ? '#e8edf2' : '#33404f',
            sub: dark ? 'rgba(232,237,242,0.68)' : '#6b7280',
            body: dark ? 'rgba(232,237,242,0.86)' : '#47535f',
            line: dark ? 'rgba(232,237,242,0.14)' : 'rgba(201,168,106,0.5)',
            chip: dark ? 'rgba(201,168,106,0.14)' : 'rgba(201,168,106,0.10)',
            ghost: dark ? 'rgba(232,237,242,0.1)' : 'rgba(74,90,110,0.06)'
        };

        var mask = document.createElement('div');
        mask.id = 'lmsOwnerWelcome';
        mask.setAttribute('role', 'dialog');
        mask.setAttribute('aria-modal', 'true');
        mask.setAttribute('aria-labelledby', 'owTitle');
        mask.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:9300;display:flex;align-items:center;justify-content:center;'
            + 'padding:18px;box-sizing:border-box;background:' + (dark ? 'rgba(8,12,18,0.78)' : 'rgba(24,32,42,0.48)') + ';'
            + 'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
            + 'font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;opacity:0;transition:opacity .28s ease;';

        var card = document.createElement('div');
        card.style.cssText = 'width:min(500px, calc(100vw - 30px));box-sizing:border-box;border-radius:24px;padding:26px 24px 20px;'
            + 'background:' + T.card + ';color:' + T.text + ';border:1px solid ' + T.line + ';'
            + 'box-shadow:0 30px 80px rgba(10,16,24,0.38);transform:translateY(12px) scale(0.98);'
            + 'transition:transform .32s cubic-bezier(.2,.9,.3,1.2);';

        card.innerHTML = ''
            + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'
            + '<span style="width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;'
            + 'background:linear-gradient(135deg,#e6d4a6,#c9a86a);color:#3a2f1a;font-size:19px"><i class="fa fa-diamond"></i></span>'
            + '<div style="min-width:0">'
            + '<p id="owTitle" style="margin:0;font-size:21px;font-weight:800;letter-spacing:0.01em">欢迎站长进入本网站</p>'
            + '<p style="margin:3px 0 0;font-size:12.5px;color:' + T.sub + '">站长专属账号 · 黑钻卡会员</p>'
            + '</div></div>'
            + '<p style="margin:0 0 8px;font-size:13.5px;line-height:1.85;color:' + T.body + '">'
            + '系统已为您的账号备好两张面值 ¥200,000 的站长专属礼券，合计 <b style="color:#b8860b">¥400,000</b>。</p>'
            + '<p style="margin:0 0 14px;font-size:13.5px;line-height:1.85;color:' + T.body + '">'
            + '礼券可在购票时直接抵扣；如果一次用不完，也可以选择一次性折入账户余额，之后任何消费都能用。</p>'
            + '<div style="padding:11px 13px;border-radius:12px;background:' + T.chip + ';margin-bottom:16px;font-size:12.5px;line-height:1.7;color:' + T.body + '">'
            + '两张礼券　<b style="color:#b8860b">¥200,000</b> × 2　·　商品与机票通用　·　无使用门槛'
            + '</div>'
            + '<button type="button" id="owClaim" style="width:100%;padding:13px;border:none;border-radius:999px;cursor:pointer;'
            + 'font-size:14.5px;font-weight:800;background:linear-gradient(135deg,#e6d4a6,#c9a86a);color:#332a17;'
            + 'box-shadow:0 10px 24px rgba(201,168,106,0.32);transition:all .2s ease">收下两张礼券</button>'
            + '<button type="button" id="owBalance" style="width:100%;padding:12px;margin-top:9px;border-radius:999px;cursor:pointer;'
            + 'font-size:13.5px;font-weight:700;background:' + T.ghost + ';color:' + T.text + ';border:1px solid ' + (dark ? 'rgba(232,237,242,0.18)' : 'rgba(74,90,110,0.18)') + '">'
            + '全部存入余额（¥400,000）</button>'
            + '<p style="margin:11px 0 0;font-size:11.5px;color:' + T.sub + ';text-align:center;line-height:1.6">'
            + '礼券仅在本站演示环境有效，不具备真实货币价值；领取后也可在会员中心单独转存余额。</p>';

        document.body.appendChild(mask);
        mask.appendChild(card);

        requestAnimationFrame(function () {
            mask.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });

        function close() {
            mask.style.opacity = '0';
            card.style.transform = 'translateY(8px) scale(0.98)';
            setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 260);
        }

        document.getElementById('owClaim').addEventListener('click', function () {
            claimCoupons();
            close();
        });
        document.getElementById('owBalance').addEventListener('click', function () {
            claimAllToBalance();
            close();
        });
    }

    /* 会员中心：单张站长券转存余额（按券号定位，避免列表变动后错位） */
    window.ownerCouponToBalance = function (idxOrCode) {
        var list = getCoupons();
        var c = null;
        if (typeof idxOrCode === 'number') {
            c = list[idxOrCode] || null;
            if (c && !c.owner) c = null;
        }
        if (!c) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] && list[i].code === idxOrCode) { c = list[i]; break; }
            }
        }
        if (!c || !c.owner || c.status !== '可用') return;
        var amt = Math.round(Number(c.value) || 0);
        showConfirm('将「¥' + amt.toLocaleString() + ' 站长专属礼券」转为账户余额？', function () {
            c.status = '已转存';
            c.usedAt = Date.now();
            saveCoupons(list);
            toBalance(amt, '站长礼券转存余额');
            showToast('¥' + amt.toLocaleString() + ' 已存入账户余额', 'success');
            if (typeof renderCoupons === 'function') renderCoupons();
        });
    };

    /* 页面加载检测：登录后跳转到的页面在此弹出欢迎层 */
    function boot() {
        if (!isOwnerSession() || giftDone() || shownThisSession()) return;
        var m = (typeof getMember === 'function') ? getMember() : null;
        if (!m || !m.owner) return;
        showWelcome();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
