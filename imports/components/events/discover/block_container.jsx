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


  render() {
    self = this;

    return (
      <div className='event-block-container'>
        {
          this.props.events.map(function(event){
            return (
              <div className="event-block" onClick={self.selectEvent(event._id).bind(self)}>
                <img src="/images/temp.jpg" />
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
