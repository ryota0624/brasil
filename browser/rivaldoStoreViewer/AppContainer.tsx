import * as React from "react";
import {RivaldoStoreJSON, Store} from "./types";
import List from "./StoreList/List";

interface AppContainerState {
  stores: RivaldoStoreJSON[]
}

interface AppContainerProps {
  store: Store
}

class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
  constructor() {
    super();
    this.state = {stores: []};
  }
  componentDidMount() {
    this.props.store.addChangeListener((store: any) => {
      const stores = Object.keys(store).reduce((stores: RivaldoStoreJSON[], storeName: string) => {
        const storeState = {name: storeName, json: store[storeName]};
        return stores.concat(storeState);
      }, []);
      this.setState({stores});
    })

  }
  render() {
    return <List {...this.state} />
  }
}

module.exports = AppContainer;
