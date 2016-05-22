import React from 'react';

export default class EventDisplay extends React.Component {

  imgOrDefault() {
    if(this.props.imageURL === undefined){
      return '/images/balls.svg';
    }
    else {
      return this.props.imageURL;
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

  editEvent(e) {
    e.preventDefault();
    window.location = '/events/' + this.props._id + '/edit';
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
            <p>{this.description()}</p>
            <div className="row center flex-1">
              <button style={{marginRight: '15px'}} onClick={this.editEvent.bind(this)}>Edit</button>
              <button style={{marginRight: '15px'}}>Preview</button>
              <button>Publish</button>
            </div>
          </div>
        </div>
      );
    }


  }
}
