import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import SkillTree from "./strategies/skill_tree.jsx";

export default class StrategySelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      strategy: null
    }
  }

  strategies() {
    var stratList = [
      {
        name: "Skill Tree",
        icon: "sitemap",
        component: SkillTree
      },
      {
        name: "Competitive CF",
        icon: "sitemap"
      }
    ];
    return stratList;
  }

  render() {
    if(this.state.strategy) {
      return (
        <div className="col">
          <div className="row" style={{justifyContent: "flex-end"}}>
            <button onClick={() => { this.setState({ strategy: null }) }}>Back</button>
          </div>
          <this.state.strategy.component />
        </div>
      )
    }
    return (
      <div className="row">
        {
          this.strategies().map((strat) => {
            return (
              <div className="strategy-block col x-center" onClick={() => { if(strat.name != "Skill Tree") { return toastr.error("Unimplemented.") } this.setState({ strategy: strat }) }}>
                <h4>{ strat.name }</h4>
                <FontAwesome name={strat.icon} />
                <div>
                  <p>
                    Bacon ipsum dolor amet brisket venison fatback, bresaola ground round meatloaf ball tip. Beef ribs jerky meatloaf, shoulder cupim turducken prosciutto ground round short ribs andouille pig chicken sirloin.
                  </p>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
