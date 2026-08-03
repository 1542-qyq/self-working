@echo off
chcp 65001 >nul
title 创建桌面快捷方式

set "TARGET=%~dp0启动桌面工作台.bat"
set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT=%DESKTOP%\猫咪生活报.lnk"

powershell -command "$s = (New-Object -com WScript.Shell).CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = '喵喵编辑部 · 猫咪生活报'; $s.Save()"

if exist "%SHORTCUT%" (
    echo 快捷方式已创建: %SHORTCUT%
    echo.
    echo 现在可以在桌面双击 "猫咪生活报" 图标启动应用
) else (
    echo 创建失败，请手动右键 "启动桌面工作台.bat" -^> 发送到 -^> 桌面快捷方式
)

pause