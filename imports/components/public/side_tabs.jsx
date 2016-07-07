import React, { Component } from 'react';

export default class SideTabs extends Component {

  componentWillMount(){
    this.setState({
      active: 0
    });
  }

  onTabClick(value) {
    return function(e) {
      this.setState({
        active: value
      })
    }
  }

  onWheel(e) {
    var target = e.target;
    while(!target.classList.contains("side-tab-content-container")){
      target = target.parentNode;
    }
    target.scrollLeft += e.deltaX;
  }

  values() {

  }

  render() {
    var self = this;
    return (
      <div className="side-tab-container">
        <div className="side-tab-item-container">
          {
            this.props.items.map((function(value, index) {
              return (
                <span className={`side-tab-item ${self.state.active === index ? "active" : ""}`} key={index} onClick={this.onTabClick(index).bind(this)}>
                  { value }
                </span>
              );
            }).bind(this))
          }
        </div>
        <div className="side-tab-content-container" onWheel={this.onWheel.bind(this)}>
          {
            this.props.panels.map((function(value, index){
              return (
                <div className={`side-tab-content ${self.state.active === index ? "" : "hidden"}`}>
                  { value }
                </div>
              );
            }).bind(this))
          }
        </div>
      </div>
    )
  }
}
