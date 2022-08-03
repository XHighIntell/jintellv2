@echo off

node "build.js" -action:build -mode:development -input:"../src" -output:"../output/development"

pause