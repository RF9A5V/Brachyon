import React, { Component } from 'react'

export default class DiscoverDisplay extends Component {
  render() {
    return (
      <div className="discover-display row x-center" style={{width: '70%', margin: '0 auto'}}>
        <div className="discover-selector">

        </div>
        <div className="discover-banner col-1">
          <img src="/images/balls.svg" style={{width: 'auto', height: '30vh'}} />
        </div>
        <div className="discover-details col-1">
          <h1>Discover Title</h1>
          <div>
            <span>Location</span>
            |
            <span>Date</span>
            |
            <span>Time</span>
          </div>
          <p>
            This is a long description. This is a long description. This is a long description. This is a long description. This is a long description.
          </p>
          <div>
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
          </div>
        </div>
      </div>
    );
  }
}
