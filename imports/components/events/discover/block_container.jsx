import React, { Component } from 'react';

export default class BlockContainer extends Component {
  render() {
    return (
      <div className='event-block-container'>
        {
          this.props.events.map(function(event){
            return (
              <div className="event-block">
                <img src="/temp.jpg" />
                <div className="event-block-details">
                  <h2 className="event-block-title">{ event.title }</h2>
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
