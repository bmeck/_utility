var irc = require('irc')
  , sys = require('sys')
//IRC
//
//Produces an IRCClient instance
////IRCClient(options)
////  options = {nick:string,server:string,channels:string[]}

///IRCClient has a closure['IRCClient'] that matches node-irc's Client()
module.exports = function(system,interfaces,systemClosures) {
  interfaces['IRCClient'] = {
      constructor: function(closures,args) {
        var options = args[0]
        var client = closures['IRCClient']=new irc.Client(options.server, options.nick, {
          channels: options.channels || false,
        })
        client.addListener('message',function(from, to, message) {
          sys.puts(from + ' => ' + to + ': ' + message)
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
        return client;
      }

  }
}
