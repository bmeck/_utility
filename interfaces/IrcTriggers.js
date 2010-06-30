var postHook = require('../utils/Hooking').postHook
  , sys = require('sys')
  , ArgumentHelper = require('../utils/Arguments').ArgumentHelper

module.exports = function(system,interfaces,systemClosures) {
  postHook(interfaces,'IRCClient',function(obj,closures){
    var triggers = closures['Triggers'];
    triggers.register("join",function(source,destination,privacy,input){
      input = input.trim()
      sys.puts('"'+input+'"')
      var permissions = closures['Permissions']
      if(!permissions) obj.join(input)
      else permissions.test(source,'irc',function(err,hasPermission) {
      	if(err) {sys.puts(err); return;}
      	if(hasPermission) obj.join(input)
      })
    })
    triggers.register("leave",function(source,destination,privacy,input){
      input = input.trim()
      var permissions = closures['Permissions']
      if(!permissions) obj.part(input)
      else permissions.test(source,'irc',function(err,hasPermission) {
      	if(err) {sys.puts(err); return;}
      	if(hasPermission) obj.part(input)
      })
    })
    triggers.register("nick",function(source,destination,privacy,input){
      var permissions = closures['Permissions']
      input = input.trim()
      if(!permissions) obj.send("NICK", input);
      else permissions.test(source,'irc',function(err,hasPermission) {
      	if(err) {sys.puts(err); return;}
      	if(hasPermission) obj.send("NICK", input);
      })
    })
    triggers.register("msg",function(source,destination,privacy,input){
      var permissions = closures['Permissions']
      var args = ArgumentHelper(1,input)
      if(!permissions) obj.say(args[0],args[1])
      else permissions.test(source,'irc',function(err,hasPermission) {
      	if(err) {sys.puts(err); return;}
      	if(hasPermission) obj.say(args[0],args[1])
      })
    })
  })
}