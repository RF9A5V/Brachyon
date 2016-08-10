import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import DetailsPanel from "./details.jsx";
import OrganizationPanel from "./organization.jsx";
import PromotionPanel from "./promotion.jsx";
import RevenuePanel from "./revenue.jsx";

export default class EditMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    }
  }

  event() {
    return this.props.event;
  }

  acceptedKeys() {
    var event = this.event();
    var editable = ["details", "organize", "bot", "promotion", "revenue"];
    var eventKeys = Object.keys(event);
    var intersect = editable.filter((item) => { return eventKeys.indexOf(item) >= 0 });
    var fields = {};
    for(var i in intersect) {
      fields[intersect[i]] = event[intersect[i]];
    }
    return fields;
  }

  panels() {
    return {
      details: (<DetailsPanel />),
      organize: (<OrganizationPanel />),
      bot: (<div>bot</div>),
      promotion: (<PromotionPanel />),
      revenue: (<RevenuePanel />),
    }
  }

  render() {
    var keys = this.acceptedKeys();
    var panels = this.panels();
    return (
      <div className="side-tab-container">
        <div className="side-tab-menu col flex-pad">
          <div className="col">
            {
              Object.keys(keys).map((value, index) => {
                return (
                  <div
                    className={`side-tab-menu-item ${this.state.selected === index ? "active" : ""}`}
                    key={index}
                    onClick={(e) => { this.setState({selected: index}) }}>
                    { value[0].toUpperCase() + value.slice(1) }
                  </div>
                )
              })
            }
          </div>
          <div className="side-tab-menu-item">
            <FontAwesome name="plus" />
            <span style={{marginLeft: 15}}>
              Add a Module
            </span>
          </div>
        </div>
        <div className="side-tab-content">
          {
            Object.keys(keys).map((value, index) => {
              return (
                <div className={`side-tab-content-item ${this.state.selected === index ? "active" : ""}`}>
                  { panels[value] }
                </div>
              );
            })
          }
        </div>
      </div>
    )
  }
}
