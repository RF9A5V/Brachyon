import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import PreviewMap from "/imports/components/public/map.jsx";
import DescriptionOverlay from "./description_overlay.jsx";

export default class Description extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  renderDesktop() {
    var event = Events.findOne();
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
                <div className="slide-description col-3" style={{overflowY: "auto", textAlign: "left"}} onWheel={(e) => {
                  e.stopPropagation();
                }}>
                  <div dangerouslySetInnerHTML={{__html: event.details.description}}>
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

  renderMobile() {
    const event = Events.findOne();
    return (
      <div className="col" style={{width: "100%", padding: 40}}>
        <div style={{padding: 40, backgroundColor: "rgba(0,0,0,0.8)", marginBottom: 40}}>
          <span style={{fontSize: "3em"}}>{ moment(event.details.datetime).format("MMMM Do, YYYY h:mmA") }</span>
        </div>
        <div style={{padding: 40, backgroundColor: "rgba(0,0,0,0.8)", maxHeight: "30vh", marginBottom: 40, overflowY: "hidden"}}>
          <div style={{fontSize: "3em"}} dangerouslySetInnerHTML={{__html: event.details.description}} onClick={() => {
            this.setState({
              open: true
            })
          }}>
          </div>
        </div>

        {
          event.details.location.online ? (
            <div style={{padding: 40, backgroundColor: "rgba(0,0,0,0.8)"}}>
              <span style={{fontSize: "3em"}}>Online</span>
            </div>
          ) : (
            [
              <div className="col" style={{padding: 40, backgroundColor: "rgba(0,0,0,0.8)", fontSize: "3em", marginBottom: 40}}>
                <span>{ event.details.location.streetAddress }</span>
                <span>{ event.details.location.city } { event.details.location.state }</span>
              </div>,
              <div className="col" style={{width: "100%", height: "25vh"}}>
                <PreviewMap center={event.details.location.coords.reverse()} />
              </div>
            ]

          )
        }
        <DescriptionOverlay open={this.state.open} onClose={() => { this.setState({ open: false }) }} description={event.details.description} />
      </div>
    )
  }

}
