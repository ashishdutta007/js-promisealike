const states = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

const isThenable = mayBePromise => {
  return mayBePromise && typeof mayBePromise.then === "function";
};

class PromiseAlike {
  constructor(computation) {
    // initial state & values
    this._state = states.PENDING;
    this._value = undefined;
    this._rejectReason = undefined;

    // keep track of all promises dependent/ created on this promise
    this._thenQueue = [];
    this._finallyQueue = [];

    //runs the computation immediately
    if (typeof computation == "function") {
      setTimeout(() => {
        try {
          computation(
            this._onFulfilled.bind(this),
            this._onRejected.bind(this)
          );
        } catch (ex) {}
      }, 0);
    }
  }

  then(fulfilledFn, catchFn) {
    // promise that will not be resolved immediately and will be in pending state
    const controlledPromise = new PromiseAlike();
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

  _onFulfilled(value) {
    // this keyword here will always point to current promise object
    console.log(`Resolved with value ${value}`);
    if (this._state === states.PENDING) {
      // on calling resolve(1) update the current promise object's value
      this._state = states.FULFILLED;
      this._value = value;
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

const promise = new PromiseAlike((resolve, reject) => {
  resolve(100);
});
promise.then(val => console.log(val));
