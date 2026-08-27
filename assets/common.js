// 老牧师航空 - 公共逻辑（页头/页脚注入、导航、购物车、工具函数）
(function(){
    const HEADER_HTML=
    '<header id="mainNav" class="fixed top-0 left-0 w-full z-50 nav-glass transition-all duration-500">'+
        '<div class="container mx-auto px-4 py-3 flex justify-between items-center">'+
            '<a href="index.html" class="flex items-center gap-2 text-white"><i class="fa fa-plane text-gold text-2xl" style="transform:rotate(-30deg)"></i><span class="text-xl font-bold">老牧师航空</span></a>'+
            '<nav class="hidden lg:flex gap-6 text-white text-[15px]">'+
                '<a href="index.html" class="hover:text-gold transition-colors">首页</a>'+
                '<a href="booking.html" class="hover:text-gold transition-colors">机票预订</a>'+
                '<a href="flight.html" class="hover:text-gold transition-colors">航班动态</a>'+
                '<a href="cart.html" class="hover:text-gold transition-colors">购物车</a>'+
                '<a href="order.html" class="hover:text-gold transition-colors">我的订单</a>'+
                '<a href="member.html" class="hover:text-gold transition-colors">会员中心</a>'+
                '<a href="policy.html" class="hover:text-gold transition-colors">服务指南</a>'+
                '<a href="about.html" class="hover:text-gold transition-colors">关于我们</a>'+
                '<a href="customer.html" class="hover:text-gold transition-colors">在线客服</a>'+
            '</nav>'+
            '<div class="hidden lg:flex items-center gap-4 text-white text-sm">'+
                '<a href="cart.html" class="hover:text-gold"><i class="fa fa-shopping-cart"></i><span id="cartBadge" class="ml-1 bg-gold text-primary text-xs px-2 py-0.5 rounded-full">0</span></a>'+
                '<span id="memberArea"></span>'+
                '<span><i class="fa fa-phone"></i> 400-888-9999</span>'+
            '</div>'+
            '<button id="menuBtn" class="lg:hidden text-white text-2xl"><i class="fa fa-bars"></i></button>'+
        '</div>'+
        '<div id="mobileMenu" class="hidden lg:hidden bg-primary px-4 pb-4 text-white">'+
            '<div class="flex flex-col gap-3">'+
                '<a href="index.html">首页</a><a href="booking.html">机票预订</a><a href="flight.html">航班动态</a><a href="cart.html">购物车</a><a href="order.html">我的订单</a><a href="member.html">会员中心</a><a href="policy.html">服务指南</a><a href="about.html">关于我们</a><a href="customer.html">在线客服</a>'+
            '</div>'+
        '</div>'+
    '</header>';

    const FOOTER_HTML=
    '<footer class="bg-primary text-white pt-12 pb-6">'+
        '<div class="container mx-auto px-4">'+
            '<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">'+
                '<div><h4 class="text-gold font-bold text-lg mb-4">老牧师航空</h4><p class="text-sm opacity-80">虔诚 · 严谨 · 安心<br>像牧师般严谨负责、温柔守护每一段航程</p></div>'+
                '<div><h4 class="text-gold font-bold text-lg mb-4">出行政策</h4><ul class="space-y-2 text-sm opacity-80"><li><a href="policy.html">退改签政策</a></li><li><a href="policy.html">行李规定</a></li><li><a href="policy.html">登机须知</a></li></ul></div>'+
                '<div><h4 class="text-gold font-bold text-lg mb-4">快速链接</h4><ul class="space-y-2 text-sm opacity-80"><li><a href="about.html">关于我们</a></li><li><a href="customer.html">客服中心</a></li></ul></div>'+
                '<div><h4 class="text-gold font-bold text-lg mb-4">联系我们</h4><p class="text-sm opacity-80">客服热线：400-888-9999<br>服务时间：07:00-23:00<br>企业地址：民航商务区A座</p></div>'+
            '</div>'+
            '<hr class="border-white/20 mb-6"><div class="text-center text-sm opacity-75"><p>老牧师航空 © 2025 版权所有 | 民航服务备案说明</p></div>'+
        '</div>'+
    '</footer>';

    function initNav(){
        const nav=document.getElementById('mainNav');
        if(nav)window.addEventListener('scroll',()=>{if(window.scrollY>50){nav.classList.remove('nav-glass');nav.style.backgroundColor='#0F2B5B';}else{nav.classList.add('nav-glass');nav.style.backgroundColor='';}});
        const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');
        if(menuBtn&&mobileMenu){
            menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('hidden'));
            mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.add('hidden')));
        }
    }

    document.addEventListener('DOMContentLoaded',function(){
        const h=document.getElementById('siteHeader');if(h)h.innerHTML=HEADER_HTML;
        const f=document.getElementById('siteFooter');if(f)f.innerHTML=FOOTER_HTML;
        initNav();
        updateCartBadge();
        renderMemberArea();
    });
})();

// ---- 购物车 / 订单 / 工具（全局可用） ----
function getCart(){try{return JSON.parse(localStorage.getItem("airCart")||"[]");}catch(e){return [];}}
function saveCart(c){localStorage.setItem("airCart",JSON.stringify(c));updateCartBadge();}
function updateCartBadge(){const b=document.getElementById("cartBadge");if(b)b.textContent=getCart().length;}
function loadOrders(){try{return JSON.parse(localStorage.getItem("airOrders")||"[]");}catch(e){return [];}}
function saveOrders(o){localStorage.setItem("airOrders",JSON.stringify(o));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// ---- 会员常旅客计划（全局可用） ----
const FFP_LEVELS=[
    {name:'普卡',min:0},
    {name:'银卡',min:10000},
    {name:'金卡',min:30000},
    {name:'铂金卡',min:60000},
    {name:'钻石卡',min:100000}
];
function getMember(){try{return JSON.parse(localStorage.getItem("ffpMember")||"null");}catch(e){return null;}}
function saveMember(m){localStorage.setItem("ffpMember",JSON.stringify(m));renderMemberArea();}
function ffpLevel(totalMiles){
    totalMiles=totalMiles||0;
    let cur=FFP_LEVELS[0],next=null;
    for(let i=0;i<FFP_LEVELS.length;i++){
        if(totalMiles>=FFP_LEVELS[i].min){cur=FFP_LEVELS[i];next=FFP_LEVELS[i+1]||null;}else break;
    }
    return {cur,next};
}
// 支付后累积里程（1 元 = 1 里程，四舍五入），返回本次获得里程
function earnMiles(amount){
    const m=getMember();if(!m)return 0;
    const earned=Math.max(0,Math.round(amount||0));
    m.totalMiles=(m.totalMiles||0)+earned;
    m.miles=(m.miles||0)+earned;
    m.level=ffpLevel(m.totalMiles).cur.name;
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
// ---- 里程兑换优惠券 ----
function getCoupons(){try{return JSON.parse(localStorage.getItem("ffpCoupons")||"[]");}catch(e){return [];}}
function saveCoupons(c){localStorage.setItem("ffpCoupons",JSON.stringify(c));}
function availableCoupons(){return getCoupons().filter(x=>x.status==="可用");}

// ---- 页面内轻提示 / 确认框（替代原生 alert/confirm，统一黑金风格） ----
function showToast(msg){
    const t=document.createElement("div");
    t.id="lmsToast";
    t.className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-global bg-card card-gold text-textDark shadow-lg text-sm";
    t.style.border="1px solid #c9a227";
    t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),3200);
}
function showConfirm(msg,onOk){
    const old=document.getElementById("lmsConfirmModal");if(old)old.remove();
    const d=document.createElement("div");
    d.id="lmsConfirmModal";
    d.className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4";
    d.innerHTML='<div class="bg-card card-gold max-w-sm w-full p-6 rounded-global text-center">'+
        '<p class="mb-6 text-textDark leading-relaxed">'+msg+'</p>'+
        '<div class="flex gap-3"><button class="flex-1 border py-2 rounded-global text-textDark" data-a="cancel">取消</button>'+
        '<button class="flex-1 bg-gold text-primary font-bold py-2 rounded-global" data-a="ok">确认</button></div></div>';
    d.querySelector('[data-a="cancel"]').onclick=function(){d.remove();};
    d.querySelector('[data-a="ok"]').onclick=function(){d.remove();onOk&&onOk();};
    document.body.appendChild(d);
}
