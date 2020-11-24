/*! login-with-twitter. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
const crypto = require('crypto')
const get = require('simple-get')
const OAuth = require('oauth-1.0a')
const querystring = require('querystring')

const TW_REQ_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
const TW_AUTH_URL = 'https://api.twitter.com/oauth/authenticate'
const TW_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'

class LoginWithTwitter {
  constructor (opts) {
    // Check that required options exist
    if (!opts.consumerKey || typeof opts.consumerKey !== 'string') {
      throw new Error('Invalid or missing `consumerKey` option')
    }
    if (!opts.consumerSecret || typeof opts.consumerSecret !== 'string') {
      throw new Error('Invalid or missing `consumerSecret` option')
    }
    if (!opts.callbackUrl || typeof opts.callbackUrl !== 'string') {
      throw new Error('Invalid or missing `callbackUrl` option')
    }

    this.consumerKey = opts.consumerKey
    this.consumerSecret = opts.consumerSecret
    this.callbackUrl = opts.callbackUrl

    this._oauth = OAuth({
      consumer: {
        key: this.consumerKey,
        secret: this.consumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) => {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      }
    })
  }

  login (cb) {
    // Check that required params exist
    if (typeof cb !== 'function') {
      throw new Error('Invalid or missing `cb` parameter for login method')
    }

    const requestData = {
      url: TW_REQ_TOKEN_URL,
      method: 'POST',
      data: {
        oauth_callback: this.callbackUrl
      }
    }

    // Get a "request token"
    get.concat({
      url: requestData.url,
      method: requestData.method,
      form: requestData.data,
      headers: this._oauth.toHeader(this._oauth.authorize(requestData))
    }, (err, res, data) => {
      if (err) return cb(err)

      const {
        oauth_token: token,
        oauth_token_secret: tokenSecret,
        oauth_callback_confirmed: callbackConfirmed
      } = querystring.parse(data.toString())

      // Must validate that this param exists, according to Twitter docs
      if (callbackConfirmed !== 'true') {
        return cb(new Error('Missing `oauth_callback_confirmed` parameter in response (is the callback URL approved for this client application?)'))
      }

      // Redirect visitor to this URL to authorize the app
      const url = `${TW_AUTH_URL}?${querystring.stringify({ oauth_token: token })}`

      cb(null, tokenSecret, url)
    })
  }

  callback (params, tokenSecret, cb) {
    const {
      oauth_token: token,
      oauth_verifier: verifier
    } = params

    // Check that required params exist
    if (typeof cb !== 'function') {
      throw new Error('Invalid or missing `cb` parameter for callback method')
    }
    if (typeof params.denied === 'string' && params.denied.length > 0) {
      const err = new Error('User denied login permission')
      err.code = 'USER_DENIED'
      return cb(err)
    }
    if (typeof params.oauth_token !== 'string' || params.oauth_token.length === 0) {
      return cb(new Error('Invalid or missing `oauth_token` parameter for login callback'))
    }
    if (typeof params.oauth_verifier !== 'string' || params.oauth_verifier.length === 0) {
      return cb(new Error('Invalid or missing `oauth_verifier` parameter for login callback'))
    }
    if (typeof tokenSecret !== 'string' || tokenSecret.length === 0) {
      return cb(new Error('Invalid or missing `tokenSecret` argument for login callback'))
    }

    const requestData = {
      url: TW_ACCESS_TOKEN_URL,
      method: 'POST',
      data: {
        oauth_token: token,
        oauth_token_secret: tokenSecret,
        oauth_verifier: verifier
      }
    }

    // Get a user "access token" and "access token secret"
    get.concat({
      url: requestData.url,
      method: requestData.method,
      form: requestData.data,
      headers: this._oauth.toHeader(this._oauth.authorize(requestData))
    }, (err, res, data) => {
      if (err) return cb(err)

      // Ready to make signed requests on behalf of the user
      const {
        oauth_token: userToken,
        oauth_token_secret: userTokenSecret,
        screen_name: userName,
        user_id: userId
      } = querystring.parse(data.toString())

      cb(null, {
        userName,
        userId,
        userToken,
        userTokenSecret
      })
    })
  }
}

module.exports = LoginWithTwitter
