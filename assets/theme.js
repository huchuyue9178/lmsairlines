/* 主题：auto（跟随系统）/ light / dark，三个状态存在 localStorage.lms_theme
   本文件必须在 <head> 内同步加载，先给 <html> 打上 data-theme，避免首屏闪白 */
(function () {
    var KEY = 'lms_theme';
    var root = document.documentElement;

    function systemDark() {
        try { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) { return false; }
    }
    function read() {
        try {
            var v = localStorage.getItem(KEY);
            return (v === 'light' || v === 'dark') ? v : 'auto';
        } catch (e) { return 'auto'; }
    }
    function write(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
    }
    function resolve(mode) {
        return mode === 'auto' ? (systemDark() ? 'dark' : 'light') : mode;
    }

    var state = { mode: read(), real: resolve(read()) };

    /* 图标与文案：浅色 = 太阳，深色 = 月亮，跟随系统 = 半圆 */
    var ICON = { light: 'fa-sun-o', dark: 'fa-moon-o', auto: 'fa-adjust' };
    var LABEL = { light: '主题：浅色', dark: '主题：深色', auto: '主题：跟随系统' };
    var TIP = {
        light: '已切换：浅色模式',
        dark: '已切换：深色模式',
        auto: '已切换：跟随系统'
    };

    function syncUI() {
        var btn = document.getElementById('themeToggle');
        if (btn) {
            var i = btn.querySelector('i');
            if (i) i.className = 'fa ' + ICON[state.mode];
            btn.setAttribute('title', LABEL[state.mode]);
            btn.setAttribute('aria-label', LABEL[state.mode]);
        }
        var mob = document.getElementById('themeToggleMobile');
        if (mob) mob.textContent = LABEL[state.mode];
    }

    function apply(mode) {
        state.mode = mode;
        state.real = resolve(mode);
        root.setAttribute('data-theme', state.real);
        try { root.style.colorScheme = state.real; } catch (e) {}
        syncUI();
    }

    function toast(msg) {
        var el = document.getElementById('lmsThemeToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'lmsThemeToast';
            el.className = 'lms-toast';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('is-on');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove('is-on'); }, 1800);
    }

    /* 点击即切到“当前显示的相反面”，保证第一次点击就能看到明显变化 */
    function toggle() {
        var next = state.real === 'dark' ? 'light' : 'dark';
        write(next);
        apply(next);
        toast(TIP[next]);
    }

    /* 兜底：若页面加载的是旧版 common.js（导航里没有按钮），自己补一个，避免用户无法切换 */
    function ensureButton() {
        if (document.getElementById('themeToggle')) return false;
        var header = document.querySelector('header');
        if (!header) return false;
        var btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.type = 'button';
        btn.innerHTML = '<i class="fa fa-adjust" aria-hidden="true"></i>';
        var menuBtn = header.querySelector('#menuBtn');
        if (menuBtn && menuBtn.parentNode) menuBtn.parentNode.insertBefore(btn, menuBtn);
        else header.appendChild(btn);
        btn.addEventListener('click', toggle);
        syncUI();
        return true;
    }

    /* 首屏立即上色 */
    apply(state.mode);

    function bind() {
        ensureButton();
        var btn = document.getElementById('themeToggle');
        if (btn && !btn._bound) {
            btn._bound = true;
            btn.addEventListener('click', toggle);
        }
        var mob = document.getElementById('themeToggleMobile');
        if (mob && !mob._bound) {
            mob._bound = true;
            mob.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
        }
        syncUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    /* 导航由 common.js 异步渲染，短轮询兜底绑定 */
    var tries = 0, timer = setInterval(function () {
        bind();
        if ((document.getElementById('themeToggle') && document.getElementById('themeToggleMobile')) || ++tries > 40) clearInterval(timer);
    }, 50);

    /* 跟随系统模式下，系统切换时同步 */
    try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () { if (state.mode === 'auto') apply('auto'); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    } catch (e) {}

    window.LMSTheme = {
        toggle: toggle,
        get: function () { return state; }
    };
})();
