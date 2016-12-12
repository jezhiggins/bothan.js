## hint-hint

A module that produces TAP output for JSHint. *hint hint*

[![Build Status](https://travis-ci.org/diy/hint-hint.png?branch=master)](https://travis-ci.org/diy/hint-hint)

[![NPM](https://nodei.co/npm/hint-hint.png)](https://nodei.co/npm/hint-hint/)

### Usage

```js
var hinthint = require('hint-hint');

hinthint('file/path/*.js', config)
```

The `hinthint` function supports splats. All strings are regarded as file paths, objects are regarded as [JSHint configurations](http://www.jshint.com/docs/config/). As well, if a `.jshintrc` file is present in the current working directory, it will extend the config from that.