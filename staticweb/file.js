const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const TMP_DIR = os.tmpdir();
const ALPS_DIR = path.join((TMP_DIR), 'alps-drive');

// fonction pour définir le répertoire de base /tmp/alps-drive : on demande son contenu avec readdir
// soit il existe (then) et on ne fait rien, soit il n'existe pas (catch) et on le crée
function rootFolderOK() {
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

// fonction pour lister le contenu d'un répertoire ou lire un fichier
function readDir(path) {
    return fs.readdir(path, { withFileTypes: true }).then((result) => {
        // c'est un dossier, on liste le contenu et on le renvoie en JSON dans myResult
        const myResult = [];
        const myPromises = [];
        result.forEach(element => {
            if (element.isDirectory()) {
                // pour un dossier on ajoute juste les infos au tableau myResult
                myResult.push({ name: element.name, isFolder: element.isDirectory() });
            } else {
                // pour un fichier on ajoute une promesse (qui récupèrera la taille de fichier) au tableau myPromises
                myPromises.push(new Promise((resolve) => {
                    resolve(fs.stat(path + '/' + element.name).then((result) => {
                        return { name: element.name, size: result.size, isFolder: element.isDirectory() };
                    }));
                }));
            }
        });
        // on utilise le tableau myPromises pour récupérer toutes les tailles des fichiers, ajouter les infos
        // à myResult puis l'envoie comme résultat final
        return Promise.all(myPromises).then((values) => {
            values.forEach(value => {
                myResult.push(value);            
            })
            return myResult;
        });  
    }).catch((err) => {
        if (err.code == 'ENOTDIR') {
            // c'est un fichier, on le lit
            console.log(`Lecture de ${path}`);
            return fs.readFile(path);
        } else {
            return err;
        }
    });
}

// fonction pout créer un dossier 'name' dans 'dir'
function createDir(dir, name) {
    return fs.mkdir(path.join(dir, name)).then(() => {
        console.log(`Dossier ${name} créé dans ${dir}`);
    }).catch((err) => {
        console.log('Erreur à la création du dossier...', err);
    })
}

// fonction pour supprimer un dossier ou un fichier 'name' dans 'dir'
function deleteFileOrDir(dir, name) {
    return fs.rm(dir, { recursive: true }).then(() => {
        console.log(`Suppression de ${dir}`);
    })
        .catch((err) => {
            console.log('Erreur à la suppression...', err);
        })
}

// fonction pour créer un fichier 'name' dans 'dir' depuis le fichier 'src'
function addFile(name, dir, src) {
    return fs.copyFile(src, path.join(dir, name)).then((result) => {
        return result;
    })
        .catch((err) => {
            console.log(err);
        })
}

// fonction pour vérifier que le nom de fichier ne comporte que des caractères alpha-numériques et .-_
function isAlphanumeric(str) {
    const myRegexp = new RegExp('^[.-_a-zA-Z0-9]*$', 'g');
    return myRegexp.test(str);
}

module.exports = {
    rootFolderOK,
    readDir,
    createDir,
    deleteFileOrDir,
    addFile,
    isAlphanumeric,
    ALPS_DIR,
};