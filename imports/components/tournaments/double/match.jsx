import React, { Component } from 'react'
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

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

  onMatchUserClick(index) {
    return (e) => {
      e.preventDefault();
      if (index != 2)
      {
        Meteor.call("events.advance_match", this.props.id, this.props.bracket, this.props.roundNumber, this.props.matchNumber, index, function(err) {
          if(err){
            console.log(err);
            toastr.error("Couldn't advance this match.", "Error!");
          }
          else {
            toastr.success("Player advanced to next round!", "Success!");
          }
        })
        this.closeModal();
      }
    }
  }

  onUndoUserClick()
  {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.undo_match", this.props.id, this.props.bracket, this.props.roundNumber, this.props.matchNumber, function(err) {
        if(err){
          toastr.error("Couldn't undo this match.", "Error!");
        }
        else {
          toastr.success("Match has been undone!", "Success!");
        }
      })
      this.closeModal();
    }
  }

  getUsername(id) {
    // return Meteor.users.findOne(id).username;
    return id;
  }

  onMatchUpdateScore(isPlayerOne, value) {
    Meteor.call("events.brackets.updateMatchScore", this.props.id, this.props.bracket, this.props.roundNumber, this.props.matchNumber, isPlayerOne, value, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
    })
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
    if(user && user.profile.image) {
      return ProfileImages.findOne(user.profile.image).link();
    }
    return "/images/profile.png";
  }

  render() {
    var [i, j, match] = [this.props.roundNumber, this.props.matchNumber, this.props.match];
    var k = this.props.bracket ? Math.floor(i/2):i;
    return (
      <div className="match-block col center spacing" style={{height: 50 * Math.pow(2, k)}}>
        <div className="match-highlight">
          {
            match.playerOne == match.playerTwo && i == 0 && this.props.bracket == 0 || this.props.bracket == 1 && (i == 0 || i == 1) && match.truebye == null ? (
              ""
            ) : (
              [match.playerOne, match.playerTwo].map((p, index) => {

                var isLoser = match.winner != null && match.winner != p;

                return (
                  <div className={match.winner == null && match.playerOne != null && match.playerTwo != null ? ("match-participant match-active"):("match-participant")} onClick={
                    match.playerOne != null && match.playerTwo != null ? (
                      () => {if(Meteor.user()){this.setState({open: true});} }
                    ) : (
                      () => {}
                    )
                  } style={{borderColor: this.props.isFutureLoser ? ("#999") : ("white")}}>
                    <span style={{color: isLoser || this.props.isFutureLoser ? "#999" : "white"}}>
                      <div className={p==null? (""): (this.getUsername(p).length<19?(""):("marquee"))} ref="matchOne">
                        {
                          p == null ? (
                            "TBD"
                          ) : (
                            this.getUsername(p)
                          )
                        }
                      </div>
                    </span>
                  </div>
                )
              })
            )
          }
        </div>
        {
          i == this.props.roundSize - 1 || match.playerOne == match.playerTwo && i == 0 || this.props.bracket == 1 && (i%2 == 0 || (i < 2 && match.truebye == null)) || this.props.bracket == 2 ? (
            ""
          ) : (
            j % 2 == 0 ? (
              this.props.bracket==0 ?
                (<div className="bracket-line-v" style={{height: (50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)))+(Math.pow(2,this.props.roundNumber)*20), top: (50 * Math.pow(2, k - 1) - 2.5), left: 164.5 , backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>):
                (<div className="bracket-line-v" style={{height: (50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)))+(Math.pow(2,this.props.roundNumber-1)*20), top: (50 * Math.pow(2, k - 1) - 2.5), left: 164.5 , backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>)
              )
             : (
              this.props.bracket ==0 ?
                (<div className="bracket-line-v" style={{height: (50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)))+(Math.pow(2,this.props.roundNumber)*20)-5, bottom: (50 * Math.pow(2, k - 1) - 2.5)+5 , left: 164.5 ,backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>):
                (<div className="bracket-line-v" style={{height: (50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)))+(Math.pow(2,this.props.roundNumber-1)*20)-5, bottom: (50 * Math.pow(2, k - 1) - 2.5)+5 , left: 164.5 ,backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>)
            )
          )
        }
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
                    <img src={this.getProfileImage(match.playerOne)} style={{borderRadius: "100%", width: 100, height: "auto", marginBottom: 20}} />
                    <h5 className={this.getUsername(match.playerOne)==null?(""):
                      (this.getUsername(match.playerOne).length<15)?(""):("marquee")} 
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ this.getUsername(match.playerOne) }
                    </h5>
                    <div className="col center x-center col-1">
                      <FontAwesome className ="pointerChange" style={{fontSize: 58}} name="caret-up" onClick={() => {this.onMatchUpdateScore(true, 1)}} />
                      <div className="row center x-center" style={{fontSize: 24, padding: 10, backgroundColor: "#333"}}>
                        { match.scoreOne }
                      </div>
                      <FontAwesome className ="pointerChange" style={{fontSize: 58}} name="caret-down" onClick={() => {this.onMatchUpdateScore(true, -1)}} />
                    </div>
                    {
                      match.scoreOne > match.scoreTwo ? (
                        <button onClick={this.onMatchUserClick(0)}>Declare Winner</button>
                      ) : (
                        <button style={{opacity: 0.3}}>Declare Winner</button>
                      )
                    }

                  </div>
                  <div className="col x-center col-1">
                    <img src={this.getProfileImage(match.playerTwo)} style={{borderRadius: "100%", width: 100, height: "auto", marginBottom: 20}} />
                    <h5 className={this.getUsername(match.playerTwo)==null?(""):
                      (this.getUsername(match.playerTwo).length<15)?(""):("marquee")} 
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ this.getUsername(match.playerTwo) }
                    </h5>
                    <div className="col center x-center col-1">
                      <FontAwesome className ="pointerChange" style={{fontSize: 58}} name="caret-up" onClick={() => {this.onMatchUpdateScore(false, 1)}} />
                      <div className="row center x-center" style={{fontSize: 24, padding: 10, backgroundColor: "#333"}}>
                        { match.scoreTwo }
                      </div>
                      <FontAwesome className ="pointerChange" style={{fontSize: 58}} name="caret-down" onClick={() => {this.onMatchUpdateScore(false, -1)}} />
                    </div>
                    {
                      match.scoreTwo > match.scoreOne ? (
                        <button onClick={this.onMatchUserClick(1)}>Declare Winner</button>
                      ) : (
                        <button style={{opacity: 0.3}}>Declare Winner</button>
                      )
                    }
                  </div>
                </div>
              </div>
            ):(
              <div className="col" style={{height: "100%"}}>
                <div className="self-end">
                  <FontAwesome className ="pointerChange" name="times" onClick={() => { this.setState({open: false, chosen: 2}) }} />
                </div>
                <button onClick={(this.onUndoUserClick()).bind(this)}>Undo</button>
              </div>
            )
          }
        </Modal>
      </div>
    )
  }
}
