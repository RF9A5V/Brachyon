import React, { Component } from "react";

export default class UserMatches extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sub: Meteor.subscribe("brackets", props.id, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false
    }
  }

  componentWillUnmount() {
    this.state.sub.stop();
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  unrunMatches() {
    var bracket = Brackets.findOne();
    var matches = [];
    bracket.rounds.forEach((b, i) => {
      b.forEach((r, j) => {
        r.forEach(m => {
          if(m) {
            var match = Matches.findOne(m.id);
            if(match.players[0] && match.players[1] && !match.winner) {
              matches.push({
                id: m.id,
                bracket: i,
                round: j
              })
            }
          }
        })
      })
    })
    return matches;
  }

  render() {
    var matches = this.unrunMatches();
    var bracket = Brackets.findOne();
    if(matches.length == 0) {
      return (
        <div>
          This bracket has finished!
        </div>
      )
    }
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          matches.map(m => {
            var match = Matches.findOne(m.id);
            return (
              <div className="col" style={{margin: "20px 10px 20px 0", width: 400}}>
                <div className="row match-names">
                  <span>{ match.players[0].alias }</span>
                </div>
                <div className="row flex-pad x-center" style={{backgroundColor: "#666", position: "relative"}}>
                  <div className="row match-names" style={{top: 0}}>
                    <span>
                      { match.players[0].alias }
                    </span>
                  </div>
                  <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: 100, height: 100}} />
                  <div className="col-1 col x-center" style={{padding: 10}}>
                    <h5 style={{margin: "10px 0"}}>VERSUS</h5>
                  </div>
                  <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: 100, height: 100}} />
                  <div className="row match-names justify-end" style={{bottom: 0}}>
                    <span>
                      { match.players[1].alias }
                    </span>
                  </div>
                </div>

                <span style={{marginTop: 20, padding: 5, textAlign: "center", backgroundColor: "#111"}}>{(() => {
                  switch(m.bracket) {
                    case 0: return "Winner's Bracket";
                    case 1: return "Loser's Bracket";
                    default: return "Grand Finals";
                  }
                })()}, {(() => {
                  var roundNum = (m.bracket == 1 && bracket.rounds[1][0].filter((ma) => { return ma != null }).length == 0 ? m.round : (m.round + 1));
                  switch(bracket.rounds[m.bracket].length - roundNum) {
                    case 2: return "Quarter Finals";
                    case 1: return "Semi Finals";
                    case 0: return "Finals";
                    default: return "Round " + roundNum;
                  }
                })()}</span>
              </div>
            )
          })
        }
      </div>
    )
  }
}
