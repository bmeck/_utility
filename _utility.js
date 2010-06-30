var System = require('interface').System;

var Irc = require('./interfaces/Irc')
  , Triggers = require('./interfaces/Triggers')
  , IrcTriggers = require('./interfaces/IrcTriggers')
  , Permissions = require('./interfaces/Permissions')
  , VariableStore = require('./interfaces/VariableStore')
  , Twitter = require('./interfaces/Twitter')
  //Make your own settings
  , settings = require('./settings')

var Bot = System([
	Irc
	, Permissions
	, Triggers('!')
	, IrcTriggers
	, Twitter(settings.oauth_key,settings.oauth_key_secret)
])

var client = Bot.create('IRCClient',{
  'server':'irc.freenode.net'
  , 'nick':'_frankie'
  ,'channels':['#node.js.bots']
})
