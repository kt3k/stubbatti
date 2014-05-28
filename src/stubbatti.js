// src/stubbatti.js

var express = require('express');


var DEFAULT_STUBBATTI_PORT = 28987;


/**
 * Stubbatti class represents a stub server instance.
 */
var Stubbatti = function () {
    this.port = DEFAULT_STUBBATTI_PORT;
    this.app = express();
}


// available methods
Stubbatti.methods = ['get', 'post', 'head', 'delete', 'put', 'options'];

// prototype variable
var stubbattiPt = Stubbatti.prototype;


/**
 * Register method and path with options for a stub response.
 *
 * @param {String} method HTTP method
 * @param {String} path path to stub
 * @param {Object} options for a stub response
 * @return {void}
 */
stubbattiPt.register = function (method, path, options) {

    // cast string `options`
    if (typeof options === 'string') {
        options = {body: options};
    }

    // register method and path
    this.app[method](path, function (req, res) {

        res.send(options.body);
        res.end();

    });

};


/**
 * Start the server instance listening.
 *
 * @return {void}
 */
stubbattiPt.start = function () {

    var server = this.app.listen(this.port, function () {
        console.log('listening on %s:%s', server.address().address, server.address().port);
    });

};


/**
 * Set port number
 *
 * @param {Number} port port number
 * @return {void}
 */
stubbattiPt.setPort = function (port) {
    this.port = port;
};


// export
module.exports = Stubbatti;
