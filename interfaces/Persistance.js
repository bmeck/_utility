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
var postHook = require('../utils/Hooking').postHook
  , sys = require('sys')

module.exports = function (system,interfaces,systemClosure) {
  interfaces['Persistance'] = {
    properties: {
      select: function(object,closures,args) {
        return {value:function(databaseName,callback) {
        sys.puts(1)
            //grab old or just make a new one
            //Since we are using a memory store no need for more itnerfaces, just use a closure
            var db=closures['Persistance.store'][databaseName]
            if(!db) db = closures['Persistance.store'][databaseName] = {
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
            }
            callback(null, db)
          }}
        }
    }
    , hooks: {
      preInit: function(object,closures) {
        closures['Persistance.store'] = {}
      }
    }
  }
  postHook(interfaces,'IRCClient',
    function(obj,closures,args) {
      closures['Persistance'] = system.create('Persistance')
    }
  )
}
