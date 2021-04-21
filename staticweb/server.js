const express = require('express');
const file = require('./file');
const { ALPS_DIR } = require('./file');
const app = express();
const port = 3000;

// module express-busboy, pour récupérer les fichers envoyés lors des requêtes PUT
const bb = require('express-busboy');
bb.extend(app, {
  upload: true,
  path: '/tmp/busboy/'
});

// utilisation d'un routeur pour gérer les routes récursives
const router = express.Router();
router.use(function (req, res, next) {
  // fonction middleware qui récupère le path dans l'url (après /api/drive/ et avant le premier ?)
  const endIndex = req.url.indexOf('?');
  if (endIndex == -1) {
    req.myPath = req.url.slice(11);
  } else {
    req.myPath = req.url.slice(11, endIndex);
  }
  next();
})

// GET /api/drive/*
// affiche le contenu du dossier ou fichier demandé
router.get('/*', function (req, res) {
  file.readDir(ALPS_DIR + '/' + req.myPath).then((result) => {
    res.send(result);
  });
})

// POST /api/drive*?name={name}
// crée le dossier 'name' dans le dossier demandé
router.post('/*', function (req, res) {
  if (file.isAlphanumeric(req.query.name)) {
    file.createDir(ALPS_DIR + '/' + req.myPath, req.query.name).then((result) => {
      res.status(201).send(result);
    })
  } else {
    res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
  }

})

// DELETE /api/drive/{name}
// supprime le dossier ou fichier 'racine/name'
router.delete('/*/:name', function (req, res) {
  if (file.isAlphanumeric(req.params.name)) {
    file.deleteFileOrDir(ALPS_DIR + '/' + req.myPath, req.params.name).then((result) => {
      res.status(201).send(result);
    })
  } else {
    res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
  }
})

// PUT /api/drive
// crée un fichier à la racine du drive
router.put('/api/drive', function (req, res) {
  file.addFile(req.files.file.filename, ALPS_DIR, req.files.file.file).then((result) => {
    res.status(201).send(result);
  })
})

// PUT /api/drive/{folder}
// crée un fichier dans 'racine/folder'
router.put('/api/drive/:folder', function (req, res) {
  file.addFile(req.files.file.filename, ALPS_DIR + '/' + req.params.folder, req.files.file.file).then((result) => {
    res.status(201).send(result);
  })
})

function start() {
  app.listen(port, () => {
    console.log(`Alps Box app listening at http://localhost:${port}`)
  });
};


app.use(express.static('frontend'));
app.use('/', router);

module.exports = {
  start: start,
};