import React, { Component } from 'react'
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class MatchBlock extends Component {

  componentWillMount() {
    this.setState({
      open: false,
      chosen: 2
    })
  }

  openModal() {
    this.setState({
      open: true,
      chosen: 2
    });
  }

  closeModal() {
    this.setState({
      open: false,
      chosen: 2
    });
  }

  onMatchUserClick() {
    return (e) => {
      e.preventDefault();
      Meteor.call("events.advance_single", Brackets.findOne()._id, 0, this.props.round, this.props.index, (err) => {
        if(err){
          console.log(err);
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          this.closeModal();
          toastr.success("Player advanced to next round!", "Success!");
          this.props.update();
          this.forceUpdate();
        }
      })

    }
  }

  onUndoUserClick()
  {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.undo_single", Brackets.findOne()._id, 0, this.props.round, this.props.index, (err) => {
        if(err){
          console.log(err);
          toastr.error("Couldn't undo this match.", "Error!");
        }
        else {
          toastr.success("Match has been undone!", "Success!");
          this.props.update();
          this.forceUpdate();
        }
      })
      this.closeModal();
    }
  }

  onMatchUpdateScore(isPlayerOne, value) {
    Meteor.call("events.brackets.updateMatchScore", this.props.id, isPlayerOne, value, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      this.props.update();
      this.forceUpdate();
    })
  }

  getUsername(p) {
    // return Meteor.users.findOne(id).username;
    if(!p) {
      return "TBD"
    }
    if(p.id) {
      return Meteor.users.findOne(p.id).username;
    }
    return p.alias;
  }

  getProfileImage(id) {
    var participants = Instances.findOne().brackets[0].participants;
    var user = null;
    for(var i in participants) {
      if(participants[i].alias == id) {
        user = Meteor.users.findOne(participants[i].id);
        break;
      }
    }
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }


  matchModal(match) {
    if(match && match.players[0] && match.players[1]) {
      return (
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
          {
            match.winner == null ?
            (
              <div className="col" style={{height: "100%"}}>
                <div className="self-end">
                  <FontAwesome className ="pointerChange" name="times" size="2x" onClick={() => { this.setState({open: false, chosen: 2}) }} />
                </div>
                <div className="row col-1">
                  <div className="col x-center col-1">
                    <img src={this.getProfileImage(match.players[0])} style={{borderRadius: "100%", width: 100, height: "auto", marginBottom: 20}} />
                    <h5 className={this.getUsername(match.players[0])==null?(""):
                      (this.getUsername(match.players[0]).length<15)?(""):("marquee")}
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ this.getUsername(match.players[0]) }
                    </h5>
                    <div className="col center x-center col-1">
                      <div className="row center x-center" style={{marginTop:10}}>
                        <FontAwesome className ="pointerChange" style={{fontSize: 40,marginRight:10}} name="caret-left" onClick={() => {
                          if(match.players[0].score <= 0) {
                            return;
                          }
                          this.onMatchUpdateScore(true, -1)
                        }} />
                        <div className="row center x-center button-score">
                          { match.players[0].score }
                        </div>
                        <FontAwesome className="pointerChange" style={{fontSize: 40,marginLeft:10}} name="caret-right" onClick={() => {this.onMatchUpdateScore(true, 1)}} />
                      </div>

                    </div>
                    {
                      match.players[0].score > match.players[1].score ? (
                        <button onClick={this.onMatchUserClick(0)}>Declare Winner</button>
                      ) : (
                        <button style={{opacity: 0.3}}>Declare Winner</button>
                      )
                    }

                  </div>
                  <div className="col x-center col-1">
                    <img src={this.getProfileImage(match.players[0])} style={{borderRadius: "100%", width: 100, height: "auto", marginBottom: 20}} />
                    <h5 className={this.getUsername(match.players[1])==null?(""):
                      (this.getUsername(match.players[1]).length<15)?(""):("marquee")}
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ this.getUsername(match.players[1]) }
                    </h5>
                    <div className="col center x-center col-1">
                      <div className="row center x-center" style={{marginTop:10}}>
                        <FontAwesome className ="pointerChange" style={{fontSize: 40,marginRight:10}} name="caret-left" onClick={() => {
                          if(match.players[1].score <= 0) {
                            return;
                          }
                          this.onMatchUpdateScore(false, -1)
                        }} />
                        <div className="row center x-center button-score">
                          { match.players[1].score }
                        </div>
                        <FontAwesome className="pointerChange" style={{fontSize: 40,marginLeft:10}} name="caret-right" onClick={() => {this.onMatchUpdateScore(false, 1)}} />
                      </div>
                    </div>

                    {
                      match.players[1].score > match.players[0].score ? (
                        <button onClick={this.onMatchUserClick(1)}>Declare Winner</button>
                      ) : (
                        <button style={{opacity: 0.3}}>Declare Winner</button>
                      )
                    }
                  </div>
                </div>
                {
                  Events.findOne() ? (
                    <div className="row center">
                      <button onClick={ () => {
                        var event = Events.findOne();
                        var brackIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
                        browserHistory.push(`/event/${Events.findOne().slug}/bracket/${brackIndex}/match/${0}-${this.props.round}-${this.props.index}`)
                      }}>View</button>
                    </div>
                  ) : (
                    ""
                  )
                }
              </div>
            ):(
              <div className="col" style={{height: "100%"}}>
                <div className="self-end">
                  <FontAwesome className="pointerChange" name="times" onClick={() => { this.setState({open: false, chosen: 2}) }} />
                </div>
                <div className="row x-center">
                  <button onClick={(this.onUndoUserClick()).bind(this)} style={{marginRight: 20}}>Undo</button>
                  {
                    Events.findOne() ? (
                      <button onClick={ () => {
                        var event = Events.findOne();
                        var brackIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
                        browserHistory.push(`/event/${Events.findOne().slug}/bracket/${brackIndex}/match/${this.props.id}`)
                      }}>View</button>
                    ) : (
                      ""
                    )
                  }
                </div>
              </div>
            )
          }
        </Modal>
      )
    }
    return (
      <div></div>
    )
  }

  lineHeight() {
    var i = this.props.round;
    var j = this.props.index;

    // var matchComp = (50 * (Math.pow(2, i) - 1)) + (50 / 2);
    // var marginComp = (40 * (Math.pow(2, i) - 1)) + (40 / 2);
    var matchComp = (50 * (Math.pow(2, i - 1)));
    var marginComp = (40 * (Math.pow(2, i)));
    var totHeight = matchComp + marginComp;

    var height = totHeight;
    var top = totHeight / 2 + 10;
    if(j % 2 == 0) {
      top -= (7.5 * (Math.pow(2, i) + 1));
    }
    else {
      if(i == 1) {
        top += 2.5;
      }
      else if(i > 1) {
        top += (Math.pow(2, i - 1) + Math.pow(2, i - 2) - 1) * 10 + 2.5
      }
    }

    return { height, top }

  }

  render() {
    var [i, j, id] = [this.props.round, this.props.index, this.props.id];
    var match = Matches.findOne(id);

    var height = 35;
    var margin = 10;

    var lineHeight = 5;

    var blockHeight = height * 2 + margin * 2 + lineHeight;
    var blockMargin = 20;

    var vLineBase = blockHeight + blockMargin;
    var vLineHeight = Math.pow(2, i - 1) * vLineBase + lineHeight;

    var participantWidth = 200;

    if(!match) {
      return (
        <div style={{height: blockHeight, marginBottom: blockMargin}}>
        </div>
      );
    }

    var p1 = (match.players[0] || {});
    var p2 = (match.players[1] || {});

    var isLoser = (p) => {
      return match.winner && p.alias != match.winner.alias;
    }

    return (
      <div className="row x-center" style={{marginBottom: blockMargin}}>
        {
          match.players[0] == null && match.players[1] == null && i == 0 ? (
            <div style={{height: blockHeight}}>
            </div>
          ) : (
            [
              <div className="match" onClick={() => { this.setState({ open: true }) }}>
                <div className="participant" style={{height, marginBottom: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1}}>
                  <div className={((p1.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p1.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p1.score || 0 }
                  </div>
                </div>
                <div style={{width: participantWidth + 20, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
                </div>
                <div className="participant" style={{height, marginTop: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1}}>
                  <div className={((p2.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p2.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p2.score || 0 }
                  </div>
                </div>

              </div>,
              this.props.isLast ? (
                ""
              ) : (
                <div style={{
                  width: lineHeight,
                  height: vLineHeight,
                  backgroundColor: this.props.isFutureLoser ? "#999" : "white",
                  position: "relative",
                  zIndex: this.props.isFutureLoser ? 0 : 1,
                  top: ((vLineHeight / 2 - lineHeight / 2) * (j % 2 == 0 ? 1 : -1))
                }}>
                </div>
              )
            ]
          )
        }
        {
          this.matchModal(match)
        }
      </div>
    )
  }
}
