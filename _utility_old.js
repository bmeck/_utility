var irc = require('irc')
  , sys = require('sys')
  , client = new irc.Client('irc.freenode.net', '_utility', {
      channels: ['#nodebot'],
  })
  , http = require('http')
  , fs = require('fs')
  , repl = require('repl')
  , events = require('events')
  , cookiejar = require('cookiejar')
  , OAuth= require('oauth/oauth').OAuth;

var pin=9830985

var oa= new OAuth("https://twitter.com/oauth/request_token",
                  "https://twitter.com/oauth/access_token",
                  "h5vpDPS2riT1vn4imgPDQw",
                  "7ikegRCnIblG3PG4rMWpT8nk5gQ1MaR2DAZTt9GeDM",
                  "1.0",
                  null,
                  "HMAC-SHA1")
//var stdin = process.openStdin()

var access_token="158885951-swGnRFT7fyJVOdMFAI5KyXfdFaqfcqXVjaW4ylw0"
var access_token_secret="9XBA248WHdfwpgVNd0Q9uaukT1aR0GiKKQj4dyrE7U"

function TwitterRequest(msg) {
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	  if(error) sys.puts('error :' + error)
	  else {
	    sys.puts('oauth_token :' + oauth_token)
	    sys.puts('oauth_token_secret :' + oauth_token_secret)
	    sys.puts('requestoken results :' + sys.inspect(results))
	    sys.puts("Requesting access token")
	    sys.puts("GOTO::https://twitter.com/oauth/authorize?oauth_token="+oauth_token)
	 }
stdin.addListener('data',function(pin){
	TwitterAccess(oauth_token, oauth_token_secret, pin.toString().trim(),msg)
})
})
}
//TwitterRequest("Running...")

function Tweet(msg) {
oa.getProtectedResource("http://api.twitter.com/1/statuses/update.json?status="+encodeURIComponent(msg), "POST", access_token, access_token_secret, function (error, data, response) {
	  //sys.puts(data);
	  if(error) {sys.puts("ERROR::"+error)}
      });
}
function TwitterAccess(oauth_token, oauth_token_secret, pin,msg) {
	    oa.getOauthAccessToken(oauth_token, oauth_token_secret, pin, function(error, oauth_access_token, oauth_access_token_secret, results2) {
	      sys.puts('oauth_access_token :' + oauth_access_token)
	      sys.puts('oauth_token_secret :' + oauth_access_token_secret)
	      sys.puts('accesstoken results :' + sys.inspect(results2))
	      sys.puts("Requesting access token")
	      var data= "";
	      Tweet(msg)
	    });
	  }

var variables = {}
var locks = {}
var administrators = {
	'ryah':{
		'grant':true
		, 'reset':true
		, 'repl':true
		, 'irc':true
	},
	'bradleymeck': {
		'grant':true
		, 'reset':true
		, 'repl':true
		, 'irc':true
		, 'voice':true
	}
}

var irc_repls = {
	//streamname (user or channel)
	//
}

//var log = fs.open('log.csv')

var pop_arg=/^\s*(\S+)\s?((?:.|\n)*)$/
var commands = {
	'set':{
		response: function(source,destination,privacy,input) {
    			var args = input.match(pop_arg)
			if(args && (!locks[args[1]]
			|| (administrators[source] && administrators[source].reset))) {
				if(args[2]!=='') variables[args[1]] = args[2]
				else {delete variables[args[1]]}
				delete locks[args[1]]
			}
		}
		, info: '@set variable msg'
		, availability: {
			channel:true
			, private_msg:true
		}
	}
	,'lock': {
		response: function(source,destination,privacy,input) {
	    		var args = input.match(pop_arg)
			if(args && (!locks[args[1]]
			|| (administrators[source] && administrators[source].reset))) {
				if(args[2]!=='') variables[args[1]] = args[2]
				else {delete variables[args[1]]}
				locks[args[1]]=source
			}
		}
		, info: '@lock variable msg'
		, availability: {
			channel:true
			, private_msg:true
		}
	}
	,'get':{
		response: function(source,destination,privacy,input) {
    		var args = input.match(pop_arg)
			if(args) client.say(destination,variables[args[1].trim()])
		}
		, info: '@get variable [args*]'
		, availability: {
			channel:true
			, private_msg:true
		}
	}
	,'grant': {
		response: function(source,destination,privacy,input) {
    		var args = input.match(pop_arg)
			if(args) {
				args=args.map(function(item){return item.trim();})
				if(!administrators[args[1]]) {
					administrators[args[1]] = {}
				}
				administrators[args[1]][args[2]]=true
			}
		}
		, info: '@grant user privilege (requires admin)'
		, availability: {
			channel:true
			, private_msg:true
		}
		, requires : {
			grant:true
		}
	}
	,'revoke': {
		response: function(source,destination,privacy,input) {
    		var args = input.match(pop_arg)
			if(args) {
				args=args.map(function(item){return item.trim();})
				if(administrators[args[1]]) {
					delete administrators[args[1]][args[2]]
				}
			}
		}
		, info: '@revoke user privilege (requires admin)'
		, availability: {
			channel:true
			, private_msg:true
		}
		, requires : {
			grant:true
		}
	}
	//,'respond':{
	//	response: function(source,destination,privacy,input) {	}
	//	, info: '@respond url msg'
	//	, availability: {
	//		channel:true
	//		, private_msg:true
	//	}
	//}
	,'join':{
		response: function(source,destination,privacy,input) {
    		var args = input.match(pop_arg)
			if(args) client.join(args[1].trim())
		}
		, info: '@join - joins a channel'
		, availability: {
			private_msg:true
		}
		, requires : {irc:true}
	}
	,'leave':{
		response: function(source,destination,privacy,input) {
    		var args = input.match(pop_arg)
			if(args) client.part(args[1].trim())
		}
		, info: '@leave - leaves a channel'
		, availability: {
			private_msg:true
		}
		, requires : {irc:true}
	}
	,'help':{
		response: function(source,destination,privacy,input) {
    		Object.keys(commands).forEach(function(command){
    			client.say(source,commands[command].info||'no info on @'+command)
    		})
		}
		, info: '@help - lists all the commands available, requires admin for use'
		, availability: {
			private_msg:true
		}
	}
	,'tweet':{
		response: function(source,destination,privacy,input) {
				var msg=input.trim()+" --"+source
				Tweet(msg)
		}
		, info: '@tweet msg - tweets a msg'
		, availability: {
			private_msg:true
			, channel:true
		}
		, requires : {voice:true}
	} 
	,'repl':{
		response: function(source,destination,privacy,input) {
			var cages=irc_repls[destination]
			if(cages) {
				var stream = cages[source]
				if(stream) {
					stream.emit('data',input)
					return
				}
			}
			else {
				cages=irc_repls[destination]={}
			}
			var prompted=false
			var emitter = cages[source] = new events.EventEmitter()
			emitter.write=function(chunk) {
				if(prompted) client.say(destination,JSON.stringify(chunk))
				prompted=true
			}
			emitter.destroy=function() {
				sys.puts('cleaning repl on ',source,destination)
				delete irc_repls[destination][source]
				if(Object.keys(irc_repls[destination]).length==0) {
					delete irc_repls[destination]
				}
			}
			repl.start('',emitter)
			emitter.emit('data',input)
		}
		, info: '@repl - starts a repl stream on a source (bound by name and channel)'
		, availability: {
			channel:true
			, private_msg:true
		}
		, requires: {
			repl: true
		}
	}

	,'variables':{
		response: function(source,destination,privacy,input) {
			var keys = Object.keys(variables)
			if(keys) client.say('"'+destination,Object.keys(variables).join('", "')+'"')
			else client.say('no variables are set')
		}
		, info: '@variables - lists all the variables'
		, availability: {
			private_msg:true
		}
	}
}

client.addListener('message', function (from, to, message) {
    sys.puts(from + ' => ' + to + ': ' + message)
    //Left trim
    var msg = message.replace(/^\s+/,'')
    var privacy = to === client.nick ? "private_msg" : "channel"
    var destination=privacy==="private_msg" ? from : to
    //@==execute
    //?==help
    switch(msg.charAt(0)) {
    	case '!':
    		var command=msg.slice(1).match(pop_arg)
    		if(command) {
				var handler=commands[command[1]]
				if (handler) {
					if(privacy in handler.availability) {
						if (handler.requires) {
							if(!administrators[from]) return
							for(var i in handler.requires) {
								if(!administrators[from][i]) {
									return
								}
							}
							handler.response(from,destination,privacy,command[2])
						}
						else {
							handler.response(from,destination,privacy,command[2])
						}
					}
				}
			}
		break;
		case '?':
    		var command=msg.slice(1).match(pop_arg)
			if(command) {
				var handler=commands[command[1]]
				if (handler) {
					client.say(destination,handler.info||'no info on @'+command[2])
				}
			}
		break;
    }
})
client.addListener('pm', function (from, message) {
   // sys.puts(from + ' => ME: ' + message)
})
client.addListener('message#nodebot', function (from, message) {
   // sys.puts(from + ' => @nodebot: ' + message)
})
client.addListener('error', function(message) {
    sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '));
});
client.addListener('join', function(channel, who) {
    sys.puts(who + ' has joined ' + channel);
});
client.addListener('part', function(channel, who, reason) {
    sys.puts(who + ' has left ' + channel + ': ' + reason);
});
client.addListener('kick', function(channel, who, by, reason) {
    sys.puts(who + ' was kicked from ' + channel + ' by ' + by + ': ' + reason);
});
