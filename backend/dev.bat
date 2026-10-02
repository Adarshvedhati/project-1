@echo off
REM One-click local start for Windows. Run from the backend folder:  dev.bat
if not exist .env copy .env.example .env >nul
py manage.py migrate
py manage.py seed_demo --demo-users
py manage.py runserver
