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

  render() {
    var self = this;
    return (
      <div className="side-tab-container">
        <div className="side-tab-menu col flex-pad">
          <div className="col">
            {
              this.props.items.map((function(value, index) {
                return (
                  <span className={`side-tab-menu-item ${self.state.active === index ? "active" : ""}`} key={index} onClick={this.onTabClick(index).bind(this)}>
                    { value }
                  </span>
                );
              }).bind(this))
            }
          </div>
        </div>
        <div className="side-tab-content">
          {
            this.props.panels.map((function(value, index){
              return (
                <div className={`side-tab-content-item ${self.state.active === index ? "active" : ""}`} key={index}>
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
