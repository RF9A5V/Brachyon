import React, { Component } from 'react';
import DisplayPromotedEvent from './display_promoted.jsx';

export default class DisplayDiscover extends Component {

  constructor () {
    super();
    this.state = {
      panel: 0,
      loadIn: true
    }
  }

  componentWillMount(){
    this.reset();
  }

  reset() {
    this.state.timer = setTimeout(() => {
      this.setState({loadIn: false});
      setTimeout(() => {
        this.state.loadIn = true;
        this.state.panel = (this.state.panel + 1) % this.props.events.length;
        this.forceUpdate();
        this.reset();
      }, 1000)
    }, 4000)
  }

  componentWillUnmount(){
    clearTimeout(this.state.timer);
  }

  onPromotedAreaFocus() {
    clearTimeout(this.state.timer);
  }

  onPromotedAreaLeave() {
    this.reset();
  }

  render() {
    var arr = [];
    for (var i = 0; i < this.props.events.length; i++) {
      arr[i] = i;
    }
    return (
      <div style={{padding: "0 5em"}} onMouseEnter={() => { this.onPromotedAreaFocus() }} onMouseLeave={() => { this.onPromotedAreaLeave() }}>
        <div className="row x-center" style={{margin: "20px"}}>
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
                        clearTimeout(this.state.timer);
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
      </div>
    );
  }
}
