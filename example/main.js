/**
 * Example
 * =======
 *
 *
 */

var ReactDOM = require('react-dom')
var Editor = require('../src/index').Editor

var source = './data/big-buck-bunny_trailer.webm'

fetch(source).then((res) => res.arrayBuffer()).then((data) => {
	var wrapper = document.getElementById('root')
  var editor = React.createElement(Editor, {
		// proxy: 'http://localhost:8080/proxy.html',
		source: new Uint8Array(data)
	})
  ReactDOM.render(editor, wrapper)
  wrapper.classList.remove('preload')
})
