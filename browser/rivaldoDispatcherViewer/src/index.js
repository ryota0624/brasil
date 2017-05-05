require('./main.css')
var logoPath = require('./logo.svg')
var Elm = require('./App.elm')

var root = document.getElementById('root')

const elm = Elm.App.embed(root, logoPath)

window.elm = elm;
