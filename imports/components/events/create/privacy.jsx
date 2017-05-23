import React, { Component } from "react";

export default class PrivacyOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      privacy: props.privacy || "public"
    }
  }

  value() {
    const validOptions = [
      "public",
      "private"
    ];

    if(validOptions.indexOf(this.state.privacy) < 0) {
      toastr.error("Selected option for privacy is not recognized.");
      throw new Error("Must choose appropriate option for privacy. Selected " + this.state.privacy + ".");
    }
    var opts = {
      type: this.state.privacy
    };
    if(this.state.privacy == "private") {
      var linkValue = this.refs.link.value;
      if(linkValue) {
        opts.contactLink = this.refs.link.value;
      }
    }
    return opts;
  }

  options() {
    var options = ["public", "private"];
    return options.map(o => {
      return (
        <div className="row x-center" style={{marginRight: 20}}>
          <input style={{margin: 0, marginRight: 10}} name="privacy" type="radio" value={o} checked={this.state.privacy == o} onChange={() => { this.setState({ privacy: o }) }} />
          <span>{ o[0].toUpperCase() + o.slice(1) }</span>
        </div>
      )
    })
  }

  info() {
    switch(this.state.privacy) {
      case "public":
        return (
          <div className="col">
            <span>
              Anybody can register for your event through Brachyon.
            </span>
          </div>
        )
      case "private":
        return (
          <div className="col">
            <span style={{marginBottom: 10}}>Only you can add participants to your event. Add an additional contact link for players to ask you to enter the event if you'd like.</span>
            <div className="col">
              <label className="input-label">Contact Link</label>
              <input type="text" style={{margin: 0}} ref="link" />
            </div>
          </div>
        )
      default:
        return (
          <span>That option doesn't exist. What are you doing?</span>
        )
    }
  }

  render() {
    return (
      <div className="col">
        <label className="input-label">
          Privacy Settings
        </label>
        <div className="col" style={{backgroundColor: "#333"}}>
          <div className="row x-center" style={{padding: 10}}>
            {
              this.options()
            }
          </div>
          <div style={{padding: 10}} className="col-3">
            {
              this.info()
            }
          </div>
        </div>
      </div>
    )
  }
}
