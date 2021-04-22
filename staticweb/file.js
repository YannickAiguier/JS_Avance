const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const TMP_DIR = os.tmpdir();
const ALPS_DIR = path.join((TMP_DIR), 'alps-drive');

// fonction pour définir le répertoire de base /tmp/alps-drive : on demande son contenu avec readdir
// soit il existe (then) et on ne fait rien, soit il n'existe pas (catch) et on le crée
// retourne une promesse
function rootFolderOK() {
    return fs.readdir(ALPS_DIR)
        .then(() => {
            console.log(`Le dossier ${ALPS_DIR} existe déjà.`);
        }).catch(err => {
            return createAlpsDir();
        });
};

// fonction pour créer le répertoire /tmp/alps-drive
// retourne une promesse
function createAlpsDir() {
    return fs.mkdir(ALPS_DIR).then(() => {
        console.log(`Création du dossier ${ALPS_DIR}.`);
    }).catch(() => {
        console.log(`Erreur : impossible de créer le dossier ${ALPS_DIR} !`);
    });
};

// fonction pour lister le contenu d'un répertoire ou lire un fichier
// retourne une promesse
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
// retourne une promesse
function createDir(dir) {
    return fs.mkdir(dir).then(() => {
        console.log(`Dossier ${dir} créé`);
        return {};
    }).catch((err) => {
        console.log('Erreur à la création du dossier...', err);
        return err;
    })
}

// fonction pour supprimer un dossier ou un fichier 'name' dans 'dir'
// retourne une promesse
function deleteFileOrDir(dir) {
    return fs.rm(dir, { recursive: true }).then(() => {
        console.log(`Suppression de ${dir}`);
        return {};
    })
        .catch((err) => {
            console.log('Erreur à la suppression...');
            return err;
        })
}

// fonction pour créer un fichier 'name' dans 'dir' depuis le fichier 'src'
// retourne une promesse
function addFile(name, dir, src) {
    return fs.copyFile(src, path.join(dir, name)).then((result) => {
        console.log(`Création de ${name} dans ${dir}`);
        return {};
    })
        .catch((err) => {
            return err;
        })
}

// fonction pour vérifier que le nom de fichier ne comporte que des caractères alpha-numériques et ._-
// retourne un booléen
function isAlphanumeric(str) {
    const myRegexp = new RegExp('^[a-zA-Z0-9._-]*$');
    return myRegexp.test(str);
}

// fonction pour vérifier qu'un dossier existe
// retourne une promesse
function folderExists(dir) {
    return fs.stat(dir).then((result) => {
        return true;
    }).catch((err) => {
        return false;
    })
}

module.exports = {
    rootFolderOK,
    readDir,
    createDir,
    deleteFileOrDir,
    addFile,
    isAlphanumeric,
    folderExists,
    ALPS_DIR,
};