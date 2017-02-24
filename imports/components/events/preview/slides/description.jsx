import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import PreviewMap from "/imports/components/public/map.jsx";

export default class Description extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.forceUpdate.bind(this))
  }

  render() {
    var event = Events.findOne();
    var mq = window.matchMedia("only screen and (max-width: 900px)");
    return (
      <div className="row center col-1" style={{padding: 40}}>
        {
          event.details.description ? (
            [
              (
                <div className="slide-description col" style={{minWidth: 400}}>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="calendar" size="2x" />
                    </div>
                    {
                      <span style={{fontSize: 16}}>{ moment(event.details.datetime).format("MMMM Do, h:mmA") }</span>
                    }
                  </div>
                  <div className="row x-center">
                    <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                      <FontAwesome name="map-marker" size="2x" />
                    </div>
                    {
                      event.details.location.online ? (
                        <span style={{fontSize: 16}}>Online</span>
                      ) : (
                        <div className="col">
                          <div>
                            <span style={{fontSize: 16}}>{ event.details.location.locationName }</span>
                          </div>
                          <div>
                            <span style={{fontSize: 16}}>{ event.details.location.streetAddress }</span>
                          </div>
                          <div>
                            <span style={{fontSize: 16}}>{ event.details.location.city + " " + event.details.location.state }</span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {
                    event.details.location.online ? (
                      ""
                    ) : (
                      [
                        <hr className="user-divider" />,
                        <PreviewMap center={event.details.location.coords.reverse()} />
                      ]
                    )
                  }
                </div>
              ),
              (
                mq.matches ? (
                  ""
                ) : (
                  <div className="slide-description col-3" style={{overflowY: "auto", textAlign: "left"}} onWheel={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                    <div dangerouslySetInnerHTML={{__html: event.details.description}}>
                    </div>
                  </div>
                )
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
