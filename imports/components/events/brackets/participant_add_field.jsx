import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import ResetModal from "./admin_comps/reset_modal.jsx";

import Games from "/imports/api/games/games.js";

export default class ParticipantAddField extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      users: [],
      subs: [],
      index: -1
    };
  }

  componentWillUnmount() {
    if(this.state.subs){
      this.state.subs.forEach(u => {
        u.stop();
      });
    }
  }

  userTemplate(user, index, opts) {
    return (
      <div className={`row x-center hover-lg user-template ${this.state.index == index ? "active" : ""}`}
       style={{padding: 10, cursor: "pointer", maxWidth: "100%", borderBottom: "solid 2px #111"}} onClick={() => { this.addParticipant(user.username, user._id) }}>
        <img style={{width: opts.imgDim, height: opts.imgDim, marginRight: 20, borderRadius: "100%"}} src={user.profile.imageUrl || "/images/profile.png"} />
        <div className="col">
          <span style={{fontSize: opts.fontSize, textAlign: "left"}}>
            ~{ user.profile.alias || user.username }
          </span>
          <span style={{fontSize: `calc(${opts.fontSize} * 0.8)`, textAlign: "left"}}>
            @{ user.username }
          </span>
        </div>
      </div>
    )
  }

  loadUsers(e) {
    var request = e.target.value;
    if(this.state.timer) {
      clearTimeout(this.state.timer);
    }
    if(request.length < 3) {
      this.setState({
        users: [],
        index: -1
      })
      return;
    }
    this.state.query = request;
    this.state.timer = setTimeout(() => {
      const instanceId = Instances.findOne()._id;
      const index = this.props.index;
      Meteor.call("events.brackets.findPlayerCandidates", instanceId, index, request, (err, data) => {
        this.setState({
          users: data,
          index: -1
        })
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
    const participants = Instances.findOne().brackets[this.props.index].participants;
    var nparticipants = shuffle(participants); //We might need to find a way to return the participants from the backend rather than put the work on the frontend
    //For now though, we need to get the same list of participants on both front and back end.
    Meteor.call("events.shuffle_seeding", Instances.findOne()._id, this.props.index, nparticipants, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully shuffled seeding.", "Success!");
        this.props.onUpdateParticipants();
      }
    });
  }

  getUsers() {
    return this.state.users;
  }

  addParticipant(alias, id) {

    const cb = () => {
      Meteor.call("events.addParticipant", Instances.findOne()._id, this.props.index, id, alias, true, (e) => {
        if(e) {
          toastr.error(e.reason);
        }
        else {
          toastr.success("Successfully added participant!");
          this.setState({
            query: "",
            users: [],
            index: -1
          });
          if(this.refs.userValue) {
            this.refs.userValue.value = "";
          }
          this.props.onUpdateParticipants();
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

  renderBase(opts) {
    const event = Events.findOne();
    const isLeague = event && event.league != null;
    return (
      <div className="col" style={{padding: 20, backgroundColor: "black"}}>
        <div className="col" style={{marginBottom: 10, position: "relative"}}>
          <label className="input-label" style={{fontSize: opts.fontSize}}>{this.props.bracket.name? (this.props.bracket.name+" "):(Games.findOne({_id:this.props.bracket.game}).name + " ")}({this.props.participantCount}{
            (this.props.bracket.options || {}).limit ? (
              ` out of ${this.props.bracket.options.limit}`
            ) : (
              ""
            )
          })
          </label>
          <input className={`col-1 ${opts.inputClass}`} ref="userValue" type="text" placeholder="Add Participant" style={{margin: 0}} onChange={this.loadUsers.bind(this)} onKeyPress={(e) => {
            if(e.key == "Enter") {
              const user = this.state.users[this.state.index];
              if(!user) {
                this.addParticipant(this.refs.userValue.value, null);
              }
              else {
                this.addParticipant(user.username, user._id);
              }

            }
          }} onKeyDown={(e) => {
            if(e.keyCode == "38") {
              this.setState({
                index: Math.max(-1, this.state.index - 1)
              })
            }
            else if(e.keyCode == "40") {
              this.setState({
                index: Math.min(this.state.users.length, this.state.index + 1)
              })
            }
          }} />
          {
            this.state.users.length || this.state.query.length >= 3 ? (
              <div style={{backgroundColor: "#111", position: "absolute", top: 72, width: "100%", maxHeight: "20vh", overflowY: "auto", border: "solid 2px #111"}}>
                {
                  this.getUsers().map((user, i) => {
                    return this.userTemplate(user, i, opts)
                  })
                }
                {
                  this.state.query.length >= 3 && !isLeague ? (
                    <div ref="anon" className={`row x-center hover-lg user-template ${this.state.index == this.state.users.length ? "active" : ""}`}
                    style={{padding: 10, cursor: "pointer", maxWidth: "100%"}} onClick={() => { this.addParticipant(this.state.query, null) }}>
                      <img style={{width: opts.imgDim, height: opts.imgDim, marginRight: 20, borderRadius: "100%"}} src={"/images/profile.png"} />
                      <div className="col">
                        <span style={{fontSize: opts.fontSize, textAlign: "left"}}>{ this.state.query }</span>
                        <span style={{fontSize: opts.fontSize, textAlign: "left"}}>Add As Anonymous User</span>
                      </div>
                    </div>
                  ) : (
                    null
                  )
                }
              </div>
            ) : (
              null
            )
          }
        </div>
        <div className="row x-center">
          {
            this.props.bracket.isComplete ? (
              ""
            ) : (
              <button className={opts.buttonClass + " col-1 row x-center center"} onClick={this.randomizeSeeding.bind(this)}>
                <FontAwesome name="random" style={{fontSize: opts.iconSize, marginRight: 10}} />
                Randomize
              </button>
            )
          }
          {
            this.props.bracket.id ? (
              <button className={opts.buttonClass + " col-1 row x-center center"} style={{marginLeft: 10}} onClick={() => { this.setState({ resetOpen: true }) }}>
                <FontAwesome name="refresh" style={{fontSize: opts.iconSize, marginRight: 10}} />
                Reset Bracket
              </button>
            ) : (
              this.props.participantCount > 3 ? (
                <button className={opts.buttonClass + " col-1 row x-center center signup-button"} style={{marginLeft: 10}} onClick={this.props.onStart}>
                  <FontAwesome name="play" style={{fontSize: opts.iconSize, marginRight: 10}} />
                  Start
                </button>
              ) : (
                null
              )

            )
          }
        </div>
        <ResetModal open={this.state.resetOpen} onClose={() => { this.setState({ resetOpen: false }) }} onStart={() => {
          Meteor.call("events.stop_event", Instances.findOne()._id, this.props.index, () => {
            this.props.onUpdateParticipants();
            this.props.update();
          })
        }} index={this.props.index} />
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5rem",
      inputClass: "large-input",
      buttonClass: "large-button",
      imgDim: 100,
      iconSize: "4rem"
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      inputClass: "",
      buttonClass: "",
      imgDim: 50,
      iconSize: "1em"
    });
  }

}
