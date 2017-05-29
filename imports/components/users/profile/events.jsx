import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import Loader from "/imports/components/public/loader.jsx";

import EventResult from "./event_result.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

export default class UserEvents extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      action: "all",
      skip: 0,
      done: false
    };
    this.onScrollEnd = this.onScrollEnd.bind(this);
  }

  onScrollEnd(e) {
    const el = e.target;
    const target = el.scrollingElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight || window.scrollHeight;
    const clientHeight = window.innerHeight;
    if(scrollHeight - scrollTop - clientHeight == 0) {
      this.loadEvents(this.props, false);
    }
  }

  loadEvents(props, reload) {
    if(reload) {
      this.state.done = false;
      this.state.data = [];
    }
    if(this.state.done) {
      return;
    }
    const limit = this.state.render == "mobile" ? 8 : 16;
    const action = props.type == "playing" ? "users.getPlayerEvents" : "users.getOwnerEvents";
    var date = null;
    if(!reload && this.state.data.length) {
      date = this.state.data[this.state.data.length - 1].date;
    }
    Meteor.call(action, this.props.username, limit, {
      type: this.state.action,
      date
    }, (err, data) => {
      if(data.length == 0) {
        this.setState({
          done: true
        })
      }
      if(!reload) {
        data = (this.state.data || []).concat(data);
      }
      this.setState({
        data,
        ready: true
      })
    })
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadEvents(this.props, true);
    window.addEventListener("scroll", this.onScrollEnd);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener("scroll", this.onScrollEnd);
  }

  typeSelector(opts) {
    var options;
    if(this.props.type == "playing") {
      options = ["All", "Active", "Completed", "Leagues", "Quick Brackets"].map(i => {
        return (
          <option value={i.toLowerCase()}>
            { i }
          </option>
        )
      })
    }
    else {
      options = ["All", "Unpublished", "Active", "Completed", "Leagues", "Quick Brackets"].map(i => {
        return (
          <option value={i.toLowerCase()}>
            { i }
          </option>
        )
      })
    }
    return (
      <select value={this.state.action} onChange={(e) => {
        this.state.action = e.target.value.toLowerCase();
        this.loadEvents(this.props, true);
      }} style={{fontSize: "1em", margin: 20, width: 300}}>
        { options }
      </select>
    )
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <div className="row center" style={{padding: 50}}>
          <Loader animate={true} width={150} />
        </div>
      )
    }
    return (
      <div className="col">
        <div className="row center">
          { this.typeSelector(opts) }
        </div>
        <div style={{padding: 20}}>
          <RowLayout length={opts.mobile ? 1 : 4}>
            {
              (this.state.data).map(e => {
                return (
                  <EventResult key={e.slug} {...e} />
                )
              })
            }
          </RowLayout>
        </div>
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false
    });
  }
}
