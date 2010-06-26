//NON_FUNCTIONAL
var pin=9830985

var oa= new OAuth("https://twitter.com/oauth/request_token",
                  "https://twitter.com/oauth/access_token",
                  "h5vpDPS2riT1vn4imgPDQw",
                  "7ikegRCnIblG3PG4rMWpT8nk5gQ1MaR2DAZTt9GeDM",
                  "1.0",
                  null,
                  "HMAC-SHA1")
//var stdin = process.openStdin()

var access_token="158885951-swGnRFT7fyJVOdMFAI5KyXfdFaqfcqXVjaW4ylw0"
var access_token_secret="9XBA248WHdfwpgVNd0Q9uaukT1aR0GiKKQj4dyrE7U"

function TwitterRequest(msg) {
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	  if(error) sys.puts('error :' + error)
	  else {
	    sys.puts('oauth_token :' + oauth_token)
	    sys.puts('oauth_token_secret :' + oauth_token_secret)
	    sys.puts('requestoken results :' + sys.inspect(results))
	    sys.puts("Requesting access token")
	    sys.puts("GOTO::https://twitter.com/oauth/authorize?oauth_token="+oauth_token)
	 }
stdin.addListener('data',function(pin){
	TwitterAccess(oauth_token, oauth_token_secret, pin.toString().trim(),msg)
})
})
}
//TwitterRequest("Running...")

function Tweet(msg) {
oa.getProtectedResource("http://api.twitter.com/1/statuses/update.json?status="+encodeURIComponent(msg), "POST", access_token, access_token_secret, function (error, data, response) {
	  //sys.puts(data);
	  if(error) {sys.puts("ERROR::"+error)}
      });
}
function TwitterAccess(oauth_token, oauth_token_secret, pin,msg) {
	    oa.getOauthAccessToken(oauth_token, oauth_token_secret, pin, function(error, oauth_access_token, oauth_access_token_secret, results2) {
	      sys.puts('oauth_access_token :' + oauth_access_token)
	      sys.puts('oauth_token_secret :' + oauth_access_token_secret)
	      sys.puts('accesstoken results :' + sys.inspect(results2))
	      sys.puts("Requesting access token")
	      var data= "";
	      Tweet(msg)
	    });
	  }
