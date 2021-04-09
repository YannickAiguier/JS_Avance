const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('frontend'));

function start() {
  app.listen(port, () => {
    console.log(`Alps Box app listening at http://localhost:${port}`)
  });
};

module.exports = {
  start: start,
};