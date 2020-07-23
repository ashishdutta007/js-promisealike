import PromiseAlike from "./PromiseAlike";

const promise = new PromiseAlike((resolve, reject) => {
  resolve(100);
});
promise.then(val => console.log(val));
