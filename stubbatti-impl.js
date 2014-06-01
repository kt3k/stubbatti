'use strict';

var express = require('express');
var version = require('./package.json').version;


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
        res.set('Connection', 'close');
        res.send('The stub server has been killed.\n');
        res.end();

        stubbatti.stop();

    });
};


Stubbatti.version = version;


// available methods (RFC 2616)
// from http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
// NOTE: connect is not supported
Stubbatti.methods = ['get', 'post', 'head', 'delete', 'put', 'options', 'trace'];

// prototype variable
var stubbattiPt = Stubbatti.prototype;


/**
 * Set the console object.
 *
 * This method is only for tests.
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
 * Available options are `delay`:Number, `status`:Number, `contentType`:String and `headers`:Object<String, String>.
 *
 * `delay` is for the delay miliseconds of the response.
 * `status` is for the http status of the response.
 * `headers` is for the custom HTTP headers of the response.
 *
 * @param {String} method HTTP method
 * @param {String} path path to stub
 * @param {String} body response body
 * @param {Object} options options for a stub response
 * @return {void}
 */
stubbattiPt.register = function (method, path, body, options) {

    options = options || {};

    var delay = options.delay ? +options.delay : 0;
    var status = options.status;
    var contentType = options.contentType;
    var headers = options.headers;

    // register method and path
    this.app[method](path, function (req, res) {

        setTimeout(function () {

            if (status) {
                res.status(status);
            }

            if (contentType) {
                res.set('Content-Type', contentType);
            }

            if (headers) {
                res.set(headers);
            }

            res.send(body);
            res.end();

        }, delay);

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

};


/**
 * Stop the server.
 *
 * @param {Function} cb A callback function which will be called when the server stopped
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
