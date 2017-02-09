import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import { browserHistory } from "react-router";
import { VelocityComponent } from "velocity-react";

import TicketPurchaseWrapper from "../ticket_purchase_wrapper.jsx";

import { Banners } from "/imports/api/event/banners.js";
import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

export default class EventTitlePage extends Component {

  constructor() {
    super();
    this.state = {
      pageIndex: 0,
      isAnimating: false,
      scrollAmount: 0
    }
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = this.props.event.details.bannerUrl ? this.props.event.details.bannerUrl : "/images/bg.jpg";
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  imgOrDefault(img) {
    return img == null ? "/images/profile.png" : img;
  }

  pages() {
    var revenue = this.props.event.revenue;
    var promotion = this.props.event.promotion || {};
    var event = this.props.event;
    var instance = Instances.findOne();
    var brackets = instance.brackets;
    var tickets = instance.tickets;

    var pages = [
      (
        <div className="slide-page row" style={{display: this.state.pageIndex == 0 ? "flex" : "none", backgroundImage: this.backgroundImage(false)}}>
          <div className="col flex-pad col-1">
            <div className="col">
              <div className="row" style={{justifyContent: "space-around", marginTop: 20}}>
                {
                  (promotion.featured || []).map((id) => {
                    var user = Meteor.users.findOne(id);
                    return (
                      <div className="col x-center">
                        <img src={ this.imgOrDefault(user.profile.imageUrl) } className="big-name-img" />
                        <span>{ user.username }</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div>
              {
                revenue && revenue.sponsors ? (
                  revenue.sponsors.slice(0, 3).map((sponsor) => {
                    var user = Meteor.users.findOne(sponsor.id);
                    return (
                      <div className="sponsor-item col center">
                        <div className="row x-center">
                          <img src={ user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} />
                          <span>{ Meteor.users.findOne(sponsor.id).username } - ${sponsor.amount / 100}</span>
                        </div>
                        <p>
                          { sponsor.comment }
                        </p>
                      </div>
                    )
                  })
                ) : (
                  ""
                )
              }
            </div>
          </div>
          <div className="col col-3 center x-center">
            <div className="col-1">
            </div>
            <div className="col center x-center col-2">
              <h2 className="sponsor-event-header">{ this.props.event.details.name }</h2>
              {
                revenue ? (
                  <span className="cf-progress-amount">
                    ${(this.props.event.revenue.current || 0) / 100} raised!
                  </span>
                ) : (
                  ""
                )
              }
              <div className="row">
                {
                  tickets && !event.isComplete ? (
                    <div>
                      <button style={{marginRight: event.twitchStream ? 10 : 0, width: 140}} onClick={() => { browserHistory.push("/events/"+event.slug+"/checkout") }}>Register</button>
                    </div>
                  ) : (
                    ""
                  )
                }
                {
                  brackets && !tickets && !event.isComplete ? (
                    brackets.some((bracket) => {
                      return (bracket.participants || []).some((player) => {
                        return player.id == Meteor.userId()
                      })
                    }) ? (
                      <button style={{marginRight: event.twitchStream ? 10 : 0, width: 140}} onClick={() => { browserHistory.push(`/event/${event.slug}/bracket/0`) }}>
                        View Bracket
                      </button>
                    ) : (
                      <button style={{marginRight: event.twitchStream ? 10 : 0, width: 140}} onClick={() => { this.props.nav(this.props.slides["Brackets"]) }}>
                        Register
                      </button>
                    )
                  ) : (
                    ""
                  )
                }
                {
                  event.twitchStream ? (
                    <button style={{width: 140}} onClick={() => { this.props.nav(this.props.slides["Streams"]) }}>Watch</button>
                  ) : (
                    ""
                  )
                }
              </div>
            </div>
            <div className="col col-1" style={{justifyContent: "flex-end", paddingBottom: 10}}>
              <div className="slide-control down">
                <FontAwesome name="chevron-down" size="2x" onClick={() => { this.onPageRequestChange(1)}} />
              </div>
            </div>
          </div>
          <div className="col col-1">
            <div className="col" style={{backgroundColor: "#111", padding: 20}}>
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
      ),
      (
        <div className="slide-page" style={{display: this.state.pageIndex == 1 ? "flex" : "none", backgroundImage: this.backgroundImage(true)}}>
          <div className="slide-page-up">
            <div className="slide-control" onClick={() => { this.onPageRequestChange(0) }}>
              <FontAwesome name="chevron-up" size="2x" />
            </div>
          </div>
          <div className="col col-3">
            {
              this.props.event.details.description ? (
                [
                  (
                    <div className="slide-description col">
                      <div className="row x-center" style={{marginBottom: 20}}>
                        <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                          <FontAwesome name="map-marker" size="2x" />
                        </div>
                        {
                          this.props.event.details.location.online ? (
                            <span style={{fontSize: 16}}>Online</span>
                          ) : (
                            <div>
                              <span style={{fontSize: 16}}>{ this.props.event.details.location.locationName }</span>
                              <span style={{fontSize: 16}}>{ this.props.event.details.location.streetAddress + ", " }</span>
                              <span style={{fontSize: 16}}>{ this.props.event.details.location.city + " " + this.props.event.details.location.state + ", " + this.props.event.details.location.zip }</span>
                            </div>
                          )
                        }
                      </div>
                      <div className="row x-center">
                        <div style={{width: 40, textAlign: "center", marginRight: 20}}>
                          <FontAwesome name="calendar" size="2x" />
                        </div>
                        {
                          <span style={{fontSize: 16}}>{ moment(this.props.event.details.datetime).format("MMMM Do, h:mmA") }</span>
                        }
                      </div>

                    </div>
                  ),
                  (
                    <div className="slide-description">
                      <div dangerouslySetInnerHTML={{__html: this.props.event.details.description}}>
                      </div>
                    </div>
                  )
                ]
              ) : (
                ""
              )
            }
            {
              this.props.event.organize ? (
                this.props.event.organize.schedule.map((day, index) => {
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
    ];
    return pages;
  }

  onPageRequestChange(index) {
    if(this.state.pageIndex == index) {
      return;
    }
    else {
      this.setState({ isAnimating: true });
      setTimeout(() => {
        this.setState({
          pageIndex: index,
          isAnimating: false
        })
      }, 500);
    }
  }

  onScroll(e) {
    if(Math.abs(this.state.pageIndex) < 530) {
      this.state.scrollAmount += e.deltaY;
    }
    if(this.state.pageIndex == 0) {
      if(this.state.scrollAmount >= 530) {
        this.onPageRequestChange(1);
        this.state.scrollAmount = 0;
      }
    }
    else {
      if(this.state.scrollAmount <= -530) {
        this.onPageRequestChange(0);
        this.state.scrollAmount = 0;
      }
    }
  }

  render() {
    var revenue = this.props.event.revenue;
    var promotion = this.props.event.promotion || {};
    var event = this.props.event;
    return (
      <div className="slide-page-container" onWheel={this.onScroll.bind(this)}>
        <VelocityComponent animation={{opacity: this.state.isAnimating ? 0 : 1}} duration={500}>
          {
            this.pages()[this.state.pageIndex]
          }
        </VelocityComponent>
      </div>
    )
  }
}
