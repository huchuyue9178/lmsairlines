// 老牧师航空 - 极简访问日志后端
// 启动：node server.js  （默认端口 3000）
// 环境变量：
//   PORT=3000          监听端口
//   ADMIN_PASSWORD=xxx 后台密码（必填，首次启动后请改）
//   DATA_FILE=visits.json 数据文件路径
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CHANGE_ME';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'visits.json');

const MIME = {
    '.html':'text/html; charset=utf-8', '.js':'application/javascript',
    '.css':'text/css', '.json':'application/json', '.png':'image/png',
    '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
    '.gif':'image/gif', '.svg':'image/svg+xml', '.mp3':'audio/mpeg',
    '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2',
    '.ttf':'font/ttf', '.mov':'video/quicktime', '.mp4':'video/mp4',
};

function loadVisits(){
    try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); }
    catch(e){ return []; }
}
function saveVisits(list){
    // 最多保留 5000 条，防止文件无限膨胀
    if(list.length>5000) list = list.slice(-5000);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list));
}

// 简单 UA 解析（不引第三方库）
function parseUA(ua){
    const s = ua || '';
    let browser = '未知', browserVer = '';
    let os = '未知';
    if(/Edg\//.test(s)){
        const m=s.match(/Edg\/([\d.]+)/); browser='Edge'; browserVer=m[1];
    } else if(/OPR\//.test(s)){
        const m=s.match(/OPR\/([\d.]+)/); browser='Opera'; browserVer=m[1];
    } else if(/Chrome\/([\d.]+)/.test(s) && !/Chromium/.test(s)){
        const m=s.match(/Chrome\/([\d.]+)/); browser='Chrome'; browserVer=m[1];
    } else if(/Firefox\/([\d.]+)/.test(s)){
        const m=s.match(/Firefox\/([\d.]+)/); browser='Firefox'; browserVer=m[1];
    } else if(/Version\/([\d.]+).*Safari/.test(s) && /Safari/.test(s)){
        const m=s.match(/Version\/([\d.]+)/); browser='Safari'; browserVer=m[1];
    }
    if(/Windows NT 10/.test(s)) os='Windows 10/11';
    else if(/Windows/.test(s)) os='Windows';
    else if(/Mac OS X ([\d_]+)/.test(s)) os='macOS '+s.match(/Mac OS X ([\d_]+)/)[1].replace(/_/g,'.');
    else if(/Android ([\d.]+)/.test(s)) os='Android '+s.match(/Android ([\d.]+)/)[1];
    else if(/iPhone OS ([\d_]+)/.test(s)) os='iOS '+s.match(/iPhone OS ([\d_]+)/)[1].replace(/_/g,'.');
    else if(/iPad/.test(s)) os='iPadOS';
    else if(/Linux/.test(s)) os='Linux';
    return {browser, browserVer, os};
}

function readBody(req){
    return new Promise((resolve)=>{
        let data='';
        req.on('data',c=>{data+=c; if(data.length>1e5) req.destroy();});
        req.on('end',()=>{ try{resolve(JSON.parse(data||'{}'));}catch(e){resolve({});} });
    });
}

const server = http.createServer(async (req,res)=>{
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;

    // CORS（允许从任意域名上报）
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    if(req.method==='OPTIONS'){ res.writeHead(204); return res.end(); }

    // ---- API: 上报访问 ----
    if(p === '/api/log' && req.method==='POST'){
        const body = await readBody(req);
        const ip = (req.headers['x-forwarded-for']||req.socket.remoteAddress||'').toString().split(',')[0].trim();
        const ua = req.headers['user-agent']||'';
        const info = parseUA(ua);
        const rec = {
            ts: Date.now(),
            ip,
            ua,
            browser: info.browser,
            browserVer: info.browserVer,
            os: info.os,
            path: body.path || '/',
            referrer: body.referrer || '',
            screen: body.screen || '',
            touch: !!body.touch,
            duration: body.duration || 0,
            member: body.member || '',
        };
        const list = loadVisits();
        list.push(rec);
        saveVisits(list);
        res.writeHead(200,{'Content-Type':'application/json'});
        return res.end('{\"ok\":1}');
    }

    // ---- API: 后台取数据（要密码）----
    if(p === '/api/visits' && req.method==='GET'){
        const pw = url.searchParams.get('password');
        if(pw !== ADMIN_PASSWORD){
            res.writeHead(401,{'Content-Type':'application/json'});
            return res.end('{\"error\":\"wrong password\"}');
        }
        const list = loadVisits().slice(-500).reverse();
        // 简单统计
        const today = new Date().toDateString();
        const todayList = list.filter(r => new Date(r.ts).toDateString()===today);
        const uniqueIP = new Set(todayList.map(r=>r.ip)).size;
        const browserStats = {};
        list.forEach(r=>{ browserStats[r.browser]=(browserStats[r.browser]||0)+1; });
        res.writeHead(200,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({list, stats:{total:list.length, today:todayList.length, uniqueIP, browserStats}}));
    }

    // ---- 静态文件 ----
    let filePath = path.join(__dirname, p === '/' ? 'index.html' : p);
    // 防目录穿越
    if(!filePath.startsWith(__dirname)){ res.writeHead(403); return res.end('forbidden'); }
    fs.readFile(filePath,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
            return res.end('404 Not Found');
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream'});
        res.end(data);
    });
});

server.listen(PORT, ()=>{
    console.log('=========================================');
    console.log('  老牧师航空服务已启动');
    console.log('  本机访问:  http://localhost:'+PORT);
    console.log('  后台管理:  http://localhost:'+PORT+'/admin.html');
    console.log('  数据文件:  '+DATA_FILE);
    console.log('  注意: 首次启动后请用环境变量 ADMIN_PASSWORD 修改默认密码');
    console.log('=========================================');
});
