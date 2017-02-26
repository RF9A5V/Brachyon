import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import PreviewMap from "/imports/components/public/map.jsx";

export default class Description extends Component {
  render() {
    var league = Leagues.findOne();
    var event = Events.findOne({ slug: { $in: league.events }, isComplete: false }, { sort: { "details.datetime": -1 } })
    return (
      <div className="row col-1" style={{padding: 40}}>
        {
          league.details.description ? (
            [
              (
                <div className="slide-description col" style={{minWidth: 400}}>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="calendar" size="2x" />
                    </div>
                    {
                      <span style={{fontSize: 16}}>{
                        event ? (
                          moment(event.details.datetime).format("MMMM Do, h:mmA")
                        ) : (
                          ""
                        )
                      }</span>
                    }
                  </div>
                  <div className="row x-center">
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="map-marker" size="2x" />
                    </div>
                    {
                      league.details.location.online ? (
                        <span style={{fontSize: 16}}>Online</span>
                      ) : (
                        <div className="col">
                          <span style={{fontSize: 16}}>{ league.details.location.locationName }</span>
                          <span style={{fontSize: 16}}>{ league.details.location.streetAddress }</span>
                          <span style={{fontSize: 16}}>{ league.details.location.city + " " + league.details.location.state + ", " + league.details.location.zip }</span>
                        </div>
                      )
                    }
                  </div>
                  {
                    league.details.location.online ? (
                      ""
                    ) : (
                      [
                        <hr className="user-divider" />,
                        <PreviewMap center={league.details.location.coords.reverse()} />
                      ]
                    )
                  }
                </div>
              ),
              (
                <div className="slide-description col-1" style={{overflowY: "auto"}}>
                  <div dangerouslySetInnerHTML={{__html: league.details.description}} onWheel={(e) => {
                    e.stopPropagation();
                  }}>
                  </div>
                </div>
              )
            ]
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
