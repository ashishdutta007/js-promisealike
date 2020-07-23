const states = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

const isThenable = mayBePromise => {
  return mayBePromise && typeof mayBePromise.then === "function";
};

export default class PromiseAlike {
  constructor(executor) {
    // initial state & values
    this._state = states.PENDING;
    this._value = undefined;
    this._rejectReason = undefined;

    // keep track of all promises dependent/ created on this promise
    this._thenQueue = [];
    this._finallyQueue = [];

    //runs the executor immediately
    if (typeof executor == "function") {
      setTimeout(() => {
        try {
          executor(this._onFulfilled.bind(this), this._onRejected.bind(this));
        } catch (ex) {}
      }, 0);
    }
  }

  then(fulfilledFn, catchFn) {
    // promise that will not be resolved immediately and will be in pending state
    const controlledPromise = new PromiseAlike();
    //register the then handlers for current promise
    this._thenQueue.push([controlledPromise, fulfilledFn, catchFn]);

    // to update the downstream promise objects the current promise needs to be SETTLED
    // if promise is settled before calling .then(); propagate to all downstream promises
    if (this.state === states.FULFILLED) {
      this._propagateFulfilled();
    } else if (this._state === states.REJECTED) {
      this._propagateRejected();
    }

    return controlledPromise;
  }

  catch() {}

  finally() {}

  // resolve(100)
  _onFulfilled(value) {
    // console.log(`Resolved with value ${value}`);
    if (this._state === states.PENDING) {
      // on calling resolve(100) update the current promise object's value
      this._state = states.FULFILLED;
      this._value = value;
      // communicate resolution to then handlers
      this._propagateFulfilled();
    }
  }

  _onRejected(reason) {
    if (this._state === states.PENDING) {
      this._state = states.REJECTED;
      this._rejectReason = reason;
      this._propagateRejected();
    }
  }

  // to communicate with the dependent promises in _thenQueue, the value of "this" promise
  _propagateFulfilled() {
    this._thenQueue.forEach(([controlledPromise, fulfilledFn]) => {
      if (typeof fulfilledFn === "function") {
        const valueOrPromise = fulfilledFn(this._value);

        // if valueOrPromise is a Promise
        if (isThenable(valueOrPromise)) {
          valueOrPromise.then(
            value => controlledPromise._onFulfilled(value),
            reason => controlledPromise._onRejected(reason)
          );
        } else {
          controlledPromise._onFulfilled(valueOrPromise);
        }
      } else {
        // no fulfilledFn provided
        controlledPromise._onFulfilled(this._value);
      }
    });
    this._thenQueue = [];
  }

  _propagateRejected() {}
}
