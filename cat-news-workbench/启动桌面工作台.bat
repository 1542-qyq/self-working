@echo off
chcp 65001 >nul
title 猫咪生活报 · 桌面工作台

set "APP=%~dp0"
set "HTML=%APP%workbench-desktop.html"
set "URL=file:///%HTML: =\%%"

REM 尝试找到 Chrome 或 Edge
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

set "EDGE="
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined EDGE if exist "%LocalAppData%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%LocalAppData%\Microsoft\Edge\Application\msedge.exe"

if defined CHROME (
    start "" "%CHROME%" --app="%URL%" --window-size=1280,800
) else if defined EDGE (
    start "" "%EDGE%" --app="%URL%" --window-size=1280,800
) else (
    start "" "%URL%"
)

exit