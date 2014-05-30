// test/stubbatti.js

/* global describe, it, afterEach, beforeEach */

'use strict';

var http = require('http');
var concat = require('concat-stream');
var expect = require('chai').expect;

var Stubbatti = require('./');

var DEFAULT_HOST = '0.0.0.0';
var DEFAULT_PORT = 28987;

// test utility for get request the server
var request = function (method, path, cb) {

    http.request({hostname: DEFAULT_HOST, port: DEFAULT_PORT, path: path, method: method}, function (res) {

        res.pipe(concat({encoding: 'string'}, function (data) {
            cb(data, res.headers, res.statusCode);
        }));

    }).end();

};

var get = function (path, cb) {
    request('GET', path, cb);
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

                get('/hello', function (data, headers, status) {

                    expect(data).to.equal('Hello, world!');
                    expect(status).to.equal(200);

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


        it('registers a response with a custom status code if status option is set', function (done) {

            stubbatti.register('get', '/402', 'payment required', {status: 402});

            stubbatti.start(function () {

                get('/402', function (data, headers, status) {

                    expect(status).to.equal(402);

                    done();

                });

            });

        });


        it('registers a response with custom headers if `headers` options are set', function (done) {

            stubbatti.register('get', '/custom', 'custom', {headers: {
                'X-Custom': 'abc',
                'X-Header': 'def'
            }});

            stubbatti.start(function () {

                get('/custom', function (data, headers) {

                    expect(headers['x-custom']).to.equal('abc');
                    expect(headers['x-header']).to.equal('def');

                    done();

                });

            });

        });


        it('registers a response for POST, HEAD, OPTIONS, PUT, DELETE, TRACE method', function (done) {

            stubbatti.register('post', '/post', 'post');
            stubbatti.register('head', '/head', '');
            stubbatti.register('options', '/options', 'options');
            stubbatti.register('put', '/put', 'put');
            stubbatti.register('delete', '/delete', 'delete');
            stubbatti.register('trace', '/trace', 'trace');

            stubbatti.start(function () {

                request('POST', '/post', function (data, headers, status) {

                    expect(data).to.equal('post');
                    expect(status).to.equal(200);

                    request('HEAD', '/head', function (data, headers, status) {

                        expect(data).to.equal('');
                        expect(status).to.equal(200);

                        request('OPTIONS', '/options', function (data, headers, status) {

                            expect(data).to.equal('options');
                            expect(status).to.equal(200);

                            request('PUT', '/put', function (data, headers, status) {

                                expect(data).to.equal('put');
                                expect(status).to.equal(200);

                                request('DELETE', '/delete', function (data, headers, status) {

                                    expect(data).to.equal('delete');
                                    expect(status).to.equal(200);

                                    request('TRACE', '/trace', function (data, headers, status) {

                                        expect(data).to.equal('trace');
                                        expect(status).to.equal(200);

                                        done();

                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    });

});
