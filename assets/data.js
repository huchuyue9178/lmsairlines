// 老牧师航空 - 航班数据单一数据源（booking.html / flight.html / order.html 共用）
const routeTemplate=[
    {start:"北京",end:"广州",time:"08:00-10:40",price:{eco:880,superEco:1180,business:2180,first:3800}},
    {start:"北京",end:"西安",time:"09:00-10:50",price:{eco:620,superEco:830,business:1480,first:2650}},
    {start:"上海",end:"拉萨",time:"08:30-13:20",price:{eco:1650,superEco:2100,business:3600,first:5900}},
    {start:"北京",end:"新加坡",time:"00:10-06:00",price:{eco:2200,superEco:2750,business:5200,first:8600}},
    {start:"上海",end:"纽约",time:"11:00-14:30+1",price:{eco:5800,superEco:6950,business:12800,first:22000}},
    {start:"上海",end:"悉尼",time:"20:00-07:20+1",price:{eco:3600,superEco:4400,business:8100,first:14500}},
    {start:"北京",end:"迪拜",time:"15:00-20:10",price:{eco:3100,superEco:3800,business:7200,first:12400}},
    {start:"北京",end:"阿布扎比",time:"14:20-19:35",price:{eco:3050,superEco:3750,business:7100,first:12200}},
    {start:"多哈",end:"迪拜",time:"10:00-11:05",price:{eco:780,superEco:990,business:1850,first:3200}},
    {start:"北京",end:"上海",time:"07:30-09:50",price:{eco:750,superEco:980,business:1750,first:3100}},
    {start:"北京",end:"深圳",time:"08:20-11:10",price:{eco:860,superEco:1150,business:2100,first:3700}},
    {start:"上海",end:"广州",time:"09:10-11:35",price:{eco:720,superEco:950,business:1700,first:3000}},
    {start:"广州",end:"成都",time:"10:00-12:10",price:{eco:650,superEco:860,business:1550,first:2750}},
    {start:"成都",end:"北京",time:"11:20-13:45",price:{eco:780,superEco:1020,business:1850,first:3250}},
    {start:"深圳",end:"上海",time:"14:00-16:20",price:{eco:740,superEco:970,business:1730,first:3050}},
    {start:"杭州",end:"北京",time:"15:10-17:15",price:{eco:700,superEco:920,business:1650,first:2900}},
    {start:"上海",end:"曼谷",time:"23:00-02:40+1",price:{eco:1850,superEco:2300,business:4300,first:7400}},
    {start:"广州",end:"吉隆坡",time:"01:20-04:10",price:{eco:1720,superEco:2150,business:4000,first:6900}},
    {start:"北京",end:"东京",time:"08:10-12:00",price:{eco:2050,superEco:2550,business:4800,first:8000}},
    {start:"上海",end:"首尔",time:"09:30-12:10",price:{eco:1680,superEco:2100,business:3900,first:6700}},
    {start:"上海",end:"伦敦",time:"12:00-17:30",price:{eco:4900,superEco:5850,business:10700,first:18500}},
    {start:"北京",end:"巴黎",time:"14:10-19:20",price:{eco:4750,superEco:5700,business:10400,first:18000}},
    {start:"上海",end:"法兰克福",time:"11:30-17:00",price:{eco:4820,superEco:5780,business:10550,first:18200}},
    {start:"北京",end:"洛杉矶",time:"16:00-12:40+1",price:{eco:5500,superEco:6600,business:12200,first:21000}},
    {start:"广州",end:"多伦多",time:"22:00-06:10+2",price:{eco:5900,superEco:7050,business:12900,first:22500}},
    {start:"北京",end:"墨尔本",time:"21:00-08:15+1",price:{eco:3750,superEco:4580,business:8400,first:14800}},
    {start:"上海",end:"多哈",time:"20:30-01:45+1",price:{eco:3250,superEco:3980,business:7450,first:12800}}
];
// 每条航线补反向航班（往返）
const fullRoutes=[];
routeTemplate.forEach(r=>{fullRoutes.push(r);fullRoutes.push({start:r.end,end:r.start,time:r.time,price:r.price});});
// 生成未来 30 天航班
function generateFlightList(){
    const list=[];let fi=1;
    for(let day=1;day<=30;day++){
        const d=new Date();d.setDate(d.getDate()+day);
        const dStr=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0')+"-"+String(d.getDate()).padStart(2,'0');
        fullRoutes.forEach(rt=>{list.push({no:"LMS"+String(fi).padStart(3,'0'),start:rt.start,end:rt.end,date:dStr,time:rt.time,price:rt.price});fi++;});
    }
    return list;
}
const flightList=generateFlightList();
function findFlight(no){return flightList.find(x=>x.no===no);}
function searchFlights(opt){opt=opt||{};return flightList.filter(f=>(!opt.start||f.start===opt.start)&&(!opt.end||f.end===opt.end)&&(!opt.date||f.date===opt.date));}
// 解析起飞/到达时间戳（支持跨天 +1/+2）
function parseFlightTime(dateStr,timeStr){
    const parts=timeStr.split("-");
    const depMs=new Date(dateStr+"T"+parts[0].trim()+":00").getTime();
    const arrRaw=parts[1].trim();
    let arrMs=new Date(dateStr+"T"+arrRaw.replace(/\+[0-9]+$/,'')+":00").getTime();
    const plus=/\+([0-9]+)$/.exec(arrRaw);
    if(plus)arrMs+=Number(plus[1])*86400000;
    return {depMs,arrMs};
}
const cabinNameMap={eco:"经济舱",superEco:"超级经济舱",business:"商务舱",first:"头等舱"};
