declare module "login-with-twitter" {
  export default class LoginWithTwitter {
    constructor(opts: {
      consumerKey: string;
      consumerSecret: string;
      callbackUrl: string;
    });
    public login(
      cb: (err: Error | null, tokenSecret: string, url: string) => void
    ): void;
    public callback(
      params: { oauth_token: string; oauth_verifier: string },
      tokenSecret: string,
      cb: (
        err: Error | null,
        details: {
          userName: string;
          userId: string;
          userToken: string;
          userTokenSecret: string;
        }
      ) => void
    ): void;
  }
}
