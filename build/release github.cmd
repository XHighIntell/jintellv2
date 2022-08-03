@echo off

node "build.js" -action:release -input:"../output/production/*" -version:%RELEASE_VERSION% -token:%GITHUB_TOKEN%

pause