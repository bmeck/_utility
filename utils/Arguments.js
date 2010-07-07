var argumentMatcher = /('(?:\\(?:.|\n)|[^'])*(?:'|$)|"(?:\\(?:.|\n)|[^"])*(?:"|$)|\S+)(?:[\s\n]*|$)/g

var ArgumentScrub = exports.ArgumentScrub = function(arg) {
    switch(arg.charAt(0)) {
      case '"':
        if(arg.charAt(arg.length-1)=='"') arg=arg.slice(1,-1)
        else arg=arg.slice(1)
        break;
      case "'":
        if(arg.charAt(arg.length-1)=="'") arg=arg.slice(1,-1)
        else arg=arg.slice(1)
        break;
    }
    return arg
}

exports.ArgumentHelper = function(amount,input) {
  var results = []
  argumentMatcher.lastIndex = 0
  var match = argumentMatcher.exec(input)
  while(match && amount) {
    if(match[1]) results.push(ArgumentScrub(match[1]))
    if(amount) {
      match = argumentMatcher.exec(input)
      amount--
    }
  }
  //matched sufficient arguments
  if (amount == 0) {
    return results.concat(match?input.slice(match.index):[])
  }
  return false;
}

