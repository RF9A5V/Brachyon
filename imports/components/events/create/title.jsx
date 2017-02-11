import React, { Component } from "react";

export default class Title extends Component {

  value() {
    if(this.refs.title.value.length < 3) {
      toastr.error("Event title needs to be longer than 3 characters.");
      throw new Error("Event title needs to be longer than 3 characters.");
    }
    if(this.refs.title.value.length > 50) {
      toastr.error("Event title cannot be longer than 50 characters.");
      throw new Error("Event title cannot be longer than 50 characters.");
    }
    return this.refs.title.value;
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
      <div className="col">
        <div className="row" style={{alignItems: "flex-end"}}>
          <h5 style={{marginRight: 10}}>Title</h5>
          <span>{ this.refs.title ? this.refs.title.value.length : 0 } / 50</span>
        </div>
        <input ref="title" type="text" onChange={this.onChange.bind(this)}/>
      </div>
    )
  }
}
