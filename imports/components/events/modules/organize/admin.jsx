import React from "react";

import UserTab from "/imports/components/users/user_tab.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class AdminAddAction extends ResponsiveComponent {

  constructor(props) {
    super(props);
    Meteor.call("event.staff.admins", Events.findOne()._id, (err, data) => {
      console.log(data);
      this.setState({
        admins: data,
        ready: true
      });
    })
    this.state = {
      ready: false
    };
  }

  loadCandidates() {
    clearTimeout(this.state.timer);
    const value = this.refs.query.value;
    if(value.length >= 3) {
      this.state.timer = setTimeout(() => {
        Meteor.call("event.staff.loadAdminCandidates", value, (err, data) => {
          console.log(data);
          this.setState({
            candidates: data
          })
        })
      }, 500)
    }
  }

  render() {
    if(!this.state.ready) {
      return (
        <span>
          Loading...
        </span>
      )
    }

    const event = Events.findOne();
    return (
      <div className="col">
        <label className="input-label">Username</label>
        <input type="text" style={{margin: 0, marginBottom: 10}} ref="query" onChange={this.loadCandidates.bind(this)} />
        {
          this.state.candidates && this.state.candidates.length ? (
            [
              <h5 style={{marginBottom: 10}}></h5>,
              <div className="row" style={{marginBottom: 10, flexWrap: "wrap"}}>
                {
                  this.state.candidates.map(c => {
                    return (
                      <UserTab {...c} onClick={() => {
                        Meteor.call("event.staff.addAdmin", event._id, c._id, (err) => {
                          if(err) {
                            toastr.error(err.reason);
                          }
                          this.state.admins.push(c);
                          this.refs.query.value = "";
                          this.state.candidates = [];
                          this.forceUpdate();
                        })
                      }} />
                    )
                  })
                }
              </div>
            ]
          ) : (
            null
          )
        }
        <h5 style={{marginBottom: 10}}>Current Admins</h5>
        <div className="row" style={{marginTop: 10, flexWrap: "wrap"}}>
          {
            this.state.admins.map(u => {
              return (
                <UserTab {...u} />
              )
            })
          }
        </div>
      </div>
    )
  }
}
