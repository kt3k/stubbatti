#! /usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
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
        stubbatti.killExistingServer();

        return;
    }

    console.log('Stubbatti server version %s.', Stubbatti.version);

    // launch a stub server
    stubbatti.start();
};


cli.launch({
    cwd: argv.cwd,
    configPath: argv.config
}, main);
