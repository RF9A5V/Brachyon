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
    return function(e) {
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
          console.log(err);
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

  render() {
    var [i, j, match] = [this.props.roundNumber, this.props.matchNumber, this.props.match];
    var k = this.props.bracket ? Math.floor(i/2):i;
    return (
      <div className="match-block col center" style={{height: 50 * Math.pow(2, k)}}>
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
                    {
                      p == null ? (
                        "TBD"
                      ) : (
                        this.getUsername(p)
                      )
                    }
                  </span>
                </div>
              )
            })
          )
        }
        {
          i == this.props.roundSize - 1 || match.playerOne == match.playerTwo && i == 0 || this.props.bracket == 1 && (i%2 == 0 || (i < 2 && match.truebye == null)) || this.props.bracket == 2 ? (
            ""
          ) : (
            j % 2 == 0 ? (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)), top: 50 * Math.pow(2, k - 1) - 2.5, backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>
            ) : (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)), bottom: 50 * Math.pow(2, k - 1) - 2.5, backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>
            )
          )
        }
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
          {
            match.winner == null ?
            (
              <div className="col" style={{height: "100%"}}>
                <div className="self-end">
                  <FontAwesome name="times" onClick={() => { this.setState({open: false, chosen: 2}) }} />
                </div>
                <h3 className="col-1 center">Choose the Winner</h3>
                <div className="row flex-padaround col-1">
                  <div className={ this.state.chosen == 0 ? ("participant-active"):("participant-inactive")} onClick={() => { this.setState({chosen: 0}) }}>
                  {
                    (this.getUsername(match.playerOne))
                  }
                  </div>
                  <div className={ this.state.chosen == 1 ? ("participant-active"):("participant-inactive")} onClick={() => { this.setState({chosen: 1}) }}>
                  {
                    (this.getUsername(match.playerTwo))
                  }
                  </div>
                </div>
                <button onClick={this.state.chosen < 2 ? (this.onMatchUserClick(this.state.chosen).bind(this)) : (() => {})}>Send Winner</button>
              </div>
            ):(
              <div className="col" style={{height: "100%"}}>
                <div className="self-end">
                  <FontAwesome name="times" onClick={() => { this.setState({open: false, chosen: 2}) }} />
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
