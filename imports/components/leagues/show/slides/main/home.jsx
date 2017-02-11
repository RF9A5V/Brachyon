import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

export default class MainSlide extends Component {

  // Even though the prop is called event, it's actually the league.
  // Yes, I know it's dumb but I'll put this fire out when there are like 100 less fires to deal with.

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col-1 col">
        <div className="row col-1">
          <div className="col-1">
          </div>
          <div className="col-2 row center x-center">
            <h2 className="sponsor-event-header">{this.props.name}</h2>
          </div>
          <div className="col-1">
            <div className="col" style={{backgroundColor: "#111", padding: 20, margin: 20}}>
              {
                true ? (
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                      <FontAwesome name="signal" size="2x" />
                    </div>
                    <span>
                      Online
                    </span>
                  </div>
                ) : (
                  <div className="row x-center" style={{marginBottom: 20}}>

                  </div>
                )
              }

              <div className="row x-center">
                <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                  <FontAwesome name="calendar" size="2x" />
                </div>
                <span>
                  {moment().format("MMM Do, YYYY @ h:mmA")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
