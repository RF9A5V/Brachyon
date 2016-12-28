import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class CreateRunnableScreen extends Component {
  render() {
    var blockStyle = {
      width: "calc(33% - 20px)",
      marginRight: 10,
      backgroundColor: "#111"
    };

    return (
      <div className="box col center">
        <div className="row col-1 center x-center">
          <div className="generic-block" onClick={ () => { browserHistory.push("/brackets/create") } }>
            <FontAwesome  size="3x" name="sitemap" />
            <h4>Quick Create</h4>
            <p>
              Remember it’s called the creative process, it’s not the creative fucking moment. Think about all the fucking possibilities. Never let your guard down by thinking you’re fucking good enough. When you sit down to work, external critics aren’t the enemy. It’s you who you must to fight against to do great fucking work.
            </p>
          </div>
          <div className="generic-block" onClick={() => { browserHistory.push("/events/create") }}>
            <FontAwesome  size="3x" name="sitemap" />
            <h4>Event Create</h4>
            <p>
              Remember it’s called the creative process, it’s not the creative fucking moment. Think about all the fucking possibilities. Never let your guard down by thinking you’re fucking good enough. When you sit down to work, external critics aren’t the enemy. It’s you who you must to fight against to do great fucking work.
            </p>
          </div>
          <div className="generic-block" onClick={() => { browserHistory.push("/leagues/create") }}>
            <FontAwesome size="3x"  name="sitemap" />
            <h4>League Create</h4>
            <p>
              Remember it’s called the creative process, it’s not the creative fucking moment. Think about all the fucking possibilities. Never let your guard down by thinking you’re fucking good enough. When you sit down to work, external critics aren’t the enemy. It’s you who you must to fight against to do great fucking work.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
