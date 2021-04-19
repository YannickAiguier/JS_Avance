const express = require('express');
const { ALPS_DIR } = require('./file');
const app = express();
const port = 3000;
const file = require('./file');

app.use(express.static('frontend'));

app.get('/api/drive', function (req, res) {
  file.readDir(ALPS_DIR).then((result) => {
    res.send(result);
  });
})

app.get('/api/drive/:name', function(req, res) {
  file.readDir(ALPS_DIR + req.params.name).then((result) => {
    res.send(result);
  })
})

app.post('/api/drive', function(req, res) {
  console.log(ALPS_DIR, req.query.name);
  file.createDir(ALPS_DIR, req.query.name).then((result) => {
    res.status(201).send(result);
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