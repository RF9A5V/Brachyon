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

  // onSubTabSelect(index, subIndex) {
  //   this.props.onItemSelect(index, subIndex);
  // }

  render() {
    return (
      <div className="tab-menu active" ref="menu">
        {
          this.props.items.map((item, i) => {
            return (
              <div className={`tab-menu-item ${this.props.activeItem == i ? "active" : ""}`} ref={i} style={{display: item.icon == null ? "none" : "inherit"}}>
                <div className="tab-text">
                  <div className="tab-header" onClick={() => { this.onContentTabSelect(i) }}>
                    <FontAwesome name={item.icon} size="2x" />
                    <span>
                      { item.text }
                    </span>
                  </div>
                  {
                    // item.subitems.map((subItem, j) => {
                    //   if(j == 0){
                    //     return "";
                    //   }
                    //   return (
                    //     <div className={`tab-subtext ${this.props.activeItem == i && this.props.activeSub == j ? "active" : ""}`} onClick={() => {
                    //       this.onSubTabSelect(i, j)
                    //     }}>
                    //       <FontAwesome name={this.props.activeItem == i && this.props.activeSub == j ? "arrow-right" : "minus"} />
                    //       <span>
                    //         { subItem.text }
                    //       </span>
                    //     </div>
                    //   )
                    // })
                  }
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
