// module qui gère le fonctionnement du serveur
// on utilise express comme serveur html, le module file pour la gestion des fichiers,
// et le module zip pour la compression de fichier
const express = require('express');
const app = express();
const port = 3000;
const file = require('./file');
const { ALPS_DIR } = require('./file'); // déstructuration, juste pour ne pas écrire file.ALPS_DIR à chaque fois
const zip = require('./zip');

const jwt = require('jsonwebtoken');
const secret = 'mysecretphrase';
let myToken = '';

const authJwt = require('./jwt');

// configuration du module express-busboy, pour récupérer les fichers envoyés lors des requêtes PUT
const bb = require('express-busboy');
bb.extend(app, {
  upload: true,
  path: '/tmp/busboy/'
});

// utilisation d'un routeur pour gérer les routes récursives
const router = express.Router();
router.route('/api/drive*')
  .all(function (req, res, next) {
    // fonction middleware qui récupère le path dans l'url (après /api/drive/ et avant le premier ?)
    const endIndex = req.url.indexOf('?');
    if (endIndex == -1) { // pas de ? dans l'url
      req.myPath = req.url.slice(11);
    } else {
      req.myPath = req.url.slice(11, endIndex);
    }
    next();
  })

  // GET /api/drive/*
  // affiche le contenu du dossier ou fichier demandé
  .get(function (req, res) {
    if (req.query.zip == 'true') {
      // envoyer en zippé
      zip.doZip(ALPS_DIR + '/' + req.myPath, '/tmp/files.zip').then((result) => {
        res.status(200).sendFile('/tmp/files.zip');
      })
    } else {
      // renvoyer le contenu du fichier (download)
      file.readDir(ALPS_DIR + '/' + req.myPath).then((result) => {
        if (result.errno) {
          res.status(404).send(result);
        } else {
          res.status(200).send(result);
        }
      })
    }
  })

  // POST /api/drive*?name={name}
  // crée le dossier 'name' dans le dossier demandé
  .post(function (req, res) {
    if (file.isAlphanumeric(req.query.name)) {
      file.folderExists(ALPS_DIR + '/' + req.myPath).then((result) => {
        if (result) {
          // le dossier cible existe
          file.createDir(ALPS_DIR + '/' + req.myPath + '/' + req.query.name).then((result) => {
            if (result.errno) {
              res.status(404).send(result);
            } else {
              res.status(200).location('/api/drive/' + req.myPath + '/' + req.query.name).send(result);
            }
          })
        } else {
          res.status(404).send("Le dossier n'existe pas");
        }
      })

    } else {
      res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
    }

  })

  // DELETE /api/drive/*
  // supprime le dossier ou fichier demandé
  .delete(function (req, res) {
    const name = req.myPath.slice(req.myPath.lastIndexOf('/') + 1);
    if (file.isAlphanumeric(name)) {
      file.deleteFileOrDir(ALPS_DIR + '/' + req.myPath).then((result) => {
        if (result.errno) {
          res.status(404).send(result);
        } else {
          res.status(201).send(result);
        }
      })
    } else {
      res.status(400).send('Le nom doit contenir seulement des caractères alphanumériques');
    }
  })

  // PUT /api/drive/*
  // crée un fichier dans le dossier demandé
  .put(function (req, res) {
    if (req.files.file) { // il y a un fichier dans la requête
      file.addFile(req.files.file.filename, ALPS_DIR + '/' + req.myPath, req.files.file.file).then((result) => {
        if (result.errno) {
          res.status(404).send(result);
        } else {
          res.status(201).send(result);
        }
      })
    } else {
      res.status(400).send('Pas de fichier dans la requête');
    }

  })

function start() {
  app.listen(port, () => {
    console.log(`Alps Box app listening at http://localhost:${port}`);
    // test du module jwtwebtoken
    jwt.sign({ name: 'test' }, secret, {noTimestamp: true}, function (err, token) {
      console.log(token);
      jwt.verify(token, secret, function (err, payload) {
        console.log(payload);
      });
    });
  });
}

app.use(express.static('frontend'));
app.use(authJwt());
app.use('/', router);


module.exports = {
  start: start,
};