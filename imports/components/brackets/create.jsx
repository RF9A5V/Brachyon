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

  onSlugChange(e) {
    const value = this.state.url;
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

  randomizeSlug() {
    const part1 = parseInt(Math.random() * 10000);
    const part2 = parseInt(Math.random() * 10000);
    var comp = part1 + "" + part2;
    this.state.url = comp;
    this.onSlugChange();
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
            <input type="text" ref="slug" className="col-1" value={this.state.url} onChange={this.onSlugChange.bind(this)} style={{margin: 0}} />
            <button style={{marginLeft: 10}} onClick={this.randomizeSlug.bind(this)}>Randomize</button>
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
