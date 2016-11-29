import React, { Component } from "react";
import { browserHistory } from "react-router";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class RevenuePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0,
      isOpen: false
    }
  }

  value() {
    return {};
  }

  itemTabs() {
    var tabs = ["Rewards", "Tiers", "Prize Pool"];
    return (
      <div className="info-title-container">
        {
          tabs.map((tab, i) => {
            return (
              <div className={`info-title ${this.state.item == i ? "active" : ""}`} onClick={() => { this.setState({item: i}) }}>
                { tab }
              </div>
            )
          })
        }
      </div>
    )
  }

  itemDescriptions() {
    var tabs = ["Rewards", "Tiers", "Prize Pool"];
    var description = [
      (
        <div>
          <p>Allow us to reward you with a description of this section.
          Rewards act as incentives for your supporters to fund your event.
          One or more rewards can be applied to each tier. The same reward(s)
          can be applied to multiple tiers depending on how you wish to
          incentivize backers. We recommend rewards which pertain directly
          to the event.</p>

          <p>Check out our <a target="_blank" href="/faq">FAQ</a> to learn more about rewards.</p>
        </div>
      ),
      (
        <div>
          <p>Tiers are delicious! They are funding levels, grouping together
          one or more rewards. We recommend you apply rewards increasingly
          by value or amount.</p>

          <p>For some examples of successful tiers, click <a>here</a>.</p>
        </div>
      ),
      (
        <div>
          <p>By default 20% of all crowdfunding revenue goes to the Prize
          Pool. We recommend giving as much as possible to the Prize Pool -
          it attracts more players and increases hype!</p>

          <p>See some successful events in our <a target="_blank" href="/faq">FAQ</a> to learn about
          crowdfunding your Prize Pool.</p>
        </div>
      )
    ];
    return (
      <div className="col col-1 info-description">
        <h3 className="row center">{ tabs[this.state.item] }</h3>
        <div style={{marginTop: 20}}>
          {
            description[this.state.item]
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div style={this.props.style}>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{cursor: "pointer", backgroundColor: "#333", width: 100, height: 30}} onClick={this.props.onToggle}>
            <div className="row center x-center" style={{backgroundColor: this.props.selected ? "#FF6000" : "white", width: 45, height: 20, position: "relative", left: this.props.selected ? 50 : 5}}>
              <span style={{color: this.props.selected ? "#FFF" : "#333", fontSize: 12}}>
                {
                  this.props.selected ? (
                    "ON"
                  ) : (
                    "OFF"
                  )
                }
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          {
            this.itemTabs()
          }
          {
            this.itemDescriptions()
          }
        </div>
        <Modal isOpen={this.state.isOpen} onRequestClose={() => { this.setState({ isOpen: false }) }}>
          <div className="row flex-pad">
            <div></div>
            <FontAwesome name="times" size="2x" onClick={() => {this.setState({isOpen: false})}} />
          </div>
          <div className="col x-center">
            <h3>Working on it</h3>
          </div>
          <p>So yeah. we're still working on this feature. Stay tuned for crowdfunding goodness later in the future!</p>
          <p>XOXO</p>
          <p>- Brachyon Devs</p>
        </Modal>
      </div>
    )
  }
}
