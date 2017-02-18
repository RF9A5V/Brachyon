import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

export default class Description extends Component {
  render() {
    var event = Events.findOne();
    return (
      <div className="col col-3" style={{padding: 20}}>
        {
          event.details.description ? (
            [
              (
                <div className="slide-description col" style={{minHeight: 100}}>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="map-marker" size="2x" />
                    </div>
                    {
                      event.details.location.online ? (
                        <span style={{fontSize: 16}}>Online</span>
                      ) : (
                        <div>
                          <span style={{fontSize: 16, marginRight: 10}}>{ event.details.location.locationName }</span>
                          <span style={{fontSize: 16}}>{ event.details.location.streetAddress + ", " }</span>
                          <span style={{fontSize: 16}}>{ event.details.location.city + " " + event.details.location.state + ", " + event.details.location.zip }</span>
                        </div>
                      )
                    }
                  </div>
                  <div className="row x-center">
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="calendar" size="2x" />
                    </div>
                    {
                      <span style={{fontSize: 16}}>{ moment(event.details.datetime).format("MMMM Do, h:mmA") }</span>
                    }
                  </div>

                </div>
              ),
              (
                <div className="slide-description col-1" style={{marginBottom: 10, overflowY: "auto"}}>
                  <div dangerouslySetInnerHTML={{__html: event.details.description}}>
                  </div>
                </div>
              )
            ]
          ) : (
            ""
          )
        }
        {
          event.organize ? (
            event.organize.schedule.map((day, index) => {
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
    )
  }
}
