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
  req.myPath = req.url.slice(11);
  next();
})

// GET /api/drive
// affiche le contenu de la racine du drive
router.get('/*', function (req, res) {
  file.readDir(ALPS_DIR + '/' + req.myPath).then((result) => {
    res.send(result);
  });
})

// // GET /api/drive/{name}
// // affiche le contenu du dossier ou fichier 'name' situé à la racine du drive
// router.get('/api/drive/:name', function (req, res) {
//   file.readDir(ALPS_DIR + '/' + req.params.name).then((result) => {
//   console.log(req.myPath);
//     if (result.code == 'ENOENT') {
//       res.status(404).send("Le dossier/fichier n'existe pas");
//     } else {
//       res.send(result);
//     }
//   })
// })

// POST /api/drive?name={name}
// crée le dossier 'name' à la racine du drive
router.post('/api/drive', function (req, res) {
  if (file.isAlphanumeric(req.query.name)) {
    file.createDir(ALPS_DIR, req.query.name).then((result) => {
      res.status(201).send(result);
    })
  } else {
    res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
  }

})

// POST /api/drive/{folder}?name={name}
// crée le dossier 'name' dans 'racine/folder'
router.post('/api/drive/:folder', function (req, res) {
  if (file.isAlphanumeric(req.query.name)) {
    file.createDir(ALPS_DIR + '/' + req.params.folder, req.query.name).then((result) => {
      res.status(201).send(result);
    })
  } else {
    res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
  }
})

// DELETE /api/drive/{name}
// supprime le dossier ou fichier 'racine/name'
router.delete('/api/drive/:name', function (req, res) {
  if (file.isAlphanumeric(req.query.name)) {
    file.deleteFileOrDir(ALPS_DIR, req.params.name).then((result) => {
      res.status(201).send(result);
    })
  } else {
    res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
  }
})
// DELETE /api/drive/{folder}/{name}
// supprime le dossier ou fichier 'racine/folder/name'
router.delete('/api/drive/:folder/:name', function (req, res) {
  if (file.isAlphanumeric(req.query.name)) {
    file.deleteFileOrDir(ALPS_DIR + '/' + req.params.folder, req.params.name).then((result) => {
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