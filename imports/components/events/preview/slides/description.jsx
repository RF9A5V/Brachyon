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
                        <div className="col" style={{textAlign: "left"}}>
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
      <div className="col" style={{width: "100%", padding: 10}}>
        <div style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)", marginBottom: 10}}>
          <span>{ moment(event.details.datetime).format("MMMM Do, YYYY h:mmA") }</span>
        </div>
        <div style={{padding: 10, marginBottom: 10, backgroundColor: "rgba(0,0,0,0.8)"}} onClick={() => {
          this.setState({
            open: true
          })
        }}>
          <div style={{maxHeight: "20vh", marginBottom: 10, overflowY: "hidden"}} dangerouslySetInnerHTML={{__html: event.details.description}}>
          </div>
          <div className="row center x-center">
            <span style={{color: "#00BDFF", marginRight: 15}}>Show More</span>
            <FontAwesome name="caret-down" size="2x" style={{color: "#00BDFF"}} />
          </div>
        </div>

        {
          event.details.location.online ? (
            <div style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)"}}>
              <span>Online</span>
            </div>
          ) : (
            [
              <div className="col" style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)", fontSize: "1em", marginBottom: 10}}>
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
