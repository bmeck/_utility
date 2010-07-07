var System = require('interface').System;

var Irc = require('./interfaces/Irc')
  , Triggers = require('./interfaces/Triggers')
  , IrcTriggers = require('./interfaces/IrcTriggers')
  //, Permissions = require('./interfaces/Permissions')
  , VariableStore = require('./interfaces/VariableStore')
  , Twitter = require('./interfaces/Twitter')
  , TwitterTriggers = require('./interfaces/TwitterTriggers')
  , Translate = require('./interfaces/Translate')
  //Make your own settings
  //, settings = require('./settings')

var Bot = System([
	Irc
	//, Permissions
	, Triggers('!')
	, Translate
	, IrcTriggers
	, Twitter
	, TwitterTriggers("h5vpDPS2riT1vn4imgPDQw", "7ikegRCnIblG3PG4rMWpT8nk5gQ1MaR2DAZTt9GeDM")
	//, VariableStore
])

var client = Bot.create('IRCClient',{
  'server':'irc.freenode.net'
  , 'nick':'_frankie'
  ,'channels':['#node.js.bots']
})
