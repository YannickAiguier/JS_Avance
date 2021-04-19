const express = require('express');
const app = express();
const port = 3000;
const file = require('./file');

app.use(express.static('frontend'));

app.get('/api/drive', function (req, res) {
  file.readDir('/tmp/alps-drive').then((result) => {
    res.send(result);
  });
})

function start() {
  app.listen(port, () => {
    console.log(`Alps Box app listening at http://localhost:${port}`)
  });
};

module.exports = {
  start: start,
};