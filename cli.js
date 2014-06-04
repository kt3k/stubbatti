#! /usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var Stubbatti = require('./');
var homepage = require('./package.json').homepage;


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
        '.js': null
    },
    processTitle: 'stubbatti',
});


// main

var main = function (env) {

    console.log('Stubbatti server version %s.', Stubbatti.version);

    if (!env.configPath) {
        console.log('Error: `stubbatti` file not found.');
        console.log('see %s', homepage);

        return;
    }

    console.log('Loading %s.', env.configPath);

    // load user defined stubbatti file
    require(env.configPath);

    // if `--kill` option is specified then don't launch a stub server but kill the existing sevrer.
    if (argv.kill) {
        stubbatti.killExistingServer();

        return;
    }

    // launch a stub server
    stubbatti.start();
};


cli.launch({
    cwd: argv.cwd,
    configPath: argv.config
}, main);
