import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class ByeReplacementModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {
        profile: {}
      }
    }
  }

  open() {
    this.setState({
      open: true
    })
  }

  close() {
    this.setState({
      open: false,
      user: {
        profile: {}
      },
      users: []
    })
  }

  searchUsers(e) {
    const request = e.target.value;
    const instance = Instances.findOne();
    if(this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(_ => {
      if(!request.length) {
        this.setState({
          users: []
        })
        return;
      }
      Meteor.call("events.brackets.findPlayerCandidates", instance._id, this.props.bracketIndex, request, (err, data) => {
        if(!instance.league) {
          data.push({
            username: null,
            profile: {
              alias: request,
              imageUrl: null
            }
          })
        }
        this.setState({
          users: data,
          index: -1
        })
      })
    }, 500);
  }

  setUser() {
    const alias = this.state.user.profile.alias || this.state.user.username;
    const id = this.state.user._id;
    const instanceId = Instances.findOne()._id;
    Meteor.call("brackets.replaceBye", instanceId, this.props.bracketIndex, this.props.index, {
      id,
      alias
    }, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully replaced bye.");
        if(this.props.addSub && id) {
          const sub = Meteor.subscribe("user", id, {
            onReady: () => {
              this.props.addSub(sub);
            }
          });
        }
        else {
          this.props.addSub(null);
        }
        this.close();
      }
    });
  }

  render() {
    if(!this.props.participant || this.props.index == undefined) {
      return null;
    }
    return (
      <Modal isOpen={this.state.open} onRequestClose={this.close.bind(this)}>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome name="times" size="2x" onClick={this.close.bind(this)} />
        </div>
        <div className="row center x-center">
          <div className="row" style={{width: 200, backgroundColor: "#666"}}>
            <img src="/images/profile.png" style={{width: 50, height: 50}} />
            <div style={{padding: 10}}>
              <span>{ this.props.participant.alias }</span>
            </div>
          </div>
          <FontAwesome name="arrow-right" size="2x" style={{margin: "0 10px"}} />
          <div className="row" style={{width: 200, backgroundColor: "#666"}}>
            <img src={this.state.user.profile.imageUrl || "/images/profile.png"} style={{width: 50, height: 50}} />
            <div style={{padding: 10}}>
              <span>{ this.state.user.profile.alias || this.state.user.username }</span>
            </div>
          </div>
        </div>
        <div className="row center" style={{marginTop: 10, position: "relative"}}>
          <div className="col col-1">
            <label className="input-label">User or Alias</label>
            <input ref="search" type="text" style={{margin: 0}} onChange={this.searchUsers.bind(this)} />
          </div>
          <div style={{position: "absolute", top: "100%", maxHeight: 250, width: "100%", overflowY: "auto"}}>
            {
              this.state.users ? this.state.users.map(u => {
                return (
                  <div className={`row x-center hover-lg user-template`}
                   style={{padding: 10, cursor: "pointer", maxWidth: "100%", borderBottom: "solid 2px #111"}} onClick={() => {
                     this.setState({
                       user: u,
                       users: []
                     });
                     this.refs.search.value = u.username || u.profile.alias;
                   }}>
                    <img src={u.profile.imageUrl || "/images/profile.png"} style={{width: 50, height: 50}} />
                    <div className="col col-1" style={{padding: 10, alignItems: "flex-start"}}>
                      <span>~{ u.profile.alias || u.username }</span>
                      <span>{ u.username ? "@" + u.username : "Anonymous" }</span>
                    </div>
                  </div>
                )
              }) : null
            }
          </div>
        </div>
        {
          this.state.user.profile.alias || this.state.user.username ? (
            <div className="row center" style={{marginTop: 10}}>
              <button onClick={this.setUser.bind(this)}>Set User</button>
            </div>
          ) : (
            null
          )
        }
      </Modal>
    )
  }
}
