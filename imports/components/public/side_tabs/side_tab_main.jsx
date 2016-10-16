import React, { Component } from "react";

export default class SideTabMain extends Component {

  constructor(props){
    super(props);
  }

  persistentButtons() {
    return this.props.items.filter(item => {
      return item.icon == null;
    }).reverse();
  }

  onPersistentButtonClick(item) {
    var index = this.props.items.indexOf(item);
    this.props.onItemSelect(index, 0);
  }

  render() {
    var subItem = this.props.items[this.props.activeItem].subitems[this.props.activeSub];
    return (
      <div className="tab-content col">
        <div style={{textAlign: "center"}}>
          <h2 style={{display: "inline-block"}}>{this.props.items[this.props.activeItem].text}</h2>
        </div>
        <div className="col-1">
          {
            <subItem.component item={this.props.items[this.props.activeItem]} onItemSelect={this.props.onItemSelect} activeItem={this.props.activeItem} { ...(subItem.args || {}) } />
          }
          <div className="row x-center" style={{position: "fixed", right: 10, bottom: 60}}>
            {
              this.persistentButtons().map((item, i) => {
                return (
                  <button className={`${i == 1 ? "signup-button" : "login-button"}`} style={{ marginRight: 10 }} onClick={() => { this.onPersistentButtonClick(item) }}>{ item.text }</button>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
