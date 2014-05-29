// src/stubbatti.js

var express = require('express');
var manifest = require('../package.json');


var DEFAULT_STUBBATTI_PORT = 28987;


/**
 * Call a callback if it's callable.
 *
 * @param {Object} cb callback or any object.
 * @return {void}
 */
var softCall = function (cb) {

    if (typeof cb === 'function') {
        cb();
    }

};


/**
 * Stubbatti class represents a stub server instance.
 */
var Stubbatti = function () {
    this.port = DEFAULT_STUBBATTI_PORT;
    this.app = express();
    this.console = global.console;

    var stubbatti = this;

    this.app.get('/__kill', function (req, res) {
        res.send('The stub server has been killed.\n');
        res.end();

        setTimeout(function () {
            stubbatti.stop();
        });
    });
};


Stubbatti.version = manifest.version;


// available methods
Stubbatti.methods = ['get', 'post', 'head', 'delete', 'put', 'options'];

// prototype variable
var stubbattiPt = Stubbatti.prototype;


/**
 * Set the console object.
 *
 * @param {Object} console console object
 * @return {void}
 */
stubbattiPt.setConsole = function (console) {
    this.console = console;
};


/**
 * Register method and path with options for a stub response.
 *
 * @param {String} method HTTP method
 * @param {String} path path to stub
 * @param {String} body response body
 * @param {Object} options for a stub response
 * @return {void}
 */
stubbattiPt.register = function (method, path, body, options) {

    // register method and path
    this.app[method](path, function (req, res) {

        res.send(body);
        res.end();

    });

};


/**
 * Start the server instance listening.
 *
 * @param {Function} cb callback function which called when the server started
 * @return {void}
 */
stubbattiPt.start = function (cb) {

    var self = this;

    var server = this.server = this.app.listen(this.port, function () {
        self.console.log('The stub server is listening on %s:%s', server.address().address, server.address().port);

        softCall(cb);
    });

    // set timeout of 0.5 sec to each connection
    server.on('connection', function (socket) {

        socket.setTimeout(500);

    });

};


/**
 * Stop the server.
 *
 * @return {void}
 */
stubbattiPt.stop = function (cb) {

    if (this.server == null) {
        softCall(cb);

        return;
    }

    var self = this;

    this.server.close(function () {

        self.server = null;

        self.console.log('The stub server has been stopped.');

        softCall(cb);
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
