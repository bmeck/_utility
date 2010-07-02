var postHook = require('../utils/Hooking').postHook
  , sys = require('sys')
  , translate = require('translate')
  , ArgumentHelper = require('../utils/Arguments').ArgumentHelper
module.exports = function(oauth_key,oauth_secret){return function(system,interfaces,systemClosures) {
  postHook(interfaces,'IRCClient',function(obj,closures){
    var triggers = closures['Triggers'];
    var twitter = closures['Twitter'] = system.create("Twitter",oauth_key,oauth_secret)
    sys.puts("Logging into twitter")
    twitter.login()
    sys.puts("Login now")
    triggers.register("tweet",function(source,destination,privacy,input){
      var suffix = " --"+source
      while(input) {
        var tweettext;
        if(input.length>138-suffix.length) {
          tweettext = '"'+input.slice(0,136-suffix.length)+'"..'+suffix
          input=input.slice(136-suffix.length)
        }
        else {
          tweettext = '"'+input.slice(0,138-suffix.length)+'"'+suffix
          input=input.slice(138-suffix.length)
        }
        sys.puts('TWEETTEXT::::'+tweettext,'LENGTH::::'+tweettext.length)
        var permissions = closures['Permissions']
        if(!permissions) twitter.tweet(tweettext)
        else permissions.test(source,'voice',function(err,hasPermission) {
          if(err) {sys.puts(err); return;}
          if(hasPermission) twitter.tweet(tweettext)
        })
      }
    })
    triggers.register("tweet-translate",function(source,destination,privacy,input){
      input = input.trim()
      var args=ArgumentHelper(1,input)
      if(args) {
        var langs=args[0].split('-')
        translate.text({
            input:langs.length>1?langs.shift():'english'
            ,output:langs[0]
          },input,function(translatedText){
            var suffix = " --"+source
            while(translatedText) {
              var tweettext;
              if(translatedText.length>138-suffix.length) {
                tweettext = '"'+translatedText.slice(0,136-suffix.length)+'"..'+suffix
                translatedText=translatedText.slice(136-suffix.length)
              }
              else {
                tweettext = '"'+translatedText.slice(0,138-suffix.length)+'"'+suffix
                translatedText=translatedText.slice(138-suffix.length)
              }
              sys.puts('TWEETTEXT::::'+tweettext,'LENGTH::::'+tweettext.length)
              var permissions = closures['Permissions']
              if(!permissions) twitter.tweet(tweettext)
              else permissions.test(source,'voice',function(err,hasPermission) {
                if(err) {sys.puts(err); return;}
                if(hasPermission) twitter.tweet(tweettext)
              })
            }
          }
        )
      }
    })
  })
}}