# Stubbatti v1.0.0

[![Build Status](https://img.shields.io/travis/kt3k/stubbatti.svg?style=flat)](https://travis-ci.org/kt3k/stubbatti)
[![Coverage Status](https://img.shields.io/coveralls/kt3k/stubbatti.svg?style=flat)](https://coveralls.io/r/kt3k/stubbatti?branch=master)
![Npm Version](https://img.shields.io/npm/v/stubbatti.svg?style=flat)

[![Dependency Status](https://david-dm.org/kt3k/stubbatti.svg?style=flat)](https://david-dm.org/kt3k/stubbatti)

> A command line stub http server with the special DSL.

# Install

- Install `node.js` ( >= 0.9 ).

- Using `npm`, install `stubbatti` command globally:

```bash
npm install -g stubbatti
```

# Usage

Stubbatti is configurable with the file named `.stubbatti.js` or `stubbatti.js`.

And in it you can write like following:

```js
get('/hello', 'Hello, world!');
```

And if you run the command `stubbatti` then stubbatti server will start listening on port 28987 (by default) and will serve the string `Hello, world!` when the path `/hello` requested.

# Reference

## `.stubbatti.js` reference

**Basic Response**

You can set a response body for the path:

```js
get('/hello', 'Hello, world!');
```

With the above, `/hello` responses `Hello, world!` with http status `200`.

**Response delay**

You can delay response with `delay` option:

```js
get('/slow', 'slow response', {delay: 3000});
```

With the above, `/slow` responses after the delay of 3000 miliseconds.

This is useful for testing timeout features of client libraries.

**Content-Type**

You can specify the content-type of the reponse with `contentType` option:

```js
get('/json', '{"a":1}', {contentType: 'application/json'});
```

With the above, `/json` responses `{"a":1}` with `Content-Type: application/json`.

**Status Code**

You can specify the status code of the response with `status` option:

```js
get('/402', 'payment required', {status: 402});
```

With the above, `/402` responses `payment required` with http status code `402`.

**Custom Headers**

You can specify custom headers with `headers` option:

```js
get('/custom', '{"a":1}', {headers: {
    'X-Custom': 'abc',
    'X-Header': 'def'
}});
```

With the above settings, `/custom` responses with the HTTP headers like:

```
X-Custom: abc
X-Header: def
```

**Other Methods**

Available methods are `get`, `post`, `head`, `options`, `put`, `delete`.

Followings are valid notations in `.stubbatti.js`.

```js
get('/foo', '3');
post('/bar', '6');
head('/baz', '15');
options('/spam', '21');
put('/ham', '28');
global.delete('/egg', '36');
trace('/egg', '45');
```

**Setting port**

You can set the stub server's port number with `port` method:

```
port(80);
```

The default port number of stubbatti is 28987.

**Syntax and semantics**

The syntax and semantics of `.stubbatti.js` is basically same as `node.js` except some addition of global methods.

## Command Line Options

With `--config` option, you can specify a custom stubbatti file.

```bash
stubbatti --config my_stub_settings.js
```

With `--kill` option, you can kill the server. With this option, you can set your test script like following:

```
stubbatti & # launch a stub server

# run unit test using the stub http server
...

stubbatti --kill # kill the stub server
```

## Special Paths

A `HEAD` request to the path `/__kill` has the special meaning, which is used for killing the server process. So you shouldn't write `head('__kill', ...);` in `.stubbatti.js`.

# LICENSE

MIT

# Note

This command is a thin wrapper of `express` and focusing on stubbing an http server on test environments. This cli should be useful when you write the unit test of an http client or a web api client.

# [API documentation](http://kt3k.github.io/stubbatti/doc/v1.0.0/)

# Similar tools

- [Betamax](https://github.com/robfletcher/betamax) for JVM languages
- [VCR](https://github.com/vcr/vcr) for Ruby
- [WireMock](https://github.com/tomakehurst/wiremock) for JVM languages
- [Stubby](https://github.com/azagniotov/stubby4j) for JVM languages and has CLI
  - Stubby is very similar to stubbatti, but the main target is JVM language with gradle build configuration.
- [wiremock-php](https://github.com/rowanhill/wiremock-php) for PHP
- [objc-mocktail](https://github.com/square/objc-mocktail) for Objective-C

The difference of stubbatti from above tools is that it's just a CLI stub server and can be used with any language through hooks in a shell script.
And it needs only one setting file `.stubbatti.js` with the simple language.
