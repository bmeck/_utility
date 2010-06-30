var ArgumentHelper = require('../utils/Arguments').ArgumentHelper
  , sys = require('sys')
  , postHook = require('../utils/Hooking').postHook
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
var postHook = require('../utils/Hooking').postHook
var errorCheck = function(err) { if(err) {sys.puts('err',err); return true;} return false }
module.exports = function (system,interfaces,systemClosure) {
  //Make sure we have persistance
  if(!interfaces['Persistance']) {
    var persistance = require('./Persistance').apply(this,arguments)
  }
  postHook(interfaces,'IRCClient',function(obj,closures,args){
    var persistance = closures['Persistance']
      , persistanceStore = persistance.select('Permissions',function(err,db){
        var _permissions = null // used so we can refrence it in a sec
      , _permissions = closures['Permissions'] = {
        'grant': function(admin,user,right,callback) {
          var end = function(err){if(callback) callback(err)}
          right = right.toLowerCase()
          //give the rights if admin has grant, only give out root if admin has root
          var required = right=='root'?'root':'grant'
          _permissions.test(admin,required,function(err,hasPermission) {
            if(errorCheck(err)) return end(err)
            if(hasPermission) {
              db.retrieve(user,function(err,userPermissions){
                if(errorCheck(err)) return end(err)
                if(typeof userPermissions === 'undefined') {
                  var rights = {}
                  rights[right] = true
                  db.create(user,rights,function(err){errorCheck(err);return end(err)})
				  return
                }
 				  userPermissions[right] = true;
				  db.update(user,userPermissions,function(err){errorCheck(err);return end(err)})
              })
            }
          })
        },
        'revoke': function(admin,user,right,callback) {
          var end = function(err){if(callback) callback(err)}
          right = right.toLowerCase()
          //give the rights if admin has grant, only give out root if admin has root
          var required = right=='root'?'root':'grant'
          _permissions.test(admin,required,function(err,hasPermission) {
            if(errorCheck(err)) return end(err)
            if(hasPermission) {
              db.retrieve(user,function(err,userPermissions){
                if(errorCheck(err)) return end(err)
                if(typeof userPermissions === 'undefined') {
				  return
                }
 				  delete userPermissions[right];
				  db.update(user,userPermissions,function(err){errorCheck(err);return end(err)})
              })
            }
          })
        },
        'test': function(user,right,callback) {
          right = right.toLowerCase()
          db.retrieve(user,function(err,document){
			  callback(err, document && (right in document || 'root' in document))
          })
        }
      }})
    var triggers = closures['Triggers'];
    if(triggers) {
      triggers.register('grant',function(source,destination,privacy,input){
        var args = ArgumentHelper(2,input) //grab first 2 and trail
        if(args) {
          closures['Permissions'].grant(source,args[0],args[1])
        }
      })
      triggers.register('revoke',function(source,destination,privacy,input){
        var args = ArgumentHelper(2,input) //grab first 2 and trail
        if(args) {
          closures['Permissions'].revoke(source,args[0],args[1])
        }
      })
    }
  })
}
