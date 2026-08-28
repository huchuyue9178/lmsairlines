#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
老牧师航空 - 天气代理服务
提供实时天气查询接口（基于 Open-Meteo 公开数据，无需 API Key）。
启动：python3 weather_server.py  （默认端口 9100）
接口：GET /weather?city=北京
返回：{ok, city, temp, wind, code, condition, severe, severeReason, time}
"""
import json, urllib.request, urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 9100

# 城市 -> (纬度, 经度)（含航班涉及的所有国内外城市）
CITY_LL = {
    "北京": (39.9042, 116.4074), "上海": (31.2304, 121.4737),
    "广州": (23.1291, 113.2644), "深圳": (22.5431, 114.0579),
    "成都": (30.5728, 104.0668), "杭州": (30.2741, 120.1551),
    "南京": (32.0603, 118.7969), "重庆": (29.5630, 106.5516),
    "武汉": (30.5928, 114.3055), "西安": (34.3416, 108.9398),
    "天津": (39.3434, 117.3616), "厦门": (24.4798, 118.0894),
    "昆明": (25.0389, 102.7183), "长沙": (28.2282, 112.9388),
    "青岛": (36.0671, 120.3826), "大连": (38.9140, 121.6147),
    "珠海": (22.2707, 113.5767), "苏州": (31.2989, 120.5853),
    "石家庄": (38.0428, 114.5149), "宁波": (29.8683, 121.5440),
    "嘉兴": (30.7520, 120.7500), "拉萨": (29.6500, 91.1000),
    "新加坡": (1.3521, 103.8198), "纽约": (40.7128, -74.0060),
    "悉尼": (-33.8688, 151.2093), "迪拜": (25.2048, 55.2708),
    "阿布扎比": (24.4539, 54.3773), "巴黎": (48.8566, 2.3522),
    "东京": (35.6762, 139.6503), "首尔": (37.5665, 126.9780),
    "曼谷": (13.7563, 100.5018), "伦敦": (51.5074, -0.1278),
    "莫斯科": (55.7558, 37.6173), "洛杉矶": (34.0522, -118.2437),
    "多伦多": (43.6532, -79.3832), "吉隆坡": (3.1390, 101.6869),
    "墨尔本": (-37.8136, 144.9631), "法兰克福": (50.1109, 8.6821),
    "多哈": (25.2854, 51.5310),
}
# 高铁站名 -> 城市（天气按城市查询）
STATION_TO_CITY = {
    "上海虹桥": "上海", "北京南": "北京", "广州南": "广州", "深圳北": "深圳",
    "成都东": "成都", "重庆北": "重庆", "南京南": "南京", "杭州东": "杭州",
    "嘉兴南": "嘉兴", "石家庄": "石家庄", "珠海": "珠海", "宁波": "宁波", "苏州": "苏州",
}

# WMO 天气代码 -> (中文, 严重级别 0正常/1关注/2取消)
WMO = {
    0: ("晴", 0), 1: ("基本晴朗", 0), 2: ("少云", 0), 3: ("阴天", 0),
    45: ("雾", 1), 48: ("冻雾", 1),
    51: ("小毛毛雨", 0), 53: ("毛毛雨", 0), 55: ("大毛毛雨", 0),
    56: ("冻毛毛雨", 1), 57: ("强冻毛毛雨", 1),
    61: ("小雨", 0), 63: ("中雨", 1), 65: ("大雨", 2),
    66: ("冻雨", 2), 67: ("强冻雨", 2),
    71: ("小雪", 1), 73: ("中雪", 2), 75: ("大雪", 2), 77: ("雪粒", 2),
    80: ("小阵雨", 0), 81: ("中阵雨", 1), 82: ("强阵雨", 2),
    85: ("小阵雪", 2), 86: ("强阵雪", 2),
    95: ("雷暴", 2), 96: ("雷暴伴冰雹", 2), 99: ("强雷暴伴冰雹", 2),
}

def normalize_city(name):
    if not name: return None
    name = name.strip()
    if name in CITY_LL: return name
    if name in STATION_TO_CITY: return STATION_TO_CITY[name]
    # 尝试去掉常见后缀
    for suf in ("虹桥", "南", "北", "东", "站"):
        if name.endswith(suf):
            base = name[:-len(suf)]
            if base in CITY_LL: return base
    return None

def fetch_weather(city):
    city = normalize_city(city)
    if not city:
        return {"ok": False, "error": "暂不支持该城市查询，请尝试国内/国际主要城市", "city": city}
    lat, lon = CITY_LL[city]
    url = ("https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f"
           "&current_weather=true&timezone=auto" % (lat, lon))
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
    except Exception as e:
        return {"ok": False, "error": "天气服务请求失败：%s" % str(e), "city": city}
    cw = data.get("current_weather", {})
    code = cw.get("weathercode", 3)
    cond, level = WMO.get(code, ("未知", 0))
    wind = round(cw.get("windspeed", 0), 1)
    # 大风升级
    if level < 2 and wind >= 60:
        level = 2
        cond = cond + "（大风 %.0f km/h）" % wind
    elif level < 1 and wind >= 40:
        level = 1
    severe = level >= 2
    severeReason = ""
    if severe:
        reasons = []
        if level == 2 and code in (65, 66, 67, 73, 75, 77, 82, 85, 86, 95, 96, 99):
            reasons.append(cond)
        if wind >= 60:
            reasons.append("风速 %.0f km/h" % wind)
        severeReason = "、".join(reasons) or cond
    return {
        "ok": True, "city": city, "temp": cw.get("temperature"),
        "wind": wind, "code": code, "condition": cond,
        "level": level, "severe": severe, "severeReason": severeReason,
        "time": cw.get("time"),
    }

class Handler(BaseHTTPRequestHandler):
    def _send(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_OPTIONS(self):
        self._send({}, 200)
    def do_GET(self):
        if self.path.startswith("/weather"):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            city = (q.get("city") or [""])[0]
            self._send(fetch_weather(city))
        else:
            self._send({"ok": False, "error": "not found"}, 404)
    def log_message(self, fmt, *args):
        pass

if __name__ == "__main__":
    print("天气代理服务已启动: http://localhost:%d/weather?city=北京" % PORT)
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
