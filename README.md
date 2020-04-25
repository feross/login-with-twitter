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

## Install

```
npm install login-with-twitter
```

## Usage

Set up two routes on your web sever. We'll call them `/twitter` and
`/twitter/callback`, but they can be named anything.

### Initialization
Initialize this module with the consumer key and secret for your Twitter App you created with an Twitter Developer account.

```js
const LoginWithTwitter = require('login-with-twitter')

const tw = new LoginWithTwitter({
  consumerKey: '<your consumer key>',
  consumerSecret: '<your consumer secret>',
  callbackUrl: 'https://example.com/twitter/callback'
})
```

### Login

Call `login` from your `/twitter` route, saving the OAuth `tokenSecret` to use later. In this example, we use the request session (using, for example, [express-session](https://www.npmjs.com/package/express-session)).

```js 
app.get('/twitter', (req, res) => {
  tw.login((err, tokenSecret, url) => {
    if (err) {
      // Handle the error your way
    }
    
    // Save the OAuth token secret for use in your /twitter/callback route
    req.session.tokenSecret = tokenSecret
    
    // Redirect to the /twitter/callback route, with the OAuth responses as query params
    res.redirect(url)
  })
})
```

### Callback

Then, call `callback` from your `/twitter/callback` route. The request will include `oauth_token` and `oauth_verifier` in the URL, accessible with `req.query`. Pass those into `callback`, along with the OAuth `tokenSecret` you saved in the `login` callback above, and a callback that handles a `user` object that this module will return.

```js
app.get('/twitter/callback', (req, res) => {
  tw.callback({
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  }, req.session.tokenSecret, (err, user) => {
    if (err) {
      // Handle the error your way
    }
    
    // Delete the tokenSecret securely
    delete req.session.tokenSecret
    
    // The user object contains 4 key/value pairs, which
    // you should store and use as you need, e.g. with your
    // own calls to Twitter's API, or a Twitter API module
    // like `twitter` or `twit`.
    // user = {
    //   userId,
    //   userName,
    //   userToken,
    //   userTokenSecret
    // }
    req.session.user = user
    
    // Redirect to whatever route that can handle your new Twitter login user details!
    res.redirect('/')
  });
});
```

### Logout
If you want to implement logout, simply delete the `user` object stored in the session.

---

For more information, check out the implementation in [index.js](index.js).

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
