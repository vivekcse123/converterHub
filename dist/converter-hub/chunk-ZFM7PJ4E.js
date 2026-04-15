import {
  __spreadProps,
  __spreadValues
} from "./chunk-SHAOKUVO.js";

// node_modules/rxjs/dist/esm/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  const _super = (instance) => {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  const ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
  _super(this);
  this.message = errors ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join("\n  ")}` : "";
  this.name = "UnsubscriptionError";
  this.errors = errors;
});

// node_modules/rxjs/dist/esm/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    const index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm/internal/Subscription.js
var Subscription = class _Subscription {
  constructor(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  unsubscribe() {
    let errors;
    if (!this.closed) {
      this.closed = true;
      const {
        _parentage
      } = this;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          for (const parent of _parentage) {
            parent.remove(this);
          }
        } else {
          _parentage.remove(this);
        }
      }
      const {
        initialTeardown: initialFinalizer
      } = this;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      const {
        _finalizers
      } = this;
      if (_finalizers) {
        this._finalizers = null;
        for (const finalizer of _finalizers) {
          try {
            execFinalizer(finalizer);
          } catch (err) {
            errors = errors !== null && errors !== void 0 ? errors : [];
            if (err instanceof UnsubscriptionError) {
              errors = [...errors, ...err.errors];
            } else {
              errors.push(err);
            }
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  }
  add(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof _Subscription) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  }
  _hasParent(parent) {
    const {
      _parentage
    } = this;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  }
  _addParent(parent) {
    const {
      _parentage
    } = this;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  }
  _removeParent(parent) {
    const {
      _parentage
    } = this;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  }
  remove(teardown) {
    const {
      _finalizers
    } = this;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof _Subscription) {
      teardown._removeParent(this);
    }
  }
};
Subscription.EMPTY = (() => {
  const empty = new Subscription();
  empty.closed = true;
  return empty;
})();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout(handler, timeout, ...args) {
    const {
      delegate
    } = timeoutProvider;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout(handler, timeout, ...args);
    }
    return setTimeout(handler, timeout, ...args);
  },
  clearTimeout(handle) {
    const {
      delegate
    } = timeoutProvider;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(() => {
    const {
      onUnhandledError
    } = config;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = (() => createNotification("C", void 0, void 0))();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    const isRoot = !context;
    if (isRoot) {
      context = {
        errorThrown: false,
        error: null
      };
    }
    cb();
    if (isRoot) {
      const {
        errorThrown,
        error
      } = context;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm/internal/Subscriber.js
var Subscriber = class extends Subscription {
  constructor(destination) {
    super();
    this.isStopped = false;
    if (destination) {
      this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(this);
      }
    } else {
      this.destination = EMPTY_OBSERVER;
    }
  }
  static create(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  }
  next(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  }
  error(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  }
  complete() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  }
  unsubscribe() {
    if (!this.closed) {
      this.isStopped = true;
      super.unsubscribe();
      this.destination = null;
    }
  }
  _next(value) {
    this.destination.next(value);
  }
  _error(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  }
  _complete() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
};
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = class {
  constructor(partialObserver) {
    this.partialObserver = partialObserver;
  }
  next(value) {
    const {
      partialObserver
    } = this;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  }
  error(err) {
    const {
      partialObserver
    } = this;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  }
  complete() {
    const {
      partialObserver
    } = this;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  }
};
var SafeSubscriber = class extends Subscriber {
  constructor(observerOrNext, error, complete) {
    super();
    let partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      let context2;
      if (this && config.useDeprecatedNextContext) {
        context2 = Object.create(observerOrNext);
        context2.unsubscribe = () => this.unsubscribe();
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context2),
          error: observerOrNext.error && bind(observerOrNext.error, context2),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context2)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    this.destination = new ConsumerObserver(partialObserver);
  }
};
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  const {
    onStoppedNotification
  } = config;
  onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm/internal/symbol/observable.js
var observable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();

// node_modules/rxjs/dist/esm/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm/internal/util/pipe.js
function pipe(...fns) {
  return pipeFromArray(fns);
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}

// node_modules/rxjs/dist/esm/internal/Observable.js
var Observable = /* @__PURE__ */ (() => {
  class Observable2 {
    constructor(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    lift(operator) {
      const observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    }
    subscribe(observerOrNext, error, complete) {
      const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(() => {
        const {
          operator,
          source
        } = this;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? this._subscribe(subscriber) : this._trySubscribe(subscriber));
      });
      return subscriber;
    }
    _trySubscribe(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    }
    forEach(next, promiseCtor) {
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor((resolve, reject) => {
        const subscriber = new SafeSubscriber({
          next: (value) => {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        this.subscribe(subscriber);
      });
    }
    _subscribe(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    }
    [observable]() {
      return this;
    }
    pipe(...operations) {
      return pipeFromArray(operations)(this);
    }
    toPromise(promiseCtor) {
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor((resolve, reject) => {
        let value;
        this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value));
      });
    }
  }
  Observable2.create = (subscribe) => {
    return new Observable2(subscribe);
  };
  return Observable2;
})();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return (source) => {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = class extends Subscriber {
  constructor(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    super(destination);
    this.onFinalize = onFinalize;
    this.shouldUnsubscribe = shouldUnsubscribe;
    this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : super._next;
    this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : super._error;
    this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : super._complete;
  }
  unsubscribe() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      const {
        closed
      } = this;
      super.unsubscribe();
      !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  }
};

// node_modules/rxjs/dist/esm/internal/operators/refCount.js
function refCount() {
  return operate((source, subscriber) => {
    let connection = null;
    source._refCount++;
    const refCounter = createOperatorSubscriber(subscriber, void 0, void 0, void 0, () => {
      if (!source || source._refCount <= 0 || 0 < --source._refCount) {
        connection = null;
        return;
      }
      const sharedConnection = source._connection;
      const conn = connection;
      connection = null;
      if (sharedConnection && (!conn || sharedConnection === conn)) {
        sharedConnection.unsubscribe();
      }
      subscriber.unsubscribe();
    });
    source.subscribe(refCounter);
    if (!refCounter.closed) {
      connection = source.connect();
    }
  });
}

// node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js
var ConnectableObservable = class extends Observable {
  constructor(source, subjectFactory) {
    super();
    this.source = source;
    this.subjectFactory = subjectFactory;
    this._subject = null;
    this._refCount = 0;
    this._connection = null;
    if (hasLift(source)) {
      this.lift = source.lift;
    }
  }
  _subscribe(subscriber) {
    return this.getSubject().subscribe(subscriber);
  }
  getSubject() {
    const subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  }
  _teardown() {
    this._refCount = 0;
    const {
      _connection
    } = this;
    this._subject = this._connection = null;
    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
  }
  connect() {
    let connection = this._connection;
    if (!connection) {
      connection = this._connection = new Subscription();
      const subject = this.getSubject();
      connection.add(this.source.subscribe(createOperatorSubscriber(subject, void 0, () => {
        this._teardown();
        subject.complete();
      }, (err) => {
        this._teardown();
        subject.error(err);
      }, () => this._teardown())));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  }
  refCount() {
    return refCount()(this);
  }
};

// node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
  _super(this);
  this.name = "ObjectUnsubscribedError";
  this.message = "object unsubscribed";
});

// node_modules/rxjs/dist/esm/internal/Subject.js
var Subject = /* @__PURE__ */ (() => {
  class Subject2 extends Observable {
    constructor() {
      super();
      this.closed = false;
      this.currentObservers = null;
      this.observers = [];
      this.isStopped = false;
      this.hasError = false;
      this.thrownError = null;
    }
    lift(operator) {
      const subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    }
    _throwIfClosed() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    }
    next(value) {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          if (!this.currentObservers) {
            this.currentObservers = Array.from(this.observers);
          }
          for (const observer of this.currentObservers) {
            observer.next(value);
          }
        }
      });
    }
    error(err) {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          this.hasError = this.isStopped = true;
          this.thrownError = err;
          const {
            observers
          } = this;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    }
    complete() {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          this.isStopped = true;
          const {
            observers
          } = this;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    }
    unsubscribe() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    }
    get observed() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    _trySubscribe(subscriber) {
      this._throwIfClosed();
      return super._trySubscribe(subscriber);
    }
    _subscribe(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    }
    _innerSubscribe(subscriber) {
      const {
        hasError,
        isStopped,
        observers
      } = this;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(() => {
        this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    }
    _checkFinalizedStatuses(subscriber) {
      const {
        hasError,
        thrownError,
        isStopped
      } = this;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    }
    asObservable() {
      const observable2 = new Observable();
      observable2.source = this;
      return observable2;
    }
  }
  Subject2.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
})();
var AnonymousSubject = class extends Subject {
  constructor(destination, source) {
    super();
    this.destination = destination;
    this.source = source;
  }
  next(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  }
  error(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  }
  complete() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  _subscribe(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  }
};

// node_modules/rxjs/dist/esm/internal/BehaviorSubject.js
var BehaviorSubject = class extends Subject {
  constructor(_value) {
    super();
    this._value = _value;
  }
  get value() {
    return this.getValue();
  }
  _subscribe(subscriber) {
    const subscription = super._subscribe(subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  }
  getValue() {
    const {
      hasError,
      thrownError,
      _value
    } = this;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  }
  next(value) {
    super.next(this._value = value);
  }
};

// node_modules/rxjs/dist/esm/internal/observable/empty.js
var EMPTY = new Observable((subscriber) => subscriber.complete());

// node_modules/rxjs/dist/esm/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

// node_modules/tslib/tslib.es6.mjs
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return {
          value: o && o[i++],
          done: !o
        };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f)
        i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({
        value: v2,
        done: d
      });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm/internal/util/isArrayLike.js
var isArrayLike = (x) => x && typeof x.length === "number" && typeof x !== "function";

// node_modules/rxjs/dist/esm/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError(`You provided ${input !== null && typeof input === "object" ? "an invalid object" : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
}

// node_modules/rxjs/dist/esm/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function* readableStreamLikeToAsyncGenerator_1() {
    const reader = readableStream.getReader();
    try {
      while (true) {
        const {
          value,
          done
        } = yield __await(reader.read());
        if (done) {
          return yield __await(void 0);
        }
        yield yield __await(value);
      }
    } finally {
      reader.releaseLock();
    }
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable((subscriber) => {
    const obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable((subscriber) => {
    for (let i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable((subscriber) => {
    promise.then((value) => {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, (err) => subscriber.error(err)).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable((subscriber) => {
    for (const value of iterable) {
      subscriber.next(value);
      if (subscriber.closed) {
        return;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable((subscriber) => {
    process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_1, _a;
  return __awaiter(this, void 0, void 0, function* () {
    try {
      for (asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done; ) {
        const value = asyncIterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))
          yield _a.call(asyncIterable_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    subscriber.complete();
  });
}

// node_modules/rxjs/dist/esm/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler, work, delay = 0, repeat = false) {
  const scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm/internal/operators/observeOn.js
function observeOn(scheduler, delay = 0) {
  return operate((source, subscriber) => {
    source.subscribe(createOperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler, () => subscriber.error(err), delay)));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/subscribeOn.js
function subscribeOn(scheduler, delay = 0) {
  return operate((source, subscriber) => {
    subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler) {
  return new Observable((subscriber) => {
    let i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler) {
  return new Observable((subscriber) => {
    let iterator2;
    executeSchedule(subscriber, scheduler, () => {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, () => {
        let value;
        let done;
        try {
          ({
            value,
            done
          } = iterator2.next());
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return () => isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable((subscriber) => {
    executeSchedule(subscriber, scheduler, () => {
      const iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, () => {
        iterator2.next().then((result) => {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduled.js
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm/internal/observable/from.js
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

// node_modules/rxjs/dist/esm/internal/observable/of.js
function of(...args) {
  const scheduler = popScheduler(args);
  return from(args, scheduler);
}

// node_modules/rxjs/dist/esm/internal/observable/throwError.js
function throwError(errorOrErrorFactory, scheduler) {
  const errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
  const init = (subscriber) => subscriber.error(errorFactory());
  return new Observable(scheduler ? (subscriber) => scheduler.schedule(init, 0, subscriber) : init);
}

// node_modules/rxjs/dist/esm/internal/util/isObservable.js
function isObservable(obj) {
  return !!obj && (obj instanceof Observable || isFunction(obj.lift) && isFunction(obj.subscribe));
}

// node_modules/rxjs/dist/esm/internal/util/EmptyError.js
var EmptyError = createErrorClass((_super) => function EmptyErrorImpl() {
  _super(this);
  this.name = "EmptyError";
  this.message = "no elements in sequence";
});

// node_modules/rxjs/dist/esm/internal/operators/map.js
function map(project, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/util/mapOneOrManyArgs.js
var {
  isArray
} = Array;
function callOrApply(fn, args) {
  return isArray(args) ? fn(...args) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map((args) => callOrApply(fn, args));
}

// node_modules/rxjs/dist/esm/internal/util/argsArgArrayOrObject.js
var {
  isArray: isArray2
} = Array;
var {
  getPrototypeOf,
  prototype: objectProto,
  keys: getKeys
} = Object;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    const first2 = args[0];
    if (isArray2(first2)) {
      return {
        args: first2,
        keys: null
      };
    }
    if (isPOJO(first2)) {
      const keys = getKeys(first2);
      return {
        args: keys.map((key) => first2[key]),
        keys
      };
    }
  }
  return {
    args,
    keys: null
  };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}

// node_modules/rxjs/dist/esm/internal/util/createObject.js
function createObject(keys, values) {
  return keys.reduce((result, key, i) => (result[key] = values[i], result), {});
}

// node_modules/rxjs/dist/esm/internal/observable/combineLatest.js
function combineLatest(...args) {
  const scheduler = popScheduler(args);
  const resultSelector = popResultSelector(args);
  const {
    args: observables,
    keys
  } = argsArgArrayOrObject(args);
  if (observables.length === 0) {
    return from([], scheduler);
  }
  const result = new Observable(combineLatestInit(observables, scheduler, keys ? (values) => createObject(keys, values) : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform = identity) {
  return (subscriber) => {
    maybeSchedule(scheduler, () => {
      const {
        length
      } = observables;
      const values = new Array(length);
      let active = length;
      let remainingFirstValues = length;
      for (let i = 0; i < length; i++) {
        maybeSchedule(scheduler, () => {
          const source = from(observables[i], scheduler);
          let hasFirstValue = false;
          source.subscribe(createOperatorSubscriber(subscriber, (value) => {
            values[i] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, () => {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}

// node_modules/rxjs/dist/esm/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  const buffer = [];
  let active = 0;
  let index = 0;
  let isComplete = false;
  const checkComplete = () => {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  const outerNext = (value) => active < concurrent ? doInnerSub(value) : buffer.push(value);
  const doInnerSub = (value) => {
    expand && subscriber.next(value);
    active++;
    let innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, (innerValue) => {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, () => {
      innerComplete = true;
    }, void 0, () => {
      if (innerComplete) {
        try {
          active--;
          while (buffer.length && active < concurrent) {
            const bufferedValue = buffer.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
            } else {
              doInnerSub(bufferedValue);
            }
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, () => {
    isComplete = true;
    checkComplete();
  }));
  return () => {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent = Infinity) {
  if (isFunction(resultSelector)) {
    return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
}

// node_modules/rxjs/dist/esm/internal/operators/mergeAll.js
function mergeAll(concurrent = Infinity) {
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm/internal/operators/concatAll.js
function concatAll() {
  return mergeAll(1);
}

// node_modules/rxjs/dist/esm/internal/observable/concat.js
function concat(...args) {
  return concatAll()(from(args, popScheduler(args)));
}

// node_modules/rxjs/dist/esm/internal/observable/defer.js
function defer(observableFactory) {
  return new Observable((subscriber) => {
    innerFrom(observableFactory()).subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm/internal/observable/forkJoin.js
function forkJoin(...args) {
  const resultSelector = popResultSelector(args);
  const {
    args: sources,
    keys
  } = argsArgArrayOrObject(args);
  const result = new Observable((subscriber) => {
    const {
      length
    } = sources;
    if (!length) {
      subscriber.complete();
      return;
    }
    const values = new Array(length);
    let remainingCompletions = length;
    let remainingEmissions = length;
    for (let sourceIndex = 0; sourceIndex < length; sourceIndex++) {
      let hasValue = false;
      innerFrom(sources[sourceIndex]).subscribe(createOperatorSubscriber(subscriber, (value) => {
        if (!hasValue) {
          hasValue = true;
          remainingEmissions--;
        }
        values[sourceIndex] = value;
      }, () => remainingCompletions--, void 0, () => {
        if (!remainingCompletions || !hasValue) {
          if (!remainingEmissions) {
            subscriber.next(keys ? createObject(keys, values) : values);
          }
          subscriber.complete();
        }
      }));
    }
  });
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}

// node_modules/rxjs/dist/esm/internal/observable/merge.js
function merge(...args) {
  const scheduler = popScheduler(args);
  const concurrent = popNumber(args, Infinity);
  const sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}

// node_modules/rxjs/dist/esm/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value)));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/catchError.js
function catchError(selector) {
  return operate((source, subscriber) => {
    let innerSub = null;
    let syncUnsub = false;
    let handledResult;
    innerSub = source.subscribe(createOperatorSubscriber(subscriber, void 0, void 0, (err) => {
      handledResult = innerFrom(selector(err, catchError(selector)(source)));
      if (innerSub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      } else {
        syncUnsub = true;
      }
    }));
    if (syncUnsub) {
      innerSub.unsubscribe();
      innerSub = null;
      handledResult.subscribe(subscriber);
    }
  });
}

// node_modules/rxjs/dist/esm/internal/operators/scanInternals.js
function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return (source, subscriber) => {
    let hasState = hasSeed;
    let state = seed;
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      const i = index++;
      state = hasState ? accumulator(state, value, i) : (hasState = true, value);
      emitOnNext && subscriber.next(state);
    }, emitBeforeComplete && (() => {
      hasState && subscriber.next(state);
      subscriber.complete();
    })));
  };
}

// node_modules/rxjs/dist/esm/internal/operators/concatMap.js
function concatMap(project, resultSelector) {
  return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
}

// node_modules/rxjs/dist/esm/internal/operators/defaultIfEmpty.js
function defaultIfEmpty(defaultValue) {
  return operate((source, subscriber) => {
    let hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      hasValue = true;
      subscriber.next(value);
    }, () => {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/take.js
function take(count) {
  return count <= 0 ? () => EMPTY : operate((source, subscriber) => {
    let seen = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      if (++seen <= count) {
        subscriber.next(value);
        if (count <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/mapTo.js
function mapTo(value) {
  return map(() => value);
}

// node_modules/rxjs/dist/esm/internal/operators/distinctUntilChanged.js
function distinctUntilChanged(comparator, keySelector = identity) {
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return operate((source, subscriber) => {
    let previousKey;
    let first2 = true;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      const currentKey = keySelector(value);
      if (first2 || !comparator(previousKey, currentKey)) {
        first2 = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a, b) {
  return a === b;
}

// node_modules/rxjs/dist/esm/internal/operators/throwIfEmpty.js
function throwIfEmpty(errorFactory = defaultErrorFactory) {
  return operate((source, subscriber) => {
    let hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      hasValue = true;
      subscriber.next(value);
    }, () => hasValue ? subscriber.complete() : subscriber.error(errorFactory())));
  });
}
function defaultErrorFactory() {
  return new EmptyError();
}

// node_modules/rxjs/dist/esm/internal/operators/finalize.js
function finalize(callback) {
  return operate((source, subscriber) => {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}

// node_modules/rxjs/dist/esm/internal/operators/first.js
function first(predicate, defaultValue) {
  const hasDefaultValue = arguments.length >= 2;
  return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

// node_modules/rxjs/dist/esm/internal/operators/takeLast.js
function takeLast(count) {
  return count <= 0 ? () => EMPTY : operate((source, subscriber) => {
    let buffer = [];
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      buffer.push(value);
      count < buffer.length && buffer.shift();
    }, () => {
      for (const value of buffer) {
        subscriber.next(value);
      }
      subscriber.complete();
    }, void 0, () => {
      buffer = null;
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/last.js
function last2(predicate, defaultValue) {
  const hasDefaultValue = arguments.length >= 2;
  return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

// node_modules/rxjs/dist/esm/internal/operators/scan.js
function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}

// node_modules/rxjs/dist/esm/internal/operators/share.js
function share(options = {}) {
  const {
    connector = () => new Subject(),
    resetOnError = true,
    resetOnComplete = true,
    resetOnRefCountZero = true
  } = options;
  return (wrapperSource) => {
    let connection;
    let resetConnection;
    let subject;
    let refCount2 = 0;
    let hasCompleted = false;
    let hasErrored = false;
    const cancelReset = () => {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    const reset = () => {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    const resetAndUnsubscribe = () => {
      const conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate((source, subscriber) => {
      refCount2++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      const dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(() => {
        refCount2--;
        if (refCount2 === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount2 > 0) {
        connection = new SafeSubscriber({
          next: (value) => dest.next(value),
          error: (err) => {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: () => {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on, ...args) {
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  const onSubscriber = new SafeSubscriber({
    next: () => {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on(...args)).subscribe(onSubscriber);
}

// node_modules/rxjs/dist/esm/internal/operators/startWith.js
function startWith(...values) {
  const scheduler = popScheduler(values);
  return operate((source, subscriber) => {
    (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm/internal/operators/switchMap.js
function switchMap(project, resultSelector) {
  return operate((source, subscriber) => {
    let innerSubscriber = null;
    let index = 0;
    let isComplete = false;
    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      let innerIndex = 0;
      const outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
        innerSubscriber = null;
        checkComplete();
      }));
    }, () => {
      isComplete = true;
      checkComplete();
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/takeUntil.js
function takeUntil(notifier) {
  return operate((source, subscriber) => {
    innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, () => subscriber.complete(), noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm/internal/operators/tap.js
function tap(observerOrNext, error, complete) {
  const tapObserver = isFunction(observerOrNext) || error || complete ? {
    next: observerOrNext,
    error,
    complete
  } : observerOrNext;
  return tapObserver ? operate((source, subscriber) => {
    var _a;
    (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
    let isUnsub = true;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      var _a2;
      (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
      subscriber.next(value);
    }, () => {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      subscriber.complete();
    }, (err) => {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
      subscriber.error(err);
    }, () => {
      var _a2, _b;
      if (isUnsub) {
        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity;
}

// node_modules/@angular/core/fesm2022/core.mjs
function getClosureSafeProperty(objWithPropertyToExtract) {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty) {
      return key;
    }
  }
  throw Error("Could not find renamed property on target object.");
}
function fillProperties(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}
function stringify(token) {
  if (typeof token === "string") {
    return token;
  }
  if (Array.isArray(token)) {
    return "[" + token.map(stringify).join(", ") + "]";
  }
  if (token == null) {
    return "" + token;
  }
  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }
  if (token.name) {
    return `${token.name}`;
  }
  const res = token.toString();
  if (res == null) {
    return "" + res;
  }
  const newLineIndex = res.indexOf("\n");
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
function concatStringsWithSpace(before, after) {
  return before == null || before === "" ? after === null ? "" : after : after == null || after === "" ? before : before + " " + after;
}
var __forward_ref__ = /* @__PURE__ */ getClosureSafeProperty({
  __forward_ref__: getClosureSafeProperty
});
function forwardRef(forwardRefFn) {
  forwardRefFn.__forward_ref__ = forwardRef;
  forwardRefFn.toString = function() {
    return stringify(this());
  };
  return forwardRefFn;
}
function resolveForwardRef(type) {
  return isForwardRef(type) ? type() : type;
}
function isForwardRef(fn) {
  return typeof fn === "function" && fn.hasOwnProperty(__forward_ref__) && fn.__forward_ref__ === forwardRef;
}
function isEnvironmentProviders(value) {
  return value && !!value.\u0275providers;
}
var ERROR_DETAILS_PAGE_BASE_URL = "https://angular.io/errors";
var XSS_SECURITY_URL = "https://g.co/ng/security#xss";
var RuntimeError = class extends Error {
  constructor(code, message) {
    super(formatRuntimeError(code, message));
    this.code = code;
  }
};
function formatRuntimeError(code, message) {
  const fullCode = `NG0${Math.abs(code)}`;
  let errorMessage = `${fullCode}${message ? ": " + message : ""}`;
  if (ngDevMode && code < 0) {
    const addPeriodSeparator = !errorMessage.match(/[.,;!?\n]$/);
    const separator = addPeriodSeparator ? "." : "";
    errorMessage = `${errorMessage}${separator} Find more at ${ERROR_DETAILS_PAGE_BASE_URL}/${fullCode}`;
  }
  return errorMessage;
}
function renderStringify(value) {
  if (typeof value === "string")
    return value;
  if (value == null)
    return "";
  return String(value);
}
function stringifyForError(value) {
  if (typeof value === "function")
    return value.name || value.toString();
  if (typeof value === "object" && value != null && typeof value.type === "function") {
    return value.type.name || value.type.toString();
  }
  return renderStringify(value);
}
function throwCyclicDependencyError(token, path) {
  const depPath = path ? `. Dependency path: ${path.join(" > ")} > ${token}` : "";
  throw new RuntimeError(-200, `Circular dependency in DI detected for ${token}${depPath}`);
}
function throwMixedMultiProviderError() {
  throw new Error(`Cannot mix multi providers and regular providers`);
}
function throwInvalidProviderError(ngModuleType, providers, provider) {
  if (ngModuleType && providers) {
    const providerDetail = providers.map((v) => v == provider ? "?" + provider + "?" : "...");
    throw new Error(`Invalid provider for the NgModule '${stringify(ngModuleType)}' - only instances of Provider and Type are allowed, got: [${providerDetail.join(", ")}]`);
  } else if (isEnvironmentProviders(provider)) {
    if (provider.\u0275fromNgModule) {
      throw new RuntimeError(207, `Invalid providers from 'importProvidersFrom' present in a non-environment injector. 'importProvidersFrom' can't be used for component providers.`);
    } else {
      throw new RuntimeError(207, `Invalid providers present in a non-environment injector. 'EnvironmentProviders' can't be used for component providers.`);
    }
  } else {
    throw new Error("Invalid provider");
  }
}
function throwProviderNotFoundError(token, injectorName) {
  const injectorDetails = injectorName ? ` in ${injectorName}` : "";
  throw new RuntimeError(-201, ngDevMode && `No provider for ${stringifyForError(token)} found${injectorDetails}`);
}
function assertNumber(actual, msg) {
  if (!(typeof actual === "number")) {
    throwError2(msg, typeof actual, "number", "===");
  }
}
function assertNumberInRange(actual, minInclusive, maxInclusive) {
  assertNumber(actual, "Expected a number");
  assertLessThanOrEqual(actual, maxInclusive, "Expected number to be less than or equal to");
  assertGreaterThanOrEqual(actual, minInclusive, "Expected number to be greater than or equal to");
}
function assertString(actual, msg) {
  if (!(typeof actual === "string")) {
    throwError2(msg, actual === null ? "null" : typeof actual, "string", "===");
  }
}
function assertFunction(actual, msg) {
  if (!(typeof actual === "function")) {
    throwError2(msg, actual === null ? "null" : typeof actual, "function", "===");
  }
}
function assertEqual(actual, expected, msg) {
  if (!(actual == expected)) {
    throwError2(msg, actual, expected, "==");
  }
}
function assertNotEqual(actual, expected, msg) {
  if (!(actual != expected)) {
    throwError2(msg, actual, expected, "!=");
  }
}
function assertSame(actual, expected, msg) {
  if (!(actual === expected)) {
    throwError2(msg, actual, expected, "===");
  }
}
function assertNotSame(actual, expected, msg) {
  if (!(actual !== expected)) {
    throwError2(msg, actual, expected, "!==");
  }
}
function assertLessThan(actual, expected, msg) {
  if (!(actual < expected)) {
    throwError2(msg, actual, expected, "<");
  }
}
function assertLessThanOrEqual(actual, expected, msg) {
  if (!(actual <= expected)) {
    throwError2(msg, actual, expected, "<=");
  }
}
function assertGreaterThan(actual, expected, msg) {
  if (!(actual > expected)) {
    throwError2(msg, actual, expected, ">");
  }
}
function assertGreaterThanOrEqual(actual, expected, msg) {
  if (!(actual >= expected)) {
    throwError2(msg, actual, expected, ">=");
  }
}
function assertDefined(actual, msg) {
  if (actual == null) {
    throwError2(msg, actual, null, "!=");
  }
}
function throwError2(msg, actual, expected, comparison) {
  throw new Error(`ASSERTION ERROR: ${msg}` + (comparison == null ? "" : ` [Expected=> ${expected} ${comparison} ${actual} <=Actual]`));
}
function assertDomNode(node) {
  if (!(node instanceof Node)) {
    throwError2(`The provided value must be an instance of a DOM Node but got ${stringify(node)}`);
  }
}
function assertIndexInRange(arr, index) {
  assertDefined(arr, "Array must be defined.");
  const maxLen = arr.length;
  if (index < 0 || index >= maxLen) {
    throwError2(`Index expected to be less than ${maxLen} but got ${index}`);
  }
}
function \u0275\u0275defineInjectable(opts) {
  return {
    token: opts.token,
    providedIn: opts.providedIn || null,
    factory: opts.factory,
    value: void 0
  };
}
function \u0275\u0275defineInjector(options) {
  return {
    providers: options.providers || [],
    imports: options.imports || []
  };
}
function getInjectableDef(type) {
  return getOwnDefinition(type, NG_PROV_DEF) || getOwnDefinition(type, NG_INJECTABLE_DEF);
}
function isInjectable(type) {
  return getInjectableDef(type) !== null;
}
function getOwnDefinition(type, field) {
  return type.hasOwnProperty(field) ? type[field] : null;
}
function getInheritedInjectableDef(type) {
  const def = type && (type[NG_PROV_DEF] || type[NG_INJECTABLE_DEF]);
  if (def) {
    ngDevMode && console.warn(`DEPRECATED: DI is instantiating a token "${type.name}" that inherits its @Injectable decorator but does not provide one itself.
This will become an error in a future version of Angular. Please add @Injectable() to the "${type.name}" class.`);
    return def;
  } else {
    return null;
  }
}
function getInjectorDef(type) {
  return type && (type.hasOwnProperty(NG_INJ_DEF) || type.hasOwnProperty(NG_INJECTOR_DEF)) ? type[NG_INJ_DEF] : null;
}
var NG_PROV_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275prov: getClosureSafeProperty
});
var NG_INJ_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275inj: getClosureSafeProperty
});
var NG_INJECTABLE_DEF = /* @__PURE__ */ getClosureSafeProperty({
  ngInjectableDef: getClosureSafeProperty
});
var NG_INJECTOR_DEF = /* @__PURE__ */ getClosureSafeProperty({
  ngInjectorDef: getClosureSafeProperty
});
var InjectFlags = /* @__PURE__ */ function(InjectFlags2) {
  InjectFlags2[InjectFlags2["Default"] = 0] = "Default";
  InjectFlags2[InjectFlags2["Host"] = 1] = "Host";
  InjectFlags2[InjectFlags2["Self"] = 2] = "Self";
  InjectFlags2[InjectFlags2["SkipSelf"] = 4] = "SkipSelf";
  InjectFlags2[InjectFlags2["Optional"] = 8] = "Optional";
  return InjectFlags2;
}(InjectFlags || {});
var _injectImplementation;
function getInjectImplementation() {
  return _injectImplementation;
}
function setInjectImplementation(impl) {
  const previous = _injectImplementation;
  _injectImplementation = impl;
  return previous;
}
function injectRootLimpMode(token, notFoundValue, flags) {
  const injectableDef = getInjectableDef(token);
  if (injectableDef && injectableDef.providedIn == "root") {
    return injectableDef.value === void 0 ? injectableDef.value = injectableDef.factory() : injectableDef.value;
  }
  if (flags & InjectFlags.Optional)
    return null;
  if (notFoundValue !== void 0)
    return notFoundValue;
  throwProviderNotFoundError(stringify(token), "Injector");
}
function assertInjectImplementationNotEqual(fn) {
  ngDevMode && assertNotEqual(_injectImplementation, fn, "Calling \u0275\u0275inject would cause infinite recursion");
}
var _global = globalThis;
function ngDevModeResetPerfCounters() {
  const locationString = typeof location !== "undefined" ? location.toString() : "";
  const newCounters = {
    namedConstructors: locationString.indexOf("ngDevMode=namedConstructors") != -1,
    firstCreatePass: 0,
    tNode: 0,
    tView: 0,
    rendererCreateTextNode: 0,
    rendererSetText: 0,
    rendererCreateElement: 0,
    rendererAddEventListener: 0,
    rendererSetAttribute: 0,
    rendererRemoveAttribute: 0,
    rendererSetProperty: 0,
    rendererSetClassName: 0,
    rendererAddClass: 0,
    rendererRemoveClass: 0,
    rendererSetStyle: 0,
    rendererRemoveStyle: 0,
    rendererDestroy: 0,
    rendererDestroyNode: 0,
    rendererMoveNode: 0,
    rendererRemoveNode: 0,
    rendererAppendChild: 0,
    rendererInsertBefore: 0,
    rendererCreateComment: 0,
    hydratedNodes: 0,
    hydratedComponents: 0,
    dehydratedViewsRemoved: 0,
    dehydratedViewsCleanupRuns: 0,
    componentsSkippedHydration: 0
  };
  const allowNgDevModeTrue = locationString.indexOf("ngDevMode=false") === -1;
  _global["ngDevMode"] = allowNgDevModeTrue && newCounters;
  return newCounters;
}
function initNgDevMode() {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (typeof ngDevMode !== "object") {
      ngDevModeResetPerfCounters();
    }
    return typeof ngDevMode !== "undefined" && !!ngDevMode;
  }
  return false;
}
var InjectionToken = class {
  /**
   * @param _desc   Description for the token,
   *                used only for debugging purposes,
   *                it should but does not need to be unique
   * @param options Options for the token's usage, as described above
   */
  constructor(_desc, options) {
    this._desc = _desc;
    this.ngMetadataName = "InjectionToken";
    this.\u0275prov = void 0;
    if (typeof options == "number") {
      (typeof ngDevMode === "undefined" || ngDevMode) && assertLessThan(options, 0, "Only negative numbers are supported here");
      this.__NG_ELEMENT_ID__ = options;
    } else if (options !== void 0) {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: this,
        providedIn: options.providedIn || "root",
        factory: options.factory
      });
    }
  }
  /**
   * @internal
   */
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var _injectorProfilerContext;
function getInjectorProfilerContext() {
  !ngDevMode && throwError2("getInjectorProfilerContext should never be called in production mode");
  return _injectorProfilerContext;
}
function setInjectorProfilerContext(context2) {
  !ngDevMode && throwError2("setInjectorProfilerContext should never be called in production mode");
  const previous = _injectorProfilerContext;
  _injectorProfilerContext = context2;
  return previous;
}
var injectorProfilerCallback = null;
var setInjectorProfiler = (injectorProfiler2) => {
  !ngDevMode && throwError2("setInjectorProfiler should never be called in production mode");
  injectorProfilerCallback = injectorProfiler2;
};
function injectorProfiler(event) {
  !ngDevMode && throwError2("Injector profiler should never be called in production mode");
  if (injectorProfilerCallback != null) {
    injectorProfilerCallback(event);
  }
}
function emitProviderConfiguredEvent(eventProvider, isViewProvider = false) {
  !ngDevMode && throwError2("Injector profiler should never be called in production mode");
  let token;
  if (typeof eventProvider === "function") {
    token = eventProvider;
  } else if (eventProvider instanceof InjectionToken) {
    token = eventProvider;
  } else {
    token = resolveForwardRef(eventProvider.provide);
  }
  let provider = eventProvider;
  if (eventProvider instanceof InjectionToken) {
    provider = eventProvider.\u0275prov || eventProvider;
  }
  injectorProfiler({
    type: 2,
    context: getInjectorProfilerContext(),
    providerRecord: {
      token,
      provider,
      isViewProvider
    }
  });
}
function emitInstanceCreatedByInjectorEvent(instance) {
  !ngDevMode && throwError2("Injector profiler should never be called in production mode");
  injectorProfiler({
    type: 1,
    context: getInjectorProfilerContext(),
    instance: {
      value: instance
    }
  });
}
function emitInjectEvent(token, value, flags) {
  !ngDevMode && throwError2("Injector profiler should never be called in production mode");
  injectorProfiler({
    type: 0,
    context: getInjectorProfilerContext(),
    service: {
      token,
      value,
      flags
    }
  });
}
function runInInjectorProfilerContext(injector, token, callback) {
  !ngDevMode && throwError2("runInInjectorProfilerContext should never be called in production mode");
  const prevInjectContext = setInjectorProfilerContext({
    injector,
    token
  });
  try {
    callback();
  } finally {
    setInjectorProfilerContext(prevInjectContext);
  }
}
var _THROW_IF_NOT_FOUND = {};
var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var DI_DECORATOR_FLAG = "__NG_DI_FLAG__";
var NG_TEMP_TOKEN_PATH = "ngTempTokenPath";
var NG_TOKEN_PATH = "ngTokenPath";
var NEW_LINE = /\n/gm;
var NO_NEW_LINE = "\u0275";
var SOURCE = "__source";
var _currentInjector = void 0;
function setCurrentInjector(injector) {
  const former = _currentInjector;
  _currentInjector = injector;
  return former;
}
function injectInjectorOnly(token, flags = InjectFlags.Default) {
  if (_currentInjector === void 0) {
    throw new RuntimeError(-203, ngDevMode && `inject() must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with \`runInInjectionContext\`.`);
  } else if (_currentInjector === null) {
    return injectRootLimpMode(token, void 0, flags);
  } else {
    const value = _currentInjector.get(token, flags & InjectFlags.Optional ? null : void 0, flags);
    ngDevMode && emitInjectEvent(token, value, flags);
    return value;
  }
}
function \u0275\u0275inject(token, flags = InjectFlags.Default) {
  return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}
function inject(token, flags = InjectFlags.Default) {
  return \u0275\u0275inject(token, convertToBitFlags(flags));
}
function convertToBitFlags(flags) {
  if (typeof flags === "undefined" || typeof flags === "number") {
    return flags;
  }
  return 0 | // comment to force a line break in the formatter
  (flags.optional && 8) | (flags.host && 1) | (flags.self && 2) | (flags.skipSelf && 4);
}
function injectArgs(types) {
  const args = [];
  for (let i = 0; i < types.length; i++) {
    const arg = resolveForwardRef(types[i]);
    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        throw new RuntimeError(900, ngDevMode && "Arguments array must have arguments.");
      }
      let type = void 0;
      let flags = InjectFlags.Default;
      for (let j = 0; j < arg.length; j++) {
        const meta = arg[j];
        const flag = getInjectFlag(meta);
        if (typeof flag === "number") {
          if (flag === -1) {
            type = meta.token;
          } else {
            flags |= flag;
          }
        } else {
          type = meta;
        }
      }
      args.push(\u0275\u0275inject(type, flags));
    } else {
      args.push(\u0275\u0275inject(arg));
    }
  }
  return args;
}
function attachInjectFlag(decorator, flag) {
  decorator[DI_DECORATOR_FLAG] = flag;
  decorator.prototype[DI_DECORATOR_FLAG] = flag;
  return decorator;
}
function getInjectFlag(token) {
  return token[DI_DECORATOR_FLAG];
}
function catchInjectorError(e, token, injectorErrorName, source) {
  const tokenPath = e[NG_TEMP_TOKEN_PATH];
  if (token[SOURCE]) {
    tokenPath.unshift(token[SOURCE]);
  }
  e.message = formatError("\n" + e.message, tokenPath, injectorErrorName, source);
  e[NG_TOKEN_PATH] = tokenPath;
  e[NG_TEMP_TOKEN_PATH] = null;
  throw e;
}
function formatError(text, obj, injectorErrorName, source = null) {
  text = text && text.charAt(0) === "\n" && text.charAt(1) == NO_NEW_LINE ? text.slice(2) : text;
  let context2 = stringify(obj);
  if (Array.isArray(obj)) {
    context2 = obj.map(stringify).join(" -> ");
  } else if (typeof obj === "object") {
    let parts = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        parts.push(key + ":" + (typeof value === "string" ? JSON.stringify(value) : stringify(value)));
      }
    }
    context2 = `{${parts.join(", ")}}`;
  }
  return `${injectorErrorName}${source ? "(" + source + ")" : ""}[${context2}]: ${text.replace(NEW_LINE, "\n  ")}`;
}
function noSideEffects(fn) {
  return {
    toString: fn
  }.toString();
}
var ChangeDetectionStrategy = /* @__PURE__ */ function(ChangeDetectionStrategy2) {
  ChangeDetectionStrategy2[ChangeDetectionStrategy2["OnPush"] = 0] = "OnPush";
  ChangeDetectionStrategy2[ChangeDetectionStrategy2["Default"] = 1] = "Default";
  return ChangeDetectionStrategy2;
}(ChangeDetectionStrategy || {});
var ViewEncapsulation$1 = /* @__PURE__ */ function(ViewEncapsulation) {
  ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
  ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
  ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
  return ViewEncapsulation;
}(ViewEncapsulation$1 || {});
var EMPTY_OBJ = {};
var EMPTY_ARRAY = [];
if ((typeof ngDevMode === "undefined" || ngDevMode) && /* @__PURE__ */ initNgDevMode()) {
  /* @__PURE__ */ Object.freeze(EMPTY_OBJ);
  /* @__PURE__ */ Object.freeze(EMPTY_ARRAY);
}
var NG_COMP_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275cmp: getClosureSafeProperty
});
var NG_DIR_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275dir: getClosureSafeProperty
});
var NG_PIPE_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275pipe: getClosureSafeProperty
});
var NG_MOD_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275mod: getClosureSafeProperty
});
var NG_FACTORY_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275fac: getClosureSafeProperty
});
var NG_ELEMENT_ID = /* @__PURE__ */ getClosureSafeProperty({
  __NG_ELEMENT_ID__: getClosureSafeProperty
});
var NG_ENV_ID = /* @__PURE__ */ getClosureSafeProperty({
  __NG_ENV_ID__: getClosureSafeProperty
});
function classIndexOf(className, classToSearch, startingIndex) {
  ngDevMode && assertNotEqual(classToSearch, "", 'can not look for "" string.');
  let end = className.length;
  while (true) {
    const foundIndex = className.indexOf(classToSearch, startingIndex);
    if (foundIndex === -1)
      return foundIndex;
    if (foundIndex === 0 || className.charCodeAt(foundIndex - 1) <= 32) {
      const length = classToSearch.length;
      if (foundIndex + length === end || className.charCodeAt(foundIndex + length) <= 32) {
        return foundIndex;
      }
    }
    startingIndex = foundIndex + 1;
  }
}
function setUpAttributes(renderer, native, attrs) {
  let i = 0;
  while (i < attrs.length) {
    const value = attrs[i];
    if (typeof value === "number") {
      if (value !== 0) {
        break;
      }
      i++;
      const namespaceURI = attrs[i++];
      const attrName = attrs[i++];
      const attrVal = attrs[i++];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      renderer.setAttribute(native, attrName, attrVal, namespaceURI);
    } else {
      const attrName = value;
      const attrVal = attrs[++i];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      if (isAnimationProp(attrName)) {
        renderer.setProperty(native, attrName, attrVal);
      } else {
        renderer.setAttribute(native, attrName, attrVal);
      }
      i++;
    }
  }
  return i;
}
function isNameOnlyAttributeMarker(marker) {
  return marker === 3 || marker === 4 || marker === 6;
}
function isAnimationProp(name) {
  return name.charCodeAt(0) === 64;
}
function mergeHostAttrs(dst, src) {
  if (src === null || src.length === 0) {
  } else if (dst === null || dst.length === 0) {
    dst = src.slice();
  } else {
    let srcMarker = -1;
    for (let i = 0; i < src.length; i++) {
      const item = src[i];
      if (typeof item === "number") {
        srcMarker = item;
      } else {
        if (srcMarker === 0) {
        } else if (srcMarker === -1 || srcMarker === 2) {
          mergeHostAttribute(dst, srcMarker, item, null, src[++i]);
        } else {
          mergeHostAttribute(dst, srcMarker, item, null, null);
        }
      }
    }
  }
  return dst;
}
function mergeHostAttribute(dst, marker, key1, key2, value) {
  let i = 0;
  let markerInsertPosition = dst.length;
  if (marker === -1) {
    markerInsertPosition = -1;
  } else {
    while (i < dst.length) {
      const dstValue = dst[i++];
      if (typeof dstValue === "number") {
        if (dstValue === marker) {
          markerInsertPosition = -1;
          break;
        } else if (dstValue > marker) {
          markerInsertPosition = i - 1;
          break;
        }
      }
    }
  }
  while (i < dst.length) {
    const item = dst[i];
    if (typeof item === "number") {
      break;
    } else if (item === key1) {
      if (key2 === null) {
        if (value !== null) {
          dst[i + 1] = value;
        }
        return;
      } else if (key2 === dst[i + 1]) {
        dst[i + 2] = value;
        return;
      }
    }
    i++;
    if (key2 !== null)
      i++;
    if (value !== null)
      i++;
  }
  if (markerInsertPosition !== -1) {
    dst.splice(markerInsertPosition, 0, marker);
    i = markerInsertPosition + 1;
  }
  dst.splice(i++, 0, key1);
  if (key2 !== null) {
    dst.splice(i++, 0, key2);
  }
  if (value !== null) {
    dst.splice(i++, 0, value);
  }
}
var NG_TEMPLATE_SELECTOR = "ng-template";
function isCssClassMatching(attrs, cssClassToMatch, isProjectionMode) {
  ngDevMode && assertEqual(cssClassToMatch, cssClassToMatch.toLowerCase(), "Class name expected to be lowercase.");
  let i = 0;
  let isImplicitAttrsSection = true;
  while (i < attrs.length) {
    let item = attrs[i++];
    if (typeof item === "string" && isImplicitAttrsSection) {
      const value = attrs[i++];
      if (isProjectionMode && item === "class") {
        if (classIndexOf(value.toLowerCase(), cssClassToMatch, 0) !== -1) {
          return true;
        }
      }
    } else if (item === 1) {
      while (i < attrs.length && typeof (item = attrs[i++]) == "string") {
        if (item.toLowerCase() === cssClassToMatch)
          return true;
      }
      return false;
    } else if (typeof item === "number") {
      isImplicitAttrsSection = false;
    }
  }
  return false;
}
function isInlineTemplate(tNode) {
  return tNode.type === 4 && tNode.value !== NG_TEMPLATE_SELECTOR;
}
function hasTagAndTypeMatch(tNode, currentSelector, isProjectionMode) {
  const tagNameToCompare = tNode.type === 4 && !isProjectionMode ? NG_TEMPLATE_SELECTOR : tNode.value;
  return currentSelector === tagNameToCompare;
}
function isNodeMatchingSelector(tNode, selector, isProjectionMode) {
  ngDevMode && assertDefined(selector[0], "Selector should have a tag name");
  let mode = 4;
  const nodeAttrs = tNode.attrs || [];
  const nameOnlyMarkerIdx = getNameOnlyMarkerIndex(nodeAttrs);
  let skipToNextSelector = false;
  for (let i = 0; i < selector.length; i++) {
    const current = selector[i];
    if (typeof current === "number") {
      if (!skipToNextSelector && !isPositive(mode) && !isPositive(current)) {
        return false;
      }
      if (skipToNextSelector && isPositive(current))
        continue;
      skipToNextSelector = false;
      mode = current | mode & 1;
      continue;
    }
    if (skipToNextSelector)
      continue;
    if (mode & 4) {
      mode = 2 | mode & 1;
      if (current !== "" && !hasTagAndTypeMatch(tNode, current, isProjectionMode) || current === "" && selector.length === 1) {
        if (isPositive(mode))
          return false;
        skipToNextSelector = true;
      }
    } else {
      const selectorAttrValue = mode & 8 ? current : selector[++i];
      if (mode & 8 && tNode.attrs !== null) {
        if (!isCssClassMatching(tNode.attrs, selectorAttrValue, isProjectionMode)) {
          if (isPositive(mode))
            return false;
          skipToNextSelector = true;
        }
        continue;
      }
      const attrName = mode & 8 ? "class" : current;
      const attrIndexInNode = findAttrIndexInNode(attrName, nodeAttrs, isInlineTemplate(tNode), isProjectionMode);
      if (attrIndexInNode === -1) {
        if (isPositive(mode))
          return false;
        skipToNextSelector = true;
        continue;
      }
      if (selectorAttrValue !== "") {
        let nodeAttrValue;
        if (attrIndexInNode > nameOnlyMarkerIdx) {
          nodeAttrValue = "";
        } else {
          ngDevMode && assertNotEqual(nodeAttrs[attrIndexInNode], 0, "We do not match directives on namespaced attributes");
          nodeAttrValue = nodeAttrs[attrIndexInNode + 1].toLowerCase();
        }
        const compareAgainstClassName = mode & 8 ? nodeAttrValue : null;
        if (compareAgainstClassName && classIndexOf(compareAgainstClassName, selectorAttrValue, 0) !== -1 || mode & 2 && selectorAttrValue !== nodeAttrValue) {
          if (isPositive(mode))
            return false;
          skipToNextSelector = true;
        }
      }
    }
  }
  return isPositive(mode) || skipToNextSelector;
}
function isPositive(mode) {
  return (mode & 1) === 0;
}
function findAttrIndexInNode(name, attrs, isInlineTemplate2, isProjectionMode) {
  if (attrs === null)
    return -1;
  let i = 0;
  if (isProjectionMode || !isInlineTemplate2) {
    let bindingsMode = false;
    while (i < attrs.length) {
      const maybeAttrName = attrs[i];
      if (maybeAttrName === name) {
        return i;
      } else if (maybeAttrName === 3 || maybeAttrName === 6) {
        bindingsMode = true;
      } else if (maybeAttrName === 1 || maybeAttrName === 2) {
        let value = attrs[++i];
        while (typeof value === "string") {
          value = attrs[++i];
        }
        continue;
      } else if (maybeAttrName === 4) {
        break;
      } else if (maybeAttrName === 0) {
        i += 4;
        continue;
      }
      i += bindingsMode ? 1 : 2;
    }
    return -1;
  } else {
    return matchTemplateAttribute(attrs, name);
  }
}
function isNodeMatchingSelectorList(tNode, selector, isProjectionMode = false) {
  for (let i = 0; i < selector.length; i++) {
    if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
      return true;
    }
  }
  return false;
}
function getNameOnlyMarkerIndex(nodeAttrs) {
  for (let i = 0; i < nodeAttrs.length; i++) {
    const nodeAttr = nodeAttrs[i];
    if (isNameOnlyAttributeMarker(nodeAttr)) {
      return i;
    }
  }
  return nodeAttrs.length;
}
function matchTemplateAttribute(attrs, name) {
  let i = attrs.indexOf(
    4
    /* AttributeMarker.Template */
  );
  if (i > -1) {
    i++;
    while (i < attrs.length) {
      const attr = attrs[i];
      if (typeof attr === "number")
        return -1;
      if (attr === name)
        return i;
      i++;
    }
  }
  return -1;
}
function maybeWrapInNotSelector(isNegativeMode, chunk) {
  return isNegativeMode ? ":not(" + chunk.trim() + ")" : chunk;
}
function stringifyCSSSelector(selector) {
  let result = selector[0];
  let i = 1;
  let mode = 2;
  let currentChunk = "";
  let isNegativeMode = false;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === "string") {
      if (mode & 2) {
        const attrValue = selector[++i];
        currentChunk += "[" + valueOrMarker + (attrValue.length > 0 ? '="' + attrValue + '"' : "") + "]";
      } else if (mode & 8) {
        currentChunk += "." + valueOrMarker;
      } else if (mode & 4) {
        currentChunk += " " + valueOrMarker;
      }
    } else {
      if (currentChunk !== "" && !isPositive(valueOrMarker)) {
        result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
        currentChunk = "";
      }
      mode = valueOrMarker;
      isNegativeMode = isNegativeMode || !isPositive(mode);
    }
    i++;
  }
  if (currentChunk !== "") {
    result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
  }
  return result;
}
function stringifyCSSSelectorList(selectorList) {
  return selectorList.map(stringifyCSSSelector).join(",");
}
function extractAttrsAndClassesFromSelector(selector) {
  const attrs = [];
  const classes = [];
  let i = 1;
  let mode = 2;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === "string") {
      if (mode === 2) {
        if (valueOrMarker !== "") {
          attrs.push(valueOrMarker, selector[++i]);
        }
      } else if (mode === 8) {
        classes.push(valueOrMarker);
      }
    } else {
      if (!isPositive(mode))
        break;
      mode = valueOrMarker;
    }
    i++;
  }
  return {
    attrs,
    classes
  };
}
function \u0275\u0275defineComponent(componentDefinition) {
  return noSideEffects(() => {
    (typeof ngDevMode === "undefined" || ngDevMode) && initNgDevMode();
    const baseDef = getNgDirectiveDef(componentDefinition);
    const def = __spreadProps(__spreadValues({}, baseDef), {
      decls: componentDefinition.decls,
      vars: componentDefinition.vars,
      template: componentDefinition.template,
      consts: componentDefinition.consts || null,
      ngContentSelectors: componentDefinition.ngContentSelectors,
      onPush: componentDefinition.changeDetection === ChangeDetectionStrategy.OnPush,
      directiveDefs: null,
      pipeDefs: null,
      dependencies: baseDef.standalone && componentDefinition.dependencies || null,
      getStandaloneInjector: null,
      signals: componentDefinition.signals ?? false,
      data: componentDefinition.data || {},
      encapsulation: componentDefinition.encapsulation || ViewEncapsulation$1.Emulated,
      styles: componentDefinition.styles || EMPTY_ARRAY,
      _: null,
      schemas: componentDefinition.schemas || null,
      tView: null,
      id: ""
    });
    initFeatures(def);
    const dependencies = componentDefinition.dependencies;
    def.directiveDefs = extractDefListOrFactory(
      dependencies,
      /* pipeDef */
      false
    );
    def.pipeDefs = extractDefListOrFactory(
      dependencies,
      /* pipeDef */
      true
    );
    def.id = getComponentId(def);
    return def;
  });
}
function extractDirectiveDef(type) {
  return getComponentDef(type) || getDirectiveDef(type);
}
function nonNull(value) {
  return value !== null;
}
function \u0275\u0275defineNgModule(def) {
  return noSideEffects(() => {
    const res = {
      type: def.type,
      bootstrap: def.bootstrap || EMPTY_ARRAY,
      declarations: def.declarations || EMPTY_ARRAY,
      imports: def.imports || EMPTY_ARRAY,
      exports: def.exports || EMPTY_ARRAY,
      transitiveCompileScopes: null,
      schemas: def.schemas || null,
      id: def.id || null
    };
    return res;
  });
}
function invertObject(obj, secondary) {
  if (obj == null)
    return EMPTY_OBJ;
  const newLookup = {};
  for (const minifiedKey in obj) {
    if (obj.hasOwnProperty(minifiedKey)) {
      let publicName = obj[minifiedKey];
      let declaredName = publicName;
      if (Array.isArray(publicName)) {
        declaredName = publicName[1];
        publicName = publicName[0];
      }
      newLookup[publicName] = minifiedKey;
      if (secondary) {
        secondary[publicName] = declaredName;
      }
    }
  }
  return newLookup;
}
function \u0275\u0275defineDirective(directiveDefinition) {
  return noSideEffects(() => {
    const def = getNgDirectiveDef(directiveDefinition);
    initFeatures(def);
    return def;
  });
}
function \u0275\u0275definePipe(pipeDef) {
  return {
    type: pipeDef.type,
    name: pipeDef.name,
    factory: null,
    pure: pipeDef.pure !== false,
    standalone: pipeDef.standalone === true,
    onDestroy: pipeDef.type.prototype.ngOnDestroy || null
  };
}
function getComponentDef(type) {
  return type[NG_COMP_DEF] || null;
}
function getDirectiveDef(type) {
  return type[NG_DIR_DEF] || null;
}
function getPipeDef$1(type) {
  return type[NG_PIPE_DEF] || null;
}
function isStandalone(type) {
  const def = getComponentDef(type) || getDirectiveDef(type) || getPipeDef$1(type);
  return def !== null ? def.standalone : false;
}
function getNgModuleDef(type, throwNotFound) {
  const ngModuleDef = type[NG_MOD_DEF] || null;
  if (!ngModuleDef && throwNotFound === true) {
    throw new Error(`Type ${stringify(type)} does not have '\u0275mod' property.`);
  }
  return ngModuleDef;
}
function getNgDirectiveDef(directiveDefinition) {
  const declaredInputs = {};
  return {
    type: directiveDefinition.type,
    providersResolver: null,
    factory: null,
    hostBindings: directiveDefinition.hostBindings || null,
    hostVars: directiveDefinition.hostVars || 0,
    hostAttrs: directiveDefinition.hostAttrs || null,
    contentQueries: directiveDefinition.contentQueries || null,
    declaredInputs,
    inputTransforms: null,
    inputConfig: directiveDefinition.inputs || EMPTY_OBJ,
    exportAs: directiveDefinition.exportAs || null,
    standalone: directiveDefinition.standalone === true,
    signals: directiveDefinition.signals === true,
    selectors: directiveDefinition.selectors || EMPTY_ARRAY,
    viewQuery: directiveDefinition.viewQuery || null,
    features: directiveDefinition.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: invertObject(directiveDefinition.inputs, declaredInputs),
    outputs: invertObject(directiveDefinition.outputs)
  };
}
function initFeatures(definition) {
  definition.features?.forEach((fn) => fn(definition));
}
function extractDefListOrFactory(dependencies, pipeDef) {
  if (!dependencies) {
    return null;
  }
  const defExtractor = pipeDef ? getPipeDef$1 : extractDirectiveDef;
  return () => (typeof dependencies === "function" ? dependencies() : dependencies).map((dep) => defExtractor(dep)).filter(nonNull);
}
var GENERATED_COMP_IDS = /* @__PURE__ */ new Map();
function getComponentId(componentDef) {
  let hash = 0;
  const hashSelectors = [
    componentDef.selectors,
    componentDef.ngContentSelectors,
    componentDef.hostVars,
    componentDef.hostAttrs,
    componentDef.consts,
    componentDef.vars,
    componentDef.decls,
    componentDef.encapsulation,
    componentDef.standalone,
    componentDef.signals,
    componentDef.exportAs,
    JSON.stringify(componentDef.inputs),
    JSON.stringify(componentDef.outputs),
    // We cannot use 'componentDef.type.name' as the name of the symbol will change and will not
    // match in the server and browser bundles.
    Object.getOwnPropertyNames(componentDef.type.prototype),
    !!componentDef.contentQueries,
    !!componentDef.viewQuery
  ].join("|");
  for (const char of hashSelectors) {
    hash = Math.imul(31, hash) + char.charCodeAt(0) << 0;
  }
  hash += 2147483647 + 1;
  const compId = "c" + hash;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (GENERATED_COMP_IDS.has(compId)) {
      const previousCompDefType = GENERATED_COMP_IDS.get(compId);
      if (previousCompDefType !== componentDef.type) {
        console.warn(formatRuntimeError(-912, `Component ID generation collision detected. Components '${previousCompDefType.name}' and '${componentDef.type.name}' with selector '${stringifyCSSSelectorList(componentDef.selectors)}' generated the same component ID. To fix this, you can change the selector of one of those components or add an extra host attribute to force a different ID.`));
      }
    } else {
      GENERATED_COMP_IDS.set(compId, componentDef.type);
    }
  }
  return compId;
}
var HOST = 0;
var TVIEW = 1;
var FLAGS = 2;
var PARENT = 3;
var NEXT = 4;
var DESCENDANT_VIEWS_TO_REFRESH = 5;
var T_HOST = 6;
var CLEANUP = 7;
var CONTEXT = 8;
var INJECTOR$1 = 9;
var ENVIRONMENT = 10;
var RENDERER = 11;
var CHILD_HEAD = 12;
var CHILD_TAIL = 13;
var DECLARATION_VIEW = 14;
var DECLARATION_COMPONENT_VIEW = 15;
var DECLARATION_LCONTAINER = 16;
var PREORDER_HOOK_FLAGS = 17;
var QUERIES = 18;
var ID = 19;
var EMBEDDED_VIEW_INJECTOR = 20;
var ON_DESTROY_HOOKS = 21;
var HYDRATION = 22;
var REACTIVE_TEMPLATE_CONSUMER = 23;
var REACTIVE_HOST_BINDING_CONSUMER = 24;
var HEADER_OFFSET = 25;
var TYPE = 1;
var HAS_TRANSPLANTED_VIEWS = 2;
var NATIVE = 7;
var VIEW_REFS = 8;
var MOVED_VIEWS = 9;
var CONTAINER_HEADER_OFFSET = 11;
function isLView(value) {
  return Array.isArray(value) && typeof value[TYPE] === "object";
}
function isLContainer(value) {
  return Array.isArray(value) && value[TYPE] === true;
}
function isContentQueryHost(tNode) {
  return (tNode.flags & 4) !== 0;
}
function isComponentHost(tNode) {
  return tNode.componentOffset > -1;
}
function isDirectiveHost(tNode) {
  return (tNode.flags & 1) === 1;
}
function isComponentDef(def) {
  return !!def.template;
}
function isRootView(target) {
  return (target[FLAGS] & 512) !== 0;
}
function assertTNodeForLView(tNode, lView) {
  assertTNodeForTView(tNode, lView[TVIEW]);
}
function assertTNodeForTView(tNode, tView) {
  assertTNode(tNode);
  const tData = tView.data;
  for (let i = HEADER_OFFSET; i < tData.length; i++) {
    if (tData[i] === tNode) {
      return;
    }
  }
  throwError2("This TNode does not belong to this TView.");
}
function assertTNode(tNode) {
  assertDefined(tNode, "TNode must be defined");
  if (!(tNode && typeof tNode === "object" && tNode.hasOwnProperty("directiveStylingLast"))) {
    throwError2("Not of type TNode, got: " + tNode);
  }
}
function assertComponentType(actual, msg = "Type passed in is not ComponentType, it does not have '\u0275cmp' property.") {
  if (!getComponentDef(actual)) {
    throwError2(msg);
  }
}
function assertHasParent(tNode) {
  assertDefined(tNode, "currentTNode should exist!");
  assertDefined(tNode.parent, "currentTNode should have a parent");
}
function assertLContainer(value) {
  assertDefined(value, "LContainer must be defined");
  assertEqual(isLContainer(value), true, "Expecting LContainer");
}
function assertLViewOrUndefined(value) {
  value && assertEqual(isLView(value), true, "Expecting LView or undefined or null");
}
function assertLView(value) {
  assertDefined(value, "LView must be defined");
  assertEqual(isLView(value), true, "Expecting LView");
}
function assertFirstCreatePass(tView, errMessage) {
  assertEqual(tView.firstCreatePass, true, errMessage || "Should only be called in first create pass.");
}
function assertFirstUpdatePass(tView, errMessage) {
  assertEqual(tView.firstUpdatePass, true, errMessage || "Should only be called in first update pass.");
}
function assertDirectiveDef(obj) {
  if (obj.type === void 0 || obj.selectors == void 0 || obj.inputs === void 0) {
    throwError2(`Expected a DirectiveDef/ComponentDef and this object does not seem to have the expected shape.`);
  }
}
function assertIndexInDeclRange(lView, index) {
  const tView = lView[1];
  assertBetween(HEADER_OFFSET, tView.bindingStartIndex, index);
}
function assertIndexInExpandoRange(lView, index) {
  const tView = lView[1];
  assertBetween(tView.expandoStartIndex, lView.length, index);
}
function assertBetween(lower, upper, index) {
  if (!(lower <= index && index < upper)) {
    throwError2(`Index out of range (expecting ${lower} <= ${index} < ${upper})`);
  }
}
function assertProjectionSlots(lView, errMessage) {
  assertDefined(lView[DECLARATION_COMPONENT_VIEW], "Component views should exist.");
  assertDefined(lView[DECLARATION_COMPONENT_VIEW][T_HOST].projection, errMessage || "Components with projection nodes (<ng-content>) must have projection slots defined.");
}
function assertParentView(lView, errMessage) {
  assertDefined(lView, errMessage || "Component views should always have a parent view (component's host view)");
}
function assertNodeInjector(lView, injectorIndex) {
  assertIndexInExpandoRange(lView, injectorIndex);
  assertIndexInExpandoRange(
    lView,
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  );
  assertNumber(lView[injectorIndex + 0], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 1], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 2], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 3], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 4], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 5], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 6], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 7], "injectorIndex should point to a bloom filter");
  assertNumber(lView[
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ], "injectorIndex should point to parent injector");
}
function getFactoryDef(type, throwNotFound) {
  const hasFactoryDef = type.hasOwnProperty(NG_FACTORY_DEF);
  if (!hasFactoryDef && throwNotFound === true && ngDevMode) {
    throw new Error(`Type ${stringify(type)} does not have '\u0275fac' property.`);
  }
  return hasFactoryDef ? type[NG_FACTORY_DEF] : null;
}
var SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
function defaultEquals(a, b) {
  return (a === null || typeof a !== "object") && Object.is(a, b);
}
var activeConsumer = null;
var inNotificationPhase = false;
function setActiveConsumer(consumer) {
  const prev = activeConsumer;
  activeConsumer = consumer;
  return prev;
}
var REACTIVE_NODE = {
  version: 0,
  dirty: false,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: false,
  consumerIsAlwaysLive: false,
  producerMustRecompute: () => false,
  producerRecomputeValue: () => {
  },
  consumerMarkedDirty: () => {
  }
};
function producerAccessed(node) {
  if (inNotificationPhase) {
    throw new Error(typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : "");
  }
  if (activeConsumer === null) {
    return;
  }
  const idx = activeConsumer.nextProducerIndex++;
  assertConsumerNode(activeConsumer);
  if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
    if (consumerIsLive(activeConsumer)) {
      const staleProducer = activeConsumer.producerNode[idx];
      producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
    }
  }
  if (activeConsumer.producerNode[idx] !== node) {
    activeConsumer.producerNode[idx] = node;
    activeConsumer.producerIndexOfThis[idx] = consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
  }
  activeConsumer.producerLastReadVersion[idx] = node.version;
}
function producerUpdateValueVersion(node) {
  if (consumerIsLive(node) && !node.dirty) {
    return;
  }
  if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
    node.dirty = false;
    return;
  }
  node.producerRecomputeValue(node);
  node.dirty = false;
}
function producerNotifyConsumers(node) {
  if (node.liveConsumerNode === void 0) {
    return;
  }
  const prev = inNotificationPhase;
  inNotificationPhase = true;
  try {
    for (const consumer of node.liveConsumerNode) {
      if (!consumer.dirty) {
        consumerMarkDirty(consumer);
      }
    }
  } finally {
    inNotificationPhase = prev;
  }
}
function producerUpdatesAllowed() {
  return activeConsumer?.consumerAllowSignalWrites !== false;
}
function consumerMarkDirty(node) {
  node.dirty = true;
  producerNotifyConsumers(node);
  node.consumerMarkedDirty?.(node);
}
function consumerBeforeComputation(node) {
  node && (node.nextProducerIndex = 0);
  return setActiveConsumer(node);
}
function consumerAfterComputation(node, prevConsumer) {
  setActiveConsumer(prevConsumer);
  if (!node || node.producerNode === void 0 || node.producerIndexOfThis === void 0 || node.producerLastReadVersion === void 0) {
    return;
  }
  if (consumerIsLive(node)) {
    for (let i = node.nextProducerIndex; i < node.producerNode.length; i++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
    }
  }
  while (node.producerNode.length > node.nextProducerIndex) {
    node.producerNode.pop();
    node.producerLastReadVersion.pop();
    node.producerIndexOfThis.pop();
  }
}
function consumerPollProducersForChange(node) {
  assertConsumerNode(node);
  for (let i = 0; i < node.producerNode.length; i++) {
    const producer = node.producerNode[i];
    const seenVersion = node.producerLastReadVersion[i];
    if (seenVersion !== producer.version) {
      return true;
    }
    producerUpdateValueVersion(producer);
    if (seenVersion !== producer.version) {
      return true;
    }
  }
  return false;
}
function consumerDestroy(node) {
  assertConsumerNode(node);
  if (consumerIsLive(node)) {
    for (let i = 0; i < node.producerNode.length; i++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
    }
  }
  node.producerNode.length = node.producerLastReadVersion.length = node.producerIndexOfThis.length = 0;
  if (node.liveConsumerNode) {
    node.liveConsumerNode.length = node.liveConsumerIndexOfThis.length = 0;
  }
}
function producerAddLiveConsumer(node, consumer, indexOfThis) {
  assertProducerNode(node);
  assertConsumerNode(node);
  if (node.liveConsumerNode.length === 0) {
    for (let i = 0; i < node.producerNode.length; i++) {
      node.producerIndexOfThis[i] = producerAddLiveConsumer(node.producerNode[i], node, i);
    }
  }
  node.liveConsumerIndexOfThis.push(indexOfThis);
  return node.liveConsumerNode.push(consumer) - 1;
}
function producerRemoveLiveConsumerAtIndex(node, idx) {
  assertProducerNode(node);
  assertConsumerNode(node);
  if (typeof ngDevMode !== "undefined" && ngDevMode && idx >= node.liveConsumerNode.length) {
    throw new Error(`Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`);
  }
  if (node.liveConsumerNode.length === 1) {
    for (let i = 0; i < node.producerNode.length; i++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
    }
  }
  const lastIdx = node.liveConsumerNode.length - 1;
  node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
  node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
  node.liveConsumerNode.length--;
  node.liveConsumerIndexOfThis.length--;
  if (idx < node.liveConsumerNode.length) {
    const idxProducer = node.liveConsumerIndexOfThis[idx];
    const consumer = node.liveConsumerNode[idx];
    assertConsumerNode(consumer);
    consumer.producerIndexOfThis[idxProducer] = idx;
  }
}
function consumerIsLive(node) {
  return node.consumerIsAlwaysLive || (node?.liveConsumerNode?.length ?? 0) > 0;
}
function assertConsumerNode(node) {
  node.producerNode ??= [];
  node.producerIndexOfThis ??= [];
  node.producerLastReadVersion ??= [];
}
function assertProducerNode(node) {
  node.liveConsumerNode ??= [];
  node.liveConsumerIndexOfThis ??= [];
}
function computed(computation, options) {
  const node = Object.create(COMPUTED_NODE);
  node.computation = computation;
  options?.equal && (node.equal = options.equal);
  const computed2 = () => {
    producerUpdateValueVersion(node);
    producerAccessed(node);
    if (node.value === ERRORED) {
      throw node.error;
    }
    return node.value;
  };
  computed2[SIGNAL] = node;
  return computed2;
}
var UNSET = /* @__PURE__ */ Symbol("UNSET");
var COMPUTING = /* @__PURE__ */ Symbol("COMPUTING");
var ERRORED = /* @__PURE__ */ Symbol("ERRORED");
var COMPUTED_NODE = /* @__PURE__ */ (() => {
  return __spreadProps(__spreadValues({}, REACTIVE_NODE), {
    value: UNSET,
    dirty: true,
    error: null,
    equal: defaultEquals,
    producerMustRecompute(node) {
      return node.value === UNSET || node.value === COMPUTING;
    },
    producerRecomputeValue(node) {
      if (node.value === COMPUTING) {
        throw new Error("Detected cycle in computations.");
      }
      const oldValue = node.value;
      node.value = COMPUTING;
      const prevConsumer = consumerBeforeComputation(node);
      let newValue;
      try {
        newValue = node.computation();
      } catch (err) {
        newValue = ERRORED;
        node.error = err;
      } finally {
        consumerAfterComputation(node, prevConsumer);
      }
      if (oldValue !== UNSET && oldValue !== ERRORED && newValue !== ERRORED && node.equal(oldValue, newValue)) {
        node.value = oldValue;
        return;
      }
      node.value = newValue;
      node.version++;
    }
  });
})();
function defaultThrowError() {
  throw new Error();
}
var throwInvalidWriteToSignalErrorFn = defaultThrowError;
function throwInvalidWriteToSignalError() {
  throwInvalidWriteToSignalErrorFn();
}
function setThrowInvalidWriteToSignalError(fn) {
  throwInvalidWriteToSignalErrorFn = fn;
}
var postSignalSetFn = null;
function signal(initialValue, options) {
  const node = Object.create(SIGNAL_NODE);
  node.value = initialValue;
  options?.equal && (node.equal = options.equal);
  function signalFn() {
    producerAccessed(node);
    return node.value;
  }
  signalFn.set = signalSetFn;
  signalFn.update = signalUpdateFn;
  signalFn.mutate = signalMutateFn;
  signalFn.asReadonly = signalAsReadonlyFn;
  signalFn[SIGNAL] = node;
  return signalFn;
}
var SIGNAL_NODE = /* @__PURE__ */ (() => {
  return __spreadProps(__spreadValues({}, REACTIVE_NODE), {
    equal: defaultEquals,
    readonlyFn: void 0
  });
})();
function signalValueChanged(node) {
  node.version++;
  producerNotifyConsumers(node);
  postSignalSetFn?.();
}
function signalSetFn(newValue) {
  const node = this[SIGNAL];
  if (!producerUpdatesAllowed()) {
    throwInvalidWriteToSignalError();
  }
  if (!node.equal(node.value, newValue)) {
    node.value = newValue;
    signalValueChanged(node);
  }
}
function signalUpdateFn(updater) {
  if (!producerUpdatesAllowed()) {
    throwInvalidWriteToSignalError();
  }
  signalSetFn.call(this, updater(this[SIGNAL].value));
}
function signalMutateFn(mutator) {
  const node = this[SIGNAL];
  if (!producerUpdatesAllowed()) {
    throwInvalidWriteToSignalError();
  }
  mutator(node.value);
  signalValueChanged(node);
}
function signalAsReadonlyFn() {
  const node = this[SIGNAL];
  if (node.readonlyFn === void 0) {
    const readonlyFn = () => this();
    readonlyFn[SIGNAL] = node;
    node.readonlyFn = readonlyFn;
  }
  return node.readonlyFn;
}
function watch(fn, schedule, allowSignalWrites) {
  const node = Object.create(WATCH_NODE);
  if (allowSignalWrites) {
    node.consumerAllowSignalWrites = true;
  }
  node.fn = fn;
  node.schedule = schedule;
  const registerOnCleanup = (cleanupFn) => {
    node.cleanupFn = cleanupFn;
  };
  const run = () => {
    node.dirty = false;
    if (node.hasRun && !consumerPollProducersForChange(node)) {
      return;
    }
    node.hasRun = true;
    const prevConsumer = consumerBeforeComputation(node);
    try {
      node.cleanupFn();
      node.cleanupFn = NOOP_CLEANUP_FN;
      node.fn(registerOnCleanup);
    } finally {
      consumerAfterComputation(node, prevConsumer);
    }
  };
  node.ref = {
    notify: () => consumerMarkDirty(node),
    run,
    cleanup: () => node.cleanupFn()
  };
  return node.ref;
}
var NOOP_CLEANUP_FN = () => {
};
var WATCH_NODE = /* @__PURE__ */ (() => {
  return __spreadProps(__spreadValues({}, REACTIVE_NODE), {
    consumerIsAlwaysLive: true,
    consumerAllowSignalWrites: false,
    consumerMarkedDirty: (node) => {
      node.schedule(node.ref);
    },
    hasRun: false,
    cleanupFn: NOOP_CLEANUP_FN
  });
})();
var SimpleChange = class {
  constructor(previousValue, currentValue, firstChange) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.firstChange = firstChange;
  }
  /**
   * Check whether the new value is the first value assigned.
   */
  isFirstChange() {
    return this.firstChange;
  }
};
function \u0275\u0275NgOnChangesFeature() {
  return NgOnChangesFeatureImpl;
}
function NgOnChangesFeatureImpl(definition) {
  if (definition.type.prototype.ngOnChanges) {
    definition.setInput = ngOnChangesSetInput;
  }
  return rememberChangeHistoryAndInvokeOnChangesHook;
}
\u0275\u0275NgOnChangesFeature.ngInherit = true;
function rememberChangeHistoryAndInvokeOnChangesHook() {
  const simpleChangesStore = getSimpleChangesStore(this);
  const current = simpleChangesStore?.current;
  if (current) {
    const previous = simpleChangesStore.previous;
    if (previous === EMPTY_OBJ) {
      simpleChangesStore.previous = current;
    } else {
      for (let key in current) {
        previous[key] = current[key];
      }
    }
    simpleChangesStore.current = null;
    this.ngOnChanges(current);
  }
}
function ngOnChangesSetInput(instance, value, publicName, privateName) {
  const declaredName = this.declaredInputs[publicName];
  ngDevMode && assertString(declaredName, "Name of input in ngOnChanges has to be a string");
  const simpleChangesStore = getSimpleChangesStore(instance) || setSimpleChangesStore(instance, {
    previous: EMPTY_OBJ,
    current: null
  });
  const current = simpleChangesStore.current || (simpleChangesStore.current = {});
  const previous = simpleChangesStore.previous;
  const previousChange = previous[declaredName];
  current[declaredName] = new SimpleChange(previousChange && previousChange.currentValue, value, previous === EMPTY_OBJ);
  instance[privateName] = value;
}
var SIMPLE_CHANGES_STORE = "__ngSimpleChanges__";
function getSimpleChangesStore(instance) {
  return instance[SIMPLE_CHANGES_STORE] || null;
}
function setSimpleChangesStore(instance, store2) {
  return instance[SIMPLE_CHANGES_STORE] = store2;
}
var profilerCallback = null;
var setProfiler = (profiler2) => {
  profilerCallback = profiler2;
};
var profiler = function(event, instance, hookOrListener) {
  if (profilerCallback != null) {
    profilerCallback(event, instance, hookOrListener);
  }
};
var SVG_NAMESPACE = "svg";
var MATH_ML_NAMESPACE = "math";
function unwrapRNode(value) {
  while (Array.isArray(value)) {
    value = value[HOST];
  }
  return value;
}
function getNativeByIndex(index, lView) {
  ngDevMode && assertIndexInRange(lView, index);
  ngDevMode && assertGreaterThanOrEqual(index, HEADER_OFFSET, "Expected to be past HEADER_OFFSET");
  return unwrapRNode(lView[index]);
}
function getNativeByTNode(tNode, lView) {
  ngDevMode && assertTNodeForLView(tNode, lView);
  ngDevMode && assertIndexInRange(lView, tNode.index);
  const node = unwrapRNode(lView[tNode.index]);
  return node;
}
function getTNode(tView, index) {
  ngDevMode && assertGreaterThan(index, -1, "wrong index for TNode");
  ngDevMode && assertLessThan(index, tView.data.length, "wrong index for TNode");
  const tNode = tView.data[index];
  ngDevMode && tNode !== null && assertTNode(tNode);
  return tNode;
}
function load(view, index) {
  ngDevMode && assertIndexInRange(view, index);
  return view[index];
}
function getComponentLViewByIndex(nodeIndex, hostView) {
  ngDevMode && assertIndexInRange(hostView, nodeIndex);
  const slotValue = hostView[nodeIndex];
  const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}
function isCreationMode(view) {
  return (view[FLAGS] & 4) === 4;
}
function viewAttachedToChangeDetector(view) {
  return (view[FLAGS] & 128) === 128;
}
function viewAttachedToContainer(view) {
  return isLContainer(view[PARENT]);
}
function getConstant(consts, index) {
  if (index === null || index === void 0)
    return null;
  ngDevMode && assertIndexInRange(consts, index);
  return consts[index];
}
function resetPreOrderHookFlags(lView) {
  lView[PREORDER_HOOK_FLAGS] = 0;
}
function markViewForRefresh(lView) {
  if ((lView[FLAGS] & 1024) === 0) {
    lView[FLAGS] |= 1024;
    updateViewsToRefresh(lView, 1);
  }
}
function clearViewRefreshFlag(lView) {
  if (lView[FLAGS] & 1024) {
    lView[FLAGS] &= ~1024;
    updateViewsToRefresh(lView, -1);
  }
}
function updateViewsToRefresh(lView, amount) {
  let parent = lView[PARENT];
  if (parent === null) {
    return;
  }
  parent[DESCENDANT_VIEWS_TO_REFRESH] += amount;
  let viewOrContainer = parent;
  parent = parent[PARENT];
  while (parent !== null && (amount === 1 && viewOrContainer[DESCENDANT_VIEWS_TO_REFRESH] === 1 || amount === -1 && viewOrContainer[DESCENDANT_VIEWS_TO_REFRESH] === 0)) {
    parent[DESCENDANT_VIEWS_TO_REFRESH] += amount;
    viewOrContainer = parent;
    parent = parent[PARENT];
  }
}
function storeLViewOnDestroy(lView, onDestroyCallback) {
  if ((lView[FLAGS] & 256) === 256) {
    throw new RuntimeError(911, ngDevMode && "View has already been destroyed.");
  }
  if (lView[ON_DESTROY_HOOKS] === null) {
    lView[ON_DESTROY_HOOKS] = [];
  }
  lView[ON_DESTROY_HOOKS].push(onDestroyCallback);
}
var instructionState = {
  lFrame: /* @__PURE__ */ createLFrame(null),
  bindingsEnabled: true,
  skipHydrationRootTNode: null
};
var _isInCheckNoChangesMode = false;
function getElementDepthCount() {
  return instructionState.lFrame.elementDepthCount;
}
function increaseElementDepthCount() {
  instructionState.lFrame.elementDepthCount++;
}
function decreaseElementDepthCount() {
  instructionState.lFrame.elementDepthCount--;
}
function getBindingsEnabled() {
  return instructionState.bindingsEnabled;
}
function isInSkipHydrationBlock$1() {
  return instructionState.skipHydrationRootTNode !== null;
}
function isSkipHydrationRootTNode(tNode) {
  return instructionState.skipHydrationRootTNode === tNode;
}
function leaveSkipHydrationBlock() {
  instructionState.skipHydrationRootTNode = null;
}
function getLView() {
  return instructionState.lFrame.lView;
}
function getTView() {
  return instructionState.lFrame.tView;
}
function \u0275\u0275restoreView(viewToRestore) {
  instructionState.lFrame.contextLView = viewToRestore;
  return viewToRestore[CONTEXT];
}
function \u0275\u0275resetView(value) {
  instructionState.lFrame.contextLView = null;
  return value;
}
function getCurrentTNode() {
  let currentTNode = getCurrentTNodePlaceholderOk();
  while (currentTNode !== null && currentTNode.type === 64) {
    currentTNode = currentTNode.parent;
  }
  return currentTNode;
}
function getCurrentTNodePlaceholderOk() {
  return instructionState.lFrame.currentTNode;
}
function getCurrentParentTNode() {
  const lFrame = instructionState.lFrame;
  const currentTNode = lFrame.currentTNode;
  return lFrame.isParent ? currentTNode : currentTNode.parent;
}
function setCurrentTNode(tNode, isParent) {
  ngDevMode && tNode && assertTNodeForTView(tNode, instructionState.lFrame.tView);
  const lFrame = instructionState.lFrame;
  lFrame.currentTNode = tNode;
  lFrame.isParent = isParent;
}
function isCurrentTNodeParent() {
  return instructionState.lFrame.isParent;
}
function setCurrentTNodeAsNotParent() {
  instructionState.lFrame.isParent = false;
}
function getContextLView() {
  const contextLView = instructionState.lFrame.contextLView;
  ngDevMode && assertDefined(contextLView, "contextLView must be defined.");
  return contextLView;
}
function isInCheckNoChangesMode() {
  !ngDevMode && throwError2("Must never be called in production mode");
  return _isInCheckNoChangesMode;
}
function setIsInCheckNoChangesMode(mode) {
  !ngDevMode && throwError2("Must never be called in production mode");
  _isInCheckNoChangesMode = mode;
}
function getBindingRoot() {
  const lFrame = instructionState.lFrame;
  let index = lFrame.bindingRootIndex;
  if (index === -1) {
    index = lFrame.bindingRootIndex = lFrame.tView.bindingStartIndex;
  }
  return index;
}
function getBindingIndex() {
  return instructionState.lFrame.bindingIndex;
}
function setBindingIndex(value) {
  return instructionState.lFrame.bindingIndex = value;
}
function nextBindingIndex() {
  return instructionState.lFrame.bindingIndex++;
}
function incrementBindingIndex(count) {
  const lFrame = instructionState.lFrame;
  const index = lFrame.bindingIndex;
  lFrame.bindingIndex = lFrame.bindingIndex + count;
  return index;
}
function isInI18nBlock() {
  return instructionState.lFrame.inI18n;
}
function setBindingRootForHostBindings(bindingRootIndex, currentDirectiveIndex) {
  const lFrame = instructionState.lFrame;
  lFrame.bindingIndex = lFrame.bindingRootIndex = bindingRootIndex;
  setCurrentDirectiveIndex(currentDirectiveIndex);
}
function getCurrentDirectiveIndex() {
  return instructionState.lFrame.currentDirectiveIndex;
}
function setCurrentDirectiveIndex(currentDirectiveIndex) {
  instructionState.lFrame.currentDirectiveIndex = currentDirectiveIndex;
}
function getCurrentDirectiveDef(tData) {
  const currentDirectiveIndex = instructionState.lFrame.currentDirectiveIndex;
  return currentDirectiveIndex === -1 ? null : tData[currentDirectiveIndex];
}
function getCurrentQueryIndex() {
  return instructionState.lFrame.currentQueryIndex;
}
function setCurrentQueryIndex(value) {
  instructionState.lFrame.currentQueryIndex = value;
}
function getDeclarationTNode(lView) {
  const tView = lView[TVIEW];
  if (tView.type === 2) {
    ngDevMode && assertDefined(tView.declTNode, "Embedded TNodes should have declaration parents.");
    return tView.declTNode;
  }
  if (tView.type === 1) {
    return lView[T_HOST];
  }
  return null;
}
function enterDI(lView, tNode, flags) {
  ngDevMode && assertLViewOrUndefined(lView);
  if (flags & InjectFlags.SkipSelf) {
    ngDevMode && assertTNodeForTView(tNode, lView[TVIEW]);
    let parentTNode = tNode;
    let parentLView = lView;
    while (true) {
      ngDevMode && assertDefined(parentTNode, "Parent TNode should be defined");
      parentTNode = parentTNode.parent;
      if (parentTNode === null && !(flags & InjectFlags.Host)) {
        parentTNode = getDeclarationTNode(parentLView);
        if (parentTNode === null)
          break;
        ngDevMode && assertDefined(parentLView, "Parent LView should be defined");
        parentLView = parentLView[DECLARATION_VIEW];
        if (parentTNode.type & (2 | 8)) {
          break;
        }
      } else {
        break;
      }
    }
    if (parentTNode === null) {
      return false;
    } else {
      tNode = parentTNode;
      lView = parentLView;
    }
  }
  ngDevMode && assertTNodeForLView(tNode, lView);
  const lFrame = instructionState.lFrame = allocLFrame();
  lFrame.currentTNode = tNode;
  lFrame.lView = lView;
  return true;
}
function enterView(newView) {
  ngDevMode && assertNotEqual(newView[0], newView[1], "????");
  ngDevMode && assertLViewOrUndefined(newView);
  const newLFrame = allocLFrame();
  if (ngDevMode) {
    assertEqual(newLFrame.isParent, true, "Expected clean LFrame");
    assertEqual(newLFrame.lView, null, "Expected clean LFrame");
    assertEqual(newLFrame.tView, null, "Expected clean LFrame");
    assertEqual(newLFrame.selectedIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.elementDepthCount, 0, "Expected clean LFrame");
    assertEqual(newLFrame.currentDirectiveIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.currentNamespace, null, "Expected clean LFrame");
    assertEqual(newLFrame.bindingRootIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.currentQueryIndex, 0, "Expected clean LFrame");
  }
  const tView = newView[TVIEW];
  instructionState.lFrame = newLFrame;
  ngDevMode && tView.firstChild && assertTNodeForTView(tView.firstChild, tView);
  newLFrame.currentTNode = tView.firstChild;
  newLFrame.lView = newView;
  newLFrame.tView = tView;
  newLFrame.contextLView = newView;
  newLFrame.bindingIndex = tView.bindingStartIndex;
  newLFrame.inI18n = false;
}
function allocLFrame() {
  const currentLFrame = instructionState.lFrame;
  const childLFrame = currentLFrame === null ? null : currentLFrame.child;
  const newLFrame = childLFrame === null ? createLFrame(currentLFrame) : childLFrame;
  return newLFrame;
}
function createLFrame(parent) {
  const lFrame = {
    currentTNode: null,
    isParent: true,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent,
    child: null,
    inI18n: false
  };
  parent !== null && (parent.child = lFrame);
  return lFrame;
}
function leaveViewLight() {
  const oldLFrame = instructionState.lFrame;
  instructionState.lFrame = oldLFrame.parent;
  oldLFrame.currentTNode = null;
  oldLFrame.lView = null;
  return oldLFrame;
}
var leaveDI = leaveViewLight;
function leaveView() {
  const oldLFrame = leaveViewLight();
  oldLFrame.isParent = true;
  oldLFrame.tView = null;
  oldLFrame.selectedIndex = -1;
  oldLFrame.contextLView = null;
  oldLFrame.elementDepthCount = 0;
  oldLFrame.currentDirectiveIndex = -1;
  oldLFrame.currentNamespace = null;
  oldLFrame.bindingRootIndex = -1;
  oldLFrame.bindingIndex = -1;
  oldLFrame.currentQueryIndex = 0;
}
function nextContextImpl(level) {
  const contextLView = instructionState.lFrame.contextLView = walkUpViews(level, instructionState.lFrame.contextLView);
  return contextLView[CONTEXT];
}
function walkUpViews(nestingLevel, currentView) {
  while (nestingLevel > 0) {
    ngDevMode && assertDefined(currentView[DECLARATION_VIEW], "Declaration view should be defined if nesting level is greater than 0.");
    currentView = currentView[DECLARATION_VIEW];
    nestingLevel--;
  }
  return currentView;
}
function getSelectedIndex() {
  return instructionState.lFrame.selectedIndex;
}
function setSelectedIndex(index) {
  ngDevMode && index !== -1 && assertGreaterThanOrEqual(index, HEADER_OFFSET, "Index must be past HEADER_OFFSET (or -1).");
  ngDevMode && assertLessThan(index, instructionState.lFrame.lView.length, "Can't set index passed end of LView");
  instructionState.lFrame.selectedIndex = index;
}
function getSelectedTNode() {
  const lFrame = instructionState.lFrame;
  return getTNode(lFrame.tView, lFrame.selectedIndex);
}
function \u0275\u0275namespaceSVG() {
  instructionState.lFrame.currentNamespace = SVG_NAMESPACE;
}
function \u0275\u0275namespaceHTML() {
  namespaceHTMLInternal();
}
function namespaceHTMLInternal() {
  instructionState.lFrame.currentNamespace = null;
}
function getNamespace$1() {
  return instructionState.lFrame.currentNamespace;
}
var _wasLastNodeCreated = true;
function wasLastNodeCreated() {
  return _wasLastNodeCreated;
}
function lastNodeWasCreated(flag) {
  _wasLastNodeCreated = flag;
}
function registerPreOrderHooks(directiveIndex, directiveDef, tView) {
  ngDevMode && assertFirstCreatePass(tView);
  const {
    ngOnChanges,
    ngOnInit,
    ngDoCheck
  } = directiveDef.type.prototype;
  if (ngOnChanges) {
    const wrappedOnChanges = NgOnChangesFeatureImpl(directiveDef);
    (tView.preOrderHooks ??= []).push(directiveIndex, wrappedOnChanges);
    (tView.preOrderCheckHooks ??= []).push(directiveIndex, wrappedOnChanges);
  }
  if (ngOnInit) {
    (tView.preOrderHooks ??= []).push(0 - directiveIndex, ngOnInit);
  }
  if (ngDoCheck) {
    (tView.preOrderHooks ??= []).push(directiveIndex, ngDoCheck);
    (tView.preOrderCheckHooks ??= []).push(directiveIndex, ngDoCheck);
  }
}
function registerPostOrderHooks(tView, tNode) {
  ngDevMode && assertFirstCreatePass(tView);
  for (let i = tNode.directiveStart, end = tNode.directiveEnd; i < end; i++) {
    const directiveDef = tView.data[i];
    ngDevMode && assertDefined(directiveDef, "Expecting DirectiveDef");
    const lifecycleHooks = directiveDef.type.prototype;
    const {
      ngAfterContentInit,
      ngAfterContentChecked,
      ngAfterViewInit,
      ngAfterViewChecked,
      ngOnDestroy
    } = lifecycleHooks;
    if (ngAfterContentInit) {
      (tView.contentHooks ??= []).push(-i, ngAfterContentInit);
    }
    if (ngAfterContentChecked) {
      (tView.contentHooks ??= []).push(i, ngAfterContentChecked);
      (tView.contentCheckHooks ??= []).push(i, ngAfterContentChecked);
    }
    if (ngAfterViewInit) {
      (tView.viewHooks ??= []).push(-i, ngAfterViewInit);
    }
    if (ngAfterViewChecked) {
      (tView.viewHooks ??= []).push(i, ngAfterViewChecked);
      (tView.viewCheckHooks ??= []).push(i, ngAfterViewChecked);
    }
    if (ngOnDestroy != null) {
      (tView.destroyHooks ??= []).push(i, ngOnDestroy);
    }
  }
}
function executeCheckHooks(lView, hooks, nodeIndex) {
  callHooks(lView, hooks, 3, nodeIndex);
}
function executeInitAndCheckHooks(lView, hooks, initPhase, nodeIndex) {
  ngDevMode && assertNotEqual(initPhase, 3, "Init pre-order hooks should not be called more than once");
  if ((lView[FLAGS] & 3) === initPhase) {
    callHooks(lView, hooks, initPhase, nodeIndex);
  }
}
function incrementInitPhaseFlags(lView, initPhase) {
  ngDevMode && assertNotEqual(initPhase, 3, "Init hooks phase should not be incremented after all init hooks have been run.");
  let flags = lView[FLAGS];
  if ((flags & 3) === initPhase) {
    flags &= 8191;
    flags += 1;
    lView[FLAGS] = flags;
  }
}
function callHooks(currentView, arr, initPhase, currentNodeIndex) {
  ngDevMode && assertEqual(isInCheckNoChangesMode(), false, "Hooks should never be run when in check no changes mode.");
  const startIndex = currentNodeIndex !== void 0 ? currentView[PREORDER_HOOK_FLAGS] & 65535 : 0;
  const nodeIndexLimit = currentNodeIndex != null ? currentNodeIndex : -1;
  const max = arr.length - 1;
  let lastNodeIndexFound = 0;
  for (let i = startIndex; i < max; i++) {
    const hook = arr[i + 1];
    if (typeof hook === "number") {
      lastNodeIndexFound = arr[i];
      if (currentNodeIndex != null && lastNodeIndexFound >= currentNodeIndex) {
        break;
      }
    } else {
      const isInitHook = arr[i] < 0;
      if (isInitHook) {
        currentView[PREORDER_HOOK_FLAGS] += 65536;
      }
      if (lastNodeIndexFound < nodeIndexLimit || nodeIndexLimit == -1) {
        callHook(currentView, initPhase, arr, i);
        currentView[PREORDER_HOOK_FLAGS] = (currentView[PREORDER_HOOK_FLAGS] & 4294901760) + i + 2;
      }
      i++;
    }
  }
}
function callHookInternal(directive, hook) {
  profiler(4, directive, hook);
  const prevConsumer = setActiveConsumer(null);
  try {
    hook.call(directive);
  } finally {
    setActiveConsumer(prevConsumer);
    profiler(5, directive, hook);
  }
}
function callHook(currentView, initPhase, arr, i) {
  const isInitHook = arr[i] < 0;
  const hook = arr[i + 1];
  const directiveIndex = isInitHook ? -arr[i] : arr[i];
  const directive = currentView[directiveIndex];
  if (isInitHook) {
    const indexWithintInitPhase = currentView[FLAGS] >> 13;
    if (indexWithintInitPhase < currentView[PREORDER_HOOK_FLAGS] >> 16 && (currentView[FLAGS] & 3) === initPhase) {
      currentView[FLAGS] += 8192;
      callHookInternal(directive, hook);
    }
  } else {
    callHookInternal(directive, hook);
  }
}
var NO_PARENT_INJECTOR = -1;
var NodeInjectorFactory = class {
  constructor(factory, isViewProvider, injectImplementation) {
    this.factory = factory;
    this.resolving = false;
    ngDevMode && assertDefined(factory, "Factory not specified");
    ngDevMode && assertEqual(typeof factory, "function", "Expected factory function.");
    this.canSeeViewProviders = isViewProvider;
    this.injectImpl = injectImplementation;
  }
};
function isFactory(obj) {
  return obj instanceof NodeInjectorFactory;
}
function toTNodeTypeAsString(tNodeType) {
  let text = "";
  tNodeType & 1 && (text += "|Text");
  tNodeType & 2 && (text += "|Element");
  tNodeType & 4 && (text += "|Container");
  tNodeType & 8 && (text += "|ElementContainer");
  tNodeType & 16 && (text += "|Projection");
  tNodeType & 32 && (text += "|IcuContainer");
  tNodeType & 64 && (text += "|Placeholder");
  return text.length > 0 ? text.substring(1) : text;
}
function hasClassInput(tNode) {
  return (tNode.flags & 8) !== 0;
}
function hasStyleInput(tNode) {
  return (tNode.flags & 16) !== 0;
}
function assertTNodeType(tNode, expectedTypes, message) {
  assertDefined(tNode, "should be called with a TNode");
  if ((tNode.type & expectedTypes) === 0) {
    throwError2(message || `Expected [${toTNodeTypeAsString(expectedTypes)}] but got ${toTNodeTypeAsString(tNode.type)}.`);
  }
}
function assertPureTNodeType(type) {
  if (!(type === 2 || //
  type === 1 || //
  type === 4 || //
  type === 8 || //
  type === 32 || //
  type === 16 || //
  type === 64)) {
    throwError2(`Expected TNodeType to have only a single type selected, but got ${toTNodeTypeAsString(type)}.`);
  }
}
function hasParentInjector(parentLocation) {
  return parentLocation !== NO_PARENT_INJECTOR;
}
function getParentInjectorIndex(parentLocation) {
  ngDevMode && assertNumber(parentLocation, "Number expected");
  ngDevMode && assertNotEqual(parentLocation, -1, "Not a valid state.");
  const parentInjectorIndex = parentLocation & 32767;
  ngDevMode && assertGreaterThan(parentInjectorIndex, HEADER_OFFSET, "Parent injector must be pointing past HEADER_OFFSET.");
  return parentLocation & 32767;
}
function getParentInjectorViewOffset(parentLocation) {
  return parentLocation >> 16;
}
function getParentInjectorView(location2, startView) {
  let viewOffset = getParentInjectorViewOffset(location2);
  let parentView = startView;
  while (viewOffset > 0) {
    parentView = parentView[DECLARATION_VIEW];
    viewOffset--;
  }
  return parentView;
}
var includeViewProviders = true;
function setIncludeViewProviders(v) {
  const oldValue = includeViewProviders;
  includeViewProviders = v;
  return oldValue;
}
var BLOOM_SIZE = 256;
var BLOOM_MASK = BLOOM_SIZE - 1;
var BLOOM_BUCKET_BITS = 5;
var nextNgElementId = 0;
var NOT_FOUND = {};
function bloomAdd(injectorIndex, tView, type) {
  ngDevMode && assertEqual(tView.firstCreatePass, true, "expected firstCreatePass to be true");
  let id;
  if (typeof type === "string") {
    id = type.charCodeAt(0) || 0;
  } else if (type.hasOwnProperty(NG_ELEMENT_ID)) {
    id = type[NG_ELEMENT_ID];
  }
  if (id == null) {
    id = type[NG_ELEMENT_ID] = nextNgElementId++;
  }
  const bloomHash = id & BLOOM_MASK;
  const mask = 1 << bloomHash;
  tView.data[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)] |= mask;
}
function getOrCreateNodeInjectorForNode(tNode, lView) {
  const existingInjectorIndex = getInjectorIndex(tNode, lView);
  if (existingInjectorIndex !== -1) {
    return existingInjectorIndex;
  }
  const tView = lView[TVIEW];
  if (tView.firstCreatePass) {
    tNode.injectorIndex = lView.length;
    insertBloom(tView.data, tNode);
    insertBloom(lView, null);
    insertBloom(tView.blueprint, null);
  }
  const parentLoc = getParentInjectorLocation(tNode, lView);
  const injectorIndex = tNode.injectorIndex;
  if (hasParentInjector(parentLoc)) {
    const parentIndex = getParentInjectorIndex(parentLoc);
    const parentLView = getParentInjectorView(parentLoc, lView);
    const parentData = parentLView[TVIEW].data;
    for (let i = 0; i < 8; i++) {
      lView[injectorIndex + i] = parentLView[parentIndex + i] | parentData[parentIndex + i];
    }
  }
  lView[
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ] = parentLoc;
  return injectorIndex;
}
function insertBloom(arr, footer) {
  arr.push(0, 0, 0, 0, 0, 0, 0, 0, footer);
}
function getInjectorIndex(tNode, lView) {
  if (tNode.injectorIndex === -1 || // If the injector index is the same as its parent's injector index, then the index has been
  // copied down from the parent node. No injector has been created yet on this node.
  tNode.parent && tNode.parent.injectorIndex === tNode.injectorIndex || // After the first template pass, the injector index might exist but the parent values
  // might not have been calculated yet for this instance
  lView[
    tNode.injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ] === null) {
    return -1;
  } else {
    ngDevMode && assertIndexInRange(lView, tNode.injectorIndex);
    return tNode.injectorIndex;
  }
}
function getParentInjectorLocation(tNode, lView) {
  if (tNode.parent && tNode.parent.injectorIndex !== -1) {
    return tNode.parent.injectorIndex;
  }
  let declarationViewOffset = 0;
  let parentTNode = null;
  let lViewCursor = lView;
  while (lViewCursor !== null) {
    parentTNode = getTNodeFromLView(lViewCursor);
    if (parentTNode === null) {
      return NO_PARENT_INJECTOR;
    }
    ngDevMode && parentTNode && assertTNodeForLView(parentTNode, lViewCursor[DECLARATION_VIEW]);
    declarationViewOffset++;
    lViewCursor = lViewCursor[DECLARATION_VIEW];
    if (parentTNode.injectorIndex !== -1) {
      return parentTNode.injectorIndex | declarationViewOffset << 16;
    }
  }
  return NO_PARENT_INJECTOR;
}
function diPublicInInjector(injectorIndex, tView, token) {
  bloomAdd(injectorIndex, tView, token);
}
function injectAttributeImpl(tNode, attrNameToInject) {
  ngDevMode && assertTNodeType(
    tNode,
    12 | 3
    /* TNodeType.AnyRNode */
  );
  ngDevMode && assertDefined(tNode, "expecting tNode");
  if (attrNameToInject === "class") {
    return tNode.classes;
  }
  if (attrNameToInject === "style") {
    return tNode.styles;
  }
  const attrs = tNode.attrs;
  if (attrs) {
    const attrsLength = attrs.length;
    let i = 0;
    while (i < attrsLength) {
      const value = attrs[i];
      if (isNameOnlyAttributeMarker(value))
        break;
      if (value === 0) {
        i = i + 2;
      } else if (typeof value === "number") {
        i++;
        while (i < attrsLength && typeof attrs[i] === "string") {
          i++;
        }
      } else if (value === attrNameToInject) {
        return attrs[i + 1];
      } else {
        i = i + 2;
      }
    }
  }
  return null;
}
function notFoundValueOrThrow(notFoundValue, token, flags) {
  if (flags & InjectFlags.Optional || notFoundValue !== void 0) {
    return notFoundValue;
  } else {
    throwProviderNotFoundError(token, "NodeInjector");
  }
}
function lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue) {
  if (flags & InjectFlags.Optional && notFoundValue === void 0) {
    notFoundValue = null;
  }
  if ((flags & (InjectFlags.Self | InjectFlags.Host)) === 0) {
    const moduleInjector = lView[INJECTOR$1];
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      if (moduleInjector) {
        return moduleInjector.get(token, notFoundValue, flags & InjectFlags.Optional);
      } else {
        return injectRootLimpMode(token, notFoundValue, flags & InjectFlags.Optional);
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
    }
  }
  return notFoundValueOrThrow(notFoundValue, token, flags);
}
function getOrCreateInjectable(tNode, lView, token, flags = InjectFlags.Default, notFoundValue) {
  if (tNode !== null) {
    if (lView[FLAGS] & 2048 && // The token must be present on the current node injector when the `Self`
    // flag is set, so the lookup on embedded view injector(s) can be skipped.
    !(flags & InjectFlags.Self)) {
      const embeddedInjectorValue = lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, NOT_FOUND);
      if (embeddedInjectorValue !== NOT_FOUND) {
        return embeddedInjectorValue;
      }
    }
    const value = lookupTokenUsingNodeInjector(tNode, lView, token, flags, NOT_FOUND);
    if (value !== NOT_FOUND) {
      return value;
    }
  }
  return lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
}
function lookupTokenUsingNodeInjector(tNode, lView, token, flags, notFoundValue) {
  const bloomHash = bloomHashBitOrFactory(token);
  if (typeof bloomHash === "function") {
    if (!enterDI(lView, tNode, flags)) {
      return flags & InjectFlags.Host ? notFoundValueOrThrow(notFoundValue, token, flags) : lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
    }
    try {
      let value;
      if (ngDevMode) {
        runInInjectorProfilerContext(new NodeInjector(getCurrentTNode(), getLView()), token, () => {
          value = bloomHash(flags);
          if (value != null) {
            emitInstanceCreatedByInjectorEvent(value);
          }
        });
      } else {
        value = bloomHash(flags);
      }
      if (value == null && !(flags & InjectFlags.Optional)) {
        throwProviderNotFoundError(token);
      } else {
        return value;
      }
    } finally {
      leaveDI();
    }
  } else if (typeof bloomHash === "number") {
    let previousTView = null;
    let injectorIndex = getInjectorIndex(tNode, lView);
    let parentLocation = NO_PARENT_INJECTOR;
    let hostTElementNode = flags & InjectFlags.Host ? lView[DECLARATION_COMPONENT_VIEW][T_HOST] : null;
    if (injectorIndex === -1 || flags & InjectFlags.SkipSelf) {
      parentLocation = injectorIndex === -1 ? getParentInjectorLocation(tNode, lView) : lView[
        injectorIndex + 8
        /* NodeInjectorOffset.PARENT */
      ];
      if (parentLocation === NO_PARENT_INJECTOR || !shouldSearchParent(flags, false)) {
        injectorIndex = -1;
      } else {
        previousTView = lView[TVIEW];
        injectorIndex = getParentInjectorIndex(parentLocation);
        lView = getParentInjectorView(parentLocation, lView);
      }
    }
    while (injectorIndex !== -1) {
      ngDevMode && assertNodeInjector(lView, injectorIndex);
      const tView = lView[TVIEW];
      ngDevMode && assertTNodeForLView(tView.data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ], lView);
      if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
        const instance = searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode);
        if (instance !== NOT_FOUND) {
          return instance;
        }
      }
      parentLocation = lView[
        injectorIndex + 8
        /* NodeInjectorOffset.PARENT */
      ];
      if (parentLocation !== NO_PARENT_INJECTOR && shouldSearchParent(flags, lView[TVIEW].data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ] === hostTElementNode) && bloomHasToken(bloomHash, injectorIndex, lView)) {
        previousTView = tView;
        injectorIndex = getParentInjectorIndex(parentLocation);
        lView = getParentInjectorView(parentLocation, lView);
      } else {
        injectorIndex = -1;
      }
    }
  }
  return notFoundValue;
}
function searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode) {
  const currentTView = lView[TVIEW];
  const tNode = currentTView.data[
    injectorIndex + 8
    /* NodeInjectorOffset.TNODE */
  ];
  const canAccessViewProviders = previousTView == null ? (
    // 1) This is the first invocation `previousTView == null` which means that we are at the
    // `TNode` of where injector is starting to look. In such a case the only time we are allowed
    // to look into the ViewProviders is if:
    // - we are on a component
    // - AND the injector set `includeViewProviders` to true (implying that the token can see
    // ViewProviders because it is the Component or a Service which itself was declared in
    // ViewProviders)
    isComponentHost(tNode) && includeViewProviders
  ) : (
    // 2) `previousTView != null` which means that we are now walking across the parent nodes.
    // In such a case we are only allowed to look into the ViewProviders if:
    // - We just crossed from child View to Parent View `previousTView != currentTView`
    // - AND the parent TNode is an Element.
    // This means that we just came from the Component's View and therefore are allowed to see
    // into the ViewProviders.
    previousTView != currentTView && (tNode.type & 3) !== 0
  );
  const isHostSpecialCase = flags & InjectFlags.Host && hostTElementNode === tNode;
  const injectableIdx = locateDirectiveOrProvider(tNode, currentTView, token, canAccessViewProviders, isHostSpecialCase);
  if (injectableIdx !== null) {
    return getNodeInjectable(lView, currentTView, injectableIdx, tNode);
  } else {
    return NOT_FOUND;
  }
}
function locateDirectiveOrProvider(tNode, tView, token, canAccessViewProviders, isHostSpecialCase) {
  const nodeProviderIndexes = tNode.providerIndexes;
  const tInjectables = tView.data;
  const injectablesStart = nodeProviderIndexes & 1048575;
  const directivesStart = tNode.directiveStart;
  const directiveEnd = tNode.directiveEnd;
  const cptViewProvidersCount = nodeProviderIndexes >> 20;
  const startingIndex = canAccessViewProviders ? injectablesStart : injectablesStart + cptViewProvidersCount;
  const endIndex = isHostSpecialCase ? injectablesStart + cptViewProvidersCount : directiveEnd;
  for (let i = startingIndex; i < endIndex; i++) {
    const providerTokenOrDef = tInjectables[i];
    if (i < directivesStart && token === providerTokenOrDef || i >= directivesStart && providerTokenOrDef.type === token) {
      return i;
    }
  }
  if (isHostSpecialCase) {
    const dirDef = tInjectables[directivesStart];
    if (dirDef && isComponentDef(dirDef) && dirDef.type === token) {
      return directivesStart;
    }
  }
  return null;
}
function getNodeInjectable(lView, tView, index, tNode) {
  let value = lView[index];
  const tData = tView.data;
  if (isFactory(value)) {
    const factory = value;
    if (factory.resolving) {
      throwCyclicDependencyError(stringifyForError(tData[index]));
    }
    const previousIncludeViewProviders = setIncludeViewProviders(factory.canSeeViewProviders);
    factory.resolving = true;
    let prevInjectContext;
    if (ngDevMode) {
      const token = tData[index].type || tData[index];
      const injector = new NodeInjector(tNode, lView);
      prevInjectContext = setInjectorProfilerContext({
        injector,
        token
      });
    }
    const previousInjectImplementation = factory.injectImpl ? setInjectImplementation(factory.injectImpl) : null;
    const success = enterDI(lView, tNode, InjectFlags.Default);
    ngDevMode && assertEqual(success, true, "Because flags do not contain `SkipSelf' we expect this to always succeed.");
    try {
      value = lView[index] = factory.factory(void 0, tData, lView, tNode);
      ngDevMode && emitInstanceCreatedByInjectorEvent(value);
      if (tView.firstCreatePass && index >= tNode.directiveStart) {
        ngDevMode && assertDirectiveDef(tData[index]);
        registerPreOrderHooks(index, tData[index], tView);
      }
    } finally {
      ngDevMode && setInjectorProfilerContext(prevInjectContext);
      previousInjectImplementation !== null && setInjectImplementation(previousInjectImplementation);
      setIncludeViewProviders(previousIncludeViewProviders);
      factory.resolving = false;
      leaveDI();
    }
  }
  return value;
}
function bloomHashBitOrFactory(token) {
  ngDevMode && assertDefined(token, "token must be defined");
  if (typeof token === "string") {
    return token.charCodeAt(0) || 0;
  }
  const tokenId = (
    // First check with `hasOwnProperty` so we don't get an inherited ID.
    token.hasOwnProperty(NG_ELEMENT_ID) ? token[NG_ELEMENT_ID] : void 0
  );
  if (typeof tokenId === "number") {
    if (tokenId >= 0) {
      return tokenId & BLOOM_MASK;
    } else {
      ngDevMode && assertEqual(tokenId, -1, "Expecting to get Special Injector Id");
      return createNodeInjector;
    }
  } else {
    return tokenId;
  }
}
function bloomHasToken(bloomHash, injectorIndex, injectorView) {
  const mask = 1 << bloomHash;
  const value = injectorView[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)];
  return !!(value & mask);
}
function shouldSearchParent(flags, isFirstHostTNode) {
  return !(flags & InjectFlags.Self) && !(flags & InjectFlags.Host && isFirstHostTNode);
}
function getNodeInjectorLView(nodeInjector) {
  return nodeInjector._lView;
}
function getNodeInjectorTNode(nodeInjector) {
  return nodeInjector._tNode;
}
var NodeInjector = class {
  constructor(_tNode, _lView) {
    this._tNode = _tNode;
    this._lView = _lView;
  }
  get(token, notFoundValue, flags) {
    return getOrCreateInjectable(this._tNode, this._lView, token, convertToBitFlags(flags), notFoundValue);
  }
};
function createNodeInjector() {
  return new NodeInjector(getCurrentTNode(), getLView());
}
function \u0275\u0275getInheritedFactory(type) {
  return noSideEffects(() => {
    const ownConstructor = type.prototype.constructor;
    const ownFactory = ownConstructor[NG_FACTORY_DEF] || getFactoryOf(ownConstructor);
    const objectPrototype = Object.prototype;
    let parent = Object.getPrototypeOf(type.prototype).constructor;
    while (parent && parent !== objectPrototype) {
      const factory = parent[NG_FACTORY_DEF] || getFactoryOf(parent);
      if (factory && factory !== ownFactory) {
        return factory;
      }
      parent = Object.getPrototypeOf(parent);
    }
    return (t) => new t();
  });
}
function getFactoryOf(type) {
  if (isForwardRef(type)) {
    return () => {
      const factory = getFactoryOf(resolveForwardRef(type));
      return factory && factory();
    };
  }
  return getFactoryDef(type);
}
function lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, notFoundValue) {
  let currentTNode = tNode;
  let currentLView = lView;
  while (currentTNode !== null && currentLView !== null && currentLView[FLAGS] & 2048 && !(currentLView[FLAGS] & 512)) {
    ngDevMode && assertTNodeForLView(currentTNode, currentLView);
    const nodeInjectorValue = lookupTokenUsingNodeInjector(currentTNode, currentLView, token, flags | InjectFlags.Self, NOT_FOUND);
    if (nodeInjectorValue !== NOT_FOUND) {
      return nodeInjectorValue;
    }
    let parentTNode = currentTNode.parent;
    if (!parentTNode) {
      const embeddedViewInjector = currentLView[EMBEDDED_VIEW_INJECTOR];
      if (embeddedViewInjector) {
        const embeddedViewInjectorValue = embeddedViewInjector.get(token, NOT_FOUND, flags);
        if (embeddedViewInjectorValue !== NOT_FOUND) {
          return embeddedViewInjectorValue;
        }
      }
      parentTNode = getTNodeFromLView(currentLView);
      currentLView = currentLView[DECLARATION_VIEW];
    }
    currentTNode = parentTNode;
  }
  return notFoundValue;
}
function getTNodeFromLView(lView) {
  const tView = lView[TVIEW];
  const tViewType = tView.type;
  if (tViewType === 2) {
    ngDevMode && assertDefined(tView.declTNode, "Embedded TNodes should have declaration parents.");
    return tView.declTNode;
  } else if (tViewType === 1) {
    return lView[T_HOST];
  }
  return null;
}
function \u0275\u0275injectAttribute(attrNameToInject) {
  return injectAttributeImpl(getCurrentTNode(), attrNameToInject);
}
var PARAMETERS = "__parameters__";
function makeMetadataCtor(props) {
  return function ctor(...args) {
    if (props) {
      const values = props(...args);
      for (const propName in values) {
        this[propName] = values[propName];
      }
    }
  };
}
function makeParamDecorator(name, props, parentClass) {
  return noSideEffects(() => {
    const metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory(...args) {
      if (this instanceof ParamDecoratorFactory) {
        metaCtor.apply(this, args);
        return this;
      }
      const annotationInstance = new ParamDecoratorFactory(...args);
      ParamDecorator.annotation = annotationInstance;
      return ParamDecorator;
      function ParamDecorator(cls, unusedKey, index) {
        const parameters = cls.hasOwnProperty(PARAMETERS) ? cls[PARAMETERS] : Object.defineProperty(cls, PARAMETERS, {
          value: []
        })[PARAMETERS];
        while (parameters.length <= index) {
          parameters.push(null);
        }
        (parameters[index] = parameters[index] || []).push(annotationInstance);
        return cls;
      }
    }
    if (parentClass) {
      ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.ngMetadataName = name;
    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
  });
}
function isType(v) {
  return typeof v === "function";
}
function arrayEquals(a, b, identityAccessor) {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++) {
    let valueA = a[i];
    let valueB = b[i];
    if (identityAccessor) {
      valueA = identityAccessor(valueA);
      valueB = identityAccessor(valueB);
    }
    if (valueB !== valueA) {
      return false;
    }
  }
  return true;
}
function flatten(list) {
  return list.flat(Number.POSITIVE_INFINITY);
}
function deepForEach(input, fn) {
  input.forEach((value) => Array.isArray(value) ? deepForEach(value, fn) : fn(value));
}
function addToArray(arr, index, value) {
  if (index >= arr.length) {
    arr.push(value);
  } else {
    arr.splice(index, 0, value);
  }
}
function removeFromArray(arr, index) {
  if (index >= arr.length - 1) {
    return arr.pop();
  } else {
    return arr.splice(index, 1)[0];
  }
}
function newArray(size, value) {
  const list = [];
  for (let i = 0; i < size; i++) {
    list.push(value);
  }
  return list;
}
function arrayInsert2(array, index, value1, value2) {
  ngDevMode && assertLessThanOrEqual(index, array.length, "Can't insert past array end.");
  let end = array.length;
  if (end == index) {
    array.push(value1, value2);
  } else if (end === 1) {
    array.push(value2, array[0]);
    array[0] = value1;
  } else {
    end--;
    array.push(array[end - 1], array[end]);
    while (end > index) {
      const previousEnd = end - 2;
      array[end] = array[previousEnd];
      end--;
    }
    array[index] = value1;
    array[index + 1] = value2;
  }
}
function keyValueArraySet(keyValueArray, key, value) {
  let index = keyValueArrayIndexOf(keyValueArray, key);
  if (index >= 0) {
    keyValueArray[index | 1] = value;
  } else {
    index = ~index;
    arrayInsert2(keyValueArray, index, key, value);
  }
  return index;
}
function keyValueArrayGet(keyValueArray, key) {
  const index = keyValueArrayIndexOf(keyValueArray, key);
  if (index >= 0) {
    return keyValueArray[index | 1];
  }
  return void 0;
}
function keyValueArrayIndexOf(keyValueArray, key) {
  return _arrayIndexOfSorted(keyValueArray, key, 1);
}
function _arrayIndexOfSorted(array, value, shift) {
  ngDevMode && assertEqual(Array.isArray(array), true, "Expecting an array");
  let start = 0;
  let end = array.length >> shift;
  while (end !== start) {
    const middle = start + (end - start >> 1);
    const current = array[middle << shift];
    if (value === current) {
      return middle << shift;
    } else if (current > value) {
      end = middle;
    } else {
      start = middle + 1;
    }
  }
  return ~(end << shift);
}
var Optional = (
  // Disable tslint because `InternalInjectFlags` is a const enum which gets inlined.
  // tslint:disable-next-line: no-toplevel-property-access
  /* @__PURE__ */ attachInjectFlag(
    /* @__PURE__ */ makeParamDecorator("Optional"),
    8
    /* InternalInjectFlags.Optional */
  )
);
var SkipSelf = (
  // Disable tslint because `InternalInjectFlags` is a const enum which gets inlined.
  // tslint:disable-next-line: no-toplevel-property-access
  /* @__PURE__ */ attachInjectFlag(
    /* @__PURE__ */ makeParamDecorator("SkipSelf"),
    4
    /* InternalInjectFlags.SkipSelf */
  )
);
var CUSTOM_ELEMENTS_SCHEMA = {
  name: "custom-elements"
};
var NO_ERRORS_SCHEMA = {
  name: "no-errors-schema"
};
var shouldThrowErrorOnUnknownElement = false;
var shouldThrowErrorOnUnknownProperty = false;
function validateElementIsKnown(element, lView, tagName, schemas, hasDirectives) {
  if (schemas === null)
    return;
  if (!hasDirectives && tagName !== null) {
    const isUnknown = (
      // Note that we can't check for `typeof HTMLUnknownElement === 'function'` because
      // Domino doesn't expose HTMLUnknownElement globally.
      typeof HTMLUnknownElement !== "undefined" && HTMLUnknownElement && element instanceof HTMLUnknownElement || typeof customElements !== "undefined" && tagName.indexOf("-") > -1 && !customElements.get(tagName)
    );
    if (isUnknown && !matchingSchemas(schemas, tagName)) {
      const isHostStandalone = isHostComponentStandalone(lView);
      const templateLocation = getTemplateLocationDetails(lView);
      const schemas2 = `'${isHostStandalone ? "@Component" : "@NgModule"}.schemas'`;
      let message = `'${tagName}' is not a known element${templateLocation}:
`;
      message += `1. If '${tagName}' is an Angular component, then verify that it is ${isHostStandalone ? "included in the '@Component.imports' of this component" : "a part of an @NgModule where this component is declared"}.
`;
      if (tagName && tagName.indexOf("-") > -1) {
        message += `2. If '${tagName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${schemas2} of this component to suppress this message.`;
      } else {
        message += `2. To allow any element add 'NO_ERRORS_SCHEMA' to the ${schemas2} of this component.`;
      }
      if (shouldThrowErrorOnUnknownElement) {
        throw new RuntimeError(304, message);
      } else {
        console.error(formatRuntimeError(304, message));
      }
    }
  }
}
function isPropertyValid(element, propName, tagName, schemas) {
  if (schemas === null)
    return true;
  if (matchingSchemas(schemas, tagName) || propName in element || isAnimationProp(propName)) {
    return true;
  }
  return typeof Node === "undefined" || Node === null || !(element instanceof Node);
}
function handleUnknownPropertyError(propName, tagName, nodeType, lView) {
  if (!tagName && nodeType === 4) {
    tagName = "ng-template";
  }
  const isHostStandalone = isHostComponentStandalone(lView);
  const templateLocation = getTemplateLocationDetails(lView);
  let message = `Can't bind to '${propName}' since it isn't a known property of '${tagName}'${templateLocation}.`;
  const schemas = `'${isHostStandalone ? "@Component" : "@NgModule"}.schemas'`;
  const importLocation = isHostStandalone ? "included in the '@Component.imports' of this component" : "a part of an @NgModule where this component is declared";
  if (KNOWN_CONTROL_FLOW_DIRECTIVES.has(propName)) {
    const correspondingImport = KNOWN_CONTROL_FLOW_DIRECTIVES.get(propName);
    message += `
If the '${propName}' is an Angular control flow directive, please make sure that either the '${correspondingImport}' directive or the 'CommonModule' is ${importLocation}.`;
  } else {
    message += `
1. If '${tagName}' is an Angular component and it has the '${propName}' input, then verify that it is ${importLocation}.`;
    if (tagName && tagName.indexOf("-") > -1) {
      message += `
2. If '${tagName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${schemas} of this component to suppress this message.`;
      message += `
3. To allow any property add 'NO_ERRORS_SCHEMA' to the ${schemas} of this component.`;
    } else {
      message += `
2. To allow any property add 'NO_ERRORS_SCHEMA' to the ${schemas} of this component.`;
    }
  }
  reportUnknownPropertyError(message);
}
function reportUnknownPropertyError(message) {
  if (shouldThrowErrorOnUnknownProperty) {
    throw new RuntimeError(303, message);
  } else {
    console.error(formatRuntimeError(303, message));
  }
}
function getDeclarationComponentDef(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const declarationLView = lView[DECLARATION_COMPONENT_VIEW];
  const context2 = declarationLView[CONTEXT];
  if (!context2)
    return null;
  return context2.constructor ? getComponentDef(context2.constructor) : null;
}
function isHostComponentStandalone(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const componentDef = getDeclarationComponentDef(lView);
  return !!componentDef?.standalone;
}
function getTemplateLocationDetails(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const hostComponentDef = getDeclarationComponentDef(lView);
  const componentClassName = hostComponentDef?.type?.name;
  return componentClassName ? ` (used in the '${componentClassName}' component template)` : "";
}
var KNOWN_CONTROL_FLOW_DIRECTIVES = /* @__PURE__ */ new Map([["ngIf", "NgIf"], ["ngFor", "NgFor"], ["ngSwitchCase", "NgSwitchCase"], ["ngSwitchDefault", "NgSwitchDefault"]]);
function matchingSchemas(schemas, tagName) {
  if (schemas !== null) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      if (schema === NO_ERRORS_SCHEMA || schema === CUSTOM_ELEMENTS_SCHEMA && tagName && tagName.indexOf("-") > -1) {
        return true;
      }
    }
  }
  return false;
}
function hasInSkipHydrationBlockFlag(tNode) {
  return (tNode.flags & 128) === 128;
}
var RendererStyleFlags2 = /* @__PURE__ */ function(RendererStyleFlags22) {
  RendererStyleFlags22[RendererStyleFlags22["Important"] = 1] = "Important";
  RendererStyleFlags22[RendererStyleFlags22["DashCase"] = 2] = "DashCase";
  return RendererStyleFlags22;
}(RendererStyleFlags2 || {});
var COMMENT_DISALLOWED = /^>|^->|<!--|-->|--!>|<!-$/g;
var COMMENT_DELIMITER = /(<|>)/g;
var COMMENT_DELIMITER_ESCAPED = "\u200B$1\u200B";
function escapeCommentText(value) {
  return value.replace(COMMENT_DISALLOWED, (text) => text.replace(COMMENT_DELIMITER, COMMENT_DELIMITER_ESCAPED));
}
var TRACKED_LVIEWS = /* @__PURE__ */ new Map();
var uniqueIdCounter = 0;
function getUniqueLViewId() {
  return uniqueIdCounter++;
}
function registerLView(lView) {
  ngDevMode && assertNumber(lView[ID], "LView must have an ID in order to be registered");
  TRACKED_LVIEWS.set(lView[ID], lView);
}
function getLViewById(id) {
  ngDevMode && assertNumber(id, "ID used for LView lookup must be a number");
  return TRACKED_LVIEWS.get(id) || null;
}
function unregisterLView(lView) {
  ngDevMode && assertNumber(lView[ID], "Cannot stop tracking an LView that does not have an ID");
  TRACKED_LVIEWS.delete(lView[ID]);
}
var LContext = class {
  /** Component's parent view data. */
  get lView() {
    return getLViewById(this.lViewId);
  }
  constructor(lViewId, nodeIndex, native) {
    this.lViewId = lViewId;
    this.nodeIndex = nodeIndex;
    this.native = native;
  }
};
function getLContext(target) {
  let mpValue = readPatchedData(target);
  if (mpValue) {
    if (isLView(mpValue)) {
      const lView = mpValue;
      let nodeIndex;
      let component = void 0;
      let directives = void 0;
      if (isComponentInstance(target)) {
        nodeIndex = findViaComponent(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided component was not found in the application");
        }
        component = target;
      } else if (isDirectiveInstance(target)) {
        nodeIndex = findViaDirective(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided directive was not found in the application");
        }
        directives = getDirectivesAtNodeIndex(nodeIndex, lView);
      } else {
        nodeIndex = findViaNativeElement(lView, target);
        if (nodeIndex == -1) {
          return null;
        }
      }
      const native = unwrapRNode(lView[nodeIndex]);
      const existingCtx = readPatchedData(native);
      const context2 = existingCtx && !Array.isArray(existingCtx) ? existingCtx : createLContext(lView, nodeIndex, native);
      if (component && context2.component === void 0) {
        context2.component = component;
        attachPatchData(context2.component, context2);
      }
      if (directives && context2.directives === void 0) {
        context2.directives = directives;
        for (let i = 0; i < directives.length; i++) {
          attachPatchData(directives[i], context2);
        }
      }
      attachPatchData(context2.native, context2);
      mpValue = context2;
    }
  } else {
    const rElement = target;
    ngDevMode && assertDomNode(rElement);
    let parent = rElement;
    while (parent = parent.parentNode) {
      const parentContext = readPatchedData(parent);
      if (parentContext) {
        const lView = Array.isArray(parentContext) ? parentContext : parentContext.lView;
        if (!lView) {
          return null;
        }
        const index = findViaNativeElement(lView, rElement);
        if (index >= 0) {
          const native = unwrapRNode(lView[index]);
          const context2 = createLContext(lView, index, native);
          attachPatchData(native, context2);
          mpValue = context2;
          break;
        }
      }
    }
  }
  return mpValue || null;
}
function createLContext(lView, nodeIndex, native) {
  return new LContext(lView[ID], nodeIndex, native);
}
function getComponentViewByInstance(componentInstance) {
  let patchedData = readPatchedData(componentInstance);
  let lView;
  if (isLView(patchedData)) {
    const contextLView = patchedData;
    const nodeIndex = findViaComponent(contextLView, componentInstance);
    lView = getComponentLViewByIndex(nodeIndex, contextLView);
    const context2 = createLContext(contextLView, nodeIndex, lView[HOST]);
    context2.component = componentInstance;
    attachPatchData(componentInstance, context2);
    attachPatchData(context2.native, context2);
  } else {
    const context2 = patchedData;
    const contextLView = context2.lView;
    ngDevMode && assertLView(contextLView);
    lView = getComponentLViewByIndex(context2.nodeIndex, contextLView);
  }
  return lView;
}
var MONKEY_PATCH_KEY_NAME = "__ngContext__";
function attachPatchData(target, data) {
  ngDevMode && assertDefined(target, "Target expected");
  if (isLView(data)) {
    target[MONKEY_PATCH_KEY_NAME] = data[ID];
    registerLView(data);
  } else {
    target[MONKEY_PATCH_KEY_NAME] = data;
  }
}
function readPatchedData(target) {
  ngDevMode && assertDefined(target, "Target expected");
  const data = target[MONKEY_PATCH_KEY_NAME];
  return typeof data === "number" ? getLViewById(data) : data || null;
}
function readPatchedLView(target) {
  const value = readPatchedData(target);
  if (value) {
    return isLView(value) ? value : value.lView;
  }
  return null;
}
function isComponentInstance(instance) {
  return instance && instance.constructor && instance.constructor.\u0275cmp;
}
function isDirectiveInstance(instance) {
  return instance && instance.constructor && instance.constructor.\u0275dir;
}
function findViaNativeElement(lView, target) {
  const tView = lView[TVIEW];
  for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
    if (unwrapRNode(lView[i]) === target) {
      return i;
    }
  }
  return -1;
}
function traverseNextElement(tNode) {
  if (tNode.child) {
    return tNode.child;
  } else if (tNode.next) {
    return tNode.next;
  } else {
    while (tNode.parent && !tNode.parent.next) {
      tNode = tNode.parent;
    }
    return tNode.parent && tNode.parent.next;
  }
}
function findViaComponent(lView, componentInstance) {
  const componentIndices = lView[TVIEW].components;
  if (componentIndices) {
    for (let i = 0; i < componentIndices.length; i++) {
      const elementComponentIndex = componentIndices[i];
      const componentView = getComponentLViewByIndex(elementComponentIndex, lView);
      if (componentView[CONTEXT] === componentInstance) {
        return elementComponentIndex;
      }
    }
  } else {
    const rootComponentView = getComponentLViewByIndex(HEADER_OFFSET, lView);
    const rootComponent = rootComponentView[CONTEXT];
    if (rootComponent === componentInstance) {
      return HEADER_OFFSET;
    }
  }
  return -1;
}
function findViaDirective(lView, directiveInstance) {
  let tNode = lView[TVIEW].firstChild;
  while (tNode) {
    const directiveIndexStart = tNode.directiveStart;
    const directiveIndexEnd = tNode.directiveEnd;
    for (let i = directiveIndexStart; i < directiveIndexEnd; i++) {
      if (lView[i] === directiveInstance) {
        return tNode.index;
      }
    }
    tNode = traverseNextElement(tNode);
  }
  return -1;
}
function getDirectivesAtNodeIndex(nodeIndex, lView) {
  const tNode = lView[TVIEW].data[nodeIndex];
  if (tNode.directiveStart === 0)
    return EMPTY_ARRAY;
  const results = [];
  for (let i = tNode.directiveStart; i < tNode.directiveEnd; i++) {
    const directiveInstance = lView[i];
    if (!isComponentInstance(directiveInstance)) {
      results.push(directiveInstance);
    }
  }
  return results;
}
function getComponentAtNodeIndex(nodeIndex, lView) {
  const tNode = lView[TVIEW].data[nodeIndex];
  const {
    directiveStart,
    componentOffset
  } = tNode;
  return componentOffset > -1 ? lView[directiveStart + componentOffset] : null;
}
var _icuContainerIterate;
function icuContainerIterate(tIcuContainerNode, lView) {
  return _icuContainerIterate(tIcuContainerNode, lView);
}
function getLViewParent(lView) {
  ngDevMode && assertLView(lView);
  const parent = lView[PARENT];
  return isLContainer(parent) ? parent[PARENT] : parent;
}
function getRootView(componentOrLView) {
  ngDevMode && assertDefined(componentOrLView, "component");
  let lView = isLView(componentOrLView) ? componentOrLView : readPatchedLView(componentOrLView);
  while (lView && !(lView[FLAGS] & 512)) {
    lView = getLViewParent(lView);
  }
  ngDevMode && assertLView(lView);
  return lView;
}
function getRootContext(viewOrComponent) {
  const rootView = getRootView(viewOrComponent);
  ngDevMode && assertDefined(rootView[CONTEXT], "Root view has no context. Perhaps it is disconnected?");
  return rootView[CONTEXT];
}
function getFirstLContainer(lView) {
  return getNearestLContainer(lView[CHILD_HEAD]);
}
function getNextLContainer(container) {
  return getNearestLContainer(container[NEXT]);
}
function getNearestLContainer(viewOrContainer) {
  while (viewOrContainer !== null && !isLContainer(viewOrContainer)) {
    viewOrContainer = viewOrContainer[NEXT];
  }
  return viewOrContainer;
}
function applyToElementOrContainer(action, renderer, parent, lNodeToHandle, beforeNode) {
  if (lNodeToHandle != null) {
    let lContainer;
    let isComponent = false;
    if (isLContainer(lNodeToHandle)) {
      lContainer = lNodeToHandle;
    } else if (isLView(lNodeToHandle)) {
      isComponent = true;
      ngDevMode && assertDefined(lNodeToHandle[HOST], "HOST must be defined for a component LView");
      lNodeToHandle = lNodeToHandle[HOST];
    }
    const rNode = unwrapRNode(lNodeToHandle);
    if (action === 0 && parent !== null) {
      if (beforeNode == null) {
        nativeAppendChild(renderer, parent, rNode);
      } else {
        nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
      }
    } else if (action === 1 && parent !== null) {
      nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
    } else if (action === 2) {
      nativeRemoveNode(renderer, rNode, isComponent);
    } else if (action === 3) {
      ngDevMode && ngDevMode.rendererDestroyNode++;
      renderer.destroyNode(rNode);
    }
    if (lContainer != null) {
      applyContainer(renderer, action, lContainer, parent, beforeNode);
    }
  }
}
function createTextNode(renderer, value) {
  ngDevMode && ngDevMode.rendererCreateTextNode++;
  ngDevMode && ngDevMode.rendererSetText++;
  return renderer.createText(value);
}
function updateTextNode(renderer, rNode, value) {
  ngDevMode && ngDevMode.rendererSetText++;
  renderer.setValue(rNode, value);
}
function createCommentNode(renderer, value) {
  ngDevMode && ngDevMode.rendererCreateComment++;
  return renderer.createComment(escapeCommentText(value));
}
function createElementNode(renderer, name, namespace) {
  ngDevMode && ngDevMode.rendererCreateElement++;
  return renderer.createElement(name, namespace);
}
function removeViewFromDOM(tView, lView) {
  const renderer = lView[RENDERER];
  applyView(tView, lView, renderer, 2, null, null);
  lView[HOST] = null;
  lView[T_HOST] = null;
}
function addViewToDOM(tView, parentTNode, renderer, lView, parentNativeNode, beforeNode) {
  lView[HOST] = parentNativeNode;
  lView[T_HOST] = parentTNode;
  applyView(tView, lView, renderer, 1, parentNativeNode, beforeNode);
}
function detachViewFromDOM(tView, lView) {
  applyView(tView, lView, lView[RENDERER], 2, null, null);
}
function destroyViewTree(rootView) {
  let lViewOrLContainer = rootView[CHILD_HEAD];
  if (!lViewOrLContainer) {
    return cleanUpView(rootView[TVIEW], rootView);
  }
  while (lViewOrLContainer) {
    let next = null;
    if (isLView(lViewOrLContainer)) {
      next = lViewOrLContainer[CHILD_HEAD];
    } else {
      ngDevMode && assertLContainer(lViewOrLContainer);
      const firstView = lViewOrLContainer[CONTAINER_HEADER_OFFSET];
      if (firstView)
        next = firstView;
    }
    if (!next) {
      while (lViewOrLContainer && !lViewOrLContainer[NEXT] && lViewOrLContainer !== rootView) {
        if (isLView(lViewOrLContainer)) {
          cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
        }
        lViewOrLContainer = lViewOrLContainer[PARENT];
      }
      if (lViewOrLContainer === null)
        lViewOrLContainer = rootView;
      if (isLView(lViewOrLContainer)) {
        cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
      }
      next = lViewOrLContainer && lViewOrLContainer[NEXT];
    }
    lViewOrLContainer = next;
  }
}
function insertView(tView, lView, lContainer, index) {
  ngDevMode && assertLView(lView);
  ngDevMode && assertLContainer(lContainer);
  const indexInContainer = CONTAINER_HEADER_OFFSET + index;
  const containerLength = lContainer.length;
  if (index > 0) {
    lContainer[indexInContainer - 1][NEXT] = lView;
  }
  if (index < containerLength - CONTAINER_HEADER_OFFSET) {
    lView[NEXT] = lContainer[indexInContainer];
    addToArray(lContainer, CONTAINER_HEADER_OFFSET + index, lView);
  } else {
    lContainer.push(lView);
    lView[NEXT] = null;
  }
  lView[PARENT] = lContainer;
  const declarationLContainer = lView[DECLARATION_LCONTAINER];
  if (declarationLContainer !== null && lContainer !== declarationLContainer) {
    trackMovedView(declarationLContainer, lView);
  }
  const lQueries = lView[QUERIES];
  if (lQueries !== null) {
    lQueries.insertView(tView);
  }
  lView[FLAGS] |= 128;
}
function trackMovedView(declarationContainer, lView) {
  ngDevMode && assertDefined(lView, "LView required");
  ngDevMode && assertLContainer(declarationContainer);
  const movedViews = declarationContainer[MOVED_VIEWS];
  const insertedLContainer = lView[PARENT];
  ngDevMode && assertLContainer(insertedLContainer);
  const insertedComponentLView = insertedLContainer[PARENT][DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(insertedComponentLView, "Missing insertedComponentLView");
  const declaredComponentLView = lView[DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(declaredComponentLView, "Missing declaredComponentLView");
  if (declaredComponentLView !== insertedComponentLView) {
    declarationContainer[HAS_TRANSPLANTED_VIEWS] = true;
  }
  if (movedViews === null) {
    declarationContainer[MOVED_VIEWS] = [lView];
  } else {
    movedViews.push(lView);
  }
}
function detachMovedView(declarationContainer, lView) {
  ngDevMode && assertLContainer(declarationContainer);
  ngDevMode && assertDefined(declarationContainer[MOVED_VIEWS], "A projected view should belong to a non-empty projected views collection");
  const movedViews = declarationContainer[MOVED_VIEWS];
  const declarationViewIndex = movedViews.indexOf(lView);
  const insertionLContainer = lView[PARENT];
  ngDevMode && assertLContainer(insertionLContainer);
  clearViewRefreshFlag(lView);
  movedViews.splice(declarationViewIndex, 1);
}
function detachView(lContainer, removeIndex) {
  if (lContainer.length <= CONTAINER_HEADER_OFFSET)
    return;
  const indexInContainer = CONTAINER_HEADER_OFFSET + removeIndex;
  const viewToDetach = lContainer[indexInContainer];
  if (viewToDetach) {
    const declarationLContainer = viewToDetach[DECLARATION_LCONTAINER];
    if (declarationLContainer !== null && declarationLContainer !== lContainer) {
      detachMovedView(declarationLContainer, viewToDetach);
    }
    if (removeIndex > 0) {
      lContainer[indexInContainer - 1][NEXT] = viewToDetach[NEXT];
    }
    const removedLView = removeFromArray(lContainer, CONTAINER_HEADER_OFFSET + removeIndex);
    removeViewFromDOM(viewToDetach[TVIEW], viewToDetach);
    const lQueries = removedLView[QUERIES];
    if (lQueries !== null) {
      lQueries.detachView(removedLView[TVIEW]);
    }
    viewToDetach[PARENT] = null;
    viewToDetach[NEXT] = null;
    viewToDetach[FLAGS] &= ~128;
  }
  return viewToDetach;
}
function destroyLView(tView, lView) {
  if (!(lView[FLAGS] & 256)) {
    const renderer = lView[RENDERER];
    lView[REACTIVE_TEMPLATE_CONSUMER] && consumerDestroy(lView[REACTIVE_TEMPLATE_CONSUMER]);
    lView[REACTIVE_HOST_BINDING_CONSUMER] && consumerDestroy(lView[REACTIVE_HOST_BINDING_CONSUMER]);
    if (renderer.destroyNode) {
      applyView(tView, lView, renderer, 3, null, null);
    }
    destroyViewTree(lView);
  }
}
function cleanUpView(tView, lView) {
  if (!(lView[FLAGS] & 256)) {
    lView[FLAGS] &= ~128;
    lView[FLAGS] |= 256;
    executeOnDestroys(tView, lView);
    processCleanups(tView, lView);
    if (lView[TVIEW].type === 1) {
      ngDevMode && ngDevMode.rendererDestroy++;
      lView[RENDERER].destroy();
    }
    const declarationContainer = lView[DECLARATION_LCONTAINER];
    if (declarationContainer !== null && isLContainer(lView[PARENT])) {
      if (declarationContainer !== lView[PARENT]) {
        detachMovedView(declarationContainer, lView);
      }
      const lQueries = lView[QUERIES];
      if (lQueries !== null) {
        lQueries.detachView(tView);
      }
    }
    unregisterLView(lView);
  }
}
function processCleanups(tView, lView) {
  const tCleanup = tView.cleanup;
  const lCleanup = lView[CLEANUP];
  if (tCleanup !== null) {
    for (let i = 0; i < tCleanup.length - 1; i += 2) {
      if (typeof tCleanup[i] === "string") {
        const targetIdx = tCleanup[i + 3];
        ngDevMode && assertNumber(targetIdx, "cleanup target must be a number");
        if (targetIdx >= 0) {
          lCleanup[targetIdx]();
        } else {
          lCleanup[-targetIdx].unsubscribe();
        }
        i += 2;
      } else {
        const context2 = lCleanup[tCleanup[i + 1]];
        tCleanup[i].call(context2);
      }
    }
  }
  if (lCleanup !== null) {
    lView[CLEANUP] = null;
  }
  const destroyHooks = lView[ON_DESTROY_HOOKS];
  if (destroyHooks !== null) {
    lView[ON_DESTROY_HOOKS] = null;
    for (let i = 0; i < destroyHooks.length; i++) {
      const destroyHooksFn = destroyHooks[i];
      ngDevMode && assertFunction(destroyHooksFn, "Expecting destroy hook to be a function.");
      destroyHooksFn();
    }
  }
}
function executeOnDestroys(tView, lView) {
  let destroyHooks;
  if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
    for (let i = 0; i < destroyHooks.length; i += 2) {
      const context2 = lView[destroyHooks[i]];
      if (!(context2 instanceof NodeInjectorFactory)) {
        const toCall = destroyHooks[i + 1];
        if (Array.isArray(toCall)) {
          for (let j = 0; j < toCall.length; j += 2) {
            const callContext = context2[toCall[j]];
            const hook = toCall[j + 1];
            profiler(4, callContext, hook);
            try {
              hook.call(callContext);
            } finally {
              profiler(5, callContext, hook);
            }
          }
        } else {
          profiler(4, context2, toCall);
          try {
            toCall.call(context2);
          } finally {
            profiler(5, context2, toCall);
          }
        }
      }
    }
  }
}
function getParentRElement(tView, tNode, lView) {
  return getClosestRElement(tView, tNode.parent, lView);
}
function getClosestRElement(tView, tNode, lView) {
  let parentTNode = tNode;
  while (parentTNode !== null && parentTNode.type & (8 | 32)) {
    tNode = parentTNode;
    parentTNode = tNode.parent;
  }
  if (parentTNode === null) {
    return lView[HOST];
  } else {
    ngDevMode && assertTNodeType(
      parentTNode,
      3 | 4
      /* TNodeType.Container */
    );
    const {
      componentOffset
    } = parentTNode;
    if (componentOffset > -1) {
      ngDevMode && assertTNodeForLView(parentTNode, lView);
      const {
        encapsulation
      } = tView.data[parentTNode.directiveStart + componentOffset];
      if (encapsulation === ViewEncapsulation$1.None || encapsulation === ViewEncapsulation$1.Emulated) {
        return null;
      }
    }
    return getNativeByTNode(parentTNode, lView);
  }
}
function nativeInsertBefore(renderer, parent, child, beforeNode, isMove) {
  ngDevMode && ngDevMode.rendererInsertBefore++;
  renderer.insertBefore(parent, child, beforeNode, isMove);
}
function nativeAppendChild(renderer, parent, child) {
  ngDevMode && ngDevMode.rendererAppendChild++;
  ngDevMode && assertDefined(parent, "parent node must be defined");
  renderer.appendChild(parent, child);
}
function nativeAppendOrInsertBefore(renderer, parent, child, beforeNode, isMove) {
  if (beforeNode !== null) {
    nativeInsertBefore(renderer, parent, child, beforeNode, isMove);
  } else {
    nativeAppendChild(renderer, parent, child);
  }
}
function nativeRemoveChild(renderer, parent, child, isHostElement) {
  renderer.removeChild(parent, child, isHostElement);
}
function nativeParentNode(renderer, node) {
  return renderer.parentNode(node);
}
function nativeNextSibling(renderer, node) {
  return renderer.nextSibling(node);
}
function getInsertInFrontOfRNode(parentTNode, currentTNode, lView) {
  return _getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView);
}
function getInsertInFrontOfRNodeWithNoI18n(parentTNode, currentTNode, lView) {
  if (parentTNode.type & (8 | 32)) {
    return getNativeByTNode(parentTNode, lView);
  }
  return null;
}
var _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithNoI18n;
var _processI18nInsertBefore;
function appendChild(tView, lView, childRNode, childTNode) {
  const parentRNode = getParentRElement(tView, childTNode, lView);
  const renderer = lView[RENDERER];
  const parentTNode = childTNode.parent || lView[T_HOST];
  const anchorNode = getInsertInFrontOfRNode(parentTNode, childTNode, lView);
  if (parentRNode != null) {
    if (Array.isArray(childRNode)) {
      for (let i = 0; i < childRNode.length; i++) {
        nativeAppendOrInsertBefore(renderer, parentRNode, childRNode[i], anchorNode, false);
      }
    } else {
      nativeAppendOrInsertBefore(renderer, parentRNode, childRNode, anchorNode, false);
    }
  }
  _processI18nInsertBefore !== void 0 && _processI18nInsertBefore(renderer, childTNode, lView, childRNode, parentRNode);
}
function getFirstNativeNode(lView, tNode) {
  if (tNode !== null) {
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 32 | 16
      /* TNodeType.Projection */
    );
    const tNodeType = tNode.type;
    if (tNodeType & 3) {
      return getNativeByTNode(tNode, lView);
    } else if (tNodeType & 4) {
      return getBeforeNodeForView(-1, lView[tNode.index]);
    } else if (tNodeType & 8) {
      const elIcuContainerChild = tNode.child;
      if (elIcuContainerChild !== null) {
        return getFirstNativeNode(lView, elIcuContainerChild);
      } else {
        const rNodeOrLContainer = lView[tNode.index];
        if (isLContainer(rNodeOrLContainer)) {
          return getBeforeNodeForView(-1, rNodeOrLContainer);
        } else {
          return unwrapRNode(rNodeOrLContainer);
        }
      }
    } else if (tNodeType & 32) {
      let nextRNode = icuContainerIterate(tNode, lView);
      let rNode = nextRNode();
      return rNode || unwrapRNode(lView[tNode.index]);
    } else {
      const projectionNodes = getProjectionNodes(lView, tNode);
      if (projectionNodes !== null) {
        if (Array.isArray(projectionNodes)) {
          return projectionNodes[0];
        }
        const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
        ngDevMode && assertParentView(parentView);
        return getFirstNativeNode(parentView, projectionNodes);
      } else {
        return getFirstNativeNode(lView, tNode.next);
      }
    }
  }
  return null;
}
function getProjectionNodes(lView, tNode) {
  if (tNode !== null) {
    const componentView = lView[DECLARATION_COMPONENT_VIEW];
    const componentHost = componentView[T_HOST];
    const slotIdx = tNode.projection;
    ngDevMode && assertProjectionSlots(lView);
    return componentHost.projection[slotIdx];
  }
  return null;
}
function getBeforeNodeForView(viewIndexInContainer, lContainer) {
  const nextViewIndex = CONTAINER_HEADER_OFFSET + viewIndexInContainer + 1;
  if (nextViewIndex < lContainer.length) {
    const lView = lContainer[nextViewIndex];
    const firstTNodeOfView = lView[TVIEW].firstChild;
    if (firstTNodeOfView !== null) {
      return getFirstNativeNode(lView, firstTNodeOfView);
    }
  }
  return lContainer[NATIVE];
}
function nativeRemoveNode(renderer, rNode, isHostElement) {
  ngDevMode && ngDevMode.rendererRemoveNode++;
  const nativeParent = nativeParentNode(renderer, rNode);
  if (nativeParent) {
    nativeRemoveChild(renderer, nativeParent, rNode, isHostElement);
  }
}
function applyNodes(renderer, action, tNode, lView, parentRElement, beforeNode, isProjection) {
  while (tNode != null) {
    ngDevMode && assertTNodeForLView(tNode, lView);
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 16 | 32
      /* TNodeType.Icu */
    );
    const rawSlotValue = lView[tNode.index];
    const tNodeType = tNode.type;
    if (isProjection) {
      if (action === 0) {
        rawSlotValue && attachPatchData(unwrapRNode(rawSlotValue), lView);
        tNode.flags |= 2;
      }
    }
    if ((tNode.flags & 32) !== 32) {
      if (tNodeType & 8) {
        applyNodes(renderer, action, tNode.child, lView, parentRElement, beforeNode, false);
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & 32) {
        const nextRNode = icuContainerIterate(tNode, lView);
        let rNode;
        while (rNode = nextRNode()) {
          applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
        }
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & 16) {
        applyProjectionRecursive(renderer, action, lView, tNode, parentRElement, beforeNode);
      } else {
        ngDevMode && assertTNodeType(
          tNode,
          3 | 4
          /* TNodeType.Container */
        );
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }
}
function applyView(tView, lView, renderer, action, parentRElement, beforeNode) {
  applyNodes(renderer, action, tView.firstChild, lView, parentRElement, beforeNode, false);
}
function applyProjectionRecursive(renderer, action, lView, tProjectionNode, parentRElement, beforeNode) {
  const componentLView = lView[DECLARATION_COMPONENT_VIEW];
  const componentNode = componentLView[T_HOST];
  ngDevMode && assertEqual(typeof tProjectionNode.projection, "number", "expecting projection index");
  const nodeToProjectOrRNodes = componentNode.projection[tProjectionNode.projection];
  if (Array.isArray(nodeToProjectOrRNodes)) {
    for (let i = 0; i < nodeToProjectOrRNodes.length; i++) {
      const rNode = nodeToProjectOrRNodes[i];
      applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
    }
  } else {
    let nodeToProject = nodeToProjectOrRNodes;
    const projectedComponentLView = componentLView[PARENT];
    if (hasInSkipHydrationBlockFlag(tProjectionNode)) {
      nodeToProject.flags |= 128;
    }
    applyNodes(renderer, action, nodeToProject, projectedComponentLView, parentRElement, beforeNode, true);
  }
}
function applyContainer(renderer, action, lContainer, parentRElement, beforeNode) {
  ngDevMode && assertLContainer(lContainer);
  const anchor = lContainer[NATIVE];
  const native = unwrapRNode(lContainer);
  if (anchor !== native) {
    applyToElementOrContainer(action, renderer, parentRElement, anchor, beforeNode);
  }
  for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    const lView = lContainer[i];
    applyView(lView[TVIEW], lView, renderer, action, parentRElement, anchor);
  }
}
function applyStyling(renderer, isClassBased, rNode, prop, value) {
  if (isClassBased) {
    if (!value) {
      ngDevMode && ngDevMode.rendererRemoveClass++;
      renderer.removeClass(rNode, prop);
    } else {
      ngDevMode && ngDevMode.rendererAddClass++;
      renderer.addClass(rNode, prop);
    }
  } else {
    let flags = prop.indexOf("-") === -1 ? void 0 : RendererStyleFlags2.DashCase;
    if (value == null) {
      ngDevMode && ngDevMode.rendererRemoveStyle++;
      renderer.removeStyle(rNode, prop, flags);
    } else {
      const isImportant = typeof value === "string" ? value.endsWith("!important") : false;
      if (isImportant) {
        value = value.slice(0, -10);
        flags |= RendererStyleFlags2.Important;
      }
      ngDevMode && ngDevMode.rendererSetStyle++;
      renderer.setStyle(rNode, prop, value, flags);
    }
  }
}
function writeDirectStyle(renderer, element, newValue) {
  ngDevMode && assertString(newValue, "'newValue' should be a string");
  renderer.setAttribute(element, "style", newValue);
  ngDevMode && ngDevMode.rendererSetStyle++;
}
function writeDirectClass(renderer, element, newValue) {
  ngDevMode && assertString(newValue, "'newValue' should be a string");
  if (newValue === "") {
    renderer.removeAttribute(element, "class");
  } else {
    renderer.setAttribute(element, "class", newValue);
  }
  ngDevMode && ngDevMode.rendererSetClassName++;
}
function setupStaticAttributes(renderer, element, tNode) {
  const {
    mergedAttrs,
    classes,
    styles
  } = tNode;
  if (mergedAttrs !== null) {
    setUpAttributes(renderer, element, mergedAttrs);
  }
  if (classes !== null) {
    writeDirectClass(renderer, element, classes);
  }
  if (styles !== null) {
    writeDirectStyle(renderer, element, styles);
  }
}
var DOCUMENT = void 0;
function setDocument(document2) {
  DOCUMENT = document2;
}
function getDocument() {
  if (DOCUMENT !== void 0) {
    return DOCUMENT;
  } else if (typeof document !== "undefined") {
    return document;
  }
  throw new RuntimeError(210, (typeof ngDevMode === "undefined" || ngDevMode) && `The document object is not available in this context. Make sure the DOCUMENT injection token is provided.`);
}
var policy;
function getPolicy() {
  if (policy === void 0) {
    policy = null;
    if (_global.trustedTypes) {
      try {
        policy = _global.trustedTypes.createPolicy("angular#unsafe-bypass", {
          createHTML: (s) => s,
          createScript: (s) => s,
          createScriptURL: (s) => s
        });
      } catch {
      }
    }
  }
  return policy;
}
function trustedScriptURLFromStringBypass(url) {
  return getPolicy()?.createScriptURL(url) || url;
}
var SafeValueImpl = class {
  constructor(changingThisBreaksApplicationSecurity) {
    this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${XSS_SECURITY_URL})`;
  }
};
function unwrapSafeValue(value) {
  return value instanceof SafeValueImpl ? value.changingThisBreaksApplicationSecurity : value;
}
function allowSanitizationBypassAndThrow(value, type) {
  const actualType = getSanitizationBypassType(value);
  if (actualType != null && actualType !== type) {
    if (actualType === "ResourceURL" && type === "URL")
      return true;
    throw new Error(`Required a safe ${type}, got a ${actualType} (see ${XSS_SECURITY_URL})`);
  }
  return actualType === type;
}
function getSanitizationBypassType(value) {
  return value instanceof SafeValueImpl && value.getTypeName() || null;
}
var SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function _sanitizeUrl(url) {
  url = String(url);
  if (url.match(SAFE_URL_PATTERN))
    return url;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    console.warn(`WARNING: sanitizing unsafe URL value ${url} (see ${XSS_SECURITY_URL})`);
  }
  return "unsafe:" + url;
}
var SecurityContext = /* @__PURE__ */ function(SecurityContext2) {
  SecurityContext2[SecurityContext2["NONE"] = 0] = "NONE";
  SecurityContext2[SecurityContext2["HTML"] = 1] = "HTML";
  SecurityContext2[SecurityContext2["STYLE"] = 2] = "STYLE";
  SecurityContext2[SecurityContext2["SCRIPT"] = 3] = "SCRIPT";
  SecurityContext2[SecurityContext2["URL"] = 4] = "URL";
  SecurityContext2[SecurityContext2["RESOURCE_URL"] = 5] = "RESOURCE_URL";
  return SecurityContext2;
}(SecurityContext || {});
function \u0275\u0275sanitizeUrl(unsafeUrl) {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || "";
  }
  if (allowSanitizationBypassAndThrow(
    unsafeUrl,
    "URL"
    /* BypassType.Url */
  )) {
    return unwrapSafeValue(unsafeUrl);
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}
function \u0275\u0275sanitizeResourceUrl(unsafeResourceUrl) {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return trustedScriptURLFromStringBypass(sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || "");
  }
  if (allowSanitizationBypassAndThrow(
    unsafeResourceUrl,
    "ResourceURL"
    /* BypassType.ResourceUrl */
  )) {
    return trustedScriptURLFromStringBypass(unwrapSafeValue(unsafeResourceUrl));
  }
  throw new RuntimeError(904, ngDevMode && `unsafe value used in a resource URL context (see ${XSS_SECURITY_URL})`);
}
function getUrlSanitizer(tag, prop) {
  if (prop === "src" && (tag === "embed" || tag === "frame" || tag === "iframe" || tag === "media" || tag === "script") || prop === "href" && (tag === "base" || tag === "link")) {
    return \u0275\u0275sanitizeResourceUrl;
  }
  return \u0275\u0275sanitizeUrl;
}
function \u0275\u0275sanitizeUrlOrResourceUrl(unsafeUrl, tag, prop) {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}
function validateAgainstEventProperties(name) {
  if (name.toLowerCase().startsWith("on")) {
    const errorMessage = `Binding to event property '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...
If '${name}' is a directive input, make sure the directive is imported by the current module.`;
    throw new RuntimeError(306, errorMessage);
  }
}
function validateAgainstEventAttributes(name) {
  if (name.toLowerCase().startsWith("on")) {
    const errorMessage = `Binding to event attribute '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...`;
    throw new RuntimeError(306, errorMessage);
  }
}
function getSanitizer() {
  const lView = getLView();
  return lView && lView[ENVIRONMENT].sanitizer;
}
var ENVIRONMENT_INITIALIZER = /* @__PURE__ */ new InjectionToken("ENVIRONMENT_INITIALIZER");
var INJECTOR = /* @__PURE__ */ new InjectionToken(
  "INJECTOR",
  // Disable tslint because this is const enum which gets inlined not top level prop access.
  // tslint:disable-next-line: no-toplevel-property-access
  -1
  /* InjectorMarkers.Injector */
);
var INJECTOR_DEF_TYPES = /* @__PURE__ */ new InjectionToken("INJECTOR_DEF_TYPES");
var NullInjector = class {
  get(token, notFoundValue = THROW_IF_NOT_FOUND) {
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      const error = new Error(`NullInjectorError: No provider for ${stringify(token)}!`);
      error.name = "NullInjectorError";
      throw error;
    }
    return notFoundValue;
  }
};
function makeEnvironmentProviders(providers) {
  return {
    \u0275providers: providers
  };
}
function importProvidersFrom(...sources) {
  return {
    \u0275providers: internalImportProvidersFrom(true, sources),
    \u0275fromNgModule: true
  };
}
function internalImportProvidersFrom(checkForStandaloneCmp, ...sources) {
  const providersOut = [];
  const dedup = /* @__PURE__ */ new Set();
  let injectorTypesWithProviders;
  const collectProviders = (provider) => {
    providersOut.push(provider);
  };
  deepForEach(sources, (source) => {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && checkForStandaloneCmp) {
      const cmpDef = getComponentDef(source);
      if (cmpDef?.standalone) {
        throw new RuntimeError(800, `Importing providers supports NgModule or ModuleWithProviders but got a standalone component "${stringifyForError(source)}"`);
      }
    }
    const internalSource = source;
    if (walkProviderTree(internalSource, collectProviders, [], dedup)) {
      injectorTypesWithProviders ||= [];
      injectorTypesWithProviders.push(internalSource);
    }
  });
  if (injectorTypesWithProviders !== void 0) {
    processInjectorTypesWithProviders(injectorTypesWithProviders, collectProviders);
  }
  return providersOut;
}
function processInjectorTypesWithProviders(typesWithProviders, visitor) {
  for (let i = 0; i < typesWithProviders.length; i++) {
    const {
      ngModule,
      providers
    } = typesWithProviders[i];
    deepForEachProvider(providers, (provider) => {
      ngDevMode && validateProvider(provider, providers || EMPTY_ARRAY, ngModule);
      visitor(provider, ngModule);
    });
  }
}
function walkProviderTree(container, visitor, parents, dedup) {
  container = resolveForwardRef(container);
  if (!container)
    return false;
  let defType = null;
  let injDef = getInjectorDef(container);
  const cmpDef = !injDef && getComponentDef(container);
  if (!injDef && !cmpDef) {
    const ngModule = container.ngModule;
    injDef = getInjectorDef(ngModule);
    if (injDef) {
      defType = ngModule;
    } else {
      return false;
    }
  } else if (cmpDef && !cmpDef.standalone) {
    return false;
  } else {
    defType = container;
  }
  if (ngDevMode && parents.indexOf(defType) !== -1) {
    const defName = stringify(defType);
    const path = parents.map(stringify);
    throwCyclicDependencyError(defName, path);
  }
  const isDuplicate = dedup.has(defType);
  if (cmpDef) {
    if (isDuplicate) {
      return false;
    }
    dedup.add(defType);
    if (cmpDef.dependencies) {
      const deps = typeof cmpDef.dependencies === "function" ? cmpDef.dependencies() : cmpDef.dependencies;
      for (const dep of deps) {
        walkProviderTree(dep, visitor, parents, dedup);
      }
    }
  } else if (injDef) {
    if (injDef.imports != null && !isDuplicate) {
      ngDevMode && parents.push(defType);
      dedup.add(defType);
      let importTypesWithProviders;
      try {
        deepForEach(injDef.imports, (imported) => {
          if (walkProviderTree(imported, visitor, parents, dedup)) {
            importTypesWithProviders ||= [];
            importTypesWithProviders.push(imported);
          }
        });
      } finally {
        ngDevMode && parents.pop();
      }
      if (importTypesWithProviders !== void 0) {
        processInjectorTypesWithProviders(importTypesWithProviders, visitor);
      }
    }
    if (!isDuplicate) {
      const factory = getFactoryDef(defType) || (() => new defType());
      visitor({
        provide: defType,
        useFactory: factory,
        deps: EMPTY_ARRAY
      }, defType);
      visitor({
        provide: INJECTOR_DEF_TYPES,
        useValue: defType,
        multi: true
      }, defType);
      visitor({
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => \u0275\u0275inject(defType),
        multi: true
      }, defType);
    }
    const defProviders = injDef.providers;
    if (defProviders != null && !isDuplicate) {
      const injectorType = container;
      deepForEachProvider(defProviders, (provider) => {
        ngDevMode && validateProvider(provider, defProviders, injectorType);
        visitor(provider, injectorType);
      });
    }
  } else {
    return false;
  }
  return defType !== container && container.providers !== void 0;
}
function validateProvider(provider, providers, containerType) {
  if (isTypeProvider(provider) || isValueProvider(provider) || isFactoryProvider(provider) || isExistingProvider(provider)) {
    return;
  }
  const classRef = resolveForwardRef(provider && (provider.useClass || provider.provide));
  if (!classRef) {
    throwInvalidProviderError(containerType, providers, provider);
  }
}
function deepForEachProvider(providers, fn) {
  for (let provider of providers) {
    if (isEnvironmentProviders(provider)) {
      provider = provider.\u0275providers;
    }
    if (Array.isArray(provider)) {
      deepForEachProvider(provider, fn);
    } else {
      fn(provider);
    }
  }
}
var USE_VALUE$1 = /* @__PURE__ */ getClosureSafeProperty({
  provide: String,
  useValue: getClosureSafeProperty
});
function isValueProvider(value) {
  return value !== null && typeof value == "object" && USE_VALUE$1 in value;
}
function isExistingProvider(value) {
  return !!(value && value.useExisting);
}
function isFactoryProvider(value) {
  return !!(value && value.useFactory);
}
function isTypeProvider(value) {
  return typeof value === "function";
}
function isClassProvider(value) {
  return !!value.useClass;
}
var INJECTOR_SCOPE = /* @__PURE__ */ new InjectionToken("Set Injector scope.");
var NOT_YET = {};
var CIRCULAR = {};
var NULL_INJECTOR = void 0;
function getNullInjector() {
  if (NULL_INJECTOR === void 0) {
    NULL_INJECTOR = new NullInjector();
  }
  return NULL_INJECTOR;
}
var EnvironmentInjector = class {
};
var R3Injector = class extends EnvironmentInjector {
  /**
   * Flag indicating that this injector was previously destroyed.
   */
  get destroyed() {
    return this._destroyed;
  }
  constructor(providers, parent, source, scopes) {
    super();
    this.parent = parent;
    this.source = source;
    this.scopes = scopes;
    this.records = /* @__PURE__ */ new Map();
    this._ngOnDestroyHooks = /* @__PURE__ */ new Set();
    this._onDestroyHooks = [];
    this._destroyed = false;
    forEachSingleProvider(providers, (provider) => this.processProvider(provider));
    this.records.set(INJECTOR, makeRecord(void 0, this));
    if (scopes.has("environment")) {
      this.records.set(EnvironmentInjector, makeRecord(void 0, this));
    }
    const record = this.records.get(INJECTOR_SCOPE);
    if (record != null && typeof record.value === "string") {
      this.scopes.add(record.value);
    }
    this.injectorDefTypes = new Set(this.get(INJECTOR_DEF_TYPES.multi, EMPTY_ARRAY, InjectFlags.Self));
  }
  /**
   * Destroy the injector and release references to every instance or provider associated with it.
   *
   * Also calls the `OnDestroy` lifecycle hooks of every instance that was created for which a
   * hook was found.
   */
  destroy() {
    this.assertNotDestroyed();
    this._destroyed = true;
    try {
      for (const service of this._ngOnDestroyHooks) {
        service.ngOnDestroy();
      }
      const onDestroyHooks = this._onDestroyHooks;
      this._onDestroyHooks = [];
      for (const hook of onDestroyHooks) {
        hook();
      }
    } finally {
      this.records.clear();
      this._ngOnDestroyHooks.clear();
      this.injectorDefTypes.clear();
    }
  }
  onDestroy(callback) {
    this.assertNotDestroyed();
    this._onDestroyHooks.push(callback);
    return () => this.removeOnDestroy(callback);
  }
  runInContext(fn) {
    this.assertNotDestroyed();
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    let prevInjectContext;
    if (ngDevMode) {
      prevInjectContext = setInjectorProfilerContext({
        injector: this,
        token: null
      });
    }
    try {
      return fn();
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
      ngDevMode && setInjectorProfilerContext(prevInjectContext);
    }
  }
  get(token, notFoundValue = THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
    this.assertNotDestroyed();
    if (token.hasOwnProperty(NG_ENV_ID)) {
      return token[NG_ENV_ID](this);
    }
    flags = convertToBitFlags(flags);
    let prevInjectContext;
    if (ngDevMode) {
      prevInjectContext = setInjectorProfilerContext({
        injector: this,
        token
      });
    }
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      if (!(flags & InjectFlags.SkipSelf)) {
        let record = this.records.get(token);
        if (record === void 0) {
          const def = couldBeInjectableType(token) && getInjectableDef(token);
          if (def && this.injectableDefInScope(def)) {
            if (ngDevMode) {
              runInInjectorProfilerContext(this, token, () => {
                emitProviderConfiguredEvent(token);
              });
            }
            record = makeRecord(injectableDefOrInjectorDefFactory(token), NOT_YET);
          } else {
            record = null;
          }
          this.records.set(token, record);
        }
        if (record != null) {
          return this.hydrate(token, record);
        }
      }
      const nextInjector = !(flags & InjectFlags.Self) ? this.parent : getNullInjector();
      notFoundValue = flags & InjectFlags.Optional && notFoundValue === THROW_IF_NOT_FOUND ? null : notFoundValue;
      return nextInjector.get(token, notFoundValue);
    } catch (e) {
      if (e.name === "NullInjectorError") {
        const path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
        path.unshift(stringify(token));
        if (previousInjector) {
          throw e;
        } else {
          return catchInjectorError(e, token, "R3InjectorError", this.source);
        }
      } else {
        throw e;
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
      setCurrentInjector(previousInjector);
      ngDevMode && setInjectorProfilerContext(prevInjectContext);
    }
  }
  /** @internal */
  resolveInjectorInitializers() {
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    let prevInjectContext;
    if (ngDevMode) {
      prevInjectContext = setInjectorProfilerContext({
        injector: this,
        token: null
      });
    }
    try {
      const initializers = this.get(ENVIRONMENT_INITIALIZER.multi, EMPTY_ARRAY, InjectFlags.Self);
      if (ngDevMode && !Array.isArray(initializers)) {
        throw new RuntimeError(-209, `Unexpected type of the \`ENVIRONMENT_INITIALIZER\` token value (expected an array, but got ${typeof initializers}). Please check that the \`ENVIRONMENT_INITIALIZER\` token is configured as a \`multi: true\` provider.`);
      }
      for (const initializer of initializers) {
        initializer();
      }
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
      ngDevMode && setInjectorProfilerContext(prevInjectContext);
    }
  }
  toString() {
    const tokens = [];
    const records = this.records;
    for (const token of records.keys()) {
      tokens.push(stringify(token));
    }
    return `R3Injector[${tokens.join(", ")}]`;
  }
  assertNotDestroyed() {
    if (this._destroyed) {
      throw new RuntimeError(205, ngDevMode && "Injector has already been destroyed.");
    }
  }
  /**
   * Process a `SingleProvider` and add it.
   */
  processProvider(provider) {
    provider = resolveForwardRef(provider);
    let token = isTypeProvider(provider) ? provider : resolveForwardRef(provider && provider.provide);
    const record = providerToRecord(provider);
    if (ngDevMode) {
      runInInjectorProfilerContext(this, token, () => {
        if (isValueProvider(provider)) {
          emitInstanceCreatedByInjectorEvent(provider.useValue);
        }
        emitProviderConfiguredEvent(provider);
      });
    }
    if (!isTypeProvider(provider) && provider.multi === true) {
      let multiRecord = this.records.get(token);
      if (multiRecord) {
        if (ngDevMode && multiRecord.multi === void 0) {
          throwMixedMultiProviderError();
        }
      } else {
        multiRecord = makeRecord(void 0, NOT_YET, true);
        multiRecord.factory = () => injectArgs(multiRecord.multi);
        this.records.set(token, multiRecord);
      }
      token = provider;
      multiRecord.multi.push(provider);
    } else {
      const existing = this.records.get(token);
      if (ngDevMode && existing && existing.multi !== void 0) {
        throwMixedMultiProviderError();
      }
    }
    this.records.set(token, record);
  }
  hydrate(token, record) {
    if (ngDevMode && record.value === CIRCULAR) {
      throwCyclicDependencyError(stringify(token));
    } else if (record.value === NOT_YET) {
      record.value = CIRCULAR;
      if (ngDevMode) {
        runInInjectorProfilerContext(this, token, () => {
          record.value = record.factory();
          emitInstanceCreatedByInjectorEvent(record.value);
        });
      } else {
        record.value = record.factory();
      }
    }
    if (typeof record.value === "object" && record.value && hasOnDestroy(record.value)) {
      this._ngOnDestroyHooks.add(record.value);
    }
    return record.value;
  }
  injectableDefInScope(def) {
    if (!def.providedIn) {
      return false;
    }
    const providedIn = resolveForwardRef(def.providedIn);
    if (typeof providedIn === "string") {
      return providedIn === "any" || this.scopes.has(providedIn);
    } else {
      return this.injectorDefTypes.has(providedIn);
    }
  }
  removeOnDestroy(callback) {
    const destroyCBIdx = this._onDestroyHooks.indexOf(callback);
    if (destroyCBIdx !== -1) {
      this._onDestroyHooks.splice(destroyCBIdx, 1);
    }
  }
};
function injectableDefOrInjectorDefFactory(token) {
  const injectableDef = getInjectableDef(token);
  const factory = injectableDef !== null ? injectableDef.factory : getFactoryDef(token);
  if (factory !== null) {
    return factory;
  }
  if (token instanceof InjectionToken) {
    throw new RuntimeError(204, ngDevMode && `Token ${stringify(token)} is missing a \u0275prov definition.`);
  }
  if (token instanceof Function) {
    return getUndecoratedInjectableFactory(token);
  }
  throw new RuntimeError(204, ngDevMode && "unreachable");
}
function getUndecoratedInjectableFactory(token) {
  const paramLength = token.length;
  if (paramLength > 0) {
    const args = newArray(paramLength, "?");
    throw new RuntimeError(204, ngDevMode && `Can't resolve all parameters for ${stringify(token)}: (${args.join(", ")}).`);
  }
  const inheritedInjectableDef = getInheritedInjectableDef(token);
  if (inheritedInjectableDef !== null) {
    return () => inheritedInjectableDef.factory(token);
  } else {
    return () => new token();
  }
}
function providerToRecord(provider) {
  if (isValueProvider(provider)) {
    return makeRecord(void 0, provider.useValue);
  } else {
    const factory = providerToFactory(provider);
    return makeRecord(factory, NOT_YET);
  }
}
function providerToFactory(provider, ngModuleType, providers) {
  let factory = void 0;
  if (ngDevMode && isEnvironmentProviders(provider)) {
    throwInvalidProviderError(void 0, providers, provider);
  }
  if (isTypeProvider(provider)) {
    const unwrappedProvider = resolveForwardRef(provider);
    return getFactoryDef(unwrappedProvider) || injectableDefOrInjectorDefFactory(unwrappedProvider);
  } else {
    if (isValueProvider(provider)) {
      factory = () => resolveForwardRef(provider.useValue);
    } else if (isFactoryProvider(provider)) {
      factory = () => provider.useFactory(...injectArgs(provider.deps || []));
    } else if (isExistingProvider(provider)) {
      factory = () => \u0275\u0275inject(resolveForwardRef(provider.useExisting));
    } else {
      const classRef = resolveForwardRef(provider && (provider.useClass || provider.provide));
      if (ngDevMode && !classRef) {
        throwInvalidProviderError(ngModuleType, providers, provider);
      }
      if (hasDeps(provider)) {
        factory = () => new classRef(...injectArgs(provider.deps));
      } else {
        return getFactoryDef(classRef) || injectableDefOrInjectorDefFactory(classRef);
      }
    }
  }
  return factory;
}
function makeRecord(factory, value, multi = false) {
  return {
    factory,
    value,
    multi: multi ? [] : void 0
  };
}
function hasDeps(value) {
  return !!value.deps;
}
function hasOnDestroy(value) {
  return value !== null && typeof value === "object" && typeof value.ngOnDestroy === "function";
}
function couldBeInjectableType(value) {
  return typeof value === "function" || typeof value === "object" && value instanceof InjectionToken;
}
function forEachSingleProvider(providers, fn) {
  for (const provider of providers) {
    if (Array.isArray(provider)) {
      forEachSingleProvider(provider, fn);
    } else if (provider && isEnvironmentProviders(provider)) {
      forEachSingleProvider(provider.\u0275providers, fn);
    } else {
      fn(provider);
    }
  }
}
var APP_ID = /* @__PURE__ */ new InjectionToken("AppId", {
  providedIn: "root",
  factory: () => DEFAULT_APP_ID
});
var DEFAULT_APP_ID = "ng";
var PLATFORM_INITIALIZER = /* @__PURE__ */ new InjectionToken("Platform Initializer");
var PLATFORM_ID = /* @__PURE__ */ new InjectionToken("Platform ID", {
  providedIn: "platform",
  factory: () => "unknown"
  // set a default platform name, when none set explicitly
});
var ANIMATION_MODULE_TYPE = /* @__PURE__ */ new InjectionToken("AnimationModuleType");
var CSP_NONCE = /* @__PURE__ */ new InjectionToken("CSP nonce", {
  providedIn: "root",
  factory: () => {
    return getDocument().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null;
  }
});
var REFERENCE_NODE_HOST = "h";
var REFERENCE_NODE_BODY = "b";
var _retrieveHydrationInfoImpl = (rNode, injector, isRootView2) => null;
function retrieveHydrationInfo(rNode, injector, isRootView2 = false) {
  return _retrieveHydrationInfoImpl(rNode, injector, isRootView2);
}
var ComponentRef$1 = class {
};
var ComponentFactory$1 = class {
};
function noComponentFactoryError(component) {
  const error = Error(`No component factory found for ${stringify(component)}.`);
  error[ERROR_COMPONENT] = component;
  return error;
}
var ERROR_COMPONENT = "ngComponent";
var _NullComponentFactoryResolver = class {
  resolveComponentFactory(component) {
    throw noComponentFactoryError(component);
  }
};
var ComponentFactoryResolver$1 = /* @__PURE__ */ (() => {
  class ComponentFactoryResolver$12 {
    static {
      this.NULL = /* @__PURE__ */ new _NullComponentFactoryResolver();
    }
  }
  return ComponentFactoryResolver$12;
})();
function injectElementRef() {
  return createElementRef(getCurrentTNode(), getLView());
}
function createElementRef(tNode, lView) {
  return new ElementRef(getNativeByTNode(tNode, lView));
}
var ElementRef = /* @__PURE__ */ (() => {
  class ElementRef2 {
    constructor(nativeElement) {
      this.nativeElement = nativeElement;
    }
    static {
      this.__NG_ELEMENT_ID__ = injectElementRef;
    }
  }
  return ElementRef2;
})();
function unwrapElementRef(value) {
  return value instanceof ElementRef ? value.nativeElement : value;
}
var RendererFactory2 = class {
};
var Renderer2 = /* @__PURE__ */ (() => {
  class Renderer22 {
    constructor() {
      this.destroyNode = null;
    }
    static {
      this.__NG_ELEMENT_ID__ = () => injectRenderer2();
    }
  }
  return Renderer22;
})();
function injectRenderer2() {
  const lView = getLView();
  const tNode = getCurrentTNode();
  const nodeAtIndex = getComponentLViewByIndex(tNode.index, lView);
  return (isLView(nodeAtIndex) ? nodeAtIndex : lView)[RENDERER];
}
var Sanitizer = /* @__PURE__ */ (() => {
  class Sanitizer2 {
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: Sanitizer2,
        providedIn: "root",
        factory: () => null
      });
    }
  }
  return Sanitizer2;
})();
var Version = class {
  constructor(full) {
    this.full = full;
    this.major = full.split(".")[0];
    this.minor = full.split(".")[1];
    this.patch = full.split(".").slice(2).join(".");
  }
};
var VERSION = /* @__PURE__ */ new Version("16.2.12");
var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
function createInjector(defType, parent = null, additionalProviders = null, name) {
  const injector = createInjectorWithoutInjectorInstances(defType, parent, additionalProviders, name);
  injector.resolveInjectorInitializers();
  return injector;
}
function createInjectorWithoutInjectorInstances(defType, parent = null, additionalProviders = null, name, scopes = /* @__PURE__ */ new Set()) {
  const providers = [additionalProviders || EMPTY_ARRAY, importProvidersFrom(defType)];
  name = name || (typeof defType === "object" ? void 0 : stringify(defType));
  return new R3Injector(providers, parent || getNullInjector(), name || null, scopes);
}
var Injector = /* @__PURE__ */ (() => {
  class Injector2 {
    static {
      this.THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
    }
    static {
      this.NULL = /* @__PURE__ */ new NullInjector();
    }
    static create(options, parent) {
      if (Array.isArray(options)) {
        return createInjector({
          name: ""
        }, parent, options, "");
      } else {
        const name = options.name ?? "";
        return createInjector({
          name
        }, options.parent, options.providers, name);
      }
    }
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: Injector2,
        providedIn: "any",
        factory: () => \u0275\u0275inject(INJECTOR)
      });
    }
    static {
      this.__NG_ELEMENT_ID__ = -1;
    }
  }
  return Injector2;
})();
var ERROR_ORIGINAL_ERROR = "ngOriginalError";
function getOriginalError(error) {
  return error[ERROR_ORIGINAL_ERROR];
}
var ErrorHandler = class {
  constructor() {
    this._console = console;
  }
  handleError(error) {
    const originalError = this._findOriginalError(error);
    this._console.error("ERROR", error);
    if (originalError) {
      this._console.error("ORIGINAL ERROR", originalError);
    }
  }
  /** @internal */
  _findOriginalError(error) {
    let e = error && getOriginalError(error);
    while (e && getOriginalError(e)) {
      e = getOriginalError(e);
    }
    return e || null;
  }
};
var EventEmitter_ = class extends Subject {
  constructor(isAsync = false) {
    super();
    this.__isAsync = isAsync;
  }
  emit(value) {
    super.next(value);
  }
  subscribe(observerOrNext, error, complete) {
    let nextFn = observerOrNext;
    let errorFn = error || (() => null);
    let completeFn = complete;
    if (observerOrNext && typeof observerOrNext === "object") {
      const observer = observerOrNext;
      nextFn = observer.next?.bind(observer);
      errorFn = observer.error?.bind(observer);
      completeFn = observer.complete?.bind(observer);
    }
    if (this.__isAsync) {
      errorFn = _wrapInTimeout(errorFn);
      if (nextFn) {
        nextFn = _wrapInTimeout(nextFn);
      }
      if (completeFn) {
        completeFn = _wrapInTimeout(completeFn);
      }
    }
    const sink = super.subscribe({
      next: nextFn,
      error: errorFn,
      complete: completeFn
    });
    if (observerOrNext instanceof Subscription) {
      observerOrNext.add(sink);
    }
    return sink;
  }
};
function _wrapInTimeout(fn) {
  return (value) => {
    setTimeout(fn, void 0, value);
  };
}
var EventEmitter = EventEmitter_;
function noop2(...args) {
}
function getNativeRequestAnimationFrame() {
  const isBrowser = typeof _global["requestAnimationFrame"] === "function";
  let nativeRequestAnimationFrame = _global[isBrowser ? "requestAnimationFrame" : "setTimeout"];
  let nativeCancelAnimationFrame = _global[isBrowser ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone !== "undefined" && nativeRequestAnimationFrame && nativeCancelAnimationFrame) {
    const unpatchedRequestAnimationFrame = nativeRequestAnimationFrame[Zone.__symbol__("OriginalDelegate")];
    if (unpatchedRequestAnimationFrame) {
      nativeRequestAnimationFrame = unpatchedRequestAnimationFrame;
    }
    const unpatchedCancelAnimationFrame = nativeCancelAnimationFrame[Zone.__symbol__("OriginalDelegate")];
    if (unpatchedCancelAnimationFrame) {
      nativeCancelAnimationFrame = unpatchedCancelAnimationFrame;
    }
  }
  return {
    nativeRequestAnimationFrame,
    nativeCancelAnimationFrame
  };
}
var AsyncStackTaggingZoneSpec = class {
  constructor(namePrefix, consoleAsyncStackTaggingImpl = console) {
    this.name = "asyncStackTagging for " + namePrefix;
    this.createTask = consoleAsyncStackTaggingImpl?.createTask ?? (() => null);
  }
  onScheduleTask(delegate, _current, target, task) {
    task.consoleTask = this.createTask(`Zone - ${task.source || task.type}`);
    return delegate.scheduleTask(target, task);
  }
  onInvokeTask(delegate, _currentZone, targetZone, task, applyThis, applyArgs) {
    let ret;
    if (task.consoleTask) {
      ret = task.consoleTask.run(() => delegate.invokeTask(targetZone, task, applyThis, applyArgs));
    } else {
      ret = delegate.invokeTask(targetZone, task, applyThis, applyArgs);
    }
    return ret;
  }
};
var NgZone = class _NgZone {
  constructor({
    enableLongStackTrace = false,
    shouldCoalesceEventChangeDetection = false,
    shouldCoalesceRunChangeDetection = false
  }) {
    this.hasPendingMacrotasks = false;
    this.hasPendingMicrotasks = false;
    this.isStable = true;
    this.onUnstable = new EventEmitter(false);
    this.onMicrotaskEmpty = new EventEmitter(false);
    this.onStable = new EventEmitter(false);
    this.onError = new EventEmitter(false);
    if (typeof Zone == "undefined") {
      throw new RuntimeError(908, ngDevMode && `In this configuration Angular requires Zone.js`);
    }
    Zone.assertZonePatched();
    const self = this;
    self._nesting = 0;
    self._outer = self._inner = Zone.current;
    if (ngDevMode) {
      self._inner = self._inner.fork(new AsyncStackTaggingZoneSpec("Angular"));
    }
    if (Zone["TaskTrackingZoneSpec"]) {
      self._inner = self._inner.fork(new Zone["TaskTrackingZoneSpec"]());
    }
    if (enableLongStackTrace && Zone["longStackTraceZoneSpec"]) {
      self._inner = self._inner.fork(Zone["longStackTraceZoneSpec"]);
    }
    self.shouldCoalesceEventChangeDetection = !shouldCoalesceRunChangeDetection && shouldCoalesceEventChangeDetection;
    self.shouldCoalesceRunChangeDetection = shouldCoalesceRunChangeDetection;
    self.lastRequestAnimationFrameId = -1;
    self.nativeRequestAnimationFrame = getNativeRequestAnimationFrame().nativeRequestAnimationFrame;
    forkInnerZoneWithAngularBehavior(self);
  }
  /**
    This method checks whether the method call happens within an Angular Zone instance.
  */
  static isInAngularZone() {
    return typeof Zone !== "undefined" && Zone.current.get("isAngularZone") === true;
  }
  /**
    Assures that the method is called within the Angular Zone, otherwise throws an error.
  */
  static assertInAngularZone() {
    if (!_NgZone.isInAngularZone()) {
      throw new RuntimeError(909, ngDevMode && "Expected to be in Angular Zone, but it is not!");
    }
  }
  /**
    Assures that the method is called outside of the Angular Zone, otherwise throws an error.
  */
  static assertNotInAngularZone() {
    if (_NgZone.isInAngularZone()) {
      throw new RuntimeError(909, ngDevMode && "Expected to not be in Angular Zone, but it is!");
    }
  }
  /**
   * Executes the `fn` function synchronously within the Angular zone and returns value returned by
   * the function.
   *
   * Running functions via `run` allows you to reenter Angular zone from a task that was executed
   * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * within the Angular zone.
   *
   * If a synchronous error happens it will be rethrown and not reported via `onError`.
   */
  run(fn, applyThis, applyArgs) {
    return this._inner.run(fn, applyThis, applyArgs);
  }
  /**
   * Executes the `fn` function synchronously within the Angular zone as a task and returns value
   * returned by the function.
   *
   * Running functions via `run` allows you to reenter Angular zone from a task that was executed
   * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * within the Angular zone.
   *
   * If a synchronous error happens it will be rethrown and not reported via `onError`.
   */
  runTask(fn, applyThis, applyArgs, name) {
    const zone = this._inner;
    const task = zone.scheduleEventTask("NgZoneEvent: " + name, fn, EMPTY_PAYLOAD, noop2, noop2);
    try {
      return zone.runTask(task, applyThis, applyArgs);
    } finally {
      zone.cancelTask(task);
    }
  }
  /**
   * Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
   * rethrown.
   */
  runGuarded(fn, applyThis, applyArgs) {
    return this._inner.runGuarded(fn, applyThis, applyArgs);
  }
  /**
   * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
   * the function.
   *
   * Running functions via {@link #runOutsideAngular} allows you to escape Angular's zone and do
   * work that
   * doesn't trigger Angular change-detection or is subject to Angular's error handling.
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * outside of the Angular zone.
   *
   * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
   */
  runOutsideAngular(fn) {
    return this._outer.run(fn);
  }
};
var EMPTY_PAYLOAD = {};
function checkStable(zone) {
  if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) {
    try {
      zone._nesting++;
      zone.onMicrotaskEmpty.emit(null);
    } finally {
      zone._nesting--;
      if (!zone.hasPendingMicrotasks) {
        try {
          zone.runOutsideAngular(() => zone.onStable.emit(null));
        } finally {
          zone.isStable = true;
        }
      }
    }
  }
}
function delayChangeDetectionForEvents(zone) {
  if (zone.isCheckStableRunning || zone.lastRequestAnimationFrameId !== -1) {
    return;
  }
  zone.lastRequestAnimationFrameId = zone.nativeRequestAnimationFrame.call(_global, () => {
    if (!zone.fakeTopEventTask) {
      zone.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
        zone.lastRequestAnimationFrameId = -1;
        updateMicroTaskStatus(zone);
        zone.isCheckStableRunning = true;
        checkStable(zone);
        zone.isCheckStableRunning = false;
      }, void 0, () => {
      }, () => {
      });
    }
    zone.fakeTopEventTask.invoke();
  });
  updateMicroTaskStatus(zone);
}
function forkInnerZoneWithAngularBehavior(zone) {
  const delayChangeDetectionForEventsDelegate = () => {
    delayChangeDetectionForEvents(zone);
  };
  zone._inner = zone._inner.fork({
    name: "angular",
    properties: {
      "isAngularZone": true
    },
    onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
      if (shouldBeIgnoredByZone(applyArgs)) {
        return delegate.invokeTask(target, task, applyThis, applyArgs);
      }
      try {
        onEnter(zone);
        return delegate.invokeTask(target, task, applyThis, applyArgs);
      } finally {
        if (zone.shouldCoalesceEventChangeDetection && task.type === "eventTask" || zone.shouldCoalesceRunChangeDetection) {
          delayChangeDetectionForEventsDelegate();
        }
        onLeave(zone);
      }
    },
    onInvoke: (delegate, current, target, callback, applyThis, applyArgs, source) => {
      try {
        onEnter(zone);
        return delegate.invoke(target, callback, applyThis, applyArgs, source);
      } finally {
        if (zone.shouldCoalesceRunChangeDetection) {
          delayChangeDetectionForEventsDelegate();
        }
        onLeave(zone);
      }
    },
    onHasTask: (delegate, current, target, hasTaskState) => {
      delegate.hasTask(target, hasTaskState);
      if (current === target) {
        if (hasTaskState.change == "microTask") {
          zone._hasPendingMicrotasks = hasTaskState.microTask;
          updateMicroTaskStatus(zone);
          checkStable(zone);
        } else if (hasTaskState.change == "macroTask") {
          zone.hasPendingMacrotasks = hasTaskState.macroTask;
        }
      }
    },
    onHandleError: (delegate, current, target, error) => {
      delegate.handleError(target, error);
      zone.runOutsideAngular(() => zone.onError.emit(error));
      return false;
    }
  });
}
function updateMicroTaskStatus(zone) {
  if (zone._hasPendingMicrotasks || (zone.shouldCoalesceEventChangeDetection || zone.shouldCoalesceRunChangeDetection) && zone.lastRequestAnimationFrameId !== -1) {
    zone.hasPendingMicrotasks = true;
  } else {
    zone.hasPendingMicrotasks = false;
  }
}
function onEnter(zone) {
  zone._nesting++;
  if (zone.isStable) {
    zone.isStable = false;
    zone.onUnstable.emit(null);
  }
}
function onLeave(zone) {
  zone._nesting--;
  checkStable(zone);
}
var ZONE_IS_STABLE_OBSERVABLE = /* @__PURE__ */ new InjectionToken(ngDevMode ? "isStable Observable" : "", {
  providedIn: "root",
  // TODO(atscott): Replace this with a suitable default like `new
  // BehaviorSubject(true).asObservable`. Again, long term this won't exist on ApplicationRef at
  // all but until we can remove it, we need a default value zoneless.
  factory: isStableFactory
});
function isStableFactory() {
  const zone = inject(NgZone);
  let _stable = true;
  const isCurrentlyStable = new Observable((observer) => {
    _stable = zone.isStable && !zone.hasPendingMacrotasks && !zone.hasPendingMicrotasks;
    zone.runOutsideAngular(() => {
      observer.next(_stable);
      observer.complete();
    });
  });
  const isStable = new Observable((observer) => {
    let stableSub;
    zone.runOutsideAngular(() => {
      stableSub = zone.onStable.subscribe(() => {
        NgZone.assertNotInAngularZone();
        queueMicrotask(() => {
          if (!_stable && !zone.hasPendingMacrotasks && !zone.hasPendingMicrotasks) {
            _stable = true;
            observer.next(true);
          }
        });
      });
    });
    const unstableSub = zone.onUnstable.subscribe(() => {
      NgZone.assertInAngularZone();
      if (_stable) {
        _stable = false;
        zone.runOutsideAngular(() => {
          observer.next(false);
        });
      }
    });
    return () => {
      stableSub.unsubscribe();
      unstableSub.unsubscribe();
    };
  });
  return merge(isCurrentlyStable, isStable.pipe(share()));
}
function shouldBeIgnoredByZone(applyArgs) {
  if (!Array.isArray(applyArgs)) {
    return false;
  }
  if (applyArgs.length !== 1) {
    return false;
  }
  return applyArgs[0].data?.["__ignore_ng_zone__"] === true;
}
var INTERPOLATION_DELIMITER = `\uFFFD`;
function maybeUnwrapFn(value) {
  if (value instanceof Function) {
    return value();
  } else {
    return value;
  }
}
var AfterRenderEventManager = /* @__PURE__ */ (() => {
  class AfterRenderEventManager2 {
    constructor() {
      this.renderDepth = 0;
      this.handler = null;
    }
    /**
     * Mark the beginning of a render operation (i.e. CD cycle).
     * Throws if called while executing callbacks.
     */
    begin() {
      this.handler?.validateBegin();
      this.renderDepth++;
    }
    /**
     * Mark the end of a render operation. Callbacks will be
     * executed if there are no more pending operations.
     */
    end() {
      ngDevMode && assertGreaterThan(this.renderDepth, 0, "renderDepth must be greater than 0");
      this.renderDepth--;
      if (this.renderDepth === 0) {
        this.handler?.execute();
      }
    }
    ngOnDestroy() {
      this.handler?.destroy();
      this.handler = null;
    }
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: AfterRenderEventManager2,
        providedIn: "root",
        factory: () => new AfterRenderEventManager2()
      });
    }
  }
  return AfterRenderEventManager2;
})();
function markViewDirty(lView) {
  while (lView) {
    lView[FLAGS] |= 64;
    const parent = getLViewParent(lView);
    if (isRootView(lView) && !parent) {
      return lView;
    }
    lView = parent;
  }
  return null;
}
var IS_HYDRATION_DOM_REUSE_ENABLED = /* @__PURE__ */ new InjectionToken(typeof ngDevMode === "undefined" || !!ngDevMode ? "IS_HYDRATION_DOM_REUSE_ENABLED" : "");
var PRESERVE_HOST_CONTENT_DEFAULT = false;
var PRESERVE_HOST_CONTENT = /* @__PURE__ */ new InjectionToken(typeof ngDevMode === "undefined" || !!ngDevMode ? "PRESERVE_HOST_CONTENT" : "", {
  providedIn: "root",
  factory: () => PRESERVE_HOST_CONTENT_DEFAULT
});
function normalizeDebugBindingName(name) {
  name = camelCaseToDashCase(name.replace(/[$@]/g, "_"));
  return `ng-reflect-${name}`;
}
var CAMEL_CASE_REGEXP = /([A-Z])/g;
function camelCaseToDashCase(input) {
  return input.replace(CAMEL_CASE_REGEXP, (...m) => "-" + m[1].toLowerCase());
}
function normalizeDebugBindingValue(value) {
  try {
    return value != null ? value.toString().slice(0, 30) : value;
  } catch (e) {
    return "[ERROR] Exception while trying to serialize the value";
  }
}
var VALUE_STRING_LENGTH_LIMIT = 200;
function assertStandaloneComponentType(type) {
  assertComponentDef(type);
  const componentDef = getComponentDef(type);
  if (!componentDef.standalone) {
    throw new RuntimeError(907, `The ${stringifyForError(type)} component is not marked as standalone, but Angular expects to have a standalone component here. Please make sure the ${stringifyForError(type)} component has the \`standalone: true\` flag in the decorator.`);
  }
}
function assertComponentDef(type) {
  if (!getComponentDef(type)) {
    throw new RuntimeError(906, `The ${stringifyForError(type)} is not an Angular component, make sure it has the \`@Component\` decorator.`);
  }
}
function throwMultipleComponentError(tNode, first2, second) {
  throw new RuntimeError(-300, `Multiple components match node with tagname ${tNode.value}: ${stringifyForError(first2)} and ${stringifyForError(second)}`);
}
function throwErrorIfNoChangesMode(creationMode, oldValue, currValue, propName, lView) {
  const hostComponentDef = getDeclarationComponentDef(lView);
  const componentClassName = hostComponentDef?.type?.name;
  const field = propName ? ` for '${propName}'` : "";
  let msg = `ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value${field}: '${formatValue(oldValue)}'. Current value: '${formatValue(currValue)}'.${componentClassName ? ` Expression location: ${componentClassName} component` : ""}`;
  if (creationMode) {
    msg += ` It seems like the view has been created after its parent and its children have been dirty checked. Has it been created in a change detection hook?`;
  }
  throw new RuntimeError(-100, msg);
}
function formatValue(value) {
  let strValue = String(value);
  try {
    if (Array.isArray(value) || strValue === "[object Object]") {
      strValue = JSON.stringify(value);
    }
  } catch (error) {
  }
  return strValue.length > VALUE_STRING_LENGTH_LIMIT ? strValue.substring(0, VALUE_STRING_LENGTH_LIMIT) + "\u2026" : strValue;
}
function constructDetailsForInterpolation(lView, rootIndex, expressionIndex, meta, changedValue) {
  const [propName, prefix, ...chunks] = meta.split(INTERPOLATION_DELIMITER);
  let oldValue = prefix, newValue = prefix;
  for (let i = 0; i < chunks.length; i++) {
    const slotIdx = rootIndex + i;
    oldValue += `${lView[slotIdx]}${chunks[i]}`;
    newValue += `${slotIdx === expressionIndex ? changedValue : lView[slotIdx]}${chunks[i]}`;
  }
  return {
    propName,
    oldValue,
    newValue
  };
}
function getExpressionChangedErrorDetails(lView, bindingIndex, oldValue, newValue) {
  const tData = lView[TVIEW].data;
  const metadata = tData[bindingIndex];
  if (typeof metadata === "string") {
    if (metadata.indexOf(INTERPOLATION_DELIMITER) > -1) {
      return constructDetailsForInterpolation(lView, bindingIndex, bindingIndex, metadata, newValue);
    }
    return {
      propName: metadata,
      oldValue,
      newValue
    };
  }
  if (metadata === null) {
    let idx = bindingIndex - 1;
    while (typeof tData[idx] !== "string" && tData[idx + 1] === null) {
      idx--;
    }
    const meta = tData[idx];
    if (typeof meta === "string") {
      const matches = meta.match(new RegExp(INTERPOLATION_DELIMITER, "g"));
      if (matches && matches.length - 1 > bindingIndex - idx) {
        return constructDetailsForInterpolation(lView, idx, bindingIndex, meta, newValue);
      }
    }
  }
  return {
    propName: void 0,
    oldValue,
    newValue
  };
}
var currentConsumer = null;
function getReactiveLViewConsumer(lView, slot) {
  return lView[slot] ?? getOrCreateCurrentLViewConsumer();
}
function commitLViewConsumerIfHasProducers(lView, slot) {
  const consumer = getOrCreateCurrentLViewConsumer();
  if (!consumer.producerNode?.length) {
    return;
  }
  lView[slot] = currentConsumer;
  consumer.lView = lView;
  currentConsumer = createLViewConsumer();
}
var REACTIVE_LVIEW_CONSUMER_NODE = __spreadProps(__spreadValues({}, REACTIVE_NODE), {
  consumerIsAlwaysLive: true,
  consumerMarkedDirty: (node) => {
    (typeof ngDevMode === "undefined" || ngDevMode) && assertDefined(node.lView, "Updating a signal during template or host binding execution is not allowed.");
    markViewDirty(node.lView);
  },
  lView: null
});
function createLViewConsumer() {
  return Object.create(REACTIVE_LVIEW_CONSUMER_NODE);
}
function getOrCreateCurrentLViewConsumer() {
  currentConsumer ??= createLViewConsumer();
  return currentConsumer;
}
var NO_CHANGE = typeof ngDevMode === "undefined" || ngDevMode ? {
  __brand__: "NO_CHANGE"
} : {};
function \u0275\u0275advance(delta) {
  ngDevMode && assertGreaterThan(delta, 0, "Can only advance forward");
  selectIndexInternal(getTView(), getLView(), getSelectedIndex() + delta, !!ngDevMode && isInCheckNoChangesMode());
}
function selectIndexInternal(tView, lView, index, checkNoChangesMode) {
  ngDevMode && assertIndexInDeclRange(lView, index);
  if (!checkNoChangesMode) {
    const hooksInitPhaseCompleted = (lView[FLAGS] & 3) === 3;
    if (hooksInitPhaseCompleted) {
      const preOrderCheckHooks = tView.preOrderCheckHooks;
      if (preOrderCheckHooks !== null) {
        executeCheckHooks(lView, preOrderCheckHooks, index);
      }
    } else {
      const preOrderHooks = tView.preOrderHooks;
      if (preOrderHooks !== null) {
        executeInitAndCheckHooks(lView, preOrderHooks, 0, index);
      }
    }
  }
  setSelectedIndex(index);
}
function \u0275\u0275directiveInject(token, flags = InjectFlags.Default) {
  const lView = getLView();
  if (lView === null) {
    ngDevMode && assertInjectImplementationNotEqual(\u0275\u0275directiveInject);
    return \u0275\u0275inject(token, flags);
  }
  const tNode = getCurrentTNode();
  const value = getOrCreateInjectable(tNode, lView, resolveForwardRef(token), flags);
  ngDevMode && emitInjectEvent(token, value, flags);
  return value;
}
function \u0275\u0275invalidFactory() {
  const msg = ngDevMode ? `This constructor was not compatible with Dependency Injection.` : "invalid";
  throw new Error(msg);
}
function processHostBindingOpCodes(tView, lView) {
  const hostBindingOpCodes = tView.hostBindingOpCodes;
  if (hostBindingOpCodes === null)
    return;
  const consumer = getReactiveLViewConsumer(lView, REACTIVE_HOST_BINDING_CONSUMER);
  try {
    for (let i = 0; i < hostBindingOpCodes.length; i++) {
      const opCode = hostBindingOpCodes[i];
      if (opCode < 0) {
        setSelectedIndex(~opCode);
      } else {
        const directiveIdx = opCode;
        const bindingRootIndx = hostBindingOpCodes[++i];
        const hostBindingFn = hostBindingOpCodes[++i];
        setBindingRootForHostBindings(bindingRootIndx, directiveIdx);
        consumer.dirty = false;
        const prevConsumer = consumerBeforeComputation(consumer);
        try {
          const context2 = lView[directiveIdx];
          hostBindingFn(2, context2);
        } finally {
          consumerAfterComputation(consumer, prevConsumer);
        }
      }
    }
  } finally {
    if (lView[REACTIVE_HOST_BINDING_CONSUMER] === null) {
      commitLViewConsumerIfHasProducers(lView, REACTIVE_HOST_BINDING_CONSUMER);
    }
    setSelectedIndex(-1);
  }
}
function createLView(parentLView, tView, context2, flags, host, tHostNode, environment, renderer, injector, embeddedViewInjector, hydrationInfo) {
  const lView = tView.blueprint.slice();
  lView[HOST] = host;
  lView[FLAGS] = flags | 4 | 128 | 8;
  if (embeddedViewInjector !== null || parentLView && parentLView[FLAGS] & 2048) {
    lView[FLAGS] |= 2048;
  }
  resetPreOrderHookFlags(lView);
  ngDevMode && tView.declTNode && parentLView && assertTNodeForLView(tView.declTNode, parentLView);
  lView[PARENT] = lView[DECLARATION_VIEW] = parentLView;
  lView[CONTEXT] = context2;
  lView[ENVIRONMENT] = environment || parentLView && parentLView[ENVIRONMENT];
  ngDevMode && assertDefined(lView[ENVIRONMENT], "LViewEnvironment is required");
  lView[RENDERER] = renderer || parentLView && parentLView[RENDERER];
  ngDevMode && assertDefined(lView[RENDERER], "Renderer is required");
  lView[INJECTOR$1] = injector || parentLView && parentLView[INJECTOR$1] || null;
  lView[T_HOST] = tHostNode;
  lView[ID] = getUniqueLViewId();
  lView[HYDRATION] = hydrationInfo;
  lView[EMBEDDED_VIEW_INJECTOR] = embeddedViewInjector;
  ngDevMode && assertEqual(tView.type == 2 ? parentLView !== null : true, true, "Embedded views must have parentLView");
  lView[DECLARATION_COMPONENT_VIEW] = tView.type == 2 ? parentLView[DECLARATION_COMPONENT_VIEW] : lView;
  return lView;
}
function getOrCreateTNode(tView, index, type, name, attrs) {
  ngDevMode && index !== 0 && // 0 are bogus nodes and they are OK. See `createContainerRef` in
  // `view_engine_compatibility` for additional context.
  assertGreaterThanOrEqual(index, HEADER_OFFSET, "TNodes can't be in the LView header.");
  ngDevMode && assertPureTNodeType(type);
  let tNode = tView.data[index];
  if (tNode === null) {
    tNode = createTNodeAtIndex(tView, index, type, name, attrs);
    if (isInI18nBlock()) {
      tNode.flags |= 32;
    }
  } else if (tNode.type & 64) {
    tNode.type = type;
    tNode.value = name;
    tNode.attrs = attrs;
    const parent = getCurrentParentTNode();
    tNode.injectorIndex = parent === null ? -1 : parent.injectorIndex;
    ngDevMode && assertTNodeForTView(tNode, tView);
    ngDevMode && assertEqual(index, tNode.index, "Expecting same index");
  }
  setCurrentTNode(tNode, true);
  return tNode;
}
function createTNodeAtIndex(tView, index, type, name, attrs) {
  const currentTNode = getCurrentTNodePlaceholderOk();
  const isParent = isCurrentTNodeParent();
  const parent = isParent ? currentTNode : currentTNode && currentTNode.parent;
  const tNode = tView.data[index] = createTNode(tView, parent, type, index, name, attrs);
  if (tView.firstChild === null) {
    tView.firstChild = tNode;
  }
  if (currentTNode !== null) {
    if (isParent) {
      if (currentTNode.child == null && tNode.parent !== null) {
        currentTNode.child = tNode;
      }
    } else {
      if (currentTNode.next === null) {
        currentTNode.next = tNode;
        tNode.prev = currentTNode;
      }
    }
  }
  return tNode;
}
function allocExpando(tView, lView, numSlotsToAlloc, initialValue) {
  if (numSlotsToAlloc === 0)
    return -1;
  if (ngDevMode) {
    assertFirstCreatePass(tView);
    assertSame(tView, lView[TVIEW], "`LView` must be associated with `TView`!");
    assertEqual(tView.data.length, lView.length, "Expecting LView to be same size as TView");
    assertEqual(tView.data.length, tView.blueprint.length, "Expecting Blueprint to be same size as TView");
    assertFirstUpdatePass(tView);
  }
  const allocIdx = lView.length;
  for (let i = 0; i < numSlotsToAlloc; i++) {
    lView.push(initialValue);
    tView.blueprint.push(initialValue);
    tView.data.push(null);
  }
  return allocIdx;
}
function executeTemplate(tView, lView, templateFn, rf, context2) {
  const consumer = getReactiveLViewConsumer(lView, REACTIVE_TEMPLATE_CONSUMER);
  const prevSelectedIndex = getSelectedIndex();
  const isUpdatePhase = rf & 2;
  try {
    setSelectedIndex(-1);
    if (isUpdatePhase && lView.length > HEADER_OFFSET) {
      selectIndexInternal(tView, lView, HEADER_OFFSET, !!ngDevMode && isInCheckNoChangesMode());
    }
    const preHookType = isUpdatePhase ? 2 : 0;
    profiler(preHookType, context2);
    const effectiveConsumer = isUpdatePhase ? consumer : null;
    const prevConsumer = consumerBeforeComputation(effectiveConsumer);
    try {
      if (effectiveConsumer !== null) {
        effectiveConsumer.dirty = false;
      }
      templateFn(rf, context2);
    } finally {
      consumerAfterComputation(effectiveConsumer, prevConsumer);
    }
  } finally {
    if (isUpdatePhase && lView[REACTIVE_TEMPLATE_CONSUMER] === null) {
      commitLViewConsumerIfHasProducers(lView, REACTIVE_TEMPLATE_CONSUMER);
    }
    setSelectedIndex(prevSelectedIndex);
    const postHookType = isUpdatePhase ? 3 : 1;
    profiler(postHookType, context2);
  }
}
function executeContentQueries(tView, tNode, lView) {
  if (isContentQueryHost(tNode)) {
    const prevConsumer = setActiveConsumer(null);
    try {
      const start = tNode.directiveStart;
      const end = tNode.directiveEnd;
      for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
        const def = tView.data[directiveIndex];
        if (def.contentQueries) {
          def.contentQueries(1, lView[directiveIndex], directiveIndex);
        }
      }
    } finally {
      setActiveConsumer(prevConsumer);
    }
  }
}
function createDirectivesInstances(tView, lView, tNode) {
  if (!getBindingsEnabled())
    return;
  instantiateAllDirectives(tView, lView, tNode, getNativeByTNode(tNode, lView));
  if ((tNode.flags & 64) === 64) {
    invokeDirectivesHostBindings(tView, lView, tNode);
  }
}
function saveResolvedLocalsInData(viewData, tNode, localRefExtractor = getNativeByTNode) {
  const localNames = tNode.localNames;
  if (localNames !== null) {
    let localIndex = tNode.index + 1;
    for (let i = 0; i < localNames.length; i += 2) {
      const index = localNames[i + 1];
      const value = index === -1 ? localRefExtractor(tNode, viewData) : viewData[index];
      viewData[localIndex++] = value;
    }
  }
}
function getOrCreateComponentTView(def) {
  const tView = def.tView;
  if (tView === null || tView.incompleteFirstPass) {
    const declTNode = null;
    return def.tView = createTView(1, declTNode, def.template, def.decls, def.vars, def.directiveDefs, def.pipeDefs, def.viewQuery, def.schemas, def.consts, def.id);
  }
  return tView;
}
function createTView(type, declTNode, templateFn, decls, vars, directives, pipes, viewQuery, schemas, constsOrFactory, ssrId) {
  ngDevMode && ngDevMode.tView++;
  const bindingStartIndex = HEADER_OFFSET + decls;
  const initialViewLength = bindingStartIndex + vars;
  const blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
  const consts = typeof constsOrFactory === "function" ? constsOrFactory() : constsOrFactory;
  const tView = blueprint[TVIEW] = {
    type,
    blueprint,
    template: templateFn,
    queries: null,
    viewQuery,
    declTNode,
    data: blueprint.slice().fill(null, bindingStartIndex),
    bindingStartIndex,
    expandoStartIndex: initialViewLength,
    hostBindingOpCodes: null,
    firstCreatePass: true,
    firstUpdatePass: true,
    staticViewQueries: false,
    staticContentQueries: false,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof directives === "function" ? directives() : directives,
    pipeRegistry: typeof pipes === "function" ? pipes() : pipes,
    firstChild: null,
    schemas,
    consts,
    incompleteFirstPass: false,
    ssrId
  };
  if (ngDevMode) {
    Object.seal(tView);
  }
  return tView;
}
function createViewBlueprint(bindingStartIndex, initialViewLength) {
  const blueprint = [];
  for (let i = 0; i < initialViewLength; i++) {
    blueprint.push(i < bindingStartIndex ? null : NO_CHANGE);
  }
  return blueprint;
}
function locateHostElement(renderer, elementOrSelector, encapsulation, injector) {
  const preserveHostContent = injector.get(PRESERVE_HOST_CONTENT, PRESERVE_HOST_CONTENT_DEFAULT);
  const preserveContent = preserveHostContent || encapsulation === ViewEncapsulation$1.ShadowDom;
  const rootElement = renderer.selectRootElement(elementOrSelector, preserveContent);
  applyRootElementTransform(rootElement);
  return rootElement;
}
function applyRootElementTransform(rootElement) {
  _applyRootElementTransformImpl(rootElement);
}
var _applyRootElementTransformImpl = (rootElement) => null;
function storeCleanupWithContext(tView, lView, context2, cleanupFn) {
  const lCleanup = getOrCreateLViewCleanup(lView);
  ngDevMode && assertDefined(context2, "Cleanup context is mandatory when registering framework-level destroy hooks");
  lCleanup.push(context2);
  if (tView.firstCreatePass) {
    getOrCreateTViewCleanup(tView).push(cleanupFn, lCleanup.length - 1);
  } else {
    if (ngDevMode) {
      Object.freeze(getOrCreateTViewCleanup(tView));
    }
  }
}
function createTNode(tView, tParent, type, index, value, attrs) {
  ngDevMode && index !== 0 && // 0 are bogus nodes and they are OK. See `createContainerRef` in
  // `view_engine_compatibility` for additional context.
  assertGreaterThanOrEqual(index, HEADER_OFFSET, "TNodes can't be in the LView header.");
  ngDevMode && assertNotSame(attrs, void 0, "'undefined' is not valid value for 'attrs'");
  ngDevMode && ngDevMode.tNode++;
  ngDevMode && tParent && assertTNodeForTView(tParent, tView);
  let injectorIndex = tParent ? tParent.injectorIndex : -1;
  let flags = 0;
  if (isInSkipHydrationBlock$1()) {
    flags |= 128;
  }
  const tNode = {
    type,
    index,
    insertBeforeIndex: null,
    injectorIndex,
    directiveStart: -1,
    directiveEnd: -1,
    directiveStylingLast: -1,
    componentOffset: -1,
    propertyBindings: null,
    flags,
    providerIndexes: 0,
    value,
    attrs,
    mergedAttrs: null,
    localNames: null,
    initialInputs: void 0,
    inputs: null,
    outputs: null,
    tView: null,
    next: null,
    prev: null,
    projectionNext: null,
    child: null,
    parent: tParent,
    projection: null,
    styles: null,
    stylesWithoutHost: null,
    residualStyles: void 0,
    classes: null,
    classesWithoutHost: null,
    residualClasses: void 0,
    classBindings: 0,
    styleBindings: 0
  };
  if (ngDevMode) {
    Object.seal(tNode);
  }
  return tNode;
}
function generatePropertyAliases(aliasMap, directiveIndex, propertyAliases, hostDirectiveAliasMap) {
  for (let publicName in aliasMap) {
    if (aliasMap.hasOwnProperty(publicName)) {
      propertyAliases = propertyAliases === null ? {} : propertyAliases;
      const internalName = aliasMap[publicName];
      if (hostDirectiveAliasMap === null) {
        addPropertyAlias(propertyAliases, directiveIndex, publicName, internalName);
      } else if (hostDirectiveAliasMap.hasOwnProperty(publicName)) {
        addPropertyAlias(propertyAliases, directiveIndex, hostDirectiveAliasMap[publicName], internalName);
      }
    }
  }
  return propertyAliases;
}
function addPropertyAlias(propertyAliases, directiveIndex, publicName, internalName) {
  if (propertyAliases.hasOwnProperty(publicName)) {
    propertyAliases[publicName].push(directiveIndex, internalName);
  } else {
    propertyAliases[publicName] = [directiveIndex, internalName];
  }
}
function initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefinitionMap) {
  ngDevMode && assertFirstCreatePass(tView);
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const tViewData = tView.data;
  const tNodeAttrs = tNode.attrs;
  const inputsFromAttrs = [];
  let inputsStore = null;
  let outputsStore = null;
  for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
    const directiveDef = tViewData[directiveIndex];
    const aliasData = hostDirectiveDefinitionMap ? hostDirectiveDefinitionMap.get(directiveDef) : null;
    const aliasedInputs = aliasData ? aliasData.inputs : null;
    const aliasedOutputs = aliasData ? aliasData.outputs : null;
    inputsStore = generatePropertyAliases(directiveDef.inputs, directiveIndex, inputsStore, aliasedInputs);
    outputsStore = generatePropertyAliases(directiveDef.outputs, directiveIndex, outputsStore, aliasedOutputs);
    const initialInputs = inputsStore !== null && tNodeAttrs !== null && !isInlineTemplate(tNode) ? generateInitialInputs(inputsStore, directiveIndex, tNodeAttrs) : null;
    inputsFromAttrs.push(initialInputs);
  }
  if (inputsStore !== null) {
    if (inputsStore.hasOwnProperty("class")) {
      tNode.flags |= 8;
    }
    if (inputsStore.hasOwnProperty("style")) {
      tNode.flags |= 16;
    }
  }
  tNode.initialInputs = inputsFromAttrs;
  tNode.inputs = inputsStore;
  tNode.outputs = outputsStore;
}
function mapPropName(name) {
  if (name === "class")
    return "className";
  if (name === "for")
    return "htmlFor";
  if (name === "formaction")
    return "formAction";
  if (name === "innerHtml")
    return "innerHTML";
  if (name === "readonly")
    return "readOnly";
  if (name === "tabindex")
    return "tabIndex";
  return name;
}
function elementPropertyInternal(tView, tNode, lView, propName, value, renderer, sanitizer, nativeOnly) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  const element = getNativeByTNode(tNode, lView);
  let inputData = tNode.inputs;
  let dataValue;
  if (!nativeOnly && inputData != null && (dataValue = inputData[propName])) {
    setInputsForProperty(tView, lView, dataValue, propName, value);
    if (isComponentHost(tNode))
      markDirtyIfOnPush(lView, tNode.index);
    if (ngDevMode) {
      setNgReflectProperties(lView, element, tNode.type, dataValue, value);
    }
  } else if (tNode.type & 3) {
    propName = mapPropName(propName);
    if (ngDevMode) {
      validateAgainstEventProperties(propName);
      if (!isPropertyValid(element, propName, tNode.value, tView.schemas)) {
        handleUnknownPropertyError(propName, tNode.value, tNode.type, lView);
      }
      ngDevMode.rendererSetProperty++;
    }
    value = sanitizer != null ? sanitizer(value, tNode.value || "", propName) : value;
    renderer.setProperty(element, propName, value);
  } else if (tNode.type & 12) {
    if (ngDevMode && !matchingSchemas(tView.schemas, tNode.value)) {
      handleUnknownPropertyError(propName, tNode.value, tNode.type, lView);
    }
  }
}
function markDirtyIfOnPush(lView, viewIndex) {
  ngDevMode && assertLView(lView);
  const childComponentLView = getComponentLViewByIndex(viewIndex, lView);
  if (!(childComponentLView[FLAGS] & 16)) {
    childComponentLView[FLAGS] |= 64;
  }
}
function setNgReflectProperty(lView, element, type, attrName, value) {
  const renderer = lView[RENDERER];
  attrName = normalizeDebugBindingName(attrName);
  const debugValue = normalizeDebugBindingValue(value);
  if (type & 3) {
    if (value == null) {
      renderer.removeAttribute(element, attrName);
    } else {
      renderer.setAttribute(element, attrName, debugValue);
    }
  } else {
    const textContent = escapeCommentText(`bindings=${JSON.stringify({
      [attrName]: debugValue
    }, null, 2)}`);
    renderer.setValue(element, textContent);
  }
}
function setNgReflectProperties(lView, element, type, dataValue, value) {
  if (type & (3 | 4)) {
    for (let i = 0; i < dataValue.length; i += 2) {
      setNgReflectProperty(lView, element, type, dataValue[i + 1], value);
    }
  }
}
function resolveDirectives(tView, lView, tNode, localRefs) {
  ngDevMode && assertFirstCreatePass(tView);
  if (getBindingsEnabled()) {
    const exportsMap = localRefs === null ? null : {
      "": -1
    };
    const matchResult = findDirectiveDefMatches(tView, tNode);
    let directiveDefs;
    let hostDirectiveDefs;
    if (matchResult === null) {
      directiveDefs = hostDirectiveDefs = null;
    } else {
      [directiveDefs, hostDirectiveDefs] = matchResult;
    }
    if (directiveDefs !== null) {
      initializeDirectives(tView, lView, tNode, directiveDefs, exportsMap, hostDirectiveDefs);
    }
    if (exportsMap)
      cacheMatchingLocalNames(tNode, localRefs, exportsMap);
  }
  tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, tNode.attrs);
}
function initializeDirectives(tView, lView, tNode, directives, exportsMap, hostDirectiveDefs) {
  ngDevMode && assertFirstCreatePass(tView);
  for (let i = 0; i < directives.length; i++) {
    diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, directives[i].type);
  }
  initTNodeFlags(tNode, tView.data.length, directives.length);
  for (let i = 0; i < directives.length; i++) {
    const def = directives[i];
    if (def.providersResolver)
      def.providersResolver(def);
  }
  let preOrderHooksFound = false;
  let preOrderCheckHooksFound = false;
  let directiveIdx = allocExpando(tView, lView, directives.length, null);
  ngDevMode && assertSame(directiveIdx, tNode.directiveStart, "TNode.directiveStart should point to just allocated space");
  for (let i = 0; i < directives.length; i++) {
    const def = directives[i];
    tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
    configureViewWithDirective(tView, tNode, lView, directiveIdx, def);
    saveNameToExportMap(directiveIdx, def, exportsMap);
    if (def.contentQueries !== null)
      tNode.flags |= 4;
    if (def.hostBindings !== null || def.hostAttrs !== null || def.hostVars !== 0)
      tNode.flags |= 64;
    const lifeCycleHooks = def.type.prototype;
    if (!preOrderHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngOnInit || lifeCycleHooks.ngDoCheck)) {
      (tView.preOrderHooks ??= []).push(tNode.index);
      preOrderHooksFound = true;
    }
    if (!preOrderCheckHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngDoCheck)) {
      (tView.preOrderCheckHooks ??= []).push(tNode.index);
      preOrderCheckHooksFound = true;
    }
    directiveIdx++;
  }
  initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefs);
}
function registerHostBindingOpCodes(tView, tNode, directiveIdx, directiveVarsIdx, def) {
  ngDevMode && assertFirstCreatePass(tView);
  const hostBindings = def.hostBindings;
  if (hostBindings) {
    let hostBindingOpCodes = tView.hostBindingOpCodes;
    if (hostBindingOpCodes === null) {
      hostBindingOpCodes = tView.hostBindingOpCodes = [];
    }
    const elementIndx = ~tNode.index;
    if (lastSelectedElementIdx(hostBindingOpCodes) != elementIndx) {
      hostBindingOpCodes.push(elementIndx);
    }
    hostBindingOpCodes.push(directiveIdx, directiveVarsIdx, hostBindings);
  }
}
function lastSelectedElementIdx(hostBindingOpCodes) {
  let i = hostBindingOpCodes.length;
  while (i > 0) {
    const value = hostBindingOpCodes[--i];
    if (typeof value === "number" && value < 0) {
      return value;
    }
  }
  return 0;
}
function instantiateAllDirectives(tView, lView, tNode, native) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  if (isComponentHost(tNode)) {
    ngDevMode && assertTNodeType(
      tNode,
      3
      /* TNodeType.AnyRNode */
    );
    addComponentLogic(lView, tNode, tView.data[start + tNode.componentOffset]);
  }
  if (!tView.firstCreatePass) {
    getOrCreateNodeInjectorForNode(tNode, lView);
  }
  attachPatchData(native, lView);
  const initialInputs = tNode.initialInputs;
  for (let i = start; i < end; i++) {
    const def = tView.data[i];
    const directive = getNodeInjectable(lView, tView, i, tNode);
    attachPatchData(directive, lView);
    if (initialInputs !== null) {
      setInputsFromAttrs(lView, i - start, directive, def, tNode, initialInputs);
    }
    if (isComponentDef(def)) {
      const componentView = getComponentLViewByIndex(tNode.index, lView);
      componentView[CONTEXT] = getNodeInjectable(lView, tView, i, tNode);
    }
  }
}
function invokeDirectivesHostBindings(tView, lView, tNode) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const elementIndex = tNode.index;
  const currentDirectiveIndex = getCurrentDirectiveIndex();
  try {
    setSelectedIndex(elementIndex);
    for (let dirIndex = start; dirIndex < end; dirIndex++) {
      const def = tView.data[dirIndex];
      const directive = lView[dirIndex];
      setCurrentDirectiveIndex(dirIndex);
      if (def.hostBindings !== null || def.hostVars !== 0 || def.hostAttrs !== null) {
        invokeHostBindingsInCreationMode(def, directive);
      }
    }
  } finally {
    setSelectedIndex(-1);
    setCurrentDirectiveIndex(currentDirectiveIndex);
  }
}
function invokeHostBindingsInCreationMode(def, directive) {
  if (def.hostBindings !== null) {
    def.hostBindings(1, directive);
  }
}
function findDirectiveDefMatches(tView, tNode) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && assertTNodeType(
    tNode,
    3 | 12
    /* TNodeType.AnyContainer */
  );
  const registry = tView.directiveRegistry;
  let matches = null;
  let hostDirectiveDefs = null;
  if (registry) {
    for (let i = 0; i < registry.length; i++) {
      const def = registry[i];
      if (isNodeMatchingSelectorList(
        tNode,
        def.selectors,
        /* isProjectionMode */
        false
      )) {
        matches || (matches = []);
        if (isComponentDef(def)) {
          if (ngDevMode) {
            assertTNodeType(tNode, 2, `"${tNode.value}" tags cannot be used as component hosts. Please use a different tag to activate the ${stringify(def.type)} component.`);
            if (isComponentHost(tNode)) {
              throwMultipleComponentError(tNode, matches.find(isComponentDef).type, def.type);
            }
          }
          if (def.findHostDirectiveDefs !== null) {
            const hostDirectiveMatches = [];
            hostDirectiveDefs = hostDirectiveDefs || /* @__PURE__ */ new Map();
            def.findHostDirectiveDefs(def, hostDirectiveMatches, hostDirectiveDefs);
            matches.unshift(...hostDirectiveMatches, def);
            const componentOffset = hostDirectiveMatches.length;
            markAsComponentHost(tView, tNode, componentOffset);
          } else {
            matches.unshift(def);
            markAsComponentHost(tView, tNode, 0);
          }
        } else {
          hostDirectiveDefs = hostDirectiveDefs || /* @__PURE__ */ new Map();
          def.findHostDirectiveDefs?.(def, matches, hostDirectiveDefs);
          matches.push(def);
        }
      }
    }
  }
  return matches === null ? null : [matches, hostDirectiveDefs];
}
function markAsComponentHost(tView, hostTNode, componentOffset) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && assertGreaterThan(componentOffset, -1, "componentOffset must be great than -1");
  hostTNode.componentOffset = componentOffset;
  (tView.components ??= []).push(hostTNode.index);
}
function cacheMatchingLocalNames(tNode, localRefs, exportsMap) {
  if (localRefs) {
    const localNames = tNode.localNames = [];
    for (let i = 0; i < localRefs.length; i += 2) {
      const index = exportsMap[localRefs[i + 1]];
      if (index == null)
        throw new RuntimeError(-301, ngDevMode && `Export of name '${localRefs[i + 1]}' not found!`);
      localNames.push(localRefs[i], index);
    }
  }
}
function saveNameToExportMap(directiveIdx, def, exportsMap) {
  if (exportsMap) {
    if (def.exportAs) {
      for (let i = 0; i < def.exportAs.length; i++) {
        exportsMap[def.exportAs[i]] = directiveIdx;
      }
    }
    if (isComponentDef(def))
      exportsMap[""] = directiveIdx;
  }
}
function initTNodeFlags(tNode, index, numberOfDirectives) {
  ngDevMode && assertNotEqual(numberOfDirectives, tNode.directiveEnd - tNode.directiveStart, "Reached the max number of directives");
  tNode.flags |= 1;
  tNode.directiveStart = index;
  tNode.directiveEnd = index + numberOfDirectives;
  tNode.providerIndexes = index;
}
function configureViewWithDirective(tView, tNode, lView, directiveIndex, def) {
  ngDevMode && assertGreaterThanOrEqual(directiveIndex, HEADER_OFFSET, "Must be in Expando section");
  tView.data[directiveIndex] = def;
  const directiveFactory = def.factory || (def.factory = getFactoryDef(def.type, true));
  const nodeInjectorFactory = new NodeInjectorFactory(directiveFactory, isComponentDef(def), \u0275\u0275directiveInject);
  tView.blueprint[directiveIndex] = nodeInjectorFactory;
  lView[directiveIndex] = nodeInjectorFactory;
  registerHostBindingOpCodes(tView, tNode, directiveIndex, allocExpando(tView, lView, def.hostVars, NO_CHANGE), def);
}
function addComponentLogic(lView, hostTNode, def) {
  const native = getNativeByTNode(hostTNode, lView);
  const tView = getOrCreateComponentTView(def);
  const rendererFactory = lView[ENVIRONMENT].rendererFactory;
  let lViewFlags = 16;
  if (def.signals) {
    lViewFlags = 4096;
  } else if (def.onPush) {
    lViewFlags = 64;
  }
  const componentView = addToViewTree(lView, createLView(lView, tView, null, lViewFlags, native, hostTNode, null, rendererFactory.createRenderer(native, def), null, null, null));
  lView[hostTNode.index] = componentView;
}
function elementAttributeInternal(tNode, lView, name, value, sanitizer, namespace) {
  if (ngDevMode) {
    assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
    validateAgainstEventAttributes(name);
    assertTNodeType(tNode, 2, `Attempted to set attribute \`${name}\` on a container node. Host bindings are not valid on ng-container or ng-template.`);
  }
  const element = getNativeByTNode(tNode, lView);
  setElementAttribute(lView[RENDERER], element, namespace, tNode.value, name, value, sanitizer);
}
function setElementAttribute(renderer, element, namespace, tagName, name, value, sanitizer) {
  if (value == null) {
    ngDevMode && ngDevMode.rendererRemoveAttribute++;
    renderer.removeAttribute(element, name, namespace);
  } else {
    ngDevMode && ngDevMode.rendererSetAttribute++;
    const strValue = sanitizer == null ? renderStringify(value) : sanitizer(value, tagName || "", name);
    renderer.setAttribute(element, name, strValue, namespace);
  }
}
function setInputsFromAttrs(lView, directiveIndex, instance, def, tNode, initialInputData) {
  const initialInputs = initialInputData[directiveIndex];
  if (initialInputs !== null) {
    for (let i = 0; i < initialInputs.length; ) {
      const publicName = initialInputs[i++];
      const privateName = initialInputs[i++];
      const value = initialInputs[i++];
      writeToDirectiveInput(def, instance, publicName, privateName, value);
      if (ngDevMode) {
        const nativeElement = getNativeByTNode(tNode, lView);
        setNgReflectProperty(lView, nativeElement, tNode.type, privateName, value);
      }
    }
  }
}
function writeToDirectiveInput(def, instance, publicName, privateName, value) {
  const prevConsumer = setActiveConsumer(null);
  try {
    const inputTransforms = def.inputTransforms;
    if (inputTransforms !== null && inputTransforms.hasOwnProperty(privateName)) {
      value = inputTransforms[privateName].call(instance, value);
    }
    if (def.setInput !== null) {
      def.setInput(instance, value, publicName, privateName);
    } else {
      instance[privateName] = value;
    }
  } finally {
    setActiveConsumer(prevConsumer);
  }
}
function generateInitialInputs(inputs, directiveIndex, attrs) {
  let inputsToStore = null;
  let i = 0;
  while (i < attrs.length) {
    const attrName = attrs[i];
    if (attrName === 0) {
      i += 4;
      continue;
    } else if (attrName === 5) {
      i += 2;
      continue;
    }
    if (typeof attrName === "number")
      break;
    if (inputs.hasOwnProperty(attrName)) {
      if (inputsToStore === null)
        inputsToStore = [];
      const inputConfig = inputs[attrName];
      for (let j = 0; j < inputConfig.length; j += 2) {
        if (inputConfig[j] === directiveIndex) {
          inputsToStore.push(attrName, inputConfig[j + 1], attrs[i + 1]);
          break;
        }
      }
    }
    i += 2;
  }
  return inputsToStore;
}
function createLContainer(hostNative, currentView, native, tNode) {
  ngDevMode && assertLView(currentView);
  const lContainer = [
    hostNative,
    true,
    false,
    currentView,
    null,
    0,
    tNode,
    native,
    null,
    null,
    null
    // dehydrated views
  ];
  ngDevMode && assertEqual(lContainer.length, CONTAINER_HEADER_OFFSET, "Should allocate correct number of slots for LContainer header.");
  return lContainer;
}
function refreshContentQueries(tView, lView) {
  const contentQueries = tView.contentQueries;
  if (contentQueries !== null) {
    for (let i = 0; i < contentQueries.length; i += 2) {
      const queryStartIdx = contentQueries[i];
      const directiveDefIdx = contentQueries[i + 1];
      if (directiveDefIdx !== -1) {
        const directiveDef = tView.data[directiveDefIdx];
        ngDevMode && assertDefined(directiveDef, "DirectiveDef not found.");
        ngDevMode && assertDefined(directiveDef.contentQueries, "contentQueries function should be defined");
        setCurrentQueryIndex(queryStartIdx);
        directiveDef.contentQueries(2, lView[directiveDefIdx], directiveDefIdx);
      }
    }
  }
}
function addToViewTree(lView, lViewOrLContainer) {
  if (lView[CHILD_HEAD]) {
    lView[CHILD_TAIL][NEXT] = lViewOrLContainer;
  } else {
    lView[CHILD_HEAD] = lViewOrLContainer;
  }
  lView[CHILD_TAIL] = lViewOrLContainer;
  return lViewOrLContainer;
}
function executeViewQueryFn(flags, viewQueryFn, component) {
  ngDevMode && assertDefined(viewQueryFn, "View queries function to execute must be defined.");
  setCurrentQueryIndex(0);
  const prevConsumer = setActiveConsumer(null);
  try {
    viewQueryFn(flags, component);
  } finally {
    setActiveConsumer(prevConsumer);
  }
}
function storePropertyBindingMetadata(tData, tNode, propertyName, bindingIndex, ...interpolationParts) {
  if (tData[bindingIndex] === null) {
    if (tNode.inputs == null || !tNode.inputs[propertyName]) {
      const propBindingIdxs = tNode.propertyBindings || (tNode.propertyBindings = []);
      propBindingIdxs.push(bindingIndex);
      let bindingMetadata = propertyName;
      if (interpolationParts.length > 0) {
        bindingMetadata += INTERPOLATION_DELIMITER + interpolationParts.join(INTERPOLATION_DELIMITER);
      }
      tData[bindingIndex] = bindingMetadata;
    }
  }
}
function getOrCreateLViewCleanup(view) {
  return view[CLEANUP] || (view[CLEANUP] = []);
}
function getOrCreateTViewCleanup(tView) {
  return tView.cleanup || (tView.cleanup = []);
}
function handleError(lView, error) {
  const injector = lView[INJECTOR$1];
  const errorHandler = injector ? injector.get(ErrorHandler, null) : null;
  errorHandler && errorHandler.handleError(error);
}
function setInputsForProperty(tView, lView, inputs, publicName, value) {
  for (let i = 0; i < inputs.length; ) {
    const index = inputs[i++];
    const privateName = inputs[i++];
    const instance = lView[index];
    ngDevMode && assertIndexInRange(lView, index);
    const def = tView.data[index];
    writeToDirectiveInput(def, instance, publicName, privateName, value);
  }
}
function textBindingInternal(lView, index, value) {
  ngDevMode && assertString(value, "Value should be a string");
  ngDevMode && assertNotSame(value, NO_CHANGE, "value should not be NO_CHANGE");
  ngDevMode && assertIndexInRange(lView, index);
  const element = getNativeByIndex(index, lView);
  ngDevMode && assertDefined(element, "native element should exist");
  updateTextNode(lView[RENDERER], element, value);
}
function renderComponent(hostLView, componentHostIdx) {
  ngDevMode && assertEqual(isCreationMode(hostLView), true, "Should be run in creation mode");
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  const componentTView = componentView[TVIEW];
  syncViewWithBlueprint(componentTView, componentView);
  const hostRNode = componentView[HOST];
  if (hostRNode !== null && componentView[HYDRATION] === null) {
    componentView[HYDRATION] = retrieveHydrationInfo(hostRNode, componentView[INJECTOR$1]);
  }
  renderView(componentTView, componentView, componentView[CONTEXT]);
}
function syncViewWithBlueprint(tView, lView) {
  for (let i = lView.length; i < tView.blueprint.length; i++) {
    lView.push(tView.blueprint[i]);
  }
}
function renderView(tView, lView, context2) {
  ngDevMode && assertEqual(isCreationMode(lView), true, "Should be run in creation mode");
  enterView(lView);
  try {
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(1, viewQuery, context2);
    }
    const templateFn = tView.template;
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, 1, context2);
    }
    if (tView.firstCreatePass) {
      tView.firstCreatePass = false;
    }
    if (tView.staticContentQueries) {
      refreshContentQueries(tView, lView);
    }
    if (tView.staticViewQueries) {
      executeViewQueryFn(2, tView.viewQuery, context2);
    }
    const components = tView.components;
    if (components !== null) {
      renderChildComponents(lView, components);
    }
  } catch (error) {
    if (tView.firstCreatePass) {
      tView.incompleteFirstPass = true;
      tView.firstCreatePass = false;
    }
    throw error;
  } finally {
    lView[FLAGS] &= ~4;
    leaveView();
  }
}
function renderChildComponents(hostLView, components) {
  for (let i = 0; i < components.length; i++) {
    renderComponent(hostLView, components[i]);
  }
}
var EffectManager = /* @__PURE__ */ (() => {
  class EffectManager2 {
    constructor() {
      this.all = /* @__PURE__ */ new Set();
      this.queue = /* @__PURE__ */ new Map();
    }
    create(effectFn, destroyRef, allowSignalWrites) {
      const zone = typeof Zone === "undefined" ? null : Zone.current;
      const w = watch(effectFn, (watch2) => {
        if (!this.all.has(watch2)) {
          return;
        }
        this.queue.set(watch2, zone);
      }, allowSignalWrites);
      this.all.add(w);
      w.notify();
      let unregisterOnDestroy;
      const destroy = () => {
        w.cleanup();
        unregisterOnDestroy?.();
        this.all.delete(w);
        this.queue.delete(w);
      };
      unregisterOnDestroy = destroyRef?.onDestroy(destroy);
      return {
        destroy
      };
    }
    flush() {
      if (this.queue.size === 0) {
        return;
      }
      for (const [watch2, zone] of this.queue) {
        this.queue.delete(watch2);
        if (zone) {
          zone.run(() => watch2.run());
        } else {
          watch2.run();
        }
      }
    }
    get isQueueEmpty() {
      return this.queue.size === 0;
    }
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: EffectManager2,
        providedIn: "root",
        factory: () => new EffectManager2()
      });
    }
  }
  return EffectManager2;
})();
function computeStaticStyling(tNode, attrs, writeToHost) {
  ngDevMode && assertFirstCreatePass(getTView(), "Expecting to be called in first template pass only");
  let styles = writeToHost ? tNode.styles : null;
  let classes = writeToHost ? tNode.classes : null;
  let mode = 0;
  if (attrs !== null) {
    for (let i = 0; i < attrs.length; i++) {
      const value = attrs[i];
      if (typeof value === "number") {
        mode = value;
      } else if (mode == 1) {
        classes = concatStringsWithSpace(classes, value);
      } else if (mode == 2) {
        const style = value;
        const styleValue = attrs[++i];
        styles = concatStringsWithSpace(styles, style + ": " + styleValue + ";");
      }
    }
  }
  writeToHost ? tNode.styles = styles : tNode.stylesWithoutHost = styles;
  writeToHost ? tNode.classes = classes : tNode.classesWithoutHost = classes;
}
function collectNativeNodes(tView, lView, tNode, result, isProjection = false) {
  while (tNode !== null) {
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 16 | 32
      /* TNodeType.Icu */
    );
    const lNode = lView[tNode.index];
    if (lNode !== null) {
      result.push(unwrapRNode(lNode));
    }
    if (isLContainer(lNode)) {
      collectNativeNodesInLContainer(lNode, result);
    }
    const tNodeType = tNode.type;
    if (tNodeType & 8) {
      collectNativeNodes(tView, lView, tNode.child, result);
    } else if (tNodeType & 32) {
      const nextRNode = icuContainerIterate(tNode, lView);
      let rNode;
      while (rNode = nextRNode()) {
        result.push(rNode);
      }
    } else if (tNodeType & 16) {
      const nodesInSlot = getProjectionNodes(lView, tNode);
      if (Array.isArray(nodesInSlot)) {
        result.push(...nodesInSlot);
      } else {
        const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
        ngDevMode && assertParentView(parentView);
        collectNativeNodes(parentView[TVIEW], parentView, nodesInSlot, result, true);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }
  return result;
}
function collectNativeNodesInLContainer(lContainer, result) {
  for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    const lViewInAContainer = lContainer[i];
    const lViewFirstChildTNode = lViewInAContainer[TVIEW].firstChild;
    if (lViewFirstChildTNode !== null) {
      collectNativeNodes(lViewInAContainer[TVIEW], lViewInAContainer, lViewFirstChildTNode, result);
    }
  }
  if (lContainer[NATIVE] !== lContainer[HOST]) {
    result.push(lContainer[NATIVE]);
  }
}
function detectChangesInternal(tView, lView, context2, notifyErrorHandler = true) {
  const environment = lView[ENVIRONMENT];
  const rendererFactory = environment.rendererFactory;
  const afterRenderEventManager = environment.afterRenderEventManager;
  const checkNoChangesMode = !!ngDevMode && isInCheckNoChangesMode();
  if (!checkNoChangesMode) {
    rendererFactory.begin?.();
    afterRenderEventManager?.begin();
  }
  try {
    refreshView(tView, lView, tView.template, context2);
  } catch (error) {
    if (notifyErrorHandler) {
      handleError(lView, error);
    }
    throw error;
  } finally {
    if (!checkNoChangesMode) {
      rendererFactory.end?.();
      environment.effectManager?.flush();
      afterRenderEventManager?.end();
    }
  }
}
function checkNoChangesInternal(tView, lView, context2, notifyErrorHandler = true) {
  setIsInCheckNoChangesMode(true);
  try {
    detectChangesInternal(tView, lView, context2, notifyErrorHandler);
  } finally {
    setIsInCheckNoChangesMode(false);
  }
}
function detectChanges(component) {
  const view = getComponentViewByInstance(component);
  detectChangesInternal(view[TVIEW], view, component);
}
function refreshView(tView, lView, templateFn, context2) {
  ngDevMode && assertEqual(isCreationMode(lView), false, "Should be run in update mode");
  const flags = lView[FLAGS];
  if ((flags & 256) === 256)
    return;
  const isInCheckNoChangesPass = ngDevMode && isInCheckNoChangesMode();
  !isInCheckNoChangesPass && lView[ENVIRONMENT].effectManager?.flush();
  enterView(lView);
  try {
    resetPreOrderHookFlags(lView);
    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, 2, context2);
    }
    const hooksInitPhaseCompleted = (flags & 3) === 3;
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const preOrderCheckHooks = tView.preOrderCheckHooks;
        if (preOrderCheckHooks !== null) {
          executeCheckHooks(lView, preOrderCheckHooks, null);
        }
      } else {
        const preOrderHooks = tView.preOrderHooks;
        if (preOrderHooks !== null) {
          executeInitAndCheckHooks(lView, preOrderHooks, 0, null);
        }
        incrementInitPhaseFlags(
          lView,
          0
          /* InitPhaseState.OnInitHooksToBeRun */
        );
      }
    }
    markTransplantedViewsForRefresh(lView);
    detectChangesInEmbeddedViews(
      lView,
      2
      /* ChangeDetectionMode.BugToForceRefreshAndIgnoreViewFlags */
    );
    if (tView.contentQueries !== null) {
      refreshContentQueries(tView, lView);
    }
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const contentCheckHooks = tView.contentCheckHooks;
        if (contentCheckHooks !== null) {
          executeCheckHooks(lView, contentCheckHooks);
        }
      } else {
        const contentHooks = tView.contentHooks;
        if (contentHooks !== null) {
          executeInitAndCheckHooks(
            lView,
            contentHooks,
            1
            /* InitPhaseState.AfterContentInitHooksToBeRun */
          );
        }
        incrementInitPhaseFlags(
          lView,
          1
          /* InitPhaseState.AfterContentInitHooksToBeRun */
        );
      }
    }
    processHostBindingOpCodes(tView, lView);
    const components = tView.components;
    if (components !== null) {
      detectChangesInChildComponents(
        lView,
        components,
        0
        /* ChangeDetectionMode.Global */
      );
    }
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(2, viewQuery, context2);
    }
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const viewCheckHooks = tView.viewCheckHooks;
        if (viewCheckHooks !== null) {
          executeCheckHooks(lView, viewCheckHooks);
        }
      } else {
        const viewHooks = tView.viewHooks;
        if (viewHooks !== null) {
          executeInitAndCheckHooks(
            lView,
            viewHooks,
            2
            /* InitPhaseState.AfterViewInitHooksToBeRun */
          );
        }
        incrementInitPhaseFlags(
          lView,
          2
          /* InitPhaseState.AfterViewInitHooksToBeRun */
        );
      }
    }
    if (tView.firstUpdatePass === true) {
      tView.firstUpdatePass = false;
    }
    if (!isInCheckNoChangesPass) {
      lView[FLAGS] &= ~(64 | 8);
    }
    clearViewRefreshFlag(lView);
  } finally {
    leaveView();
  }
}
function detectChangesInEmbeddedViews(lView, mode) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
      const embeddedLView = lContainer[i];
      detectChangesInView(embeddedLView, mode);
    }
  }
}
function markTransplantedViewsForRefresh(lView) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
    if (!lContainer[HAS_TRANSPLANTED_VIEWS])
      continue;
    const movedViews = lContainer[MOVED_VIEWS];
    ngDevMode && assertDefined(movedViews, "Transplanted View flags set but missing MOVED_VIEWS");
    for (let i = 0; i < movedViews.length; i++) {
      const movedLView = movedViews[i];
      const insertionLContainer = movedLView[PARENT];
      ngDevMode && assertLContainer(insertionLContainer);
      markViewForRefresh(movedLView);
    }
  }
}
function detectChangesInComponent(hostLView, componentHostIdx, mode) {
  ngDevMode && assertEqual(isCreationMode(hostLView), false, "Should be run in update mode");
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  detectChangesInView(componentView, mode);
}
function detectChangesInView(lView, mode) {
  if (!viewAttachedToChangeDetector(lView)) {
    return;
  }
  const tView = lView[TVIEW];
  const flags = lView[FLAGS];
  if (flags & (16 | 64) && mode === 0 || flags & 1024 || mode === 2) {
    refreshView(tView, lView, tView.template, lView[CONTEXT]);
  } else if (lView[DESCENDANT_VIEWS_TO_REFRESH] > 0) {
    detectChangesInEmbeddedViews(
      lView,
      1
      /* ChangeDetectionMode.Targeted */
    );
    const components = tView.components;
    if (components !== null) {
      detectChangesInChildComponents(
        lView,
        components,
        1
        /* ChangeDetectionMode.Targeted */
      );
    }
  }
}
function detectChangesInChildComponents(hostLView, components, mode) {
  for (let i = 0; i < components.length; i++) {
    detectChangesInComponent(hostLView, components[i], mode);
  }
}
var ViewRef$1 = class {
  get rootNodes() {
    const lView = this._lView;
    const tView = lView[TVIEW];
    return collectNativeNodes(tView, lView, tView.firstChild, []);
  }
  constructor(_lView, _cdRefInjectingView) {
    this._lView = _lView;
    this._cdRefInjectingView = _cdRefInjectingView;
    this._appRef = null;
    this._attachedToViewContainer = false;
  }
  get context() {
    return this._lView[CONTEXT];
  }
  set context(value) {
    this._lView[CONTEXT] = value;
  }
  get destroyed() {
    return (this._lView[FLAGS] & 256) === 256;
  }
  destroy() {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._attachedToViewContainer) {
      const parent = this._lView[PARENT];
      if (isLContainer(parent)) {
        const viewRefs = parent[VIEW_REFS];
        const index = viewRefs ? viewRefs.indexOf(this) : -1;
        if (index > -1) {
          ngDevMode && assertEqual(index, parent.indexOf(this._lView) - CONTAINER_HEADER_OFFSET, "An attached view should be in the same position within its container as its ViewRef in the VIEW_REFS array.");
          detachView(parent, index);
          removeFromArray(viewRefs, index);
        }
      }
      this._attachedToViewContainer = false;
    }
    destroyLView(this._lView[TVIEW], this._lView);
  }
  onDestroy(callback) {
    storeLViewOnDestroy(this._lView, callback);
  }
  /**
   * Marks a view and all of its ancestors dirty.
   *
   * This can be used to ensure an {@link ChangeDetectionStrategy#OnPush} component is
   * checked when it needs to be re-rendered but the two normal triggers haven't marked it
   * dirty (i.e. inputs haven't changed and events haven't fired in the view).
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   * @usageNotes
   * ### Example
   *
   * ```typescript
   * @Component({
   *   selector: 'app-root',
   *   template: `Number of ticks: {{numberOfTicks}}`
   *   changeDetection: ChangeDetectionStrategy.OnPush,
   * })
   * class AppComponent {
   *   numberOfTicks = 0;
   *
   *   constructor(private ref: ChangeDetectorRef) {
   *     setInterval(() => {
   *       this.numberOfTicks++;
   *       // the following is required, otherwise the view will not be updated
   *       this.ref.markForCheck();
   *     }, 1000);
   *   }
   * }
   * ```
   */
  markForCheck() {
    markViewDirty(this._cdRefInjectingView || this._lView);
  }
  /**
   * Detaches the view from the change detection tree.
   *
   * Detached views will not be checked during change detection runs until they are
   * re-attached, even if they are dirty. `detach` can be used in combination with
   * {@link ChangeDetectorRef#detectChanges} to implement local change
   * detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds. We can do that by detaching
   * the component's change detector and doing a local check every five seconds.
   *
   * ```typescript
   * class DataProvider {
   *   // in a real application the returned data will be different every time
   *   get data() {
   *     return [1,2,3,4,5];
   *   }
   * }
   *
   * @Component({
   *   selector: 'giant-list',
   *   template: `
   *     <li *ngFor="let d of dataProvider.data">Data {{d}}</li>
   *   `,
   * })
   * class GiantList {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {
   *     ref.detach();
   *     setInterval(() => {
   *       this.ref.detectChanges();
   *     }, 5000);
   *   }
   * }
   *
   * @Component({
   *   selector: 'app',
   *   providers: [DataProvider],
   *   template: `
   *     <giant-list><giant-list>
   *   `,
   * })
   * class App {
   * }
   * ```
   */
  detach() {
    this._lView[FLAGS] &= ~128;
  }
  /**
   * Re-attaches a view to the change detection tree.
   *
   * This can be used to re-attach views that were previously detached from the tree
   * using {@link ChangeDetectorRef#detach}. Views are attached to the tree by default.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example creates a component displaying `live` data. The component will detach
   * its change detector from the main change detector tree when the component's live property
   * is set to false.
   *
   * ```typescript
   * class DataProvider {
   *   data = 1;
   *
   *   constructor() {
   *     setInterval(() => {
   *       this.data = this.data * 2;
   *     }, 500);
   *   }
   * }
   *
   * @Component({
   *   selector: 'live-data',
   *   inputs: ['live'],
   *   template: 'Data: {{dataProvider.data}}'
   * })
   * class LiveData {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {}
   *
   *   set live(value) {
   *     if (value) {
   *       this.ref.reattach();
   *     } else {
   *       this.ref.detach();
   *     }
   *   }
   * }
   *
   * @Component({
   *   selector: 'app-root',
   *   providers: [DataProvider],
   *   template: `
   *     Live Update: <input type="checkbox" [(ngModel)]="live">
   *     <live-data [live]="live"><live-data>
   *   `,
   * })
   * class AppComponent {
   *   live = true;
   * }
   * ```
   */
  reattach() {
    this._lView[FLAGS] |= 128;
  }
  /**
   * Checks the view and its children.
   *
   * This can also be used in combination with {@link ChangeDetectorRef#detach} to implement
   * local change detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine, the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds.
   *
   * We can do that by detaching the component's change detector and doing a local change detection
   * check every five seconds.
   *
   * See {@link ChangeDetectorRef#detach} for more information.
   */
  detectChanges() {
    detectChangesInternal(this._lView[TVIEW], this._lView, this.context);
  }
  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * This is used in development mode to verify that running change detection doesn't
   * introduce other changes.
   */
  checkNoChanges() {
    if (ngDevMode) {
      checkNoChangesInternal(this._lView[TVIEW], this._lView, this.context);
    }
  }
  attachToViewContainerRef() {
    if (this._appRef) {
      throw new RuntimeError(902, ngDevMode && "This view is already attached directly to the ApplicationRef!");
    }
    this._attachedToViewContainer = true;
  }
  detachFromAppRef() {
    this._appRef = null;
    detachViewFromDOM(this._lView[TVIEW], this._lView);
  }
  attachToAppRef(appRef) {
    if (this._attachedToViewContainer) {
      throw new RuntimeError(902, ngDevMode && "This view is already attached to a ViewContainer!");
    }
    this._appRef = appRef;
  }
};
var RootViewRef = class extends ViewRef$1 {
  constructor(_view) {
    super(_view);
    this._view = _view;
  }
  detectChanges() {
    const lView = this._view;
    const tView = lView[TVIEW];
    const context2 = lView[CONTEXT];
    detectChangesInternal(tView, lView, context2, false);
  }
  checkNoChanges() {
    if (ngDevMode) {
      const lView = this._view;
      const tView = lView[TVIEW];
      const context2 = lView[CONTEXT];
      checkNoChangesInternal(tView, lView, context2, false);
    }
  }
  get context() {
    return null;
  }
};
var ComponentFactoryResolver = class extends ComponentFactoryResolver$1 {
  /**
   * @param ngModule The NgModuleRef to which all resolved factories are bound.
   */
  constructor(ngModule) {
    super();
    this.ngModule = ngModule;
  }
  resolveComponentFactory(component) {
    ngDevMode && assertComponentType(component);
    const componentDef = getComponentDef(component);
    return new ComponentFactory(componentDef, this.ngModule);
  }
};
function toRefArray(map2) {
  const array = [];
  for (let nonMinified in map2) {
    if (map2.hasOwnProperty(nonMinified)) {
      const minified = map2[nonMinified];
      array.push({
        propName: minified,
        templateName: nonMinified
      });
    }
  }
  return array;
}
function getNamespace(elementName) {
  const name = elementName.toLowerCase();
  return name === "svg" ? SVG_NAMESPACE : name === "math" ? MATH_ML_NAMESPACE : null;
}
var ChainedInjector = class {
  constructor(injector, parentInjector) {
    this.injector = injector;
    this.parentInjector = parentInjector;
  }
  get(token, notFoundValue, flags) {
    flags = convertToBitFlags(flags);
    const value = this.injector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, flags);
    if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
      return value;
    }
    return this.parentInjector.get(token, notFoundValue, flags);
  }
};
var ComponentFactory = class extends ComponentFactory$1 {
  get inputs() {
    const componentDef = this.componentDef;
    const inputTransforms = componentDef.inputTransforms;
    const refArray = toRefArray(componentDef.inputs);
    if (inputTransforms !== null) {
      for (const input of refArray) {
        if (inputTransforms.hasOwnProperty(input.propName)) {
          input.transform = inputTransforms[input.propName];
        }
      }
    }
    return refArray;
  }
  get outputs() {
    return toRefArray(this.componentDef.outputs);
  }
  /**
   * @param componentDef The component definition.
   * @param ngModule The NgModuleRef to which the factory is bound.
   */
  constructor(componentDef, ngModule) {
    super();
    this.componentDef = componentDef;
    this.ngModule = ngModule;
    this.componentType = componentDef.type;
    this.selector = stringifyCSSSelectorList(componentDef.selectors);
    this.ngContentSelectors = componentDef.ngContentSelectors ? componentDef.ngContentSelectors : [];
    this.isBoundToModule = !!ngModule;
  }
  create(injector, projectableNodes, rootSelectorOrNode, environmentInjector) {
    environmentInjector = environmentInjector || this.ngModule;
    let realEnvironmentInjector = environmentInjector instanceof EnvironmentInjector ? environmentInjector : environmentInjector?.injector;
    if (realEnvironmentInjector && this.componentDef.getStandaloneInjector !== null) {
      realEnvironmentInjector = this.componentDef.getStandaloneInjector(realEnvironmentInjector) || realEnvironmentInjector;
    }
    const rootViewInjector = realEnvironmentInjector ? new ChainedInjector(injector, realEnvironmentInjector) : injector;
    const rendererFactory = rootViewInjector.get(RendererFactory2, null);
    if (rendererFactory === null) {
      throw new RuntimeError(407, ngDevMode && "Angular was not able to inject a renderer (RendererFactory2). Likely this is due to a broken DI hierarchy. Make sure that any injector used to create this component has a correct parent.");
    }
    const sanitizer = rootViewInjector.get(Sanitizer, null);
    const effectManager = rootViewInjector.get(EffectManager, null);
    const afterRenderEventManager = rootViewInjector.get(AfterRenderEventManager, null);
    const environment = {
      rendererFactory,
      sanitizer,
      effectManager,
      afterRenderEventManager
    };
    const hostRenderer = rendererFactory.createRenderer(null, this.componentDef);
    const elementName = this.componentDef.selectors[0][0] || "div";
    const hostRNode = rootSelectorOrNode ? locateHostElement(hostRenderer, rootSelectorOrNode, this.componentDef.encapsulation, rootViewInjector) : createElementNode(hostRenderer, elementName, getNamespace(elementName));
    const signalFlags = 4096 | 512;
    const nonSignalFlags = this.componentDef.onPush ? 64 | 512 : 16 | 512;
    const rootFlags = this.componentDef.signals ? signalFlags : nonSignalFlags;
    let hydrationInfo = null;
    if (hostRNode !== null) {
      hydrationInfo = retrieveHydrationInfo(
        hostRNode,
        rootViewInjector,
        true
        /* isRootView */
      );
    }
    const rootTView = createTView(0, null, null, 1, 0, null, null, null, null, null, null);
    const rootLView = createLView(null, rootTView, null, rootFlags, null, null, environment, hostRenderer, rootViewInjector, null, hydrationInfo);
    enterView(rootLView);
    let component;
    let tElementNode;
    try {
      const rootComponentDef = this.componentDef;
      let rootDirectives;
      let hostDirectiveDefs = null;
      if (rootComponentDef.findHostDirectiveDefs) {
        rootDirectives = [];
        hostDirectiveDefs = /* @__PURE__ */ new Map();
        rootComponentDef.findHostDirectiveDefs(rootComponentDef, rootDirectives, hostDirectiveDefs);
        rootDirectives.push(rootComponentDef);
      } else {
        rootDirectives = [rootComponentDef];
      }
      const hostTNode = createRootComponentTNode(rootLView, hostRNode);
      const componentView = createRootComponentView(hostTNode, hostRNode, rootComponentDef, rootDirectives, rootLView, environment, hostRenderer);
      tElementNode = getTNode(rootTView, HEADER_OFFSET);
      if (hostRNode) {
        setRootNodeAttributes(hostRenderer, rootComponentDef, hostRNode, rootSelectorOrNode);
      }
      if (projectableNodes !== void 0) {
        projectNodes(tElementNode, this.ngContentSelectors, projectableNodes);
      }
      component = createRootComponent(componentView, rootComponentDef, rootDirectives, hostDirectiveDefs, rootLView, [LifecycleHooksFeature]);
      renderView(rootTView, rootLView, null);
    } finally {
      leaveView();
    }
    return new ComponentRef(this.componentType, component, createElementRef(tElementNode, rootLView), rootLView, tElementNode);
  }
};
var ComponentRef = class extends ComponentRef$1 {
  constructor(componentType, instance, location2, _rootLView, _tNode) {
    super();
    this.location = location2;
    this._rootLView = _rootLView;
    this._tNode = _tNode;
    this.previousInputValues = null;
    this.instance = instance;
    this.hostView = this.changeDetectorRef = new RootViewRef(_rootLView);
    this.componentType = componentType;
  }
  setInput(name, value) {
    const inputData = this._tNode.inputs;
    let dataValue;
    if (inputData !== null && (dataValue = inputData[name])) {
      this.previousInputValues ??= /* @__PURE__ */ new Map();
      if (this.previousInputValues.has(name) && Object.is(this.previousInputValues.get(name), value)) {
        return;
      }
      const lView = this._rootLView;
      setInputsForProperty(lView[TVIEW], lView, dataValue, name, value);
      this.previousInputValues.set(name, value);
      const childComponentLView = getComponentLViewByIndex(this._tNode.index, lView);
      markViewDirty(childComponentLView);
    } else {
      if (ngDevMode) {
        const cmpNameForError = stringifyForError(this.componentType);
        let message = `Can't set value of the '${name}' input on the '${cmpNameForError}' component. `;
        message += `Make sure that the '${name}' property is annotated with @Input() or a mapped @Input('${name}') exists.`;
        reportUnknownPropertyError(message);
      }
    }
  }
  get injector() {
    return new NodeInjector(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(callback) {
    this.hostView.onDestroy(callback);
  }
};
function createRootComponentTNode(lView, rNode) {
  const tView = lView[TVIEW];
  const index = HEADER_OFFSET;
  ngDevMode && assertIndexInRange(lView, index);
  lView[index] = rNode;
  return getOrCreateTNode(tView, index, 2, "#host", null);
}
function createRootComponentView(tNode, hostRNode, rootComponentDef, rootDirectives, rootView, environment, hostRenderer) {
  const tView = rootView[TVIEW];
  applyRootComponentStyling(rootDirectives, tNode, hostRNode, hostRenderer);
  let hydrationInfo = null;
  if (hostRNode !== null) {
    hydrationInfo = retrieveHydrationInfo(hostRNode, rootView[INJECTOR$1]);
  }
  const viewRenderer = environment.rendererFactory.createRenderer(hostRNode, rootComponentDef);
  let lViewFlags = 16;
  if (rootComponentDef.signals) {
    lViewFlags = 4096;
  } else if (rootComponentDef.onPush) {
    lViewFlags = 64;
  }
  const componentView = createLView(rootView, getOrCreateComponentTView(rootComponentDef), null, lViewFlags, rootView[tNode.index], tNode, environment, viewRenderer, null, null, hydrationInfo);
  if (tView.firstCreatePass) {
    markAsComponentHost(tView, tNode, rootDirectives.length - 1);
  }
  addToViewTree(rootView, componentView);
  return rootView[tNode.index] = componentView;
}
function applyRootComponentStyling(rootDirectives, tNode, rNode, hostRenderer) {
  for (const def of rootDirectives) {
    tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
  }
  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
    if (rNode !== null) {
      setupStaticAttributes(hostRenderer, rNode, tNode);
    }
  }
}
function createRootComponent(componentView, rootComponentDef, rootDirectives, hostDirectiveDefs, rootLView, hostFeatures) {
  const rootTNode = getCurrentTNode();
  ngDevMode && assertDefined(rootTNode, "tNode should have been already created");
  const tView = rootLView[TVIEW];
  const native = getNativeByTNode(rootTNode, rootLView);
  initializeDirectives(tView, rootLView, rootTNode, rootDirectives, null, hostDirectiveDefs);
  for (let i = 0; i < rootDirectives.length; i++) {
    const directiveIndex = rootTNode.directiveStart + i;
    const directiveInstance = getNodeInjectable(rootLView, tView, directiveIndex, rootTNode);
    attachPatchData(directiveInstance, rootLView);
  }
  invokeDirectivesHostBindings(tView, rootLView, rootTNode);
  if (native) {
    attachPatchData(native, rootLView);
  }
  ngDevMode && assertGreaterThan(rootTNode.componentOffset, -1, "componentOffset must be great than -1");
  const component = getNodeInjectable(rootLView, tView, rootTNode.directiveStart + rootTNode.componentOffset, rootTNode);
  componentView[CONTEXT] = rootLView[CONTEXT] = component;
  if (hostFeatures !== null) {
    for (const feature of hostFeatures) {
      feature(component, rootComponentDef);
    }
  }
  executeContentQueries(tView, rootTNode, componentView);
  return component;
}
function setRootNodeAttributes(hostRenderer, componentDef, hostRNode, rootSelectorOrNode) {
  if (rootSelectorOrNode) {
    setUpAttributes(hostRenderer, hostRNode, ["ng-version", VERSION.full]);
  } else {
    const {
      attrs,
      classes
    } = extractAttrsAndClassesFromSelector(componentDef.selectors[0]);
    if (attrs) {
      setUpAttributes(hostRenderer, hostRNode, attrs);
    }
    if (classes && classes.length > 0) {
      writeDirectClass(hostRenderer, hostRNode, classes.join(" "));
    }
  }
}
function projectNodes(tNode, ngContentSelectors, projectableNodes) {
  const projection = tNode.projection = [];
  for (let i = 0; i < ngContentSelectors.length; i++) {
    const nodesforSlot = projectableNodes[i];
    projection.push(nodesforSlot != null ? Array.from(nodesforSlot) : null);
  }
}
function LifecycleHooksFeature() {
  const tNode = getCurrentTNode();
  ngDevMode && assertDefined(tNode, "TNode is required");
  registerPostOrderHooks(getLView()[TVIEW], tNode);
}
function getSuperType(type) {
  return Object.getPrototypeOf(type.prototype).constructor;
}
function \u0275\u0275InheritDefinitionFeature(definition) {
  let superType = getSuperType(definition.type);
  let shouldInheritFields = true;
  const inheritanceChain = [definition];
  while (superType) {
    let superDef = void 0;
    if (isComponentDef(definition)) {
      superDef = superType.\u0275cmp || superType.\u0275dir;
    } else {
      if (superType.\u0275cmp) {
        throw new RuntimeError(903, ngDevMode && `Directives cannot inherit Components. Directive ${stringifyForError(definition.type)} is attempting to extend component ${stringifyForError(superType)}`);
      }
      superDef = superType.\u0275dir;
    }
    if (superDef) {
      if (shouldInheritFields) {
        inheritanceChain.push(superDef);
        const writeableDef = definition;
        writeableDef.inputs = maybeUnwrapEmpty(definition.inputs);
        writeableDef.inputTransforms = maybeUnwrapEmpty(definition.inputTransforms);
        writeableDef.declaredInputs = maybeUnwrapEmpty(definition.declaredInputs);
        writeableDef.outputs = maybeUnwrapEmpty(definition.outputs);
        const superHostBindings = superDef.hostBindings;
        superHostBindings && inheritHostBindings(definition, superHostBindings);
        const superViewQuery = superDef.viewQuery;
        const superContentQueries = superDef.contentQueries;
        superViewQuery && inheritViewQuery(definition, superViewQuery);
        superContentQueries && inheritContentQueries(definition, superContentQueries);
        fillProperties(definition.inputs, superDef.inputs);
        fillProperties(definition.declaredInputs, superDef.declaredInputs);
        fillProperties(definition.outputs, superDef.outputs);
        if (superDef.inputTransforms !== null) {
          if (writeableDef.inputTransforms === null) {
            writeableDef.inputTransforms = {};
          }
          fillProperties(writeableDef.inputTransforms, superDef.inputTransforms);
        }
        if (isComponentDef(superDef) && superDef.data.animation) {
          const defData = definition.data;
          defData.animation = (defData.animation || []).concat(superDef.data.animation);
        }
      }
      const features = superDef.features;
      if (features) {
        for (let i = 0; i < features.length; i++) {
          const feature = features[i];
          if (feature && feature.ngInherit) {
            feature(definition);
          }
          if (feature === \u0275\u0275InheritDefinitionFeature) {
            shouldInheritFields = false;
          }
        }
      }
    }
    superType = Object.getPrototypeOf(superType);
  }
  mergeHostAttrsAcrossInheritance(inheritanceChain);
}
function mergeHostAttrsAcrossInheritance(inheritanceChain) {
  let hostVars = 0;
  let hostAttrs = null;
  for (let i = inheritanceChain.length - 1; i >= 0; i--) {
    const def = inheritanceChain[i];
    def.hostVars = hostVars += def.hostVars;
    def.hostAttrs = mergeHostAttrs(def.hostAttrs, hostAttrs = mergeHostAttrs(hostAttrs, def.hostAttrs));
  }
}
function maybeUnwrapEmpty(value) {
  if (value === EMPTY_OBJ) {
    return {};
  } else if (value === EMPTY_ARRAY) {
    return [];
  } else {
    return value;
  }
}
function inheritViewQuery(definition, superViewQuery) {
  const prevViewQuery = definition.viewQuery;
  if (prevViewQuery) {
    definition.viewQuery = (rf, ctx) => {
      superViewQuery(rf, ctx);
      prevViewQuery(rf, ctx);
    };
  } else {
    definition.viewQuery = superViewQuery;
  }
}
function inheritContentQueries(definition, superContentQueries) {
  const prevContentQueries = definition.contentQueries;
  if (prevContentQueries) {
    definition.contentQueries = (rf, ctx, directiveIndex) => {
      superContentQueries(rf, ctx, directiveIndex);
      prevContentQueries(rf, ctx, directiveIndex);
    };
  } else {
    definition.contentQueries = superContentQueries;
  }
}
function inheritHostBindings(definition, superHostBindings) {
  const prevHostBindings = definition.hostBindings;
  if (prevHostBindings) {
    definition.hostBindings = (rf, ctx) => {
      superHostBindings(rf, ctx);
      prevHostBindings(rf, ctx);
    };
  } else {
    definition.hostBindings = superHostBindings;
  }
}
function \u0275\u0275InputTransformsFeature(definition) {
  const inputs = definition.inputConfig;
  const inputTransforms = {};
  for (const minifiedKey in inputs) {
    if (inputs.hasOwnProperty(minifiedKey)) {
      const value = inputs[minifiedKey];
      if (Array.isArray(value) && value[2]) {
        inputTransforms[minifiedKey] = value[2];
      }
    }
  }
  definition.inputTransforms = inputTransforms;
}
function isListLikeIterable(obj) {
  if (!isJsObject(obj))
    return false;
  return Array.isArray(obj) || !(obj instanceof Map) && // JS Map are iterables but return entries as [k, v]
  Symbol.iterator in obj;
}
function areIterablesEqual(a, b, comparator) {
  const iterator1 = a[Symbol.iterator]();
  const iterator2 = b[Symbol.iterator]();
  while (true) {
    const item1 = iterator1.next();
    const item2 = iterator2.next();
    if (item1.done && item2.done)
      return true;
    if (item1.done || item2.done)
      return false;
    if (!comparator(item1.value, item2.value))
      return false;
  }
}
function iterateListLike(obj, fn) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn(obj[i]);
    }
  } else {
    const iterator2 = obj[Symbol.iterator]();
    let item;
    while (!(item = iterator2.next()).done) {
      fn(item.value);
    }
  }
}
function isJsObject(o) {
  return o !== null && (typeof o === "function" || typeof o === "object");
}
function devModeEqual(a, b) {
  const isListLikeIterableA = isListLikeIterable(a);
  const isListLikeIterableB = isListLikeIterable(b);
  if (isListLikeIterableA && isListLikeIterableB) {
    return areIterablesEqual(a, b, devModeEqual);
  } else {
    const isAObject = a && (typeof a === "object" || typeof a === "function");
    const isBObject = b && (typeof b === "object" || typeof b === "function");
    if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
      return true;
    } else {
      return Object.is(a, b);
    }
  }
}
function updateBinding(lView, bindingIndex, value) {
  return lView[bindingIndex] = value;
}
function getBinding(lView, bindingIndex) {
  ngDevMode && assertIndexInRange(lView, bindingIndex);
  ngDevMode && assertNotSame(lView[bindingIndex], NO_CHANGE, "Stored value should never be NO_CHANGE.");
  return lView[bindingIndex];
}
function bindingUpdated(lView, bindingIndex, value) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  ngDevMode && assertLessThan(bindingIndex, lView.length, `Slot should have been initialized to NO_CHANGE`);
  const oldValue = lView[bindingIndex];
  if (Object.is(oldValue, value)) {
    return false;
  } else {
    if (ngDevMode && isInCheckNoChangesMode()) {
      const oldValueToCompare = oldValue !== NO_CHANGE ? oldValue : void 0;
      if (!devModeEqual(oldValueToCompare, value)) {
        const details = getExpressionChangedErrorDetails(lView, bindingIndex, oldValueToCompare, value);
        throwErrorIfNoChangesMode(oldValue === NO_CHANGE, details.oldValue, details.newValue, details.propName, lView);
      }
      return false;
    }
    lView[bindingIndex] = value;
    return true;
  }
}
function bindingUpdated2(lView, bindingIndex, exp1, exp2) {
  const different = bindingUpdated(lView, bindingIndex, exp1);
  return bindingUpdated(lView, bindingIndex + 1, exp2) || different;
}
function \u0275\u0275attribute(name, value, sanitizer, namespace) {
  const lView = getLView();
  const bindingIndex = nextBindingIndex();
  if (bindingUpdated(lView, bindingIndex, value)) {
    const tView = getTView();
    const tNode = getSelectedTNode();
    elementAttributeInternal(tNode, lView, name, value, sanitizer, namespace);
    ngDevMode && storePropertyBindingMetadata(tView.data, tNode, "attr." + name, bindingIndex);
  }
  return \u0275\u0275attribute;
}
function interpolation1(lView, prefix, v0, suffix) {
  const different = bindingUpdated(lView, nextBindingIndex(), v0);
  return different ? prefix + renderStringify(v0) + suffix : NO_CHANGE;
}
function interpolation2(lView, prefix, v0, i0, v1, suffix) {
  const bindingIndex = getBindingIndex();
  const different = bindingUpdated2(lView, bindingIndex, v0, v1);
  incrementBindingIndex(2);
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + suffix : NO_CHANGE;
}
var REF_EXTRACTOR_REGEXP = /* @__PURE__ */ new RegExp(`^(\\d+)*(${REFERENCE_NODE_BODY}|${REFERENCE_NODE_HOST})*(.*)`);
function templateFirstCreatePass(index, tView, lView, templateFn, decls, vars, tagName, attrsIndex, localRefsIndex) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;
  const tViewConsts = tView.consts;
  const tNode = getOrCreateTNode(tView, index, 4, tagName || null, getConstant(tViewConsts, attrsIndex));
  resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex));
  registerPostOrderHooks(tView, tNode);
  const embeddedTView = tNode.tView = createTView(
    2,
    tNode,
    templateFn,
    decls,
    vars,
    tView.directiveRegistry,
    tView.pipeRegistry,
    null,
    tView.schemas,
    tViewConsts,
    null
    /* ssrId */
  );
  if (tView.queries !== null) {
    tView.queries.template(tView, tNode);
    embeddedTView.queries = tView.queries.embeddedTView(tNode);
  }
  return tNode;
}
function \u0275\u0275template(index, templateFn, decls, vars, tagName, attrsIndex, localRefsIndex, localRefExtractor) {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;
  const tNode = tView.firstCreatePass ? templateFirstCreatePass(adjustedIndex, tView, lView, templateFn, decls, vars, tagName, attrsIndex, localRefsIndex) : tView.data[adjustedIndex];
  setCurrentTNode(tNode, false);
  const comment = _locateOrCreateContainerAnchor(tView, lView, tNode, index);
  if (wasLastNodeCreated()) {
    appendChild(tView, lView, comment, tNode);
  }
  attachPatchData(comment, lView);
  addToViewTree(lView, lView[adjustedIndex] = createLContainer(comment, lView, comment, tNode));
  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
  }
  if (localRefsIndex != null) {
    saveResolvedLocalsInData(lView, tNode, localRefExtractor);
  }
}
var _locateOrCreateContainerAnchor = createContainerAnchorImpl;
function createContainerAnchorImpl(tView, lView, tNode, index) {
  lastNodeWasCreated(true);
  return lView[RENDERER].createComment(ngDevMode ? "container" : "");
}
function store(tView, lView, index, value) {
  if (index >= tView.data.length) {
    tView.data[index] = null;
    tView.blueprint[index] = null;
  }
  lView[index] = value;
}
function \u0275\u0275reference(index) {
  const contextLView = getContextLView();
  return load(contextLView, HEADER_OFFSET + index);
}
function \u0275\u0275property(propName, value, sanitizer) {
  const lView = getLView();
  const bindingIndex = nextBindingIndex();
  if (bindingUpdated(lView, bindingIndex, value)) {
    const tView = getTView();
    const tNode = getSelectedTNode();
    elementPropertyInternal(tView, tNode, lView, propName, value, lView[RENDERER], sanitizer, false);
    ngDevMode && storePropertyBindingMetadata(tView.data, tNode, propName, bindingIndex);
  }
  return \u0275\u0275property;
}
function setDirectiveInputsWhichShadowsStyling(tView, tNode, lView, value, isClassBased) {
  const inputs = tNode.inputs;
  const property = isClassBased ? "class" : "style";
  setInputsForProperty(tView, lView, inputs[property], property, value);
}
function elementStartFirstCreatePass(index, tView, lView, name, attrsIndex, localRefsIndex) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;
  const tViewConsts = tView.consts;
  const attrs = getConstant(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, index, 2, name, attrs);
  resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex));
  if (tNode.attrs !== null) {
    computeStaticStyling(tNode, tNode.attrs, false);
  }
  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
  }
  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }
  return tNode;
}
function \u0275\u0275elementStart(index, name, attrsIndex, localRefsIndex) {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = HEADER_OFFSET + index;
  ngDevMode && assertEqual(getBindingIndex(), tView.bindingStartIndex, "elements should be created before any bindings");
  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  const renderer = lView[RENDERER];
  const tNode = tView.firstCreatePass ? elementStartFirstCreatePass(adjustedIndex, tView, lView, name, attrsIndex, localRefsIndex) : tView.data[adjustedIndex];
  const native = _locateOrCreateElementNode(tView, lView, tNode, renderer, name, index);
  lView[adjustedIndex] = native;
  const hasDirectives = isDirectiveHost(tNode);
  if (ngDevMode && tView.firstCreatePass) {
    validateElementIsKnown(native, lView, tNode.value, tView.schemas, hasDirectives);
  }
  setCurrentTNode(tNode, true);
  setupStaticAttributes(renderer, native, tNode);
  if ((tNode.flags & 32) !== 32 && wasLastNodeCreated()) {
    appendChild(tView, lView, native, tNode);
  }
  if (getElementDepthCount() === 0) {
    attachPatchData(native, lView);
  }
  increaseElementDepthCount();
  if (hasDirectives) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }
  if (localRefsIndex !== null) {
    saveResolvedLocalsInData(lView, tNode);
  }
  return \u0275\u0275elementStart;
}
function \u0275\u0275elementEnd() {
  let currentTNode = getCurrentTNode();
  ngDevMode && assertDefined(currentTNode, "No parent node to close.");
  if (isCurrentTNodeParent()) {
    setCurrentTNodeAsNotParent();
  } else {
    ngDevMode && assertHasParent(getCurrentTNode());
    currentTNode = currentTNode.parent;
    setCurrentTNode(currentTNode, false);
  }
  const tNode = currentTNode;
  ngDevMode && assertTNodeType(
    tNode,
    3
    /* TNodeType.AnyRNode */
  );
  if (isSkipHydrationRootTNode(tNode)) {
    leaveSkipHydrationBlock();
  }
  decreaseElementDepthCount();
  const tView = getTView();
  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, currentTNode);
    if (isContentQueryHost(currentTNode)) {
      tView.queries.elementEnd(currentTNode);
    }
  }
  if (tNode.classesWithoutHost != null && hasClassInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.classesWithoutHost, true);
  }
  if (tNode.stylesWithoutHost != null && hasStyleInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.stylesWithoutHost, false);
  }
  return \u0275\u0275elementEnd;
}
function \u0275\u0275element(index, name, attrsIndex, localRefsIndex) {
  \u0275\u0275elementStart(index, name, attrsIndex, localRefsIndex);
  \u0275\u0275elementEnd();
  return \u0275\u0275element;
}
var _locateOrCreateElementNode = (tView, lView, tNode, renderer, name, index) => {
  lastNodeWasCreated(true);
  return createElementNode(renderer, name, getNamespace$1());
};
function elementContainerStartFirstCreatePass(index, tView, lView, attrsIndex, localRefsIndex) {
  ngDevMode && ngDevMode.firstCreatePass++;
  const tViewConsts = tView.consts;
  const attrs = getConstant(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, index, 8, "ng-container", attrs);
  if (attrs !== null) {
    computeStaticStyling(tNode, attrs, true);
  }
  const localRefs = getConstant(tViewConsts, localRefsIndex);
  resolveDirectives(tView, lView, tNode, localRefs);
  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }
  return tNode;
}
function \u0275\u0275elementContainerStart(index, attrsIndex, localRefsIndex) {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;
  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  ngDevMode && assertEqual(getBindingIndex(), tView.bindingStartIndex, "element containers should be created before any bindings");
  const tNode = tView.firstCreatePass ? elementContainerStartFirstCreatePass(adjustedIndex, tView, lView, attrsIndex, localRefsIndex) : tView.data[adjustedIndex];
  setCurrentTNode(tNode, true);
  const comment = _locateOrCreateElementContainerNode(tView, lView, tNode, index);
  lView[adjustedIndex] = comment;
  if (wasLastNodeCreated()) {
    appendChild(tView, lView, comment, tNode);
  }
  attachPatchData(comment, lView);
  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }
  if (localRefsIndex != null) {
    saveResolvedLocalsInData(lView, tNode);
  }
  return \u0275\u0275elementContainerStart;
}
function \u0275\u0275elementContainerEnd() {
  let currentTNode = getCurrentTNode();
  const tView = getTView();
  if (isCurrentTNodeParent()) {
    setCurrentTNodeAsNotParent();
  } else {
    ngDevMode && assertHasParent(currentTNode);
    currentTNode = currentTNode.parent;
    setCurrentTNode(currentTNode, false);
  }
  ngDevMode && assertTNodeType(
    currentTNode,
    8
    /* TNodeType.ElementContainer */
  );
  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, currentTNode);
    if (isContentQueryHost(currentTNode)) {
      tView.queries.elementEnd(currentTNode);
    }
  }
  return \u0275\u0275elementContainerEnd;
}
var _locateOrCreateElementContainerNode = (tView, lView, tNode, index) => {
  lastNodeWasCreated(true);
  return createCommentNode(lView[RENDERER], ngDevMode ? "ng-container" : "");
};
function \u0275\u0275getCurrentView() {
  return getLView();
}
function isPromise2(obj) {
  return !!obj && typeof obj.then === "function";
}
function isSubscribable(obj) {
  return !!obj && typeof obj.subscribe === "function";
}
function \u0275\u0275listener(eventName, listenerFn, useCapture, eventTargetResolver) {
  const lView = getLView();
  const tView = getTView();
  const tNode = getCurrentTNode();
  listenerInternal(tView, lView, lView[RENDERER], tNode, eventName, listenerFn, eventTargetResolver);
  return \u0275\u0275listener;
}
function findExistingListener(tView, lView, eventName, tNodeIdx) {
  const tCleanup = tView.cleanup;
  if (tCleanup != null) {
    for (let i = 0; i < tCleanup.length - 1; i += 2) {
      const cleanupEventName = tCleanup[i];
      if (cleanupEventName === eventName && tCleanup[i + 1] === tNodeIdx) {
        const lCleanup = lView[CLEANUP];
        const listenerIdxInLCleanup = tCleanup[i + 2];
        return lCleanup.length > listenerIdxInLCleanup ? lCleanup[listenerIdxInLCleanup] : null;
      }
      if (typeof cleanupEventName === "string") {
        i += 2;
      }
    }
  }
  return null;
}
function listenerInternal(tView, lView, renderer, tNode, eventName, listenerFn, eventTargetResolver) {
  const isTNodeDirectiveHost = isDirectiveHost(tNode);
  const firstCreatePass = tView.firstCreatePass;
  const tCleanup = firstCreatePass && getOrCreateTViewCleanup(tView);
  const context2 = lView[CONTEXT];
  const lCleanup = getOrCreateLViewCleanup(lView);
  ngDevMode && assertTNodeType(
    tNode,
    3 | 12
    /* TNodeType.AnyContainer */
  );
  let processOutputs = true;
  if (tNode.type & 3 || eventTargetResolver) {
    const native = getNativeByTNode(tNode, lView);
    const target = eventTargetResolver ? eventTargetResolver(native) : native;
    const lCleanupIndex = lCleanup.length;
    const idxOrTargetGetter = eventTargetResolver ? (_lView) => eventTargetResolver(unwrapRNode(_lView[tNode.index])) : tNode.index;
    let existingListener = null;
    if (!eventTargetResolver && isTNodeDirectiveHost) {
      existingListener = findExistingListener(tView, lView, eventName, tNode.index);
    }
    if (existingListener !== null) {
      const lastListenerFn = existingListener.__ngLastListenerFn__ || existingListener;
      lastListenerFn.__ngNextListenerFn__ = listenerFn;
      existingListener.__ngLastListenerFn__ = listenerFn;
      processOutputs = false;
    } else {
      listenerFn = wrapListener(
        tNode,
        lView,
        context2,
        listenerFn,
        false
        /** preventDefault */
      );
      const cleanupFn = renderer.listen(target, eventName, listenerFn);
      ngDevMode && ngDevMode.rendererAddEventListener++;
      lCleanup.push(listenerFn, cleanupFn);
      tCleanup && tCleanup.push(eventName, idxOrTargetGetter, lCleanupIndex, lCleanupIndex + 1);
    }
  } else {
    listenerFn = wrapListener(
      tNode,
      lView,
      context2,
      listenerFn,
      false
      /** preventDefault */
    );
  }
  const outputs = tNode.outputs;
  let props;
  if (processOutputs && outputs !== null && (props = outputs[eventName])) {
    const propsLength = props.length;
    if (propsLength) {
      for (let i = 0; i < propsLength; i += 2) {
        const index = props[i];
        ngDevMode && assertIndexInRange(lView, index);
        const minifiedName = props[i + 1];
        const directiveInstance = lView[index];
        const output = directiveInstance[minifiedName];
        if (ngDevMode && !isSubscribable(output)) {
          throw new Error(`@Output ${minifiedName} not initialized in '${directiveInstance.constructor.name}'.`);
        }
        const subscription = output.subscribe(listenerFn);
        const idx = lCleanup.length;
        lCleanup.push(listenerFn, subscription);
        tCleanup && tCleanup.push(eventName, tNode.index, idx, -(idx + 1));
      }
    }
  }
}
function executeListenerWithErrorHandling(lView, context2, listenerFn, e) {
  try {
    profiler(6, context2, listenerFn);
    return listenerFn(e) !== false;
  } catch (error) {
    handleError(lView, error);
    return false;
  } finally {
    profiler(7, context2, listenerFn);
  }
}
function wrapListener(tNode, lView, context2, listenerFn, wrapWithPreventDefault) {
  return function wrapListenerIn_markDirtyAndPreventDefault(e) {
    if (e === Function) {
      return listenerFn;
    }
    const startView = tNode.componentOffset > -1 ? getComponentLViewByIndex(tNode.index, lView) : lView;
    markViewDirty(startView);
    let result = executeListenerWithErrorHandling(lView, context2, listenerFn, e);
    let nextListenerFn = wrapListenerIn_markDirtyAndPreventDefault.__ngNextListenerFn__;
    while (nextListenerFn) {
      result = executeListenerWithErrorHandling(lView, context2, nextListenerFn, e) && result;
      nextListenerFn = nextListenerFn.__ngNextListenerFn__;
    }
    if (wrapWithPreventDefault && result === false) {
      e.preventDefault();
    }
    return result;
  };
}
function \u0275\u0275nextContext(level = 1) {
  return nextContextImpl(level);
}
function toTStylingRange(prev, next) {
  ngDevMode && assertNumberInRange(
    prev,
    0,
    32767
    /* StylingRange.UNSIGNED_MASK */
  );
  ngDevMode && assertNumberInRange(
    next,
    0,
    32767
    /* StylingRange.UNSIGNED_MASK */
  );
  return prev << 17 | next << 2;
}
function getTStylingRangePrev(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return tStylingRange >> 17 & 32767;
}
function getTStylingRangePrevDuplicate(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return (tStylingRange & 2) == 2;
}
function setTStylingRangePrev(tStylingRange, previous) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  ngDevMode && assertNumberInRange(
    previous,
    0,
    32767
    /* StylingRange.UNSIGNED_MASK */
  );
  return tStylingRange & ~4294836224 | previous << 17;
}
function setTStylingRangePrevDuplicate(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return tStylingRange | 2;
}
function getTStylingRangeNext(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return (tStylingRange & 131068) >> 2;
}
function setTStylingRangeNext(tStylingRange, next) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  ngDevMode && assertNumberInRange(
    next,
    0,
    32767
    /* StylingRange.UNSIGNED_MASK */
  );
  return tStylingRange & ~131068 | //
  next << 2;
}
function getTStylingRangeNextDuplicate(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return (tStylingRange & 1) === 1;
}
function setTStylingRangeNextDuplicate(tStylingRange) {
  ngDevMode && assertNumber(tStylingRange, "expected number");
  return tStylingRange | 1;
}
function insertTStylingBinding(tData, tNode, tStylingKeyWithStatic, index, isHostBinding, isClassBinding) {
  ngDevMode && assertFirstUpdatePass(getTView());
  let tBindings = isClassBinding ? tNode.classBindings : tNode.styleBindings;
  let tmplHead = getTStylingRangePrev(tBindings);
  let tmplTail = getTStylingRangeNext(tBindings);
  tData[index] = tStylingKeyWithStatic;
  let isKeyDuplicateOfStatic = false;
  let tStylingKey;
  if (Array.isArray(tStylingKeyWithStatic)) {
    const staticKeyValueArray = tStylingKeyWithStatic;
    tStylingKey = staticKeyValueArray[1];
    if (tStylingKey === null || keyValueArrayIndexOf(staticKeyValueArray, tStylingKey) > 0) {
      isKeyDuplicateOfStatic = true;
    }
  } else {
    tStylingKey = tStylingKeyWithStatic;
  }
  if (isHostBinding) {
    const hasTemplateBindings = tmplTail !== 0;
    if (hasTemplateBindings) {
      const previousNode = getTStylingRangePrev(tData[tmplHead + 1]);
      tData[index + 1] = toTStylingRange(previousNode, tmplHead);
      if (previousNode !== 0) {
        tData[previousNode + 1] = setTStylingRangeNext(tData[previousNode + 1], index);
      }
      tData[tmplHead + 1] = setTStylingRangePrev(tData[tmplHead + 1], index);
    } else {
      tData[index + 1] = toTStylingRange(tmplHead, 0);
      if (tmplHead !== 0) {
        tData[tmplHead + 1] = setTStylingRangeNext(tData[tmplHead + 1], index);
      }
      tmplHead = index;
    }
  } else {
    tData[index + 1] = toTStylingRange(tmplTail, 0);
    ngDevMode && assertEqual(tmplHead !== 0 && tmplTail === 0, false, "Adding template bindings after hostBindings is not allowed.");
    if (tmplHead === 0) {
      tmplHead = index;
    } else {
      tData[tmplTail + 1] = setTStylingRangeNext(tData[tmplTail + 1], index);
    }
    tmplTail = index;
  }
  if (isKeyDuplicateOfStatic) {
    tData[index + 1] = setTStylingRangePrevDuplicate(tData[index + 1]);
  }
  markDuplicates(tData, tStylingKey, index, true, isClassBinding);
  markDuplicates(tData, tStylingKey, index, false, isClassBinding);
  markDuplicateOfResidualStyling(tNode, tStylingKey, tData, index, isClassBinding);
  tBindings = toTStylingRange(tmplHead, tmplTail);
  if (isClassBinding) {
    tNode.classBindings = tBindings;
  } else {
    tNode.styleBindings = tBindings;
  }
}
function markDuplicateOfResidualStyling(tNode, tStylingKey, tData, index, isClassBinding) {
  const residual = isClassBinding ? tNode.residualClasses : tNode.residualStyles;
  if (residual != null && typeof tStylingKey == "string" && keyValueArrayIndexOf(residual, tStylingKey) >= 0) {
    tData[index + 1] = setTStylingRangeNextDuplicate(tData[index + 1]);
  }
}
function markDuplicates(tData, tStylingKey, index, isPrevDir, isClassBinding) {
  const tStylingAtIndex = tData[index + 1];
  const isMap = tStylingKey === null;
  let cursor = isPrevDir ? getTStylingRangePrev(tStylingAtIndex) : getTStylingRangeNext(tStylingAtIndex);
  let foundDuplicate = false;
  while (cursor !== 0 && (foundDuplicate === false || isMap)) {
    ngDevMode && assertIndexInRange(tData, cursor);
    const tStylingValueAtCursor = tData[cursor];
    const tStyleRangeAtCursor = tData[cursor + 1];
    if (isStylingMatch(tStylingValueAtCursor, tStylingKey)) {
      foundDuplicate = true;
      tData[cursor + 1] = isPrevDir ? setTStylingRangeNextDuplicate(tStyleRangeAtCursor) : setTStylingRangePrevDuplicate(tStyleRangeAtCursor);
    }
    cursor = isPrevDir ? getTStylingRangePrev(tStyleRangeAtCursor) : getTStylingRangeNext(tStyleRangeAtCursor);
  }
  if (foundDuplicate) {
    tData[index + 1] = isPrevDir ? setTStylingRangePrevDuplicate(tStylingAtIndex) : setTStylingRangeNextDuplicate(tStylingAtIndex);
  }
}
function isStylingMatch(tStylingKeyCursor, tStylingKey) {
  ngDevMode && assertNotEqual(Array.isArray(tStylingKey), true, "Expected that 'tStylingKey' has been unwrapped");
  if (tStylingKeyCursor === null || // If the cursor is `null` it means that we have map at that
  // location so we must assume that we have a match.
  tStylingKey == null || // If `tStylingKey` is `null` then it is a map therefor assume that it
  // contains a match.
  (Array.isArray(tStylingKeyCursor) ? tStylingKeyCursor[1] : tStylingKeyCursor) === tStylingKey) {
    return true;
  } else if (Array.isArray(tStylingKeyCursor) && typeof tStylingKey === "string") {
    return keyValueArrayIndexOf(tStylingKeyCursor, tStylingKey) >= 0;
  }
  return false;
}
var parserState = {
  textEnd: 0,
  key: 0,
  keyEnd: 0,
  value: 0,
  valueEnd: 0
};
function getLastParsedKey(text) {
  return text.substring(parserState.key, parserState.keyEnd);
}
function parseClassName(text) {
  resetParserState(text);
  return parseClassNameNext(text, consumeWhitespace(text, 0, parserState.textEnd));
}
function parseClassNameNext(text, index) {
  const end = parserState.textEnd;
  if (end === index) {
    return -1;
  }
  index = parserState.keyEnd = consumeClassToken(text, parserState.key = index, end);
  return consumeWhitespace(text, index, end);
}
function resetParserState(text) {
  parserState.key = 0;
  parserState.keyEnd = 0;
  parserState.value = 0;
  parserState.valueEnd = 0;
  parserState.textEnd = text.length;
}
function consumeWhitespace(text, startIndex, endIndex) {
  while (startIndex < endIndex && text.charCodeAt(startIndex) <= 32) {
    startIndex++;
  }
  return startIndex;
}
function consumeClassToken(text, startIndex, endIndex) {
  while (startIndex < endIndex && text.charCodeAt(startIndex) > 32) {
    startIndex++;
  }
  return startIndex;
}
function \u0275\u0275styleProp(prop, value, suffix) {
  checkStylingProperty(prop, value, suffix, false);
  return \u0275\u0275styleProp;
}
function \u0275\u0275classProp(className, value) {
  checkStylingProperty(className, value, null, true);
  return \u0275\u0275classProp;
}
function \u0275\u0275classMap(classes) {
  checkStylingMap(classKeyValueArraySet, classStringParser, classes, true);
}
function classStringParser(keyValueArray, text) {
  for (let i = parseClassName(text); i >= 0; i = parseClassNameNext(text, i)) {
    keyValueArraySet(keyValueArray, getLastParsedKey(text), true);
  }
}
function checkStylingProperty(prop, value, suffix, isClassBased) {
  const lView = getLView();
  const tView = getTView();
  const bindingIndex = incrementBindingIndex(2);
  if (tView.firstUpdatePass) {
    stylingFirstUpdatePass(tView, prop, bindingIndex, isClassBased);
  }
  if (value !== NO_CHANGE && bindingUpdated(lView, bindingIndex, value)) {
    const tNode = tView.data[getSelectedIndex()];
    updateStyling(tView, tNode, lView, lView[RENDERER], prop, lView[bindingIndex + 1] = normalizeSuffix(value, suffix), isClassBased, bindingIndex);
  }
}
function checkStylingMap(keyValueArraySet2, stringParser, value, isClassBased) {
  const tView = getTView();
  const bindingIndex = incrementBindingIndex(2);
  if (tView.firstUpdatePass) {
    stylingFirstUpdatePass(tView, null, bindingIndex, isClassBased);
  }
  const lView = getLView();
  if (value !== NO_CHANGE && bindingUpdated(lView, bindingIndex, value)) {
    const tNode = tView.data[getSelectedIndex()];
    if (hasStylingInputShadow(tNode, isClassBased) && !isInHostBindings(tView, bindingIndex)) {
      if (ngDevMode) {
        const tStylingKey = tView.data[bindingIndex];
        assertEqual(Array.isArray(tStylingKey) ? tStylingKey[1] : tStylingKey, false, "Styling linked list shadow input should be marked as 'false'");
      }
      let staticPrefix = isClassBased ? tNode.classesWithoutHost : tNode.stylesWithoutHost;
      ngDevMode && isClassBased === false && staticPrefix !== null && assertEqual(staticPrefix.endsWith(";"), true, "Expecting static portion to end with ';'");
      if (staticPrefix !== null) {
        value = concatStringsWithSpace(staticPrefix, value ? value : "");
      }
      setDirectiveInputsWhichShadowsStyling(tView, tNode, lView, value, isClassBased);
    } else {
      updateStylingMap(tView, tNode, lView, lView[RENDERER], lView[bindingIndex + 1], lView[bindingIndex + 1] = toStylingKeyValueArray(keyValueArraySet2, stringParser, value), isClassBased, bindingIndex);
    }
  }
}
function isInHostBindings(tView, bindingIndex) {
  return bindingIndex >= tView.expandoStartIndex;
}
function stylingFirstUpdatePass(tView, tStylingKey, bindingIndex, isClassBased) {
  ngDevMode && assertFirstUpdatePass(tView);
  const tData = tView.data;
  if (tData[bindingIndex + 1] === null) {
    const tNode = tData[getSelectedIndex()];
    ngDevMode && assertDefined(tNode, "TNode expected");
    const isHostBindings = isInHostBindings(tView, bindingIndex);
    if (hasStylingInputShadow(tNode, isClassBased) && tStylingKey === null && !isHostBindings) {
      tStylingKey = false;
    }
    tStylingKey = wrapInStaticStylingKey(tData, tNode, tStylingKey, isClassBased);
    insertTStylingBinding(tData, tNode, tStylingKey, bindingIndex, isHostBindings, isClassBased);
  }
}
function wrapInStaticStylingKey(tData, tNode, stylingKey, isClassBased) {
  const hostDirectiveDef = getCurrentDirectiveDef(tData);
  let residual = isClassBased ? tNode.residualClasses : tNode.residualStyles;
  if (hostDirectiveDef === null) {
    const isFirstStylingInstructionInTemplate = (isClassBased ? tNode.classBindings : tNode.styleBindings) === 0;
    if (isFirstStylingInstructionInTemplate) {
      stylingKey = collectStylingFromDirectives(null, tData, tNode, stylingKey, isClassBased);
      stylingKey = collectStylingFromTAttrs(stylingKey, tNode.attrs, isClassBased);
      residual = null;
    }
  } else {
    const directiveStylingLast = tNode.directiveStylingLast;
    const isFirstStylingInstructionInHostBinding = directiveStylingLast === -1 || tData[directiveStylingLast] !== hostDirectiveDef;
    if (isFirstStylingInstructionInHostBinding) {
      stylingKey = collectStylingFromDirectives(hostDirectiveDef, tData, tNode, stylingKey, isClassBased);
      if (residual === null) {
        let templateStylingKey = getTemplateHeadTStylingKey(tData, tNode, isClassBased);
        if (templateStylingKey !== void 0 && Array.isArray(templateStylingKey)) {
          templateStylingKey = collectStylingFromDirectives(null, tData, tNode, templateStylingKey[1], isClassBased);
          templateStylingKey = collectStylingFromTAttrs(templateStylingKey, tNode.attrs, isClassBased);
          setTemplateHeadTStylingKey(tData, tNode, isClassBased, templateStylingKey);
        }
      } else {
        residual = collectResidual(tData, tNode, isClassBased);
      }
    }
  }
  if (residual !== void 0) {
    isClassBased ? tNode.residualClasses = residual : tNode.residualStyles = residual;
  }
  return stylingKey;
}
function getTemplateHeadTStylingKey(tData, tNode, isClassBased) {
  const bindings = isClassBased ? tNode.classBindings : tNode.styleBindings;
  if (getTStylingRangeNext(bindings) === 0) {
    return void 0;
  }
  return tData[getTStylingRangePrev(bindings)];
}
function setTemplateHeadTStylingKey(tData, tNode, isClassBased, tStylingKey) {
  const bindings = isClassBased ? tNode.classBindings : tNode.styleBindings;
  ngDevMode && assertNotEqual(getTStylingRangeNext(bindings), 0, "Expecting to have at least one template styling binding.");
  tData[getTStylingRangePrev(bindings)] = tStylingKey;
}
function collectResidual(tData, tNode, isClassBased) {
  let residual = void 0;
  const directiveEnd = tNode.directiveEnd;
  ngDevMode && assertNotEqual(tNode.directiveStylingLast, -1, "By the time this function gets called at least one hostBindings-node styling instruction must have executed.");
  for (let i = 1 + tNode.directiveStylingLast; i < directiveEnd; i++) {
    const attrs = tData[i].hostAttrs;
    residual = collectStylingFromTAttrs(residual, attrs, isClassBased);
  }
  return collectStylingFromTAttrs(residual, tNode.attrs, isClassBased);
}
function collectStylingFromDirectives(hostDirectiveDef, tData, tNode, stylingKey, isClassBased) {
  let currentDirective = null;
  const directiveEnd = tNode.directiveEnd;
  let directiveStylingLast = tNode.directiveStylingLast;
  if (directiveStylingLast === -1) {
    directiveStylingLast = tNode.directiveStart;
  } else {
    directiveStylingLast++;
  }
  while (directiveStylingLast < directiveEnd) {
    currentDirective = tData[directiveStylingLast];
    ngDevMode && assertDefined(currentDirective, "expected to be defined");
    stylingKey = collectStylingFromTAttrs(stylingKey, currentDirective.hostAttrs, isClassBased);
    if (currentDirective === hostDirectiveDef)
      break;
    directiveStylingLast++;
  }
  if (hostDirectiveDef !== null) {
    tNode.directiveStylingLast = directiveStylingLast;
  }
  return stylingKey;
}
function collectStylingFromTAttrs(stylingKey, attrs, isClassBased) {
  const desiredMarker = isClassBased ? 1 : 2;
  let currentMarker = -1;
  if (attrs !== null) {
    for (let i = 0; i < attrs.length; i++) {
      const item = attrs[i];
      if (typeof item === "number") {
        currentMarker = item;
      } else {
        if (currentMarker === desiredMarker) {
          if (!Array.isArray(stylingKey)) {
            stylingKey = stylingKey === void 0 ? [] : ["", stylingKey];
          }
          keyValueArraySet(stylingKey, item, isClassBased ? true : attrs[++i]);
        }
      }
    }
  }
  return stylingKey === void 0 ? null : stylingKey;
}
function toStylingKeyValueArray(keyValueArraySet2, stringParser, value) {
  if (value == null || value === "")
    return EMPTY_ARRAY;
  const styleKeyValueArray = [];
  const unwrappedValue = unwrapSafeValue(value);
  if (Array.isArray(unwrappedValue)) {
    for (let i = 0; i < unwrappedValue.length; i++) {
      keyValueArraySet2(styleKeyValueArray, unwrappedValue[i], true);
    }
  } else if (typeof unwrappedValue === "object") {
    for (const key in unwrappedValue) {
      if (unwrappedValue.hasOwnProperty(key)) {
        keyValueArraySet2(styleKeyValueArray, key, unwrappedValue[key]);
      }
    }
  } else if (typeof unwrappedValue === "string") {
    stringParser(styleKeyValueArray, unwrappedValue);
  } else {
    ngDevMode && throwError2("Unsupported styling type " + typeof unwrappedValue + ": " + unwrappedValue);
  }
  return styleKeyValueArray;
}
function classKeyValueArraySet(keyValueArray, key, value) {
  const stringKey = String(key);
  if (stringKey !== "" && !stringKey.includes(" ")) {
    keyValueArraySet(keyValueArray, stringKey, value);
  }
}
function updateStylingMap(tView, tNode, lView, renderer, oldKeyValueArray, newKeyValueArray, isClassBased, bindingIndex) {
  if (oldKeyValueArray === NO_CHANGE) {
    oldKeyValueArray = EMPTY_ARRAY;
  }
  let oldIndex = 0;
  let newIndex = 0;
  let oldKey = 0 < oldKeyValueArray.length ? oldKeyValueArray[0] : null;
  let newKey = 0 < newKeyValueArray.length ? newKeyValueArray[0] : null;
  while (oldKey !== null || newKey !== null) {
    ngDevMode && assertLessThan(oldIndex, 999, "Are we stuck in infinite loop?");
    ngDevMode && assertLessThan(newIndex, 999, "Are we stuck in infinite loop?");
    const oldValue = oldIndex < oldKeyValueArray.length ? oldKeyValueArray[oldIndex + 1] : void 0;
    const newValue = newIndex < newKeyValueArray.length ? newKeyValueArray[newIndex + 1] : void 0;
    let setKey = null;
    let setValue = void 0;
    if (oldKey === newKey) {
      oldIndex += 2;
      newIndex += 2;
      if (oldValue !== newValue) {
        setKey = newKey;
        setValue = newValue;
      }
    } else if (newKey === null || oldKey !== null && oldKey < newKey) {
      oldIndex += 2;
      setKey = oldKey;
    } else {
      ngDevMode && assertDefined(newKey, "Expecting to have a valid key");
      newIndex += 2;
      setKey = newKey;
      setValue = newValue;
    }
    if (setKey !== null) {
      updateStyling(tView, tNode, lView, renderer, setKey, setValue, isClassBased, bindingIndex);
    }
    oldKey = oldIndex < oldKeyValueArray.length ? oldKeyValueArray[oldIndex] : null;
    newKey = newIndex < newKeyValueArray.length ? newKeyValueArray[newIndex] : null;
  }
}
function updateStyling(tView, tNode, lView, renderer, prop, value, isClassBased, bindingIndex) {
  if (!(tNode.type & 3)) {
    return;
  }
  const tData = tView.data;
  const tRange = tData[bindingIndex + 1];
  const higherPriorityValue = getTStylingRangeNextDuplicate(tRange) ? findStylingValue(tData, tNode, lView, prop, getTStylingRangeNext(tRange), isClassBased) : void 0;
  if (!isStylingValuePresent(higherPriorityValue)) {
    if (!isStylingValuePresent(value)) {
      if (getTStylingRangePrevDuplicate(tRange)) {
        value = findStylingValue(tData, null, lView, prop, bindingIndex, isClassBased);
      }
    }
    const rNode = getNativeByIndex(getSelectedIndex(), lView);
    applyStyling(renderer, isClassBased, rNode, prop, value);
  }
}
function findStylingValue(tData, tNode, lView, prop, index, isClassBased) {
  const isPrevDirection = tNode === null;
  let value = void 0;
  while (index > 0) {
    const rawKey = tData[index];
    const containsStatics = Array.isArray(rawKey);
    const key = containsStatics ? rawKey[1] : rawKey;
    const isStylingMap = key === null;
    let valueAtLViewIndex = lView[index + 1];
    if (valueAtLViewIndex === NO_CHANGE) {
      valueAtLViewIndex = isStylingMap ? EMPTY_ARRAY : void 0;
    }
    let currentValue = isStylingMap ? keyValueArrayGet(valueAtLViewIndex, prop) : key === prop ? valueAtLViewIndex : void 0;
    if (containsStatics && !isStylingValuePresent(currentValue)) {
      currentValue = keyValueArrayGet(rawKey, prop);
    }
    if (isStylingValuePresent(currentValue)) {
      value = currentValue;
      if (isPrevDirection) {
        return value;
      }
    }
    const tRange = tData[index + 1];
    index = isPrevDirection ? getTStylingRangePrev(tRange) : getTStylingRangeNext(tRange);
  }
  if (tNode !== null) {
    let residual = isClassBased ? tNode.residualClasses : tNode.residualStyles;
    if (residual != null) {
      value = keyValueArrayGet(residual, prop);
    }
  }
  return value;
}
function isStylingValuePresent(value) {
  return value !== void 0;
}
function normalizeSuffix(value, suffix) {
  if (value == null || value === "") {
  } else if (typeof suffix === "string") {
    value = value + suffix;
  } else if (typeof value === "object") {
    value = stringify(unwrapSafeValue(value));
  }
  return value;
}
function hasStylingInputShadow(tNode, isClassBased) {
  return (tNode.flags & (isClassBased ? 8 : 16)) !== 0;
}
function \u0275\u0275text(index, value = "") {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;
  ngDevMode && assertEqual(getBindingIndex(), tView.bindingStartIndex, "text nodes should be created before any bindings");
  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  const tNode = tView.firstCreatePass ? getOrCreateTNode(tView, adjustedIndex, 1, value, null) : tView.data[adjustedIndex];
  const textNative = _locateOrCreateTextNode(tView, lView, tNode, value, index);
  lView[adjustedIndex] = textNative;
  if (wasLastNodeCreated()) {
    appendChild(tView, lView, textNative, tNode);
  }
  setCurrentTNode(tNode, false);
}
var _locateOrCreateTextNode = (tView, lView, tNode, value, index) => {
  lastNodeWasCreated(true);
  return createTextNode(lView[RENDERER], value);
};
function \u0275\u0275textInterpolate(v0) {
  \u0275\u0275textInterpolate1("", v0, "");
  return \u0275\u0275textInterpolate;
}
function \u0275\u0275textInterpolate1(prefix, v0, suffix) {
  const lView = getLView();
  const interpolated = interpolation1(lView, prefix, v0, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated);
  }
  return \u0275\u0275textInterpolate1;
}
function \u0275\u0275textInterpolate2(prefix, v0, i0, v1, suffix) {
  const lView = getLView();
  const interpolated = interpolation2(lView, prefix, v0, i0, v1, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated);
  }
  return \u0275\u0275textInterpolate2;
}
function \u0275\u0275classMapInterpolate1(prefix, v0, suffix) {
  const lView = getLView();
  const interpolatedValue = interpolation1(lView, prefix, v0, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}
if (false) {
  /* @__PURE__ */ (function() {
    _global["ngI18nClosureMode"] = // TODO(FW-1250): validate that this actually, you know, works.
    // tslint:disable-next-line:no-toplevel-property-access
    typeof goog !== "undefined" && typeof goog.getMsg === "function";
  })();
}
var u = void 0;
function plural(val) {
  const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, "").length;
  if (i === 1 && v === 0)
    return 1;
  return 5;
}
var localeEn = ["en", [["a", "p"], ["AM", "PM"], u], [["AM", "PM"], u, u], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], u, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], u, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"], ["{1}, {0}", u, "{1} 'at' {0}", u], [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", plural];
var LOCALE_DATA = {};
function findLocaleData(locale) {
  const normalizedLocale = normalizeLocale(locale);
  let match = getLocaleData(normalizedLocale);
  if (match) {
    return match;
  }
  const parentLocale = normalizedLocale.split("-")[0];
  match = getLocaleData(parentLocale);
  if (match) {
    return match;
  }
  if (parentLocale === "en") {
    return localeEn;
  }
  throw new RuntimeError(701, ngDevMode && `Missing locale data for the locale "${locale}".`);
}
function getLocaleData(normalizedLocale) {
  if (!(normalizedLocale in LOCALE_DATA)) {
    LOCALE_DATA[normalizedLocale] = _global.ng && _global.ng.common && _global.ng.common.locales && _global.ng.common.locales[normalizedLocale];
  }
  return LOCALE_DATA[normalizedLocale];
}
var LocaleDataIndex = /* @__PURE__ */ function(LocaleDataIndex2) {
  LocaleDataIndex2[LocaleDataIndex2["LocaleId"] = 0] = "LocaleId";
  LocaleDataIndex2[LocaleDataIndex2["DayPeriodsFormat"] = 1] = "DayPeriodsFormat";
  LocaleDataIndex2[LocaleDataIndex2["DayPeriodsStandalone"] = 2] = "DayPeriodsStandalone";
  LocaleDataIndex2[LocaleDataIndex2["DaysFormat"] = 3] = "DaysFormat";
  LocaleDataIndex2[LocaleDataIndex2["DaysStandalone"] = 4] = "DaysStandalone";
  LocaleDataIndex2[LocaleDataIndex2["MonthsFormat"] = 5] = "MonthsFormat";
  LocaleDataIndex2[LocaleDataIndex2["MonthsStandalone"] = 6] = "MonthsStandalone";
  LocaleDataIndex2[LocaleDataIndex2["Eras"] = 7] = "Eras";
  LocaleDataIndex2[LocaleDataIndex2["FirstDayOfWeek"] = 8] = "FirstDayOfWeek";
  LocaleDataIndex2[LocaleDataIndex2["WeekendRange"] = 9] = "WeekendRange";
  LocaleDataIndex2[LocaleDataIndex2["DateFormat"] = 10] = "DateFormat";
  LocaleDataIndex2[LocaleDataIndex2["TimeFormat"] = 11] = "TimeFormat";
  LocaleDataIndex2[LocaleDataIndex2["DateTimeFormat"] = 12] = "DateTimeFormat";
  LocaleDataIndex2[LocaleDataIndex2["NumberSymbols"] = 13] = "NumberSymbols";
  LocaleDataIndex2[LocaleDataIndex2["NumberFormats"] = 14] = "NumberFormats";
  LocaleDataIndex2[LocaleDataIndex2["CurrencyCode"] = 15] = "CurrencyCode";
  LocaleDataIndex2[LocaleDataIndex2["CurrencySymbol"] = 16] = "CurrencySymbol";
  LocaleDataIndex2[LocaleDataIndex2["CurrencyName"] = 17] = "CurrencyName";
  LocaleDataIndex2[LocaleDataIndex2["Currencies"] = 18] = "Currencies";
  LocaleDataIndex2[LocaleDataIndex2["Directionality"] = 19] = "Directionality";
  LocaleDataIndex2[LocaleDataIndex2["PluralCase"] = 20] = "PluralCase";
  LocaleDataIndex2[LocaleDataIndex2["ExtraData"] = 21] = "ExtraData";
  return LocaleDataIndex2;
}(LocaleDataIndex || {});
function normalizeLocale(locale) {
  return locale.toLowerCase().replace(/_/g, "-");
}
var DEFAULT_LOCALE_ID = "en-US";
var LOCALE_ID$1 = DEFAULT_LOCALE_ID;
function setLocaleId(localeId) {
  assertDefined(localeId, `Expected localeId to be defined`);
  if (typeof localeId === "string") {
    LOCALE_ID$1 = localeId.toLowerCase().replace(/_/g, "-");
  }
}
function providersResolver(def, providers, viewProviders) {
  const tView = getTView();
  if (tView.firstCreatePass) {
    const isComponent = isComponentDef(def);
    resolveProvider(viewProviders, tView.data, tView.blueprint, isComponent, true);
    resolveProvider(providers, tView.data, tView.blueprint, isComponent, false);
  }
}
function resolveProvider(provider, tInjectables, lInjectablesBlueprint, isComponent, isViewProvider) {
  provider = resolveForwardRef(provider);
  if (Array.isArray(provider)) {
    for (let i = 0; i < provider.length; i++) {
      resolveProvider(provider[i], tInjectables, lInjectablesBlueprint, isComponent, isViewProvider);
    }
  } else {
    const tView = getTView();
    const lView = getLView();
    const tNode = getCurrentTNode();
    let token = isTypeProvider(provider) ? provider : resolveForwardRef(provider.provide);
    const providerFactory = providerToFactory(provider);
    if (ngDevMode) {
      const injector = new NodeInjector(tNode, lView);
      runInInjectorProfilerContext(injector, token, () => {
        emitProviderConfiguredEvent(provider, isViewProvider);
      });
    }
    const beginIndex = tNode.providerIndexes & 1048575;
    const endIndex = tNode.directiveStart;
    const cptViewProvidersCount = tNode.providerIndexes >> 20;
    if (isTypeProvider(provider) || !provider.multi) {
      const factory = new NodeInjectorFactory(providerFactory, isViewProvider, \u0275\u0275directiveInject);
      const existingFactoryIndex = indexOf(token, tInjectables, isViewProvider ? beginIndex : beginIndex + cptViewProvidersCount, endIndex);
      if (existingFactoryIndex === -1) {
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
        registerDestroyHooksIfSupported(tView, provider, tInjectables.length);
        tInjectables.push(token);
        tNode.directiveStart++;
        tNode.directiveEnd++;
        if (isViewProvider) {
          tNode.providerIndexes += 1048576;
        }
        lInjectablesBlueprint.push(factory);
        lView.push(factory);
      } else {
        lInjectablesBlueprint[existingFactoryIndex] = factory;
        lView[existingFactoryIndex] = factory;
      }
    } else {
      const existingProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex + cptViewProvidersCount, endIndex);
      const existingViewProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex, beginIndex + cptViewProvidersCount);
      const doesProvidersFactoryExist = existingProvidersFactoryIndex >= 0 && lInjectablesBlueprint[existingProvidersFactoryIndex];
      const doesViewProvidersFactoryExist = existingViewProvidersFactoryIndex >= 0 && lInjectablesBlueprint[existingViewProvidersFactoryIndex];
      if (isViewProvider && !doesViewProvidersFactoryExist || !isViewProvider && !doesProvidersFactoryExist) {
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
        const factory = multiFactory(isViewProvider ? multiViewProvidersFactoryResolver : multiProvidersFactoryResolver, lInjectablesBlueprint.length, isViewProvider, isComponent, providerFactory);
        if (!isViewProvider && doesViewProvidersFactoryExist) {
          lInjectablesBlueprint[existingViewProvidersFactoryIndex].providerFactory = factory;
        }
        registerDestroyHooksIfSupported(tView, provider, tInjectables.length, 0);
        tInjectables.push(token);
        tNode.directiveStart++;
        tNode.directiveEnd++;
        if (isViewProvider) {
          tNode.providerIndexes += 1048576;
        }
        lInjectablesBlueprint.push(factory);
        lView.push(factory);
      } else {
        const indexInFactory = multiFactoryAdd(lInjectablesBlueprint[isViewProvider ? existingViewProvidersFactoryIndex : existingProvidersFactoryIndex], providerFactory, !isViewProvider && isComponent);
        registerDestroyHooksIfSupported(tView, provider, existingProvidersFactoryIndex > -1 ? existingProvidersFactoryIndex : existingViewProvidersFactoryIndex, indexInFactory);
      }
      if (!isViewProvider && isComponent && doesViewProvidersFactoryExist) {
        lInjectablesBlueprint[existingViewProvidersFactoryIndex].componentProviders++;
      }
    }
  }
}
function registerDestroyHooksIfSupported(tView, provider, contextIndex, indexInFactory) {
  const providerIsTypeProvider = isTypeProvider(provider);
  const providerIsClassProvider = isClassProvider(provider);
  if (providerIsTypeProvider || providerIsClassProvider) {
    const classToken = providerIsClassProvider ? resolveForwardRef(provider.useClass) : provider;
    const prototype = classToken.prototype;
    const ngOnDestroy = prototype.ngOnDestroy;
    if (ngOnDestroy) {
      const hooks = tView.destroyHooks || (tView.destroyHooks = []);
      if (!providerIsTypeProvider && provider.multi) {
        ngDevMode && assertDefined(indexInFactory, "indexInFactory when registering multi factory destroy hook");
        const existingCallbacksIndex = hooks.indexOf(contextIndex);
        if (existingCallbacksIndex === -1) {
          hooks.push(contextIndex, [indexInFactory, ngOnDestroy]);
        } else {
          hooks[existingCallbacksIndex + 1].push(indexInFactory, ngOnDestroy);
        }
      } else {
        hooks.push(contextIndex, ngOnDestroy);
      }
    }
  }
}
function multiFactoryAdd(multiFactory2, factory, isComponentProvider) {
  if (isComponentProvider) {
    multiFactory2.componentProviders++;
  }
  return multiFactory2.multi.push(factory) - 1;
}
function indexOf(item, arr, begin, end) {
  for (let i = begin; i < end; i++) {
    if (arr[i] === item)
      return i;
  }
  return -1;
}
function multiProvidersFactoryResolver(_, tData, lData, tNode) {
  return multiResolve(this.multi, []);
}
function multiViewProvidersFactoryResolver(_, tData, lView, tNode) {
  const factories = this.multi;
  let result;
  if (this.providerFactory) {
    const componentCount = this.providerFactory.componentProviders;
    const multiProviders = getNodeInjectable(lView, lView[TVIEW], this.providerFactory.index, tNode);
    result = multiProviders.slice(0, componentCount);
    multiResolve(factories, result);
    for (let i = componentCount; i < multiProviders.length; i++) {
      result.push(multiProviders[i]);
    }
  } else {
    result = [];
    multiResolve(factories, result);
  }
  return result;
}
function multiResolve(factories, result) {
  for (let i = 0; i < factories.length; i++) {
    const factory = factories[i];
    result.push(factory());
  }
  return result;
}
function multiFactory(factoryFn, index, isViewProvider, isComponent, f) {
  const factory = new NodeInjectorFactory(factoryFn, isViewProvider, \u0275\u0275directiveInject);
  factory.multi = [];
  factory.index = index;
  factory.componentProviders = 0;
  multiFactoryAdd(factory, f, isComponent && !isViewProvider);
  return factory;
}
function \u0275\u0275ProvidersFeature(providers, viewProviders = []) {
  return (definition) => {
    definition.providersResolver = (def, processProvidersFn) => {
      return providersResolver(
        def,
        //
        processProvidersFn ? processProvidersFn(providers) : providers,
        //
        viewProviders
      );
    };
  };
}
var NgModuleRef$1 = class {
};
var NgModuleFactory$1 = class {
};
var NgModuleRef = class extends NgModuleRef$1 {
  constructor(ngModuleType, _parent, additionalProviders) {
    super();
    this._parent = _parent;
    this._bootstrapComponents = [];
    this.destroyCbs = [];
    this.componentFactoryResolver = new ComponentFactoryResolver(this);
    const ngModuleDef = getNgModuleDef(ngModuleType);
    ngDevMode && assertDefined(ngModuleDef, `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);
    this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
    this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [{
      provide: NgModuleRef$1,
      useValue: this
    }, {
      provide: ComponentFactoryResolver$1,
      useValue: this.componentFactoryResolver
    }, ...additionalProviders], stringify(ngModuleType), /* @__PURE__ */ new Set(["environment"]));
    this._r3Injector.resolveInjectorInitializers();
    this.instance = this._r3Injector.get(ngModuleType);
  }
  get injector() {
    return this._r3Injector;
  }
  destroy() {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    const injector = this._r3Injector;
    !injector.destroyed && injector.destroy();
    this.destroyCbs.forEach((fn) => fn());
    this.destroyCbs = null;
  }
  onDestroy(callback) {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    this.destroyCbs.push(callback);
  }
};
var NgModuleFactory = class extends NgModuleFactory$1 {
  constructor(moduleType) {
    super();
    this.moduleType = moduleType;
  }
  create(parentInjector) {
    return new NgModuleRef(this.moduleType, parentInjector, []);
  }
};
var EnvironmentNgModuleRefAdapter = class extends NgModuleRef$1 {
  constructor(config2) {
    super();
    this.componentFactoryResolver = new ComponentFactoryResolver(this);
    this.instance = null;
    const injector = new R3Injector([...config2.providers, {
      provide: NgModuleRef$1,
      useValue: this
    }, {
      provide: ComponentFactoryResolver$1,
      useValue: this.componentFactoryResolver
    }], config2.parent || getNullInjector(), config2.debugName, /* @__PURE__ */ new Set(["environment"]));
    this.injector = injector;
    if (config2.runEnvironmentInitializers) {
      injector.resolveInjectorInitializers();
    }
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(callback) {
    this.injector.onDestroy(callback);
  }
};
function createEnvironmentInjector(providers, parent, debugName = null) {
  const adapter = new EnvironmentNgModuleRefAdapter({
    providers,
    parent,
    debugName,
    runEnvironmentInitializers: true
  });
  return adapter.injector;
}
var StandaloneService = /* @__PURE__ */ (() => {
  class StandaloneService2 {
    constructor(_injector) {
      this._injector = _injector;
      this.cachedInjectors = /* @__PURE__ */ new Map();
    }
    getOrCreateStandaloneInjector(componentDef) {
      if (!componentDef.standalone) {
        return null;
      }
      if (!this.cachedInjectors.has(componentDef)) {
        const providers = internalImportProvidersFrom(false, componentDef.type);
        const standaloneInjector = providers.length > 0 ? createEnvironmentInjector([providers], this._injector, `Standalone[${componentDef.type.name}]`) : null;
        this.cachedInjectors.set(componentDef, standaloneInjector);
      }
      return this.cachedInjectors.get(componentDef);
    }
    ngOnDestroy() {
      try {
        for (const injector of this.cachedInjectors.values()) {
          if (injector !== null) {
            injector.destroy();
          }
        }
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: StandaloneService2,
        providedIn: "environment",
        factory: () => new StandaloneService2(\u0275\u0275inject(EnvironmentInjector))
      });
    }
  }
  return StandaloneService2;
})();
function \u0275\u0275StandaloneFeature(definition) {
  definition.getStandaloneInjector = (parentInjector) => {
    return parentInjector.get(StandaloneService).getOrCreateStandaloneInjector(definition);
  };
}
function getComponent(element) {
  ngDevMode && assertDomElement(element);
  const context2 = getLContext(element);
  if (context2 === null)
    return null;
  if (context2.component === void 0) {
    const lView = context2.lView;
    if (lView === null) {
      return null;
    }
    context2.component = getComponentAtNodeIndex(context2.nodeIndex, lView);
  }
  return context2.component;
}
function getContext(element) {
  assertDomElement(element);
  const context2 = getLContext(element);
  const lView = context2 ? context2.lView : null;
  return lView === null ? null : lView[CONTEXT];
}
function getOwningComponent(elementOrDir) {
  const context2 = getLContext(elementOrDir);
  let lView = context2 ? context2.lView : null;
  if (lView === null)
    return null;
  let parent;
  while (lView[TVIEW].type === 2 && (parent = getLViewParent(lView))) {
    lView = parent;
  }
  return lView[FLAGS] & 512 ? null : lView[CONTEXT];
}
function getRootComponents(elementOrDir) {
  const lView = readPatchedLView(elementOrDir);
  return lView !== null ? [getRootContext(lView)] : [];
}
function getInjector(elementOrDir) {
  const context2 = getLContext(elementOrDir);
  const lView = context2 ? context2.lView : null;
  if (lView === null)
    return Injector.NULL;
  const tNode = lView[TVIEW].data[context2.nodeIndex];
  return new NodeInjector(tNode, lView);
}
function getDirectives(node) {
  if (node instanceof Text) {
    return [];
  }
  const context2 = getLContext(node);
  const lView = context2 ? context2.lView : null;
  if (lView === null) {
    return [];
  }
  const tView = lView[TVIEW];
  const nodeIndex = context2.nodeIndex;
  if (!tView?.data[nodeIndex]) {
    return [];
  }
  if (context2.directives === void 0) {
    context2.directives = getDirectivesAtNodeIndex(nodeIndex, lView);
  }
  return context2.directives === null ? [] : [...context2.directives];
}
function getDirectiveMetadata$1(directiveOrComponentInstance) {
  const {
    constructor
  } = directiveOrComponentInstance;
  if (!constructor) {
    throw new Error("Unable to find the instance constructor");
  }
  const componentDef = getComponentDef(constructor);
  if (componentDef) {
    return {
      inputs: componentDef.inputs,
      outputs: componentDef.outputs,
      encapsulation: componentDef.encapsulation,
      changeDetection: componentDef.onPush ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
    };
  }
  const directiveDef = getDirectiveDef(constructor);
  if (directiveDef) {
    return {
      inputs: directiveDef.inputs,
      outputs: directiveDef.outputs
    };
  }
  return null;
}
function getHostElement(componentOrDirective) {
  return getLContext(componentOrDirective).native;
}
function getListeners(element) {
  ngDevMode && assertDomElement(element);
  const lContext = getLContext(element);
  const lView = lContext === null ? null : lContext.lView;
  if (lView === null)
    return [];
  const tView = lView[TVIEW];
  const lCleanup = lView[CLEANUP];
  const tCleanup = tView.cleanup;
  const listeners = [];
  if (tCleanup && lCleanup) {
    for (let i = 0; i < tCleanup.length; ) {
      const firstParam = tCleanup[i++];
      const secondParam = tCleanup[i++];
      if (typeof firstParam === "string") {
        const name = firstParam;
        const listenerElement = unwrapRNode(lView[secondParam]);
        const callback = lCleanup[tCleanup[i++]];
        const useCaptureOrIndx = tCleanup[i++];
        const type = typeof useCaptureOrIndx === "boolean" || useCaptureOrIndx >= 0 ? "dom" : "output";
        const useCapture = typeof useCaptureOrIndx === "boolean" ? useCaptureOrIndx : false;
        if (element == listenerElement) {
          listeners.push({
            element,
            name,
            callback,
            useCapture,
            type
          });
        }
      }
    }
  }
  listeners.sort(sortListeners);
  return listeners;
}
function sortListeners(a, b) {
  if (a.name == b.name)
    return 0;
  return a.name < b.name ? -1 : 1;
}
function assertDomElement(value) {
  if (typeof Element !== "undefined" && !(value instanceof Element)) {
    throw new Error("Expecting instance of DOM Element");
  }
}
function \u0275\u0275pureFunction0(slotOffset, pureFn, thisArg) {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  return lView[bindingIndex] === NO_CHANGE ? updateBinding(lView, bindingIndex, thisArg ? pureFn.call(thisArg) : pureFn()) : getBinding(lView, bindingIndex);
}
function getPureFunctionReturnValue(lView, returnValueIndex) {
  ngDevMode && assertIndexInRange(lView, returnValueIndex);
  const lastReturnValue = lView[returnValueIndex];
  return lastReturnValue === NO_CHANGE ? void 0 : lastReturnValue;
}
function pureFunction1Internal(lView, bindingRoot, slotOffset, pureFn, exp, thisArg) {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated(lView, bindingIndex, exp) ? updateBinding(lView, bindingIndex + 1, thisArg ? pureFn.call(thisArg, exp) : pureFn(exp)) : getPureFunctionReturnValue(lView, bindingIndex + 1);
}
function pureFunction2Internal(lView, bindingRoot, slotOffset, pureFn, exp1, exp2, thisArg) {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated2(lView, bindingIndex, exp1, exp2) ? updateBinding(lView, bindingIndex + 2, thisArg ? pureFn.call(thisArg, exp1, exp2) : pureFn(exp1, exp2)) : getPureFunctionReturnValue(lView, bindingIndex + 2);
}
function \u0275\u0275pipe(index, pipeName) {
  const tView = getTView();
  let pipeDef;
  const adjustedIndex = index + HEADER_OFFSET;
  if (tView.firstCreatePass) {
    pipeDef = getPipeDef(pipeName, tView.pipeRegistry);
    tView.data[adjustedIndex] = pipeDef;
    if (pipeDef.onDestroy) {
      (tView.destroyHooks ??= []).push(adjustedIndex, pipeDef.onDestroy);
    }
  } else {
    pipeDef = tView.data[adjustedIndex];
  }
  const pipeFactory = pipeDef.factory || (pipeDef.factory = getFactoryDef(pipeDef.type, true));
  let previousInjectorProfilerContext;
  if (ngDevMode) {
    previousInjectorProfilerContext = setInjectorProfilerContext({
      injector: new NodeInjector(getCurrentTNode(), getLView()),
      token: pipeDef.type
    });
  }
  const previousInjectImplementation = setInjectImplementation(\u0275\u0275directiveInject);
  try {
    const previousIncludeViewProviders = setIncludeViewProviders(false);
    const pipeInstance = pipeFactory();
    setIncludeViewProviders(previousIncludeViewProviders);
    store(tView, getLView(), adjustedIndex, pipeInstance);
    return pipeInstance;
  } finally {
    setInjectImplementation(previousInjectImplementation);
    ngDevMode && setInjectorProfilerContext(previousInjectorProfilerContext);
  }
}
function getPipeDef(name, registry) {
  if (registry) {
    if (ngDevMode) {
      const pipes = registry.filter((pipe2) => pipe2.name === name);
      if (pipes.length > 1) {
        console.warn(formatRuntimeError(313, getMultipleMatchingPipesMessage(name)));
      }
    }
    for (let i = registry.length - 1; i >= 0; i--) {
      const pipeDef = registry[i];
      if (name === pipeDef.name) {
        return pipeDef;
      }
    }
  }
  if (ngDevMode) {
    throw new RuntimeError(-302, getPipeNotFoundErrorMessage(name));
  }
}
function getMultipleMatchingPipesMessage(name) {
  const lView = getLView();
  const declarationLView = lView[DECLARATION_COMPONENT_VIEW];
  const context2 = declarationLView[CONTEXT];
  const hostIsStandalone = isHostComponentStandalone(lView);
  const componentInfoMessage = context2 ? ` in the '${context2.constructor.name}' component` : "";
  const verifyMessage = `check ${hostIsStandalone ? "'@Component.imports' of this component" : "the imports of this module"}`;
  const errorMessage = `Multiple pipes match the name \`${name}\`${componentInfoMessage}. ${verifyMessage}`;
  return errorMessage;
}
function getPipeNotFoundErrorMessage(name) {
  const lView = getLView();
  const declarationLView = lView[DECLARATION_COMPONENT_VIEW];
  const context2 = declarationLView[CONTEXT];
  const hostIsStandalone = isHostComponentStandalone(lView);
  const componentInfoMessage = context2 ? ` in the '${context2.constructor.name}' component` : "";
  const verifyMessage = `Verify that it is ${hostIsStandalone ? "included in the '@Component.imports' of this component" : "declared or imported in this module"}`;
  const errorMessage = `The pipe '${name}' could not be found${componentInfoMessage}. ${verifyMessage}`;
  return errorMessage;
}
function \u0275\u0275pipeBind1(index, slotOffset, v1) {
  const adjustedIndex = index + HEADER_OFFSET;
  const lView = getLView();
  const pipeInstance = load(lView, adjustedIndex);
  return isPure(lView, adjustedIndex) ? pureFunction1Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, pipeInstance) : pipeInstance.transform(v1);
}
function \u0275\u0275pipeBind2(index, slotOffset, v1, v2) {
  const adjustedIndex = index + HEADER_OFFSET;
  const lView = getLView();
  const pipeInstance = load(lView, adjustedIndex);
  return isPure(lView, adjustedIndex) ? pureFunction2Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, v2, pipeInstance) : pipeInstance.transform(v1, v2);
}
function isPure(lView, index) {
  return lView[TVIEW].data[index].pure;
}
function symbolIterator() {
  return this._results[Symbol.iterator]();
}
var QueryList = class _QueryList {
  static {
    Symbol.iterator;
  }
  /**
   * Returns `Observable` of `QueryList` notifying the subscriber of changes.
   */
  get changes() {
    return this._changes || (this._changes = new EventEmitter());
  }
  /**
   * @param emitDistinctChangesOnly Whether `QueryList.changes` should fire only when actual change
   *     has occurred. Or if it should fire when query is recomputed. (recomputing could resolve in
   *     the same result)
   */
  constructor(_emitDistinctChangesOnly = false) {
    this._emitDistinctChangesOnly = _emitDistinctChangesOnly;
    this.dirty = true;
    this._results = [];
    this._changesDetected = false;
    this._changes = null;
    this.length = 0;
    this.first = void 0;
    this.last = void 0;
    const proto = _QueryList.prototype;
    if (!proto[Symbol.iterator])
      proto[Symbol.iterator] = symbolIterator;
  }
  /**
   * Returns the QueryList entry at `index`.
   */
  get(index) {
    return this._results[index];
  }
  /**
   * See
   * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
   */
  map(fn) {
    return this._results.map(fn);
  }
  filter(fn) {
    return this._results.filter(fn);
  }
  /**
   * See
   * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
   */
  find(fn) {
    return this._results.find(fn);
  }
  /**
   * See
   * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
   */
  reduce(fn, init) {
    return this._results.reduce(fn, init);
  }
  /**
   * See
   * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
   */
  forEach(fn) {
    this._results.forEach(fn);
  }
  /**
   * See
   * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
   */
  some(fn) {
    return this._results.some(fn);
  }
  /**
   * Returns a copy of the internal results list as an Array.
   */
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  /**
   * Updates the stored data of the query list, and resets the `dirty` flag to `false`, so that
   * on change detection, it will not notify of changes to the queries, unless a new change
   * occurs.
   *
   * @param resultsTree The query results to store
   * @param identityAccessor Optional function for extracting stable object identity from a value
   *    in the array. This function is executed for each element of the query result list while
   *    comparing current query list with the new one (provided as a first argument of the `reset`
   *    function) to detect if the lists are different. If the function is not provided, elements
   *    are compared as is (without any pre-processing).
   */
  reset(resultsTree, identityAccessor) {
    const self = this;
    self.dirty = false;
    const newResultFlat = flatten(resultsTree);
    if (this._changesDetected = !arrayEquals(self._results, newResultFlat, identityAccessor)) {
      self._results = newResultFlat;
      self.length = newResultFlat.length;
      self.last = newResultFlat[this.length - 1];
      self.first = newResultFlat[0];
    }
  }
  /**
   * Triggers a change event by emitting on the `changes` {@link EventEmitter}.
   */
  notifyOnChanges() {
    if (this._changes && (this._changesDetected || !this._emitDistinctChangesOnly))
      this._changes.emit(this);
  }
  /** internal */
  setDirty() {
    this.dirty = true;
  }
  /** internal */
  destroy() {
    this.changes.complete();
    this.changes.unsubscribe();
  }
};
function createAndRenderEmbeddedLView(declarationLView, templateTNode, context2, options) {
  const embeddedTView = templateTNode.tView;
  ngDevMode && assertDefined(embeddedTView, "TView must be defined for a template node.");
  ngDevMode && assertTNodeForLView(templateTNode, declarationLView);
  const isSignalView = declarationLView[FLAGS] & 4096;
  const viewFlags = isSignalView ? 4096 : 16;
  const embeddedLView = createLView(declarationLView, embeddedTView, context2, viewFlags, null, templateTNode, null, null, null, options?.injector ?? null, options?.hydrationInfo ?? null);
  const declarationLContainer = declarationLView[templateTNode.index];
  ngDevMode && assertLContainer(declarationLContainer);
  embeddedLView[DECLARATION_LCONTAINER] = declarationLContainer;
  const declarationViewLQueries = declarationLView[QUERIES];
  if (declarationViewLQueries !== null) {
    embeddedLView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
  }
  renderView(embeddedTView, embeddedLView, context2);
  return embeddedLView;
}
function addLViewToLContainer(lContainer, lView, index, addToDOM = true) {
  const tView = lView[TVIEW];
  insertView(tView, lView, lContainer, index);
  if (addToDOM) {
    const beforeNode = getBeforeNodeForView(index, lContainer);
    const renderer = lView[RENDERER];
    const parentRNode = nativeParentNode(renderer, lContainer[NATIVE]);
    if (parentRNode !== null) {
      addViewToDOM(tView, lContainer[T_HOST], renderer, lView, parentRNode, beforeNode);
    }
  }
}
var TemplateRef = /* @__PURE__ */ (() => {
  class TemplateRef3 {
    static {
      this.__NG_ELEMENT_ID__ = injectTemplateRef;
    }
  }
  return TemplateRef3;
})();
var ViewEngineTemplateRef = TemplateRef;
var R3TemplateRef = class TemplateRef2 extends ViewEngineTemplateRef {
  constructor(_declarationLView, _declarationTContainer, elementRef) {
    super();
    this._declarationLView = _declarationLView;
    this._declarationTContainer = _declarationTContainer;
    this.elementRef = elementRef;
  }
  /**
   * Returns an `ssrId` associated with a TView, which was used to
   * create this instance of the `TemplateRef`.
   *
   * @internal
   */
  get ssrId() {
    return this._declarationTContainer.tView?.ssrId || null;
  }
  createEmbeddedView(context2, injector) {
    return this.createEmbeddedViewImpl(context2, injector);
  }
  /**
   * @internal
   */
  createEmbeddedViewImpl(context2, injector, hydrationInfo) {
    const embeddedLView = createAndRenderEmbeddedLView(this._declarationLView, this._declarationTContainer, context2, {
      injector,
      hydrationInfo
    });
    return new ViewRef$1(embeddedLView);
  }
};
function injectTemplateRef() {
  return createTemplateRef(getCurrentTNode(), getLView());
}
function createTemplateRef(hostTNode, hostLView) {
  if (hostTNode.type & 4) {
    ngDevMode && assertDefined(hostTNode.tView, "TView must be allocated");
    return new R3TemplateRef(hostLView, hostTNode, createElementRef(hostTNode, hostLView));
  }
  return null;
}
var _findMatchingDehydratedViewImpl = (lContainer, template) => null;
function findMatchingDehydratedView(lContainer, template) {
  return _findMatchingDehydratedViewImpl(lContainer, template);
}
var ViewContainerRef = /* @__PURE__ */ (() => {
  class ViewContainerRef3 {
    static {
      this.__NG_ELEMENT_ID__ = injectViewContainerRef;
    }
  }
  return ViewContainerRef3;
})();
function injectViewContainerRef() {
  const previousTNode = getCurrentTNode();
  return createContainerRef(previousTNode, getLView());
}
var VE_ViewContainerRef = ViewContainerRef;
var R3ViewContainerRef = class ViewContainerRef2 extends VE_ViewContainerRef {
  constructor(_lContainer, _hostTNode, _hostLView) {
    super();
    this._lContainer = _lContainer;
    this._hostTNode = _hostTNode;
    this._hostLView = _hostLView;
  }
  get element() {
    return createElementRef(this._hostTNode, this._hostLView);
  }
  get injector() {
    return new NodeInjector(this._hostTNode, this._hostLView);
  }
  /** @deprecated No replacement */
  get parentInjector() {
    const parentLocation = getParentInjectorLocation(this._hostTNode, this._hostLView);
    if (hasParentInjector(parentLocation)) {
      const parentView = getParentInjectorView(parentLocation, this._hostLView);
      const injectorIndex = getParentInjectorIndex(parentLocation);
      ngDevMode && assertNodeInjector(parentView, injectorIndex);
      const parentTNode = parentView[TVIEW].data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ];
      return new NodeInjector(parentTNode, parentView);
    } else {
      return new NodeInjector(null, this._hostLView);
    }
  }
  clear() {
    while (this.length > 0) {
      this.remove(this.length - 1);
    }
  }
  get(index) {
    const viewRefs = getViewRefs(this._lContainer);
    return viewRefs !== null && viewRefs[index] || null;
  }
  get length() {
    return this._lContainer.length - CONTAINER_HEADER_OFFSET;
  }
  createEmbeddedView(templateRef, context2, indexOrOptions) {
    let index;
    let injector;
    if (typeof indexOrOptions === "number") {
      index = indexOrOptions;
    } else if (indexOrOptions != null) {
      index = indexOrOptions.index;
      injector = indexOrOptions.injector;
    }
    const hydrationInfo = findMatchingDehydratedView(this._lContainer, templateRef.ssrId);
    const viewRef = templateRef.createEmbeddedViewImpl(context2 || {}, injector, hydrationInfo);
    const skipDomInsertion = !!hydrationInfo && !hasInSkipHydrationBlockFlag(this._hostTNode);
    this.insertImpl(viewRef, index, skipDomInsertion);
    return viewRef;
  }
  createComponent(componentFactoryOrType, indexOrOptions, injector, projectableNodes, environmentInjector) {
    const isComponentFactory = componentFactoryOrType && !isType(componentFactoryOrType);
    let index;
    if (isComponentFactory) {
      if (ngDevMode) {
        assertEqual(typeof indexOrOptions !== "object", true, "It looks like Component factory was provided as the first argument and an options object as the second argument. This combination of arguments is incompatible. You can either change the first argument to provide Component type or change the second argument to be a number (representing an index at which to insert the new component's host view into this container)");
      }
      index = indexOrOptions;
    } else {
      if (ngDevMode) {
        assertDefined(getComponentDef(componentFactoryOrType), `Provided Component class doesn't contain Component definition. Please check whether provided class has @Component decorator.`);
        assertEqual(typeof indexOrOptions !== "number", true, "It looks like Component type was provided as the first argument and a number (representing an index at which to insert the new component's host view into this container as the second argument. This combination of arguments is incompatible. Please use an object as the second argument instead.");
      }
      const options = indexOrOptions || {};
      if (ngDevMode && options.environmentInjector && options.ngModuleRef) {
        throwError2(`Cannot pass both environmentInjector and ngModuleRef options to createComponent().`);
      }
      index = options.index;
      injector = options.injector;
      projectableNodes = options.projectableNodes;
      environmentInjector = options.environmentInjector || options.ngModuleRef;
    }
    const componentFactory = isComponentFactory ? componentFactoryOrType : new ComponentFactory(getComponentDef(componentFactoryOrType));
    const contextInjector = injector || this.parentInjector;
    if (!environmentInjector && componentFactory.ngModule == null) {
      const _injector = isComponentFactory ? contextInjector : this.parentInjector;
      const result = _injector.get(EnvironmentInjector, null);
      if (result) {
        environmentInjector = result;
      }
    }
    const componentDef = getComponentDef(componentFactory.componentType ?? {});
    const dehydratedView = findMatchingDehydratedView(this._lContainer, componentDef?.id ?? null);
    const rNode = dehydratedView?.firstChild ?? null;
    const componentRef = componentFactory.create(contextInjector, projectableNodes, rNode, environmentInjector);
    const skipDomInsertion = !!dehydratedView && !hasInSkipHydrationBlockFlag(this._hostTNode);
    this.insertImpl(componentRef.hostView, index, skipDomInsertion);
    return componentRef;
  }
  insert(viewRef, index) {
    return this.insertImpl(viewRef, index, false);
  }
  insertImpl(viewRef, index, skipDomInsertion) {
    const lView = viewRef._lView;
    const tView = lView[TVIEW];
    if (ngDevMode && viewRef.destroyed) {
      throw new Error("Cannot insert a destroyed View in a ViewContainer!");
    }
    if (viewAttachedToContainer(lView)) {
      const prevIdx = this.indexOf(viewRef);
      if (prevIdx !== -1) {
        this.detach(prevIdx);
      } else {
        const prevLContainer = lView[PARENT];
        ngDevMode && assertEqual(isLContainer(prevLContainer), true, "An attached view should have its PARENT point to a container.");
        const prevVCRef = new R3ViewContainerRef(prevLContainer, prevLContainer[T_HOST], prevLContainer[PARENT]);
        prevVCRef.detach(prevVCRef.indexOf(viewRef));
      }
    }
    const adjustedIdx = this._adjustIndex(index);
    const lContainer = this._lContainer;
    addLViewToLContainer(lContainer, lView, adjustedIdx, !skipDomInsertion);
    viewRef.attachToViewContainerRef();
    addToArray(getOrCreateViewRefs(lContainer), adjustedIdx, viewRef);
    return viewRef;
  }
  move(viewRef, newIndex) {
    if (ngDevMode && viewRef.destroyed) {
      throw new Error("Cannot move a destroyed View in a ViewContainer!");
    }
    return this.insert(viewRef, newIndex);
  }
  indexOf(viewRef) {
    const viewRefsArr = getViewRefs(this._lContainer);
    return viewRefsArr !== null ? viewRefsArr.indexOf(viewRef) : -1;
  }
  remove(index) {
    const adjustedIdx = this._adjustIndex(index, -1);
    const detachedView = detachView(this._lContainer, adjustedIdx);
    if (detachedView) {
      removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx);
      destroyLView(detachedView[TVIEW], detachedView);
    }
  }
  detach(index) {
    const adjustedIdx = this._adjustIndex(index, -1);
    const view = detachView(this._lContainer, adjustedIdx);
    const wasDetached = view && removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx) != null;
    return wasDetached ? new ViewRef$1(view) : null;
  }
  _adjustIndex(index, shift = 0) {
    if (index == null) {
      return this.length + shift;
    }
    if (ngDevMode) {
      assertGreaterThan(index, -1, `ViewRef index must be positive, got ${index}`);
      assertLessThan(index, this.length + 1 + shift, "index");
    }
    return index;
  }
};
function getViewRefs(lContainer) {
  return lContainer[VIEW_REFS];
}
function getOrCreateViewRefs(lContainer) {
  return lContainer[VIEW_REFS] || (lContainer[VIEW_REFS] = []);
}
function createContainerRef(hostTNode, hostLView) {
  ngDevMode && assertTNodeType(
    hostTNode,
    12 | 3
    /* TNodeType.AnyRNode */
  );
  let lContainer;
  const slotValue = hostLView[hostTNode.index];
  if (isLContainer(slotValue)) {
    lContainer = slotValue;
  } else {
    lContainer = createLContainer(slotValue, hostLView, null, hostTNode);
    hostLView[hostTNode.index] = lContainer;
    addToViewTree(hostLView, lContainer);
  }
  _locateOrCreateAnchorNode(lContainer, hostLView, hostTNode, slotValue);
  return new R3ViewContainerRef(lContainer, hostTNode, hostLView);
}
function insertAnchorNode(hostLView, hostTNode) {
  const renderer = hostLView[RENDERER];
  ngDevMode && ngDevMode.rendererCreateComment++;
  const commentNode = renderer.createComment(ngDevMode ? "container" : "");
  const hostNative = getNativeByTNode(hostTNode, hostLView);
  const parentOfHostNative = nativeParentNode(renderer, hostNative);
  nativeInsertBefore(renderer, parentOfHostNative, commentNode, nativeNextSibling(renderer, hostNative), false);
  return commentNode;
}
var _locateOrCreateAnchorNode = createAnchorNode;
function createAnchorNode(lContainer, hostLView, hostTNode, slotValue) {
  if (lContainer[NATIVE])
    return;
  let commentNode;
  if (hostTNode.type & 8) {
    commentNode = unwrapRNode(slotValue);
  } else {
    commentNode = insertAnchorNode(hostLView, hostTNode);
  }
  lContainer[NATIVE] = commentNode;
}
var LQuery_ = class _LQuery_ {
  constructor(queryList) {
    this.queryList = queryList;
    this.matches = null;
  }
  clone() {
    return new _LQuery_(this.queryList);
  }
  setDirty() {
    this.queryList.setDirty();
  }
};
var LQueries_ = class _LQueries_ {
  constructor(queries = []) {
    this.queries = queries;
  }
  createEmbeddedView(tView) {
    const tQueries = tView.queries;
    if (tQueries !== null) {
      const noOfInheritedQueries = tView.contentQueries !== null ? tView.contentQueries[0] : tQueries.length;
      const viewLQueries = [];
      for (let i = 0; i < noOfInheritedQueries; i++) {
        const tQuery = tQueries.getByIndex(i);
        const parentLQuery = this.queries[tQuery.indexInDeclarationView];
        viewLQueries.push(parentLQuery.clone());
      }
      return new _LQueries_(viewLQueries);
    }
    return null;
  }
  insertView(tView) {
    this.dirtyQueriesWithMatches(tView);
  }
  detachView(tView) {
    this.dirtyQueriesWithMatches(tView);
  }
  dirtyQueriesWithMatches(tView) {
    for (let i = 0; i < this.queries.length; i++) {
      if (getTQuery(tView, i).matches !== null) {
        this.queries[i].setDirty();
      }
    }
  }
};
var TQueryMetadata_ = class {
  constructor(predicate, flags, read = null) {
    this.predicate = predicate;
    this.flags = flags;
    this.read = read;
  }
};
var TQueries_ = class _TQueries_ {
  constructor(queries = []) {
    this.queries = queries;
  }
  elementStart(tView, tNode) {
    ngDevMode && assertFirstCreatePass(tView, "Queries should collect results on the first template pass only");
    for (let i = 0; i < this.queries.length; i++) {
      this.queries[i].elementStart(tView, tNode);
    }
  }
  elementEnd(tNode) {
    for (let i = 0; i < this.queries.length; i++) {
      this.queries[i].elementEnd(tNode);
    }
  }
  embeddedTView(tNode) {
    let queriesForTemplateRef = null;
    for (let i = 0; i < this.length; i++) {
      const childQueryIndex = queriesForTemplateRef !== null ? queriesForTemplateRef.length : 0;
      const tqueryClone = this.getByIndex(i).embeddedTView(tNode, childQueryIndex);
      if (tqueryClone) {
        tqueryClone.indexInDeclarationView = i;
        if (queriesForTemplateRef !== null) {
          queriesForTemplateRef.push(tqueryClone);
        } else {
          queriesForTemplateRef = [tqueryClone];
        }
      }
    }
    return queriesForTemplateRef !== null ? new _TQueries_(queriesForTemplateRef) : null;
  }
  template(tView, tNode) {
    ngDevMode && assertFirstCreatePass(tView, "Queries should collect results on the first template pass only");
    for (let i = 0; i < this.queries.length; i++) {
      this.queries[i].template(tView, tNode);
    }
  }
  getByIndex(index) {
    ngDevMode && assertIndexInRange(this.queries, index);
    return this.queries[index];
  }
  get length() {
    return this.queries.length;
  }
  track(tquery) {
    this.queries.push(tquery);
  }
};
var TQuery_ = class _TQuery_ {
  constructor(metadata, nodeIndex = -1) {
    this.metadata = metadata;
    this.matches = null;
    this.indexInDeclarationView = -1;
    this.crossesNgTemplate = false;
    this._appliesToNextNode = true;
    this._declarationNodeIndex = nodeIndex;
  }
  elementStart(tView, tNode) {
    if (this.isApplyingToNode(tNode)) {
      this.matchTNode(tView, tNode);
    }
  }
  elementEnd(tNode) {
    if (this._declarationNodeIndex === tNode.index) {
      this._appliesToNextNode = false;
    }
  }
  template(tView, tNode) {
    this.elementStart(tView, tNode);
  }
  embeddedTView(tNode, childQueryIndex) {
    if (this.isApplyingToNode(tNode)) {
      this.crossesNgTemplate = true;
      this.addMatch(-tNode.index, childQueryIndex);
      return new _TQuery_(this.metadata);
    }
    return null;
  }
  isApplyingToNode(tNode) {
    if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
      const declarationNodeIdx = this._declarationNodeIndex;
      let parent = tNode.parent;
      while (parent !== null && parent.type & 8 && parent.index !== declarationNodeIdx) {
        parent = parent.parent;
      }
      return declarationNodeIdx === (parent !== null ? parent.index : -1);
    }
    return this._appliesToNextNode;
  }
  matchTNode(tView, tNode) {
    const predicate = this.metadata.predicate;
    if (Array.isArray(predicate)) {
      for (let i = 0; i < predicate.length; i++) {
        const name = predicate[i];
        this.matchTNodeWithReadOption(tView, tNode, getIdxOfMatchingSelector(tNode, name));
        this.matchTNodeWithReadOption(tView, tNode, locateDirectiveOrProvider(tNode, tView, name, false, false));
      }
    } else {
      if (predicate === TemplateRef) {
        if (tNode.type & 4) {
          this.matchTNodeWithReadOption(tView, tNode, -1);
        }
      } else {
        this.matchTNodeWithReadOption(tView, tNode, locateDirectiveOrProvider(tNode, tView, predicate, false, false));
      }
    }
  }
  matchTNodeWithReadOption(tView, tNode, nodeMatchIdx) {
    if (nodeMatchIdx !== null) {
      const read = this.metadata.read;
      if (read !== null) {
        if (read === ElementRef || read === ViewContainerRef || read === TemplateRef && tNode.type & 4) {
          this.addMatch(tNode.index, -2);
        } else {
          const directiveOrProviderIdx = locateDirectiveOrProvider(tNode, tView, read, false, false);
          if (directiveOrProviderIdx !== null) {
            this.addMatch(tNode.index, directiveOrProviderIdx);
          }
        }
      } else {
        this.addMatch(tNode.index, nodeMatchIdx);
      }
    }
  }
  addMatch(tNodeIdx, matchIdx) {
    if (this.matches === null) {
      this.matches = [tNodeIdx, matchIdx];
    } else {
      this.matches.push(tNodeIdx, matchIdx);
    }
  }
};
function getIdxOfMatchingSelector(tNode, selector) {
  const localNames = tNode.localNames;
  if (localNames !== null) {
    for (let i = 0; i < localNames.length; i += 2) {
      if (localNames[i] === selector) {
        return localNames[i + 1];
      }
    }
  }
  return null;
}
function createResultByTNodeType(tNode, currentView) {
  if (tNode.type & (3 | 8)) {
    return createElementRef(tNode, currentView);
  } else if (tNode.type & 4) {
    return createTemplateRef(tNode, currentView);
  }
  return null;
}
function createResultForNode(lView, tNode, matchingIdx, read) {
  if (matchingIdx === -1) {
    return createResultByTNodeType(tNode, lView);
  } else if (matchingIdx === -2) {
    return createSpecialToken(lView, tNode, read);
  } else {
    return getNodeInjectable(lView, lView[TVIEW], matchingIdx, tNode);
  }
}
function createSpecialToken(lView, tNode, read) {
  if (read === ElementRef) {
    return createElementRef(tNode, lView);
  } else if (read === TemplateRef) {
    return createTemplateRef(tNode, lView);
  } else if (read === ViewContainerRef) {
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12
      /* TNodeType.AnyContainer */
    );
    return createContainerRef(tNode, lView);
  } else {
    ngDevMode && throwError2(`Special token to read should be one of ElementRef, TemplateRef or ViewContainerRef but got ${stringify(read)}.`);
  }
}
function materializeViewResults(tView, lView, tQuery, queryIndex) {
  const lQuery = lView[QUERIES].queries[queryIndex];
  if (lQuery.matches === null) {
    const tViewData = tView.data;
    const tQueryMatches = tQuery.matches;
    const result = [];
    for (let i = 0; i < tQueryMatches.length; i += 2) {
      const matchedNodeIdx = tQueryMatches[i];
      if (matchedNodeIdx < 0) {
        result.push(null);
      } else {
        ngDevMode && assertIndexInRange(tViewData, matchedNodeIdx);
        const tNode = tViewData[matchedNodeIdx];
        result.push(createResultForNode(lView, tNode, tQueryMatches[i + 1], tQuery.metadata.read));
      }
    }
    lQuery.matches = result;
  }
  return lQuery.matches;
}
function collectQueryResults(tView, lView, queryIndex, result) {
  const tQuery = tView.queries.getByIndex(queryIndex);
  const tQueryMatches = tQuery.matches;
  if (tQueryMatches !== null) {
    const lViewResults = materializeViewResults(tView, lView, tQuery, queryIndex);
    for (let i = 0; i < tQueryMatches.length; i += 2) {
      const tNodeIdx = tQueryMatches[i];
      if (tNodeIdx > 0) {
        result.push(lViewResults[i / 2]);
      } else {
        const childQueryIndex = tQueryMatches[i + 1];
        const declarationLContainer = lView[-tNodeIdx];
        ngDevMode && assertLContainer(declarationLContainer);
        for (let i2 = CONTAINER_HEADER_OFFSET; i2 < declarationLContainer.length; i2++) {
          const embeddedLView = declarationLContainer[i2];
          if (embeddedLView[DECLARATION_LCONTAINER] === embeddedLView[PARENT]) {
            collectQueryResults(embeddedLView[TVIEW], embeddedLView, childQueryIndex, result);
          }
        }
        if (declarationLContainer[MOVED_VIEWS] !== null) {
          const embeddedLViews = declarationLContainer[MOVED_VIEWS];
          for (let i2 = 0; i2 < embeddedLViews.length; i2++) {
            const embeddedLView = embeddedLViews[i2];
            collectQueryResults(embeddedLView[TVIEW], embeddedLView, childQueryIndex, result);
          }
        }
      }
    }
  }
  return result;
}
function \u0275\u0275queryRefresh(queryList) {
  const lView = getLView();
  const tView = getTView();
  const queryIndex = getCurrentQueryIndex();
  setCurrentQueryIndex(queryIndex + 1);
  const tQuery = getTQuery(tView, queryIndex);
  if (queryList.dirty && isCreationMode(lView) === ((tQuery.metadata.flags & 2) === 2)) {
    if (tQuery.matches === null) {
      queryList.reset([]);
    } else {
      const result = tQuery.crossesNgTemplate ? collectQueryResults(tView, lView, queryIndex, []) : materializeViewResults(tView, lView, tQuery, queryIndex);
      queryList.reset(result, unwrapElementRef);
      queryList.notifyOnChanges();
    }
    return true;
  }
  return false;
}
function \u0275\u0275contentQuery(directiveIndex, predicate, flags, read) {
  ngDevMode && assertNumber(flags, "Expecting flags");
  const tView = getTView();
  if (tView.firstCreatePass) {
    const tNode = getCurrentTNode();
    createTQuery(tView, new TQueryMetadata_(predicate, flags, read), tNode.index);
    saveContentQueryAndDirectiveIndex(tView, directiveIndex);
    if ((flags & 2) === 2) {
      tView.staticContentQueries = true;
    }
  }
  createLQuery(tView, getLView(), flags);
}
function \u0275\u0275loadQuery() {
  return loadQueryInternal(getLView(), getCurrentQueryIndex());
}
function loadQueryInternal(lView, queryIndex) {
  ngDevMode && assertDefined(lView[QUERIES], "LQueries should be defined when trying to load a query");
  ngDevMode && assertIndexInRange(lView[QUERIES].queries, queryIndex);
  return lView[QUERIES].queries[queryIndex].queryList;
}
function createLQuery(tView, lView, flags) {
  const queryList = new QueryList(
    (flags & 4) === 4
    /* QueryFlags.emitDistinctChangesOnly */
  );
  storeCleanupWithContext(tView, lView, queryList, queryList.destroy);
  if (lView[QUERIES] === null)
    lView[QUERIES] = new LQueries_();
  lView[QUERIES].queries.push(new LQuery_(queryList));
}
function createTQuery(tView, metadata, nodeIndex) {
  if (tView.queries === null)
    tView.queries = new TQueries_();
  tView.queries.track(new TQuery_(metadata, nodeIndex));
}
function saveContentQueryAndDirectiveIndex(tView, directiveIndex) {
  const tViewContentQueries = tView.contentQueries || (tView.contentQueries = []);
  const lastSavedDirectiveIndex = tViewContentQueries.length ? tViewContentQueries[tViewContentQueries.length - 1] : -1;
  if (directiveIndex !== lastSavedDirectiveIndex) {
    tViewContentQueries.push(tView.queries.length - 1, directiveIndex);
  }
}
function getTQuery(tView, index) {
  ngDevMode && assertDefined(tView.queries, "TQueries must be defined to retrieve a TQuery");
  return tView.queries.getByIndex(index);
}
function \u0275\u0275templateRefExtractor(tNode, lView) {
  return createTemplateRef(tNode, lView);
}
function isNgModule(value) {
  return !!getNgModuleDef(value);
}
var APP_INITIALIZER = /* @__PURE__ */ new InjectionToken("Application Initializer");
var ApplicationInitStatus = /* @__PURE__ */ (() => {
  class ApplicationInitStatus2 {
    constructor() {
      this.initialized = false;
      this.done = false;
      this.donePromise = new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
      });
      this.appInits = inject(APP_INITIALIZER, {
        optional: true
      }) ?? [];
      if ((typeof ngDevMode === "undefined" || ngDevMode) && !Array.isArray(this.appInits)) {
        throw new RuntimeError(-209, `Unexpected type of the \`APP_INITIALIZER\` token value (expected an array, but got ${typeof this.appInits}). Please check that the \`APP_INITIALIZER\` token is configured as a \`multi: true\` provider.`);
      }
    }
    /** @internal */
    runInitializers() {
      if (this.initialized) {
        return;
      }
      const asyncInitPromises = [];
      for (const appInits of this.appInits) {
        const initResult = appInits();
        if (isPromise2(initResult)) {
          asyncInitPromises.push(initResult);
        } else if (isSubscribable(initResult)) {
          const observableAsPromise = new Promise((resolve, reject) => {
            initResult.subscribe({
              complete: resolve,
              error: reject
            });
          });
          asyncInitPromises.push(observableAsPromise);
        }
      }
      const complete = () => {
        this.done = true;
        this.resolve();
      };
      Promise.all(asyncInitPromises).then(() => {
        complete();
      }).catch((e) => {
        this.reject(e);
      });
      if (asyncInitPromises.length === 0) {
        complete();
      }
      this.initialized = true;
    }
    static {
      this.\u0275fac = function ApplicationInitStatus_Factory(t) {
        return new (t || ApplicationInitStatus2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: ApplicationInitStatus2,
        factory: ApplicationInitStatus2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return ApplicationInitStatus2;
})();
var Console = /* @__PURE__ */ (() => {
  class Console2 {
    log(message) {
      console.log(message);
    }
    // Note: for reporting errors use `DOM.logError()` as it is platform specific
    warn(message) {
      console.warn(message);
    }
    static {
      this.\u0275fac = function Console_Factory(t) {
        return new (t || Console2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: Console2,
        factory: Console2.\u0275fac,
        providedIn: "platform"
      });
    }
  }
  return Console2;
})();
function getGlobalLocale() {
  if (false) {
    return goog.LOCALE;
  } else {
    return typeof $localize !== "undefined" && $localize.locale || DEFAULT_LOCALE_ID;
  }
}
var LOCALE_ID = /* @__PURE__ */ new InjectionToken("LocaleId", {
  providedIn: "root",
  factory: () => inject(LOCALE_ID, InjectFlags.Optional | InjectFlags.SkipSelf) || getGlobalLocale()
});
var InitialRenderPendingTasks = /* @__PURE__ */ (() => {
  class InitialRenderPendingTasks2 {
    constructor() {
      this.taskId = 0;
      this.pendingTasks = /* @__PURE__ */ new Set();
      this.hasPendingTasks = new BehaviorSubject(false);
    }
    add() {
      this.hasPendingTasks.next(true);
      const taskId = this.taskId++;
      this.pendingTasks.add(taskId);
      return taskId;
    }
    remove(taskId) {
      this.pendingTasks.delete(taskId);
      if (this.pendingTasks.size === 0) {
        this.hasPendingTasks.next(false);
      }
    }
    ngOnDestroy() {
      this.pendingTasks.clear();
      this.hasPendingTasks.next(false);
    }
    static {
      this.\u0275fac = function InitialRenderPendingTasks_Factory(t) {
        return new (t || InitialRenderPendingTasks2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: InitialRenderPendingTasks2,
        factory: InitialRenderPendingTasks2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return InitialRenderPendingTasks2;
})();
var ModuleWithComponentFactories = class {
  constructor(ngModuleFactory, componentFactories) {
    this.ngModuleFactory = ngModuleFactory;
    this.componentFactories = componentFactories;
  }
};
var Compiler = /* @__PURE__ */ (() => {
  class Compiler2 {
    /**
     * Compiles the given NgModule and all of its components. All templates of the components
     * have to be inlined.
     */
    compileModuleSync(moduleType) {
      return new NgModuleFactory(moduleType);
    }
    /**
     * Compiles the given NgModule and all of its components
     */
    compileModuleAsync(moduleType) {
      return Promise.resolve(this.compileModuleSync(moduleType));
    }
    /**
     * Same as {@link #compileModuleSync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsSync(moduleType) {
      const ngModuleFactory = this.compileModuleSync(moduleType);
      const moduleDef = getNgModuleDef(moduleType);
      const componentFactories = maybeUnwrapFn(moduleDef.declarations).reduce((factories, declaration) => {
        const componentDef = getComponentDef(declaration);
        componentDef && factories.push(new ComponentFactory(componentDef));
        return factories;
      }, []);
      return new ModuleWithComponentFactories(ngModuleFactory, componentFactories);
    }
    /**
     * Same as {@link #compileModuleAsync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsAsync(moduleType) {
      return Promise.resolve(this.compileModuleAndAllComponentsSync(moduleType));
    }
    /**
     * Clears all caches.
     */
    clearCache() {
    }
    /**
     * Clears the cache for the given component/ngModule.
     */
    clearCacheFor(type) {
    }
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     */
    getModuleId(moduleType) {
      return void 0;
    }
    static {
      this.\u0275fac = function Compiler_Factory(t) {
        return new (t || Compiler2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: Compiler2,
        factory: Compiler2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return Compiler2;
})();
var DIDebugData = class {
  constructor() {
    this.resolverToTokenToDependencies = /* @__PURE__ */ new WeakMap();
    this.resolverToProviders = /* @__PURE__ */ new WeakMap();
    this.standaloneInjectorToComponent = /* @__PURE__ */ new WeakMap();
  }
  reset() {
    this.resolverToTokenToDependencies = /* @__PURE__ */ new WeakMap();
    this.resolverToProviders = /* @__PURE__ */ new WeakMap();
    this.standaloneInjectorToComponent = /* @__PURE__ */ new WeakMap();
  }
};
var frameworkDIDebugData = /* @__PURE__ */ new DIDebugData();
function getFrameworkDIDebugData() {
  return frameworkDIDebugData;
}
function setupFrameworkInjectorProfiler() {
  frameworkDIDebugData.reset();
  setInjectorProfiler((injectorProfilerEvent) => handleInjectorProfilerEvent(injectorProfilerEvent));
}
function handleInjectorProfilerEvent(injectorProfilerEvent) {
  const {
    context: context2,
    type
  } = injectorProfilerEvent;
  if (type === 0) {
    handleInjectEvent(context2, injectorProfilerEvent.service);
  } else if (type === 1) {
    handleInstanceCreatedByInjectorEvent(context2, injectorProfilerEvent.instance);
  } else if (type === 2) {
    handleProviderConfiguredEvent(context2, injectorProfilerEvent.providerRecord);
  }
}
function handleInjectEvent(context2, data) {
  const diResolver = getDIResolver(context2.injector);
  if (diResolver === null) {
    throwError2("An Inject event must be run within an injection context.");
  }
  const diResolverToInstantiatedToken = frameworkDIDebugData.resolverToTokenToDependencies;
  if (!diResolverToInstantiatedToken.has(diResolver)) {
    diResolverToInstantiatedToken.set(diResolver, /* @__PURE__ */ new WeakMap());
  }
  if (!canBeHeldWeakly(context2.token)) {
    return;
  }
  const instantiatedTokenToDependencies = diResolverToInstantiatedToken.get(diResolver);
  if (!instantiatedTokenToDependencies.has(context2.token)) {
    instantiatedTokenToDependencies.set(context2.token, []);
  }
  const {
    token,
    value,
    flags
  } = data;
  instantiatedTokenToDependencies.get(context2.token).push({
    token,
    value,
    flags
  });
}
function handleInstanceCreatedByInjectorEvent(context2, data) {
  const {
    value
  } = data;
  if (getDIResolver(context2.injector) === null) {
    throwError2("An InjectorCreatedInstance event must be run within an injection context.");
  }
  let standaloneComponent = void 0;
  if (typeof value === "object") {
    standaloneComponent = value?.constructor;
  }
  if (standaloneComponent === void 0 || !isStandaloneComponent(standaloneComponent)) {
    return;
  }
  const environmentInjector = context2.injector.get(EnvironmentInjector, null, {
    optional: true
  });
  if (environmentInjector === null) {
    return;
  }
  const {
    standaloneInjectorToComponent
  } = frameworkDIDebugData;
  if (standaloneInjectorToComponent.has(environmentInjector)) {
    return;
  }
  standaloneInjectorToComponent.set(environmentInjector, standaloneComponent);
}
function isStandaloneComponent(value) {
  const def = getComponentDef(value);
  return !!def?.standalone;
}
function handleProviderConfiguredEvent(context2, data) {
  const {
    resolverToProviders
  } = frameworkDIDebugData;
  const diResolver = getDIResolver(context2?.injector);
  if (diResolver === null) {
    throwError2("A ProviderConfigured event must be run within an injection context.");
  }
  if (!resolverToProviders.has(diResolver)) {
    resolverToProviders.set(diResolver, []);
  }
  resolverToProviders.get(diResolver).push(data);
}
function getDIResolver(injector) {
  let diResolver = null;
  if (injector === void 0) {
    return diResolver;
  }
  if (injector instanceof NodeInjector) {
    diResolver = getNodeInjectorLView(injector);
  } else {
    diResolver = injector;
  }
  return diResolver;
}
function canBeHeldWeakly(value) {
  return value !== null && (typeof value === "object" || typeof value === "function" || typeof value === "symbol");
}
function applyChanges(component) {
  ngDevMode && assertDefined(component, "component");
  markViewDirty(getComponentViewByInstance(component));
  getRootComponents(component).forEach((rootComponent) => detectChanges(rootComponent));
}
function getDependenciesFromInjectable(injector, token) {
  const instance = injector.get(token, null, {
    self: true,
    optional: true
  });
  if (instance === null) {
    throw new Error(`Unable to determine instance of ${token} in given injector`);
  }
  let diResolver = injector;
  if (injector instanceof NodeInjector) {
    diResolver = getNodeInjectorLView(injector);
  }
  const {
    resolverToTokenToDependencies
  } = getFrameworkDIDebugData();
  let dependencies = resolverToTokenToDependencies.get(diResolver)?.get?.(token) ?? [];
  const resolutionPath = getInjectorResolutionPath(injector);
  dependencies = dependencies.map((dep) => {
    const flags = dep.flags;
    dep.flags = {
      optional: (8 & flags) === 8,
      host: (1 & flags) === 1,
      self: (2 & flags) === 2,
      skipSelf: (4 & flags) === 4
      /* InternalInjectFlags.SkipSelf */
    };
    for (let i = 0; i < resolutionPath.length; i++) {
      const injectorToCheck = resolutionPath[i];
      if (i === 0 && dep.flags.skipSelf) {
        continue;
      }
      if (dep.flags.host && injectorToCheck instanceof EnvironmentInjector) {
        break;
      }
      const instance2 = injectorToCheck.get(dep.token, null, {
        self: true,
        optional: true
      });
      if (instance2 !== null) {
        if (dep.flags.host) {
          const firstInjector = resolutionPath[0];
          const lookupFromFirstInjector = firstInjector.get(dep.token, null, __spreadProps(__spreadValues({}, dep.flags), {
            optional: true
          }));
          if (lookupFromFirstInjector !== null) {
            dep.providedIn = injectorToCheck;
          }
          break;
        }
        dep.providedIn = injectorToCheck;
        break;
      }
      if (i === 0 && dep.flags.self) {
        break;
      }
    }
    return dep;
  });
  return {
    instance,
    dependencies
  };
}
function getProviderImportsContainer(injector) {
  const {
    standaloneInjectorToComponent
  } = getFrameworkDIDebugData();
  if (standaloneInjectorToComponent.has(injector)) {
    return standaloneInjectorToComponent.get(injector);
  }
  const defTypeRef = injector.get(NgModuleRef$1, null, {
    self: true,
    optional: true
  });
  if (defTypeRef === null) {
    return null;
  }
  if (defTypeRef.instance === null) {
    return null;
  }
  return defTypeRef.instance.constructor;
}
function getNodeInjectorProviders(injector) {
  const diResolver = getNodeInjectorLView(injector);
  const {
    resolverToProviders
  } = getFrameworkDIDebugData();
  return resolverToProviders.get(diResolver) ?? [];
}
function getProviderImportPaths(providerImportsContainer) {
  const providerToPath = /* @__PURE__ */ new Map();
  const visitedContainers = /* @__PURE__ */ new Set();
  const visitor = walkProviderTreeToDiscoverImportPaths(providerToPath, visitedContainers);
  walkProviderTree(providerImportsContainer, visitor, [], /* @__PURE__ */ new Set());
  return providerToPath;
}
function walkProviderTreeToDiscoverImportPaths(providerToPath, visitedContainers) {
  return (provider, container) => {
    if (!providerToPath.has(provider)) {
      providerToPath.set(provider, [container]);
    }
    if (!visitedContainers.has(container)) {
      for (const prov of providerToPath.keys()) {
        const existingImportPath = providerToPath.get(prov);
        let containerDef = getInjectorDef(container);
        if (!containerDef) {
          const ngModule = container.ngModule;
          containerDef = getInjectorDef(ngModule);
        }
        if (!containerDef) {
          return;
        }
        const lastContainerAddedToPath = existingImportPath[0];
        let isNextStepInPath = false;
        deepForEach(containerDef.imports, (moduleImport) => {
          if (isNextStepInPath) {
            return;
          }
          isNextStepInPath = moduleImport.ngModule === lastContainerAddedToPath || moduleImport === lastContainerAddedToPath;
          if (isNextStepInPath) {
            providerToPath.get(prov)?.unshift(container);
          }
        });
      }
    }
    visitedContainers.add(container);
  };
}
function getEnvironmentInjectorProviders(injector) {
  const providerRecords = getFrameworkDIDebugData().resolverToProviders.get(injector) ?? [];
  if (isPlatformInjector(injector)) {
    return providerRecords;
  }
  const providerImportsContainer = getProviderImportsContainer(injector);
  if (providerImportsContainer === null) {
    if (isRootInjector(injector)) {
      return providerRecords;
    }
    throwError2("Could not determine where injector providers were configured.");
  }
  const providerToPath = getProviderImportPaths(providerImportsContainer);
  return providerRecords.map((providerRecord) => {
    let importPath = providerToPath.get(providerRecord.provider) ?? [providerImportsContainer];
    const def = getComponentDef(providerImportsContainer);
    const isStandaloneComponent2 = !!def?.standalone;
    if (isStandaloneComponent2) {
      importPath = [providerImportsContainer, ...providerToPath.get(providerRecord.provider) ?? []];
    }
    return __spreadProps(__spreadValues({}, providerRecord), {
      importPath
    });
  });
}
function isPlatformInjector(injector) {
  return injector instanceof R3Injector && injector.scopes.has("platform");
}
function isRootInjector(injector) {
  return injector instanceof R3Injector && injector.scopes.has("root");
}
function getInjectorProviders(injector) {
  if (injector instanceof NodeInjector) {
    return getNodeInjectorProviders(injector);
  } else if (injector instanceof EnvironmentInjector) {
    return getEnvironmentInjectorProviders(injector);
  }
  throwError2("getInjectorProviders only supports NodeInjector and EnvironmentInjector");
}
function getInjectorResolutionPath(injector) {
  const resolutionPath = [injector];
  getInjectorResolutionPathHelper(injector, resolutionPath);
  return resolutionPath;
}
function getInjectorResolutionPathHelper(injector, resolutionPath) {
  const parent = getInjectorParent(injector);
  if (parent === null) {
    if (injector instanceof NodeInjector) {
      const firstInjector = resolutionPath[0];
      if (firstInjector instanceof NodeInjector) {
        const moduleInjector = getModuleInjectorOfNodeInjector(firstInjector);
        if (moduleInjector === null) {
          throwError2("NodeInjector must have some connection to the module injector tree");
        }
        resolutionPath.push(moduleInjector);
        getInjectorResolutionPathHelper(moduleInjector, resolutionPath);
      }
      return resolutionPath;
    }
  } else {
    resolutionPath.push(parent);
    getInjectorResolutionPathHelper(parent, resolutionPath);
  }
  return resolutionPath;
}
function getInjectorParent(injector) {
  if (injector instanceof R3Injector) {
    return injector.parent;
  }
  let tNode;
  let lView;
  if (injector instanceof NodeInjector) {
    tNode = getNodeInjectorTNode(injector);
    lView = getNodeInjectorLView(injector);
  } else if (injector instanceof NullInjector) {
    return null;
  } else {
    throwError2("getInjectorParent only support injectors of type R3Injector, NodeInjector, NullInjector");
  }
  const parentLocation = getParentInjectorLocation(tNode, lView);
  if (hasParentInjector(parentLocation)) {
    const parentInjectorIndex = getParentInjectorIndex(parentLocation);
    const parentLView = getParentInjectorView(parentLocation, lView);
    const parentTView = parentLView[TVIEW];
    const parentTNode = parentTView.data[
      parentInjectorIndex + 8
      /* NodeInjectorOffset.TNODE */
    ];
    return new NodeInjector(parentTNode, parentLView);
  } else {
    const chainedInjector = lView[INJECTOR$1];
    const injectorParent = chainedInjector.injector?.parent;
    if (injectorParent instanceof NodeInjector) {
      return injectorParent;
    }
  }
  return null;
}
function getModuleInjectorOfNodeInjector(injector) {
  let lView;
  if (injector instanceof NodeInjector) {
    lView = getNodeInjectorLView(injector);
  } else {
    throwError2("getModuleInjectorOfNodeInjector must be called with a NodeInjector");
  }
  const chainedInjector = lView[INJECTOR$1];
  const moduleInjector = chainedInjector.parentInjector;
  if (!moduleInjector) {
    throwError2("NodeInjector must have some connection to the module injector tree");
  }
  return moduleInjector;
}
var GLOBAL_PUBLISH_EXPANDO_KEY = "ng";
var _published = false;
function publishDefaultGlobalUtils$1() {
  if (!_published) {
    _published = true;
    setupFrameworkInjectorProfiler();
    publishGlobalUtil("\u0275getDependenciesFromInjectable", getDependenciesFromInjectable);
    publishGlobalUtil("\u0275getInjectorProviders", getInjectorProviders);
    publishGlobalUtil("\u0275getInjectorResolutionPath", getInjectorResolutionPath);
    publishGlobalUtil("\u0275setProfiler", setProfiler);
    publishGlobalUtil("getDirectiveMetadata", getDirectiveMetadata$1);
    publishGlobalUtil("getComponent", getComponent);
    publishGlobalUtil("getContext", getContext);
    publishGlobalUtil("getListeners", getListeners);
    publishGlobalUtil("getOwningComponent", getOwningComponent);
    publishGlobalUtil("getHostElement", getHostElement);
    publishGlobalUtil("getInjector", getInjector);
    publishGlobalUtil("getRootComponents", getRootComponents);
    publishGlobalUtil("getDirectives", getDirectives);
    publishGlobalUtil("applyChanges", applyChanges);
  }
}
function publishGlobalUtil(name, fn) {
  if (typeof COMPILED === "undefined" || !COMPILED) {
    const w = _global;
    ngDevMode && assertDefined(fn, "function not defined");
    if (w) {
      let container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
      if (!container) {
        container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
      }
      container[name] = fn;
    }
  }
}
var TESTABILITY = /* @__PURE__ */ new InjectionToken("");
var _platformInjector = null;
var PLATFORM_DESTROY_LISTENERS = /* @__PURE__ */ new InjectionToken("PlatformDestroyListeners");
var APP_BOOTSTRAP_LISTENER = /* @__PURE__ */ new InjectionToken("appBootstrapListener");
function publishDefaultGlobalUtils() {
  ngDevMode && publishDefaultGlobalUtils$1();
}
function publishSignalConfiguration() {
  setThrowInvalidWriteToSignalError(() => {
    throw new RuntimeError(600, ngDevMode && "Writing to signals is not allowed in a `computed` or an `effect` by default. Use `allowSignalWrites` in the `CreateEffectOptions` to enable this inside effects.");
  });
}
function isBoundToModule(cf) {
  return cf.isBoundToModule;
}
function createOrReusePlatformInjector(providers = []) {
  if (_platformInjector)
    return _platformInjector;
  publishDefaultGlobalUtils();
  const injector = createPlatformInjector(providers);
  _platformInjector = injector;
  publishSignalConfiguration();
  runPlatformInitializers(injector);
  return injector;
}
function runPlatformInitializers(injector) {
  const inits = injector.get(PLATFORM_INITIALIZER, null);
  inits?.forEach((init) => init());
}
function internalCreateApplication(config2) {
  try {
    const {
      rootComponent,
      appProviders,
      platformProviders
    } = config2;
    if ((typeof ngDevMode === "undefined" || ngDevMode) && rootComponent !== void 0) {
      assertStandaloneComponentType(rootComponent);
    }
    const platformInjector = createOrReusePlatformInjector(platformProviders);
    const allAppProviders = [provideZoneChangeDetection(), ...appProviders || []];
    const adapter = new EnvironmentNgModuleRefAdapter({
      providers: allAppProviders,
      parent: platformInjector,
      debugName: typeof ngDevMode === "undefined" || ngDevMode ? "Environment Injector" : "",
      // We skip environment initializers because we need to run them inside the NgZone, which
      // happens after we get the NgZone instance from the Injector.
      runEnvironmentInitializers: false
    });
    const envInjector = adapter.injector;
    const ngZone = envInjector.get(NgZone);
    return ngZone.run(() => {
      envInjector.resolveInjectorInitializers();
      const exceptionHandler = envInjector.get(ErrorHandler, null);
      if ((typeof ngDevMode === "undefined" || ngDevMode) && !exceptionHandler) {
        throw new RuntimeError(402, "No `ErrorHandler` found in the Dependency Injection tree.");
      }
      let onErrorSubscription;
      ngZone.runOutsideAngular(() => {
        onErrorSubscription = ngZone.onError.subscribe({
          next: (error) => {
            exceptionHandler.handleError(error);
          }
        });
      });
      const destroyListener = () => envInjector.destroy();
      const onPlatformDestroyListeners = platformInjector.get(PLATFORM_DESTROY_LISTENERS);
      onPlatformDestroyListeners.add(destroyListener);
      envInjector.onDestroy(() => {
        onErrorSubscription.unsubscribe();
        onPlatformDestroyListeners.delete(destroyListener);
      });
      return _callAndReportToErrorHandler(exceptionHandler, ngZone, () => {
        const initStatus = envInjector.get(ApplicationInitStatus);
        initStatus.runInitializers();
        return initStatus.donePromise.then(() => {
          const localeId = envInjector.get(LOCALE_ID, DEFAULT_LOCALE_ID);
          setLocaleId(localeId || DEFAULT_LOCALE_ID);
          const appRef = envInjector.get(ApplicationRef);
          if (rootComponent !== void 0) {
            appRef.bootstrap(rootComponent);
          }
          return appRef;
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function createPlatformInjector(providers = [], name) {
  return Injector.create({
    name,
    providers: [{
      provide: INJECTOR_SCOPE,
      useValue: "platform"
    }, {
      provide: PLATFORM_DESTROY_LISTENERS,
      useValue: /* @__PURE__ */ new Set([() => _platformInjector = null])
    }, ...providers]
  });
}
function getNgZoneOptions(options) {
  return {
    enableLongStackTrace: typeof ngDevMode === "undefined" ? false : !!ngDevMode,
    shouldCoalesceEventChangeDetection: options?.eventCoalescing ?? false,
    shouldCoalesceRunChangeDetection: options?.runCoalescing ?? false
  };
}
function _callAndReportToErrorHandler(errorHandler, ngZone, callback) {
  try {
    const result = callback();
    if (isPromise2(result)) {
      return result.catch((e) => {
        ngZone.runOutsideAngular(() => errorHandler.handleError(e));
        throw e;
      });
    }
    return result;
  } catch (e) {
    ngZone.runOutsideAngular(() => errorHandler.handleError(e));
    throw e;
  }
}
var ApplicationRef = /* @__PURE__ */ (() => {
  class ApplicationRef2 {
    constructor() {
      this._bootstrapListeners = [];
      this._runningTick = false;
      this._destroyed = false;
      this._destroyListeners = [];
      this._views = [];
      this.internalErrorHandler = inject(INTERNAL_APPLICATION_ERROR_HANDLER);
      this.zoneIsStable = inject(ZONE_IS_STABLE_OBSERVABLE);
      this.componentTypes = [];
      this.components = [];
      this.isStable = inject(InitialRenderPendingTasks).hasPendingTasks.pipe(switchMap((hasPendingTasks) => hasPendingTasks ? of(false) : this.zoneIsStable), distinctUntilChanged(), share());
      this._injector = inject(EnvironmentInjector);
    }
    /**
     * Indicates whether this instance was destroyed.
     */
    get destroyed() {
      return this._destroyed;
    }
    /**
     * The `EnvironmentInjector` used to create this application.
     */
    get injector() {
      return this._injector;
    }
    /**
     * Bootstrap a component onto the element identified by its selector or, optionally, to a
     * specified element.
     *
     * @usageNotes
     * ### Bootstrap process
     *
     * When bootstrapping a component, Angular mounts it onto a target DOM element
     * and kicks off automatic change detection. The target DOM element can be
     * provided using the `rootSelectorOrNode` argument.
     *
     * If the target DOM element is not provided, Angular tries to find one on a page
     * using the `selector` of the component that is being bootstrapped
     * (first matched element is used).
     *
     * ### Example
     *
     * Generally, we define the component to bootstrap in the `bootstrap` array of `NgModule`,
     * but it requires us to know the component while writing the application code.
     *
     * Imagine a situation where we have to wait for an API call to decide about the component to
     * bootstrap. We can use the `ngDoBootstrap` hook of the `NgModule` and call this method to
     * dynamically bootstrap a component.
     *
     * {@example core/ts/platform/platform.ts region='componentSelector'}
     *
     * Optionally, a component can be mounted onto a DOM element that does not match the
     * selector of the bootstrapped component.
     *
     * In the following example, we are providing a CSS selector to match the target element.
     *
     * {@example core/ts/platform/platform.ts region='cssSelector'}
     *
     * While in this example, we are providing reference to a DOM node.
     *
     * {@example core/ts/platform/platform.ts region='domNode'}
     */
    bootstrap(componentOrFactory, rootSelectorOrNode) {
      (typeof ngDevMode === "undefined" || ngDevMode) && this.warnIfDestroyed();
      const isComponentFactory = componentOrFactory instanceof ComponentFactory$1;
      const initStatus = this._injector.get(ApplicationInitStatus);
      if (!initStatus.done) {
        const standalone = !isComponentFactory && isStandalone(componentOrFactory);
        const errorMessage = "Cannot bootstrap as there are still asynchronous initializers running." + (standalone ? "" : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
        throw new RuntimeError(405, (typeof ngDevMode === "undefined" || ngDevMode) && errorMessage);
      }
      let componentFactory;
      if (isComponentFactory) {
        componentFactory = componentOrFactory;
      } else {
        const resolver = this._injector.get(ComponentFactoryResolver$1);
        componentFactory = resolver.resolveComponentFactory(componentOrFactory);
      }
      this.componentTypes.push(componentFactory.componentType);
      const ngModule = isBoundToModule(componentFactory) ? void 0 : this._injector.get(NgModuleRef$1);
      const selectorOrNode = rootSelectorOrNode || componentFactory.selector;
      const compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
      const nativeElement = compRef.location.nativeElement;
      const testability = compRef.injector.get(TESTABILITY, null);
      testability?.registerApplication(nativeElement);
      compRef.onDestroy(() => {
        this.detachView(compRef.hostView);
        remove(this.components, compRef);
        testability?.unregisterApplication(nativeElement);
      });
      this._loadComponent(compRef);
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        const _console = this._injector.get(Console);
        _console.log(`Angular is running in development mode.`);
      }
      return compRef;
    }
    /**
     * Invoke this method to explicitly process change detection and its side-effects.
     *
     * In development mode, `tick()` also performs a second change detection cycle to ensure that no
     * further changes are detected. If additional changes are picked up during this second cycle,
     * bindings in the app have side-effects that cannot be resolved in a single change detection
     * pass.
     * In this case, Angular throws an error, since an Angular application can only have one change
     * detection pass during which all change detection must complete.
     */
    tick() {
      (typeof ngDevMode === "undefined" || ngDevMode) && this.warnIfDestroyed();
      if (this._runningTick) {
        throw new RuntimeError(101, ngDevMode && "ApplicationRef.tick is called recursively");
      }
      try {
        this._runningTick = true;
        for (let view of this._views) {
          view.detectChanges();
        }
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          for (let view of this._views) {
            view.checkNoChanges();
          }
        }
      } catch (e) {
        this.internalErrorHandler(e);
      } finally {
        this._runningTick = false;
      }
    }
    /**
     * Attaches a view so that it will be dirty checked.
     * The view will be automatically detached when it is destroyed.
     * This will throw if the view is already attached to a ViewContainer.
     */
    attachView(viewRef) {
      (typeof ngDevMode === "undefined" || ngDevMode) && this.warnIfDestroyed();
      const view = viewRef;
      this._views.push(view);
      view.attachToAppRef(this);
    }
    /**
     * Detaches a view from dirty checking again.
     */
    detachView(viewRef) {
      (typeof ngDevMode === "undefined" || ngDevMode) && this.warnIfDestroyed();
      const view = viewRef;
      remove(this._views, view);
      view.detachFromAppRef();
    }
    _loadComponent(componentRef) {
      this.attachView(componentRef.hostView);
      this.tick();
      this.components.push(componentRef);
      const listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []);
      if (ngDevMode && !Array.isArray(listeners)) {
        throw new RuntimeError(-209, `Unexpected type of the \`APP_BOOTSTRAP_LISTENER\` token value (expected an array, but got ${typeof listeners}). Please check that the \`APP_BOOTSTRAP_LISTENER\` token is configured as a \`multi: true\` provider.`);
      }
      listeners.push(...this._bootstrapListeners);
      listeners.forEach((listener) => listener(componentRef));
    }
    /** @internal */
    ngOnDestroy() {
      if (this._destroyed)
        return;
      try {
        this._destroyListeners.forEach((listener) => listener());
        this._views.slice().forEach((view) => view.destroy());
      } finally {
        this._destroyed = true;
        this._views = [];
        this._bootstrapListeners = [];
        this._destroyListeners = [];
      }
    }
    /**
     * Registers a listener to be called when an instance is destroyed.
     *
     * @param callback A callback function to add as a listener.
     * @returns A function which unregisters a listener.
     */
    onDestroy(callback) {
      (typeof ngDevMode === "undefined" || ngDevMode) && this.warnIfDestroyed();
      this._destroyListeners.push(callback);
      return () => remove(this._destroyListeners, callback);
    }
    /**
     * Destroys an Angular application represented by this `ApplicationRef`. Calling this function
     * will destroy the associated environment injectors as well as all the bootstrapped components
     * with their views.
     */
    destroy() {
      if (this._destroyed) {
        throw new RuntimeError(406, ngDevMode && "This instance of the `ApplicationRef` has already been destroyed.");
      }
      const injector = this._injector;
      if (injector.destroy && !injector.destroyed) {
        injector.destroy();
      }
    }
    /**
     * Returns the number of attached views.
     */
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && this._destroyed) {
        console.warn(formatRuntimeError(406, "This instance of the `ApplicationRef` has already been destroyed."));
      }
    }
    static {
      this.\u0275fac = function ApplicationRef_Factory(t) {
        return new (t || ApplicationRef2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: ApplicationRef2,
        factory: ApplicationRef2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return ApplicationRef2;
})();
function remove(list, el) {
  const index = list.indexOf(el);
  if (index > -1) {
    list.splice(index, 1);
  }
}
var INTERNAL_APPLICATION_ERROR_HANDLER = /* @__PURE__ */ new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "internal error handler" : "", {
  providedIn: "root",
  factory: () => {
    const userErrorHandler = inject(ErrorHandler);
    return userErrorHandler.handleError.bind(void 0);
  }
});
function ngZoneApplicationErrorHandlerFactory() {
  const zone = inject(NgZone);
  const userErrorHandler = inject(ErrorHandler);
  return (e) => zone.runOutsideAngular(() => userErrorHandler.handleError(e));
}
var NgZoneChangeDetectionScheduler = /* @__PURE__ */ (() => {
  class NgZoneChangeDetectionScheduler2 {
    constructor() {
      this.zone = inject(NgZone);
      this.applicationRef = inject(ApplicationRef);
    }
    initialize() {
      if (this._onMicrotaskEmptySubscription) {
        return;
      }
      this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
        next: () => {
          this.zone.run(() => {
            this.applicationRef.tick();
          });
        }
      });
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static {
      this.\u0275fac = function NgZoneChangeDetectionScheduler_Factory(t) {
        return new (t || NgZoneChangeDetectionScheduler2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: NgZoneChangeDetectionScheduler2,
        factory: NgZoneChangeDetectionScheduler2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return NgZoneChangeDetectionScheduler2;
})();
var PROVIDED_NG_ZONE = /* @__PURE__ */ new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "provideZoneChangeDetection token" : "");
function internalProvideZoneChangeDetection(ngZoneFactory) {
  return [{
    provide: NgZone,
    useFactory: ngZoneFactory
  }, {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory: () => {
      const ngZoneChangeDetectionScheduler = inject(NgZoneChangeDetectionScheduler, {
        optional: true
      });
      if ((typeof ngDevMode === "undefined" || ngDevMode) && ngZoneChangeDetectionScheduler === null) {
        throw new RuntimeError(402, `A required Injectable was not found in the dependency injection tree. If you are bootstrapping an NgModule, make sure that the \`BrowserModule\` is imported.`);
      }
      return () => ngZoneChangeDetectionScheduler.initialize();
    }
  }, {
    provide: INTERNAL_APPLICATION_ERROR_HANDLER,
    useFactory: ngZoneApplicationErrorHandlerFactory
  }, {
    provide: ZONE_IS_STABLE_OBSERVABLE,
    useFactory: isStableFactory
  }];
}
function provideZoneChangeDetection(options) {
  const zoneProviders = internalProvideZoneChangeDetection(() => new NgZone(getNgZoneOptions(options)));
  return makeEnvironmentProviders([typeof ngDevMode === "undefined" || ngDevMode ? {
    provide: PROVIDED_NG_ZONE,
    useValue: true
  } : [], zoneProviders]);
}
var ChangeDetectorRef = /* @__PURE__ */ (() => {
  class ChangeDetectorRef2 {
    static {
      this.__NG_ELEMENT_ID__ = injectChangeDetectorRef;
    }
  }
  return ChangeDetectorRef2;
})();
function injectChangeDetectorRef(flags) {
  return createViewRef(
    getCurrentTNode(),
    getLView(),
    (flags & 16) === 16
    /* InternalInjectFlags.ForPipe */
  );
}
function createViewRef(tNode, lView, isPipe) {
  if (isComponentHost(tNode) && !isPipe) {
    const componentView = getComponentLViewByIndex(tNode.index, lView);
    return new ViewRef$1(componentView, componentView);
  } else if (tNode.type & (3 | 12 | 32)) {
    const hostComponentView = lView[DECLARATION_COMPONENT_VIEW];
    return new ViewRef$1(hostComponentView, lView);
  }
  return null;
}
var DefaultIterableDifferFactory = class {
  constructor() {
  }
  supports(obj) {
    return isListLikeIterable(obj);
  }
  create(trackByFn) {
    return new DefaultIterableDiffer(trackByFn);
  }
};
var trackByIdentity = (index, item) => item;
var DefaultIterableDiffer = class {
  constructor(trackByFn) {
    this.length = 0;
    this._linkedRecords = null;
    this._unlinkedRecords = null;
    this._previousItHead = null;
    this._itHead = null;
    this._itTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._movesHead = null;
    this._movesTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
    this._identityChangesHead = null;
    this._identityChangesTail = null;
    this._trackByFn = trackByFn || trackByIdentity;
  }
  forEachItem(fn) {
    let record;
    for (record = this._itHead; record !== null; record = record._next) {
      fn(record);
    }
  }
  forEachOperation(fn) {
    let nextIt = this._itHead;
    let nextRemove = this._removalsHead;
    let addRemoveOffset = 0;
    let moveOffsets = null;
    while (nextIt || nextRemove) {
      const record = !nextRemove || nextIt && nextIt.currentIndex < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? nextIt : nextRemove;
      const adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
      const currentIndex = record.currentIndex;
      if (record === nextRemove) {
        addRemoveOffset--;
        nextRemove = nextRemove._nextRemoved;
      } else {
        nextIt = nextIt._next;
        if (record.previousIndex == null) {
          addRemoveOffset++;
        } else {
          if (!moveOffsets)
            moveOffsets = [];
          const localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
          const localCurrentIndex = currentIndex - addRemoveOffset;
          if (localMovePreviousIndex != localCurrentIndex) {
            for (let i = 0; i < localMovePreviousIndex; i++) {
              const offset = i < moveOffsets.length ? moveOffsets[i] : moveOffsets[i] = 0;
              const index = offset + i;
              if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                moveOffsets[i] = offset + 1;
              }
            }
            const previousIndex = record.previousIndex;
            moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
          }
        }
      }
      if (adjPreviousIndex !== currentIndex) {
        fn(record, adjPreviousIndex, currentIndex);
      }
    }
  }
  forEachPreviousItem(fn) {
    let record;
    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }
  forEachAddedItem(fn) {
    let record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }
  forEachMovedItem(fn) {
    let record;
    for (record = this._movesHead; record !== null; record = record._nextMoved) {
      fn(record);
    }
  }
  forEachRemovedItem(fn) {
    let record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }
  forEachIdentityChange(fn) {
    let record;
    for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
      fn(record);
    }
  }
  diff(collection) {
    if (collection == null)
      collection = [];
    if (!isListLikeIterable(collection)) {
      throw new RuntimeError(900, ngDevMode && `Error trying to diff '${stringify(collection)}'. Only arrays and iterables are allowed`);
    }
    if (this.check(collection)) {
      return this;
    } else {
      return null;
    }
  }
  onDestroy() {
  }
  check(collection) {
    this._reset();
    let record = this._itHead;
    let mayBeDirty = false;
    let index;
    let item;
    let itemTrackBy;
    if (Array.isArray(collection)) {
      this.length = collection.length;
      for (let index2 = 0; index2 < this.length; index2++) {
        item = collection[index2];
        itemTrackBy = this._trackByFn(index2, item);
        if (record === null || !Object.is(record.trackById, itemTrackBy)) {
          record = this._mismatch(record, item, itemTrackBy, index2);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            record = this._verifyReinsertion(record, item, itemTrackBy, index2);
          }
          if (!Object.is(record.item, item))
            this._addIdentityChange(record, item);
        }
        record = record._next;
      }
    } else {
      index = 0;
      iterateListLike(collection, (item2) => {
        itemTrackBy = this._trackByFn(index, item2);
        if (record === null || !Object.is(record.trackById, itemTrackBy)) {
          record = this._mismatch(record, item2, itemTrackBy, index);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            record = this._verifyReinsertion(record, item2, itemTrackBy, index);
          }
          if (!Object.is(record.item, item2))
            this._addIdentityChange(record, item2);
        }
        record = record._next;
        index++;
      });
      this.length = index;
    }
    this._truncate(record);
    this.collection = collection;
    return this.isDirty;
  }
  /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
   * changes.
   */
  get isDirty() {
    return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
  }
  /**
   * Reset the state of the change objects to show no changes. This means set previousKey to
   * currentKey, and clear all of the queues (additions, moves, removals).
   * Set the previousIndexes of moved and added items to their currentIndexes
   * Reset the list of additions, moves and removals
   *
   * @internal
   */
  _reset() {
    if (this.isDirty) {
      let record;
      for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._additionsHead; record !== null; record = record._nextAdded) {
        record.previousIndex = record.currentIndex;
      }
      this._additionsHead = this._additionsTail = null;
      for (record = this._movesHead; record !== null; record = record._nextMoved) {
        record.previousIndex = record.currentIndex;
      }
      this._movesHead = this._movesTail = null;
      this._removalsHead = this._removalsTail = null;
      this._identityChangesHead = this._identityChangesTail = null;
    }
  }
  /**
   * This is the core function which handles differences between collections.
   *
   * - `record` is the record which we saw at this position last time. If null then it is a new
   *   item.
   * - `item` is the current item in the collection
   * - `index` is the position of the item in the collection
   *
   * @internal
   */
  _mismatch(record, item, itemTrackBy, index) {
    let previousRecord;
    if (record === null) {
      previousRecord = this._itTail;
    } else {
      previousRecord = record._prev;
      this._remove(record);
    }
    record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
    if (record !== null) {
      if (!Object.is(record.item, item))
        this._addIdentityChange(record, item);
      this._reinsertAfter(record, previousRecord, index);
    } else {
      record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
      if (record !== null) {
        if (!Object.is(record.item, item))
          this._addIdentityChange(record, item);
        this._moveAfter(record, previousRecord, index);
      } else {
        record = this._addAfter(new IterableChangeRecord_(item, itemTrackBy), previousRecord, index);
      }
    }
    return record;
  }
  /**
   * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
   *
   * Use case: `[a, a]` => `[b, a, a]`
   *
   * If we did not have this check then the insertion of `b` would:
   *   1) evict first `a`
   *   2) insert `b` at `0` index.
   *   3) leave `a` at index `1` as is. <-- this is wrong!
   *   3) reinsert `a` at index 2. <-- this is wrong!
   *
   * The correct behavior is:
   *   1) evict first `a`
   *   2) insert `b` at `0` index.
   *   3) reinsert `a` at index 1.
   *   3) move `a` at from `1` to `2`.
   *
   *
   * Double check that we have not evicted a duplicate item. We need to check if the item type may
   * have already been removed:
   * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
   * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
   * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
   * at the end.
   *
   * @internal
   */
  _verifyReinsertion(record, item, itemTrackBy, index) {
    let reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
    if (reinsertRecord !== null) {
      record = this._reinsertAfter(reinsertRecord, record._prev, index);
    } else if (record.currentIndex != index) {
      record.currentIndex = index;
      this._addToMoves(record, index);
    }
    return record;
  }
  /**
   * Get rid of any excess {@link IterableChangeRecord_}s from the previous collection
   *
   * - `record` The first excess {@link IterableChangeRecord_}.
   *
   * @internal
   */
  _truncate(record) {
    while (record !== null) {
      const nextRecord = record._next;
      this._addToRemovals(this._unlink(record));
      record = nextRecord;
    }
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.clear();
    }
    if (this._additionsTail !== null) {
      this._additionsTail._nextAdded = null;
    }
    if (this._movesTail !== null) {
      this._movesTail._nextMoved = null;
    }
    if (this._itTail !== null) {
      this._itTail._next = null;
    }
    if (this._removalsTail !== null) {
      this._removalsTail._nextRemoved = null;
    }
    if (this._identityChangesTail !== null) {
      this._identityChangesTail._nextIdentityChange = null;
    }
  }
  /** @internal */
  _reinsertAfter(record, prevRecord, index) {
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.remove(record);
    }
    const prev = record._prevRemoved;
    const next = record._nextRemoved;
    if (prev === null) {
      this._removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this._removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  }
  /** @internal */
  _moveAfter(record, prevRecord, index) {
    this._unlink(record);
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  }
  /** @internal */
  _addAfter(record, prevRecord, index) {
    this._insertAfter(record, prevRecord, index);
    if (this._additionsTail === null) {
      this._additionsTail = this._additionsHead = record;
    } else {
      this._additionsTail = this._additionsTail._nextAdded = record;
    }
    return record;
  }
  /** @internal */
  _insertAfter(record, prevRecord, index) {
    const next = prevRecord === null ? this._itHead : prevRecord._next;
    record._next = next;
    record._prev = prevRecord;
    if (next === null) {
      this._itTail = record;
    } else {
      next._prev = record;
    }
    if (prevRecord === null) {
      this._itHead = record;
    } else {
      prevRecord._next = record;
    }
    if (this._linkedRecords === null) {
      this._linkedRecords = new _DuplicateMap();
    }
    this._linkedRecords.put(record);
    record.currentIndex = index;
    return record;
  }
  /** @internal */
  _remove(record) {
    return this._addToRemovals(this._unlink(record));
  }
  /** @internal */
  _unlink(record) {
    if (this._linkedRecords !== null) {
      this._linkedRecords.remove(record);
    }
    const prev = record._prev;
    const next = record._next;
    if (prev === null) {
      this._itHead = next;
    } else {
      prev._next = next;
    }
    if (next === null) {
      this._itTail = prev;
    } else {
      next._prev = prev;
    }
    return record;
  }
  /** @internal */
  _addToMoves(record, toIndex) {
    if (record.previousIndex === toIndex) {
      return record;
    }
    if (this._movesTail === null) {
      this._movesTail = this._movesHead = record;
    } else {
      this._movesTail = this._movesTail._nextMoved = record;
    }
    return record;
  }
  _addToRemovals(record) {
    if (this._unlinkedRecords === null) {
      this._unlinkedRecords = new _DuplicateMap();
    }
    this._unlinkedRecords.put(record);
    record.currentIndex = null;
    record._nextRemoved = null;
    if (this._removalsTail === null) {
      this._removalsTail = this._removalsHead = record;
      record._prevRemoved = null;
    } else {
      record._prevRemoved = this._removalsTail;
      this._removalsTail = this._removalsTail._nextRemoved = record;
    }
    return record;
  }
  /** @internal */
  _addIdentityChange(record, item) {
    record.item = item;
    if (this._identityChangesTail === null) {
      this._identityChangesTail = this._identityChangesHead = record;
    } else {
      this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
    }
    return record;
  }
};
var IterableChangeRecord_ = class {
  constructor(item, trackById) {
    this.item = item;
    this.trackById = trackById;
    this.currentIndex = null;
    this.previousIndex = null;
    this._nextPrevious = null;
    this._prev = null;
    this._next = null;
    this._prevDup = null;
    this._nextDup = null;
    this._prevRemoved = null;
    this._nextRemoved = null;
    this._nextAdded = null;
    this._nextMoved = null;
    this._nextIdentityChange = null;
  }
};
var _DuplicateItemRecordList = class {
  constructor() {
    this._head = null;
    this._tail = null;
  }
  /**
   * Append the record to the list of duplicates.
   *
   * Note: by design all records in the list of duplicates hold the same value in record.item.
   */
  add(record) {
    if (this._head === null) {
      this._head = this._tail = record;
      record._nextDup = null;
      record._prevDup = null;
    } else {
      this._tail._nextDup = record;
      record._prevDup = this._tail;
      record._nextDup = null;
      this._tail = record;
    }
  }
  // Returns a IterableChangeRecord_ having IterableChangeRecord_.trackById == trackById and
  // IterableChangeRecord_.currentIndex >= atOrAfterIndex
  get(trackById, atOrAfterIndex) {
    let record;
    for (record = this._head; record !== null; record = record._nextDup) {
      if ((atOrAfterIndex === null || atOrAfterIndex <= record.currentIndex) && Object.is(record.trackById, trackById)) {
        return record;
      }
    }
    return null;
  }
  /**
   * Remove one {@link IterableChangeRecord_} from the list of duplicates.
   *
   * Returns whether the list of duplicates is empty.
   */
  remove(record) {
    const prev = record._prevDup;
    const next = record._nextDup;
    if (prev === null) {
      this._head = next;
    } else {
      prev._nextDup = next;
    }
    if (next === null) {
      this._tail = prev;
    } else {
      next._prevDup = prev;
    }
    return this._head === null;
  }
};
var _DuplicateMap = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  put(record) {
    const key = record.trackById;
    let duplicates = this.map.get(key);
    if (!duplicates) {
      duplicates = new _DuplicateItemRecordList();
      this.map.set(key, duplicates);
    }
    duplicates.add(record);
  }
  /**
   * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
   * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
   *
   * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
   * have any more `a`s needs to return the second `a`.
   */
  get(trackById, atOrAfterIndex) {
    const key = trackById;
    const recordList = this.map.get(key);
    return recordList ? recordList.get(trackById, atOrAfterIndex) : null;
  }
  /**
   * Removes a {@link IterableChangeRecord_} from the list of duplicates.
   *
   * The list of duplicates also is removed from the map if it gets empty.
   */
  remove(record) {
    const key = record.trackById;
    const recordList = this.map.get(key);
    if (recordList.remove(record)) {
      this.map.delete(key);
    }
    return record;
  }
  get isEmpty() {
    return this.map.size === 0;
  }
  clear() {
    this.map.clear();
  }
};
function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
  const previousIndex = item.previousIndex;
  if (previousIndex === null)
    return previousIndex;
  let moveOffset = 0;
  if (moveOffsets && previousIndex < moveOffsets.length) {
    moveOffset = moveOffsets[previousIndex];
  }
  return previousIndex + addRemoveOffset + moveOffset;
}
var DefaultKeyValueDifferFactory = class {
  constructor() {
  }
  supports(obj) {
    return obj instanceof Map || isJsObject(obj);
  }
  create() {
    return new DefaultKeyValueDiffer();
  }
};
var DefaultKeyValueDiffer = class {
  constructor() {
    this._records = /* @__PURE__ */ new Map();
    this._mapHead = null;
    this._appendAfter = null;
    this._previousMapHead = null;
    this._changesHead = null;
    this._changesTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
  }
  get isDirty() {
    return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
  }
  forEachItem(fn) {
    let record;
    for (record = this._mapHead; record !== null; record = record._next) {
      fn(record);
    }
  }
  forEachPreviousItem(fn) {
    let record;
    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }
  forEachChangedItem(fn) {
    let record;
    for (record = this._changesHead; record !== null; record = record._nextChanged) {
      fn(record);
    }
  }
  forEachAddedItem(fn) {
    let record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }
  forEachRemovedItem(fn) {
    let record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }
  diff(map2) {
    if (!map2) {
      map2 = /* @__PURE__ */ new Map();
    } else if (!(map2 instanceof Map || isJsObject(map2))) {
      throw new RuntimeError(900, ngDevMode && `Error trying to diff '${stringify(map2)}'. Only maps and objects are allowed`);
    }
    return this.check(map2) ? this : null;
  }
  onDestroy() {
  }
  /**
   * Check the current state of the map vs the previous.
   * The algorithm is optimised for when the keys do no change.
   */
  check(map2) {
    this._reset();
    let insertBefore = this._mapHead;
    this._appendAfter = null;
    this._forEach(map2, (value, key) => {
      if (insertBefore && insertBefore.key === key) {
        this._maybeAddToChanges(insertBefore, value);
        this._appendAfter = insertBefore;
        insertBefore = insertBefore._next;
      } else {
        const record = this._getOrCreateRecordForKey(key, value);
        insertBefore = this._insertBeforeOrAppend(insertBefore, record);
      }
    });
    if (insertBefore) {
      if (insertBefore._prev) {
        insertBefore._prev._next = null;
      }
      this._removalsHead = insertBefore;
      for (let record = insertBefore; record !== null; record = record._nextRemoved) {
        if (record === this._mapHead) {
          this._mapHead = null;
        }
        this._records.delete(record.key);
        record._nextRemoved = record._next;
        record.previousValue = record.currentValue;
        record.currentValue = null;
        record._prev = null;
        record._next = null;
      }
    }
    if (this._changesTail)
      this._changesTail._nextChanged = null;
    if (this._additionsTail)
      this._additionsTail._nextAdded = null;
    return this.isDirty;
  }
  /**
   * Inserts a record before `before` or append at the end of the list when `before` is null.
   *
   * Notes:
   * - This method appends at `this._appendAfter`,
   * - This method updates `this._appendAfter`,
   * - The return value is the new value for the insertion pointer.
   */
  _insertBeforeOrAppend(before, record) {
    if (before) {
      const prev = before._prev;
      record._next = before;
      record._prev = prev;
      before._prev = record;
      if (prev) {
        prev._next = record;
      }
      if (before === this._mapHead) {
        this._mapHead = record;
      }
      this._appendAfter = before;
      return before;
    }
    if (this._appendAfter) {
      this._appendAfter._next = record;
      record._prev = this._appendAfter;
    } else {
      this._mapHead = record;
    }
    this._appendAfter = record;
    return null;
  }
  _getOrCreateRecordForKey(key, value) {
    if (this._records.has(key)) {
      const record2 = this._records.get(key);
      this._maybeAddToChanges(record2, value);
      const prev = record2._prev;
      const next = record2._next;
      if (prev) {
        prev._next = next;
      }
      if (next) {
        next._prev = prev;
      }
      record2._next = null;
      record2._prev = null;
      return record2;
    }
    const record = new KeyValueChangeRecord_(key);
    this._records.set(key, record);
    record.currentValue = value;
    this._addToAdditions(record);
    return record;
  }
  /** @internal */
  _reset() {
    if (this.isDirty) {
      let record;
      this._previousMapHead = this._mapHead;
      for (record = this._previousMapHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._changesHead; record !== null; record = record._nextChanged) {
        record.previousValue = record.currentValue;
      }
      for (record = this._additionsHead; record != null; record = record._nextAdded) {
        record.previousValue = record.currentValue;
      }
      this._changesHead = this._changesTail = null;
      this._additionsHead = this._additionsTail = null;
      this._removalsHead = null;
    }
  }
  // Add the record or a given key to the list of changes only when the value has actually changed
  _maybeAddToChanges(record, newValue) {
    if (!Object.is(newValue, record.currentValue)) {
      record.previousValue = record.currentValue;
      record.currentValue = newValue;
      this._addToChanges(record);
    }
  }
  _addToAdditions(record) {
    if (this._additionsHead === null) {
      this._additionsHead = this._additionsTail = record;
    } else {
      this._additionsTail._nextAdded = record;
      this._additionsTail = record;
    }
  }
  _addToChanges(record) {
    if (this._changesHead === null) {
      this._changesHead = this._changesTail = record;
    } else {
      this._changesTail._nextChanged = record;
      this._changesTail = record;
    }
  }
  /** @internal */
  _forEach(obj, fn) {
    if (obj instanceof Map) {
      obj.forEach(fn);
    } else {
      Object.keys(obj).forEach((k) => fn(obj[k], k));
    }
  }
};
var KeyValueChangeRecord_ = class {
  constructor(key) {
    this.key = key;
    this.previousValue = null;
    this.currentValue = null;
    this._nextPrevious = null;
    this._next = null;
    this._prev = null;
    this._nextAdded = null;
    this._nextRemoved = null;
    this._nextChanged = null;
  }
};
function defaultIterableDiffersFactory() {
  return new IterableDiffers([new DefaultIterableDifferFactory()]);
}
var IterableDiffers = /* @__PURE__ */ (() => {
  class IterableDiffers2 {
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: IterableDiffers2,
        providedIn: "root",
        factory: defaultIterableDiffersFactory
      });
    }
    constructor(factories) {
      this.factories = factories;
    }
    static create(factories, parent) {
      if (parent != null) {
        const copied = parent.factories.slice();
        factories = factories.concat(copied);
      }
      return new IterableDiffers2(factories);
    }
    /**
     * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
     * inherited {@link IterableDiffers} instance with the provided factories and return a new
     * {@link IterableDiffers} instance.
     *
     * @usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link IterableDiffer} available.
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     IterableDiffers.extend([new ImmutableListDiffer()])
     *   ]
     * })
     * ```
     */
    static extend(factories) {
      return {
        provide: IterableDiffers2,
        useFactory: (parent) => {
          return IterableDiffers2.create(factories, parent || defaultIterableDiffersFactory());
        },
        // Dependency technically isn't optional, but we can provide a better error message this way.
        deps: [[IterableDiffers2, new SkipSelf(), new Optional()]]
      };
    }
    find(iterable) {
      const factory = this.factories.find((f) => f.supports(iterable));
      if (factory != null) {
        return factory;
      } else {
        throw new RuntimeError(901, ngDevMode && `Cannot find a differ supporting object '${iterable}' of type '${getTypeNameForDebugging(iterable)}'`);
      }
    }
  }
  return IterableDiffers2;
})();
function getTypeNameForDebugging(type) {
  return type["name"] || typeof type;
}
function defaultKeyValueDiffersFactory() {
  return new KeyValueDiffers([new DefaultKeyValueDifferFactory()]);
}
var KeyValueDiffers = /* @__PURE__ */ (() => {
  class KeyValueDiffers2 {
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: KeyValueDiffers2,
        providedIn: "root",
        factory: defaultKeyValueDiffersFactory
      });
    }
    constructor(factories) {
      this.factories = factories;
    }
    static create(factories, parent) {
      if (parent) {
        const copied = parent.factories.slice();
        factories = factories.concat(copied);
      }
      return new KeyValueDiffers2(factories);
    }
    /**
     * Takes an array of {@link KeyValueDifferFactory} and returns a provider used to extend the
     * inherited {@link KeyValueDiffers} instance with the provided factories and return a new
     * {@link KeyValueDiffers} instance.
     *
     * @usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link KeyValueDiffer} available.
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     KeyValueDiffers.extend([new ImmutableMapDiffer()])
     *   ]
     * })
     * ```
     */
    static extend(factories) {
      return {
        provide: KeyValueDiffers2,
        useFactory: (parent) => {
          return KeyValueDiffers2.create(factories, parent || defaultKeyValueDiffersFactory());
        },
        // Dependency technically isn't optional, but we can provide a better error message this way.
        deps: [[KeyValueDiffers2, new SkipSelf(), new Optional()]]
      };
    }
    find(kv) {
      const factory = this.factories.find((f) => f.supports(kv));
      if (factory) {
        return factory;
      }
      throw new RuntimeError(901, ngDevMode && `Cannot find a differ supporting object '${kv}'`);
    }
  }
  return KeyValueDiffers2;
})();
function booleanAttribute(value) {
  return typeof value === "boolean" ? value : value != null && value !== "false";
}
if (typeof ngDevMode !== "undefined" && ngDevMode) {
  _global.$localize = _global.$localize || function() {
    throw new Error("It looks like your application or one of its dependencies is using i18n.\nAngular 9 introduced a global `$localize()` function that needs to be loaded.\nPlease run `ng add @angular/localize` from the Angular CLI.\n(For non-CLI projects, add `import '@angular/localize/init';` to your `polyfills.ts` file.\nFor server-side rendering applications add the import to your `main.server.ts` file.)");
  };
}

// node_modules/@angular/common/fesm2022/common.mjs
var _DOM = null;
function getDOM() {
  return _DOM;
}
function setRootDomAdapter(adapter) {
  if (!_DOM) {
    _DOM = adapter;
  }
}
var DomAdapter = class {
};
var DOCUMENT2 = /* @__PURE__ */ new InjectionToken("DocumentToken");
var PlatformLocation = /* @__PURE__ */ (() => {
  class PlatformLocation2 {
    historyGo(relativePosition) {
      throw new Error("Not implemented");
    }
    static {
      this.\u0275fac = function PlatformLocation_Factory(t) {
        return new (t || PlatformLocation2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: PlatformLocation2,
        factory: function() {
          return (() => inject(BrowserPlatformLocation))();
        },
        providedIn: "platform"
      });
    }
  }
  return PlatformLocation2;
})();
var BrowserPlatformLocation = /* @__PURE__ */ (() => {
  class BrowserPlatformLocation2 extends PlatformLocation {
    constructor() {
      super();
      this._doc = inject(DOCUMENT2);
      this._location = window.location;
      this._history = window.history;
    }
    getBaseHrefFromDOM() {
      return getDOM().getBaseHref(this._doc);
    }
    onPopState(fn) {
      const window2 = getDOM().getGlobalEventTarget(this._doc, "window");
      window2.addEventListener("popstate", fn, false);
      return () => window2.removeEventListener("popstate", fn);
    }
    onHashChange(fn) {
      const window2 = getDOM().getGlobalEventTarget(this._doc, "window");
      window2.addEventListener("hashchange", fn, false);
      return () => window2.removeEventListener("hashchange", fn);
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(newPath) {
      this._location.pathname = newPath;
    }
    pushState(state, title, url) {
      this._history.pushState(state, title, url);
    }
    replaceState(state, title, url) {
      this._history.replaceState(state, title, url);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(relativePosition = 0) {
      this._history.go(relativePosition);
    }
    getState() {
      return this._history.state;
    }
    static {
      this.\u0275fac = function BrowserPlatformLocation_Factory(t) {
        return new (t || BrowserPlatformLocation2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: BrowserPlatformLocation2,
        factory: function() {
          return (() => new BrowserPlatformLocation2())();
        },
        providedIn: "platform"
      });
    }
  }
  return BrowserPlatformLocation2;
})();
function joinWithSlash(start, end) {
  if (start.length == 0) {
    return end;
  }
  if (end.length == 0) {
    return start;
  }
  let slashes = 0;
  if (start.endsWith("/")) {
    slashes++;
  }
  if (end.startsWith("/")) {
    slashes++;
  }
  if (slashes == 2) {
    return start + end.substring(1);
  }
  if (slashes == 1) {
    return start + end;
  }
  return start + "/" + end;
}
function stripTrailingSlash(url) {
  const match = url.match(/#|\?|$/);
  const pathEndIdx = match && match.index || url.length;
  const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === "/" ? 1 : 0);
  return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
}
function normalizeQueryParams(params) {
  return params && params[0] !== "?" ? "?" + params : params;
}
var LocationStrategy = /* @__PURE__ */ (() => {
  class LocationStrategy2 {
    historyGo(relativePosition) {
      throw new Error("Not implemented");
    }
    static {
      this.\u0275fac = function LocationStrategy_Factory(t) {
        return new (t || LocationStrategy2)();
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: LocationStrategy2,
        factory: function() {
          return (() => inject(PathLocationStrategy))();
        },
        providedIn: "root"
      });
    }
  }
  return LocationStrategy2;
})();
var APP_BASE_HREF = /* @__PURE__ */ new InjectionToken("appBaseHref");
var PathLocationStrategy = /* @__PURE__ */ (() => {
  class PathLocationStrategy2 extends LocationStrategy {
    constructor(_platformLocation, href) {
      super();
      this._platformLocation = _platformLocation;
      this._removeListenerFns = [];
      this._baseHref = href ?? this._platformLocation.getBaseHrefFromDOM() ?? inject(DOCUMENT2).location?.origin ?? "";
    }
    /** @nodoc */
    ngOnDestroy() {
      while (this._removeListenerFns.length) {
        this._removeListenerFns.pop()();
      }
    }
    onPopState(fn) {
      this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
    }
    getBaseHref() {
      return this._baseHref;
    }
    prepareExternalUrl(internal) {
      return joinWithSlash(this._baseHref, internal);
    }
    path(includeHash = false) {
      const pathname = this._platformLocation.pathname + normalizeQueryParams(this._platformLocation.search);
      const hash = this._platformLocation.hash;
      return hash && includeHash ? `${pathname}${hash}` : pathname;
    }
    pushState(state, title, url, queryParams) {
      const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
      this._platformLocation.pushState(state, title, externalUrl);
    }
    replaceState(state, title, url, queryParams) {
      const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
      this._platformLocation.replaceState(state, title, externalUrl);
    }
    forward() {
      this._platformLocation.forward();
    }
    back() {
      this._platformLocation.back();
    }
    getState() {
      return this._platformLocation.getState();
    }
    historyGo(relativePosition = 0) {
      this._platformLocation.historyGo?.(relativePosition);
    }
    static {
      this.\u0275fac = function PathLocationStrategy_Factory(t) {
        return new (t || PathLocationStrategy2)(\u0275\u0275inject(PlatformLocation), \u0275\u0275inject(APP_BASE_HREF, 8));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: PathLocationStrategy2,
        factory: PathLocationStrategy2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return PathLocationStrategy2;
})();
var Location = /* @__PURE__ */ (() => {
  class Location2 {
    constructor(locationStrategy) {
      this._subject = new EventEmitter();
      this._urlChangeListeners = [];
      this._urlChangeSubscription = null;
      this._locationStrategy = locationStrategy;
      const baseHref = this._locationStrategy.getBaseHref();
      this._basePath = _stripOrigin(stripTrailingSlash(_stripIndexHtml(baseHref)));
      this._locationStrategy.onPopState((ev) => {
        this._subject.emit({
          "url": this.path(true),
          "pop": true,
          "state": ev.state,
          "type": ev.type
        });
      });
    }
    /** @nodoc */
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe();
      this._urlChangeListeners = [];
    }
    /**
     * Normalizes the URL path for this location.
     *
     * @param includeHash True to include an anchor fragment in the path.
     *
     * @returns The normalized URL path.
     */
    // TODO: vsavkin. Remove the boolean flag and always include hash once the deprecated router is
    // removed.
    path(includeHash = false) {
      return this.normalize(this._locationStrategy.path(includeHash));
    }
    /**
     * Reports the current state of the location history.
     * @returns The current value of the `history.state` object.
     */
    getState() {
      return this._locationStrategy.getState();
    }
    /**
     * Normalizes the given path and compares to the current normalized path.
     *
     * @param path The given URL path.
     * @param query Query parameters.
     *
     * @returns True if the given URL path is equal to the current normalized path, false
     * otherwise.
     */
    isCurrentPathEqualTo(path, query = "") {
      return this.path() == this.normalize(path + normalizeQueryParams(query));
    }
    /**
     * Normalizes a URL path by stripping any trailing slashes.
     *
     * @param url String representing a URL.
     *
     * @returns The normalized URL string.
     */
    normalize(url) {
      return Location2.stripTrailingSlash(_stripBasePath(this._basePath, _stripIndexHtml(url)));
    }
    /**
     * Normalizes an external URL path.
     * If the given URL doesn't begin with a leading slash (`'/'`), adds one
     * before normalizing. Adds a hash if `HashLocationStrategy` is
     * in use, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.
     *
     * @param url String representing a URL.
     *
     * @returns  A normalized platform-specific URL.
     */
    prepareExternalUrl(url) {
      if (url && url[0] !== "/") {
        url = "/" + url;
      }
      return this._locationStrategy.prepareExternalUrl(url);
    }
    // TODO: rename this method to pushState
    /**
     * Changes the browser's URL to a normalized version of a given URL, and pushes a
     * new item onto the platform's history.
     *
     * @param path  URL path to normalize.
     * @param query Query parameters.
     * @param state Location history state.
     *
     */
    go(path, query = "", state = null) {
      this._locationStrategy.pushState(state, "", path, query);
      this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
    }
    /**
     * Changes the browser's URL to a normalized version of the given URL, and replaces
     * the top item on the platform's history stack.
     *
     * @param path  URL path to normalize.
     * @param query Query parameters.
     * @param state Location history state.
     */
    replaceState(path, query = "", state = null) {
      this._locationStrategy.replaceState(state, "", path, query);
      this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
    }
    /**
     * Navigates forward in the platform's history.
     */
    forward() {
      this._locationStrategy.forward();
    }
    /**
     * Navigates back in the platform's history.
     */
    back() {
      this._locationStrategy.back();
    }
    /**
     * Navigate to a specific page from session history, identified by its relative position to the
     * current page.
     *
     * @param relativePosition  Position of the target page in the history relative to the current
     *     page.
     * A negative value moves backwards, a positive value moves forwards, e.g. `location.historyGo(2)`
     * moves forward two pages and `location.historyGo(-2)` moves back two pages. When we try to go
     * beyond what's stored in the history session, we stay in the current page. Same behaviour occurs
     * when `relativePosition` equals 0.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/History_API#Moving_to_a_specific_point_in_history
     */
    historyGo(relativePosition = 0) {
      this._locationStrategy.historyGo?.(relativePosition);
    }
    /**
     * Registers a URL change listener. Use to catch updates performed by the Angular
     * framework that are not detectible through "popstate" or "hashchange" events.
     *
     * @param fn The change handler function, which take a URL and a location history state.
     * @returns A function that, when executed, unregisters a URL change listener.
     */
    onUrlChange(fn) {
      this._urlChangeListeners.push(fn);
      if (!this._urlChangeSubscription) {
        this._urlChangeSubscription = this.subscribe((v) => {
          this._notifyUrlChangeListeners(v.url, v.state);
        });
      }
      return () => {
        const fnIndex = this._urlChangeListeners.indexOf(fn);
        this._urlChangeListeners.splice(fnIndex, 1);
        if (this._urlChangeListeners.length === 0) {
          this._urlChangeSubscription?.unsubscribe();
          this._urlChangeSubscription = null;
        }
      };
    }
    /** @internal */
    _notifyUrlChangeListeners(url = "", state) {
      this._urlChangeListeners.forEach((fn) => fn(url, state));
    }
    /**
     * Subscribes to the platform's `popState` events.
     *
     * Note: `Location.go()` does not trigger the `popState` event in the browser. Use
     * `Location.onUrlChange()` to subscribe to URL changes instead.
     *
     * @param value Event that is triggered when the state history changes.
     * @param exception The exception to throw.
     *
     * @see [onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
     *
     * @returns Subscribed events.
     */
    subscribe(onNext, onThrow, onReturn) {
      return this._subject.subscribe({
        next: onNext,
        error: onThrow,
        complete: onReturn
      });
    }
    static {
      this.normalizeQueryParams = normalizeQueryParams;
    }
    static {
      this.joinWithSlash = joinWithSlash;
    }
    static {
      this.stripTrailingSlash = stripTrailingSlash;
    }
    static {
      this.\u0275fac = function Location_Factory(t) {
        return new (t || Location2)(\u0275\u0275inject(LocationStrategy));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: Location2,
        factory: function() {
          return createLocation();
        },
        providedIn: "root"
      });
    }
  }
  return Location2;
})();
function createLocation() {
  return new Location(\u0275\u0275inject(LocationStrategy));
}
function _stripBasePath(basePath, url) {
  if (!basePath || !url.startsWith(basePath)) {
    return url;
  }
  const strippedUrl = url.substring(basePath.length);
  if (strippedUrl === "" || ["/", ";", "?", "#"].includes(strippedUrl[0])) {
    return strippedUrl;
  }
  return url;
}
function _stripIndexHtml(url) {
  return url.replace(/\/index.html$/, "");
}
function _stripOrigin(baseHref) {
  const isAbsoluteUrl2 = new RegExp("^(https?:)?//").test(baseHref);
  if (isAbsoluteUrl2) {
    const [, pathname] = baseHref.split(/\/\/[^\/]+/);
    return pathname;
  }
  return baseHref;
}
var FormStyle = /* @__PURE__ */ function(FormStyle2) {
  FormStyle2[FormStyle2["Format"] = 0] = "Format";
  FormStyle2[FormStyle2["Standalone"] = 1] = "Standalone";
  return FormStyle2;
}(FormStyle || {});
var TranslationWidth = /* @__PURE__ */ function(TranslationWidth2) {
  TranslationWidth2[TranslationWidth2["Narrow"] = 0] = "Narrow";
  TranslationWidth2[TranslationWidth2["Abbreviated"] = 1] = "Abbreviated";
  TranslationWidth2[TranslationWidth2["Wide"] = 2] = "Wide";
  TranslationWidth2[TranslationWidth2["Short"] = 3] = "Short";
  return TranslationWidth2;
}(TranslationWidth || {});
var FormatWidth = /* @__PURE__ */ function(FormatWidth2) {
  FormatWidth2[FormatWidth2["Short"] = 0] = "Short";
  FormatWidth2[FormatWidth2["Medium"] = 1] = "Medium";
  FormatWidth2[FormatWidth2["Long"] = 2] = "Long";
  FormatWidth2[FormatWidth2["Full"] = 3] = "Full";
  return FormatWidth2;
}(FormatWidth || {});
var NumberSymbol = /* @__PURE__ */ function(NumberSymbol2) {
  NumberSymbol2[NumberSymbol2["Decimal"] = 0] = "Decimal";
  NumberSymbol2[NumberSymbol2["Group"] = 1] = "Group";
  NumberSymbol2[NumberSymbol2["List"] = 2] = "List";
  NumberSymbol2[NumberSymbol2["PercentSign"] = 3] = "PercentSign";
  NumberSymbol2[NumberSymbol2["PlusSign"] = 4] = "PlusSign";
  NumberSymbol2[NumberSymbol2["MinusSign"] = 5] = "MinusSign";
  NumberSymbol2[NumberSymbol2["Exponential"] = 6] = "Exponential";
  NumberSymbol2[NumberSymbol2["SuperscriptingExponent"] = 7] = "SuperscriptingExponent";
  NumberSymbol2[NumberSymbol2["PerMille"] = 8] = "PerMille";
  NumberSymbol2[NumberSymbol2["Infinity"] = 9] = "Infinity";
  NumberSymbol2[NumberSymbol2["NaN"] = 10] = "NaN";
  NumberSymbol2[NumberSymbol2["TimeSeparator"] = 11] = "TimeSeparator";
  NumberSymbol2[NumberSymbol2["CurrencyDecimal"] = 12] = "CurrencyDecimal";
  NumberSymbol2[NumberSymbol2["CurrencyGroup"] = 13] = "CurrencyGroup";
  return NumberSymbol2;
}(NumberSymbol || {});
function getLocaleId(locale) {
  return findLocaleData(locale)[LocaleDataIndex.LocaleId];
}
function getLocaleDayPeriods(locale, formStyle, width) {
  const data = findLocaleData(locale);
  const amPmData = [data[LocaleDataIndex.DayPeriodsFormat], data[LocaleDataIndex.DayPeriodsStandalone]];
  const amPm = getLastDefinedValue(amPmData, formStyle);
  return getLastDefinedValue(amPm, width);
}
function getLocaleDayNames(locale, formStyle, width) {
  const data = findLocaleData(locale);
  const daysData = [data[LocaleDataIndex.DaysFormat], data[LocaleDataIndex.DaysStandalone]];
  const days = getLastDefinedValue(daysData, formStyle);
  return getLastDefinedValue(days, width);
}
function getLocaleMonthNames(locale, formStyle, width) {
  const data = findLocaleData(locale);
  const monthsData = [data[LocaleDataIndex.MonthsFormat], data[LocaleDataIndex.MonthsStandalone]];
  const months = getLastDefinedValue(monthsData, formStyle);
  return getLastDefinedValue(months, width);
}
function getLocaleEraNames(locale, width) {
  const data = findLocaleData(locale);
  const erasData = data[LocaleDataIndex.Eras];
  return getLastDefinedValue(erasData, width);
}
function getLocaleDateFormat(locale, width) {
  const data = findLocaleData(locale);
  return getLastDefinedValue(data[LocaleDataIndex.DateFormat], width);
}
function getLocaleTimeFormat(locale, width) {
  const data = findLocaleData(locale);
  return getLastDefinedValue(data[LocaleDataIndex.TimeFormat], width);
}
function getLocaleDateTimeFormat(locale, width) {
  const data = findLocaleData(locale);
  const dateTimeFormatData = data[LocaleDataIndex.DateTimeFormat];
  return getLastDefinedValue(dateTimeFormatData, width);
}
function getLocaleNumberSymbol(locale, symbol) {
  const data = findLocaleData(locale);
  const res = data[LocaleDataIndex.NumberSymbols][symbol];
  if (typeof res === "undefined") {
    if (symbol === NumberSymbol.CurrencyDecimal) {
      return data[LocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
    } else if (symbol === NumberSymbol.CurrencyGroup) {
      return data[LocaleDataIndex.NumberSymbols][NumberSymbol.Group];
    }
  }
  return res;
}
function checkFullData(data) {
  if (!data[LocaleDataIndex.ExtraData]) {
    throw new Error(`Missing extra locale data for the locale "${data[LocaleDataIndex.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`);
  }
}
function getLocaleExtraDayPeriodRules(locale) {
  const data = findLocaleData(locale);
  checkFullData(data);
  const rules = data[LocaleDataIndex.ExtraData][
    2
    /* ɵExtraLocaleDataIndex.ExtraDayPeriodsRules */
  ] || [];
  return rules.map((rule) => {
    if (typeof rule === "string") {
      return extractTime(rule);
    }
    return [extractTime(rule[0]), extractTime(rule[1])];
  });
}
function getLocaleExtraDayPeriods(locale, formStyle, width) {
  const data = findLocaleData(locale);
  checkFullData(data);
  const dayPeriodsData = [data[LocaleDataIndex.ExtraData][
    0
    /* ɵExtraLocaleDataIndex.ExtraDayPeriodFormats */
  ], data[LocaleDataIndex.ExtraData][
    1
    /* ɵExtraLocaleDataIndex.ExtraDayPeriodStandalone */
  ]];
  const dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
  return getLastDefinedValue(dayPeriods, width) || [];
}
function getLastDefinedValue(data, index) {
  for (let i = index; i > -1; i--) {
    if (typeof data[i] !== "undefined") {
      return data[i];
    }
  }
  throw new Error("Locale data API: locale data undefined");
}
function extractTime(time) {
  const [h, m] = time.split(":");
  return {
    hours: +h,
    minutes: +m
  };
}
var ISO8601_DATE_REGEX = /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
var NAMED_FORMATS = {};
var DATE_FORMATS_SPLIT = /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
var ZoneWidth = /* @__PURE__ */ function(ZoneWidth2) {
  ZoneWidth2[ZoneWidth2["Short"] = 0] = "Short";
  ZoneWidth2[ZoneWidth2["ShortGMT"] = 1] = "ShortGMT";
  ZoneWidth2[ZoneWidth2["Long"] = 2] = "Long";
  ZoneWidth2[ZoneWidth2["Extended"] = 3] = "Extended";
  return ZoneWidth2;
}(ZoneWidth || {});
var DateType = /* @__PURE__ */ function(DateType2) {
  DateType2[DateType2["FullYear"] = 0] = "FullYear";
  DateType2[DateType2["Month"] = 1] = "Month";
  DateType2[DateType2["Date"] = 2] = "Date";
  DateType2[DateType2["Hours"] = 3] = "Hours";
  DateType2[DateType2["Minutes"] = 4] = "Minutes";
  DateType2[DateType2["Seconds"] = 5] = "Seconds";
  DateType2[DateType2["FractionalSeconds"] = 6] = "FractionalSeconds";
  DateType2[DateType2["Day"] = 7] = "Day";
  return DateType2;
}(DateType || {});
var TranslationType = /* @__PURE__ */ function(TranslationType2) {
  TranslationType2[TranslationType2["DayPeriods"] = 0] = "DayPeriods";
  TranslationType2[TranslationType2["Days"] = 1] = "Days";
  TranslationType2[TranslationType2["Months"] = 2] = "Months";
  TranslationType2[TranslationType2["Eras"] = 3] = "Eras";
  return TranslationType2;
}(TranslationType || {});
function formatDate(value, format, locale, timezone) {
  let date = toDate(value);
  const namedFormat = getNamedFormat(locale, format);
  format = namedFormat || format;
  let parts = [];
  let match;
  while (format) {
    match = DATE_FORMATS_SPLIT.exec(format);
    if (match) {
      parts = parts.concat(match.slice(1));
      const part = parts.pop();
      if (!part) {
        break;
      }
      format = part;
    } else {
      parts.push(format);
      break;
    }
  }
  let dateTimezoneOffset = date.getTimezoneOffset();
  if (timezone) {
    dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
    date = convertTimezoneToLocal(date, timezone, true);
  }
  let text = "";
  parts.forEach((value2) => {
    const dateFormatter = getDateFormatter(value2);
    text += dateFormatter ? dateFormatter(date, locale, dateTimezoneOffset) : value2 === "''" ? "'" : value2.replace(/(^'|'$)/g, "").replace(/''/g, "'");
  });
  return text;
}
function createDate(year, month, date) {
  const newDate = /* @__PURE__ */ new Date(0);
  newDate.setFullYear(year, month, date);
  newDate.setHours(0, 0, 0);
  return newDate;
}
function getNamedFormat(locale, format) {
  const localeId = getLocaleId(locale);
  NAMED_FORMATS[localeId] = NAMED_FORMATS[localeId] || {};
  if (NAMED_FORMATS[localeId][format]) {
    return NAMED_FORMATS[localeId][format];
  }
  let formatValue2 = "";
  switch (format) {
    case "shortDate":
      formatValue2 = getLocaleDateFormat(locale, FormatWidth.Short);
      break;
    case "mediumDate":
      formatValue2 = getLocaleDateFormat(locale, FormatWidth.Medium);
      break;
    case "longDate":
      formatValue2 = getLocaleDateFormat(locale, FormatWidth.Long);
      break;
    case "fullDate":
      formatValue2 = getLocaleDateFormat(locale, FormatWidth.Full);
      break;
    case "shortTime":
      formatValue2 = getLocaleTimeFormat(locale, FormatWidth.Short);
      break;
    case "mediumTime":
      formatValue2 = getLocaleTimeFormat(locale, FormatWidth.Medium);
      break;
    case "longTime":
      formatValue2 = getLocaleTimeFormat(locale, FormatWidth.Long);
      break;
    case "fullTime":
      formatValue2 = getLocaleTimeFormat(locale, FormatWidth.Full);
      break;
    case "short":
      const shortTime = getNamedFormat(locale, "shortTime");
      const shortDate = getNamedFormat(locale, "shortDate");
      formatValue2 = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Short), [shortTime, shortDate]);
      break;
    case "medium":
      const mediumTime = getNamedFormat(locale, "mediumTime");
      const mediumDate = getNamedFormat(locale, "mediumDate");
      formatValue2 = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Medium), [mediumTime, mediumDate]);
      break;
    case "long":
      const longTime = getNamedFormat(locale, "longTime");
      const longDate = getNamedFormat(locale, "longDate");
      formatValue2 = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Long), [longTime, longDate]);
      break;
    case "full":
      const fullTime = getNamedFormat(locale, "fullTime");
      const fullDate = getNamedFormat(locale, "fullDate");
      formatValue2 = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Full), [fullTime, fullDate]);
      break;
  }
  if (formatValue2) {
    NAMED_FORMATS[localeId][format] = formatValue2;
  }
  return formatValue2;
}
function formatDateTime(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{([^}]+)}/g, function(match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
}
function padNumber(num, digits, minusSign = "-", trim, negWrap) {
  let neg = "";
  if (num < 0 || negWrap && num <= 0) {
    if (negWrap) {
      num = -num + 1;
    } else {
      num = -num;
      neg = minusSign;
    }
  }
  let strNum = String(num);
  while (strNum.length < digits) {
    strNum = "0" + strNum;
  }
  if (trim) {
    strNum = strNum.slice(strNum.length - digits);
  }
  return neg + strNum;
}
function formatFractionalSeconds(milliseconds, digits) {
  const strMs = padNumber(milliseconds, 3);
  return strMs.substring(0, digits);
}
function dateGetter(name, size, offset = 0, trim = false, negWrap = false) {
  return function(date, locale) {
    let part = getDatePart(name, date);
    if (offset > 0 || part > -offset) {
      part += offset;
    }
    if (name === DateType.Hours) {
      if (part === 0 && offset === -12) {
        part = 12;
      }
    } else if (name === DateType.FractionalSeconds) {
      return formatFractionalSeconds(part, size);
    }
    const localeMinus = getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
    return padNumber(part, size, localeMinus, trim, negWrap);
  };
}
function getDatePart(part, date) {
  switch (part) {
    case DateType.FullYear:
      return date.getFullYear();
    case DateType.Month:
      return date.getMonth();
    case DateType.Date:
      return date.getDate();
    case DateType.Hours:
      return date.getHours();
    case DateType.Minutes:
      return date.getMinutes();
    case DateType.Seconds:
      return date.getSeconds();
    case DateType.FractionalSeconds:
      return date.getMilliseconds();
    case DateType.Day:
      return date.getDay();
    default:
      throw new Error(`Unknown DateType value "${part}".`);
  }
}
function dateStrGetter(name, width, form = FormStyle.Format, extended = false) {
  return function(date, locale) {
    return getDateTranslation(date, locale, name, width, form, extended);
  };
}
function getDateTranslation(date, locale, name, width, form, extended) {
  switch (name) {
    case TranslationType.Months:
      return getLocaleMonthNames(locale, form, width)[date.getMonth()];
    case TranslationType.Days:
      return getLocaleDayNames(locale, form, width)[date.getDay()];
    case TranslationType.DayPeriods:
      const currentHours = date.getHours();
      const currentMinutes = date.getMinutes();
      if (extended) {
        const rules = getLocaleExtraDayPeriodRules(locale);
        const dayPeriods = getLocaleExtraDayPeriods(locale, form, width);
        const index = rules.findIndex((rule) => {
          if (Array.isArray(rule)) {
            const [from2, to] = rule;
            const afterFrom = currentHours >= from2.hours && currentMinutes >= from2.minutes;
            const beforeTo = currentHours < to.hours || currentHours === to.hours && currentMinutes < to.minutes;
            if (from2.hours < to.hours) {
              if (afterFrom && beforeTo) {
                return true;
              }
            } else if (afterFrom || beforeTo) {
              return true;
            }
          } else {
            if (rule.hours === currentHours && rule.minutes === currentMinutes) {
              return true;
            }
          }
          return false;
        });
        if (index !== -1) {
          return dayPeriods[index];
        }
      }
      return getLocaleDayPeriods(locale, form, width)[currentHours < 12 ? 0 : 1];
    case TranslationType.Eras:
      return getLocaleEraNames(locale, width)[date.getFullYear() <= 0 ? 0 : 1];
    default:
      const unexpected = name;
      throw new Error(`unexpected translation type ${unexpected}`);
  }
}
function timeZoneGetter(width) {
  return function(date, locale, offset) {
    const zone = -1 * offset;
    const minusSign = getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
    const hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);
    switch (width) {
      case ZoneWidth.Short:
        return (zone >= 0 ? "+" : "") + padNumber(hours, 2, minusSign) + padNumber(Math.abs(zone % 60), 2, minusSign);
      case ZoneWidth.ShortGMT:
        return "GMT" + (zone >= 0 ? "+" : "") + padNumber(hours, 1, minusSign);
      case ZoneWidth.Long:
        return "GMT" + (zone >= 0 ? "+" : "") + padNumber(hours, 2, minusSign) + ":" + padNumber(Math.abs(zone % 60), 2, minusSign);
      case ZoneWidth.Extended:
        if (offset === 0) {
          return "Z";
        } else {
          return (zone >= 0 ? "+" : "") + padNumber(hours, 2, minusSign) + ":" + padNumber(Math.abs(zone % 60), 2, minusSign);
        }
      default:
        throw new Error(`Unknown zone width "${width}"`);
    }
  };
}
var JANUARY = 0;
var THURSDAY = 4;
function getFirstThursdayOfYear(year) {
  const firstDayOfYear = createDate(year, JANUARY, 1).getDay();
  return createDate(year, 0, 1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
}
function getThursdayThisWeek(datetime) {
  return createDate(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (THURSDAY - datetime.getDay()));
}
function weekGetter(size, monthBased = false) {
  return function(date, locale) {
    let result;
    if (monthBased) {
      const nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
      const today = date.getDate();
      result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
    } else {
      const thisThurs = getThursdayThisWeek(date);
      const firstThurs = getFirstThursdayOfYear(thisThurs.getFullYear());
      const diff = thisThurs.getTime() - firstThurs.getTime();
      result = 1 + Math.round(diff / 6048e5);
    }
    return padNumber(result, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
  };
}
function weekNumberingYearGetter(size, trim = false) {
  return function(date, locale) {
    const thisThurs = getThursdayThisWeek(date);
    const weekNumberingYear = thisThurs.getFullYear();
    return padNumber(weekNumberingYear, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign), trim);
  };
}
var DATE_FORMATS = {};
function getDateFormatter(format) {
  if (DATE_FORMATS[format]) {
    return DATE_FORMATS[format];
  }
  let formatter;
  switch (format) {
    case "G":
    case "GG":
    case "GGG":
      formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Abbreviated);
      break;
    case "GGGG":
      formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Wide);
      break;
    case "GGGGG":
      formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Narrow);
      break;
    case "y":
      formatter = dateGetter(DateType.FullYear, 1, 0, false, true);
      break;
    case "yy":
      formatter = dateGetter(DateType.FullYear, 2, 0, true, true);
      break;
    case "yyy":
      formatter = dateGetter(DateType.FullYear, 3, 0, false, true);
      break;
    case "yyyy":
      formatter = dateGetter(DateType.FullYear, 4, 0, false, true);
      break;
    case "Y":
      formatter = weekNumberingYearGetter(1);
      break;
    case "YY":
      formatter = weekNumberingYearGetter(2, true);
      break;
    case "YYY":
      formatter = weekNumberingYearGetter(3);
      break;
    case "YYYY":
      formatter = weekNumberingYearGetter(4);
      break;
    case "M":
    case "L":
      formatter = dateGetter(DateType.Month, 1, 1);
      break;
    case "MM":
    case "LL":
      formatter = dateGetter(DateType.Month, 2, 1);
      break;
    case "MMM":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Abbreviated);
      break;
    case "MMMM":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Wide);
      break;
    case "MMMMM":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Narrow);
      break;
    case "LLL":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Abbreviated, FormStyle.Standalone);
      break;
    case "LLLL":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Wide, FormStyle.Standalone);
      break;
    case "LLLLL":
      formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Narrow, FormStyle.Standalone);
      break;
    case "w":
      formatter = weekGetter(1);
      break;
    case "ww":
      formatter = weekGetter(2);
      break;
    case "W":
      formatter = weekGetter(1, true);
      break;
    case "d":
      formatter = dateGetter(DateType.Date, 1);
      break;
    case "dd":
      formatter = dateGetter(DateType.Date, 2);
      break;
    case "c":
    case "cc":
      formatter = dateGetter(DateType.Day, 1);
      break;
    case "ccc":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Abbreviated, FormStyle.Standalone);
      break;
    case "cccc":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Wide, FormStyle.Standalone);
      break;
    case "ccccc":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Narrow, FormStyle.Standalone);
      break;
    case "cccccc":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Short, FormStyle.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Abbreviated);
      break;
    case "EEEE":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Wide);
      break;
    case "EEEEE":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Narrow);
      break;
    case "EEEEEE":
      formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated);
      break;
    case "aaaa":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide);
      break;
    case "aaaaa":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated, FormStyle.Standalone, true);
      break;
    case "bbbb":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide, FormStyle.Standalone, true);
      break;
    case "bbbbb":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow, FormStyle.Standalone, true);
      break;
    case "B":
    case "BB":
    case "BBB":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated, FormStyle.Format, true);
      break;
    case "BBBB":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide, FormStyle.Format, true);
      break;
    case "BBBBB":
      formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow, FormStyle.Format, true);
      break;
    case "h":
      formatter = dateGetter(DateType.Hours, 1, -12);
      break;
    case "hh":
      formatter = dateGetter(DateType.Hours, 2, -12);
      break;
    case "H":
      formatter = dateGetter(DateType.Hours, 1);
      break;
    case "HH":
      formatter = dateGetter(DateType.Hours, 2);
      break;
    case "m":
      formatter = dateGetter(DateType.Minutes, 1);
      break;
    case "mm":
      formatter = dateGetter(DateType.Minutes, 2);
      break;
    case "s":
      formatter = dateGetter(DateType.Seconds, 1);
      break;
    case "ss":
      formatter = dateGetter(DateType.Seconds, 2);
      break;
    case "S":
      formatter = dateGetter(DateType.FractionalSeconds, 1);
      break;
    case "SS":
      formatter = dateGetter(DateType.FractionalSeconds, 2);
      break;
    case "SSS":
      formatter = dateGetter(DateType.FractionalSeconds, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      formatter = timeZoneGetter(ZoneWidth.Short);
      break;
    case "ZZZZZ":
      formatter = timeZoneGetter(ZoneWidth.Extended);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      formatter = timeZoneGetter(ZoneWidth.ShortGMT);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      formatter = timeZoneGetter(ZoneWidth.Long);
      break;
    default:
      return null;
  }
  DATE_FORMATS[format] = formatter;
  return formatter;
}
function timezoneToOffset(timezone, fallback) {
  timezone = timezone.replace(/:/g, "");
  const requestedTimezoneOffset = Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 6e4;
  return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
}
function addDateMinutes(date, minutes) {
  date = new Date(date.getTime());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}
function convertTimezoneToLocal(date, timezone, reverse) {
  const reverseValue = reverse ? -1 : 1;
  const dateTimezoneOffset = date.getTimezoneOffset();
  const timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
  return addDateMinutes(date, reverseValue * (timezoneOffset - dateTimezoneOffset));
}
function toDate(value) {
  if (isDate(value)) {
    return value;
  }
  if (typeof value === "number" && !isNaN(value)) {
    return new Date(value);
  }
  if (typeof value === "string") {
    value = value.trim();
    if (/^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(value)) {
      const [y, m = 1, d = 1] = value.split("-").map((val) => +val);
      return createDate(y, m - 1, d);
    }
    const parsedNb = parseFloat(value);
    if (!isNaN(value - parsedNb)) {
      return new Date(parsedNb);
    }
    let match;
    if (match = value.match(ISO8601_DATE_REGEX)) {
      return isoStringToDate(match);
    }
  }
  const date = new Date(value);
  if (!isDate(date)) {
    throw new Error(`Unable to convert "${value}" into a date`);
  }
  return date;
}
function isoStringToDate(match) {
  const date = /* @__PURE__ */ new Date(0);
  let tzHour = 0;
  let tzMin = 0;
  const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
  const timeSetter = match[8] ? date.setUTCHours : date.setHours;
  if (match[9]) {
    tzHour = Number(match[9] + match[10]);
    tzMin = Number(match[9] + match[11]);
  }
  dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const h = Number(match[4] || 0) - tzHour;
  const m = Number(match[5] || 0) - tzMin;
  const s = Number(match[6] || 0);
  const ms = Math.floor(parseFloat("0." + (match[7] || 0)) * 1e3);
  timeSetter.call(date, h, m, s, ms);
  return date;
}
function isDate(value) {
  return value instanceof Date && !isNaN(value.valueOf());
}
function parseCookieValue(cookieStr, name) {
  name = encodeURIComponent(name);
  for (const cookie of cookieStr.split(";")) {
    const eqIndex = cookie.indexOf("=");
    const [cookieName, cookieValue] = eqIndex == -1 ? [cookie, ""] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
var WS_REGEXP = /\s+/;
var EMPTY_ARRAY2 = [];
var NgClass = /* @__PURE__ */ (() => {
  class NgClass2 {
    constructor(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
      this._iterableDiffers = _iterableDiffers;
      this._keyValueDiffers = _keyValueDiffers;
      this._ngEl = _ngEl;
      this._renderer = _renderer;
      this.initialClasses = EMPTY_ARRAY2;
      this.stateMap = /* @__PURE__ */ new Map();
    }
    set klass(value) {
      this.initialClasses = value != null ? value.trim().split(WS_REGEXP) : EMPTY_ARRAY2;
    }
    set ngClass(value) {
      this.rawClass = typeof value === "string" ? value.trim().split(WS_REGEXP) : value;
    }
    /*
    The NgClass directive uses the custom change detection algorithm for its inputs. The custom
    algorithm is necessary since inputs are represented as complex object or arrays that need to be
    deeply-compared.
       This algorithm is perf-sensitive since NgClass is used very frequently and its poor performance
    might negatively impact runtime performance of the entire change detection cycle. The design of
    this algorithm is making sure that:
    - there is no unnecessary DOM manipulation (CSS classes are added / removed from the DOM only when
    needed), even if references to bound objects change;
    - there is no memory allocation if nothing changes (even relatively modest memory allocation
    during the change detection cycle can result in GC pauses for some of the CD cycles).
       The algorithm works by iterating over the set of bound classes, staring with [class] binding and
    then going over [ngClass] binding. For each CSS class name:
    - check if it was seen before (this information is tracked in the state map) and if its value
    changed;
    - mark it as "touched" - names that are not marked are not present in the latest set of binding
    and we can remove such class name from the internal data structures;
       After iteration over all the CSS class names we've got data structure with all the information
    necessary to synchronize changes to the DOM - it is enough to iterate over the state map, flush
    changes to the DOM and reset internal data structures so those are ready for the next change
    detection cycle.
     */
    ngDoCheck() {
      for (const klass of this.initialClasses) {
        this._updateState(klass, true);
      }
      const rawClass = this.rawClass;
      if (Array.isArray(rawClass) || rawClass instanceof Set) {
        for (const klass of rawClass) {
          this._updateState(klass, true);
        }
      } else if (rawClass != null) {
        for (const klass of Object.keys(rawClass)) {
          this._updateState(klass, Boolean(rawClass[klass]));
        }
      }
      this._applyStateDiff();
    }
    _updateState(klass, nextEnabled) {
      const state = this.stateMap.get(klass);
      if (state !== void 0) {
        if (state.enabled !== nextEnabled) {
          state.changed = true;
          state.enabled = nextEnabled;
        }
        state.touched = true;
      } else {
        this.stateMap.set(klass, {
          enabled: nextEnabled,
          changed: true,
          touched: true
        });
      }
    }
    _applyStateDiff() {
      for (const stateEntry of this.stateMap) {
        const klass = stateEntry[0];
        const state = stateEntry[1];
        if (state.changed) {
          this._toggleClass(klass, state.enabled);
          state.changed = false;
        } else if (!state.touched) {
          if (state.enabled) {
            this._toggleClass(klass, false);
          }
          this.stateMap.delete(klass);
        }
        state.touched = false;
      }
    }
    _toggleClass(klass, enabled) {
      if (ngDevMode) {
        if (typeof klass !== "string") {
          throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${stringify(klass)}`);
        }
      }
      klass = klass.trim();
      if (klass.length > 0) {
        klass.split(WS_REGEXP).forEach((klass2) => {
          if (enabled) {
            this._renderer.addClass(this._ngEl.nativeElement, klass2);
          } else {
            this._renderer.removeClass(this._ngEl.nativeElement, klass2);
          }
        });
      }
    }
    static {
      this.\u0275fac = function NgClass_Factory(t) {
        return new (t || NgClass2)(\u0275\u0275directiveInject(IterableDiffers), \u0275\u0275directiveInject(KeyValueDiffers), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2));
      };
    }
    static {
      this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
        type: NgClass2,
        selectors: [["", "ngClass", ""]],
        inputs: {
          klass: ["class", "klass"],
          ngClass: "ngClass"
        },
        standalone: true
      });
    }
  }
  return NgClass2;
})();
var NgForOfContext = class {
  constructor($implicit, ngForOf, index, count) {
    this.$implicit = $implicit;
    this.ngForOf = ngForOf;
    this.index = index;
    this.count = count;
  }
  get first() {
    return this.index === 0;
  }
  get last() {
    return this.index === this.count - 1;
  }
  get even() {
    return this.index % 2 === 0;
  }
  get odd() {
    return !this.even;
  }
};
var NgForOf = /* @__PURE__ */ (() => {
  class NgForOf2 {
    /**
     * The value of the iterable expression, which can be used as a
     * [template input variable](guide/structural-directives#shorthand).
     */
    set ngForOf(ngForOf) {
      this._ngForOf = ngForOf;
      this._ngForOfDirty = true;
    }
    /**
     * Specifies a custom `TrackByFunction` to compute the identity of items in an iterable.
     *
     * If a custom `TrackByFunction` is not provided, `NgForOf` will use the item's [object
     * identity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
     * as the key.
     *
     * `NgForOf` uses the computed key to associate items in an iterable with DOM elements
     * it produces for these items.
     *
     * A custom `TrackByFunction` is useful to provide good user experience in cases when items in an
     * iterable rendered using `NgForOf` have a natural identifier (for example, custom ID or a
     * primary key), and this iterable could be updated with new object instances that still
     * represent the same underlying entity (for example, when data is re-fetched from the server,
     * and the iterable is recreated and re-rendered, but most of the data is still the same).
     *
     * @see {@link TrackByFunction}
     */
    set ngForTrackBy(fn) {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && fn != null && typeof fn !== "function") {
        console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}. See https://angular.io/api/common/NgForOf#change-propagation for more information.`);
      }
      this._trackByFn = fn;
    }
    get ngForTrackBy() {
      return this._trackByFn;
    }
    constructor(_viewContainer, _template, _differs) {
      this._viewContainer = _viewContainer;
      this._template = _template;
      this._differs = _differs;
      this._ngForOf = null;
      this._ngForOfDirty = true;
      this._differ = null;
    }
    /**
     * A reference to the template that is stamped out for each item in the iterable.
     * @see [template reference variable](guide/template-reference-variables)
     */
    set ngForTemplate(value) {
      if (value) {
        this._template = value;
      }
    }
    /**
     * Applies the changes when needed.
     * @nodoc
     */
    ngDoCheck() {
      if (this._ngForOfDirty) {
        this._ngForOfDirty = false;
        const value = this._ngForOf;
        if (!this._differ && value) {
          if (typeof ngDevMode === "undefined" || ngDevMode) {
            try {
              this._differ = this._differs.find(value).create(this.ngForTrackBy);
            } catch {
              let errorMessage = `Cannot find a differ supporting object '${value}' of type '${getTypeName(value)}'. NgFor only supports binding to Iterables, such as Arrays.`;
              if (typeof value === "object") {
                errorMessage += " Did you mean to use the keyvalue pipe?";
              }
              throw new RuntimeError(-2200, errorMessage);
            }
          } else {
            this._differ = this._differs.find(value).create(this.ngForTrackBy);
          }
        }
      }
      if (this._differ) {
        const changes = this._differ.diff(this._ngForOf);
        if (changes)
          this._applyChanges(changes);
      }
    }
    _applyChanges(changes) {
      const viewContainer = this._viewContainer;
      changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
        if (item.previousIndex == null) {
          viewContainer.createEmbeddedView(this._template, new NgForOfContext(item.item, this._ngForOf, -1, -1), currentIndex === null ? void 0 : currentIndex);
        } else if (currentIndex == null) {
          viewContainer.remove(adjustedPreviousIndex === null ? void 0 : adjustedPreviousIndex);
        } else if (adjustedPreviousIndex !== null) {
          const view = viewContainer.get(adjustedPreviousIndex);
          viewContainer.move(view, currentIndex);
          applyViewChange(view, item);
        }
      });
      for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
        const viewRef = viewContainer.get(i);
        const context2 = viewRef.context;
        context2.index = i;
        context2.count = ilen;
        context2.ngForOf = this._ngForOf;
      }
      changes.forEachIdentityChange((record) => {
        const viewRef = viewContainer.get(record.currentIndex);
        applyViewChange(viewRef, record);
      });
    }
    /**
     * Asserts the correct type of the context for the template that `NgForOf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgForOf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
      return true;
    }
    static {
      this.\u0275fac = function NgForOf_Factory(t) {
        return new (t || NgForOf2)(\u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(TemplateRef), \u0275\u0275directiveInject(IterableDiffers));
      };
    }
    static {
      this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
        type: NgForOf2,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate"
        },
        standalone: true
      });
    }
  }
  return NgForOf2;
})();
function applyViewChange(view, record) {
  view.context.$implicit = record.item;
}
function getTypeName(type) {
  return type["name"] || typeof type;
}
var NgIf = /* @__PURE__ */ (() => {
  class NgIf2 {
    constructor(_viewContainer, templateRef) {
      this._viewContainer = _viewContainer;
      this._context = new NgIfContext();
      this._thenTemplateRef = null;
      this._elseTemplateRef = null;
      this._thenViewRef = null;
      this._elseViewRef = null;
      this._thenTemplateRef = templateRef;
    }
    /**
     * The Boolean expression to evaluate as the condition for showing a template.
     */
    set ngIf(condition) {
      this._context.$implicit = this._context.ngIf = condition;
      this._updateView();
    }
    /**
     * A template to show if the condition expression evaluates to true.
     */
    set ngIfThen(templateRef) {
      assertTemplate("ngIfThen", templateRef);
      this._thenTemplateRef = templateRef;
      this._thenViewRef = null;
      this._updateView();
    }
    /**
     * A template to show if the condition expression evaluates to false.
     */
    set ngIfElse(templateRef) {
      assertTemplate("ngIfElse", templateRef);
      this._elseTemplateRef = templateRef;
      this._elseViewRef = null;
      this._updateView();
    }
    _updateView() {
      if (this._context.$implicit) {
        if (!this._thenViewRef) {
          this._viewContainer.clear();
          this._elseViewRef = null;
          if (this._thenTemplateRef) {
            this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
          }
        }
      } else {
        if (!this._elseViewRef) {
          this._viewContainer.clear();
          this._thenViewRef = null;
          if (this._elseTemplateRef) {
            this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
          }
        }
      }
    }
    /**
     * Asserts the correct type of the context for the template that `NgIf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgIf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
      return true;
    }
    static {
      this.\u0275fac = function NgIf_Factory(t) {
        return new (t || NgIf2)(\u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(TemplateRef));
      };
    }
    static {
      this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
        type: NgIf2,
        selectors: [["", "ngIf", ""]],
        inputs: {
          ngIf: "ngIf",
          ngIfThen: "ngIfThen",
          ngIfElse: "ngIfElse"
        },
        standalone: true
      });
    }
  }
  return NgIf2;
})();
var NgIfContext = class {
  constructor() {
    this.$implicit = null;
    this.ngIf = null;
  }
};
function assertTemplate(property, templateRef) {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}
function invalidPipeArgumentError(type, value) {
  return new RuntimeError(2100, ngDevMode && `InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}
var unicodeWordMatch = /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g;
var TitleCasePipe = /* @__PURE__ */ (() => {
  class TitleCasePipe2 {
    transform(value) {
      if (value == null)
        return null;
      if (typeof value !== "string") {
        throw invalidPipeArgumentError(TitleCasePipe2, value);
      }
      return value.replace(unicodeWordMatch, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
    }
    static {
      this.\u0275fac = function TitleCasePipe_Factory(t) {
        return new (t || TitleCasePipe2)();
      };
    }
    static {
      this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
        name: "titlecase",
        type: TitleCasePipe2,
        pure: true,
        standalone: true
      });
    }
  }
  return TitleCasePipe2;
})();
var DEFAULT_DATE_FORMAT = "mediumDate";
var DATE_PIPE_DEFAULT_TIMEZONE = /* @__PURE__ */ new InjectionToken("DATE_PIPE_DEFAULT_TIMEZONE");
var DATE_PIPE_DEFAULT_OPTIONS = /* @__PURE__ */ new InjectionToken("DATE_PIPE_DEFAULT_OPTIONS");
var DatePipe = /* @__PURE__ */ (() => {
  class DatePipe2 {
    constructor(locale, defaultTimezone, defaultOptions) {
      this.locale = locale;
      this.defaultTimezone = defaultTimezone;
      this.defaultOptions = defaultOptions;
    }
    transform(value, format, timezone, locale) {
      if (value == null || value === "" || value !== value)
        return null;
      try {
        const _format = format ?? this.defaultOptions?.dateFormat ?? DEFAULT_DATE_FORMAT;
        const _timezone = timezone ?? this.defaultOptions?.timezone ?? this.defaultTimezone ?? void 0;
        return formatDate(value, _format, locale || this.locale, _timezone);
      } catch (error) {
        throw invalidPipeArgumentError(DatePipe2, error.message);
      }
    }
    static {
      this.\u0275fac = function DatePipe_Factory(t) {
        return new (t || DatePipe2)(\u0275\u0275directiveInject(LOCALE_ID, 16), \u0275\u0275directiveInject(DATE_PIPE_DEFAULT_TIMEZONE, 24), \u0275\u0275directiveInject(DATE_PIPE_DEFAULT_OPTIONS, 24));
      };
    }
    static {
      this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
        name: "date",
        type: DatePipe2,
        pure: true,
        standalone: true
      });
    }
  }
  return DatePipe2;
})();
var CommonModule = /* @__PURE__ */ (() => {
  class CommonModule2 {
    static {
      this.\u0275fac = function CommonModule_Factory(t) {
        return new (t || CommonModule2)();
      };
    }
    static {
      this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
        type: CommonModule2
      });
    }
    static {
      this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
    }
  }
  return CommonModule2;
})();
var PLATFORM_BROWSER_ID = "browser";
var PLATFORM_SERVER_ID = "server";
function isPlatformServer(platformId) {
  return platformId === PLATFORM_SERVER_ID;
}
var ViewportScroller = /* @__PURE__ */ (() => {
  class ViewportScroller2 {
    static {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: ViewportScroller2,
        providedIn: "root",
        factory: () => new BrowserViewportScroller(\u0275\u0275inject(DOCUMENT2), window)
      });
    }
  }
  return ViewportScroller2;
})();
var BrowserViewportScroller = class {
  constructor(document2, window2) {
    this.document = document2;
    this.window = window2;
    this.offset = () => [0, 0];
  }
  /**
   * Configures the top offset used when scrolling to an anchor.
   * @param offset A position in screen coordinates (a tuple with x and y values)
   * or a function that returns the top offset position.
   *
   */
  setOffset(offset) {
    if (Array.isArray(offset)) {
      this.offset = () => offset;
    } else {
      this.offset = offset;
    }
  }
  /**
   * Retrieves the current scroll position.
   * @returns The position in screen coordinates.
   */
  getScrollPosition() {
    if (this.supportsScrolling()) {
      return [this.window.pageXOffset, this.window.pageYOffset];
    } else {
      return [0, 0];
    }
  }
  /**
   * Sets the scroll position.
   * @param position The new position in screen coordinates.
   */
  scrollToPosition(position) {
    if (this.supportsScrolling()) {
      this.window.scrollTo(position[0], position[1]);
    }
  }
  /**
   * Scrolls to an element and attempts to focus the element.
   *
   * Note that the function name here is misleading in that the target string may be an ID for a
   * non-anchor element.
   *
   * @param target The ID of an element or name of the anchor.
   *
   * @see https://html.spec.whatwg.org/#the-indicated-part-of-the-document
   * @see https://html.spec.whatwg.org/#scroll-to-fragid
   */
  scrollToAnchor(target) {
    if (!this.supportsScrolling()) {
      return;
    }
    const elSelected = findAnchorFromDocument(this.document, target);
    if (elSelected) {
      this.scrollToElement(elSelected);
      elSelected.focus();
    }
  }
  /**
   * Disables automatic scroll restoration provided by the browser.
   */
  setHistoryScrollRestoration(scrollRestoration) {
    if (this.supportsScrolling()) {
      this.window.history.scrollRestoration = scrollRestoration;
    }
  }
  /**
   * Scrolls to an element using the native offset and the specified offset set on this scroller.
   *
   * The offset can be used when we know that there is a floating header and scrolling naively to an
   * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
   */
  scrollToElement(el) {
    const rect = el.getBoundingClientRect();
    const left = rect.left + this.window.pageXOffset;
    const top = rect.top + this.window.pageYOffset;
    const offset = this.offset();
    this.window.scrollTo(left - offset[0], top - offset[1]);
  }
  supportsScrolling() {
    try {
      return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window;
    } catch {
      return false;
    }
  }
};
function findAnchorFromDocument(document2, target) {
  const documentResult = document2.getElementById(target) || document2.getElementsByName(target)[0];
  if (documentResult) {
    return documentResult;
  }
  if (typeof document2.createTreeWalker === "function" && document2.body && typeof document2.body.attachShadow === "function") {
    const treeWalker = document2.createTreeWalker(document2.body, NodeFilter.SHOW_ELEMENT);
    let currentNode = treeWalker.currentNode;
    while (currentNode) {
      const shadowRoot = currentNode.shadowRoot;
      if (shadowRoot) {
        const result = shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${target}"]`);
        if (result) {
          return result;
        }
      }
      currentNode = treeWalker.nextNode();
    }
  }
  return null;
}
var XhrFactory = class {
};
function isAbsoluteUrl(src) {
  return /^https?:\/\//.test(src);
}
function isValidPath(path) {
  const isString = typeof path === "string";
  if (!isString || path.trim() === "") {
    return false;
  }
  try {
    const url = new URL(path);
    return true;
  } catch {
    return false;
  }
}
function normalizePath(path) {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
function normalizeSrc(src) {
  return src.startsWith("/") ? src.slice(1) : src;
}
var noopImageLoader = (config2) => config2.src;
var IMAGE_LOADER = /* @__PURE__ */ new InjectionToken("ImageLoader", {
  providedIn: "root",
  factory: () => noopImageLoader
});
function createImageLoader(buildUrlFn, exampleUrls) {
  return function provideImageLoader(path) {
    if (!isValidPath(path)) {
      throwInvalidPathError(path, exampleUrls || []);
    }
    path = normalizePath(path);
    const loaderFn = (config2) => {
      if (isAbsoluteUrl(config2.src)) {
        throwUnexpectedAbsoluteUrlError(path, config2.src);
      }
      return buildUrlFn(path, __spreadProps(__spreadValues({}, config2), {
        src: normalizeSrc(config2.src)
      }));
    };
    const providers = [{
      provide: IMAGE_LOADER,
      useValue: loaderFn
    }];
    return providers;
  };
}
function throwInvalidPathError(path, exampleUrls) {
  throw new RuntimeError(2959, ngDevMode && `Image loader has detected an invalid path (\`${path}\`). To fix this, supply a path using one of the following formats: ${exampleUrls.join(" or ")}`);
}
function throwUnexpectedAbsoluteUrlError(path, url) {
  throw new RuntimeError(2959, ngDevMode && `Image loader has detected a \`<img>\` tag with an invalid \`ngSrc\` attribute: ${url}. This image loader expects \`ngSrc\` to be a relative URL - however the provided value is an absolute URL. To fix this, provide \`ngSrc\` as a path relative to the base URL configured for this loader (\`${path}\`).`);
}
var provideCloudflareLoader = /* @__PURE__ */ createImageLoader(createCloudflareUrl, ngDevMode ? ["https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>"] : void 0);
function createCloudflareUrl(path, config2) {
  let params = `format=auto`;
  if (config2.width) {
    params += `,width=${config2.width}`;
  }
  return `${path}/cdn-cgi/image/${params}/${config2.src}`;
}
var provideCloudinaryLoader = /* @__PURE__ */ createImageLoader(createCloudinaryUrl, ngDevMode ? ["https://res.cloudinary.com/mysite", "https://mysite.cloudinary.com", "https://subdomain.mysite.com"] : void 0);
function createCloudinaryUrl(path, config2) {
  let params = `f_auto,q_auto`;
  if (config2.width) {
    params += `,w_${config2.width}`;
  }
  return `${path}/image/upload/${params}/${config2.src}`;
}
var provideImageKitLoader = /* @__PURE__ */ createImageLoader(createImagekitUrl, ngDevMode ? ["https://ik.imagekit.io/mysite", "https://subdomain.mysite.com"] : void 0);
function createImagekitUrl(path, config2) {
  const {
    src,
    width
  } = config2;
  let urlSegments;
  if (width) {
    const params = `tr:w-${width}`;
    urlSegments = [path, params, src];
  } else {
    urlSegments = [path, src];
  }
  return urlSegments.join("/");
}
var provideImgixLoader = /* @__PURE__ */ createImageLoader(createImgixUrl, ngDevMode ? ["https://somepath.imgix.net/"] : void 0);
function createImgixUrl(path, config2) {
  const url = new URL(`${path}/${config2.src}`);
  url.searchParams.set("auto", "format");
  if (config2.width) {
    url.searchParams.set("w", config2.width.toString());
  }
  return url.href;
}

// node_modules/@angular/common/fesm2022/http.mjs
var HttpHandler = class {
};
var HttpBackend = class {
};
var HttpHeaders = class _HttpHeaders {
  /**  Constructs a new HTTP header object with the given values.*/
  constructor(headers) {
    this.normalizedNames = /* @__PURE__ */ new Map();
    this.lazyUpdate = null;
    if (!headers) {
      this.headers = /* @__PURE__ */ new Map();
    } else if (typeof headers === "string") {
      this.lazyInit = () => {
        this.headers = /* @__PURE__ */ new Map();
        headers.split("\n").forEach((line) => {
          const index = line.indexOf(":");
          if (index > 0) {
            const name = line.slice(0, index);
            const key = name.toLowerCase();
            const value = line.slice(index + 1).trim();
            this.maybeSetNormalizedName(name, key);
            if (this.headers.has(key)) {
              this.headers.get(key).push(value);
            } else {
              this.headers.set(key, [value]);
            }
          }
        });
      };
    } else if (typeof Headers !== "undefined" && headers instanceof Headers) {
      this.headers = /* @__PURE__ */ new Map();
      headers.forEach((values, name) => {
        this.setHeaderEntries(name, values);
      });
    } else {
      this.lazyInit = () => {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          assertValidHeaders(headers);
        }
        this.headers = /* @__PURE__ */ new Map();
        Object.entries(headers).forEach(([name, values]) => {
          this.setHeaderEntries(name, values);
        });
      };
    }
  }
  /**
   * Checks for existence of a given header.
   *
   * @param name The header name to check for existence.
   *
   * @returns True if the header exists, false otherwise.
   */
  has(name) {
    this.init();
    return this.headers.has(name.toLowerCase());
  }
  /**
   * Retrieves the first value of a given header.
   *
   * @param name The header name.
   *
   * @returns The value string if the header exists, null otherwise
   */
  get(name) {
    this.init();
    const values = this.headers.get(name.toLowerCase());
    return values && values.length > 0 ? values[0] : null;
  }
  /**
   * Retrieves the names of the headers.
   *
   * @returns A list of header names.
   */
  keys() {
    this.init();
    return Array.from(this.normalizedNames.values());
  }
  /**
   * Retrieves a list of values for a given header.
   *
   * @param name The header name from which to retrieve values.
   *
   * @returns A string of values if the header exists, null otherwise.
   */
  getAll(name) {
    this.init();
    return this.headers.get(name.toLowerCase()) || null;
  }
  /**
   * Appends a new value to the existing set of values for a header
   * and returns them in a clone of the original instance.
   *
   * @param name The header name for which to append the values.
   * @param value The value to append.
   *
   * @returns A clone of the HTTP headers object with the value appended to the given header.
   */
  append(name, value) {
    return this.clone({
      name,
      value,
      op: "a"
    });
  }
  /**
   * Sets or modifies a value for a given header in a clone of the original instance.
   * If the header already exists, its value is replaced with the given value
   * in the returned object.
   *
   * @param name The header name.
   * @param value The value or values to set or override for the given header.
   *
   * @returns A clone of the HTTP headers object with the newly set header value.
   */
  set(name, value) {
    return this.clone({
      name,
      value,
      op: "s"
    });
  }
  /**
   * Deletes values for a given header in a clone of the original instance.
   *
   * @param name The header name.
   * @param value The value or values to delete for the given header.
   *
   * @returns A clone of the HTTP headers object with the given value deleted.
   */
  delete(name, value) {
    return this.clone({
      name,
      value,
      op: "d"
    });
  }
  maybeSetNormalizedName(name, lcName) {
    if (!this.normalizedNames.has(lcName)) {
      this.normalizedNames.set(lcName, name);
    }
  }
  init() {
    if (!!this.lazyInit) {
      if (this.lazyInit instanceof _HttpHeaders) {
        this.copyFrom(this.lazyInit);
      } else {
        this.lazyInit();
      }
      this.lazyInit = null;
      if (!!this.lazyUpdate) {
        this.lazyUpdate.forEach((update) => this.applyUpdate(update));
        this.lazyUpdate = null;
      }
    }
  }
  copyFrom(other) {
    other.init();
    Array.from(other.headers.keys()).forEach((key) => {
      this.headers.set(key, other.headers.get(key));
      this.normalizedNames.set(key, other.normalizedNames.get(key));
    });
  }
  clone(update) {
    const clone = new _HttpHeaders();
    clone.lazyInit = !!this.lazyInit && this.lazyInit instanceof _HttpHeaders ? this.lazyInit : this;
    clone.lazyUpdate = (this.lazyUpdate || []).concat([update]);
    return clone;
  }
  applyUpdate(update) {
    const key = update.name.toLowerCase();
    switch (update.op) {
      case "a":
      case "s":
        let value = update.value;
        if (typeof value === "string") {
          value = [value];
        }
        if (value.length === 0) {
          return;
        }
        this.maybeSetNormalizedName(update.name, key);
        const base = (update.op === "a" ? this.headers.get(key) : void 0) || [];
        base.push(...value);
        this.headers.set(key, base);
        break;
      case "d":
        const toDelete = update.value;
        if (!toDelete) {
          this.headers.delete(key);
          this.normalizedNames.delete(key);
        } else {
          let existing = this.headers.get(key);
          if (!existing) {
            return;
          }
          existing = existing.filter((value2) => toDelete.indexOf(value2) === -1);
          if (existing.length === 0) {
            this.headers.delete(key);
            this.normalizedNames.delete(key);
          } else {
            this.headers.set(key, existing);
          }
        }
        break;
    }
  }
  setHeaderEntries(name, values) {
    const headerValues = (Array.isArray(values) ? values : [values]).map((value) => value.toString());
    const key = name.toLowerCase();
    this.headers.set(key, headerValues);
    this.maybeSetNormalizedName(name, key);
  }
  /**
   * @internal
   */
  forEach(fn) {
    this.init();
    Array.from(this.normalizedNames.keys()).forEach((key) => fn(this.normalizedNames.get(key), this.headers.get(key)));
  }
};
function assertValidHeaders(headers) {
  for (const [key, value] of Object.entries(headers)) {
    if (!(typeof value === "string" || typeof value === "number") && !Array.isArray(value)) {
      throw new Error(`Unexpected value of the \`${key}\` header provided. Expecting either a string, a number or an array, but got: \`${value}\`.`);
    }
  }
}
var HttpUrlEncodingCodec = class {
  /**
   * Encodes a key name for a URL parameter or query-string.
   * @param key The key name.
   * @returns The encoded key name.
   */
  encodeKey(key) {
    return standardEncoding(key);
  }
  /**
   * Encodes the value of a URL parameter or query-string.
   * @param value The value.
   * @returns The encoded value.
   */
  encodeValue(value) {
    return standardEncoding(value);
  }
  /**
   * Decodes an encoded URL parameter or query-string key.
   * @param key The encoded key name.
   * @returns The decoded key name.
   */
  decodeKey(key) {
    return decodeURIComponent(key);
  }
  /**
   * Decodes an encoded URL parameter or query-string value.
   * @param value The encoded value.
   * @returns The decoded value.
   */
  decodeValue(value) {
    return decodeURIComponent(value);
  }
};
function paramParser(rawParams, codec) {
  const map2 = /* @__PURE__ */ new Map();
  if (rawParams.length > 0) {
    const params = rawParams.replace(/^\?/, "").split("&");
    params.forEach((param) => {
      const eqIdx = param.indexOf("=");
      const [key, val] = eqIdx == -1 ? [codec.decodeKey(param), ""] : [codec.decodeKey(param.slice(0, eqIdx)), codec.decodeValue(param.slice(eqIdx + 1))];
      const list = map2.get(key) || [];
      list.push(val);
      map2.set(key, list);
    });
  }
  return map2;
}
var STANDARD_ENCODING_REGEX = /%(\d[a-f0-9])/gi;
var STANDARD_ENCODING_REPLACEMENTS = {
  "40": "@",
  "3A": ":",
  "24": "$",
  "2C": ",",
  "3B": ";",
  "3D": "=",
  "3F": "?",
  "2F": "/"
};
function standardEncoding(v) {
  return encodeURIComponent(v).replace(STANDARD_ENCODING_REGEX, (s, t) => STANDARD_ENCODING_REPLACEMENTS[t] ?? s);
}
function valueToString(value) {
  return `${value}`;
}
var HttpParams = class _HttpParams {
  constructor(options = {}) {
    this.updates = null;
    this.cloneFrom = null;
    this.encoder = options.encoder || new HttpUrlEncodingCodec();
    if (!!options.fromString) {
      if (!!options.fromObject) {
        throw new Error(`Cannot specify both fromString and fromObject.`);
      }
      this.map = paramParser(options.fromString, this.encoder);
    } else if (!!options.fromObject) {
      this.map = /* @__PURE__ */ new Map();
      Object.keys(options.fromObject).forEach((key) => {
        const value = options.fromObject[key];
        const values = Array.isArray(value) ? value.map(valueToString) : [valueToString(value)];
        this.map.set(key, values);
      });
    } else {
      this.map = null;
    }
  }
  /**
   * Reports whether the body includes one or more values for a given parameter.
   * @param param The parameter name.
   * @returns True if the parameter has one or more values,
   * false if it has no value or is not present.
   */
  has(param) {
    this.init();
    return this.map.has(param);
  }
  /**
   * Retrieves the first value for a parameter.
   * @param param The parameter name.
   * @returns The first value of the given parameter,
   * or `null` if the parameter is not present.
   */
  get(param) {
    this.init();
    const res = this.map.get(param);
    return !!res ? res[0] : null;
  }
  /**
   * Retrieves all values for a  parameter.
   * @param param The parameter name.
   * @returns All values in a string array,
   * or `null` if the parameter not present.
   */
  getAll(param) {
    this.init();
    return this.map.get(param) || null;
  }
  /**
   * Retrieves all the parameters for this body.
   * @returns The parameter names in a string array.
   */
  keys() {
    this.init();
    return Array.from(this.map.keys());
  }
  /**
   * Appends a new value to existing values for a parameter.
   * @param param The parameter name.
   * @param value The new value to add.
   * @return A new body with the appended value.
   */
  append(param, value) {
    return this.clone({
      param,
      value,
      op: "a"
    });
  }
  /**
   * Constructs a new body with appended values for the given parameter name.
   * @param params parameters and values
   * @return A new body with the new value.
   */
  appendAll(params) {
    const updates = [];
    Object.keys(params).forEach((param) => {
      const value = params[param];
      if (Array.isArray(value)) {
        value.forEach((_value) => {
          updates.push({
            param,
            value: _value,
            op: "a"
          });
        });
      } else {
        updates.push({
          param,
          value,
          op: "a"
        });
      }
    });
    return this.clone(updates);
  }
  /**
   * Replaces the value for a parameter.
   * @param param The parameter name.
   * @param value The new value.
   * @return A new body with the new value.
   */
  set(param, value) {
    return this.clone({
      param,
      value,
      op: "s"
    });
  }
  /**
   * Removes a given value or all values from a parameter.
   * @param param The parameter name.
   * @param value The value to remove, if provided.
   * @return A new body with the given value removed, or with all values
   * removed if no value is specified.
   */
  delete(param, value) {
    return this.clone({
      param,
      value,
      op: "d"
    });
  }
  /**
   * Serializes the body to an encoded string, where key-value pairs (separated by `=`) are
   * separated by `&`s.
   */
  toString() {
    this.init();
    return this.keys().map((key) => {
      const eKey = this.encoder.encodeKey(key);
      return this.map.get(key).map((value) => eKey + "=" + this.encoder.encodeValue(value)).join("&");
    }).filter((param) => param !== "").join("&");
  }
  clone(update) {
    const clone = new _HttpParams({
      encoder: this.encoder
    });
    clone.cloneFrom = this.cloneFrom || this;
    clone.updates = (this.updates || []).concat(update);
    return clone;
  }
  init() {
    if (this.map === null) {
      this.map = /* @__PURE__ */ new Map();
    }
    if (this.cloneFrom !== null) {
      this.cloneFrom.init();
      this.cloneFrom.keys().forEach((key) => this.map.set(key, this.cloneFrom.map.get(key)));
      this.updates.forEach((update) => {
        switch (update.op) {
          case "a":
          case "s":
            const base = (update.op === "a" ? this.map.get(update.param) : void 0) || [];
            base.push(valueToString(update.value));
            this.map.set(update.param, base);
            break;
          case "d":
            if (update.value !== void 0) {
              let base2 = this.map.get(update.param) || [];
              const idx = base2.indexOf(valueToString(update.value));
              if (idx !== -1) {
                base2.splice(idx, 1);
              }
              if (base2.length > 0) {
                this.map.set(update.param, base2);
              } else {
                this.map.delete(update.param);
              }
            } else {
              this.map.delete(update.param);
              break;
            }
        }
      });
      this.cloneFrom = this.updates = null;
    }
  }
};
var HttpContext = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * Store a value in the context. If a value is already present it will be overwritten.
   *
   * @param token The reference to an instance of `HttpContextToken`.
   * @param value The value to store.
   *
   * @returns A reference to itself for easy chaining.
   */
  set(token, value) {
    this.map.set(token, value);
    return this;
  }
  /**
   * Retrieve the value associated with the given token.
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * @returns The stored value or default if one is defined.
   */
  get(token) {
    if (!this.map.has(token)) {
      this.map.set(token, token.defaultValue());
    }
    return this.map.get(token);
  }
  /**
   * Delete the value associated with the given token.
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * @returns A reference to itself for easy chaining.
   */
  delete(token) {
    this.map.delete(token);
    return this;
  }
  /**
   * Checks for existence of a given token.
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * @returns True if the token exists, false otherwise.
   */
  has(token) {
    return this.map.has(token);
  }
  /**
   * @returns a list of tokens currently stored in the context.
   */
  keys() {
    return this.map.keys();
  }
};
function mightHaveBody(method) {
  switch (method) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return false;
    default:
      return true;
  }
}
function isArrayBuffer(value) {
  return typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer;
}
function isBlob(value) {
  return typeof Blob !== "undefined" && value instanceof Blob;
}
function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}
function isUrlSearchParams(value) {
  return typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams;
}
var HttpRequest = class _HttpRequest {
  constructor(method, url, third, fourth) {
    this.url = url;
    this.body = null;
    this.reportProgress = false;
    this.withCredentials = false;
    this.responseType = "json";
    this.method = method.toUpperCase();
    let options;
    if (mightHaveBody(this.method) || !!fourth) {
      this.body = third !== void 0 ? third : null;
      options = fourth;
    } else {
      options = third;
    }
    if (options) {
      this.reportProgress = !!options.reportProgress;
      this.withCredentials = !!options.withCredentials;
      if (!!options.responseType) {
        this.responseType = options.responseType;
      }
      if (!!options.headers) {
        this.headers = options.headers;
      }
      if (!!options.context) {
        this.context = options.context;
      }
      if (!!options.params) {
        this.params = options.params;
      }
    }
    if (!this.headers) {
      this.headers = new HttpHeaders();
    }
    if (!this.context) {
      this.context = new HttpContext();
    }
    if (!this.params) {
      this.params = new HttpParams();
      this.urlWithParams = url;
    } else {
      const params = this.params.toString();
      if (params.length === 0) {
        this.urlWithParams = url;
      } else {
        const qIdx = url.indexOf("?");
        const sep = qIdx === -1 ? "?" : qIdx < url.length - 1 ? "&" : "";
        this.urlWithParams = url + sep + params;
      }
    }
  }
  /**
   * Transform the free-form body into a serialized format suitable for
   * transmission to the server.
   */
  serializeBody() {
    if (this.body === null) {
      return null;
    }
    if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) || isUrlSearchParams(this.body) || typeof this.body === "string") {
      return this.body;
    }
    if (this.body instanceof HttpParams) {
      return this.body.toString();
    }
    if (typeof this.body === "object" || typeof this.body === "boolean" || Array.isArray(this.body)) {
      return JSON.stringify(this.body);
    }
    return this.body.toString();
  }
  /**
   * Examine the body and attempt to infer an appropriate MIME type
   * for it.
   *
   * If no such type can be inferred, this method will return `null`.
   */
  detectContentTypeHeader() {
    if (this.body === null) {
      return null;
    }
    if (isFormData(this.body)) {
      return null;
    }
    if (isBlob(this.body)) {
      return this.body.type || null;
    }
    if (isArrayBuffer(this.body)) {
      return null;
    }
    if (typeof this.body === "string") {
      return "text/plain";
    }
    if (this.body instanceof HttpParams) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    }
    if (typeof this.body === "object" || typeof this.body === "number" || typeof this.body === "boolean") {
      return "application/json";
    }
    return null;
  }
  clone(update = {}) {
    const method = update.method || this.method;
    const url = update.url || this.url;
    const responseType = update.responseType || this.responseType;
    const body = update.body !== void 0 ? update.body : this.body;
    const withCredentials = update.withCredentials !== void 0 ? update.withCredentials : this.withCredentials;
    const reportProgress = update.reportProgress !== void 0 ? update.reportProgress : this.reportProgress;
    let headers = update.headers || this.headers;
    let params = update.params || this.params;
    const context2 = update.context ?? this.context;
    if (update.setHeaders !== void 0) {
      headers = Object.keys(update.setHeaders).reduce((headers2, name) => headers2.set(name, update.setHeaders[name]), headers);
    }
    if (update.setParams) {
      params = Object.keys(update.setParams).reduce((params2, param) => params2.set(param, update.setParams[param]), params);
    }
    return new _HttpRequest(method, url, body, {
      params,
      headers,
      context: context2,
      reportProgress,
      responseType,
      withCredentials
    });
  }
};
var HttpEventType = /* @__PURE__ */ function(HttpEventType2) {
  HttpEventType2[HttpEventType2["Sent"] = 0] = "Sent";
  HttpEventType2[HttpEventType2["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType2[HttpEventType2["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType2[HttpEventType2["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType2[HttpEventType2["Response"] = 4] = "Response";
  HttpEventType2[HttpEventType2["User"] = 5] = "User";
  return HttpEventType2;
}(HttpEventType || {});
var HttpResponseBase = class {
  /**
   * Super-constructor for all responses.
   *
   * The single parameter accepted is an initialization hash. Any properties
   * of the response passed there will override the default values.
   */
  constructor(init, defaultStatus = 200, defaultStatusText = "OK") {
    this.headers = init.headers || new HttpHeaders();
    this.status = init.status !== void 0 ? init.status : defaultStatus;
    this.statusText = init.statusText || defaultStatusText;
    this.url = init.url || null;
    this.ok = this.status >= 200 && this.status < 300;
  }
};
var HttpHeaderResponse = class _HttpHeaderResponse extends HttpResponseBase {
  /**
   * Create a new `HttpHeaderResponse` with the given parameters.
   */
  constructor(init = {}) {
    super(init);
    this.type = HttpEventType.ResponseHeader;
  }
  /**
   * Copy this `HttpHeaderResponse`, overriding its contents with the
   * given parameter hash.
   */
  clone(update = {}) {
    return new _HttpHeaderResponse({
      headers: update.headers || this.headers,
      status: update.status !== void 0 ? update.status : this.status,
      statusText: update.statusText || this.statusText,
      url: update.url || this.url || void 0
    });
  }
};
var HttpResponse = class _HttpResponse extends HttpResponseBase {
  /**
   * Construct a new `HttpResponse`.
   */
  constructor(init = {}) {
    super(init);
    this.type = HttpEventType.Response;
    this.body = init.body !== void 0 ? init.body : null;
  }
  clone(update = {}) {
    return new _HttpResponse({
      body: update.body !== void 0 ? update.body : this.body,
      headers: update.headers || this.headers,
      status: update.status !== void 0 ? update.status : this.status,
      statusText: update.statusText || this.statusText,
      url: update.url || this.url || void 0
    });
  }
};
var HttpErrorResponse = class extends HttpResponseBase {
  constructor(init) {
    super(init, 0, "Unknown Error");
    this.name = "HttpErrorResponse";
    this.ok = false;
    if (this.status >= 200 && this.status < 300) {
      this.message = `Http failure during parsing for ${init.url || "(unknown url)"}`;
    } else {
      this.message = `Http failure response for ${init.url || "(unknown url)"}: ${init.status} ${init.statusText}`;
    }
    this.error = init.error || null;
  }
};
function addBody(options, body) {
  return {
    body,
    headers: options.headers,
    context: options.context,
    observe: options.observe,
    params: options.params,
    reportProgress: options.reportProgress,
    responseType: options.responseType,
    withCredentials: options.withCredentials
  };
}
var HttpClient = /* @__PURE__ */ (() => {
  class HttpClient2 {
    constructor(handler) {
      this.handler = handler;
    }
    /**
     * Constructs an observable for a generic HTTP request that, when subscribed,
     * fires the request through the chain of registered interceptors and on to the
     * server.
     *
     * You can pass an `HttpRequest` directly as the only parameter. In this case,
     * the call returns an observable of the raw `HttpEvent` stream.
     *
     * Alternatively you can pass an HTTP method as the first parameter,
     * a URL string as the second, and an options hash containing the request body as the third.
     * See `addBody()`. In this case, the specified `responseType` and `observe` options determine the
     * type of returned observable.
     *   * The `responseType` value determines how a successful response body is parsed.
     *   * If `responseType` is the default `json`, you can pass a type interface for the resulting
     * object as a type parameter to the call.
     *
     * The `observe` value determines the return type, according to what you are interested in
     * observing.
     *   * An `observe` value of events returns an observable of the raw `HttpEvent` stream, including
     * progress events by default.
     *   * An `observe` value of response returns an observable of `HttpResponse<T>`,
     * where the `T` parameter depends on the `responseType` and any optionally provided type
     * parameter.
     *   * An `observe` value of body returns an observable of `<T>` with the same `T` body type.
     *
     */
    request(first2, url, options = {}) {
      let req;
      if (first2 instanceof HttpRequest) {
        req = first2;
      } else {
        let headers = void 0;
        if (options.headers instanceof HttpHeaders) {
          headers = options.headers;
        } else {
          headers = new HttpHeaders(options.headers);
        }
        let params = void 0;
        if (!!options.params) {
          if (options.params instanceof HttpParams) {
            params = options.params;
          } else {
            params = new HttpParams({
              fromObject: options.params
            });
          }
        }
        req = new HttpRequest(first2, url, options.body !== void 0 ? options.body : null, {
          headers,
          context: options.context,
          params,
          reportProgress: options.reportProgress,
          // By default, JSON is assumed to be returned for all calls.
          responseType: options.responseType || "json",
          withCredentials: options.withCredentials
        });
      }
      const events$ = of(req).pipe(concatMap((req2) => this.handler.handle(req2)));
      if (first2 instanceof HttpRequest || options.observe === "events") {
        return events$;
      }
      const res$ = events$.pipe(filter((event) => event instanceof HttpResponse));
      switch (options.observe || "body") {
        case "body":
          switch (req.responseType) {
            case "arraybuffer":
              return res$.pipe(map((res) => {
                if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
                  throw new Error("Response is not an ArrayBuffer.");
                }
                return res.body;
              }));
            case "blob":
              return res$.pipe(map((res) => {
                if (res.body !== null && !(res.body instanceof Blob)) {
                  throw new Error("Response is not a Blob.");
                }
                return res.body;
              }));
            case "text":
              return res$.pipe(map((res) => {
                if (res.body !== null && typeof res.body !== "string") {
                  throw new Error("Response is not a string.");
                }
                return res.body;
              }));
            case "json":
            default:
              return res$.pipe(map((res) => res.body));
          }
        case "response":
          return res$;
        default:
          throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
      }
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `DELETE` request to execute on the server. See the individual overloads for
     * details on the return type.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     *
     */
    delete(url, options = {}) {
      return this.request("DELETE", url, options);
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `GET` request to execute on the server. See the individual overloads for
     * details on the return type.
     */
    get(url, options = {}) {
      return this.request("GET", url, options);
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `HEAD` request to execute on the server. The `HEAD` method returns
     * meta information about the resource without transferring the
     * resource itself. See the individual overloads for
     * details on the return type.
     */
    head(url, options = {}) {
      return this.request("HEAD", url, options);
    }
    /**
     * Constructs an `Observable` that, when subscribed, causes a request with the special method
     * `JSONP` to be dispatched via the interceptor pipeline.
     * The [JSONP pattern](https://en.wikipedia.org/wiki/JSONP) works around limitations of certain
     * API endpoints that don't support newer,
     * and preferable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) protocol.
     * JSONP treats the endpoint API as a JavaScript file and tricks the browser to process the
     * requests even if the API endpoint is not located on the same domain (origin) as the client-side
     * application making the request.
     * The endpoint API must support JSONP callback for JSONP requests to work.
     * The resource API returns the JSON response wrapped in a callback function.
     * You can pass the callback function name as one of the query parameters.
     * Note that JSONP requests can only be used with `GET` requests.
     *
     * @param url The resource URL.
     * @param callbackParam The callback function name.
     *
     */
    jsonp(url, callbackParam) {
      return this.request("JSONP", url, {
        params: new HttpParams().append(callbackParam, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json"
      });
    }
    /**
     * Constructs an `Observable` that, when subscribed, causes the configured
     * `OPTIONS` request to execute on the server. This method allows the client
     * to determine the supported HTTP methods and other capabilities of an endpoint,
     * without implying a resource action. See the individual overloads for
     * details on the return type.
     */
    options(url, options = {}) {
      return this.request("OPTIONS", url, options);
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `PATCH` request to execute on the server. See the individual overloads for
     * details on the return type.
     */
    patch(url, body, options = {}) {
      return this.request("PATCH", url, addBody(options, body));
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `POST` request to execute on the server. The server responds with the location of
     * the replaced resource. See the individual overloads for
     * details on the return type.
     */
    post(url, body, options = {}) {
      return this.request("POST", url, addBody(options, body));
    }
    /**
     * Constructs an observable that, when subscribed, causes the configured
     * `PUT` request to execute on the server. The `PUT` method replaces an existing resource
     * with a new set of values.
     * See the individual overloads for details on the return type.
     */
    put(url, body, options = {}) {
      return this.request("PUT", url, addBody(options, body));
    }
    static {
      this.\u0275fac = function HttpClient_Factory(t) {
        return new (t || HttpClient2)(\u0275\u0275inject(HttpHandler));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: HttpClient2,
        factory: HttpClient2.\u0275fac
      });
    }
  }
  return HttpClient2;
})();
function interceptorChainEndFn(req, finalHandlerFn) {
  return finalHandlerFn(req);
}
function chainedInterceptorFn(chainTailFn, interceptorFn, injector) {
  return (initialRequest, finalHandlerFn) => injector.runInContext(() => interceptorFn(initialRequest, (downstreamRequest) => chainTailFn(downstreamRequest, finalHandlerFn)));
}
var HTTP_INTERCEPTORS = /* @__PURE__ */ new InjectionToken(ngDevMode ? "HTTP_INTERCEPTORS" : "");
var HTTP_INTERCEPTOR_FNS = /* @__PURE__ */ new InjectionToken(ngDevMode ? "HTTP_INTERCEPTOR_FNS" : "");
var HTTP_ROOT_INTERCEPTOR_FNS = /* @__PURE__ */ new InjectionToken(ngDevMode ? "HTTP_ROOT_INTERCEPTOR_FNS" : "");
var HttpInterceptorHandler = /* @__PURE__ */ (() => {
  class HttpInterceptorHandler2 extends HttpHandler {
    constructor(backend, injector) {
      super();
      this.backend = backend;
      this.injector = injector;
      this.chain = null;
      this.pendingTasks = inject(InitialRenderPendingTasks);
    }
    handle(initialRequest) {
      if (this.chain === null) {
        const dedupedInterceptorFns = Array.from(/* @__PURE__ */ new Set([...this.injector.get(HTTP_INTERCEPTOR_FNS), ...this.injector.get(HTTP_ROOT_INTERCEPTOR_FNS, [])]));
        this.chain = dedupedInterceptorFns.reduceRight((nextSequencedFn, interceptorFn) => chainedInterceptorFn(nextSequencedFn, interceptorFn, this.injector), interceptorChainEndFn);
      }
      const taskId = this.pendingTasks.add();
      return this.chain(initialRequest, (downstreamRequest) => this.backend.handle(downstreamRequest)).pipe(finalize(() => this.pendingTasks.remove(taskId)));
    }
    static {
      this.\u0275fac = function HttpInterceptorHandler_Factory(t) {
        return new (t || HttpInterceptorHandler2)(\u0275\u0275inject(HttpBackend), \u0275\u0275inject(EnvironmentInjector));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: HttpInterceptorHandler2,
        factory: HttpInterceptorHandler2.\u0275fac
      });
    }
  }
  return HttpInterceptorHandler2;
})();
var XSSI_PREFIX = /^\)\]\}',?\n/;
function getResponseUrl(xhr) {
  if ("responseURL" in xhr && xhr.responseURL) {
    return xhr.responseURL;
  }
  if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
    return xhr.getResponseHeader("X-Request-URL");
  }
  return null;
}
var HttpXhrBackend = /* @__PURE__ */ (() => {
  class HttpXhrBackend2 {
    constructor(xhrFactory) {
      this.xhrFactory = xhrFactory;
    }
    /**
     * Processes a request and returns a stream of response events.
     * @param req The request object.
     * @returns An observable of the response events.
     */
    handle(req) {
      if (req.method === "JSONP") {
        throw new RuntimeError(-2800, (typeof ngDevMode === "undefined" || ngDevMode) && `Cannot make a JSONP request without JSONP support. To fix the problem, either add the \`withJsonpSupport()\` call (if \`provideHttpClient()\` is used) or import the \`HttpClientJsonpModule\` in the root NgModule.`);
      }
      const xhrFactory = this.xhrFactory;
      const source = xhrFactory.\u0275loadImpl ? from(xhrFactory.\u0275loadImpl()) : of(null);
      return source.pipe(switchMap(() => {
        return new Observable((observer) => {
          const xhr = xhrFactory.build();
          xhr.open(req.method, req.urlWithParams);
          if (req.withCredentials) {
            xhr.withCredentials = true;
          }
          req.headers.forEach((name, values) => xhr.setRequestHeader(name, values.join(",")));
          if (!req.headers.has("Accept")) {
            xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
          }
          if (!req.headers.has("Content-Type")) {
            const detectedType = req.detectContentTypeHeader();
            if (detectedType !== null) {
              xhr.setRequestHeader("Content-Type", detectedType);
            }
          }
          if (req.responseType) {
            const responseType = req.responseType.toLowerCase();
            xhr.responseType = responseType !== "json" ? responseType : "text";
          }
          const reqBody = req.serializeBody();
          let headerResponse = null;
          const partialFromXhr = () => {
            if (headerResponse !== null) {
              return headerResponse;
            }
            const statusText = xhr.statusText || "OK";
            const headers = new HttpHeaders(xhr.getAllResponseHeaders());
            const url = getResponseUrl(xhr) || req.url;
            headerResponse = new HttpHeaderResponse({
              headers,
              status: xhr.status,
              statusText,
              url
            });
            return headerResponse;
          };
          const onLoad = () => {
            let {
              headers,
              status,
              statusText,
              url
            } = partialFromXhr();
            let body = null;
            if (status !== 204) {
              body = typeof xhr.response === "undefined" ? xhr.responseText : xhr.response;
            }
            if (status === 0) {
              status = !!body ? 200 : 0;
            }
            let ok = status >= 200 && status < 300;
            if (req.responseType === "json" && typeof body === "string") {
              const originalBody = body;
              body = body.replace(XSSI_PREFIX, "");
              try {
                body = body !== "" ? JSON.parse(body) : null;
              } catch (error) {
                body = originalBody;
                if (ok) {
                  ok = false;
                  body = {
                    error,
                    text: body
                  };
                }
              }
            }
            if (ok) {
              observer.next(new HttpResponse({
                body,
                headers,
                status,
                statusText,
                url: url || void 0
              }));
              observer.complete();
            } else {
              observer.error(new HttpErrorResponse({
                // The error in this case is the response body (error from the server).
                error: body,
                headers,
                status,
                statusText,
                url: url || void 0
              }));
            }
          };
          const onError = (error) => {
            const {
              url
            } = partialFromXhr();
            const res = new HttpErrorResponse({
              error,
              status: xhr.status || 0,
              statusText: xhr.statusText || "Unknown Error",
              url: url || void 0
            });
            observer.error(res);
          };
          let sentHeaders = false;
          const onDownProgress = (event) => {
            if (!sentHeaders) {
              observer.next(partialFromXhr());
              sentHeaders = true;
            }
            let progressEvent = {
              type: HttpEventType.DownloadProgress,
              loaded: event.loaded
            };
            if (event.lengthComputable) {
              progressEvent.total = event.total;
            }
            if (req.responseType === "text" && !!xhr.responseText) {
              progressEvent.partialText = xhr.responseText;
            }
            observer.next(progressEvent);
          };
          const onUpProgress = (event) => {
            let progress = {
              type: HttpEventType.UploadProgress,
              loaded: event.loaded
            };
            if (event.lengthComputable) {
              progress.total = event.total;
            }
            observer.next(progress);
          };
          xhr.addEventListener("load", onLoad);
          xhr.addEventListener("error", onError);
          xhr.addEventListener("timeout", onError);
          xhr.addEventListener("abort", onError);
          if (req.reportProgress) {
            xhr.addEventListener("progress", onDownProgress);
            if (reqBody !== null && xhr.upload) {
              xhr.upload.addEventListener("progress", onUpProgress);
            }
          }
          xhr.send(reqBody);
          observer.next({
            type: HttpEventType.Sent
          });
          return () => {
            xhr.removeEventListener("error", onError);
            xhr.removeEventListener("abort", onError);
            xhr.removeEventListener("load", onLoad);
            xhr.removeEventListener("timeout", onError);
            if (req.reportProgress) {
              xhr.removeEventListener("progress", onDownProgress);
              if (reqBody !== null && xhr.upload) {
                xhr.upload.removeEventListener("progress", onUpProgress);
              }
            }
            if (xhr.readyState !== xhr.DONE) {
              xhr.abort();
            }
          };
        });
      }));
    }
    static {
      this.\u0275fac = function HttpXhrBackend_Factory(t) {
        return new (t || HttpXhrBackend2)(\u0275\u0275inject(XhrFactory));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: HttpXhrBackend2,
        factory: HttpXhrBackend2.\u0275fac
      });
    }
  }
  return HttpXhrBackend2;
})();
var XSRF_ENABLED = /* @__PURE__ */ new InjectionToken("XSRF_ENABLED");
var XSRF_DEFAULT_COOKIE_NAME = "XSRF-TOKEN";
var XSRF_COOKIE_NAME = /* @__PURE__ */ new InjectionToken("XSRF_COOKIE_NAME", {
  providedIn: "root",
  factory: () => XSRF_DEFAULT_COOKIE_NAME
});
var XSRF_DEFAULT_HEADER_NAME = "X-XSRF-TOKEN";
var XSRF_HEADER_NAME = /* @__PURE__ */ new InjectionToken("XSRF_HEADER_NAME", {
  providedIn: "root",
  factory: () => XSRF_DEFAULT_HEADER_NAME
});
var HttpXsrfTokenExtractor = class {
};
var HttpXsrfCookieExtractor = /* @__PURE__ */ (() => {
  class HttpXsrfCookieExtractor2 {
    constructor(doc, platform, cookieName) {
      this.doc = doc;
      this.platform = platform;
      this.cookieName = cookieName;
      this.lastCookieString = "";
      this.lastToken = null;
      this.parseCount = 0;
    }
    getToken() {
      if (this.platform === "server") {
        return null;
      }
      const cookieString = this.doc.cookie || "";
      if (cookieString !== this.lastCookieString) {
        this.parseCount++;
        this.lastToken = parseCookieValue(cookieString, this.cookieName);
        this.lastCookieString = cookieString;
      }
      return this.lastToken;
    }
    static {
      this.\u0275fac = function HttpXsrfCookieExtractor_Factory(t) {
        return new (t || HttpXsrfCookieExtractor2)(\u0275\u0275inject(DOCUMENT2), \u0275\u0275inject(PLATFORM_ID), \u0275\u0275inject(XSRF_COOKIE_NAME));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: HttpXsrfCookieExtractor2,
        factory: HttpXsrfCookieExtractor2.\u0275fac
      });
    }
  }
  return HttpXsrfCookieExtractor2;
})();
function xsrfInterceptorFn(req, next) {
  const lcUrl = req.url.toLowerCase();
  if (!inject(XSRF_ENABLED) || req.method === "GET" || req.method === "HEAD" || lcUrl.startsWith("http://") || lcUrl.startsWith("https://")) {
    return next(req);
  }
  const token = inject(HttpXsrfTokenExtractor).getToken();
  const headerName = inject(XSRF_HEADER_NAME);
  if (token != null && !req.headers.has(headerName)) {
    req = req.clone({
      headers: req.headers.set(headerName, token)
    });
  }
  return next(req);
}
var HttpFeatureKind = /* @__PURE__ */ function(HttpFeatureKind2) {
  HttpFeatureKind2[HttpFeatureKind2["Interceptors"] = 0] = "Interceptors";
  HttpFeatureKind2[HttpFeatureKind2["LegacyInterceptors"] = 1] = "LegacyInterceptors";
  HttpFeatureKind2[HttpFeatureKind2["CustomXsrfConfiguration"] = 2] = "CustomXsrfConfiguration";
  HttpFeatureKind2[HttpFeatureKind2["NoXsrfProtection"] = 3] = "NoXsrfProtection";
  HttpFeatureKind2[HttpFeatureKind2["JsonpSupport"] = 4] = "JsonpSupport";
  HttpFeatureKind2[HttpFeatureKind2["RequestsMadeViaParent"] = 5] = "RequestsMadeViaParent";
  HttpFeatureKind2[HttpFeatureKind2["Fetch"] = 6] = "Fetch";
  return HttpFeatureKind2;
}(HttpFeatureKind || {});
function makeHttpFeature(kind, providers) {
  return {
    \u0275kind: kind,
    \u0275providers: providers
  };
}
function provideHttpClient(...features) {
  if (ngDevMode) {
    const featureKinds = new Set(features.map((f) => f.\u0275kind));
    if (featureKinds.has(HttpFeatureKind.NoXsrfProtection) && featureKinds.has(HttpFeatureKind.CustomXsrfConfiguration)) {
      throw new Error(ngDevMode ? `Configuration error: found both withXsrfConfiguration() and withNoXsrfProtection() in the same call to provideHttpClient(), which is a contradiction.` : "");
    }
  }
  const providers = [HttpClient, HttpXhrBackend, HttpInterceptorHandler, {
    provide: HttpHandler,
    useExisting: HttpInterceptorHandler
  }, {
    provide: HttpBackend,
    useExisting: HttpXhrBackend
  }, {
    provide: HTTP_INTERCEPTOR_FNS,
    useValue: xsrfInterceptorFn,
    multi: true
  }, {
    provide: XSRF_ENABLED,
    useValue: true
  }, {
    provide: HttpXsrfTokenExtractor,
    useClass: HttpXsrfCookieExtractor
  }];
  for (const feature of features) {
    providers.push(...feature.\u0275providers);
  }
  return makeEnvironmentProviders(providers);
}
function withInterceptors(interceptorFns) {
  return makeHttpFeature(HttpFeatureKind.Interceptors, interceptorFns.map((interceptorFn) => {
    return {
      provide: HTTP_INTERCEPTOR_FNS,
      useValue: interceptorFn,
      multi: true
    };
  }));
}
var CACHE_STATE = /* @__PURE__ */ new InjectionToken(ngDevMode ? "HTTP_TRANSFER_STATE_CACHE_STATE" : "");

export {
  Subscription,
  pipe,
  refCount,
  ConnectableObservable,
  Subject,
  BehaviorSubject,
  EMPTY,
  from,
  of,
  throwError,
  isObservable,
  EmptyError,
  map,
  combineLatest,
  mergeMap,
  mergeAll,
  concat,
  defer,
  forkJoin,
  filter,
  catchError,
  concatMap,
  defaultIfEmpty,
  take,
  mapTo,
  finalize,
  first,
  takeLast,
  last2 as last,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap,
  forwardRef,
  RuntimeError,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  isInjectable,
  InjectFlags,
  InjectionToken,
  ɵɵinject,
  inject,
  ViewEncapsulation$1,
  ɵɵdefineComponent,
  ɵɵdefineNgModule,
  ɵɵdefineDirective,
  isStandalone,
  computed,
  signal,
  ɵɵNgOnChangesFeature,
  ɵɵrestoreView,
  ɵɵresetView,
  ɵɵnamespaceSVG,
  ɵɵnamespaceHTML,
  ɵɵgetInheritedFactory,
  ɵɵinjectAttribute,
  RendererStyleFlags2,
  setDocument,
  ɵɵsanitizeUrl,
  ɵɵsanitizeUrlOrResourceUrl,
  makeEnvironmentProviders,
  INJECTOR_SCOPE,
  EnvironmentInjector,
  APP_ID,
  PLATFORM_INITIALIZER,
  PLATFORM_ID,
  ANIMATION_MODULE_TYPE,
  CSP_NONCE,
  ElementRef,
  RendererFactory2,
  Renderer2,
  Injector,
  ErrorHandler,
  EventEmitter,
  NgZone,
  ɵɵadvance,
  ɵɵdirectiveInject,
  ɵɵinvalidFactory,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵattribute,
  ɵɵtemplate,
  ɵɵreference,
  ɵɵproperty,
  ɵɵelementStart,
  ɵɵelementEnd,
  ɵɵelement,
  ɵɵelementContainerStart,
  ɵɵelementContainerEnd,
  ɵɵgetCurrentView,
  isPromise2 as isPromise,
  isSubscribable,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵstyleProp,
  ɵɵclassProp,
  ɵɵclassMap,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵclassMapInterpolate1,
  ɵɵProvidersFeature,
  NgModuleFactory$1,
  createEnvironmentInjector,
  ɵɵStandaloneFeature,
  ɵɵpureFunction0,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ViewContainerRef,
  ɵɵqueryRefresh,
  ɵɵcontentQuery,
  ɵɵloadQuery,
  ɵɵtemplateRefExtractor,
  isNgModule,
  Console,
  InitialRenderPendingTasks,
  Compiler,
  APP_BOOTSTRAP_LISTENER,
  internalCreateApplication,
  ApplicationRef,
  ChangeDetectorRef,
  booleanAttribute,
  getDOM,
  setRootDomAdapter,
  DomAdapter,
  DOCUMENT2 as DOCUMENT,
  LocationStrategy,
  Location,
  parseCookieValue,
  NgClass,
  NgForOf,
  NgIf,
  TitleCasePipe,
  DatePipe,
  CommonModule,
  PLATFORM_BROWSER_ID,
  isPlatformServer,
  ViewportScroller,
  XhrFactory,
  HttpRequest,
  HttpEventType,
  HttpClient,
  provideHttpClient,
  withInterceptors
};
/*! Bundled license information:

@angular/core/fesm2022/core.mjs:
  (**
   * @license Angular v16.2.12
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/common/fesm2022/common.mjs:
  (**
   * @license Angular v16.2.12
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/common/fesm2022/http.mjs:
  (**
   * @license Angular v16.2.12
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-ZFM7PJ4E.js.map
