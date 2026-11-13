/* ============================================================
   开发者模式按需加载器（dev-loader.js）
   普通用户不再加载 65KB 的 dev.js，只有点击页脚入口时才拉取。
   ============================================================ */
(function () {
    'use strict';
    var SRC = 'assets/dev.js?v=20261114d1';
    var loading = false;

    function mount() {
        if (document.getElementById('devFootLink')) return;
        var footer = document.querySelector('#siteFooter footer');
        if (!footer) return;

        if (!document.getElementById('lmsDevLoaderStyle')) {
            var st = document.createElement('style');
            st.id = 'lmsDevLoaderStyle';
            st.textContent = '.dev-foot-link{display:inline-block;padding:6px 14px;border:1px solid rgba(74,90,110,.18);'
                + 'border-radius:999px;background:transparent;color:#6b7686;font-size:12px;cursor:pointer;'
                + 'font-family:inherit;transition:border-color .18s ease,color .18s ease}'
                + '.dev-foot-link:hover{border-color:rgba(74,90,110,.34);color:#3a4a5c}'
                + 'html[data-theme="dark"] .dev-foot-link{border-color:rgba(255,255,255,.16);color:#8f9aa8}'
                + 'html[data-theme="dark"] .dev-foot-link:hover{border-color:rgba(255,255,255,.3);color:#dfe6ee}';
            document.head.appendChild(st);
        }

        var last = footer.querySelector('.container > div:last-child');
        var wrap = document.createElement('div');
        wrap.style.cssText = 'text-align:center;margin-top:16px;';
        wrap.innerHTML = '<button type="button" id="devFootLink" class="dev-foot-link">开发者模式</button>';
        (last ? last.parentNode : footer).appendChild(wrap);

        var btn = wrap.querySelector('#devFootLink');

        function onClick() {
            if (window.__lmsDevOpen) { window.__lmsDevOpen(); return; }
            if (loading) return;
            loading = true;
            var s = document.createElement('script');
            s.src = SRC;
            s.onload = function () {
                loading = false;
                btn.removeEventListener('click', onClick);
                if (window.__lmsDevOpen) window.__lmsDevOpen();
            };
            s.onerror = function () {
                loading = false;
                btn.textContent = '开发者模式（加载失败，请刷新重试）';
            };
            document.body.appendChild(s);
        }
        btn.addEventListener('click', onClick);
    }

    function start() {
        // 页脚由 common.js 生成，等它渲染完再挂入口
        setTimeout(mount, 0);
        setTimeout(mount, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
