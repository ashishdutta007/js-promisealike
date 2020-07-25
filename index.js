import PromiseAlike from "./PromiseAlike";

// static promises
PromiseAlike.resolve = value => new PromiseAlike(resolve => resolve(value));
PromiseAlike.reject = err => new PromiseAlike((_, reject) => reject(err));

const firstCtrlPrmsThen = promise
  .then(val => {
    console.log("Resolved value 1", val);
    const valOrPrms = val + 1;
    return valOrPrms;
  })
  .catch(err => {
    console.log("Something wrong ", err);
    return err;
  });
const secondCtrlPrmsThen = firstCtrlPrmsThen
  .then(val => {
    console.log("Resolved value 2", val);
    const valOrPrms = val + 1;
    return valOrPrms;
  })
  .catch(err => {
    console.log("Something wrong ", err);
    return err;
  });
