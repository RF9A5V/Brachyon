import React from 'react';
import Images from '/imports/api/event/images.js';
import { unmountComponentAtNode } from 'react-dom';
import { Link } from 'react-router';

export default class EventDisplay extends React.Component {

  imgOrDefault() {
    img = Images.findOne(this.props.banner);
    if(img == null){
      return '/images/balls.svg';
    }
    else {
      return img.url();
    }
  }

  title() {
    if(this.props.title == null){
      return "TBD";
    }
    else {
      return this.props.title;
    }
  }

  description() {
    if(this.props.description == null){
      return "There's no description for this event.";
    }
    else {
      sizeMax = 350;
      if(this.props.description.length > sizeMax){
        return this.props.description.substring(0, sizeMax-3) + '...';
      }
      return this.props.description;
    }
  }

  eventControls() {
    if(this.props.under_review && !this.props.published){
      return (
        <div className="row flex-1">
          <button>Under Review</button>
        </div>
      );
    }
    else {
      return (
        <div className="row flex-1">
          <Link to={`/events/${this.props._id}/edit`}>
            <button style={{marginRight: '15px'}}>Edit</button>
          </Link>
          <Link to={`/events/${this.props._id}/preview`}>
            <button style={{marginRight: '15px'}}>Preview</button>
          </Link>
          <Link to={`/events/${this.props._id}/view`}>
            <button style={{marginRight: '15px'}}>View (Test)</button>
          </Link>
          <Link to={`/events/${this.props._id}/publish`}>
            <button>Publish</button>
          </Link>
        </div>
      );
    }
  }

  render() {
    if(this.props._id == null){
      return (
        <div className="event-display">
          <div className="row center x-center" style={{height: '100%'}}>
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
            <h2>{this.title()}</h2>
            <div className="description-container" dangerouslySetInnerHTML={{__html: this.description()}}></div>
            { this.eventControls() }
          </div>
        </div>
      );
    }


  }
}
