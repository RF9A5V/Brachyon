import React, { Component } from "react";

import StartBracketAction from "./admin_comps/start.jsx";

export default class ParticipantAddField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      showUsers: false,
      users: null,
      subs: []
    };
  }

  componentWillUnmount() {
    if(this.state.users) {
      this.state.users.stop();
    }
    if(this.state.subs){
      this.state.subs.forEach(u => {
        u.stop();
      });
    }
  }

  userTemplate(user, index) {
    return (
      <div className="row x-center hover-lg user-template" style={{padding: 20, cursor: "pointer", maxWidth: "100%", borderBottom: "solid 2px #111"}} onClick={() => { this.addParticipant(user.username, user._id) }}>
        <img style={{width: 50, height: 50, marginRight: 20, borderRadius: "100%"}} src={user.profile.imageUrl || "/images/profile.png"} />
        { user.username }
      </div>
    )
  }

  loadUsers(e) {
    var request = e.target.value;
    if(this.state.timer) {
      clearTimeout(this.state.timer);
    }
    if(request.length < 3) {
      if(this.state.users) {
        this.state.users.stop();
        this.setState({
          query: "",
          showUsers: false
        })
      }
      return;
    }
    this.state.query = request;
    this.state.timer = setTimeout(() => {
      if(this.state.users) {
        this.state.users.stop();
      }
      this.state.users = Meteor.subscribe("searchAndFilterUserByParticipation", request, Instances.findOne()._id, this.props.index, {
        onReady: () => {
          this.setState({
            showUsers: true
          });
        }
      })
    }, 500);
  }

  randomizeSeeding()
  {
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    var nparticipants = shuffle(this.props.bracket.participants); //We might need to find a way to return the participants from the backend rather than put the work on the frontend
    //For now though, we need to get the same list of participants on both front and back end.
    Meteor.call("events.shuffle_seeding", Instances.findOne()._id, this.props.index, nparticipants, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully shuffled seeding.", "Success!");
        this.forceUpdate();
      }
    });
  }

  getUsers() {
    if(!this.state.showUsers) {
      return [];
    }
    const participants = (this.props.bracket.participants || []).map(p => {
      return p.id;
    });
    return Meteor.users.find({
      username: new RegExp(this.state.query, "i"),
      _id: {
        $nin: participants
      }
    })
  }

  addParticipant(alias, id) {

    const cb = () => {
      Meteor.call("events.addParticipant", Events.findOne()._id, this.props.index, id, alias, true, (e) => {
        if(e) {
          toastr.error(e.reason);
        }
        else {
          toastr.success("Successfully added participant!");
          this.setState({
            query: "",
            showUsers: false
          });
          this.refs.userValue.value = "";
          if(id) {
            Meteor.call("tickets.addOnsite", id, Instances.findOne()._id, this.props.index, (err) => {
              if(err) {
                return toastr.error(err.reason);
              }
              else {
                this.props.onParticipantAdd({
                  id,
                  alias
                })
              }
            })
          }
        }
      })
    }

    if(id) {
      this.state.subs.push(Meteor.subscribe("user", id, {
        onReady: cb
      }));
    }
    else {
      cb();
    }
  }

  render() {
    return (
      <div className="col" style={{padding: 20, backgroundColor: "black"}}>
        <div className="row center">
          <label style={{margin: 0}}>Add A Participant</label>
        </div>
        <div className="row" style={{marginBottom: 10}}>
          <input className="col-1" ref="userValue" type="text" style={{margin: 0}} onChange={this.loadUsers.bind(this)} />
        </div>
        <div style={{backgroundColor: "#111", height: 300, overflowY: "auto", width: "100%", marginBottom: 10}}>
          {
            this.state.query.length >= 3 ? (
              <div className="row x-center hover-lg user-template" style={{padding: 20, cursor: "pointer", maxWidth: "100%", borderBottom: "solid 2px #111"}} onClick={() => { this.addParticipant(this.state.query, null) }}>
                <img style={{width: 50, height: 50, marginRight: 20, borderRadius: "100%"}} src={"/images/profile.png"} />
                <div className="col">
                  <span>{ this.state.query }</span>
                  <span>Add As Anonymous User</span>
                </div>
              </div>
            ) : (
              ""
            )
          }
          {
            this.getUsers().map((user, i) => {
              return this.userTemplate(user, i)
            })
          }
        </div>
        <div className="row x-center">
          {
            this.props.bracket.isComplete ? (
              ""
            ) : (
              <button style={{marginRight: 10}} onClick={this.randomizeSeeding.bind(this)}>
                Randomize Seeding
              </button>
            )
          }
          <div className = { ((this.props.bracket.id != null)) ?
            ("start-button-hide") :
            ((this.props.bracket.participants || []).length < 3 ? ("start-button-hide"):("")) }>
            <button onClick={this.props.onStart}>Start Bracket</button>
          </div>
        </div>
      </div>
    );
  }
}
