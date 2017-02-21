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
    var league = Leagues.findOne();
    var event = Events.findOne({ slug: { $in: league.events }, isComplete: false }, { sort: { "details.datetime": -1 } });
    return (
      <div className="col-1 col">
        <div className="row col-1">
          <div className="col-1">
          </div>
          <div className="col-2 row center x-center">
            <h2 className="sponsor-event-header" style={{color: "#FF6000"}}>{league.details.name}</h2>
          </div>
          <div className="col-1">
            <div className="col" style={{backgroundColor: "#111", padding: 20, margin: 20}}>
              {
                league.details.location.online ? (
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
                          league.details.location.locationName ? league.details.location.locationName : league.details.location.streetAddress
                        }
                      </span>
                      <span>
                        {
                          league.details.location.city + ", " + league.details.location.state
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
                  {
                    event ? (
                      moment(event.details.datetime).format("MMM Do, YYYY @ h:mmA")
                    ) : (
                      "League Completed!"
                    )
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
