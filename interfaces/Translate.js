var postHook = require('../utils/Hooking').postHook
  , sys = require('sys')
  , ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , ArgumentScrub = require('../utils/Arguments').ArgumentScrub
  , translate = require('translate')

module.exports = function(system,interfaces,systemClosures) {
  postHook(interfaces,'IRCClient',function(obj,closures){
    var triggers = closures['Triggers'];
    triggers.register("translate",function(source,destination,privacy,input){
      if(!input) return
      input = input.trim()
      var args=ArgumentHelper(1,input)
      if(args[1]) {
        var langs=args[0].split(':')
        translate.text({
            input:langs.length>1?ArgumentScrub(langs.shift()):false
            ,output:ArgumentScrub(langs[0])
          },ArgumentScrub(args[1]),function(translatedText){
            obj.say(destination,translatedText)
          }
        )
      }
      else {
        translate.text({
          input:false
          ,output:'English'
        },ArgumentScrub(input),function(translatedText){
          obj.say(destination,translatedText)
        })
      }
    })
  })
}
