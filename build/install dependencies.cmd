@echo off

mkdir c:\node
cd /d c:\node

call npm install @babel/core
call npm install @babel/preset-env
call npm install uglify-js
call npm install intell-node
call npm install axios

pause