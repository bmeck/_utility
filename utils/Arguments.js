var argumentMatcher = /('(?:\\(?:.|\n)|[^'])*'|"(?:\\(?:.|\n)|[^"])*"|\S+)(?:[\s\n]*|$)/g
  , sys = require('sys')
exports.ArgumentHelper = function(amount,input) {
  var results = []
  argumentMatcher.lastIndex = 0
  var match = argumentMatcher.exec(input)
  while(match && amount) {
    results.push(match[1])
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
