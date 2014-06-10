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

    // If `-h` or `--help` option is specified then it shows the help messages and exits.
    if (argv.help || argv.h) {
        showHelp();

        return;
    }

    if (!env.configPath) {
        console.log('Error: `stubbatti` file not found.');
        console.log('see %s', homepage);

        return;
    }

    console.log('Loading %s.', env.configPath);

    // load user defined stubbatti file
    require(env.configPath);

    // If `--kill` option is specified then it doesn't launch a stub server but kills the existing sevrer.
    if (argv.kill) {
        stubbatti.killExistingServer();

        return;
    }

    // launch a stub server
    stubbatti.start();
};

var showHelp = function () {
    console.log('Usage:');
    console.log('    stubbatti                          Start the stub server');
    console.log('    stubbatti [--config filename]      Start the stub server with the specified config file');
    console.log('    stubbatti --kill                   Kill the existing stub server');
    console.log('    stubbatti -h | --help              Show help message');
    console.log('[.stubbatti.js] file tutorial:');
    console.log('    get("/hello", "Hello, world!");                           Register `Hello, world!` response to the path `/hello`');
    console.log('    get("/delay", "delayed response", {delay: 1000});         Register 1000 milliseconds delayed response');
    console.log('    get("/json", "{}", {contentType: "application/json"});    Register a response with the content-type application/json');
    console.log('    get("/402", "Payment Required", {status: 402});           Register a response with the status code 402');
    console.log('    get("/custom", "custom", {headers: {"Any": "Header"}});   Register a response with custom headers');
    console.log('    post("/post", "POST response");                           Register a POST response');
    console.log('    port(10080);                                              Set the stub server\'s port to 10080');
};

cli.launch({

    cwd: argv.cwd,
    configPath: argv.config

}, main);
