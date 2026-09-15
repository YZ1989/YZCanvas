@echo off
cd /d "%~dp0"
node scripts\start-preview.cjs
if errorlevel 1 pause
