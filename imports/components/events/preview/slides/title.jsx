import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import { browserHistory } from "react-router"

import Games from "/imports/api/games/games.js";

export default class EventTitlePage extends Component {

  constructor() {
    super();
    this.state = {
      pageIndex: 0
    }
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = "/images/bg.jpg";
    if(this.props.event && this.props.event.bannerUrl) {
      imgUrl = this.props.event.bannerUrl;
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  onMoveToDetails() {
    this.setState({
      pageIndex: 1
    })
  }

  imgOrDefault(imgId) {
    var img = ProfileImages.findOne(imgId);
    return img == null ? "/images/profile.png" : img.url();
  }

  render() {
    var revenue = this.props.event.revenue;
    var promotion = this.props.event.promotion || {};
    return (
      <div className="slide-page-container">
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
                    console.log(sponsor);
                    var user = Meteor.users.findOne(sponsor.id);
                    return (
                      <div className="sponsor-item col center">
                        <div className="row x-center">
                          <img src={ user.profile.image ? ProfileImages.findOne(user.profile.image).url() : "/images/profile.png"} />
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
              <h3 className="sponsor-event-header">{ this.props.event.details.name }</h3>
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
                <button style={{marginRight: 10}}>Play</button>
                <button>Watch</button>
              </div>
            </div>
            <div className="col col-1" style={{justifyContent: "flex-end", paddingBottom: 10}}>
              <FontAwesome name="chevron-down" size="2x" onClick={this.onMoveToDetails.bind(this)} />
            </div>
          </div>
          <div className="col col-1">

          </div>
        </div>
        <div className="slide-page" style={{display: this.state.pageIndex == 1 ? "flex" : "none", backgroundImage: this.backgroundImage(true)}}>
          <div className="slide-page-up">
            <div className="slide-control" onClick={() => { this.setState({ pageIndex: 0 }) }}>
              <FontAwesome name="chevron-up" size="2x" />
            </div>
          </div>
          <div className="col col-3">
          <div className="slide-description">
            {
              this.props.event.details.description.split("\n").map((p) => {
                return (
                  <p>
                    {p}
                  </p>
                )
              })
            }
          </div>
            <div className="slide-schedule">
              <div className="schedule-item">
                <h3>Schedule</h3>
              </div>
              {
                [0, 1, 2, 3, 4, 5].map((i) => {
                  return (
                    <div className="schedule-item">
                      <span>{ moment().hour(i).format("h:mm") }</span>
                      <p>
                        Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick.
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="col x-center col-1 slide-bracket-list">
            {
              this.props.event.brackets ? (
                this.props.event.brackets.map((bracket, i) => {
                  return (
                    <div className="slide-bracket" onClick={() => { browserHistory.push(`/events/${this.props.event._id}/brackets/${i}`) }}>
                      <img src={Games.findOne(bracket.game).bannerUrl} />
                      <span>{ bracket.name }</span>
                    </div>
                  )
                })
              ) : (
                ""
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
