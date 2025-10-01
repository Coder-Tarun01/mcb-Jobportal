@echo off
echo Resetting backend database and restarting...

cd api

echo Deleting old database...
if exist database.sqlite del database.sqlite

echo Installing dependencies...
npm install

echo Starting backend with new model...
npm run dev

pause
