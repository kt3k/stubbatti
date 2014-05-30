// test/stubbatti.js

/* global describe, it, afterEach, beforeEach */

'use strict';

var http = require('http');
var concat = require('concat-stream');
var expect = require('chai').expect;

var Stubbatti = require('./');

var DEFAULT_HOST = 'http://0.0.0.0:28987';

// test utility for get request the server
var get = function (path, cb) {

    http.get(DEFAULT_HOST + path, function (res) {

        res.pipe(concat({encoding: 'string'}, function (data) {
            cb(data, res.headers);
        }));

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

                get('/hello', function (data) {

                    expect(data).to.equal('Hello, world!');

                    done();

                });

            });
        });

        it('registers a delayed response for a path if delay option is specified', function (done) {

            stubbatti.register('get', '/delay', 'delayed response', {delay: 1000});

            var startTime = new Date().getTime();

            stubbatti.start(function () {

                get('/delay', function (data) {

                    expect(data).to.equal('delayed response');

                    var endTime = new Date().getTime();

                    var error = Math.abs(startTime + 1000 - endTime);

                    expect(error).to.be.below(100);

                    done();

                });

            });

        });


        it('registers a response with custom Content-Type if contentType option is set', function (done) {

            stubbatti.register('get', '/json', '{}', {contentType: 'application/json'});

            stubbatti.start(function () {

                get('/json', function (data, headers) {

                    expect(headers['content-type']).to.match(/^application\/json;/);

                    done();

                });

            });

        });

    });

});
