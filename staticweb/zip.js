//module qui gère la compression d'un fichier pour envoi
const { createGzip } = require('zlib');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');

// fonction qui compresse le fichier 'input' dans le fichier 'output'
function doZip(input, output) {
    return pipeline(createReadStream(input), createGzip(), createWriteStream(output))
    .catch((err) => {
        return err;
    })
}

module.exports = { doZip };