#!/usr/bin/env bash
# ============================================================
# 老牧师航空 一键启动脚本（Linux / macOS）
# 用法：
#   首次使用先授权：chmod +x start.sh
#   然后运行：      ./start.sh
# 功能：自动启动网站服务器（端口 8931），已运行时自动跳过。
#       天气为前端模拟随机天气，无需额外服务。
# ============================================================
cd "$(dirname "$0")"

command -v python3 >/dev/null 2>&1 || { echo "[错误] 未检测到 python3，请先安装 Python 3"; exit 1; }

# ---- 网站服务器（端口 8931）----
if curl -s -o /dev/null -m 2 "http://localhost:8931/booking.html" 2>/dev/null; then
  echo "[网站服务器] 已在运行（端口 8931）"
else
  nohup python3 -m http.server 8931 > /tmp/lmsairlines_http.log 2>&1 &
  echo "[网站服务器] 已启动（端口 8931）日志: /tmp/lmsairlines_http.log"
fi

sleep 1
echo ""
echo "=========================================================="
echo "  网站已就绪，请在浏览器打开："
echo "  http://localhost:8931/booking.html"
echo "=========================================================="
