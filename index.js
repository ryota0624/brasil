const {BrowserWindow,app} = require('electron');
const ipcMain = require('electron').ipcMain;
const EventType = require("./constants/EventType");
const RivaldoStore = require("./main/Store/RivaldoStore").store;
const handleReceiveRivaldoStore = require("./main/EventHandler/receiveRivaldoStore");
const DispatcherEventStore = require("./main/Store/DispatcherEventStore").store;

app.on('', () => {

  let rivaldo = new BrowserWindow({width: 800, height: 600});
  let rivaldoDispatcherViewer = new BrowserWindow({width: 800, height: 600});
  let rivaldoStoreViewer = new BrowserWindow({width: 800, height: 600});

  rivaldo.loadURL(`file://${__dirname}/browser/index.html`);
  // rivaldo.openDevTools()
  // rivaldoStoreViewer.openDevTools()
  // rivaldoDispatcherViewer.openDevTools()

  RivaldoStore.addChangeListener((state) => {
    rivaldoStoreViewer.send("change_rivaldo_store", state);
  })

  DispatcherEventStore.addChangeListener((state) => {
    rivaldoDispatcherViewer.send("change_rivaldo_DispatherEventStore", state)
  })

  rivaldoStoreViewer.loadURL(`file://${__dirname}/browser/rivaldoStoreViewer/index.html`);
  rivaldoDispatcherViewer.loadURL(`file://${__dirname}/browser/rivaldoDispatcherViewer/dist/index.html`);
  RivaldoStore.setChild(rivaldoStoreViewer)
  DispatcherEventStore.setChild(rivaldoDispatcherViewer)


  rivaldoStoreViewer.on("closed", () => {
    rivaldoStoreViewer = null
  })
  rivaldoDispatcherViewer.on('closed', () => {
    rivaldoDispatcherViewer = null;
  });

  rivaldo.on('closed', () => {
    rivaldo = null;
  });

});

handleReceiveRivaldoStore(ipcMain);
