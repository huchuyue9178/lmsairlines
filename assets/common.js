// 老牧师航空 - 公共逻辑（页头/页脚注入、导航、购物车、工具函数）
(function(){
    const HEADER_HTML=
    '<header id="mainNav" class="fixed top-0 left-0 w-full z-50 nav-glass transition-all duration-500">'+
        '<div class="container mx-auto px-4 py-3 flex justify-between items-center">'+
            '<a href="index.html" class="flex items-center gap-2 text-white"><i class="fa fa-plane text-gold text-2xl" style="transform:rotate(-30deg)"></i><span class="text-xl font-bold">老牧师航空</span></a>'+
            '<nav class="hidden lg:flex gap-4 text-white text-[15px]">'+
                '<a href="index.html" class="hover:text-gold transition-colors">首页</a>'+
                '<a href="booking.html" class="hover:text-gold transition-colors">机票预订</a>'+
                '<a href="flight.html" class="hover:text-gold transition-colors">航班动态</a>'+
                '<a href="checkin.html" class="hover:text-gold transition-colors">在线值机</a>'+
                '<a href="special.html" class="hover:text-gold transition-colors">特殊服务</a>'+
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
                '<a href="index.html">首页</a><a href="booking.html">机票预订</a><a href="flight.html">航班动态</a><a href="checkin.html">在线值机</a><a href="special.html">特殊服务</a><a href="cart.html">购物车</a><a href="order.html">我的订单</a><a href="member.html">会员中心</a><a href="policy.html">服务指南</a><a href="about.html">关于我们</a><a href="customer.html">在线客服</a>'+
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
    {name:'钻石卡',min:100000}
];
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
                status:item.type==="goods"?"待领取":"可使用",createdAt:Date.now()};
            const list=getBenefits();list.push(b);saveBenefits(list);
        }
        if(typeof renderMemberCenter==="function")renderMemberCenter();
        if(typeof renderPage==="function")renderPage();
        showToast("兑换成功！已获得「"+item.name+"」。");
    });
}

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
    return item.status;
}
