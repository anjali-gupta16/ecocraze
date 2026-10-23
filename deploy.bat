@echo off
echo ========================================================
echo   Ecocraze: Auto Push to GitHub & Deploy to Vercel
echo ========================================================
echo.
echo 1. Staging all changed files...
git add -A

echo 2. Committing changes...
git commit -m "auto update: %date% %time%"

echo 3. Pushing to GitHub (main branch)...
git push origin main

echo.
echo ========================================================
echo   [SUCCESS] Pushed to GitHub!
echo   Vercel automatically builds and deploys your changes.
echo   Check status at: https://ecocraze.vercel.app
echo ========================================================
echo.
pause
