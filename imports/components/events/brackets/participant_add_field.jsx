import React, { Component } from "react";

export default class ParticipantAddField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: Meteor.subscribe("userSearch", "", {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      loading: false,
      user: null,
      value: ""
    };
  }

  userTemplate(user, index) {
    return (
      <div className="row x-center" style={{padding: 20, backgroundColor: "#222", cursor: "pointer", width: 400}} onClick={() => { this.setState({user: user._id, ready: false}); this.refs.username.value = user.username; }}>
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
    clearTimeout(this.state.timer);
    this.state.timer = setTimeout(() => {
      this.setState({
        users: Meteor.subscribe("userSearch", this.refs.username.value, {
          onReady: () => { this.setState({ ready: true, loading: false }) }
        }),
        value: this.refs.username.value
      })
    }, 500)
  }

  onParticipantAdd(e) {
    e.preventDefault();
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

  render() {
    return (
      <div className="row center">
        <div className="col x-center" style={{border: "solid 2px white", position: "relative", padding: 20, marginBottom: 20, width: "50vw"}}>
          <h5 style={{position: "absolute", top: -17.5, backgroundColor: "#333", padding: 5}}>Add Player</h5>
          <div className="row center x-center" style={{justifyContent: "flex-start"}}>
            <input type="text" placeholder="Add User or Alias" ref="username" onChange={this.onInputChange.bind(this)} style={{marginRight: 10}} />
            <div>
              <button onClick={this.onParticipantAdd.bind(this)}>Submit</button>
            </div>
          </div>
          {
            this.state.ready && this.state.value != "" && this.state.user == null ? (
              Meteor.users.find({
                username: new RegExp(this.state.value, "i")
              }).map((user) => {
                return this.userTemplate(user);
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
