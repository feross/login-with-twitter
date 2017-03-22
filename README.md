# login-with-twitter [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/feross/login-with-twitter/master.svg
[travis-url]: https://travis-ci.org/feross/login-with-twitter
[npm-image]: https://img.shields.io/npm/v/login-with-twitter.svg
[npm-url]: https://npmjs.org/package/login-with-twitter
[downloads-image]: https://img.shields.io/npm/dm/login-with-twitter.svg
[downloads-url]: https://npmjs.org/package/login-with-twitter
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

### Login with Twitter. OAuth without the nonsense.

## Features

This module is designed to be the lightest possible wrapper on Twitter OAuth.

All this in < 100 lines of code.

## install

```
npm install login-with-twitter
```

## usage

Set up two routes on your web sever. We'll call them `/twitter` and
`/twitter/callback` but they can be named anything.

Initialize this module:

```js
const LoginWithTwitter = require('login-with-twitter')

const tw = LoginWithTwitter({
  consumerKey: '<your consumer key>',
  consumerSecret: '<your consumer secret>',
  callbackUrl: 'https://example.com/twitter/callback'
})
```

## TODO

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
