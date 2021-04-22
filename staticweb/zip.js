const { createGzip } = require('zlib');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');

function doZip(input, output) {
    return pipeline(createReadStream(input), createGzip(), createWriteStream(output))
    .catch((err) => {
        return err;
    })
}

module.exports = { doZip };