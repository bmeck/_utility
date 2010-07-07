//NON_FUNCTIONAL

//Exposes a ['Twitter'] interface

//Twitter(oauth_token , oauth_token_secret)
//  .login() - initiate a loging request, requires you to head over to browser to grab a pin
//  .tweet(string message)
var OAuth= require('oauth/oauth').OAuth
  , postHook = require('../utils/Hooking').postHook
  , sys = require('sys')
  , ArgumentHelper = require('../utils/Arguments').ArgumentHelper

module.exports = function(system,interfaces,systemClosures) {
  interfaces['Twitter'] = {
    properties: {
      login: function(obj,closures){return {value:function() {
        var oa = closures['OAuth'];
        //Auth Request
        oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	          if(error) sys.puts('error :' + error)
	          else {
	            sys.puts('oauth_token :' + oauth_token)
	            sys.puts('oauth_token_secret :' + oauth_token_secret)
	            sys.puts('requestoken results :' + sys.inspect(results))
	            sys.puts("Requesting access token")
	            sys.puts("GOTO::https://twitter.com/oauth/authorize?oauth_token="+oauth_token)
	         }
		   var stdin = process.stdin || process.openStdin()
           stdin.addListener('data',function(pin){
            //User grants pin number
	           oa.getOauthAccessToken(oauth_token, oauth_token_secret, pin.toString().trim(), function(error, oauth_access_token, oauth_access_token_secret, results2) {
	           sys.puts('oauth_access_token :' + oauth_access_token)
	           sys.puts('oauth_token_secret :' + oauth_access_token_secret)
	           sys.puts('accesstoken results :' + sys.inspect(results2))
	           sys.puts("Requesting access token")
	           closures['OAuth.access_token']=oauth_access_token;
	           closures['OAuth.access_token_secret']=oauth_access_token_secret;
	         });
         })
        })}
      }},
      tweet: function(obj,closures) { return {value:function(msg) {
        var oa = closures['OAuth'];
        oa.getProtectedResource(
          "http://api.twitter.com/1/statuses/update.json?status="+encodeURIComponent(msg)
          , "POST"
          , closures['OAuth.access_token']
          , closures['OAuth.access_token_secret'], function (error, data, response) {
	        //sys.puts(data);
	       if(error) {
	          sys.puts("ERROR::"+error)
	        }
        });
      }}}
    }
    , hooks: {
      preInit: function(object,closures,args) {
        var oauth_token = args[0]
          , oauth_token_secret = args[1]
        closures['OAuth'] = new OAuth("https://twitter.com/oauth/request_token",
                  "https://twitter.com/oauth/access_token",
                  oauth_token,
                  oauth_token_secret,
                  "1.0",
                  null,
                  "HMAC-SHA1")
      }
    }
  }
}
