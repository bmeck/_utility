var sys=require('sys')
//TODO Make this an interface

//Persistance - In memory datastore compliant API 
//
//Produces IRCClient instance closure ['Persistance']
////closure['Persistance']
////  .select(dbname,callback(err,db)) - grabs a database
////
////db
////  .create(key,value,callback(error,value))
////  .remove(key,callback(error,bool success))
////  .retrieve(key,callback(error,value))
////  .update(key,value,callback(error,value))
module.exports = function (system,interfaces,systemClosure) {
  var oldHook = interfaces['IRCClient'].hooks.preInit
  interfaces['IRCClient'] = {
    hooks: {
      preInit: function(obj,closures,args) {
        oldHook.apply(this,arguments)
        closures['Persistance.store'] = {}
        closures['Persistance'] = {
          select: function(databaseName,callback) {
            //grab old or just make a new one
            callback(null, closures['Persistance.store'][databaseName] ||
            (closures['Persistance.store'][databaseName] = {
              create: function(key,value,callback) {
                var result = (closures['Persistance.store'][databaseName][key] = value)
                if(callback) callback(false,result)
              }
              , remove: function(key,callback) {
                var result = (delete closures['Persistance.store'][databaseName][key])
                if(callback) callback(false,result)
              }
              , retrieve: function(key,callback) {
                var result = (closures['Persistance.store'][databaseName][key])
                if(callback) callback(false,result)
              }
              //same as create since its just a flat memory store
              , update: function(key,value,callback) {
                var result = (closures['Persistance.store'][databaseName][key] = value)
                if(callback) callback(false,result)
              }
            }))
          }
        }
      }
    }
  }
}
