const ipcMain = require('electron').ipcMain

class DispatcherEventStore {
  constructor(parent) {
    this._fns = [];
    this.state =  [];
    if (parent) {
      console.log("dis")
      parent.on("change_rivaldo_DispatherEventStore", (ev, state) => {
        this.state = state;
        this._fns.forEach(fn => fn(this.state))
      });

      parent.on("receive_rivaldo_DispatherEventStore_from_main", (ev, {state}) => {
        this.state = state;
        this._fns.forEach(fn => fn(this.state))
      });

      parent.send("pull_rivaldo_DispatherEventStore");
      this.parent = parent;
    } else {
      if (ipcMain) ipcMain.on("receive_dispather_event_from_main", (event, args) => {
        this.appendEvent(args);
      });
    }


  }
  setChild(child) {
        ipcMain.on("pull_rivaldo_DispatherEventStore", () => {
          child.send("receive_rivaldo_DispatherEventStore_from_main", {state: this.state});
        });
  }
  addChangeListener(fn) {
    this._fns.push(fn);

    fn(this.state)
  };
  appendEvent(ev) {
    this.state = [ev].concat(this.state);
    this._fns.forEach(fn => fn(this.state))
  }
}
const store = new DispatcherEventStore();
module.exports = {
  store,
  Store: DispatcherEventStore
}
