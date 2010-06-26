//NON_FUNCTIONAL

var mongodb = require("mongodb-native");

function (dbname,dbaddress,dbport) {
var client = new Db(dbname, new Server(dbaddress || "127.0.0.1", dbport || 27017, {}));
client.open(function(p_client) {
      client.createCollection('test_insert', function(err, collection) {
        client.collection('test_insert', function(err, collection) {
          for(var i = 1; i < 1000; i++) {
            collection.insert({c:1}, function(err, docs) {});
          }
           collection.insert({a:2}, function(err, docs) {
             collection.insert({a:3}, function(err, docs) {
               collection.count(function(err, count) {
               test.assertEquals(1001, count);
               // Locate all the entries using find
               collection.find(function(err, cursor) {
                  cursor.toArray(function(err, results) {
                    test.assertEquals(1001, results.length);
                    test.assertTrue(results[0] != null);
                    // Let's close the db
                    client.close();
                   });
                 });
               });
             });
           });
         });
     });
});
}

module.exports = function (system,interfaces,systemClosure) {
  interfaces['Persistance'] = {
    hooks: {
      preInit: function(obj,closures,args) {
        closures['Persistance.store'] = {}
        closures['Persistance'] = {
          select: function(databaseName) {
            //grab old or just make a new one
            return closures['Persistance.store'][databaseName] ||
            {
              create: function(key,value) {
                return closures['Persistance.store'][databaseName][key] = value
              }
              , remove: function(key) {
                return delete closures['Persistance.store'][databaseName][key]
              }
              , retrieve: function(key) {
                return closures['Persistance.store'][databaseName][key]
              }
              //same as create since its just a flat memory store
              , update: function(key,value) {
                return closures['Persistance.store'][databaseName][key] = value
              }
            }
          }
        }
      }
    }
  }
}
