var ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , sys = require('sys')
//Permissions
//
//Invokes IRCClient instance closure ['Persistance'] (db=Permissions)
//Produces an IRCClient instance closure ['Permissions']
////closure['Permissions']
////  .grant(amdmin,user,privilege) - admin attempts to give user privilege
////  .revoke(amdmin,user,privilege) - admin attempts to revoke user privilege
////  .test(user,privilege) - test is user has a privilege
////
////Triggers
////  !grant user privilege
////  !revoke user privilege
module.exports = function (system,interfaces,systemClosure) {
  //Make sure we have persistance
  if(!interfaces['Persistance']) {
    var persistance = require('./Persistance').apply(this,arguments)
  }
  var oldHook = interfaces['IRCClient'].hooks.preInit
  interfaces['IRCClient'].hooks.preInit=function(obj,closures,args){
    oldHook.apply(this,arguments)
    var persistance = closures['Persistance']
      , persistanceStore = persistance.select('Permissions')
        || persistance.create('Permissions',{})
      , _permissions = null // used so we can refrence it in a sec
      , _permissions = closures['Permissions'] = {
      'grant': function(admin,user,right) {
        right = right.toLowerCase()
        var adminPermissions = persistanceStore[admin]
        //give the rights if admin has grant, only give out root if admin has root
        if(adminPermissions && _permissions.test(admin,'grant')
        && (right !== 'root' || _permissions.test(admin,'root'))) {
          var userPermissions = permissions[user]
          userPermissions[right] = true;
          persistanceStore.update(user,userPermissions)
        }
      },
      'revoke': function(admin,user,right) {
        right = right.toLowerCase()
        var adminPermissions = persistanceStore[admin]
        //give the rights if admin has grant, only give out root if admin has root
        if(adminPermissions && _permissions.test(admin,'grant')
        && (right !== 'root' || _permissions.test(admin,'root'))) {
          var userPermissions = permissions[user]
          delete userPermissions[right];
          persistanceStore.update(user,userPermissions)
        }
      },
      'test': function(user,right) {
        right = right.toLowerCase()
        var userPermissions = persistanceStore[user]
        return right in userPermissions
      }
    }
    var triggers = closures['Triggers'];
    if(triggers) {
      triggers.register('grant',function(source,destination,privacy,input){
        var args = ArgumentHelper.grab(2,input) //grab first 2 and trail
        if(args) {
          closures['Permissions'].grant(source,args[0],args[1])
        }
      })
      triggers.register('revoke',function(source,destination,privacy,input){
        var args = ArgumentHelper.grab(2,input) //grab first 2 and trail
        if(args) {
          closures['Permissions'].revoke(source,args[0],args[1])
        }
      })
    }
  }
}
