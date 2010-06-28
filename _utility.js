var System = require('interface').System;

var Irc = require('./interfaces/Irc')
  , Triggers = require('./interfaces/Triggers')
  , Permissions = require('./interfaces/Permissions')
  , VariableStore = require('./interfaces/VariableStore')
  , Twitter = require('./interfaces/Twitter')
var Bot = System([
	Irc
	//, IrcLog //TODO:Port
	, Triggers('!')
	//, MongoDBPersistance //TODO:Port
	, Permissions
	, Twitter("h5vpDPS2riT1vn4imgPDQw", "7ikegRCnIblG3PG4rMWpT8nk5gQ1MaR2DAZTt9GeDM")
	, VariableStore
	//, Repl({ //TODO:Port
	//	require: "repl"
	//})
])

var client = Bot.create('IRCClient',{
  'server':'irc.freenode.net'
  , 'nick':'_frankie'
  ,'channels':['#nodebot']
})
