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
    var value = this.refs.bracket.value();
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

  onSlugChange(e) {
    const value = e.target.value;
    clearTimeout(this.state.timer);
    this.setState({
      url: value
    })
    this.state.timer = setTimeout(() => {
      this.setState({
        loading: true
      });
      Meteor.call("brackets.checkSlug", value, (err) => {
        if(err) {
          this.setState({
            loading: false,
            urlAvailable: false
          })
        }
        else {
          this.setState({
            loading: false,
            urlAvailable: true
          })
        }
      })
    }, 500)

  }

  render() {
    return (
      <div className="box col center x-center">
        <div style={{width: "80%"}}>
          <div className="row center" style={{marginBottom: 10}}>
            <h5>Bracket Create</h5>
          </div>
          <BracketForm ref="bracket" />
          <div className="row" style={{marginTop: 10}}>
            <label className="row x-center input-label">https://www.brachyon.com/bracket/</label>
            <input type="text" className="col-1" onChange={this.onSlugChange.bind(this)} style={{margin: 0}} />
          </div>
          {
            this.state.url.length ? (
              this.state.loading ? (
                <div>
                  Loading...
                </div>
              ) : (
                this.state.urlAvailable ? (
                  <div className="row x-center">
                    <FontAwesome style={{marginRight: 10}} name="check" />
                    <span>This URL is available!</span>
                  </div>
                ) : (
                  <div className="row x-center">
                    <FontAwesome style={{marginRight: 10}} name="times" />
                    <span>This URL is unavailable!</span>
                  </div>
                )
              )
            ) : (
              null
            )
          }
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
