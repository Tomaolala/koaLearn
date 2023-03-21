/**
 * Expose `Delegator`.
 */

module.exports = Delegator

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator (proto, target) {
  // 单例模式

  if (!(this instanceof Delegator)) return new Delegator(proto, target)
  this.proto = proto
  this.target = target
  this.methods = []
  this.getters = []
  this.setters = []
  this.fluents = []
}

/**
 * Automatically delegate properties
 * from a target prototype
 *
 * @param {Object} proto
 * @param {object} targetProto
 * @param {String} targetProp
 * @api public
 */

Delegator.auto = function (proto, targetProto, targetProp) {
  var delegator = Delegator(proto, targetProp)
  var properties = Object.getOwnPropertyNames(targetProto)
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i]
    var descriptor = Object.getOwnPropertyDescriptor(targetProto, property)
    if (descriptor.get) {
      delegator.getter(property)
    }
    if (descriptor.set) {
      delegator.setter(property)
    }
    if (descriptor.hasOwnProperty('value')) {
      // could be undefined but writable
      var value = descriptor.value
      if (value instanceof Function) {
        delegator.method(property)
      } else {
        delegator.getter(property)
      }
      if (descriptor.writable) {
        delegator.setter(property)
      }
    }
  }
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function (name) {
  var proto = this.proto
  var target = this.target
  this.methods.push(name)
  //将this
  proto[name] = function () {
    return this[target][name].apply(this[target], arguments)
  }

  // return this是为了支持链式调用
  //将target上面的 name 函数代理到proto上面
  return this
}

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
//代理getter和setter
Delegator.prototype.access = function (name) {
  return this.getter(name).setter(name)
}

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function (name) {
  var proto = this.proto
  var target = this.target
  this.getters.push(name)

  proto.__defineGetter__(name, function () {
    return this[target][name]
  })

  return this
}

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function (name) {
  var proto = this.proto
  var target = this.target
  this.setters.push(name)

  proto.__defineSetter__(name, function (val) {
    return (this[target][name] = val)
  })

  return this
}

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto
  var target = this.target
  this.fluents.push(name)
  //在此我们提供了 name 函数  ，如果没有传值返回原来的函数，传递则取传入的值
  proto[name] = function (val) {
    if ('undefined' != typeof val) {
      this[target][name] = val
      return this
    } else {
      return this[target][name]
    }
  }

  return this
}
