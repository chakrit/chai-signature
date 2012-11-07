
// test.js - Test chai-signature additions
(function() {

  var _ = require('underscore')
    , assert = require('assert')
    , colors = require('colors') // infect String.prototype
    , log = console.log

  var chai = require('chai')
    , chaiSignature = require('./index')
    , expect = chai.expect;

  // setup
  chai.use(chaiSignature);

  assert = _.wrap(assert, function(assert_, cond, message) {
    message = message.red;
    assert_.call(this, cond, message);
  });

  Number.prototype.s = function() { return this.toString(); };

  // test functions with lots of arg checks
  var obj =

    { func:
      function(str, numOrNil, obj) { assert(str, 'str argument required');
        assert(obj, 'obj argument required');
        assert(typeof str === 'string', 'str argument must be a string');
        assert(!numOrNil || typeof numOrNil === 'number', 'numOrNil argument must be a number or nil');
      }

    , boundFunc:
      function(arg) {
        assert(this === obj, 'incorrect binding');
        assert(arg, 'arg argument required');
        assert(arg, 'arg argument must be an object');
      }
    };

  // HACK: cause supervisor to pause so we can do TDD temporarily
  setTimeout(function() { }, 99999999);

  // test utils
  var stats = { ran: 0, ok: 0, failed: 0 }
    , counter = 0;

  var test = function() {
    var args = _.toArray(arguments)
      , name = args.shift()
      , opts = { throws: false }
      , actions = [];

    if (typeof args[0] === 'object') {
      opts = _.extend(opts, args[0]);
      args.shift();
    }

    actions = args;

    for (var i = 0; i < actions.length; i++) (function(action, i) {
      try {
        log(((++counter) + ": ").cyan + name + (" / " + i).grey);
        stats.ran++;
        action();

        if (!opts.throws) {
          stats.ok++;
        } else {
          log('ERROR: Exception expected. None was thrown.'.red);
          stats.failed++;
        }

      } catch(e) {
        if (opts.throws) {
          stats.ok++;
        } else {
          log(("ERROR: " + (e.message || e.stack || e)).red);
          stats.failed++;
        }
      }
    })(actions[i], i + 1);

  }


  // tests
  log('---');
  log(new Date());
  log(' - ');

  test('called() only accepts function', { throws: true },
    function() { expect('string').called(); },
    function() { expect(123).called(); },
    function() { expect(true).called(); },
    function() { expect(null).called(); },
    function() { expect(undefined).called(); }
  );

  test('str argument missing throws', function() {
    expect(obj.func).called().to.throw();
  });

  test('obj argument missing throws', function() {
    expect(obj.func).called('str', 123).to.throw();
  });

  test('numOrNil argument missing *not* throws', function() {
    expect(obj.func).called('str', null, { }).to.not.throw();
  });

  test('str argument not string',
    function() { expect(obj.func).called(123, null, { }).to.throw(); },
    function() { expect(obj.func).called(true, null, { }).to.throw(); },
    function() { expect(obj.func).called({ }, null, { }).to.throw(); },
    function() { expect(obj.func).called([ ], null, { }).to.throw(); }
  );

  test('numOrNil argument not number or nil',
    function() { expect(obj.func).called('str', true, { }).to.throw(); },
    function() { expect(obj.func).called('str', 'str', { }).to.throw(); },
    function() { expect(obj.func).called('str', { }, { }).to.throw(); },
    function() { expect(obj.func).called('str', [ ], { }).to.throw(); }
  );

  test('boundFunc not bound',
    function() { expect(obj.boundFunc).to.throw(); }
  );

  test('boundTo() only accepts function', { throws: true },
    function() { expect('string').boundTo({ }); },
    function() { expect(123).boundTo({ }); },
    function() { expect(true).boundTo({ }); },
    function() { expect(null).boundTo({ }); },
    function() { expect(undefined).boundTo({ }); }
  );


  test('boundTo() argument missing throws', { throws: true },
    function() { expect(obj.boundFunc).boundTo(); },
    function() { expect(obj.boundFunc).boundTo(null); }
  );

  test('boundTo() argument is number throws', { throws: true },
    function() { expect(obj.boundFunc).boundTo(123); },
    function() { expect(obj.boundFunc).boundTo(null); }
  );

  test('boundTo() argument is function or string *not* throws',
    function() { expect(obj.boundFunc).boundTo('str'); },
    function() { expect(obj.boundFunc).boundTo(function() { }); }
  );

  test('boundFunc bound',
    function() { expect(obj.boundFunc).called({ }).boundTo(obj).not.throw(); }
  );


  // summary
  log(' - ');
  log('stats: ' + stats.ran.s().grey + ' / ' +
      stats.ok.s().green + ' / ' +
      stats.failed.s().red);

})();
