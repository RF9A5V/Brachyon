import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import { browserHistory } from "react-router";
import { VelocityComponent } from "velocity-react";

import TicketPurchaseWrapper from "../ticket_purchase_wrapper.jsx";

import { Images } from "/imports/api/event/images.js";
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
    var imgUrl = "/images/bg.jpg";
    if(this.props.event && this.props.event.details.banner) {
      imgUrl = Images.findOne(this.props.event.details.banner).link();
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  imgOrDefault(imgId) {
    var img = ProfileImages.findOne(imgId);
    return img == null ? "/images/profile.png" : img.link();
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
                        <img src={ this.imgOrDefault(user.profile.image) } className="big-name-img" />
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
                          <img src={ user.profile.image ? ProfileImages.findOne(user.profile.image).link() : "/images/profile.png"} />
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
                  tickets ? (
                    <div>
                      <button style={{marginRight: event.twitchStream ? 10 : 0, width: 140}} onClick={() => { browserHistory.push("/events/"+event.slug+"/checkout") }}>Register</button>
                    </div>
                  ) : (
                    ""
                  )
                }
                {
                  brackets && !tickets ? (
                    brackets.some((bracket) => {
                      return (bracket.participants || []).some((player) => {
                        return player.id == Meteor.userId()
                      })
                    }) ? (
                      <button style={{marginRight: event.twitchStream ? 10 : 0, width: 140}} onClick={() => { browserHistory.push(`/events/${event.slug}/brackets/0`) }}>
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
              <div className="slide-control">
                <FontAwesome name="chevron-down" size="2x" onClick={() => { this.onPageRequestChange(1)}} />
              </div>
            </div>
          </div>
          <div className="col col-1">

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
                <div className="slide-description">
                  <div dangerouslySetInnerHTML={{__html: this.props.event.details.description}}>
                  </div>
                </div>
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
