const fs = require("fs");
const path = require("path");

// Promisify fs.readFile()
const readFile = (filename, encoding) =>
  new PromiseAlike((resolve, reject) => {
    fs.readFile(filename, encoding, (err, value) => {
      if (err) return reject(err);
      resolve(value);
    });
  });

const delay = (timeInMs, value) =>
  new PromiseAlike(resolve => {
    setTimeout(() => {
      resolve(value);
    }, timeInMs);
  });

readFile(path.join(__dirname, "index.js"), "utf8")
  .then(text => {
    console.log(`${text.length} characters long`);
    return delay(2000, text.replace(/[aeiou]/g, ""));
  })
  .then(newText => {
    console.log(newText.slice(0, 200));
  })
  .catch(err => {
    console.log("An error occured");
    console.log(err);
  })
  .finally(() => {
    console.log("----All Done----");
  });
