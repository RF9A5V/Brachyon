import React, { Component } from "react";
import FontAwesome from 'react-fontawesome';
import { browserHistory } from "react-router";

export default class LeagueDisplay extends Component {

  imgOrDefault(league) {
    return league.details.bannerUrl ? league.details.bannerUrl : "/images/bg.jpg";
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    return user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  onPencilClick(league) {
    browserHistory.push(`/league/${league.slug}/edit`);
  }

  render() {
    return (
      <div className="col col-1">
        <h3 style={{marginBottom: 10}}>{this.props.title || ""}</h3>
        <div className='event-block-container'>
          {
            (this.props.leagues || []).map((league, i) => {
              console.log(league);
              return (
                <div className="event-block" onClick={() => {
                  browserHistory.push(`/league/${league.slug}`);
                }} key={i}>
                  <div style={{border: "solid 2px #666", position: "relative"}}>
                    <h2 className="event-block-title">{ league.details.name }</h2>
                    {
                      Meteor.userId() == league.owner ? (
                        <div className="event-block-admin-row">
                          {
                            // event.isComplete && !event.league ? (
                            //   <div className="event-block-admin-button" onClick={(e) => {
                            //     e.preventDefault();
                            //     e.stopPropagation();
                            //     this.onRefreshClick(event);
                            //   }}>
                            //     RERUN
                            //   </div>
                            // ) : (
                            //   ""
                            // )
                          }
                          <div className="event-block-admin-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.onPencilClick(league);
                          }} >
                            <span>
                              EDIT
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )
                    }
                  </div>
                  <div className="event-block-img" style={{backgroundImage: `url(${this.imgOrDefault(league)})`}}>
                  </div>
                  <div className="event-block-content">
                    <div className="col">
                      <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                        <div className="row x-center" style={{fontSize: 12}}>
                          <img src={this.profileImageOrDefault(league.owner)} style={{width: 12.5, height: "auto", marginRight: 5}} />{ Meteor.users.findOne(league.owner).username }
                        </div>
                        <span style={{fontSize: 12}}>{
                          (league.leaderboard[0] || []).length
                        }<FontAwesome name="users" style={{marginLeft: 5}} /></span>
                      </div>
                      <div className="row flex-pad">
                        {
                          (league.details.location || {}).online ? (
                            <div style={{fontSize: 12}}><FontAwesome name="signal" /> Online League</div>
                          ) : (
                            <div style={{fontSize: 12}}>
                              <FontAwesome name="map-marker" /> {league.details.location.city}, {league.details.location.state}
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
