import React, { Component } from "react";

export default class NameSearch extends Component {

  constructor(props) {
    super(props);
  }

  onTextChange() {
    this.props.onChange(this.refs.name.value);
  }

  onKeyPress(e) {
    if(e.key == "Enter") {
      this.props.onSubmit();
    }
  }

  query() {
    var name = this.refs.name.value;
    if(name == "") {
      return {};
    }
    return {
      "details.name": new RegExp(name.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i')
    }
  }

  render() {
    return (
      <div className="col">
        <input type="text" ref="name" placeholder="Search by Name" onChange={this.onTextChange.bind(this)} onKeyPress={this.onKeyPress.bind(this)} />
      </div>
    )
  }
}
