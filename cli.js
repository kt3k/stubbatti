#! /usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var http = require('http');
var Stubbatti = require('./');


// construct stubbatti DSL vocabulary

var stubbatti = new Stubbatti();

Stubbatti.methods.forEach(function (method) {

    global[method] = function (path, body, opts) {
        stubbatti.register(method, path, body, opts);
    };

});


/**
 * ```
 * port(12345);
 * ```
 * Sets the stub server's port.
 */
global.port = function (port) {

    stubbatti.setPort(port);

};


// set up liftoff params

var cli = new Liftoff({
    name: 'stubbatti',
    moduleName: 'stubbatti',
    configName: '{,.}stubbatti',
    extensions: {
        '.js': null,
        '': null
    },
    processTitle: 'stubbatti',
});


// main

var main = function (env) {

    // load user defined stubbatti file
    require(env.configPath);

    // if `--kill` option is specified then don't launch a stub server but kill the existing sevrer.
    if (argv.kill) {
        killServer(stubbatti.port);

        return;
    }

    console.log('Stubbatti server version %s.', Stubbatti.version);

    // launch a stub server
    stubbatti.start();
};

/**
 * Kill the stub server on the port number.
 *
 * Note: The path `/__kill` is the special path for killing the stub server.
 *
 * @param {Number} port The port number.
 * @return {void}
 */
var killServer = function (port) {

    http.request({host: '0.0.0.0', port: port, path: '/__kill', method:'HEAD'}).on('error', function () {
        console.log('No stub server on the port %s.', port);
    }).end();

};

cli.launch({
    cwd: argv.cwd,
    configPath: argv.config
}, main);
