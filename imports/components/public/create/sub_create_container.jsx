import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class SubContainer extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  componentWillReceiveProps(next) {
    if(next.items.length <= this.state.selected) {
      this.setState({
        selected: next.items.length - 1
      })
    }
  }

  value() {
    var obj = {};
    this.props.items.forEach((item, i) => {
      obj[item.key] = this.refs[item.key].value();
    });
    return obj;
  }

  _getRefValue(key) {
    return this.refs[key].value();
  }

  renderBase(opts) {
    var style = {
      width: "100%",
      margin: "0 auto"
    };
    if(!this.props.active) {
      style.height = 0;
      style.overflowY = "hidden";
      style.padding = 0;
    }
    var selectedColor = "white";
    if(window.location.pathname.indexOf("event") >= 0){
      selectedColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league") >= 0){
      selectedColor = "#FF6000";
    }
    return (
      <div>
        <div style={{paddingBottom: this.props.active ? 20 : 0}}>
          {
            this.props.items.map((item, i) => {
              return (
                <div style={{...style}}>
                  <item.content id={item.key} ref={item.key} {...item.args} status={this.props.status} setStatus={this.props.setStatus} getRefValue={this.props.getRefValue} active={this.state.selected == i && this.props.active} />
                  {
                    i < this.props.items.length - 1 ? (
                      <hr style={{width: "95%"}} className="user-divider" />
                    ) : (
                      null
                    )
                  }

                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase()
  }

  renderMobile() {
    return this.renderBase()
  }

}
