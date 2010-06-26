var System = require('interface').System;

var Irc = require('./interfaces/Irc')
  , Triggers = require('./interfaces/Triggers')
  , Permissions = require('./interfaces/Permissions')
  , VariableStore = require('./interfaces/VariableStore')
var Bot = System([
	Irc
	//, IrcLog //TODO:Port
	, Triggers('!')
	//, MongoDBPersistance //TODO:Port
	, Permissions
	//, Twitter({ //TODO:Port
	//	require: "voice"
	//})
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
