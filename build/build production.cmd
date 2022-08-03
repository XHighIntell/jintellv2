@echo off

node "build.js" -action:build -mode:production -input:"../src" -output:"../output/production"

pause