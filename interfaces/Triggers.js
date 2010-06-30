var ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , sys = require('sys')
  , postHook = require('../utils/Hooking').postHook
//Triggers
//
//Gives IRCClient an instance closure['Triggers']
////  closure['Triggers'].register(
////    string cmd
////    , callback(string source,string destination,enum('private_msg','channel') privacy,string message)
////  )

module.exports = function(triggerChar) {
    return function (system,interfaces,systemClosure) {
      //Make sure we have persistance
      if(!interfaces['Persistance']) {
        var persistance = require('./Persistance').apply(this,arguments)
      }
      postHook(interfaces,'IRCClient',function(obj,closures,args){
        //sys.puts('HOOKING IN TRIGGERS')
        closures["Triggers.store"] = {}
        closures["Triggers"] = {
          register: function(command,callback) {
            sys.puts('registered trigger '+command)
            closures["Triggers.store"][command]=callback
          }
        }
        closures['IRCClient'].addListener('message',function (from, to, message) {
          var client = closures['IRCClient']
          var privacy = to === client.nick ? "private_msg" : "channel"
          var destination=privacy==="private_msg" ? from : to
          if(message.charAt(0)===triggerChar) {
            var command=ArgumentHelper(1,message.slice(1))
            if(command) {
            var handler = closures["Triggers.store"][command[0]]
            if (handler) {
              //Handlers should check permissions
              handler(from,destination,privacy,command[1])
            }
          }
        }
      })
  })
}}

