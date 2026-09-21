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
                '<a href="member.html" style="display:inline-block;line-height:1.5" class="hover:text-gold transition-colors nav-link">会员中心</a>'+
                '<div class="relative">'+
                    '<button onclick="toggleMore()" aria-label="更多导航选项" class="hover:text-gold transition-colors flex items-center gap-1">更多 <i class="fa fa-chevron-down text-xs" aria-hidden="true"></i></button>'+
                    '<div id="moreMenu" class="absolute right-0 top-full mt-2 w-44 rounded-2xl p-2 shadow-2xl" style="background:rgba(242,244,242,0.85);backdrop-filter:blur(24px) saturate(160%);border:1px solid rgba(255,255,255,0.7);box-shadow:0 10px 32px rgba(120,140,160,0.25)">'+
                        '<a href="flight.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">航班动态</a>'+
                        '<a href="special.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">特殊服务</a>'+
                        '<a href="cart.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">购物车</a>'+
                        '<a href="policy.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">服务指南</a>'+
                        '<a href="about.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">关于我们</a>'+
                        '<a href="customer.html" class="block px-4 py-2 rounded-xl hover:bg-white/60 transition-colors">在线客服</a>'+
                    '</div>'+
                '</div>'+
            '</nav>'+
            '<div class="hidden lg:flex items-center gap-4 text-textDark text-sm">'+
                '<button id="bgmBtn" onclick="onBgmClick()" ondblclick="openBgmPanel()" aria-label="播放或暂停背景音乐" class="hover:text-gold transition-colors cursor-pointer" title="单击播放/暂停，双击打开播放栏"><i class="fa fa-music text-lg" id="bgmIcon" aria-hidden="true"></i></button>'+
                '<a href="cart.html" aria-label="购物车" class="hover:text-gold"><i class="fa fa-shopping-cart" aria-hidden="true"></i><span id="cartBadge" class="ml-1 bg-gold text-primary text-xs px-2 py-0.5 rounded-full">0</span></a>'+
                '<span id="memberArea"></span>'+
                '<span class="text-textGray"><i class="fa fa-envelope"></i> 3686319507@qq.com</span>'+
            '</div>'+
            '<button id="menuBtn" class="lg:hidden text-textDark text-2xl"><i class="fa fa-bars"></i></button>'+
        '</div>'+
        '<div id="mobileMenu" class="lg:hidden menu-closed bg-mistWhite/90 backdrop-blur-xl px-4 pb-5 pt-2 text-textDark">'+
            '<div class="flex flex-col gap-3 text-[15px]">'+
                '<a href="index.html" class="hover:text-gold transition-colors">首页</a><a href="booking.html" class="hover:text-gold transition-colors">机票预订</a><a href="flight.html" class="hover:text-gold transition-colors">航班动态</a><a href="checkin.html" class="hover:text-gold transition-colors">在线值机</a><a href="special.html" class="hover:text-gold transition-colors">特殊服务</a><a href="cart.html" class="hover:text-gold transition-colors">购物车</a><a href="order.html" class="hover:text-gold transition-colors">我的订单</a><a href="member.html" class="hover:text-gold transition-colors">会员中心</a><a href="policy.html" class="hover:text-gold transition-colors">服务指南</a><a href="about.html" class="hover:text-gold transition-colors">关于我们</a><a href="customer.html" class="hover:text-gold transition-colors">在线客服</a>'+
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
                    const ic=document.getElementById('bgmIcon');
                    if(ic){ic.style.color='#4a5a6e';ic.style.animation='bgmSpin 2.4s linear infinite';}
                }).catch(()=>{/* 浏览器拦截时保持暂停，用户点一下即继续 */});
            }
        };
        if(p.readyState>=1)apply(); else p.addEventListener('loadedmetadata',apply,{once:true});
    };

    // 单击：播放/暂停（延迟以区分双击）
    window.onBgmClick=function(){
        if(window._bgmClickTimer)clearTimeout(window._bgmClickTimer);
        window._bgmClickTimer=setTimeout(()=>{
            const p=document.getElementById('bgmPlayer');
            const ic=document.getElementById('bgmIcon');
            if(window._bgmOn){
                p.pause(); window._bgmOn=false;
                ic.style.color=''; ic.style.animation='';
            }else{
                p.play().then(()=>{
                    window._bgmOn=true;
                    ic.style.color='#4a5a6e';
                    ic.style.animation='bgmSpin 2.4s linear infinite';
                }).catch(()=>showToast("请再次点击开始播放"));
            }
            window.saveBgmState();
        },260);
    };

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
                '<div><h4 class="font-semibold text-textDark text-base mb-4">快速链接</h4><ul class="space-y-2 text-sm"><li><a href="about.html" class="hover:underline">关于我们</a></li><li><a href="customer.html" class="hover:underline">客服中心</a></li></ul></div>'+
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
        }
    }

    document.addEventListener('DOMContentLoaded',function(){
        const h=document.getElementById('siteHeader');if(h)h.innerHTML=HEADER_HTML;
        const f=document.getElementById('siteFooter');if(f)f.innerHTML=FOOTER_HTML;
        initNav();
        updateCartBadge();
        renderMemberArea();
        restoreBgmState();
    });
})();

// ---- 购物车 / 订单 / 工具（全局可用） ----
function getCart(){try{const v=JSON.parse(localStorage.getItem("airCart")||"[]");return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveCart(c){localStorage.setItem("airCart",JSON.stringify(c));updateCartBadge();}
function updateCartBadge(){const b=document.getElementById("cartBadge");if(b)b.textContent=getCart().length;}
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
        showToast("恭喜，黑钻卡已开通！尊享黑钻至尊专属权益。");
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
function logoutMember(){localStorage.removeItem("ffpMember");renderMemberArea();}
function renderMemberArea(){
    const el=document.getElementById("memberArea");if(!el)return;
    const m=getMember();
    if(m){
        el.innerHTML='<a href="member.html" class="hover:text-gold" title="会员中心"><i class="fa fa-diamond text-gold"></i> '+esc(m.level)+' · '+esc(m.name)+'</a>';
    }else{
        el.innerHTML='<a href="member.html" class="hover:text-gold border border-gold/60 px-2 py-0.5 rounded-global text-xs">登录 / 注册</a>';
    }
}
// ---- 顶部"更多"下拉 ----
window.toggleMore=function(){
    const m=document.getElementById('moreMenu');
    if(m)m.classList.toggle('open');
};
document.addEventListener('click',function(e){
    const m=document.getElementById('moreMenu');
    if(m&&m.classList.contains('open')&&!e.target.closest('#moreMenu')&&!e.target.closest('button'))m.classList.remove('open');
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
    showToast("兑换成功！已领取 ¥50 优惠券，可在会员中心查看");
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
        showToast("兑换成功！已获得「"+item.name+"」。");
    });
}

// ---- 页面内轻提示 / 确认框（替代原生 alert/confirm，统一黑金风格） ----
function showToast(msg){
    const old=document.getElementById("lmsToast");if(old)old.remove();
    const t=document.createElement("div");
    t.id="lmsToast";
    t.className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] px-5 py-3 text-sm font-medium rounded-full shadow-2xl";
    t.style.background="rgba(255,255,255,0.9)";
    t.style.color="#1d1d1f";
    t.style.backdropFilter="blur(20px) saturate(180%)";
    t.style.webkitBackdropFilter="blur(20px) saturate(180%)";
    t.style.border="1px solid rgba(0,0,0,0.06)";
    t.style.boxShadow="0 8px 30px rgba(0,0,0,0.18)";
    t.style.maxWidth="88vw";
    t.style.textAlign="center";
    t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),3200);
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
        '<button class="flex-1 py-3 text-[17px] font-normal text-[#86868b]" data-a="cancel">取消</button>'+
        '<div style="width:1px;background:rgba(0,0,0,0.08)"></div>'+
        '<button class="flex-1 py-3 text-[17px] font-semibold text-[#4a5a6e]" data-a="ok">确认</button>'+
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

        var box=document.createElement('div');
        box.id='setupDialog';
        box.style.cssText='position:fixed;top:76px;right:16px;z-index:9999;width:340px;max-width:calc(100vw - 32px);'+
            'background:rgba(255,255,255,0.7);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);'+
            'border:1px solid rgba(255,255,255,0.8);border-radius:22px;box-shadow:0 16px 48px rgba(74,90,110,0.22);'+
            'padding:20px;font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;color:#3a4a5c;'+
            'opacity:0;transform:translateY(-12px) scale(0.97);transition:all .5s cubic-bezier(.2,.9,.3,1.2);';
        box.innerHTML=
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
                '<i class="fa fa-paper-plane" style="font-size:18px;color:#4a5a6e"></i>'+
                '<strong style="font-size:16px;font-weight:800">欢迎使用老牧师航空</strong>'+
            '</div>'+
            // 环境提示
            '<p style="font-size:12.5px;line-height:1.6;color:#4a5a6e;margin:0 0 14px;padding:8px 10px;border-radius:10px;background:rgba(201,138,138,0.08)"><i class="fa fa-exclamation-triangle mr-1"></i> 本站含大量液态玻璃与动效，建议设备内存 ≥ 4GB，Chrome 79+/Safari 13.1+</p>'+
            // 设备类型
            '<p style="font-size:13px;font-weight:700;margin:0 0 6px">设备类型</p>'+
            '<div style="display:flex;gap:8px;margin-bottom:14px">'+
                '<button id="setupPC" style="flex:1;background:rgba(255,255,255,0.6);color:#4a5a6e;border:1px solid rgba(74,90,110,0.2);border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-desktop mb-1"></i><br>电脑端</button>'+
                '<button id="setupTouch" style="flex:1;background:rgba(255,255,255,0.6);color:#4a5a6e;border:1px solid rgba(74,90,110,0.2);border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-mobile mb-1"></i><br>触控端</button>'+
            '</div>'+
            // 性能模式
            '<p style="font-size:13px;font-weight:700;margin:0 0 6px">性能模式</p>'+
            '<div style="display:flex;gap:8px;margin-bottom:8px">'+
                '<button id="setupFull" style="flex:1;background:rgba(255,255,255,0.6);color:#4a5a6e;border:1px solid rgba(74,90,110,0.2);border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-star mb-1"></i><br>完整版<br><span style="font-weight:400;font-size:11px">全部动效+玻璃</span></button>'+
                '<button id="setupLite" style="flex:1;background:rgba(255,255,255,0.6);color:#4a5a6e;border:1px solid rgba(74,90,110,0.2);border-radius:14px;padding:10px 8px;font-size:13px;font-weight:700;cursor:pointer"><i class="fa fa-bolt mb-1"></i><br>节省性能版<br><span style="font-weight:400;font-size:11px">保留玻璃+减动画</span></button>'+
            '</div>'+
            '<p style="font-size:12px;margin:0 0 14px;color:'+(dev.lowEnd?'#c98a8a':'#7ba89a')+'"><i class="fa fa-lightbulb-o mr-1"></i>'+(dev.lowEnd?'系统判断：您的设备推荐使用节省性能版':'系统判断：您的设备适合使用完整版')+'</p>'+
            // 确认按钮
            '<div style="display:flex;justify-content:flex-end;gap:8px">'+
                '<a id="setupDetail" href="support.html" target="_blank" style="display:inline-block;background:rgba(255,255,255,0.6);color:#4a5a6e;border:1px solid rgba(74,90,110,0.2);border-radius:999px;padding:6px 14px;font-size:12.5px;font-weight:700;cursor:pointer;text-decoration:none">详细信息</a>'+
                '<button id="setupOk" style="background:#4a5a6e;color:#fff;border:none;border-radius:999px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(74,90,110,0.25)">开始体验</button>'+
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
            pc.style.background=selType==='pc'?'#4a5a6e':'rgba(255,255,255,0.6)';
            pc.style.color=selType==='pc'?'#fff':'#4a5a6e';
            tc.style.background=selType==='touch'?'#4a5a6e':'rgba(255,255,255,0.6)';
            tc.style.color=selType==='touch'?'#fff':'#4a5a6e';
            f.style.background=selPerf==='full'?'#4a5a6e':'rgba(255,255,255,0.6)';
            f.style.color=selPerf==='full'?'#fff':'#4a5a6e';
            l.style.background=selPerf==='lite'?'#4a5a6e':'rgba(255,255,255,0.6)';
            l.style.color=selPerf==='lite'?'#fff':'#4a5a6e';
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
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',show);
    else show();
})();

// 活动结束公告弹窗（设置弹窗关闭后弹出）
function showActivityNotice(){
    if(sessionStorage.getItem('activity_notice_seen')) return;
    var box=document.createElement('div');
    box.id='activityNotice';
    box.style.cssText='position:fixed;top:76px;right:16px;z-index:9998;width:340px;max-width:calc(100vw - 32px);'+
        'background:rgba(255,255,255,0.7);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);'+
        'border:1px solid rgba(255,255,255,0.8);border-radius:22px;box-shadow:0 16px 48px rgba(74,90,110,0.22);'+
        'padding:20px;font-family:"Baloo 2","Nunito","PingFang SC",sans-serif;color:#3a4a5c;'+
        'opacity:0;transform:translateY(-12px) scale(0.97);transition:all .5s cubic-bezier(.2,.9,.3,1.2);';
    box.innerHTML=
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
            '<i class="fa fa-bullhorn" style="font-size:18px;color:#b8860b"></i>'+
            '<strong style="font-size:16px;font-weight:800">活动公告</strong>'+
        '</div>'+
        '<p style="font-size:13px;line-height:1.7;color:#4a5a6e;margin:0 0 14px">「光影星踪 · 影像创作计划」征集活动已圆满结束，感谢所有参与者的热情投稿。获奖名单将在后续公布，敬请期待！</p>'+
        '<div style="display:flex;justify-content:flex-end">'+
            '<button id="activityNoticeOk" style="background:#4a5a6e;color:#fff;border:none;border-radius:999px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(74,90,110,0.25)">我知道了</button>'+
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
