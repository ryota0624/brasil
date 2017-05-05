let startOnce = false;
const EventType = require("../../constants/EventType");
const ipc = require('electron').ipcRenderer;
window.addEventListener("_su_ready", () => {
  if (!startOnce) {
    startOnce = true;
    handleAppDispather(window._su_.Dispather);
    const stores = window._su_.stores.reduce((stores, store) => stores.concat([{name: store.constructor.name, store: store}]), []);
    stores.forEach(storeData => {
      handleStore(storeData.name, storeData.store);
    });
  }
});

function handleAppDispather(target) {
  function send(action) {
    ipc.send("receive_dispather_event_from_main", action);
  }

  target.register(action => {
    send(action);
  });
}

function handleStore(name, store) {
  function send() {
    const state = store.getAll();
    if (state) {
      ipc.send(EventType.STORE_DATA, { name, json: state.toJS() });
    }
  }
  if (store.getAll) store.addChangeListener(() => send());
}
