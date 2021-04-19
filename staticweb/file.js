const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const TMP_DIR = os.tmpdir();
const ALPS_DIR = path.join((TMP_DIR), 'alps-drive');

// fonction pour définir le répertoire de base /tmp/alps-drive : on demande son contenu avec readdir
// soit il existe (then) et on ne fait rien, soit il n'existe pas (catch) et on le crée
function rootFolder() {
    return fs.readdir(ALPS_DIR)
        .then(() => {
            console.log(`Le dossier ${ALPS_DIR} existe déjà.`);
        }).catch(err => {
            return createAlpsDir();
        });
};

// fonction pour créer le répertoire /tmp/alps-drive
function createAlpsDir() {
    return fs.mkdir(ALPS_DIR).then(() => {
        console.log(`Création du dossier ${ALPS_DIR}.`);
    }).catch(() => {
        console.log(`Erreur : impossible de créer le dossier ${ALPS_DIR} !`);
    });
};

// fonction pour lister le contenu d'un répertoire
function readDir(path) {
    return fs.readdir(path, { withFileTypes: true }).then((result) => {
        const myResult = [];
        result.forEach(element => {
            myResult.push({name: element.name, isFolder: element.isDirectory()});
        })
        return myResult;
    }).catch((err) => {
        if(err.code == 'ENOTDIR') {
            // c'est un fichier, on le lit (téléchargement)
            return fs.readFile(path, { encoding: 'utf8' });
        }
    });
}

// fonction pout créer un dossier
function createDir(dir, name) {
    return fs.mkdir(path.join(dir, name)).then(() => {
        console.log(`Dossier ${name} créé dans ${dir}`);
    })
    .catch(() => {
        console.log('Erreur à la création du dossier...');
    })
}

module.exports = {
    rootFolderOK: rootFolder,
    readDir: readDir,
    createDir: createDir,
    ALPS_DIR: ALPS_DIR
};