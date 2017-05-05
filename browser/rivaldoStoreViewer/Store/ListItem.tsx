import * as React from "react";
import {default as storeController, StoreControllerType} from "./Controller";

interface ListItemProps extends StoreControllerType {
  name: string
  json: any[]
}

class ListItem extends React.PureComponent<ListItemProps, {}> {
  render() {
    const history = this.props.json;
    return (
      <li>
        <div onClick={this.props.actions!.toggleOpen}>{this.props.name}</div>
        <button onClick={this.props.actions!.toggleOpen}>current</button>
        {this.props.show ? <StoreView json={history[0]}/> : null}
        <button onClick={this.props.actions!.toggleHistoryOpen}>history</button>
        {this.props.showHistory ? history.slice(1, history.length).map((a, i) => <StoreView key={`${this.props.name}-history-${i}`} json={a}/>) : null}
      </li>
    );
  }
}

function isPrimitive(value: any) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
}
function StoreViewCell({ value }: {value: any}): JSX.Element {
  if (!isPrimitive(value)) {
    return <StoreView json={value}/>
  }
  const valueStr = (function(value) {
    if (value === null) {
      return "null"
    } else if (value === undefined) {
      return "undefined"
    } else if (typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value) {
      return value.toString();
    } else {
      if (value.length === 0) {
        return "''"
      } else {
        return value.toString()
      }
    }
  })(value)
  return <td style={{border: "2px solid black"}}>{valueStr}</td>
}

function header(obj: any) {
  return <thead>
    <tr>
      {Object.keys(obj).map((property: string, i: number) => <th key={property}>{property}</th>)}
    </tr>
  </thead>
}

function StoreViewForObject({ obj }: {obj: any}): JSX.Element {
  const properties = Object.keys(obj);
  const cells = properties.map((property, i) => <StoreViewCell key={property+i} value={obj[property]}/>)
  return <tr>{cells}</tr>
  // return (
  //   <table>
  //     {header(obj)}
  //     <tbody>
  //       <tr>
  //         {cells}
  //       </tr>
  //     </tbody>
  //   </table>
  // )
}
class StoreViewForCollection extends React.Component<{collection: any[]}, { filter: string[], openFilterSelector: boolean}> {
  constructor(props: any) {
    super(props)
    this.state = {
      filter: [],
      openFilterSelector: false
    }
  }
  render() {
    const collection = this.props.collection;
    if (isPrimitive(collection[0])) {
      return <td style={{border: "2px solid black"}}>{JSON.stringify(collection)}</td>
    }

    const properies = Object.keys(collection[0]);
    const filterProperties: string[] = this.state.filter;
    const renderingCollection = collection.map(item => {
      const retItem = (Object as any).assign({}, item);
      filterProperties.forEach(property => {
        delete retItem[property];
      });
      return retItem;
    })
    const body = (
      <tbody>
        {renderingCollection.map((item, i) => <StoreViewCell key={i} value={item}/>)}
      </tbody>
    )
    return (
      <table style={{border: "2px solid black"}}>
        {header(renderingCollection[0])}
        {body}
      </table>
    )
  }
}

function StoreView ({ json }: {json: any}): JSX.Element {
  return Array.isArray(json) ? <StoreViewForCollection collection={json}/> : <StoreViewForObject obj={json}/>
}




export default storeController(ListItem);
