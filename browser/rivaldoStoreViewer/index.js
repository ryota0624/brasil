window.React = require('react');
window.ReactDOM = require('react-dom');
window.R = window.React.createElement;
const ipc = require('electron').ipcRenderer;
const RivaldoStore = require("../../main/Store/RivaldoStore").Store;
const store = new RivaldoStore(ipc);
const App = require("./AppContainer");
ReactDOM.render(React.createElement(App, {store}), document.getElementById("app"));
