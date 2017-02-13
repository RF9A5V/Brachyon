import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

export default class Description extends Component {
  render() {
    var league = Leagues.findOne();
    var event = Events.findOne({ slug: { $in: league.events }, isComplete: false }, { sort: { "details.datetime": -1 } })
    return (
      <div className="slide-page">
        <div className="col col-3">
          {
            league.details.description ? (
              [
                (
                  <div className="slide-description col">
                    <div className="row x-center" style={{marginBottom: 20}}>
                      <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                        <FontAwesome name="map-marker" size="2x" />
                      </div>
                      {
                        league.details.location.online ? (
                          <span style={{fontSize: 16}}>Online</span>
                        ) : (
                          <div>
                            <span style={{fontSize: 16}}>{ league.details.location.locationName }</span>
                            <span style={{fontSize: 16}}>{ league.details.location.streetAddress + ", " }</span>
                            <span style={{fontSize: 16}}>{ league.details.location.city + " " + league.details.location.state + ", " + league.details.location.zip }</span>
                          </div>
                        )
                      }
                    </div>
                    <div className="row x-center">
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

                  </div>
                ),
                (
                  <div className="slide-description">
                    <div dangerouslySetInnerHTML={{__html: league.details.description}}>
                    </div>
                  </div>
                )
              ]
            ) : (
              ""
            )
          }
          {
            league.organize ? (
              league.organize.schedule.map((day, index) => {
                return (
                  <div className="slide-schedule">
                    <div className="row center">
                      <h3 style={{marginBottom: 10}}>Day {index + 1}</h3>
                    </div>
                    {
                      day.map(value => {
                        return (
                          <div className="schedule-item col">
                            <span>{ value.time }{
                              value.title ? (
                                " - " + value.title
                              ) : ("")
                            }</span>
                            <p>{ value.description }</p>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }
}
