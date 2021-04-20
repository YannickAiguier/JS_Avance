const express = require('express');
const { ALPS_DIR } = require('./file');
const app = express();
const port = 3000;
const bb = require('express-busboy');
const file = require('./file');

bb.extend(app, {
  upload: true,
  path: '/tmp/busboy/'
});

app.use(express.static('frontend'));

app.get('/api/drive', function (req, res) {
  file.readDir(ALPS_DIR).then((result) => {
    res.send(result);
  });
})

app.get('/api/drive/:name', function (req, res) {
  file.readDir(ALPS_DIR + '/' + req.params.name).then((result) => {
    res.send(result);
  })
})

app.post('/api/drive', function (req, res) {
  file.createDir(ALPS_DIR, req.query.name).then((result) => {
    res.status(201).send(result);
  })
})

app.post('/api/drive/:folder', function (req, res) {
  file.createDir(ALPS_DIR + '/' + req.params.folder, req.query.name).then((result) => {
    res.status(201).send(result);
  })
})

app.delete('/api/drive/:name', function (req, res) {
  file.deleteFileOrDir(ALPS_DIR, req.params.name).then((result) => {
    res.status(201).send(result);
  })
})

app.delete('/api/drive/:folder/:name', function(req, res) {
  file.deleteFileOrDir(ALPS_DIR + '/' + req.params.folder, req.params.name).then((result) => {
    res.status(201).send(result);
  })
})

app.put('/api/drive', function(req, res) {
  file.addFile(req.files.file.filename, ALPS_DIR, req.files.file.file).then((result) => {
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