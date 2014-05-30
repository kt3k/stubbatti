// test/stubbatti.js

/* global describe, it, afterEach, beforeEach */

'use strict';

var exec = require('child_process').exec;
var expect = require('chai').expect;

var Stubbatti = require('./');

var DEFAULT_HOST = '0.0.0.0:28987';


// test utility for get request the server
var get = function (path, cb) {

    exec('curl ' + DEFAULT_HOST + path, function (error, stdout) {
        cb(stdout.toString());
    });

};


describe('Stubbatti', function () {

    var stubbatti;

    beforeEach(function () {

        stubbatti = new Stubbatti();
        stubbatti.setConsole({log: function () {}});

    });

    afterEach(function (done) {

        stubbatti.stop(function () {

            done();

        });

    });

    describe('register', function () {

        it('registers a response for a path', function (done) {

            stubbatti.register('get', '/hello', 'Hello, world!');

            stubbatti.start(function () {

                get('/hello', function (responseText) {

                    expect(responseText).to.equal('Hello, world!');

                    done();

                });

            });
        });

        it('registers a delayed response for a path if delay option is specified', function (done) {

            stubbatti.register('get', '/delay', 'delayed response', {delay: 1000});

            var startTime = new Date().getTime();

            stubbatti.start(function () {

                get('/delay', function (responseText) {

                    expect(responseText).to.equal('delayed response');

                    var endTime = new Date().getTime();

                    var error = Math.abs(startTime + 1000 - endTime);

                    expect(error).to.be.below(100);

                    done();

                });

            });

        });
    });

});
