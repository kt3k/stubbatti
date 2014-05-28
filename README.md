# Stubbatti v0.1.0

> stub http server, configurable by stubbatti DSL (WIP)

# Install

Using `npm`, install `stubbatti` command globally:

```bash
npm install -g stubbatti
```

# Usage

Stubbatti is configurable with the file named `.stubbatti.js` or `stubbatti.js`.

And in it you can write like following:

```js
get('/hello', 'Hello, world!');
```

And if you run the command `stubbatti` then stubbatti server will start listening on port 28987 (for default) and will serve the string `Hello, world!` when the path `/hello` requested.

# Reference

## `.stubbatti.js`

**delay**

```js
get('/slow', 'slow response', {delay: 3000});
```

With the above, `/slow` responses `slow response` after the delay of 3000 miliseconds.

This is useful for testing timeout features of client libraries.

**contentType**

```js
get('/json', '{"a":1}', {contentType: 'application/json'});
```

With the above, `/json` responses `{"a":1}` with `Content-Type: application/json`.

**Custom Headers**

```js
get('/custom', '{"a":1}', {headers: {
    'X-Custom': 'abc',
    'X-Header': 'def'
}});
```

`/custom` responses with the HTTP headers like:

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
delete('/egg', '36');
```


## Utility

Requesting (GET) `/__kill` kills the stub server. This is usable like the below:

```bash
stubbatti & # launch a stub server

# run unit test using the stub http server
...

curl 0.0.0.0:28987/__kill # kill the stub server
```


# LICENSE

MIT

# Note

This command is a thin wrapper of `express` and focusing on stubbing an http server on test environments. This cli should be useful when you write the unit test of an http client or a web api client.
