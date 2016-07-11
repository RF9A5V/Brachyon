import React, { Component } from 'react';
import DisplayPromotedEvent from './display_promoted.jsx';

export default class DisplayDiscover extends Component {

  constructor () {
    super();
    this.state = {
      panel: 0
    }
  }

  componentWillMount(){
    this.state.timer = setInterval(() => {
      this.forceUpdate();
      this.state.panel = (this.state.panel + 1) % this.props.events.length
    }, 3000);
  }

  componentWillUnmount(){
    clearInterval(this.state.timer);
  }

  render() {
    return (
      <div className="discover-display row x-center" style={{padding: "0 5em", margin: '20px 0'}}>
        <div className="discover-selector col">
          {
            [0, 1, 2, 3, 4].map((val) => {
              return (
                <div
                  className={`discover-selector-square ${val === this.state.panel ? "active" : ""}`}
                  ref={`panel_${val}`}
                  onClick={
                    (e) => {
                      this.setState({panel: val})
                    }
                  }></div>
              )
            })
          }
        </div>
        {
          [0, 1, 2, 3, 4].map((val) => {
            return (
              <DisplayPromotedEvent event={this.props.events[val]} active={val === this.state.panel} />
            )
          })
        }
      </div>
    );
  }
}
