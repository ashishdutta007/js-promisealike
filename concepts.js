// 1. _onFulfilled & _onRejected should be called asynchronously after .then() is called which means in a fresh stack, using a macroTask Queue (setTimeout)

// 2. The current promise needs to keep track of all the downstream promises created / dependent on it using an array _thenQueue[]

// 3. The _propagateFulfilled() informs all registered handlers in _thenQueue[], so that it can be triggered with the resolved value

// 4. Promise object's state can change only once PENDING -> FULFILLED , PENDING -> REJECTED. Once SETTLED promise value cannot be modified

// 5.
