import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class BlockContainer extends Component {

  selectEvent(eventID) {
    return(
      function(e){
        e.preventDefault();
        const path = `/events/${eventID}/view`
        console.log(path)
        browserHistory.push(path)
      }
    )
  }

  imgOrDefault(event) {
    if(event.details.banner){
      return event.details.banner;
    }
    return "/images/bg.jpg";
  }

  render() {
    var self = this;
    return (
      <div className='event-block-container'>
        {
          this.props.events.map(function(event){
            return (
              <div className="event-block" onClick={self.selectEvent(event._id).bind(self)}>
                <img src={self.imgOrDefault(event)} />
                <div className="event-block-details">
                  <h2 className="event-block-title">{ event.details.name }</h2>
                  <div className="event-block-content">
                    <div>
                      <span>Amount raised</span>
                      <span>Time remaining</span>
                      <span>Location</span>
                    </div>
                    <div>
                      <span>Hosted by</span>
                      <span>Date running</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
