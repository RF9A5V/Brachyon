import React, { Component } from "react";
import moment from "moment";

export default class DetailsPanel extends Component {

  render() {
    return (
      <div className="row" style={{height: "100%", whiteSpace: "normal"}}>
        <div className="col-3 col description-container">
          <span className="event-title">{ this.props.name || "Set Event Name" }</span>
          <div dangerouslySetInnerHTML={{__html: (this.props.description ? this.props.description : "Set a description for your event.")}}></div>
        </div>
      </div>
    )
  }
}
