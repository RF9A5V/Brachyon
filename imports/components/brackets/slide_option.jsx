import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { scroller } from "react-scroll";

import StartModal from "/imports/components/events/brackets/admin_comps/start_modal.jsx";

export default class SlideOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      open: false
    }
  }

  content() {
    const bracket = Brackets.findOne(this.props.bracket.id);
    if(!bracket) {
      return (
        <button onClick={() => { this.setState({ open: true }) }}>Start Bracket</button>
      )
    }
    const scrollOptions = {
      smooth: true,
      duration: 500,
      delay: 100
    }
    switch(this.props.bracket.format.baseFormat) {
      case "single_elim":
        return null
      case "double_elim":
        return [
          <button style={{marginRight: 10}} onClick={() => {
            scroller.scrollTo("winners", scrollOptions);
          }}>Winners</button>,
          <button onClick={() => {
            scroller.scrollTo("losers", scrollOptions);
          }}>Losers</button>
        ]
      default:
        return null
    }
  }

  render() {
    if(!this.props.active) {
      return null;
    }
    return (
      <div className={`bracket-option-slider row x-center ${this.state.active ? "active" : ""}`} onMouseEnter={() => {
        this.setState({
          active: true
        })
      }} onMouseLeave={() => {
        this.setState({
          active: false
        })
      }}>
        <FontAwesome name="caret-left" size="2x" />
        {
          this.state.active ? (
            <div style={{marginLeft: 10}}>
              { this.content() }
            </div>
          ) : (
            null
          )
        }
        <StartModal index={this.props.index} open={this.state.open} onClose={() => { this.setState({ open: false }) }} onStart={this.props.onStart} />
      </div>
    )
  }
}
