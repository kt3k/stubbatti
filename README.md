# Stubbatti v0.1.0

> stub http server, configurable by stubbatti DSL (WIP)

# Install

Using `npm`, install cli globally:

```
npm install -g stubbatti
```

# Usage

Stubbatti is configured by the file named `.stubbatti.js` or `stubbatti.js`.

And in it you can write like following:

```
get('/abc', 'hello world');
```

And if you run the command `stubbatti` then stubbatti server starts listening on port 28987 (for default) and will serve the string `hello world` when the path `/abc` requested.

# LICENSE

MIT

# Note

This command is a thin wrapper of `express` and focusing on stubbing an http server on test environments. This cli should be useful when you write the unit test of an http client or a web api client.
