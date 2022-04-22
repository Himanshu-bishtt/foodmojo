// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMEOUT_SEC = exports.SPINNER_CLOSE_SEC = exports.RES_PER_PAGE = exports.MODAL_CLOSE_SEC = exports.GEOCODE_API_KEY = exports.FORKIFY_API_KEY = exports.API_URL = void 0;
var API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
exports.API_URL = API_URL;
var TIMEOUT_SEC = 10;
exports.TIMEOUT_SEC = TIMEOUT_SEC;
var RES_PER_PAGE = 10;
exports.RES_PER_PAGE = RES_PER_PAGE;
var FORKIFY_API_KEY = '<YOUR_KEY>';
exports.FORKIFY_API_KEY = FORKIFY_API_KEY;
var GEOCODE_API_KEY = '784130905068214839321x63695';
exports.GEOCODE_API_KEY = GEOCODE_API_KEY;
var MODAL_CLOSE_SEC = 5;
exports.MODAL_CLOSE_SEC = MODAL_CLOSE_SEC;
var SPINNER_CLOSE_SEC = 2;
exports.SPINNER_CLOSE_SEC = SPINNER_CLOSE_SEC;
},{}],"js/helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomNumberGenerator = exports.loadAJAX = exports.getLocationCoords = exports.getLocation = exports.generateUniqueRandoms = exports.cronJob = void 0;

require("regenerator-runtime");

var _config = require("./config");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var timeout = function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long! Timeout after ".concat(s, " second")));
    }, s * 1000);
  });
};

var loadAJAX = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var res, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Promise.race([fetch(url), timeout(_config.TIMEOUT_SEC)]);

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.json();

          case 6:
            data = _context.sent;

            if (!(!res.ok || data.results === 0)) {
              _context.next = 9;
              break;
            }

            throw new Error("No recipes found with that query. Please try again!");

          case 9:
            return _context.abrupt("return", data);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function loadAJAX(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.loadAJAX = loadAJAX;

var getLocationCoords = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return new Promise(function (resolve, reject) {
              return navigator.geolocation.getCurrentPosition(resolve, reject);
            });

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));

  return function getLocationCoords() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getLocationCoords = getLocationCoords;

var getLocation = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(lat, lng) {
    var res, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetch("https://geocode.xyz/".concat(lat, ",").concat(lng, "?geoit=json&auth=").concat(_config.GEOCODE_API_KEY));

          case 3:
            res = _context3.sent;

            if (res.ok) {
              _context3.next = 6;
              break;
            }

            throw new Error('Problem getting location data');

          case 6:
            _context3.next = 8;
            return res.json();

          case 8:
            data = _context3.sent;
            return _context3.abrupt("return", data);

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            throw _context3.t0;

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 12]]);
  }));

  return function getLocation(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getLocation = getLocation;

var randomNumberGenerator = function randomNumberGenerator(value) {
  return Math.floor(Math.random() * value);
};

exports.randomNumberGenerator = randomNumberGenerator;

var generateUniqueRandoms = function generateUniqueRandoms(value) {
  var total = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var randomValues = [];

  for (var i = 0; i < value; ++i) {
    randomValues.push(randomNumberGenerator(value));
  }

  return _toConsumableArray(new Set(randomValues)).slice(0, total);
};

exports.generateUniqueRandoms = generateUniqueRandoms;

var cronJob = function cronJob() {
  var midnight = '00:00:01';
  var date = new Date();
  var hours = String(date.getHours()).padStart(2, 0);
  var mins = String(date.getMinutes()).padStart(2, 0);
  var secs = String(date.getSeconds()).padStart(2, 0);
  var now = "".concat(hours, ":").concat(mins, ":").concat(secs);
  if (now === midnight) return true;
  return false;
};

exports.cronJob = cronJob;
},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js","./config":"js/config.js"}],"js/modal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = exports.loadUserLocation = exports.loadTheme = exports.loadRecommenedRecipes = exports.loadRecipe = exports.loadQueryResults = exports.loadDataFromLocalStorageOnLoad = exports.generateRequiredRecipes = void 0;

require("regenerator-runtime");

var _config = require("./config");

var _helper = require("./helper");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var state = {
  search: {
    query: [],
    results: [],
    recipe: {}
  },
  recipeTabs: ['steak', 'pizza', 'noodles', 'pasta'],
  userLocation: {},
  recommenedRecipes: [],
  theme: 'light'
};
exports.state = state;

var loadTheme = function loadTheme(th) {
  state.theme = th;
  persistStateToLocalStorage();
};

exports.loadTheme = loadTheme;

var loadRecipe = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _helper.loadAJAX)("".concat(_config.API_URL).concat(id));

          case 3:
            result = _context.sent;
            state.search.recipe = result.data.recipe;
            persistStateToLocalStorage();
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function loadRecipe(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.loadRecipe = loadRecipe;

var loadQueryResults = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(query) {
    var result, results, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!state.search.query.includes(query)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            _context2.next = 5;
            return (0, _helper.loadAJAX)("".concat(_config.API_URL, "?search=").concat(query));

          case 5:
            result = _context2.sent;
            // 3. Pushing searched query into query state
            state.search.query.push(query); // 4. Pushing searched results into results state

            results = result.results, data = result.data;
            state.search.results.push({
              query: query,
              results: results,
              data: data
            }); // 5. Storing state after every search into Local Storage

            persistStateToLocalStorage();
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function loadQueryResults(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loadQueryResults = loadQueryResults;

var loadUserLocation = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var geoCoords, _geoCoords$coords, lat, lng, geoData, country, st, city, timezone, region, address, postal;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _helper.getLocationCoords)();

          case 3:
            geoCoords = _context3.sent;
            // 2. Storing user coordinates in userlocation state
            _geoCoords$coords = geoCoords.coords, lat = _geoCoords$coords.latitude, lng = _geoCoords$coords.longitude;
            state.userLocation.userCoords = {
              lat: lat,
              lng: lng
            }; // 3. Getting user location data by reverse geocoding

            _context3.next = 8;
            return (0, _helper.getLocation)(lat, lng);

          case 8:
            geoData = _context3.sent;
            // 4. Storing user location data to userDate state
            country = geoData.country, st = geoData.state, city = geoData.city, timezone = geoData.timezone, region = geoData.region, address = geoData.staadress, postal = geoData.postal;
            state.userLocation.userData = {
              country: country,
              st: st,
              city: city,
              timezone: timezone,
              region: region,
              address: address,
              postal: postal
            }; // 5. Storing user location data into Local Storage

            persistStateToLocalStorage();
            _context3.next = 19;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            // 6. Storing location error also to userLocation state
            state.userLocation.message = _context3.t0.message; // 7. Updating state into Local Storage

            persistStateToLocalStorage();
            throw _context3.t0;

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function loadUserLocation() {
    return _ref3.apply(this, arguments);
  };
}();

exports.loadUserLocation = loadUserLocation;

var loadRecommenedRecipes = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var recipes, totalResults, uniqueValues, _recipes, _totalResults, _uniqueValues;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (!(state.recommenedRecipes.length === 0)) {
              _context4.next = 10;
              break;
            }

            _context4.next = 4;
            return (0, _helper.loadAJAX)("".concat(_config.API_URL, "?search=").concat(state.search.query.at(0) || 'pizza'));

          case 4:
            recipes = _context4.sent;
            // 2. Generating 4 unique random values less than number of results (0 < x < totalResults), which act as indexs to retrieve that index
            totalResults = recipes.results;
            uniqueValues = (0, _helper.generateUniqueRandoms)(totalResults); // 3. Creating side effects by pushing the recipes into recommenedRecipes state.

            uniqueValues.forEach(function (value) {
              state.recommenedRecipes.push(recipes.data.recipes.at(value));
            });
            _context4.next = 18;
            break;

          case 10:
            if (!(0, _helper.cronJob)()) {
              _context4.next = 18;
              break;
            }

            _context4.next = 13;
            return (0, _helper.loadAJAX)("".concat(_config.API_URL, "?search=").concat(state.search.query.at((0, _helper.generateUniqueRandoms)(state.search.query.length).at(0)) || 'pizza'));

          case 13:
            _recipes = _context4.sent;
            // 2. Generating 4 unique random values less than number of results (0 < x < totalResults), which act as indexs to retrieve that index
            _totalResults = _recipes.results;
            _uniqueValues = (0, _helper.generateUniqueRandoms)(_totalResults); // 3. Emptying recommened recipes array before loading new recipes.

            state.recommenedRecipes = []; // 4. Creating side effects by pushing the recipes into recommenedRecipes state.

            _uniqueValues.forEach(function (value) {
              state.recommenedRecipes.push(_recipes.data.recipes.at(value));
            });

          case 18:
            // 5. Persisting data to local storage
            persistStateToLocalStorage();
            _context4.next = 25;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            throw _context4.t0;

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 21]]);
  }));

  return function loadRecommenedRecipes() {
    return _ref4.apply(this, arguments);
  };
}();

exports.loadRecommenedRecipes = loadRecommenedRecipes;

var generateRequiredRecipes = function generateRequiredRecipes(query) {
  // 1. searching for results which matches with query param
  var matchingRecipeResults = state.search.results.find(function (recipe) {
    return recipe.query === query;
  });
  var totalResults = matchingRecipeResults.results; // const uniqueValues = generateUniqueRandoms(totalResults, 8);

  var uniqueValues = Array.from({
    length: 8
  }, function (_, i) {
    return i + 1;
  }); // 2. Generating required recipes which are array elements from 1 to 8

  var requiredRecipes = uniqueValues.map(function (value) {
    return matchingRecipeResults.data.recipes.at(value);
  }); // 3. Returing generated recipes array for controller

  return requiredRecipes;
};

exports.generateRequiredRecipes = generateRequiredRecipes;

var loadDataFromLocalStorageOnLoad = function loadDataFromLocalStorageOnLoad() {
  // 1. Loading state data from local storage
  var data = JSON.parse(localStorage.getItem('state')); // 2. If no data is present, then return

  if (!data) return; // 3. Loading data into state

  state.search = data.search;
  state.userLocation = data.userLocation;
  state.recommenedRecipes = data.recommenedRecipes;
  state.theme = data.theme;
};

exports.loadDataFromLocalStorageOnLoad = loadDataFromLocalStorageOnLoad;

var persistStateToLocalStorage = function persistStateToLocalStorage() {
  // 1. Storing entire state into Local Storage
  localStorage.setItem('state', JSON.stringify(state));
};

var removeStateFromLocalStorage = function removeStateFromLocalStorage() {
  localStorage.removeItem('state');
};
},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js","./config":"js/config.js","./helper":"js/helper.js"}],"icons/icons.svg":[function(require,module,exports) {
module.exports = "/icons.f20fc8b5.svg";
},{}],"js/views/heroView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config");

var _icons = _interopRequireDefault(require("../../icons/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _parentElement = /*#__PURE__*/new WeakMap();

var _generateMarkup = /*#__PURE__*/new WeakSet();

var HeroView = /*#__PURE__*/function () {
  function HeroView() {
    _classCallCheck(this, HeroView);

    _classPrivateMethodInitSpec(this, _generateMarkup);

    _classPrivateFieldInitSpec(this, _parentElement, {
      writable: true,
      value: document.querySelector('.hero')
    });
  }

  _createClass(HeroView, [{
    key: "renderAnimation",
    value: function renderAnimation() {
      var _this = this;

      window.addEventListener('load', function () {
        _classPrivateFieldGet(_this, _parentElement).querySelector('.hero__content--heading').style.filter = 'blur(0)';
        _classPrivateFieldGet(_this, _parentElement).querySelector('.hero__content--heading').style.letterSpacing = '0';
      });
    }
  }, {
    key: "renderErrorPopup",
    value: function renderErrorPopup(msg) {
      var errorPopup = _classPrivateFieldGet(this, _parentElement).querySelector('.hero__error-popup');

      errorPopup.textContent = msg;
      errorPopup.style.opacity = 1;
      errorPopup.style.transform = 'scale(1)';
      setTimeout(function () {
        errorPopup.style.opacity = 0;
        errorPopup.style.transform = 'scale(0)';
      }, _config.MODAL_CLOSE_SEC * 1000);
    }
  }, {
    key: "renderSpinner",
    value: function renderSpinner() {
      var element = _classPrivateFieldGet(this, _parentElement).querySelector('.hero__form--location');

      var spinner = "\n      <svg class=\"hero__form--spinner\">\n        <use href=\"".concat(_icons.default, "#icon-loader\"></use>\n      </svg>\n    ");

      _classPrivateMethodGet(this, _generateMarkup, _generateMarkup2).call(this, element, spinner);
    }
  }, {
    key: "renderUserLocation",
    value: function renderUserLocation(region) {
      var element = _classPrivateFieldGet(this, _parentElement).querySelector('.hero__form--location');

      var html = "\n      <img src=\"/location-48.5100a1b2.png\" alt=\"location icon\" />\n      <p class=\"hero__form--location-user\">".concat(region, "</p>\n    ");

      _classPrivateMethodGet(this, _generateMarkup, _generateMarkup2).call(this, element, html);
    }
  }, {
    key: "renderLocationErrorOnCancel",
    value: function renderLocationErrorOnCancel() {
      var element = _classPrivateFieldGet(this, _parentElement).querySelector('.hero__form--location');

      var html = "\n      <img src=\"/location-48.5100a1b2.png\" alt=\"location icon\" />\n      <p class=\"hero__form--location-user\">Location denied</p>\n    ";

      _classPrivateMethodGet(this, _generateMarkup, _generateMarkup2).call(this, element, html);
    }
  }, {
    key: "addHandlerLocation",
    value: function addHandlerLocation(handler) {
      var detectLocationBtn = _classPrivateFieldGet(this, _parentElement).querySelector('.hero__form--location-btn');

      if (!detectLocationBtn) return;
      detectLocationBtn.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
    }
  }]);

  return HeroView;
}();

function _generateMarkup2(element, html) {
  element.innerHTML = '';
  element.insertAdjacentHTML('beforeend', html);
}

var _default = new HeroView();

exports.default = _default;
},{"../config":"js/config.js","../../icons/icons.svg":"icons/icons.svg"}],"js/views/htmlView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _parentElement = /*#__PURE__*/new WeakMap();

var _updateOnlineStatus = /*#__PURE__*/new WeakSet();

var HtmlView = /*#__PURE__*/function () {
  function HtmlView() {
    _classCallCheck(this, HtmlView);

    _classPrivateMethodInitSpec(this, _updateOnlineStatus);

    _classPrivateFieldInitSpec(this, _parentElement, {
      writable: true,
      value: document.querySelector('html')
    });
  }

  _createClass(HtmlView, [{
    key: "changeTheme",
    value: function changeTheme(handler) {
      var _this = this;

      var themePicker = _classPrivateFieldGet(this, _parentElement).querySelector('.btn__theme--select');

      themePicker.addEventListener('change', function () {
        _classPrivateFieldGet(_this, _parentElement).setAttribute('data-theme', themePicker.value);

        handler(themePicker.value);
      });
    }
  }, {
    key: "renderErrorOnOffline",
    value: function renderErrorOnOffline() {
      window.addEventListener('online', _classPrivateMethodGet(this, _updateOnlineStatus, _updateOnlineStatus2).bind(this));
      window.addEventListener('offline', _classPrivateMethodGet(this, _updateOnlineStatus, _updateOnlineStatus2).bind(this));
    }
  }, {
    key: "renderSavedTheme",
    value: function renderSavedTheme(theme) {
      _classPrivateFieldGet(this, _parentElement).setAttribute('data-theme', theme);

      var themePicker = _classPrivateFieldGet(this, _parentElement).querySelector('.btn__theme--select');

      themePicker.value = theme === 'dark' ? 'dark' : 'light';
    }
  }]);

  return HtmlView;
}();

function _updateOnlineStatus2() {
  var overlay = _classPrivateFieldGet(this, _parentElement).querySelector('.overlay__error');

  var popup = _classPrivateFieldGet(this, _parentElement).querySelector('.popup__error');

  if (!navigator.onLine) {
    overlay.classList.remove('hidden');
    popup.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
    popup.classList.add('hidden');
  }
}

var _default = new HtmlView();

exports.default = _default;
},{}],"js/views/recipePageView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _icons = _interopRequireDefault(require("../../icons/icons.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _parentElement = /*#__PURE__*/new WeakMap();

var _errorMessage = /*#__PURE__*/new WeakMap();

var _renderIngredients = /*#__PURE__*/new WeakSet();

var RecipePageView = /*#__PURE__*/function () {
  function RecipePageView() {
    _classCallCheck(this, RecipePageView);

    _classPrivateMethodInitSpec(this, _renderIngredients);

    _classPrivateFieldInitSpec(this, _parentElement, {
      writable: true,
      value: document.querySelector('.recipe__content')
    });

    _classPrivateFieldInitSpec(this, _errorMessage, {
      writable: true,
      value: 'No recipe found with that id. Please try again!'
    });
  }

  _createClass(RecipePageView, [{
    key: "addHandlerRender",
    value: function addHandlerRender(handler) {
      ['hashchange', 'load'].forEach(function (ev) {
        return window.addEventListener(ev, handler);
      });
    }
  }, {
    key: "renderSpinner",
    value: function renderSpinner() {
      _classPrivateFieldGet(this, _parentElement).innerHTML = '';
      var spinner = "\n    <svg class=\"spinner\">\n      <use href=\"".concat(_icons.default, "#icon-loader\"></use>\n    </svg>\n    ");

      _classPrivateFieldGet(this, _parentElement).insertAdjacentHTML('beforeend', spinner);
    }
  }, {
    key: "renderError",
    value: function renderError() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _classPrivateFieldGet(this, _errorMessage);
      _classPrivateFieldGet(this, _parentElement).innerHTML = '';
      var html = "\n      <p class=\"text-center fs-2\" style=\"color: red\">".concat(msg, "</p>\n    ");

      _classPrivateFieldGet(this, _parentElement).insertAdjacentHTML('beforeend', html);
    }
  }, {
    key: "renderRecipe",
    value: function renderRecipe(recipe) {
      document.title = "".concat(recipe.title, " by ").concat(recipe.publisher);
      _classPrivateFieldGet(this, _parentElement).innerHTML = '';
      var html = "\n      <figure class=\"recipe__fig\">\n        <img\n          src=\"".concat(recipe.image_url, "\"\n          alt=\"").concat(recipe.title, "\"\n          class=\"recipe__img\"\n        />\n        <h1 class=\"recipe__title\">\n          <span>").concat(recipe.title, "</span>\n        </h1>\n      </figure>\n\n      <div class=\"recipe__details\">\n        <div class=\"recipe__details--time\">\n          <svg>\n            <use href=\"").concat(_icons.default, "#icon-clock\"></use>\n          </svg>\n          <span>").concat(recipe.cooking_time, " MINUTES</span>\n        </div>\n\n        <div class=\"recipe__details--servings\">\n          <svg>\n            <use href=\"").concat(_icons.default, "#icon-users\"></use>\n          </svg>\n          <span>").concat(recipe.servings, " SERVINGS</span>\n        </div>\n      </div>\n\n      <div class=\"recipe__ingredients\">\n        <h3 class=\"heading--secondary mg-5\">Recipe Ingredients</h3>\n        <ul class=\"recipe__ingredient-list\">\n          ").concat(_classPrivateMethodGet(this, _renderIngredients, _renderIngredients2).call(this, recipe.ingredients), "\n        </ul>\n      </div>\n    ");

      _classPrivateFieldGet(this, _parentElement).insertAdjacentHTML('beforeend', html);
    }
  }]);

  return RecipePageView;
}();

function _renderIngredients2(ingredients) {
  var html = ingredients.map(function (ing) {
    return "\n        <li class=\"recipe__ingredient\">\n          <svg class=\"recipe__icon\">\n            <use href=\"".concat(_icons.default, "#icon-check\"></use>\n          </svg>\n          <div class=\"recipe__quantity\">").concat(ing.quantity || '', "</div>\n          <div class=\"recipe__description\">\n            <span class=\"recipe__unit\">").concat(ing.unit, "</span>\n            ").concat(ing.description, "\n          </div>\n        </li>\n        ");
  }).join('');
  return html;
}

var _default = new RecipePageView();

exports.default = _default;
},{"../../icons/icons.svg":"icons/icons.svg"}],"js/recipeController.js":[function(require,module,exports) {
'use strict';

var modal = _interopRequireWildcard(require("./modal"));

var _heroView = _interopRequireDefault(require("./views/heroView"));

var _htmlView = _interopRequireDefault(require("./views/htmlView"));

var _recipePageView = _interopRequireDefault(require("./views/recipePageView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var controlLocalStorageData = function controlLocalStorageData() {
  modal.loadDataFromLocalStorageOnLoad();
};

var controlUserNetworkStatus = function controlUserNetworkStatus() {
  _htmlView.default.renderErrorOnOffline();
};

var controlThemeChange = function controlThemeChange(theme) {
  // 1. Storing theme in state when change
  modal.loadTheme(theme);
};

var controlThemeOnLoad = function controlThemeOnLoad() {
  _htmlView.default.renderSavedTheme(modal.state.theme);
};

var controlRecipePage = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var url, url_str, id;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            url = window.location.href;
            url_str = new URL(url);
            id = url_str.searchParams.get('id');

            if (id) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            _recipePageView.default.renderSpinner();

            _context.next = 9;
            return modal.loadRecipe(id);

          case 9:
            _recipePageView.default.renderRecipe(modal.state.search.recipe);

            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            _recipePageView.default.renderError();

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function controlRecipePage() {
    return _ref.apply(this, arguments);
  };
}();

var init = function init() {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlThemeOnLoad();
  controlRecipePage();

  _htmlView.default.changeTheme(controlThemeChange);
};

init();
},{"./modal":"js/modal.js","./views/heroView":"js/views/heroView.js","./views/htmlView":"js/views/htmlView.js","./views/recipePageView":"js/views/recipePageView.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39635" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/recipeController.js"], null)
//# sourceMappingURL=/recipeController.dfc82815.js.map