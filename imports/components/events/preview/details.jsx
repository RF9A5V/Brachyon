import React, { Component } from "react";
import moment from "moment";

export default class DetailsPanel extends Component {

  render() {
    return (
      <div className="row" style={{height: "100%", whiteSpace: "normal"}}>
        <div className="col-3 col description-container">
          <h2>{ this.props.name }</h2>
          <div dangerouslySetInnerHTML={{__html: this.props.description}}></div>
        </div>
      </div>
    )
  }
}
