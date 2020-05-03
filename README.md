# PostCSS Clamp
[![Build Status][ci-img]][ci] [![codecov.io][cov-img]][cov]

[PostCSS] plugin to transform `clamp()` to combination of `min/max`.

[PostCSS]:    https://github.com/postcss/postcss
[ci-img]:     https://travis-ci.org/polemius/postcss-clamp.svg
[ci]:         https://travis-ci.org/polemius/postcss-clamp
[cov-img]: https://codecov.io/github/polemius/postcss-clamp/coverage.svg?branch=master
[cov]:        https://codecov.io/github/polemius/postcss-clamp?branch=master


## Instalation

```
$ npm install postcss-clamp
```

## Usage

The plugin make all colors more bright.

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorRgbaFallback = require("postcss-clamp")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(colorRgbaFallback())
  .process(css)
  .css
```

Using this `input.css`:

```css
.foo {
  width: clamp(10px, 64px, 80px);
}
```

you will get:

```css
.foo {
  width: width: max(10px, min(64px, 80px));
}
```

See [PostCSS] docs for examples for your environment.

## LICENSE

See [LICENSE](LICENSE)

