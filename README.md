[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Sonarvio Editor
===============

A React component to select and transform source data of audio files with an interface for a [remote converter](http://github.com/Sonarvio/sonarvio-converter).

`npm install --save sonarvio-editor`


## Usage

Currently the exposes only the 'Editor' Component which requires at least a `source` property.
References to a remote proxy or local video element can be passed in addition.

```js
var Editor = require('sonarvio-editor')

render() {
	return (
		<Editor source={buffer} proxy={'proxy'} video={document.getElementByTagName('video')}/>
	)
}
```

A concrete example can be found [here](https://github.com/Sonarvio/sonarvio-editor/blob/master/example/main.js).
Just run 'node build' and checkout `http://localhost:10000`.
