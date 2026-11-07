/* 本地数据备份：把 localStorage 里的会员/订单/余额等导出成一段备份码，换设备时可粘贴恢复
   只迁移白名单内的业务键；主题、开发者模式状态等本机偏好不参与迁移 */
(function () {
    var PREFIX = 'LMSB1:';
    var WHITE = ['ffpMember', 'ffpMembers', 'ffpAccounts', 'ffpSeq', 'ffpWalletTx', 'ffpCoupons', 'ffpBenefits',
                 'airCart', 'airOrders', 'shopOrders', 'lms_terms_agreed', 'lms_lang', 'lmsOwnerGift'];
    var LABELS = {
        ffpMember: '会员身份', ffpMembers: '会员档案', ffpAccounts: '账号', ffpSeq: '会员序号',
        ffpWalletTx: '余额流水', ffpCoupons: '优惠券', ffpBenefits: '权益',
        airCart: '购物车', airOrders: '机票订单', shopOrders: '商城订单',
        lms_terms_agreed: '用户须知签署', lms_lang: '语言偏好', lmsOwnerGift: '站长礼券'
    };

    function collect() {
        var out = {}, n = 0;
        for (var i = 0; i < WHITE.length; i++) {
            var k = WHITE[i], v = null;
            try { v = localStorage.getItem(k); } catch (e) { v = null; }
            if (v !== null && v !== '') { out[k] = v; n++; }
        }
        return { data: out, count: n };
    }

    function encode(obj) {
        var json = JSON.stringify(obj);
        return PREFIX + btoa(unescape(encodeURIComponent(json)));
    }

    function decode(str) {
        str = (str || '').trim();
        if (!str) throw new Error('备份码为空');
        var json;
        if (str.charAt(0) === '{') {
            json = str;
        } else {
            if (str.indexOf(PREFIX) === 0) str = str.slice(PREFIX.length);
            json = decodeURIComponent(escape(atob(str)));
        }
        var obj = JSON.parse(json);
        if (!obj || obj.v !== 1 || !obj.data || typeof obj.data !== 'object') throw new Error('备份码格式不正确');
        return obj;
    }

    function summarize(data) {
        var lines = [], total = 0;
        for (var k in data) {
            if (WHITE.indexOf(k) < 0) continue;
            var raw = data[k], info = '';
            try {
                var val = JSON.parse(raw);
                if (Array.isArray(val)) info = val.length + ' 条';
                else if (k === 'ffpMember' && val && val.phone) info = val.phone;
                else if (val && typeof val === 'object') info = '1 项';
            } catch (e) { info = '1 项'; }
            lines.push('<li><span>' + (LABELS[k] || k) + '</span><i>' + info + '</i></li>');
            total++;
        }
        return { html: lines.length ? '<ul class="bk-list">' + lines.join('') + '</ul>' : '<p class="bk-empty">这份备份里没有可恢复的内容</p>', total: total };
    }

    /* ---------------- 弹窗 ---------------- */
    function modal() {
        var m = document.getElementById('bkModal');
        if (m) return m;
        m = document.createElement('div');
        m.id = 'bkModal';
        m.className = 'bk-mask';
        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-modal', 'true');
        m.innerHTML = '<div class="bk-panel">' +
            '<div class="bk-head"><h3 id="bkTitle">本地数据备份</h3>' +
            '<button type="button" class="bk-x" aria-label="关闭" data-bk-close>&times;</button></div>' +
            '<p class="bk-sub" id="bkSub"></p>' +
            '<div id="bkBody"></div>' +
            '<div class="bk-actions" id="bkActions"></div>' +
            '</div>';
        document.body.appendChild(m);
        m.addEventListener('click', function (e) {
            if (e.target === m || e.target.hasAttribute('data-bk-close')) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && m.classList.contains('is-on')) close();
        });
        return m;
    }
    function open() { modal().classList.add('is-on'); }
    function close() {
        var m = document.getElementById('bkModal');
        if (m) m.classList.remove('is-on');
    }

    function el(id) { return document.getElementById(id); }

    /* ---------------- 导出 ---------------- */
    function doExport() {
        var c = collect();
        if (!c.count) { open(); el('bkTitle').textContent = '本地数据备份'; el('bkSub').textContent = '这台浏览器里还没有可导出的数据。'; el('bkBody').innerHTML = '<p class="bk-empty">先登录会员或下一笔订单，再来导出。</p>'; el('bkActions').innerHTML = '<button class="bk-btn" data-bk-close>知道了</button>'; bindClose(); return; }
        var payload = { v: 1, at: new Date().toISOString(), data: c.data };
        var code = encode(payload);
        open();
        el('bkTitle').textContent = '导出备份码';
        el('bkSub').textContent = '共 ' + c.count + ' 项数据。复制下面这段文本保存好，换电脑或换浏览器后用「导入」粘贴回来。';
        el('bkBody').innerHTML = '<textarea id="bkCode" class="bk-code" readonly spellcheck="false"></textarea>' +
            '<p class="bk-hint">这段文本含有你的会员、余额和订单信息，不要公开发给他人。</p>';
        el('bkCode').value = code;
        el('bkActions').innerHTML = '<button class="bk-btn" data-bk-close>关闭</button>' +
            '<button class="bk-btn bk-primary" id="bkCopy">复制备份码</button>' +
            '<button class="bk-btn bk-primary" id="bkSave">存为文件</button>';
        bindClose();
        el('bkCopy').addEventListener('click', function () {
            var ta = el('bkCode'); ta.focus(); ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            if (!ok && navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { el('bkCopy').textContent = '已复制'; }, function () { el('bkCopy').textContent = '请手动复制'; });
            else el('bkCopy').textContent = ok ? '已复制' : '请手动复制';
        });
        el('bkSave').addEventListener('click', function () {
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'lmsairlines-backup-' + new Date().toISOString().slice(0, 10) + '.json';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        });
    }

    /* ---------------- 导入 ---------------- */
    function doImport() {
        open();
        el('bkTitle').textContent = '导入备份码';
        el('bkSub').textContent = '粘贴之前导出的备份码，或直接上传那个 .json 文件。';
        el('bkBody').innerHTML = '<textarea id="bkInput" class="bk-code" placeholder="粘贴 LMSB1: 开头的备份码，或 { 开头的 JSON" spellcheck="false"></textarea>' +
            '<p class="bk-hint"><input type="file" id="bkFile" accept=".json,.txt" class="bk-file"> 也可以选择备份文件</p>' +
            '<div id="bkPreview"></div>';
        el('bkActions').innerHTML = '<button class="bk-btn" data-bk-close>取消</button>' +
            '<button class="bk-btn bk-primary" id="bkCheck">校验备份码</button>';
        bindClose();
        el('bkFile').addEventListener('change', function () {
            var f = this.files && this.files[0];
            if (!f) return;
            var fr = new FileReader();
            fr.onload = function () { el('bkInput').value = String(fr.result || ''); };
            fr.readAsText(f);
        });
        el('bkCheck').addEventListener('click', function () {
            var prev = el('bkPreview');
            try {
                var obj = decode(el('bkInput').value);
                var s = summarize(obj.data);
                prev.innerHTML = '<div class="bk-warn">恢复会用这份备份覆盖当前浏览器里的同名数据，覆盖后无法撤销。</div>' +
                    '<p class="bk-sub" style="margin:10px 0 6px">将写入 ' + s.total + ' 项：</p>' + s.html;
                el('bkActions').innerHTML = '<button class="bk-btn" data-bk-close>取消</button>' +
                    '<button class="bk-btn bk-danger" id="bkApply">确认覆盖并恢复</button>';
                bindClose();
                el('bkApply').addEventListener('click', function () { apply(obj.data); });
            } catch (err) {
                prev.innerHTML = '<div class="bk-warn bk-warn-bad">无法识别这段备份码：' + (err && err.message ? err.message : '格式错误') + '</div>';
            }
        });
    }

    function apply(data) {
        var n = 0;
        try {
            for (var k in data) {
                if (WHITE.indexOf(k) < 0) continue;
                if (typeof data[k] !== 'string') continue;
                localStorage.setItem(k, data[k]); n++;
            }
        } catch (e) {
            alert('写入失败，可能是浏览器存储已满或处于隐私模式。');
            return;
        }
        el('bkBody').innerHTML = '<div class="bk-warn bk-warn-ok">已恢复 ' + n + ' 项数据，页面将自动刷新。</div>';
        el('bkActions').innerHTML = '';
        setTimeout(function () { location.reload(); }, 900);
    }

    function bindClose() {
        var m = document.getElementById('bkModal');
        if (!m) return;
        Array.prototype.forEach.call(m.querySelectorAll('[data-bk-close]'), function (b) {
            if (b._bkBound) return;
            b._bkBound = true;
            b.addEventListener('click', close);
        });
    }

    window.LMSBackup = { exportData: doExport, importData: doImport, collect: collect, decode: decode };
})();
