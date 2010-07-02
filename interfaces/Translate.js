var postHook = require('../utils/Hooking').postHook
  , sys = require('sys')
  , ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , translate = require('translate')

module.exports = function(system,interfaces,systemClosures) {
  postHook(interfaces,'IRCClient',function(obj,closures){
    var triggers = closures['Triggers'];
    triggers.register("translate",function(source,destination,privacy,input){
      input = input.trim()
      var args=ArgumentHelper(1,input)
      if(args) {
        var langs=args[0].split(':')
        sys.puts(langs)
        translate.text({
            input:langs.length>1?langs.shift():'English'
            ,output:langs[0]
          },args[1],function(translatedText){
            obj.say(destination,translatedText)
          }
        )
      }
    })
  })
}