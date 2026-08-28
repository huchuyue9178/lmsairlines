@echo off
rem ============================================================
rem  老牧师航空 一键启动脚本（Windows）
rem  双击运行即可。功能：启动 天气代理(9100) + 网站(8931)
rem ============================================================
chcp 65001 >nul
cd /d %~dp0
echo ============================================================
echo   老牧师航空 一键启动
echo ============================================================

where python >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 python，请先安装 Python 3 并勾选 "Add to PATH"
  pause
  exit /b 1
)

rem ---- 1. 天气代理（端口 9100）----
curl -s -m 2 "http://localhost:9100/weather?city=%%E5%%8C%%97%%E4%%BA%%AC" 2>nul | findstr /C:"\"ok\": true" >nul 2>nul
if not errorlevel 1 (
  echo [天气代理] 已在运行 ^(端口 9100^)
) else (
  start "weather" /min python weather_server.py
  echo [天气代理] 已启动 ^(端口 9100^)
)

rem ---- 2. 网站服务器（端口 8931）----
curl -s -o nul -m 2 "http://localhost:8931/booking.html" 2>nul
if not errorlevel 1 (
  echo [网站服务器] 已在运行 ^(端口 8931^)
) else (
  start "lmsairlines" /min python -m http.server 8931
  echo [网站服务器] 已启动 ^(端口 8931^)
)

echo.
echo ============================================================
echo   网站已就绪，请在浏览器打开：
echo   http://localhost:8931/booking.html
echo ============================================================
pause
