import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class SideTabMenu extends Component {

  onActiveSelect(e) {
    e.preventDefault();
    this.refs.menu.classList.toggle("active");
  }

  onContentTabSelect(index) {
    this.props.onItemSelect(index, 0);
  }

  render() {
    return (
      <div className="tab-menu active" ref="menu">
        { this.props.componentHeader || (<div></div>) }
        {
          this.props.items.map((item, i) => {
            return (
              <div key={i} className={`tab-menu-item ${this.props.activeItem == i ? "active" : ""}`} ref={i} style={{display: item.icon == null ? "none" : "inherit"}}>
                <div className="tab-text">
                  <div className="tab-header" onClick={() => { this.onContentTabSelect(i) }}>
                    <FontAwesome name={item.icon} size="2x" />
                    <span>
                      { item.text }
                    </span>
                  </div>
                </div>
                <div className="tab-icon" onClick={() => { this.onContentTabSelect(i) }}>
                  <FontAwesome name={item.icon} size="2x" />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
