// 老牧师航空 - 公共逻辑（页头/页脚注入、导航、购物车、工具函数）

// 全局图片加载失败兜底
(function(){
    function imgFallback(img){
        if(img.dataset.fallback) return;
        img.dataset.fallback='1';
        var wrap=img.parentElement;
        if(wrap){
            wrap.classList.add('img-fallback');
            img.style.display='none';
            if(!wrap.querySelector('i')){
                var icon=document.createElement('i');
                icon.className='fa fa-image';
                wrap.insertBefore(icon, img);
                var txt=document.createElement('span');
                txt.textContent='图片加载中';
                txt.style.fontSize='12px';
                wrap.appendChild(txt);
            }
        }
    }
    window.addEventListener('error',function(e){
        if(e.target.tagName==='IMG') imgFallback(e.target);
    },true);
    // 对动态插入的图片也生效
    document.addEventListener('load',function(){
        document.querySelectorAll('img').forEach(function(img){
            if(img.complete && img.naturalWidth===0) imgFallback(img);
        });
    },true);
})();

(function(){
    const HEADER_HTML=
    '<header id="mainNav" class="fixed top-0 left-0 w-full z-50 nav-glass transition-all duration-500">'+
        '<div class="container mx-auto px-4 py-3 flex justify-between items-center">'+
            '<a href="index.html" class="flex items-center gap-2 text-textDark" aria-label="老牧师航空首页"><i class="fa fa-plane text-gold text-2xl" aria-hidden="true"></i><span class="text-xl font-bold tracking-tight">老牧师航空</span></a>'+
            '<nav class="hidden lg:flex gap-5 text-textDark text-[15px] font-medium items-center" aria-label="主导航">'+
                '<a href="index.html" style="display:inline-block;line-height:1.5" class="hover:text-gold transition-colors nav-link">首页</a>'+
                '<a href="booking.html" style="display:inline-block;line-height:1.5" class="hover:text-gold transition-colors nav-link">机票预订</a>'+
                '<a href="checkin.html" style="display:inline-block;line-height:1.5" class="hover:text-gold transition-colors nav-link">在线值机</a>'+
                '<a href="order.html" style="display:inline-block;line-height:1.5" class="hover:text-gold transition-colors nav-link">我的订单</a>'+
                '<div class="relative">'+
                    '<button onclick="toggleMore()" aria-label="更多导航选项" class="hover:text-gold transition-colors flex items-center gap-1">更多 <i class="fa fa-chevron-down text-xs" aria-hidden="true"></i></button>'+
                    '<div id="moreMenu" class="absolute right-0 top-full mt-2 w-44 rounded-2xl p-2 shadow-2xl" style="background:rgba(242,244,242,0.85);backdrop-filter:blur(24px) saturate(160%);border:1px solid rgba(255,255,255,0.7);box-shadow:0 10px 32px rgba(120,140,160,0.25)">'+
                        '<a href="flight.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">航班动态</a>'+
                        '<a href="special.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">特殊服务</a>'+
                        '<a href="cart.html" class="px-4 py-2 rounded-xl hover:bg-white/60 transition-colors flex items-center justify-between">购物车<span id="cartBadgeMore" class="bg-gold text-primary text-xs px-2 py-0.5 rounded-full">0</span></a>'+
                        '<a href="policy.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">服务指南</a>'+
                        '<a href="about.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">关于我们</a>'+
                        '<a href="customer.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">在线客服</a>'+
                    '</div>'+
                '</div>'+
            '</nav>'+
            '<div class="hidden lg:flex items-center gap-5 text-textDark text-sm">'+
                '<div class="relative">'+
                    '<button onclick="toggleMemberMenu()" aria-label="会员中心菜单" class="hover:text-gold transition-colors flex items-center gap-1.5"><i class="fa fa-diamond text-gold" aria-hidden="true"></i>会员中心 <i class="fa fa-chevron-down text-xs" aria-hidden="true"></i></button>'+
                    '<div id="memberMenu" class="absolute right-0 top-full mt-2 w-52 rounded-2xl p-2 shadow-2xl" style="background:rgba(242,244,242,0.85);backdrop-filter:blur(24px) saturate(160%);border:1px solid rgba(255,255,255,0.7);box-shadow:0 10px 32px rgba(120,140,160,0.25)">'+
                        '<a href="member.html" class="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/60 transition-colors"><i class="fa fa-home w-4 text-center text-gold" aria-hidden="true"></i>会员中心首页</a>'+
                        '<a href="member.html#exchange" class="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/60 transition-colors"><i class="fa fa-exchange w-4 text-center text-gold" aria-hidden="true"></i>里程兑换</a>'+
                        '<a href="member.html#benefits" class="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/60 transition-colors"><i class="fa fa-star w-4 text-center text-gold" aria-hidden="true"></i>会员权益与等级</a>'+
                        '<a href="member.html#elite" class="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/60 transition-colors"><i class="fa fa-diamond w-4 text-center text-gold" aria-hidden="true"></i>黑钻至尊卡</a>'+
                    '</div>'+
                '</div>'+
                '<span id="memberArea"></span>'+
            '</div>'+
            '<div class="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-3 shrink-0">'+
                '<button id="themeToggle" type="button" aria-label="主题：跟随系统" title="主题：跟随系统">'+
                '<i class="fa fa-adjust" aria-hidden="true"></i>'+
                '</button>'+
                '<button id="langToggle" type="button" title="Switch to English" aria-label="Switch to English">EN</button>'+
            '</div>'+
            '<button id="menuBtn" class="lg:hidden text-textDark text-2xl"><i class="fa fa-bars"></i></button>'+
        '</div>'+
        '<div id="mobileMenu" class="lg:hidden menu-closed bg-mistWhite/90 backdrop-blur-xl px-4 pb-5 pt-2 text-textDark">'+
            '<div class="flex flex-col gap-3 text-[15px]">'+
                '<a href="index.html" class="hover:text-gold transition-colors">首页</a><a href="booking.html" class="hover:text-gold transition-colors">机票预订</a><a href="flight.html" class="hover:text-gold transition-colors">航班动态</a><a href="checkin.html" class="hover:text-gold transition-colors">在线值机</a><a href="special.html" class="hover:text-gold transition-colors">特殊服务</a><a href="cart.html" class="hover:text-gold transition-colors flex items-center gap-2">购物车<span id="cartBadgeMobile" class="bg-gold text-primary text-xs px-2 py-0.5 rounded-full">0</span></a><a href="order.html" class="hover:text-gold transition-colors">我的订单</a><a href="member.html" class="hover:text-gold transition-colors">会员中心</a><a href="login.html" class="hover:text-gold transition-colors">登录 / 注册</a>'+
                '<button id="themeToggleMobile" type="button" class="text-left hover:text-gold transition-colors">主题：跟随系统</button>'+
                '<button id="langToggleMobile" type="button" class="text-left hover:text-gold transition-colors">Language: English</button>'+
                '<a href="policy.html" class="hover:text-gold transition-colors">服务指南</a><a href="about.html" class="hover:text-gold transition-colors">关于我们</a><a href="customer.html" class="hover:text-gold transition-colors">在线客服</a>'+
            '</div>'+
        '</div>'+
    '</header>';

    // 背景音乐播放器（全局单例，跨页面保持进度/音量/播放状态）
    if(!document.getElementById('bgmPlayer')){
        const a=document.createElement('audio');
        a.id='bgmPlayer';
        a.loop=true;
        a.preload='auto';
        a.src='assets/bgm.mp3';
        a.volume=0.6;
        document.body.appendChild(a);
    }
    window._bgmOn=false;
    window._bgmClickTimer=null;

    // 保存播放状态到 sessionStorage（页面跳转后恢复）
    window.saveBgmState=function(){
        try{
            const p=document.getElementById('bgmPlayer');
            sessionStorage.setItem('bgmState',JSON.stringify({
                playing:window._bgmOn,
                time:Math.floor(p.currentTime||0),
                volume:p.volume
            }));
        }catch(e){}
    };
    // 页面卸载前保存进度
    window.addEventListener('beforeunload',window.saveBgmState);
    // 恢复状态
    window.restoreBgmState=function(){
        let st=null;
        try{st=JSON.parse(sessionStorage.getItem('bgmState')||'null');}catch(e){}
        const p=document.getElementById('bgmPlayer');
        if(!st)return;
        const apply=()=>{
            if(st.volume!=null)p.volume=st.volume;
            if(st.time)p.currentTime=Math.min(st.time,(p.duration||st.time));
            if(st.playing){
                p.play().then(()=>{
                    window._bgmOn=true;
                    syncBgmUi();
                }).catch(()=>{/* 浏览器拦截时保持暂停，用户点一下即继续 */});
            }
        };
        if(p.readyState>=1)apply(); else p.addEventListener('loadedmetadata',apply,{once:true});
    };

    function syncBgmUi(){
        const ic=document.getElementById('bgmIcon');
        if(ic){
            ic.style.color=window._bgmOn?'#4a5a6e':'';
            ic.style.animation=window._bgmOn?'bgmSpin 2.4s linear infinite':'';
        }
        const fb=document.getElementById('bgmFooterBtn');
        if(fb)fb.innerHTML='<i class="fa fa-music mr-1"></i>背景音乐：'+(window._bgmOn?'开':'关');
    }
    // 单击：播放/暂停（延迟以区分双击）
    window.onBgmClick=function(){
        if(window._bgmClickTimer)clearTimeout(window._bgmClickTimer);
        window._bgmClickTimer=setTimeout(()=>{
            const p=document.getElementById('bgmPlayer');
            if(window._bgmOn){
                p.pause(); window._bgmOn=false;
                syncBgmUi();
            }else{
                p.play().then(()=>{
                    window._bgmOn=true;
                    syncBgmUi();
                }).catch(()=>showToast("请再次点击开始播放"));
            }
            window.saveBgmState();
        },260);
    };
    window.syncBgmUi=syncBgmUi;

    // 双击：弹出小播放栏
    window.openBgmPanel=function(){
        if(window._bgmClickTimer){clearTimeout(window._bgmClickTimer);window._bgmClickTimer=null;}
        let panel=document.getElementById('bgmPanel');
        if(panel){panel.remove();return;}
        panel=document.createElement('div');
        panel.id='bgmPanel';
        panel.className='fixed top-16 right-4 z-[9999] p-4 rounded-3xl shadow-2xl bgm-pop';
        panel.style.cssText='background:linear-gradient(135deg,rgba(242,244,242,0.55),rgba(216,223,230,0.45));backdrop-filter:blur(28px) saturate(180%) brightness(1.05);-webkit-backdrop-filter:blur(28px) saturate(180%) brightness(1.05%);border:1.5px solid rgba(255,255,255,0.75);box-shadow:0 20px 60px rgba(74,90,110,0.25),inset 0 1px 0 rgba(255,255,255,0.8),inset 0 -1px 1px rgba(255,255,255,0.3);width:280px;color:#3a4a5c;transform-origin:top right';
        panel.innerHTML=
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
                '<i class="fa fa-music" style="color:#4a5a6e"></i>'+
                '<b style="font-size:14px;color:#3a4a5c">背景音乐</b>'+
                '<span style="margin-left:auto;font-size:12px;opacity:.55;cursor:pointer" onclick="document.getElementById(\'bgmPanel\').remove()"><i class="fa fa-times"></i></span>'+
            '</div>'+
            '<div style="text-align:center;margin-bottom:10px;padding:8px;border-radius:12px;background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);font-size:13px;letter-spacing:.5px;color:#4a5a6e"><i class="fa fa-headphones mr-2"></i>DJ版《琵琶行》</div>'+
            '<div style="display:flex;align-items:center;gap:8px;font-size:12px;opacity:.75;margin-bottom:6px;color:#3a4a5c">'+
                '<span id="bgmCur">0:00</span>'+
                '<input id="bgmSeek" type="range" min="0" max="100" value="0" style="flex:1;accent-color:#4a5a6e">'+
                '<span id="bgmDur">0:00</span>'+
            '</div>'+
            '<div style="display:flex;align-items:center;gap:8px;font-size:12px;opacity:.75;color:#3a4a5c">'+
                '<i class="fa fa-volume-up"></i>'+
                '<input id="bgmVol" type="range" min="0" max="100" value="60" style="flex:1;accent-color:#4a5a6e">'+
            '</div>';
        document.body.appendChild(panel);

        const p=document.getElementById('bgmPlayer');
        const seek=document.getElementById('bgmSeek');
        const vol=document.getElementById('bgmVol');
        const cur=document.getElementById('bgmCur');
        const dur=document.getElementById('bgmDur');
        const fmt=s=>{s=Math.floor(s||0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
        p.addEventListener('loadedmetadata',()=>{dur.textContent=fmt(p.duration);seek.max=Math.floor(p.duration||100);});
        dur.textContent=fmt(p.duration);
        seek.max=Math.floor(p.duration||100);
        // 进度实时更新
        window._bgmTick=setInterval(()=>{
            if(!document.getElementById('bgmPanel')){clearInterval(window._bgmTick);return;}
            if(!p.paused){seek.value=Math.floor(p.currentTime);}
            cur.textContent=fmt(p.currentTime);
        },500);
        seek.addEventListener('input',()=>{p.currentTime=seek.value;saveBgmState();});
        vol.addEventListener('input',()=>{p.volume=vol.value/100;saveBgmState();});
    };

    const FOOTER_HTML=
    '<footer class="mt-16" style="background:rgba(216,223,230,0.45);backdrop-filter:blur(28px) saturate(160%);-webkit-backdrop-filter:blur(28px) saturate(160%);border-top:1px solid rgba(255,255,255,0.6);color:rgba(58,74,92,0.75)">'+
        '<div class="container mx-auto px-4 py-10">'+
            '<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">'+
                '<div><h4 class="font-semibold text-textDark text-base mb-4">老牧师航空</h4><p class="text-sm leading-relaxed">虔诚 · 严谨 · 安心<br>像牧师般严谨负责、温柔守护每一段航程</p></div>'+
                '<div><h4 class="font-semibold text-textDark text-base mb-4">出行政策</h4><ul class="space-y-2 text-sm"><li><a href="policy.html" class="hover:underline">退改签政策</a></li><li><a href="policy.html" class="hover:underline">行李规定</a></li><li><a href="policy.html" class="hover:underline">登机须知</a></li></ul></div>'+
                '<div><h4 class="font-semibold text-textDark text-base mb-4">快速链接</h4><ul class="space-y-2 text-sm"><li><a href="about.html" class="hover:underline">关于我们</a></li><li><a href="customer.html" class="hover:underline">客服中心</a></li><li><a href="javascript:void(0)" id="bgmFooterBtn" onclick="onBgmClick()" class="hover:underline"><i class="fa fa-music mr-1"></i>背景音乐：关</a></li></ul></div>'+
                '<div><h4 class="font-semibold text-textDark text-base mb-4">联系我们</h4><p class="text-sm leading-relaxed">官方邮箱：3686319507@qq.com<br>服务时间：07:00-23:00<br>企业地址：民航商务区A座</p></div>'+
            '</div>'+
            '<div class="mb-8">'+
                '<a href="updates.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium btn-hover" style="background:#4a5a6e"><i class="fa fa-bullhorn"></i>更新公告<i class="fa fa-arrow-right text-xs"></i></a>'+
            '</div>'+
            '<div class="border-t pt-6 mb-4" style="border-color:rgba(150,175,200,0.4)"><div class="text-sm leading-loose">'+
                '<span class="font-semibold text-white mr-2"><i class="fa fa-gift"></i> 兑换码：</span>'+
                '<input id="redeemInput" type="text" placeholder="输入兑换码" class="px-3 py-1.5 rounded-full text-[#1d1d1f] text-sm outline-none" style="min-width:180px">'+
                '<button onclick="redeemCode()" class="ml-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold btn-hover" style="background:#4a5a6e">兑换</button>'+
            '</div></div>'+
            '<div class="mb-4 text-sm leading-loose">'+
                '<span class="font-semibold text-white mr-2"><i class="fa fa-link"></i> 友情链接：</span>'+
                '<a href="https://www.12306.cn/" target="_blank" rel="noopener" class="hover:underline mx-1">12306 铁路官网</a>'+
                '<a href="https://www.airchina.com.cn/" target="_blank" rel="noopener" class="hover:underline mx-1">中国国际航空</a>'+
                '<a href="https://www.csair.com/cn/" target="_blank" rel="noopener" class="hover:underline mx-1">中国南方航空</a>'+
                '<a href="https://www.ceair.com/" target="_blank" rel="noopener" class="hover:underline mx-1">中国东方航空</a>'+
                '<a href="https://www.hnair.com/" target="_blank" rel="noopener" class="hover:underline mx-1">海南航空</a>'+
            '</div>'+
            '<div class="text-xs opacity-70"><p>胡楚粤 · 老牧师航空 ©2026 版权所有 | 个人制作网站仅供模拟、娱乐、学习使用，请勿用于非法用途</p></div>'+
        '</div>'+
    '</footer>';

    function initNav(){
        const nav=document.getElementById('mainNav');
        if(nav)window.addEventListener('scroll',()=>{if(window.scrollY>50){nav.style.backgroundColor='rgba(216,223,230,0.75)';nav.style.backdropFilter='blur(24px) saturate(160%)';nav.style.webkitBackdropFilter='blur(24px) saturate(160%)';nav.style.borderBottom='1px solid rgba(255,255,255,0.6)';}else{nav.style.backgroundColor='';nav.style.backdropFilter='';nav.style.webkitBackdropFilter='';nav.style.borderBottom='';}});
        const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');
        if(menuBtn&&mobileMenu){
            let menuOpen=false;
            function setMenu(open){
                menuOpen=open;
                if(open){
                    mobileMenu.classList.remove('menu-closed');
                    mobileMenu.classList.add('menu-open');
                    menuBtn.innerHTML='<i class="fa fa-times"></i>';
                }else{
                    mobileMenu.classList.remove('menu-open');
                    mobileMenu.classList.add('menu-closed');
                    menuBtn.innerHTML='<i class="fa fa-bars"></i>';
                }
            }
            menuBtn.addEventListener('click',()=>setMenu(!menuOpen));
            mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
            // 右滑关闭菜单
            let touchStartX=0,touchStartY=0;
            mobileMenu.addEventListener('touchstart',function(e){
                touchStartX=e.touches[0].clientX;
                touchStartY=e.touches[0].clientY;
            },{passive:true});
            mobileMenu.addEventListener('touchend',function(e){
                const dx=e.changedTouches[0].clientX-touchStartX;
                const dy=e.changedTouches[0].clientY-touchStartY;
                if(dx>60 && Math.abs(dy)<50) setMenu(false);
            },{passive:true});
        }
    }

    document.addEventListener('DOMContentLoaded',function(){
        const h=document.getElementById('siteHeader');if(h)h.innerHTML=HEADER_HTML;
        const f=document.getElementById('siteFooter');if(f)f.innerHTML=FOOTER_HTML;
        initNav();
        updateCartBadge();
        renderMemberArea();
        restoreBgmState();
        if(window.syncBgmUi)window.syncBgmUi();
    });
})();

// ---- 购物车 / 订单 / 工具（全局可用） ----
function getCart(){try{const v=JSON.parse(localStorage.getItem("airCart")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveCart(c){localStorage.setItem("airCart",JSON.stringify(c));updateCartBadge();}
function updateCartBadge(){
    const n=getCart().length;
    ["cartBadge","cartBadgeMore","cartBadgeMobile"].forEach(function(id){
        const el=document.getElementById(id);
        if(el)el.textContent=n;
    });
}
function loadOrders(){try{const v=JSON.parse(localStorage.getItem("airOrders")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveOrders(o){localStorage.setItem("airOrders",JSON.stringify(o));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// ---- 会员常旅客计划（全局可用） ----
const FFP_LEVELS=[
    {name:'普卡',min:0},
    {name:'银卡',min:10000},
    {name:'金卡',min:30000},
    {name:'铂金卡',min:60000},
    {name:'钻石卡',min:100000},
    {name:'黑钻卡',min:1000000}
];
// 黑钻卡开通费用（累积消费满 ¥100 万后可额外开通）
const ELITE_FEE=28888;
function getMember(){try{const v=JSON.parse(localStorage.getItem("ffpMember")||"null");return v&&typeof v==="object"?v:null;}catch(e){return null;}}
function getMembers(){
    try{
        let v=JSON.parse(localStorage.getItem("ffpMembers")||"[]");
        if(!Array.isArray(v))v=[];
        // 自动迁移当前登录会员到注册表（兼容老数据）
        const cur=localStorage.getItem("ffpMember");
        if(cur){
            try{
                const m=JSON.parse(cur);
                if(m&&m.cardNo&&!v.some(x=>x.cardNo===m.cardNo)){v.push(m);localStorage.setItem("ffpMembers",JSON.stringify(v));}
            }catch(e){}
        }
        return v;
    }catch(e){return [];}
}
function saveMembers(list){localStorage.setItem("ffpMembers",JSON.stringify(list));}
function saveMember(m){
    localStorage.setItem("ffpMember",JSON.stringify(m));
    // 同步更新会员注册表（支持退出后重新登录）
    try{
        const list=getMembers();
        const idx=list.findIndex(x=>x.cardNo===m.cardNo);
        if(idx>=0)list[idx]=m;else list.push(m);
        localStorage.setItem("ffpMembers",JSON.stringify(list));
    }catch(e){}
    renderMemberArea();
}
function ffpLevel(totalMiles,member){
    totalMiles=totalMiles||0;
    const isElite=!!(member&&member.elite===true);
    // 未开通黑钻时最高只到钻石卡；已开通则含黑钻档
    const upper=isElite?FFP_LEVELS.length:FFP_LEVELS.length-1;
    let cur=FFP_LEVELS[0],next=null;
    for(let i=0;i<upper;i++){
        if(totalMiles>=FFP_LEVELS[i].min){
            cur=FFP_LEVELS[i];
            next=(i+1<FFP_LEVELS.length)?FFP_LEVELS[i+1]:null;
        }else break;
    }
    return {cur,next};
}
// 开通黑钻卡：需累积消费≥¥100万，额外支付 ¥28,888（模拟支付）
function openElite(){
    const m=getMember();if(!m){showToast("请先登录会员再开通黑钻卡");return;}
    if(m.totalMiles<1000000){showToast("累积消费需达到 ¥1,000,000 方可开通黑钻卡");return;}
    if(m.elite){showToast("您已是黑钻卡会员，无需重复开通");return;}
    showConfirm("开通黑钻卡需额外支付 ¥28,888，确认开通？开通后尊享黑钻至尊专属权益。",function(){
        m.elite=true;m.level="黑钻卡";saveMember(m);
        if(typeof renderMemberArea==="function")renderMemberArea();
        if(typeof renderPage==="function")renderPage();
        showToast("恭喜，黑钻卡已开通！尊享黑钻至尊专属权益。","success");
    });
}
// 支付后累积里程（1 元 = 1 里程，四舍五入），返回本次获得里程
function earnMiles(amount){
    const m=getMember();if(!m)return 0;
    const earned=Math.max(0,Math.round(amount||0));
    m.totalMiles=(m.totalMiles||0)+earned;
    m.miles=(m.miles||0)+earned;
    m.level=ffpLevel(m.totalMiles,m).cur.name;
    saveMember(m);
    return earned;
}
// ================= 会员账户余额（模拟充值 / 余额支付） =================
// 余额单位为元，存于 ffpMember.balance；交易流水存于 ffpWalletTx
function getBalance(){
    const m=getMember();
    return m?Math.max(0,Math.round(Number(m.balance)||0)):0;
}
function getWalletTx(){
    try{const v=JSON.parse(localStorage.getItem("ffpWalletTx")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}
}
function saveWalletTx(list){
    try{localStorage.setItem("ffpWalletTx",JSON.stringify((list||[]).slice(-60)));}catch(e){}
}
function walletTxAdd(tx){
    const list=getWalletTx();
    list.push(Object.assign({id:"TX"+Date.now()+Math.floor(Math.random()*1000),time:Date.now()},tx));
    saveWalletTx(list);
}
// ---- 支付方式绑定（支付宝 / 微信支付 / 银行卡）----
var PAY_CHANNELS=[
    {key:"alipay",name:"支付宝",icon:"fa-alipay",desc:"手机号或邮箱账户"},
    {key:"wechat",name:"微信支付",icon:"fa-wechat",desc:"绑定手机号"},
    {key:"bank",name:"银行卡",icon:"fa-credit-card",desc:"储蓄卡或信用卡"}
];
function payChannelList(){return PAY_CHANNELS.slice();}
function payChannelMeta(key){for(var i=0;i<PAY_CHANNELS.length;i++){if(PAY_CHANNELS[i].key===key)return PAY_CHANNELS[i];}return null;}
// 读取绑定状态，非法默认渠道自动回落
function getPayBindings(){
    var m=getMember(),b=(m&&m.payBindings)||{};
    var out={alipay:b.alipay||null,wechat:b.wechat||null,bank:b.bank||null,defaultPay:""};
    var d=m&&m.defaultPay;
    if(d&&out[d])out.defaultPay=d;
    else if(out.alipay)out.defaultPay="alipay";
    else if(out.wechat)out.defaultPay="wechat";
    else if(out.bank)out.defaultPay="bank";
    return out;
}
function hasAnyPayBinding(){
    var b=getPayBindings();
    return !!(b.alipay||b.wechat||b.bank);
}
function maskAccount(v){
    var s=String(v||"").replace(/\s+/g,"");
    if(!s)return "";
    if(s.indexOf("@")>-1){
        var p=s.split("@"),n=p[0];
        return (n.length<=2?n:n.slice(0,2)+"***")+"@"+p[1];
    }
    if(s.length<=4)return s;
    return s.slice(0,3)+"****"+s.slice(-2);
}
// 绑定：仅保存掩码信息，不落明文账号
function bindPayChannel(key,data){
    var m=getMember();
    if(!m)return {ok:false,reason:"nologin",msg:"请先登录会员账户"};
    var meta=payChannelMeta(key);
    if(!meta)return {ok:false,reason:"channel",msg:"不支持的支付方式"};
    var d=data||{},info=null;
    if(key==="alipay"){
        var acct=String(d.account||"").trim();
        if(!/^1\d{10}$/.test(acct)&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acct))return {ok:false,reason:"account",msg:"请输入正确的支付宝账号（手机号或邮箱）"};
        info={account:maskAccount(acct),holder:String(d.holder||m.name||"").trim(),boundAt:Date.now()};
    }else if(key==="wechat"){
        var acct2=String(d.account||"").trim();
        if(!/^1\d{10}$/.test(acct2))return {ok:false,reason:"account",msg:"请输入 11 位手机号作为微信支付账号"};
        info={account:maskAccount(acct2),holder:String(d.holder||m.name||"").trim(),boundAt:Date.now()};
    }else{
        var no=String(d.cardNo||"").replace(/\s+/g,"");
        if(!/^\d{16,19}$/.test(no))return {ok:false,reason:"account",msg:"请输入 16-19 位银行卡号"};
        var bank=String(d.bank||"").trim();
        if(!bank)return {ok:false,reason:"account",msg:"请选择开卡银行"};
        var holder=String(d.holder||"").trim();
        if(holder.length<2)return {ok:false,reason:"account",msg:"请填写持卡人姓名"};
        info={bank:bank,tail:no.slice(-4),holder:holder,boundAt:Date.now()};
    }
    m.payBindings=m.payBindings||{};
    m.payBindings[key]=info;
    if(!m.defaultPay||!m.payBindings[m.defaultPay])m.defaultPay=key;
    saveMember(m);
    return {ok:true,key:key,info:info};
}
function unbindPayChannel(key){
    var m=getMember();
    if(!m||!m.payBindings||!m.payBindings[key])return {ok:false};
    delete m.payBindings[key];
    if(m.defaultPay===key){
        var b=getPayBindings();
        m.defaultPay=b.defaultPay||"";
    }
    saveMember(m);
    return {ok:true};
}
function setDefaultPayChannel(key){
    var m=getMember();
    if(!m||!m.payBindings||!m.payBindings[key])return {ok:false};
    m.defaultPay=key;
    saveMember(m);
    return {ok:true};
}
function payBindingLabel(key){
    var b=getPayBindings(),info=b[key];
    if(!info)return "未绑定";
    if(key==="bank")return info.bank+" · 尾号 "+info.tail;
    return info.account;
}

// 模拟充值：支付方式校验 + 金额校验 + 到账 + 记流水
function rechargeWallet(amount,channel){
    const m=getMember();
    if(!m){showToast("请先登录会员账户再充值","warn");return {ok:false,reason:"nologin"};}
    const amt=Math.round(Number(amount)||0);
    if(!(amt>0)){showToast("请输入有效的充值金额","warn");return {ok:false,reason:"invalid"};}
    if(amt>100000){showToast("单次充值上限 ¥100,000","warn");return {ok:false,reason:"limit"};}
    const bind=getPayBindings();
    if(!(bind.alipay||bind.wechat||bind.bank))return {ok:false,reason:"nobind"};
    const ch=(channel&&bind[channel])?channel:bind.defaultPay;
    if(!ch)return {ok:false,reason:"nobind"};
    const chName=(payChannelMeta(ch)||{name:"模拟渠道"}).name;
    m.balance=Math.round((Number(m.balance)||0)+amt);
    saveMember(m);
    walletTxAdd({type:"recharge",amount:amt,title:"账户充值（"+chName+"）",channel:ch,balanceAfter:m.balance});
    showToast("充值成功，已通过"+chName+"到账，当前余额 ¥"+m.balance.toLocaleString(),"success");
    return {ok:true,balance:m.balance,amount:amt,channel:ch,channelName:chName};
}
// 余额支付：先校验后扣款，成功返回 ok，失败返回原因与差额
function payWithBalance(amount,title){
    const m=getMember();
    const amt=Math.max(0,Math.round(Number(amount)||0));
    if(!m)return {ok:false,reason:"nologin",amount:amt,balance:0,need:amt};
    const bal=Math.round(Number(m.balance)||0);
    if(amt>bal)return {ok:false,reason:"insufficient",amount:amt,balance:bal,need:amt-bal};
    if(amt>0){
        m.balance=bal-amt;
        saveMember(m);
        walletTxAdd({type:"payment",amount:-amt,title:title||"支付",balanceAfter:m.balance});
    }
    return {ok:true,amount:amt,balance:m.balance};
}
// 退回余额（降舱、退票等场景）
function refundToBalance(amount,title){
    const m=getMember();
    const amt=Math.max(0,Math.round(Number(amount)||0));
    if(!m||!(amt>0))return {ok:false};
    m.balance=Math.round((Number(m.balance)||0)+amt);
    saveMember(m);
    walletTxAdd({type:"refund",amount:amt,title:title||"退回差额",balanceAfter:m.balance});
    return {ok:true,balance:m.balance};
}

// ================= 账号系统（手机号 + 密码，本地存储，与会员账号互通） =================
function genCardNo(){
    let seq=Number(localStorage.getItem("ffpSeq")||"0")+1;
    localStorage.setItem("ffpSeq",String(seq));
    return "LMSF"+String(seq).padStart(4,'0');
}
// 轻量散列：避免密码明文落盘（演示站点本地存储）
function hashPwd(pwd){
    let h=5381;
    for(let i=0;i<pwd.length;i++){h=((h<<5)+h+pwd.charCodeAt(i))>>>0;}
    return "h"+h.toString(36)+"."+pwd.length;
}
function getAccounts(){
    try{const v=JSON.parse(localStorage.getItem("ffpAccounts")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}
}
function saveAccounts(list){localStorage.setItem("ffpAccounts",JSON.stringify(list));}
function findAccountByPhone(phone){return getAccounts().find(a=>a.phone===phone)||null;}
// 注册账号：同时创建/复用会员（账号与会员互通，同一手机号同一会员）
function registerAccount(name,phone,pwd){
    name=(name||"").trim();phone=(phone||"").trim();pwd=(pwd||"").trim();
    if(!validName(name))return {ok:false,msg:"请输入 2-20 位姓名"};
    if(!validPhone(phone))return {ok:false,msg:"请输入 11 位有效手机号"};
    if(pwd.length<6||pwd.length>20)return {ok:false,msg:"密码需为 6-20 位"};
    if(findAccountByPhone(phone))return {ok:false,msg:"该手机号已注册，请直接登录"};
    if(getMember())return {ok:false,msg:"您已登录，请先退出后再注册新账号"};
    // 与会员互通：若该手机号已有会员资料（旧数据），复用其卡号与里程
    const members=getMembers();
    let member=members.find(x=>x.phone===phone);
    if(!member){
        member={name:name,phone:phone,cardNo:genCardNo(),level:"普卡",miles:0,totalMiles:0,joinedAt:Date.now()};
    }else{
        member.name=name;
        member.phone=phone;
    }
    const acc={phone:phone,pwd:hashPwd(pwd),name:name,cardNo:member.cardNo,createdAt:Date.now()};
    const list=getAccounts();
    list.push(acc);
    saveAccounts(list);
    saveMember(member);
    return {ok:true,member:member};
}
// 登录账号：手机号 + 密码，登录即恢复对应会员数据
function loginAccount(phone,pwd){
    phone=(phone||"").trim();pwd=(pwd||"").trim();
    if(!validPhone(phone))return {ok:false,msg:"请输入 11 位有效手机号"};
    if(!pwd)return {ok:false,msg:"请输入密码"};
    const acc=findAccountByPhone(phone);
    if(!acc)return {ok:false,msg:"该手机号尚未注册，请先注册"};
    if(acc.pwd!==hashPwd(pwd))return {ok:false,msg:"密码不正确，请重试"};
    const members=getMembers();
    let member=members.find(x=>x.cardNo===acc.cardNo)||members.find(x=>x.phone===phone);
    if(!member){
        member={name:acc.name,phone:phone,cardNo:acc.cardNo,level:"普卡",miles:0,totalMiles:0,joinedAt:acc.createdAt};
    }
    member.phone=phone;
    saveMember(member);
    return {ok:true,member:member};
}
function logoutMember(){localStorage.removeItem("ffpMember");renderMemberArea();}
function renderMemberArea(){
    const el=document.getElementById("memberArea");if(!el)return;
    const m=getMember();
    if(m){
        el.innerHTML='<a href="member.html" class="hover:text-gold" title="会员中心"><i class="fa fa-diamond text-gold"></i> '+esc(m.level)+' · '+esc(m.name)+'</a>';
    }else{
        el.innerHTML='<a href="login.html" class="hover:text-gold border border-gold/60 px-2 py-0.5 rounded-global text-xs">登录 / 注册</a>';
    }
}
// ---- 顶部"更多"/"会员中心"下拉 ----
window.toggleMore=function(){
    const mm=document.getElementById('memberMenu');
    if(mm)mm.classList.remove('open');
    const m=document.getElementById('moreMenu');
    if(m)m.classList.toggle('open');
};
window.toggleMemberMenu=function(){
    const m=document.getElementById('moreMenu');
    if(m)m.classList.remove('open');
    const mm=document.getElementById('memberMenu');
    if(mm)mm.classList.toggle('open');
};
document.addEventListener('click',function(e){
    const m=document.getElementById('moreMenu'),mm=document.getElementById('memberMenu');
    if(m&&m.classList.contains('open')&&!e.target.closest('#moreMenu')&&!e.target.closest('[onclick="toggleMore()"]'))m.classList.remove('open');
    if(mm&&mm.classList.contains('open')&&!e.target.closest('#memberMenu')&&!e.target.closest('[onclick="toggleMemberMenu()"]'))mm.classList.remove('open');
});

// ---- 页脚更新公告折叠 ----
window.toggleNews=function(){
    const list=document.getElementById('newsList');
    const arrow=document.getElementById('newsArrow');
    if(!list)return;
    list.classList.toggle('open');
    if(arrow)arrow.classList.toggle('up');
};

// ---- 页脚兑换码 ----
window.redeemCode=function(){
    const inp=document.getElementById('redeemInput');
    if(!inp)return;
    const code=(inp.value||'').trim();
    if(!code){showToast("请输入兑换码");return;}
    if(code==='2025025270'){location.href='egg.html';return;}
    if(!/^\d+$/.test(code)){showToast("兑换码需为数字");return;}
    // 任意数字均可兑换，每天一次
    let today=new Date();
    const dayKey=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if(localStorage.getItem('redeem_day')===dayKey){showToast("今天已兑换过，明天再来领券吧");return;}
    const c=getCoupons();
    c.push({code:"GIFT50-"+Date.now(),value:50,status:"可用",createdAt:Date.now()});
    saveCoupons(c);
    localStorage.setItem('redeem_day',dayKey);
    showToast("兑换成功！已领取 ¥50 优惠券，可在会员中心查看","success");
    inp.value='';
};

// ---- 里程兑换优惠券 ----
function getCoupons(){try{const v=JSON.parse(localStorage.getItem("ffpCoupons")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveCoupons(c){localStorage.setItem("ffpCoupons",JSON.stringify(c));}
function availableCoupons(){return getCoupons().filter(x=>x.status==="可用");}
// ---- 里程兑换中心：兑换目录与权益 ----
const REDEEM_ITEMS=[
    {id:"coupon50",name:"¥50 代金券",desc:"购票支付立减 50 元",miles:1000,icon:"fa-ticket",type:"coupon"},
    {id:"baggage",name:"超额行李额度",desc:"额外 20kg 免费行李",miles:800,icon:"fa-suitcase",type:"benefit"},
    {id:"lounge",name:"贵宾厅单次体验卡",desc:"机场贵宾厅单次休息",miles:1500,icon:"fa-glass",type:"benefit"},
    {id:"priority",name:"优先安检登机",desc:"专属通道优先安检登机",miles:1200,icon:"fa-bolt",type:"benefit"},
    {id:"wifi",name:"机上 Wi-Fi 时长包",desc:"全程高速 Wi-Fi 上网",miles:1000,icon:"fa-wifi",type:"benefit"},
    {id:"suitcase",name:"品牌联名行李箱",desc:"老牧师×TRAVELER 20寸登机箱",miles:5000,icon:"fa-briefcase",type:"goods"},
    {id:"figure",name:"限量机长手办",desc:"老牧师机长公仔手办",miles:3000,icon:"fa-gift",type:"goods"},
    {id:"coffee",name:"咖啡兑换券",desc:"机场联名咖啡一杯",miles:500,icon:"fa-coffee",type:"voucher"}
];
function getBenefits(){try{const v=JSON.parse(localStorage.getItem("ffpBenefits")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveBenefits(b){localStorage.setItem("ffpBenefits",JSON.stringify(b));}
function getSpecialApps(){try{const v=JSON.parse(localStorage.getItem("specialApps")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveSpecialApps(a){localStorage.setItem("specialApps",JSON.stringify(a));}
function genBenefitCode(prefix){return prefix+"-"+Math.random().toString(36).slice(2,7).toUpperCase();}
// 统一兑换入口（优惠券走 ffpCoupons，其余权益走 ffpBenefits）
function redeemItem(id){
    const item=REDEEM_ITEMS.find(x=>x.id===id);
    if(!item){showToast("兑换项不存在");return;}
    const m=getMember();
    if(!m){showToast("请先登录会员再兑换");return;}
    if((m.miles||0)<item.miles){showToast("可用里程不足 "+item.miles+"，暂时无法兑换。");return;}
    // 实物商品：打开收货信息表单（由会员中心页面提供）
    if(item.type==="goods"&&typeof openShippingForm==="function"){openShippingForm(item);return;}
    showConfirm('确认用 '+item.miles+' 里程兑换「'+item.name+'」？',function(){
        m.miles-=item.miles;saveMember(m);
        if(item.type==="coupon"){
            const c=getCoupons();
            c.push({code:"C"+Date.now(),value:50,status:"可用",createdAt:Date.now()});
            saveCoupons(c);
        }else{
            const b={itemId:item.id,name:item.name,desc:item.desc,type:item.type,icon:item.icon,miles:item.miles,
                code:genBenefitCode(item.type==="goods"?"GK":item.type==="voucher"?"CF":"LF"),
                status:item.type==="goods"?"待发货":"可使用",createdAt:Date.now()};
            const list=getBenefits();list.push(b);saveBenefits(list);
        }
        if(typeof renderMemberCenter==="function")renderMemberCenter();
        if(typeof renderPage==="function")renderPage();
        showToast("兑换成功！已获得「"+item.name+"」。","success");
    });
}

// ---- 页面内轻提示 / 确认框（替代原生 alert/confirm，统一黑金风格） ----
function showToast(msg,type){
    const old=document.getElementById("lmsToast");if(old)old.remove();
    const theme={
        success:{bg:"#e7f6ec",color:"#1e7e34",border:"rgba(30,126,52,0.18)",icon:"fa-check-circle"},
        warn:{bg:"#fdf6e3",color:"#9a6a00",border:"rgba(154,106,0,0.20)",icon:"fa-exclamation-triangle"},
        error:{bg:"#fdeeec",color:"#c0392b",border:"rgba(192,57,43,0.18)",icon:"fa-times-circle"},
        info:{bg:"rgba(255,255,255,0.96)",color:"#1d1d1f",border:"rgba(0,0,0,0.08)",icon:"fa-info-circle"}
    };
    const s=theme[type]||theme.info;
    const t=document.createElement("div");
    t.id="lmsToast";
    t.className="lms-toast fixed top-[76px] left-1/2 z-[120] px-5 py-3 text-sm font-medium rounded-full shadow-2xl flex items-center gap-2.5";
    t.style.background=s.bg;
    t.style.color=s.color;
    t.style.border="1px solid "+s.border;
    t.style.boxShadow="0 12px 36px rgba(0,0,0,0.16)";
    t.style.maxWidth="88vw";
    t.style.whiteSpace="nowrap";
    t.innerHTML='<i class="fa '+s.icon+'" aria-hidden="true" style="font-size:15px"></i><span>'+msg+'</span>';
    document.body.appendChild(t);
    requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("show")));
    setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.remove(),320);},3000);
}
// ---- 表单校验工具 ----
function validName(v){v=(v||"").trim();return v.length>=2&&v.length<=20;}
function validPhone(v){return /^1\d{10}$/.test((v||"").trim());}
function validIdCard(v){v=(v||"").trim();return /^\d{17}[\dXx]$/.test(v)||/^[A-Za-z][A-Za-z0-9]{5,11}$/.test(v);}
// 绑定实时校验：输入/失焦时检查，不通过时显示红色提示文字
function bindFieldValidation(id,fn,msgElId){
    const el=document.getElementById(id);
    if(!el)return;
    const errEl=document.getElementById(msgElId||(id+"Err"));
    function check(){
        const v=el.value;
        const ok=fn(v);
        if(errEl){
            if(!ok&&v.length>0){errEl.classList.remove("hidden");el.classList.add("field-err");}
            else{errEl.classList.add("hidden");el.classList.remove("field-err");}
        }else{
            el.classList.toggle("field-err",!ok&&v.length>0);
        }
    }
    el.addEventListener("input",check);
    el.addEventListener("blur",check);
    window.addEventListener("load",check);
}
function showConfirm(msg,onOk){
    const old=document.getElementById("lmsConfirmModal");if(old)old.remove();
    const d=document.createElement("div");
    d.id="lmsConfirmModal";
    d.className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4";
    d.style.backdropFilter="blur(4px)";
    d.innerHTML='<div class="w-[300px] overflow-hidden text-center shadow-2xl" style="background:rgba(255,255,255,0.96);border-radius:14px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 20px 60px rgba(0,0,0,0.25)">'+
        '<div class="px-5 py-5 text-[15px] text-[#1d1d1f] leading-relaxed">'+msg+'</div>'+
        '<div class="flex border-t" style="border-color:rgba(0,0,0,0.08)">'+
        '<button type="button" class="flex-1 py-3 text-[17px] font-normal text-[#86868b]" data-a="cancel">取消</button>'+
        '<div style="width:1px;background:rgba(0,0,0,0.08)"></div>'+
        '<button type="button" class="flex-1 py-3 text-[17px] font-semibold text-[#4a5a6e]" data-a="ok">确认</button>'+
        '</div></div>';
    d.querySelector('[data-a="cancel"]').onclick=function(){d.remove();};
    d.querySelector('[data-a="ok"]').onclick=function(){d.remove();onOk&&onOk();};
    document.body.appendChild(d);
}

// ---- 线上值机：座位图 / 登机口 / 登机牌 ----
function seatMapForCabin(cabin){
    if(cabin==='头等舱')return {rows:4,letters:['A','C','D','F']};
    if(cabin==='商务舱')return {rows:6,letters:['A','C','D','F']};
    return {rows:12,letters:['A','B','C','D','E','F']};
}
// 该航班已被值机占用的座位（含已退票之外的所有订单）
function getCheckedSeats(flightNo,date){
    return loadOrders().filter(o=>o.checkedIn&&o.flightNo===flightNo&&o.date===date).map(o=>o.seat).filter(Boolean);
}
// 按航班号确定性生成登机口（如 C07）
function genBoardingGate(flightNo){
    let h=0;for(let i=0;i<flightNo.length;i++)h=(h*31+flightNo.charCodeAt(i))%100;
    return 'C'+String(h%20+1).padStart(2,'0');
}
// 登机时间 = 起飞前 40 分钟
function genBoardTime(flightDate,flightTime){
    const arr=parseFlightTime(flightDate,flightTime).depMs;
    const t=new Date(arr-40*60000);
    return String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
}
// 值机/取消值机：返回 true 表示成功
function doCheckin(orderId,seat){
    const orders=loadOrders(),item=orders.find(o=>o.orderId===orderId);
    if(!item)return false;
    item.checkedIn=true;item.seat=seat;item.gate=genBoardingGate(item.flightNo);
    item.boardTime=genBoardTime(item.date,item.time);item.checkinTime=Date.now();
    saveOrders(orders);return true;
}
function cancelCheckin(orderId){
    const orders=loadOrders(),item=orders.find(o=>o.orderId===orderId);
    if(!item)return false;
    item.checkedIn=false;delete item.seat;delete item.gate;delete item.boardTime;delete item.checkinTime;
    saveOrders(orders);return true;
}

// ---- 订单状态实时解析（支付后 5 秒自动视为已完成，全局共享） ----
function resolveStatus(item){
    if(item.status==='已退票')return '已退票';
    if(item.status==='支付处理中'&&Date.now()-item.createTime>5000)return '已完成';
    if(item.checkedIn)return '已完成';
    return item.status;
}

// 首次访问：合并弹窗（环境提示 + 设备类型 + 性能模式）
(function(){
    if(sessionStorage.getItem('setup_done')) return;

    // 设备识别
    function detectDevice(){
        var ua=navigator.userAgent;
        var isMobile=/Android|iPhone|iPad|iPod|Mobile|SymbianOS|Windows Phone/i.test(ua);
        var cores=navigator.hardwareConcurrency||4;
        var mem=navigator.deviceMemory||4;
        // 低端设备：CPU<4核 或 内存<4GB 或 移动端
        var lowEnd=(cores<4)||(mem<4)||isMobile;
        return {isMobile:isMobile,cores:cores,mem:mem,lowEnd:lowEnd};
    }

    function show(){
        var dev=detectDevice();
        var recommended=dev.lowEnd?'lite':'full';
        var isDark=false;
        try{ var ts=localStorage.getItem('lms_theme');
            isDark = ts==='dark' || (ts!=='light' && document.documentElement.getAttribute('data-theme')==='dark');
        }catch(e){ isDark=document.documentElement.getAttribute('data-theme')==='dark'; }
        var C = isDark
            ? {bg:'rgba(26,30,36,0.86)',bd:'rgba(255,255,255,0.14)',tx:'#e9eef5',tx2:'#b6c0cc',
               card:'rgba(255,255,255,0.07)',btnbd:'rgba(255,255,255,0.16)',solid:'#5d6d82',
               info:'rgba(255,255,255,0.06)'}
            : {bg:'rgba(255,255,255,0.7)',bd:'rgba(255,255,255,0.8)',tx:'#3a4a5c',tx2:'#4a5a6e',
               card:'rgba(255,255,255,0.6)',btnbd:'rgba(74,90,110,0.2)',solid:'#4a5a6e',
               info:'rgba(201,138,138,0.08)'};

        var box=document.createElement('div');
        box.id='setupDialog';
        box.style.cssText='position:fixed;top:76px;right:16px;z-index:9999;width:340px;max-width:calc(100vw - 32px);'+
            'background:'+C.bg+';backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);'+
            'border:1px solid '+C.bd+';border-radius:22px;box-shadow:0 16px 48px rgba(74,90,110,0.22);'+
            'padding:20px;font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;color:'+C.tx+';'+
            'opacity:0;transform:translateY(-12px) scale(0.97);transition:all .5s cubic-bezier(.2,.9,.3,1.2);';
        box.innerHTML=
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
                '<i class="fa fa-paper-plane" style="font-size:18px;color:#4a5a6e"></i>'+
                '<strong style="font-size:16px;font-weight:800">欢迎使用老牧师航空</strong>'+
            '</div>'+
            // 环境提示
            '<p style="font-size:12.5px;line-height:1.6;color:'+C.tx2+';margin:0 0 14px;padding:8px 10px;border-radius:10px;background:'+C.info+'"><i class="fa fa-exclamation-triangle mr-1"></i> 本站含大量液态玻璃与动效，建议设备内存 ≥ 4GB，Chrome 79+/Safari 13.1+</p>'+
            // 设备类型
            '<p style="font-size:13px;font-weight:700;margin:0 0 6px">设备类型</p>'+
            '<div style="display:flex;gap:8px;margin-bottom:14px">'+
                '<button id="setupPC" style="flex:1;background:'+C.card+';color:'+C.tx2+';border:1px solid '+C.btnbd+';border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-desktop mb-1"></i><br>电脑端</button>'+
                '<button id="setupTouch" style="flex:1;background:'+C.card+';color:'+C.tx2+';border:1px solid '+C.btnbd+';border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-mobile mb-1"></i><br>触控端</button>'+
            '</div>'+
            // 性能模式
            '<p style="font-size:13px;font-weight:700;margin:0 0 6px">性能模式</p>'+
            '<div style="display:flex;gap:8px;margin-bottom:8px">'+
                '<button id="setupFull" style="flex:1;background:'+C.card+';color:'+C.tx2+';border:1px solid '+C.btnbd+';border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-star mb-1"></i><br>完整版<br><span style="font-weight:400;font-size:11px">全部动效+玻璃</span></button>'+
                '<button id="setupLite" style="flex:1;background:'+C.card+';color:'+C.tx2+';border:1px solid '+C.btnbd+';border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-bolt mb-1"></i><br>节省性能版<br><span style="font-weight:400;font-size:11px">保留玻璃+减动画</span></button>'+
            '</div>'+
            '<p style="font-size:12px;margin:0 0 14px;color:'+(dev.lowEnd?'#c98a8a':'#7ba89a')+'"><i class="fa fa-lightbulb-o mr-1"></i>'+(dev.lowEnd?'系统判断：您的设备推荐使用节省性能版':'系统判断：您的设备适合使用完整版')+'</p>'+
            // 确认按钮
            '<div style="display:flex;justify-content:flex-end;gap:8px">'+
                '<a id="setupDetail" href="support.html" target="_blank" style="display:inline-block;background:'+C.card+';color:'+C.tx2+';border:1px solid '+C.btnbd+';border-radius:999px;padding:6px 14px;font-size:12.5px;font-weight:700;cursor:pointer;text-decoration:none">详细信息</a>'+
                '<button id="setupOk" style="background:'+C.solid+';color:#fff;border:none;border-radius:999px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(74,90,110,0.25)">开始体验</button>'+
            '</div>';
        document.body.appendChild(box);
        requestAnimationFrame(function(){
            box.style.opacity='1';
            box.style.transform='translateY(0) scale(1)';
        });

        // 选中态管理
        var selType=dev.isMobile?'touch':'pc';
        var selPerf=recommended;
        function refreshSel(){
            var pc=document.getElementById('setupPC'),tc=document.getElementById('setupTouch');
            var f=document.getElementById('setupFull'),l=document.getElementById('setupLite');
            pc.style.background=selType==='pc'?C.solid:C.card;
            pc.style.color=selType==='pc'?'#fff':C.tx2;
            tc.style.background=selType==='touch'?C.solid:C.card;
            tc.style.color=selType==='touch'?'#fff':C.tx2;
            f.style.background=selPerf==='full'?C.solid:C.card;
            f.style.color=selPerf==='full'?'#fff':C.tx2;
            l.style.background=selPerf==='lite'?C.solid:C.card;
            l.style.color=selPerf==='lite'?'#fff':C.tx2;
        }
        refreshSel();

        document.getElementById('setupPC').addEventListener('click',function(){selType='pc';refreshSel();});
        document.getElementById('setupTouch').addEventListener('click',function(){selType='touch';refreshSel();});
        document.getElementById('setupFull').addEventListener('click',function(){selPerf='full';refreshSel();});
        document.getElementById('setupLite').addEventListener('click',function(){selPerf='lite';refreshSel();});

        document.getElementById('setupOk').addEventListener('click',function(){
            sessionStorage.setItem('setup_done','1');
            sessionStorage.setItem('device_mode',selType);
            sessionStorage.setItem('perf_mode',selPerf);
            if(selType==='touch') document.body.classList.add('touch-mode');
            else document.body.classList.remove('touch-mode');
            if(selPerf==='lite') document.body.classList.add('lite-mode');
            else document.body.classList.remove('lite-mode');
            box.style.opacity='0';
            box.style.transform='translateY(-10px) scale(0.96)';
            setTimeout(function(){ box.remove(); showActivityNotice(); },350);
        });
    }
    function ready(fn){
        if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn);
        else fn();
    }
    window.__lmsShowSetup=function(){ready(show);};
    // 仅当本会话已同意《用户使用须知》时才自动弹出，否则等须知确认后再调用
    try{
        var termsOk=(document.cookie.indexOf('lms_terms=1')>-1)||!!sessionStorage.getItem('lms_terms_agreed');
        if(termsOk) window.__lmsShowSetup();
    }catch(e){ window.__lmsShowSetup(); }
})();

// 活动结束公告弹窗（设置弹窗关闭后弹出）
function showActivityNotice(){
    if(sessionStorage.getItem('activity_notice_seen')) return;
    var isDark=false;
    try{ var ts=localStorage.getItem('lms_theme');
        isDark = ts==='dark' || (ts!=='light' && document.documentElement.getAttribute('data-theme')==='dark');
    }catch(e){ isDark=document.documentElement.getAttribute('data-theme')==='dark'; }
    var A = isDark
        ? {bg:'rgba(26,30,36,0.86)',bd:'rgba(255,255,255,0.14)',tx:'#e9eef5',tx2:'#b6c0cc',solid:'#5d6d82'}
        : {bg:'rgba(255,255,255,0.7)',bd:'rgba(255,255,255,0.8)',tx:'#3a4a5c',tx2:'#4a5a6e',solid:'#4a5a6e'};
    var box=document.createElement('div');
    box.id='activityNotice';
    box.style.cssText='position:fixed;top:76px;right:16px;z-index:9998;width:340px;max-width:calc(100vw - 32px);'+
        'background:'+A.bg+';backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);'+
        'border:1px solid '+A.bd+';border-radius:22px;box-shadow:0 16px 48px rgba(74,90,110,0.22);'+
        'padding:20px;font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;color:'+A.tx+';'+
        'opacity:0;transform:translateY(-12px) scale(0.97);transition:all .5s cubic-bezier(.2,.9,.3,1.2);';
    box.innerHTML=
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
            '<i class="fa fa-bullhorn" style="font-size:18px;color:#b8860b"></i>'+
            '<strong style="font-size:16px;font-weight:800">活动公告</strong>'+
        '</div>'+
        '<p style="font-size:13px;line-height:1.7;color:'+A.tx2+';margin:0 0 14px">「逐梦云天 · 定格航影」2026 原创航空视频征集活动已圆满结束，感谢所有参与者的热情投稿。获奖名单将在后续公布，敬请期待！</p>'+
        '<div style="display:flex;justify-content:flex-end">'+
            '<button id="activityNoticeOk" style="background:'+A.solid+';color:#fff;border:none;border-radius:999px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(74,90,110,0.25)">我知道了</button>'+
        '</div>';
    document.body.appendChild(box);
    requestAnimationFrame(function(){
        box.style.opacity='1';
        box.style.transform='translateY(0) scale(1)';
    });
    document.getElementById('activityNoticeOk').addEventListener('click',function(){
        sessionStorage.setItem('activity_notice_seen','1');
        box.style.opacity='0';
        box.style.transform='translateY(-10px) scale(0.96)';
        setTimeout(function(){ box.remove(); },350);
    });
}

// 已选过模式：立刻给 body 加 class
(function(){
    var mode=sessionStorage.getItem('device_mode');
    if(mode==='touch') document.body.classList.add('touch-mode');
    var perf=sessionStorage.getItem('perf_mode');
    if(perf==='lite') document.body.classList.add('lite-mode');
})();


// ===== 全局下滑浮现动效 =====
(function(){
    function isVisible(el){
        // 跳过 hidden / display:none 的元素，等它真正显示时再由 MutationObserver 补
        if(el.closest && el.closest('.hidden')) return false;
        var st = getComputedStyle(el);
        if(st.display==='none' || st.visibility==='hidden') return false;
        return true;
    }
    function applyReveal(root){
        if(!root) return;
        // 会员中心动态渲染区域（登录后才显示）完全跳过，避免 Safari 下 display:none→block 后 IntersectionObserver 不触发导致空白
        if(root.closest && root.closest('#memberAreaMain')) return;
        var targets = root.querySelectorAll(
            'main > *, ' +
            'main .bg-card, main .card-gold, ' +
            'main .grid > *, ' +
            '.route-card, .deal-card, .order-card, .shop-card, .faq-item, .activity-card'
        );
        targets.forEach(function(el){
            if(el.__revealed) return;
            // 跳过会员中心内部所有元素
            if(el.closest && el.closest('#memberAreaMain')) return;
            if(!isVisible(el)) return;
            var pos = getComputedStyle(el).position;
            if(pos==='fixed') return;
            el.__revealed = true;
            el.classList.add('reveal-up');
            io.observe(el);
            // 安全网：1 秒后仍未进入视口则强制显示（防止 Safari IntersectionObserver 兼容问题导致永久空白）
            setTimeout(function(){
                if(!el.classList.contains('in')) el.classList.add('in');
            }, 1000);
        });
    }
    var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){
                e.target.classList.add('in');
            } else {
                // 离开视口时重置，再次进入会重播动画
                e.target.classList.remove('in');
            }
        });
    },{threshold:0.01, rootMargin:'0px 0px -5% 0px'});

    function start(){
        var main = document.querySelector('main');
        if(!main) return;
        applyReveal(document);
        var mo = new MutationObserver(function(muts){
            muts.forEach(function(m){
                m.addedNodes.forEach(function(n){
                    if(n.nodeType===1) applyReveal(n);
                });
            });
        });
        mo.observe(main,{childList:true,subtree:true});
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
    else start();
})();

// ================= 用户使用须知（进入站点强制阅读并同意，同会话只弹一次） =================
(function(){
    var agreed=false;
    try{agreed=(document.cookie.indexOf('lms_terms=1')>-1)||!!sessionStorage.getItem('lms_terms_agreed');}catch(e){agreed=false;}
    if(agreed)return;

    var dark=false;
    try{dark=(document.documentElement.getAttribute('data-theme')==='dark');}catch(e){dark=false;}

    var C={
        card: dark?'rgba(30,38,48,0.97)':'rgba(255,255,255,0.97)',
        text: dark?'#e8edf2':'#33404f',
        sub:  dark?'rgba(232,237,242,0.7)':'#6b7280',
        line: dark?'rgba(232,237,242,0.14)':'rgba(74,90,110,0.12)',
        body: dark?'rgba(232,237,242,0.86)':'#47535f',
        mask: dark?'rgba(10,14,20,0.8)':'rgba(28,36,46,0.45)'
    };

    var SECTIONS=[
        {t:'一、关于本站的说明',
         intro:'本站由个人独立开发与维护，是一个用于学习、交流与演示的前端项目，界面与流程参照航空公司官网制作。为免产生误解，我们在此恳切说明：',
         items:[
            '本站并非真实航空公司，不具备航空运输经营资质，不提供航班查询、机票销售、值机、退改签、行李托运等任何实际服务，也不代表、不代理任何真实航空企业；',
            '站内展示的航班时刻、运价、机型、机队规模、航线网络、会员权益、活动与新闻，均为演示用的虚构数据，可能随时调整，请勿作为出行、报销、比价或任何决策的依据；',
            '站内一切内容均不构成要约、承诺、担保或合同，亦不构成对任何第三方服务的介绍与背书；',
            '若您需要真实的出行服务，烦请通过正规航空公司或持牌票务平台办理。我们更希望本站被当作一次界面与交互的练习，而非购票渠道。'
         ]},
        {t:'二、账号、会员与数据存储',
         intro:'为便于体验完整流程，本站提供手机号加密码的注册与登录。相关情况如下，烦请留意：',
         items:[
            '账号、密码、会员等级、里程、优惠券、余额与订单，全部保存在您本机的浏览器存储中，不经过任何服务器；',
            '恳请您不要使用他人的真实信息注册，建议使用虚构信息，或仅使用您本人的信息进行测试；',
            '账号仅在本机、本浏览器内有效。更换设备、更换浏览器、使用无痕模式，或清理浏览器数据后，账号与全部记录将无法找回，敬请谅解；',
            '若您在同一台设备上与他人共用浏览器，对方可能看到您的演示数据，建议体验结束后自行清理站点数据。'
         ]},
        {t:'三、模拟支付与虚拟余额',
         intro:'本站的充值与购票环节均为流程演示，为使说明清晰，我们逐条列明：',
         items:[
            '充值与支付不接入任何真实支付网关，不产生真实扣款，不出具真实票据，也不会真实出票；',
            '绑定支付宝、微信支付或银行卡，仅用于演示绑定与默认渠道的交互。系统只保存掩码信息（手机号或邮箱会打码、银行卡仅保留尾号 4 位），不保存完整卡号，也不保存支付密码、短信验证码与安全码；',
            '恳请您不要在绑定或充值表单中填写真实的银行卡号、支付密码、短信验证码、CVV 等任何真实支付凭证。若您不慎填写，请立即在真实支付平台挂失或修改密码；',
            '账户余额是纯虚拟数值，不具有货币价值，不可提现、不可转让、不可兑换任何实物或权益；',
            '若您在其它真实平台发生支付行为，无论是否因本站演示产生误解，该笔交易与本站无关，本站不承担退款或赔偿责任；',
            '会员权益、里程累积与优惠券规则同为演示设定，与实际航司常旅客计划没有任何关联。'
         ]},
        {t:'四、个人信息与隐私保护（我们的承诺）',
         intro:'我们深知个人信息的重要性，因此本站从设计之初就刻意不设后端：没有数据库、没有账号服务器、没有埋点统计，也没有任何形式的数据回传。在此我们郑重承诺：',
         items:[
            '您在站内填写的手机号、姓名、证件号、地址、支付掩码等信息，仅写入您本机浏览器，不会上传、不会备份到任何服务器；',
            '我们不会收集、出售、出租、交换或以任何方式向第三方提供您的信息，也不会将其用于用户画像、广告投放或商业分析；',
            '本站不使用第三方统计与广告脚本。页面所依赖的图标与字体库仅用于样式渲染，不参与数据收集；',
            '静态托管平台（GitHub Pages）作为基础设施提供方，可能按其自身政策记录常规访问日志（如 IP、访问时间），该行为由平台独立实施并受其隐私政策约束，不在本站控制范围内；',
            '您可以随时通过浏览器设置清除本站的存储数据，清除后我们这边不会保留任何副本，因为本就不存在副本；',
            '若因本站自身原因导致您的个人信息发生泄露，我们承诺第一时间排查、告知并采取补救措施，并依法承担相应责任。对于违规收集、倒卖本站演示数据的第三方，我们将保留追究其法律责任的权利。'
         ]},
        {t:'五、使用规范与禁止用途',
         intro:'本站是公开可访问的演示页面，我们欢迎您随意浏览、测试与交流，但也恳请您不要将其用于下列用途：',
         items:[
            '冒用本站名义，或伪装成真实航空公司、票务代理，对外招揽旅客、收取费用、承诺出票；',
            '以本站界面截图、页面链接作为凭证，实施诈骗、集资、收费代购、虚假宣传或误导他人；',
            '批量抓取、爬取、镜像、转载本站页面与数据，或用于搭建仿冒站点、钓鱼页面；',
            '移除、遮挡或篡改本站的演示标识与免责声明后，对外提供或用于商业经营；',
            '上传、传播违法违规内容，或利用本站从事任何违反中华人民共和国法律法规的活动；',
            '对本站及其托管环境实施攻击、渗透、压力测试、漏洞扫描等可能影响他人正常访问的行为。'
         ],
         outro:'以上行为不仅违背本须知，也可能触犯法律。一经发现，我们将保留追究其法律责任的权利，并依法配合有关部门调查取证。我们更愿意把话说在前面：恳请您只把本站当作一次轻松的技术体验。'
        },
        {t:'六、免责声明（请重点阅读）',
         intro:'为清晰界定双方权利义务，我们在法律允许的最大范围内作出如下声明。以下条款可能略显啰嗦，但确有必要，烦请您耐心读完：',
         items:[
            '演示数据免责：本站所有航班、时刻、价格、库存、机型、航线、活动与新闻均为虚构，不保证真实、准确、完整、及时。任何因参考本站数据而产生的行程安排、比价结论、报销凭证或商业判断，风险与后果由您自行承担；',
            '服务可用性免责：本站为个人项目，可能因维护、改版、托管平台调整或不可抗力而中断、延迟、部分功能失效甚至整体下线，我们不作不间断、无差错运行的保证，亦不因此承担赔偿责任；',
            '数据安全免责：本站数据仅存于您的浏览器，我们不掌握、也无法恢复。因清理缓存、更换设备、浏览器策略、系统故障或误操作导致的数据丢失，我们不承担责任；',
            '用户行为免责：因您在本站填写真实敏感信息（如真实身份证号、真实住址、真实银行卡号），或因误认为本站提供真实服务而产生的任何损失、纠纷与法律责任，由您自行承担；',
            '第三方免责：本站依赖的静态托管、内容分发、图标与字体等第三方服务，其可用性、内容与行为由相应提供方负责，本站不对其故障、变更或政策调整承担责任；站内如出现外部链接，其内容与安全性亦与本站无关；',
            '间接损失免责：在法律允许的范围内，本站不承担利润损失、商誉损失、行程延误、误机、替代交通与住宿费用，以及任何间接、附带、特殊或惩罚性损失；',
            '非专业建议：站内关于航班、票价、会员权益、旅行提示的所有表述均为演示，不构成法律、财税、医疗、保险或旅行安全方面的专业意见；',
            '责任限额：若依适用法律本站仍需承担某种责任，该责任以您为使用本站实际支付的金额为限；鉴于本站完全免费，该金额为零。若您所在地区的法律不允许上述部分排除或限制，则相关条款在该地区法律允许的最小范围内适用，其余条款仍然有效。'
         ]},
        {t:'七、知识产权与品牌说明',
         intro:'关于站内内容的使用边界，也一并说明：',
         items:[
            '本站界面设计、页面结构、文案与自制图形，均为演示与学习用途，不向您授予商业使用许可；',
            '「老牧师航空 LMS Airlines」为演示而虚构的品牌名称与视觉标识，与任何真实航空企业、机构或个人无关，如有雷同纯属巧合；',
            '站内引用的图标、字体等素材，其版权归各自权利人所有，本站仅在演示范围内使用。若权利人认为使用不当，欢迎联系我们，我们将及时处理。'
         ]},
        {t:'八、未成年人使用提示',
         intro:'本站内容健康，但涉及注册、余额与支付流程演示。若您未满 18 周岁，烦请在监护人知情并同意的前提下使用，并请勿填写任何真实的身份与支付信息。监护人如对本站内容有疑虑，欢迎随时联系我们。'},
        {t:'九、条款的更新与解释',
         intro:'本站功能仍在持续迭代，本须知也会随之调整：更新后的内容将在本页展示，并标注新的生效日期，恕不再单独通知。更新后您继续使用本站，即视为接受更新后的内容；若您不同意，恳请停止使用。本须知的表述以本页中文版本为准。'},
        {t:'十、争议处理与联系我们',
         intro:'我们更希望以沟通的方式解决问题：',
         items:[
            '若您对本站内容、数据处理方式或本须知有任何疑问、意见或异议，欢迎通过本站所在 GitHub 仓库的 Issue 与我们联系，我们会尽快回复；',
            '因使用本站产生的争议，双方应本着诚信原则友好协商；协商不成的，可依法向有管辖权的人民法院提起诉讼，适用中华人民共和国法律；',
            '若本须知的某一条款被认定无效或不可执行，不影响其余条款的效力。'
         ]}
    ];

    function renderSections(){
        return SECTIONS.map(function(sec){
            var inner='<p style="margin:0 0 7px;font-size:14.5px;font-weight:700;color:'+C.text+'">'+sec.t+'</p>';
            if(sec.intro)inner+='<p style="margin:0 0 7px">'+sec.intro+'</p>';
            if(sec.items&&sec.items.length){
                inner+=sec.items.map(function(it,i){
                    return '<p style="margin:0 0 4px;padding-left:17px;text-indent:-17px">'+(i+1)+'. '+it+'</p>';
                }).join('');
            }
            if(sec.outro)inner+='<p style="margin:8px 0 0;font-size:13px;color:'+C.sub+'">'+sec.outro+'</p>';
            return '<div style="margin-bottom:19px">'+inner+'</div>';
        }).join('');
    }

    function ready(fn){
        if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);
        else fn();
    }

    ready(function(){
        var prevOverflow=document.body.style.overflow;
        document.body.style.overflow='hidden';

        var mask=document.createElement('div');
        mask.id='termsGate';
        mask.setAttribute('role','dialog');
        mask.setAttribute('aria-modal','true');
        mask.setAttribute('aria-labelledby','termsTitle');
        mask.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:10000;display:flex;align-items:center;justify-content:center;'+
            'padding:16px;box-sizing:border-box;background:'+C.mask+';backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'+
            'font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;opacity:0;transition:opacity .3s ease;';

        var card=document.createElement('div');
        card.style.cssText='width:min(780px, calc(100vw - 28px));max-height:min(88vh, 900px);display:flex;flex-direction:column;box-sizing:border-box;'+
            'background:'+C.card+';color:'+C.text+';border:1px solid '+C.line+';border-radius:24px;overflow:hidden;'+
            'box-shadow:0 30px 80px rgba(10,16,24,0.35);transform:translateY(14px) scale(0.98);transition:transform .35s cubic-bezier(.2,.9,.3,1.2);';

        card.innerHTML=
            '<div style="padding:22px 26px 14px;border-bottom:1px solid '+C.line+'">'+
                '<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">'+
                    '<i class="fa fa-shield" style="font-size:19px;color:#b8860b"></i>'+
                    '<strong id="termsTitle" style="font-size:22px;font-weight:800">用户使用须知</strong>'+
                '</div>'+
                '<p style="margin:0;font-size:12.5px;color:'+C.sub+'">老牧师航空 LMS Airlines · 演示站点　生效日期 2026 年 11 月 7 日　版本 v1.0</p>'+
            '</div>'+
            '<div id="termsBody" style="flex:1 1 auto;min-height:0;overflow-y:auto;padding:18px 26px 14px;scrollbar-width:thin;font-size:13.5px;line-height:1.85;color:'+C.body+'">'+
                '<p style="margin:0 0 16px;padding:10px 12px;background:'+(dark?'rgba(232,237,242,0.06)':'rgba(74,90,110,0.05)')+';border-radius:12px;font-size:13px">'+
                '本须知共十个部分、约 3,500 字。烦请向下滑动阅读至底部，再点击「我同意，遵守此规」开始使用。'+
                '</p>'+
                renderSections()+
                '<p style="margin:4px 0 10px;padding:12px 14px;border-radius:12px;background:'+(dark?'rgba(201,168,106,0.12)':'rgba(201,168,106,0.10)')+';font-size:13px;line-height:1.8">'+
                '以上内容我们已尽量写得清楚直白。点击下方按钮，即表示您已阅读、理解并自愿遵守本须知；若仍有疑问，欢迎通过 GitHub 仓库的 Issue 与我们沟通。'+
                '</p>'+
            '</div>'+
            '<div style="padding:14px 26px 20px;border-top:1px solid '+C.line+'">'+
                '<p id="termsHint" style="margin:0 0 9px;font-size:12.5px;color:'+C.sub+'">请向下滑动阅读至底部</p>'+
                '<button id="termsAgree" type="button" disabled style="width:100%;padding:14px;border:none;border-radius:999px;'+
                    'font-size:15px;font-weight:800;letter-spacing:0.02em;background:'+(dark?'rgba(232,237,242,0.16)':'#4a5a6e')+';'+
                    'color:'+(dark?'rgba(232,237,242,0.72)':'#fff')+';opacity:.85;cursor:not-allowed;transition:all .25s ease">请阅读至底部</button>'+
                '<p style="margin:9px 0 0;font-size:12px;color:'+C.sub+';text-align:center">若不同意，请直接关闭页面，不要继续使用本站。</p>'+
            '</div>';

        document.body.appendChild(mask);
        mask.appendChild(card);

        var bodyEl=document.getElementById('termsBody');
        var btn=document.getElementById('termsAgree');
        var hint=document.getElementById('termsHint');
        var unlocked=false;

        function unlock(){
            if(unlocked)return;
            unlocked=true;
            btn.disabled=false;
            btn.style.opacity='1';
            btn.style.cursor='pointer';
            btn.style.background='#4a5a6e';
            btn.style.color='#fff';
            btn.style.boxShadow='0 10px 26px rgba(74,90,110,0.3)';
            btn.textContent='我同意，遵守此规';
            hint.textContent='已阅读完毕，同意后即可开始使用本站全部功能。';
        }
        function check(){
            if(!bodyEl||!btn)return;
            var atBottom=(bodyEl.scrollTop+bodyEl.clientHeight>=bodyEl.scrollHeight-12);
            var noScroll=(bodyEl.scrollHeight<=bodyEl.clientHeight+4);
            if(atBottom||noScroll)unlock();
        }
        bodyEl.addEventListener('scroll',check);

        requestAnimationFrame(function(){
            mask.style.opacity='1';
            card.style.transform='translateY(0) scale(1)';
            check();
            setTimeout(check,240);
        });

        btn.addEventListener('click',function(){
            if(btn.disabled)return;
            try{document.cookie='lms_terms=1;path=/;SameSite=Lax';}catch(e){}
            try{sessionStorage.setItem('lms_terms_agreed','1');}catch(e){}
            document.body.style.overflow=prevOverflow||'';
            mask.style.opacity='0';
            card.style.transform='translateY(10px) scale(0.98)';
            setTimeout(function(){
                if(mask.parentNode)mask.parentNode.removeChild(mask);
                if(typeof window.__lmsShowSetup==='function')window.__lmsShowSetup();
            },280);
        });
    });
})();
