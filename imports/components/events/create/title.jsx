import React, { Component } from "react";

export default class Title extends Component {

  value() {
    return this.refs.title.value;
  }

  onChange(e) {
    var { value } = e.target;
    if(value.length > 50) {
      value = value.slice(0, 50);
    }
    e.target.value = value;
  }

  render() {
    return (
      <div>
        <input ref="title" type="text" onChange={this.onChange.bind(this)}/>
      </div>
    )
  }
}
