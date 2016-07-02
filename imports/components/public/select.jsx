import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class SelectInput extends Component {

  componentWillMount() {
    this.setState({
      active: this.props.choices[0],
      choices: this.props.choices || [],
      open: false
    })
  }

  value() {
    return this.state.active;
  }

  onActiveClick(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open
    })
  }

  onItemClick(item) {
    return function(e){
      e.preventDefault();
      this.setState({
        active: item,
        open: false
      })
    }
  }

  render() {
    return (
      <div className="select-input">
        <div className="select-active" onClick={this.onActiveClick.bind(this)}>
          { this.state.active }
          <FontAwesome name="caret-down" />
        </div>
        <div className={`select-item-container ${this.state.open ? "active" : ""}`}>
          {
            this.state.choices.map((function(item){
              return (
                <div className="select-item" onClick={this.onItemClick(item).bind(this)}>
                  {
                    item
                  }
                </div>
              );
            }).bind(this))
          }
        </div>
      </div>
    )
  }
}
