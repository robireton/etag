# etag

Create simple HTTP ETags

This module generates HTTP ETags (as defined in RFC 7232) for use in
HTTP responses.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```shell
$ npm install @robireton/etag
```

## API

```js
import etag from '@robireton/etag'
```

### etag(entity, [options])

Generate a strong ETag for the given entity. This should be the complete
body of the entity. Strings, `Buffer`s, and `fs.Stats` are accepted. By
default, a strong ETag is generated except for `fs.Stats`, which will
generate a weak ETag (this can be overwritten by `options.weak`).

```js
res.setHeader('ETag', etag(body))
```

#### Options

`etag` accepts these properties in the options object.

##### weak

Specifies if the generated ETag will include the weak validator mark (that
is, the leading `W/`). The actual entity tag is the same. The default value
is `false`, unless the `entity` is `fs.Stats`, in which case it is `true`.

## License

[MIT](LICENSE)
