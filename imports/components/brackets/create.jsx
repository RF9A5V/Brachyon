import React, { Component } from "react";
import { browserHistory } from "react-router";
import FontAwesome from "react-fontawesome";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      urlAvailable: false,
      loading: false,
      url: ""
    }
  }

  onBracketCreate(e) {
    e.preventDefault();
    const obj = this.refs.bracket.value();
    Meteor.call("brackets.create", this.state.url, obj, (err, val) => {
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
