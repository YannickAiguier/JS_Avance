const expressJwt = require('express-jwt');
const secret = 'mysecretphrase';

function authJwt() {
    return expressJwt({
        secret,
        algorithms: ['HS256']
    });
}

module.exports = authJwt;