const srv = require('./server');
const file = require('./file');

file.rootFolderOK().then(() => {
    srv.start();
    file.readDir('/tmp/alps-drive').then(() => {
        console.log('OK');
    });
})
