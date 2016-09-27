import React, { Component } from "react";

export default class NameSearch extends Component {

  constructor(props) {
    super(props);
  }

  onTextChange() {
    this.props.onChange(this.refs.name.value);
  }

  render() {
    return (
      <div className="col">
        <label>Name</label>
        <input type="text" ref="name" placeholder="Search by Name" style={{margin: 0}} onChange={this.onTextChange.bind(this)} />
      </div>
    )
  }
}
