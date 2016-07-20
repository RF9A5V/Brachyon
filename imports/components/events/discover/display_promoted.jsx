import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

export default class DisplayPromotedEvent extends Component {

  imgOrDefault(event) {
    var img = Images.findOne(event.details.banner);
    if(img){
      return img.url();
    }
    return "/images/bg.jpg";
  }

  description() {
    if(this.props.event.details.description == null){
      return "There's no description for this event.";
    }
    parsed = this.props.event.details.description.replace(/<img .*>/g, "").replace(/<\/?[A-z]+>/, "");
    if(parsed.length == 0){
      return "There's no description for this event.";
    }
    else {
      sizeMax = 200;
      if(parsed.length > sizeMax){
        return parsed.substring(0, sizeMax-3) + '...';
      }
      return parsed;
    }
  }

  render(){
    if(!this.props.active) {
      return (
        <div></div>
      )
    }

    return (
      <div className="row">
        <div className="promoted-event-block center x-center col-1">
          <img src={this.imgOrDefault(this.props.event)} />
        </div>
        <div className="discover-details col-1">
          <h1>{this.props.event.details.name}</h1>
          <div className="row" style={{fontSize: "13px"}}>
            <div style={{marginRight: '10px'}}>
              {/*Crowdfunding check goes here */}
              {
                this.props.event.details.location.online ? (
                  <div><FontAwesome name="signal" /> Online</div>
                ) : (
                  <div>
                    <FontAwesome name="map-marker" /> {this.props.event.details.location.city}, {this.props.event.details.location.state}
                  </div>
                )
              }
            </div>
            <span>|</span>
            <div style={{marginRight: '10px', marginLeft: '10px'}}><FontAwesome name="calendar" /> {moment(this.props.event.details.datetime).format("MMM Do")}</div>
            <span>|</span>
            <div style={{marginRight: '10px', marginLeft: '10px'}}><FontAwesome name="user" /> {Meteor.users.findOne(this.props.event.owner).username}</div>
          </div>
          <div dangerouslySetInnerHTML={{__html: this.description()}} style={{fontSize: "calc(0.5vw + 0.5vh + 0.5vmin)", margin: '10px 0'}}>
          </div>
          {/*<div>
            <span>
              Amount
            </span>
          </div>
          <div>
            <span>
              Time Remaining
            </span>
          </div>
          <div>
            <span>
              Players
            </span>
          </div>
          <div>
            <span>
              Followers
            </span>
          </div>*/}
        </div>
      </div>
    )
  }
}
