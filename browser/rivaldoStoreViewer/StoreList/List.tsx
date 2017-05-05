import * as React from "react";
import {RivaldoStoreJSON} from "../types";

import ListItem from "../store/ListItem";

export interface ListProps {
  stores: RivaldoStoreJSON[]
}
export default class List extends React.PureComponent<ListProps, {}> {
  render() {
    return <div>
      <ul>
        {this.props.stores.map(store => <ListItem key={store.name} name={store.name} json={store.json} />)}
      </ul>
    </div>
  }
}
