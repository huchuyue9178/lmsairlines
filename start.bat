@echo off
rem ============================================================
rem  老牧师航空 一键启动脚本（Windows）
rem  双击运行即可。功能：启动网站服务器（端口 8931）
rem  天气为前端模拟随机天气，无需额外服务。
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

rem ---- 网站服务器（端口 8931）----
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
