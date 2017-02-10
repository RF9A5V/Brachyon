import React, { Component } from "react";

export default class Title extends Component {

  value() {
    return {
      title: this.refs.title.value,
      season: this.refs.season.value
    }
  }

  render() {
    return (
      <div className="row">
        <input type="text" ref="title" />
        <input type="text" ref="season" />
      </div>
    )
  }
}
