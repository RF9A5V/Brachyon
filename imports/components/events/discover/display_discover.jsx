import React, { Component } from 'react';
import DisplayPromotedEvent from './display_promoted.jsx';
import { VelocityComponent } from "velocity-react";

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

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  reset() {
    this.state.timer = setTimeout(() => {
      this.setState({loadIn: false});
      setTimeout(() => {
        this.state.loadIn = true;
        this.state.panel = (this.state.panel + 1) % this.props.events.length;
        this.forceUpdate();
        this.reset();
      }, 500)
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
    return (
      <div style={{padding: "0 5em"}} onMouseEnter={() => { this.onPromotedAreaFocus() }} onMouseLeave={() => { this.onPromotedAreaLeave() }}>
        <div className="col x-center">
          <VelocityComponent animation={ this.state.loadIn ? { opacity: 1 } : { opacity: 0 }} duration={500}>
            {
              (this.props.events || []).length > 0 ? (
                <DisplayPromotedEvent event={this.props.events[this.state.panel]} active={true} />
              ) : (
                null
              )
            }

          </VelocityComponent>
          <div className="discover-selector row">
            {
              this.props.events.map((val, i) => {
                return (
                  <div
                    className={`discover-selector-square ${i === this.state.panel ? "active" : ""}`}
                    ref={`panel_${i}`}
                    onClick={
                      (e) => {
                        this.onPromotedAreaFocus();
                        this.setState({loadIn: false});
                        setTimeout(() => {
                          this.setState({
                            loadIn: true,
                            panel: i
                          })
                        }, 500)
                      }
                    }>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
