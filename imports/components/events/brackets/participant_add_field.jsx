import React, { Component } from "react";

export default class ParticipantAddField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      loading: false,
      user: null,
      value: "",
      index: -1,
      length: 0
    };
  }

  componentWillUnmount() {
    this.state.users.stop();
  }

  userTemplate(user, index) {
    return (
      <div className="row x-center" style={{padding: 20, cursor: "pointer", width: 400, backgroundColor: this.state.index == index ? "#666" : "#222", maxWidth: "100%"}} onClick={() => {
        this.setState({ready: false});
        this.refs.username.value = user.username;
        this.state.user = user._id;
        this.onParticipantAdd();
      }}>
        <img style={{width: 50, height: 50, marginRight: 20, borderRadius: "100%"}} src={user.profile.imageUrl || "/images/profile.png"} />
        { user.username }
      </div>
    )
  }

  onInputChange() {
    this.setState({
      ready: false,
      loading: true,
      user: null
    });
    if(this.state.users) {
      this.state.users.stop();
    }
    clearTimeout(this.state.timer);
    this.state.timer = setTimeout(() => {
      this.setState({
        users: Meteor.subscribe("userSearch", this.refs.username.value, {
          onReady: () => {
            console.log('shit')
            this.setState({
              ready: true,
              loading: false,
              length: Meteor.users.find({ username: new RegExp(this.state.value, "i") }).fetch().length
            })
          }
        }),
        value: this.refs.username.value,
        index: -1
      });
    }, 500)
  }

  onParticipantAdd() {
    if(this.state.user != null) {
      Meteor.call("events.addParticipant", Events.findOne()._id, this.props.bracketIndex, this.state.user, null, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success(`Added player to bracket!`);
          this.props.onComplete({
            alias: this.refs.username.value,
            id: this.state.user
          });
          this.refs.username.value = "";

          this.setState({
            ready: false,
            loading: false,
            user: null,
            value: ""
          });
        }
      })
    }
    else {
      Meteor.call("events.addParticipant", Events.findOne()._id, this.props.bracketIndex, null, this.refs.username.value, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success(`Added player to bracket!`);
          this.props.onComplete({
            alias: this.refs.username.value,
            id: null
          });
          this.refs.username.value = "";
          this.setState({
            ready: false,
            loading: false,
            user: null,
            value: ""
          })
        }
      })
    }
  }

  onKeyPress(e) {
    if(this.state.ready) {
      if(e.key == "ArrowDown") {
        if(this.state.index < this.state.length - 1) {
          this.setState({
            index: this.state.index + 1
          })
        }
      }
      if(e.key == "ArrowUp") {
        if(this.state.index > 0) {
          this.setState({
            index: this.state.index - 1
          })
        }
      }
      if(e.key == "Enter") {
        if(this.state.index == -1) {
          this.onParticipantAdd(e);
        }
        else {
          var user = Meteor.users.find({
            username: new RegExp(this.state.value, "i")
          }).fetch()[this.state.index];
          this.setState({
            user: user._id,
            ready: false,
            loading: false
          });
          this.refs.username.value = user.username;
        }
      }
    }
    else {
      if(e.key == "Enter") {
        this.onParticipantAdd(e);
      }
    }
  }

  render() {
    return (
      <div className="row center">
        <div className="col x-center" style={{border: "solid 2px white", position: "relative", padding: 20, marginBottom: 20, width: "50vw"}}>
          <h5 style={{position: "absolute", top: -17.5, backgroundColor: "#333", padding: 5}}>Add Player</h5>
          <div className="row center x-center" style={{justifyContent: "flex-start"}}>
            <input type="text" placeholder="Add User or Alias" ref="username" onChange={this.onInputChange.bind(this)} style={{marginRight: 10}} onKeyDown={this.onKeyPress.bind(this)} />
            <div>
              <button onClick={this.onParticipantAdd.bind(this)}>Submit</button>
            </div>
          </div>
          {
            this.state.ready && this.state.value != "" && this.state.user == null ? (
              Meteor.users.find({
                username: new RegExp(this.state.value, "i")
              }).map((user, i) => {
                return this.userTemplate(user, i);
              })
            ) : (
              ""
            )
          }
        </div>
      </div>
    );
  }
}
