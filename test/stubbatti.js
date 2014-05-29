
var exec = require('child_process').exec;
var expect = require('chai').expect;

var Stubbatti = require('../src/stubbatti.js');

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

                exec('curl 0.0.0.0:28987/hello', function (err, stdout, stderr) {

                    expect(stdout).to.equal('Hello, world!');

                    done();

                });

            });
        });
    });

});
