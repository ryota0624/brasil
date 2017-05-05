import * as React from "react";

export interface StoreControllerState {
  show: boolean,
  showHistory: boolean
}

export interface StoreControllerProps {
  children? :any
}

export interface StoreControllerType {
  actions?: {
    toggleOpen: () => void,
    toggleHistoryOpen: () => void
  }
  show?: boolean,
  showHistory?: boolean
}

export default function storeController(Target: any): React.ComponentClass<any> {
  return class StoreController extends React.Component<StoreControllerProps, StoreControllerState> {
    setShowDetail: (b: boolean) => void;
    setShowHistoryDetail: (b: boolean) => void;
    constructor() {
      super();
      this.state = {
        show: false,
        showHistory: false
      }
      this.setShowDetail = (status) => () => this.setState({show: status});
      this.setShowHistoryDetail = (status) => () => this.setState({showHistory: status});
    }
    render() {
      const hide = this.setShowDetail(false);
      const open = this.setShowDetail(true);
      const hideHistory = this.setShowHistoryDetail(false);
      const showHistory = this.setShowHistoryDetail(true);
      const actions = {
        toggleOpen: this.state.show ? hide : open,
        toggleHistoryOpen: this.state.showHistory ? hideHistory : showHistory,
      }
      return (
        <Target {...this.props} actions={actions} showHistory={this.state.showHistory} show={this.state.show} />
      );
    }
  }
}
