import PromiseAlike from "./PromiseAlike";

const promise = new PromiseAlike((resolve, reject) => {
  setTimeout(() => resolve(100));
});

const firstThen = promise.then(val => {
  console.log("Resolved value 1", val);
  return val + 1;
});
const secondThen = firstThen.then(val => {
  console.log("Resolved value 2", val);
  return val + 1;
});
