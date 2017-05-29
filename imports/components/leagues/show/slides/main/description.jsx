import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import PreviewMap from "/imports/components/public/map.jsx";
import DescriptionOverlay from "/imports/components/events/preview/slides/description_overlay.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Description extends ResponsiveComponent {
  renderDesktop() {
    var league = Leagues.findOne();
    var event = Events.findOne({ slug: { $in: league.events.map(e => { return e.slug }) }, isComplete: false }, { sort: { "details.datetime": -1 } })
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
                        <div className="col" style={{textAlign: "left"}}>
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

  renderMobile() {
    const league = Leagues.findOne();
    const event = Events.findOne({ isComplete: false }, { sort: { "details.datetime": -1 } });
    const anyEvent = Events.findOne();
    return (
      <div className="col" style={{width: "100%", padding: 10}}>
        <div style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)", marginBottom: 10}}>
          <span style={{fontSize: "1.5em"}}>{ event ? moment(event.details.datetime).format("MMMM Do, YYYY h:mmA") : "Completed!" }</span>
        </div>
        <div style={{padding: 10, marginBottom: 10, backgroundColor: "rgba(0,0,0,0.8)"}} onClick={() => {
          this.setState({
            open: true
          })
        }}>
          <div style={{fontSize: "1.5em", maxHeight: "20vh", marginBottom: 10, overflowY: "hidden"}} dangerouslySetInnerHTML={{__html: league.details.description}}>
          </div>
          <div className="row center x-center">
            <span style={{fontSize: "1.5em", color: "#FF6000", marginRight: 15}}>Show More</span>
            <FontAwesome name="caret-down" style={{fontSize: "2em", color: "#FF6000"}} />
          </div>
        </div>
        {
          anyEvent.details.location.online ? (
            <div style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)"}}>
              <span style={{fontSize: "1.5em"}}>Online</span>
            </div>
          ) : (
            [
              <div className="col" style={{padding: 10, backgroundColor: "rgba(0,0,0,0.8)", fontSize: "3em", marginBottom: 10}}>
                <span>{ anyEvent.details.location.streetAddress }</span>
                <span>{ anyEvent.details.location.city } { anyEvent.details.location.state }</span>
              </div>,
              <div className="col" style={{width: "100%", height: "25vh"}}>
                <PreviewMap center={event.details.location.coords.reverse()} />
              </div>
            ]

          )
        }
        <DescriptionOverlay open={this.state.open} onClose={() => { this.setState({ open: false }) }} description={league.details.description} />
      </div>
    )
  }

}
