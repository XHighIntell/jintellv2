
# jintellv2
jIntell is a JavaScript library designed to simplify using many controls while writing projects. This project is a part of X High Intell for private use only, so updates or modifiers can change the whole structure.

## Document
You can find more documents & examples at [xhighintell.github.io/jintellv2](https://xhighintell.github.io/jintellv2)

## Build
Our target environment is web platform, we have written build commands for development and production in `build` folder:

1. `build development.cmd` build without minifing and source map.
2. `build production.cmd` include minify file and source map.


In order to run the build commands, you need to install NodeJs with the following components:

- [x] npm install @babel/core
- [x] npm install @babel/preset-env
- [x] npm install uglify-js
- [x] npm install intell-node