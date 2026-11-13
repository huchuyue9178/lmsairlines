/* ============================================================
   老牧师航空 · 动效编排（motion.js）
   只做两件事：
   1) 同组元素依次入场（stagger），让列表出现有节奏而非齐刷刷；
   2) 触控设备上点击后主动失焦，避免 hover 样式“粘”在元素上。
   不接管既有 IntersectionObserver / reveal 逻辑，避免与 common.js 冲突。
   ============================================================ */
(function () {
    'use strict';

    var MAX_DELAY = 240;
    var STEP = 45;

    function stagger() {
        var groups = new Map();
        var nodes = document.querySelectorAll('.reveal, .reveal-up');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (el.__mStagger) continue;
            var parent = el.parentElement;
            if (!parent) continue;
            var idx = groups.get(parent) || 0;
            groups.set(parent, idx + 1);
            el.__mStagger = true;
            if (idx > 0) el.style.transitionDelay = Math.min(idx * STEP, MAX_DELAY) + 'ms';
        }
    }

    function boot() {
        stagger();
        /* 动态渲染的卡片稍后补一次，等 common.js 的 applyReveal 跑完 */
        setTimeout(stagger, 700);

        /* 触控端：点击链接后失焦，防止 :hover 态残留 */
        if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
            document.addEventListener('touchend', function (e) {
                var t = e.target && e.target.closest ? e.target.closest('a, button') : null;
                if (!t) return;
                setTimeout(function () {
                    if (t.blur) t.blur();
                    t.classList.add('m-tapped');
                    setTimeout(function () { t.classList.remove('m-tapped'); }, 160);
                }, 0);
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
