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
      return this.props.description;
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
        <div className="event-display">
          <img className="event-display-img" src={this.imgOrDefault()} />
          <div className="col event-display-details">
            <h2>{this.title()}</h2>
            <p dangerouslySetInnerHTML={{__html: this.description()}}></p>
            <div className="row center flex-1">
              <Link to={`/events/${this.props._id}/edit`}>
                <button style={{marginRight: '15px'}}>Edit</button>
              </Link>
              <button style={{marginRight: '15px'}}>Preview</button>
              <Link to={`/events/${this.props._id}/view`}>
                <button style={{marginRight: '15px'}}>View (Test)</button>
              </Link>
              <button>Publish</button>
            </div>
          </div>
        </div>
      );
    }


  }
}
