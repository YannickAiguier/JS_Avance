// module général, qui se contente d'appeler les modules nécessaires et de lancer le serveur
const srv = require('./server');
const file = require('./file');

file.rootFolderOK().then(() => {
    srv.start();
})
