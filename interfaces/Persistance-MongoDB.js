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
  , fs = require('fs')
  , path = require('path')
  , mongo = require('mongodb')

module.exports = function(host,port) {
host = host || (process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost');
port = port || (process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : mongo.Connection.DEFAULT_PORT);

return function (system,interfaces,systemClosure) {
  interfaces['Persistance'] = {
    properties: {
      select: function(object,closures,args) {
        return {value:function(databaseName,callback) {
        	var db_file = path.join(process.cwd(),'dbs',databaseName,databaseName+".json")
            //grab old or just make a new one
            //Since we are using a memory store no need for more itnerfaces, just use a closure
            var db = closures['Persistance.interface'][databaseName]
            if(!db) {
            closures['Persistance.store'][databaseName] = {}
            db = closures['Persistance.interface'][databaseName] = {
                    create: function(key,value,callback) {
                      var result = (closures['Persistance.store'][databaseName][key] = value)
                      fs.writeFile(
                        db_file
                        , JSON.stringify(closures['Persistance.store'][databaseName])
                        , function(err){sys.puts(err)}
                      )
                      if(callback) callback(false,result)
                    }
                    , remove: function(key,callback) {
                      var result = (delete closures['Persistance.store'][databaseName][key])
                      fs.writeFile(db_file,JSON.stringify(closures['Persistance.store'][databaseName])
                        , function(err){sys.puts(err)})
                      if(callback) callback(false,result)
                    }
                    , retrieve: function(key,callback) {
                      var result = (closures['Persistance.store'][databaseName][key])
                      if(callback) callback(false,result)
                    }
                    //same as create since its just a flat memory store
                    , update: function(key,value,callback) {
                      var result = (closures['Persistance.store'][databaseName][key] = value)
                      //sys.puts("update::"+key,sys.inspect(value))
                      fs.writeFile(db_file,JSON.stringify(closures['Persistance.store'][databaseName])
                        , function(err){sys.puts(err)})
                      if(callback) callback(false,result)
                    }
                    , keys: function(callback) {
					  if(callback) callback(false,Object.keys(closures['Persistance.store'][databaseName]));
                    }
                  }
              fs.readFile(db_file,function(err,data) {
              	if (data) {
              	  data = Function("return "+data)()
              	  for(var key in data) {
					db.update(key,data[key])
              	  }
              	  sys.puts(sys.inspect(data))
                  callback(null, db)
              	  return
              	}
				fs.writeFile(
				  db_file
				  , JSON.stringify(closures['Persistance.store'][databaseName])
				  , function(err,db){callback(err, db)}
				)
              }
            )
            return
            }
            callback(null, db)
            }
          }
        }
    }
    , hooks: {
      preInit: function(object,closures) {
        closures['Persistance.store'] = {}
        closures['Persistance.interface'] = {}
      }
    }
  }
  postHook(interfaces,'IRCClient',
    function(obj,closures,args) {
      closures['Persistance'] = system.create('Persistance')
    }
  )
}
