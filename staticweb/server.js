const express = require('express');
const app = express();
const port = 3000;
const file = require('./file');

const TMP_ALPS = '/tmp/alps-drive/';

app.use(express.static('frontend'));

app.get('/api/drive', function (req, res) {
  file.readDir(TMP_ALPS).then((result) => {
    res.send(result);
  });
})

app.get('/api/drive/:name', function(req, res) {
  file.readDir(TMP_ALPS + req.params.name).then((result) => {
    res.send(result);
  })
})

function start() {
  app.listen(port, () => {
    console.log(`Alps Box app listening at http://localhost:${port}`)
  });
};

module.exports = {
  start: start,
};