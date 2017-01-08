import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

export default class MainSlide extends Component {

  // Even though the prop is called event, it's actually the league.
  // Yes, I know it's dumb but I'll put this fire out when there are like 100 less fires to deal with.

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = this.props.event.details.bannerUrl ? this.props.event.details.bannerUrl : "/images/bg.jpg";
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  render() {
    return (
      <div className="col-1 col slide" style={{backgroundImage: this.backgroundImage(false)}}>
        <div className="row col-1">
          <div className="col-1">
          </div>
          <div className="col-2 row center x-center">
            <h2 className="sponsor-event-header">{ this.props.event.details.name }</h2>
          </div>
          <div className="col-1">
            <div className="col" style={{backgroundColor: "#111", padding: 20, margin: 20}}>
              {
                this.props.event.details.location.online ? (
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
                    <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                      <FontAwesome name="map-marker" size="2x" />
                    </div>
                    <div className="col">
                      <span>
                        {
                          this.props.event.details.location.locationName ? this.props.event.details.location.locationName : this.props.event.details.location.streetAddress
                        }
                      </span>
                      <span>
                        {
                          this.props.event.details.location.city + ", " + this.props.event.details.location.state
                        }
                      </span>
                    </div>
                  </div>
                )
              }

              <div className="row x-center">
                <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                  <FontAwesome name="calendar" size="2x" />
                </div>
                <span>
                  {moment(this.props.event.details.datetime).format("MMM Do, YYYY @ h:mmA")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
