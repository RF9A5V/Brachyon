import React, { Component } from "react";
import { browserHistory } from "react-router";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketCreate extends Component {

  onBracketCreate(e) {
    e.preventDefault();
    var value = this.refs.bracket.value();
    Meteor.call("brackets.create", value.game, value.format, (err, val) => {
      if(err) {
        return toastr.error(err.reason);
      }
      else {
        browserHistory.push("/bracket/" + val + "/admin");
      }
    })
  }

  render() {
    return (
      <div className="box col center x-center">
        <div style={{width: "80%"}}>
          <div className="row center" style={{marginBottom: 10}}>
            <h5>Bracket Create</h5>
          </div>
          <BracketForm ref="bracket" />
          <div className="row center" style={{marginTop: 10}}>
            <button onClick={this.onBracketCreate.bind(this)}>
              Create Bracket
            </button>
          </div>
        </div>
      </div>
    )
  }
}
