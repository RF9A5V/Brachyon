import React, { Component } from "react";

export default class Main extends Component {

  setSubitem(subIndex) {
    this.props.onItemSelect(this.props.activeItem, subIndex);
  }

  render() {
    return (
      <div className="col center x-center">
        <div className="col x-center" style={{border: "solid 2px white", padding: 20, minWidth: 300, width: "50%", position: "relative"}}>
          <h5 style={{position: "relative", top: -12.5, backgroundColor: "#333", position: "absolute", padding: "0 20px", textAlign: "center"}}>Choose Submodule</h5>
          <div className="row">
            {
              this.props.item.subitems.slice(1).map((item, i) => {
                return (
                  <div className="subitem-nav col center" onClick={() => { this.setSubitem(i + 1) }}>{ item.text }</div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
