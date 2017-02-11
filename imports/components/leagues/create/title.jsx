import React, { Component } from "react";

export default class Title extends Component {

  value() {
    return {
      title: this.refs.title.value,
      season: this.refs.season.value
    }
  }

  onChange(e) {
    var { value } = e.target;
    if(value.length > 50) {
      value = value.slice(0, 50);
    }
    e.target.value = value;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="row">
        <div className="col col-1">
          <div className="row">
            <h5 style={{marginRight: 10}}>Title</h5>
            <span>{ this.refs.title ? this.refs.title.value.length : 0 } / 50</span>
          </div>
          <input type="text" ref="title" onChange={this.onChange.bind(this)} />
        </div>
        <div className="col col-1">
          <div className="row">
            <h5 style={{marginRight: 10}}>Season</h5>
            <span>{ this.refs.season ? this.refs.season.value.length : 0 } / 50</span>
          </div>
          <input type="text" ref="season" onChange={this.onChange.bind(this)} />
        </div>
      </div>
    )
  }
}
