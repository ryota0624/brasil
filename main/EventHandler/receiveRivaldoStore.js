const {STORE_DATA} = require("../../constants/EventType");
const RivaldoStore = require("../Store/RivaldoStore").store;
function handleRivaldoStore(ipcMain) {
  ipcMain.on(STORE_DATA, (event, args) => {
    const {json, name} = args;
    RivaldoStore.setStore(name, json);
  });
}

module.exports = handleRivaldoStore;
