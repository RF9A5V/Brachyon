import React, { Component } from 'react'

export default class MatchBlock extends Component {

  onMatchUserClick(index) {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.advance_match", this.props.id, this.props.roundNumber, this.props.matchNumber, index, function(err) {
        if(err){
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          toastr.success("Player advanced to next round!", "Success!");
        }
      })
    }
  }

  render() {
    var [i, j, match] = [this.props.roundNumber, this.props.matchNumber, this.props.match];
    return (
      <div className="match-block col center" style={{height: 50 * Math.pow(2, i)}}>
        {
          match.playerOne == match.playerTwo && i == 0 ? (
            ""
          ) : (
            [match.playerOne, match.playerTwo].map((p, index) => {

              var isLoser = match.winner != null && match.winner != p;

              return (
                <div className="match-participant" onClick={
                  match.winner == null ? (
                    this.onMatchUserClick(index).bind(this)
                  ) : (
                    () => {}
                  )
                }>
                  <span style={{color: isLoser ? "#999" : "white"}}>
                    {
                      p == null ? (
                        "TBD"
                      ) : (
                        p
                      )
                    }
                  </span>
                </div>
              )
            })
          )
        }
        {
          i == this.props.roundSize - 1 || match.playerOne == match.playerTwo && i == 0 ? (
            ""
          ) : (
            j % 2 == 0 ? (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, i) - (5 * i), top: 50 * Math.pow(2, i - 1) - 2.5}}></div>
            ) : (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, i) - (5 * i), bottom: 50 * Math.pow(2, i - 1) - 2.5}}></div>
            )
          )
        }
      </div>
    )
  }
}
