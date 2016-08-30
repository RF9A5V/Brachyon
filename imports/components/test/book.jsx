import React, { Component } from "react";

export default class BookScreen extends Component {
  render() {
    return (
      <div className="col-1 row flex-pad" style={{backgroundImage: "url(/images/bg.jpg)", padding: 30, backgroundSize: "cover"}}>
        <div className="col flex-pad">
          <span style={{padding: 10, background: "rgba(0, 0, 0, 0.8)", fontSize: "2.5em", color: "#FFD700"}}>
            Event Name
          </span>
          <div className="col" style={{padding: 20, background: "rgba(0, 0, 0, 0.8)", color: "#FFD700", fontSize: "1.5em"}}>
            <span>The Pavilion</span>
            <span>123 Main Street, Anytown MA</span>
            <span style={{marginBottom: 10}}>United States</span>
            <span>January 0th, 0000</span>
          </div>
        </div>
        <div className="col booklet-menu" style={{background: "rgba(0, 0, 0, 0.8)", padding: 20, display: "inline-flex", minWidth: 300, alignSelf: "flex-start"}}>
          {
            ["Predictions", "Drafts", "Missions", "Something"].map((x) => {
              var style = {fontSize: "1.5em", color: "#FFD700", padding: "20px 10px"}
              return (
                <span style={style}>{x}</span>
              )
            })
          }
        </div>
      </div>
    )
  }
}
