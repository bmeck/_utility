var ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , sys = require('sys')
//Triggers
//  !get key
//  !set key value
module.exports = function (system,interfaces,systemClosure) {
  //Make sure we have persistance
  if(!interfaces['Persistance']) {
    var persistance = require('./Persistance').apply(this,arguments)
  }
  var oldHook = interfaces['IRCClient'].hooks.preInit
  interfaces['IRCClient'].hooks.preInit=function(obj,closures,args){
    oldHook.apply(this,arguments)
    var persistance = closures['Persistance']
    var persistanceStore = persistance.select('VariableStore')
    var triggers = closures['Triggers'];
    if(triggers) {
      triggers.register('set',function(source,destination,privacy,input){
        var args = ArgumentHelper(1,input) //grab first and trail
        if(args) {
          if(args[1]) {
            persistanceStore.update(args[0],args[1])
          }
          else {
            persistanceStore.remove(args[0])
          }
        }
      })
      triggers.register('get',function(source,destination,privacy,input){
        var args = ArgumentHelper(1,input) //grab first
        if(args) {
          var value = persistanceStore.retrieve(args[0],function(err,value){
            if(value) closures['IRCClient'].say(destination,value)
          })
        }
      })
    }
  }
}
