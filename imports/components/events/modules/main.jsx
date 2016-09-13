import React, { Component } from "react";

export default class Main extends Component {

  setSubitem(subIndex) {
    this.props.onItemSelect(this.props.activeItem, subIndex);
  }

  render() {
    return (
      <div>
        <h2>{ this.props.name }</h2>
        {
          this.props.item.subitems.slice(1).map((item, i) => {
            return (
              <div className="subitem-nav" onClick={() => { this.setSubitem(i + 1) }}>{ item.text }</div>
            )
          })
        }
      </div>
    )
  }
}
