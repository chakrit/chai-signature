
// index.js - Main chai-signature exports
module.exports = function(chai, utils) {

  var _ = require('underscore')
    , assert = require('assert');


  // .called()

  function called() {
    var func = utils.flag(this, 'object')
      , origFunc = func
      , wrapped = null
      , args = arguments;

    assert(typeof func === 'function', 'Test subject is not a function.');

    // replace with wrapped version
    func = (function(origFunc) {
      return function() { origFunc.apply(this, args); };
    })(origFunc);

    utils.flag(this, 'object', func);
  }

  chai.Assertion.addChainableMethod('called', called, null);
  chai.Assertion.addChainableMethod('calledWith', called, null);


  // .boundTo()

  function boundTo(obj) {
    assert(obj, 'obj argument required.');
    assert(typeof obj !== 'number', 'obj argument cannot be a number');

    var func = utils.flag(this, 'object')
      , origFunc = func;

    assert(typeof func === 'function', 'Test subject is not a function.');

    // replace with bound version
    func = (function(obj, func) {
      return function() { func.apply(obj, arguments); };
    })(obj, func);

    utils.flag(this, 'object', func);
  }

  chai.Assertion.addChainableMethod('bind', boundTo, null);
  chai.Assertion.addChainableMethod('bindTo', boundTo, null);
  chai.Assertion.addChainableMethod('boundTo', boundTo, null);

};
