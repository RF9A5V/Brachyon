import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class ModuleSelectForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organize: {
        exists: props.organize != null,
        name: "Organize"
      },
      revenue: {
        exists: props.revenue != null,
        name: "Revenue"
      },
      bot: {
        exists: props.bot != null,
        name: "Bot"
      },
      promotion: {
        exists: props.promotion != null,
        name: "Promotion"
      }
    };
    if(this.state.revenue.exists) {
      this.state.revenue.stretchGoals = props.revenue.stretchGoals != null;
      this.state.revenue.crowdfunding = props.revenue.crowdfunding != null;
      this.state.revenue.ticketing = props.revenue.ticketing != null;
      this.state.revenue.tierRewards = props.revenue.tierRewards != null;
    }
    if(this.state.promotion.exists) {
      this.state.promotion.bigNames = props.promotion.bigNames != null
      this.state.promotion.frontPageBid = props.promotion.frontPageBid != null
    }
  }

  submodulesByKey(key) {
    if(this.state[key] == null || !this.state[key].exists) {
      return "";
    }
    if(key == "revenue") {
      return {
        stretchGoals: {
          exists: this.state.revenue.stretchGoals,
          name: "Stretch Goals",
          value: []
        },
        crowdfunding: {
          exists: this.state.revenue.crowdfunding,
          name: "Crowdfunding",
          value: {}
        },
        ticketing: {
          exists: this.state.revenue.ticketing,
          name: "Ticketing / RSVP",
          value: []
        },
        tierRewards: {
          exists: this.state.revenue.tierRewards,
          name: "Tier Rewards",
          value: []
        }
      }
    }
    if(key == "promotion") {
      return {
        bigNames: {
          exists: this.state.promotion.bigNames,
          name: "Big Names",
          value: []
        },
        frontPageBid: {
          exists: this.state.promotion.frontPageBid,
          name: "Front Page Bid",
          value: 0
        }
      }
    }
    return {};
  }

  submoduleRender(key) {
    var submodules = this.submodulesByKey(key);
    var domObjects = [];
    for(var i in submodules) {
      domObjects.push(
        <div className={`submodule-block ${submodules[i].exists ? "active" : ""}`} onClick={this.toggleSubmodule(key, i).bind(this)}>
          <span>{ submodules[i].name }</span>
        </div>
      )
    }
    return (
      <div className="col">
        { domObjects }
      </div>
    )
  }

  toggleModule(key) {
    return (e) => {
      e.preventDefault();
      this.state[key].exists = !this.state[key].exists;
      this.forceUpdate();
    }
  }

  toggleSubmodule(key, subkey) {
    return (e) => {
      e.preventDefault();
      this.state[key][subkey] = !this.state[key][subkey];
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="col">
      {
        Object.keys(this.state).map((key) => {
          return (
            <div className="row" style={{marginBottom: 10, alignItems: "flex-start"}}>
              <div className={`module-select-block col center x-center ${this.state[key].exists ? "active" : ""}`} onClick={this.toggleModule(key).bind(this)}>
                <FontAwesome name="cog" size="3x" style={{marginBottom: 10}} />
                <span>{ this.state[key].name }</span>
              </div>
              {
                this.submoduleRender(key)
              }
            </div>
          )
        })
      }
      </div>
    )
  }

  values() {
    var results = {};
    for(var i in this.state) {
      if(this.state[i].exists) {
        results[i] = [];
        delete this.state[i].exists;
        for(var j in this.state[i]) {
          if(typeof(this.state[i][j]) == "boolean" && this.state[i][j] === true) {
            results[i].push(j);
          }
        }
      }
    }
    return results;
  }

}
