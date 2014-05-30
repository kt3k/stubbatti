#! /usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var Stubbatti = require('./');


// construct stubbatti DSL vocabulary

var stubServer = new Stubbatti();

Stubbatti.methods.forEach(function (method) {

    global[method] = function (path, body, opts) {
        stubServer.register(method, path, body, opts);
    };

});


/**
 * ```
 * port(12345);
 * ```
 * Sets the stub server's port.
 */
global.port = function (port) {

    stubServer.setPort(port);

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
    cwdFlag: 'cwd',
    configPathFlag: 'config'
});


// exec

cli.launch(function (env) {
    console.log('Stubbatti server version %s.', Stubbatti.version);

    require(env.configPath);

    stubServer.start();
});
