const srv = require('./server');
const file = require('./file');

file.rootFolderOK().then(() => {
    srv.start();
})
