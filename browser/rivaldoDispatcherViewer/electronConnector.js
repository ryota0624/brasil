const DispatcherEventStore = require("../../../main/Store/DispatcherEventStore").Store;
const ipc = require('electron').ipcRenderer;
const store = new DispatcherEventStore(ipc);
store.addChangeListener(state => {
  if (state[0]) {
    window.elm.ports.receiveEvent.send(state[0]);
    console.log(state[0])
  }
})
