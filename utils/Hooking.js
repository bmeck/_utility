var sys=require('sys')
//hooks are based upon preInit, post inits shouldnt care about order
//in injecting before previous interfaces
exports.preHook = function (interfaces,interfaceToHook,callback) {
  var oldhook = interfaces[interfaceToHook].hooks.preInit
  if (oldhook) {
    interfaces[interfaceToHook].hooks.preInit = function() {
      callback.apply(this,arguments)
      oldhook.apply(this,arguments)
    }
  }
  else {
    interfaces[interfaceToHook].hooks.preInit = callback
  }
}
//if using previous interfaces (recommended)
exports.postHook = function (interfaces,interfaceToHook,callback) {
  var interfaceDescriptor = interfaces[interfaceToHook]
    , hooks = interfaceDescriptor.hooks
  if (hooks) {
    var oldhook = hooks.preInit
    //sys.puts(sys.inspect(interfaces[interfaceToHook]),interfaceToHook,!!oldhook)
    if (oldhook) {
      hooks.preInit = function() {
        oldhook.apply(this,arguments)
        callback.apply(this,arguments)
      }
      return
    }
  }
  else {
    interfaceDescriptor.hooks = {}
  }
  interfaces[interfaceToHook].hooks.preInit = callback
}
