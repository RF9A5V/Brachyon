import React, { Component } from 'react';
import DisplayPromotedEvent from './display_promoted.jsx';

export default class DisplayDiscover extends Component {

  constructor () {
    super();
    this.state = {
      panel: 0,
      loadIn: false
    }
  }

  componentWillMount(){
    var reset = () => {
      this.state.timer = setTimeout(() => {
        this.setState({loadIn: false});
        setTimeout(() => {
          this.state.loadIn = true;
          this.state.panel = (this.state.panel + 1) % this.props.events.length;
          this.forceUpdate();
          reset();
        }, 1000)
      }, 4000)
    }
    reset();
  }

  componentWillUnmount(){
    clearTimeout(this.state.timer);
  }

  render() {
    var arr = [];
    for (var i = 0; i < this.props.events.length; i++) {
      arr[i] = i;
    }
    return (
      <div className="discover-display row x-center" style={{padding: "0 5em", margin: '20px 0'}}>
        <div className="discover-selector col">
          {
            arr.map((val) => {
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
          arr.map((val) => {
            return (
              <div className={`promotion-animation ${val === this.state.panel && this.state.loadIn ? "in" : "out"}`}>
                <DisplayPromotedEvent event={this.props.events[val]} active={val === this.state.panel} />
              </div>
            )
          })
        }
      </div>
    );
  }
}
