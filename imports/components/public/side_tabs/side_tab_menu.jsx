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

  onSubTabSelect(index, subIndex) {
    this.props.onItemSelect(index, subIndex);
  }

  render() {
    return (
      <div className="tab-menu" ref="menu">
        <div className="tab-menu-item" onClick={ this.onActiveSelect.bind(this) }>
          <div className="tab-text">
            <div className="tab-header">Collapse</div>
          </div>
          <div className="tab-icon">
            <FontAwesome name="bars" size="3x" />
          </div>
        </div>
        {
          this.props.items.map((item, i) => {
            return (
              <div className={`tab-menu-item ${this.props.activeItem == i ? "active" : ""}`} ref={i}>
                <div className="tab-text">
                  <div className="tab-header" onClick={() => { this.onContentTabSelect(i) }}>{ item.text }</div>
                  {
                    item.subitems.map((subItem, j) => {
                      if(j == 0){
                        return "";
                      }
                      return (
                        <div className={`tab-subtext ${this.props.activeItem == i && this.props.activeSub == j ? "active" : ""}`} onClick={() => { this.onSubTabSelect(i, j) }}>
                          { subItem.text }
                        </div>
                      )
                    })
                  }
                </div>
                <div className="tab-icon" onClick={() => { this.onContentTabSelect(i) }}>
                  <FontAwesome name={item.icon} size="3x" />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
