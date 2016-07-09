import React from "react";
import Images from "/imports/api/event/images.js";
import { unmountComponentAtNode } from "react-dom";
import { Link } from "react-router";

export default class EventDisplay extends React.Component {

  imgOrDefault() {
    if(this.props.details.banner == null){
      return "/images/bg.jpg";
    }
    else {
      return Images.findOne(this.props.details.banner).url();
    }
  }

  title() {
    if(this.props.details.name == null || this.props.details.name.length == 0){
      return "No title set";
    }
    else {
      return this.props.details.name;
    }
  }

  description() {
    if(this.props.details.description == null){
      return "There's no description for this event.";
    }
    parsed = this.props.details.description.replace(/<img .*>/g, "").replace(/<\/?[A-z]+>/, "");
    if(parsed.length == 0){
      return "There's no description for this event.";
    }
    else {
      sizeMax = 350;
      if(parsed.length > sizeMax){
        return parsed.substring(0, sizeMax-3) + "...";
      }
      return parsed;
    }
  }

  eventControls() {
    if(this.props.underReview && !this.props.published){
      return (
        <div className="row flex-1">
          <button>Under Review</button>
          <Link to={`/events/${this.props._id}/preview`}>
            <button style={{marginLeft: "15px"}}>Preview</button>
          </Link>
        </div>
      );
    }
    else if(!this.props.underReview && !this.props.published) {
      return (
        <div className="row flex-1">
          <Link to={`/events/${this.props._id}/edit`}>
            <button style={{marginRight: "15px"}}>Edit</button>
          </Link>
          <Link to={`/events/${this.props._id}/preview`}>
            <button style={{marginRight: "15px"}}>Preview</button>
          </Link>
          <Link to={`/events/${this.props._id}/publish`}>
            <button>Publish</button>
          </Link>
        </div>
      );
    }
    else {
      return (
        <div className="row flex-1">
          <Link to={`/events/${this.props._id}/preview`}>
            <button style={{marginRight: "15px"}}>Preview</button>
          </Link>
          <Link to={`/events/${this.props._id}/view`}>
            <button>Organize</button>
          </Link>
        </div>
      )
    }
  }

  render() {
    if(this.props._id == null){
      return (
        <div className="event-display">
          <div className="row center x-center" style={{height: "100%"}}>
            <h3>Select an Event</h3>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="event-display row">
          <img className="event-display-img" src={this.imgOrDefault()} />
          <div className="col event-display-details col-1">
            <b className="event-title">{this.title()}</b>
            <div className="col-1" style={{lineHeight: 1.5}} dangerouslySetInnerHTML={{__html: this.description()}}></div>
            { this.eventControls() }
          </div>
        </div>
      );
    }


  }
}
