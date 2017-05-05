const ipcMain = require('electron').ipcMain

class Store {
  constructor(parent) {
    this._fns = [];
    this.state =  {};
    if (parent) {
      console.log("st")
      parent.on("change_rivaldo_store", (ev, state) => {
        this.state = state;
        this._fns.forEach(fn => fn(this.state))
      });

      parent.on("receive_rivaldo_state_from_main", (ev, {state}) => {
        this.state = state;
        this._fns.forEach(fn => fn(this.state))
      });

      parent.send("pull_rivaldo_state");
      this.parent = parent;
    }
  }
  setChild(child) {
        ipcMain.on("pull_rivaldo_state", () => {
          child.send("receive_rivaldo_state_from_main", {state: this.state});
        });
  }
  addChangeListener(fn) {
    this._fns.push(fn);

    fn(this.state)
  };
  setStore(name, state) {
    if (!this.state[name]) {
      this.state[name] = [state];
    } else {
      this.state[name] = [state].concat(this.state[name]);
    }
    this._fns.forEach(fn => fn(this.state))
  }
}
const store = new Store();
module.exports = {
  store,
  Store
}
