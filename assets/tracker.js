// 老牧师航空 - 访问埋点（每次页面加载自动上报）
// 用法：在每个页面 </body> 前 <script src="assets/tracker.js"></script>
(function(){
    var start = Date.now();
    var path = location.pathname + location.search;
    var referrer = document.referrer || '';
    var screen = window.screen.width + 'x' + window.screen.height + '@' + (window.devicePixelRatio||1);
    var touch = document.body.classList.contains('touch-mode');
    var member = '';
    try {
        var u = JSON.parse(localStorage.getItem('lms_user')||'{}');
        member = u.name || u.phone || '';
    } catch(e){}

    // 上报函数（用 sendBeacon，页面关闭也能发出）
    function send(duration){
        try{
            var data = JSON.stringify({
                path:path, referrer:referrer, screen:screen,
                touch:touch, member:member, duration:duration
            });
            if(navigator.sendBeacon){
                var blob = new Blob([data],{type:'application/json'});
                navigator.sendBeacon('/api/log', blob);
            } else {
                fetch('/api/log',{method:'POST',body:data,headers:{'Content-Type':'application/json'},keepalive:true});
            }
        }catch(e){}
    }

    // 进入页面立即报一次
    send(0);

    // 离开页面时报停留时长
    window.addEventListener('beforeunload', function(){
        send(Math.round((Date.now()-start)/1000));
    });
})();
