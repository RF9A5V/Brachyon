import React, { Component } from "react";

import MatchBlock from './match.jsx';
import EventModal from "../modal.jsx";
import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";

export default class DoubleElimWinnersBracket extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    this.state = {
      leagueOpen: event.league && bracket.complete && this.props.active
    };
  }

  componentWillReceiveProps(next) {
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    this.setState({
      leagueOpen: event.league && bracket.complete && next.active
    })
  }

  toggleModal(id, b, r, i) {
    this.setState({
      id,
      bracket: b,
      round: r,
      match: i,
      open: true
    });
  }

  finals(header) {
    return (
      <div className="row">
        {
          this.props.rounds[2].map((round, i) => {
            var finr = "finalround" + i
            return (
              <div className="col">
                { header[0] }
                <div className="col finalr" id={finr} style={{justifyContent: "space-around"}} key={i}>
                  {
                    round.map((match, j) => {
                      if(match.id) {
                        match = Matches.findOne(match.id);
                      }
                      if(!match || match.players[0] == null || match.players[1] == null) {
                        return "";
                      }
                      if (match.players[0].alias != null && match.players[1] != null)
                      {
                        var isFutureLoser = false;
                        // if(i < this.props.rounds[2].length - 1){
                        //   var nextMatch = this.props.rounds[2][i + 1][Math.floor(j / 2)];
                        //   var rNum = i + 1;
                        //   var mNum = Math.floor(j / 2);
                        //   while(++rNum < this.props.rounds[2].length && nextMatch.winner != null) {
                        //     if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                        //       isFutureLoser = true;
                        //       break;
                        //     }
                        //     mNum = Math.floor(mNum / 2);
                        //     nextMatch = this.props.rounds[2][rNum][mNum];
                        //   }
                        // }
                        return (
                          <MatchBlock key={i + " " + j} match={match} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}/>
                        );
                      }
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    )
  }

  mainBracket() {

    var headers = this.props.rounds[0].map((_, i) => {
      return (
        <h4 style={{marginBottom: 20}}>
          Round { i + 1 }
        </h4>
      )
    });
    if(this.props.format == "double_elim") {
      headers.push(
        <h4 style={{marginBottom: 20, minWidth: 220}}>
          Grand Finals
        </h4>
      )
    }

    return (
      <div className="col">
        <div className="row" style={{paddingLeft: 10}}>
          <div className="row">
          {
            this.props.rounds[0].map((round, i) => {
              return (
                <div className="col">
                  {headers[i]}
                  <div className="col col-1" style={{justifyContent: "space-around"}} key={i}>
                    {
                      round.map((match, j) => {
                        var isFutureLoser = false;
                        if(match && match.id) {
                          match = Matches.findOne(match.id);
                        }
                        if(match && match.id && match.players[0] != null && match.players[1] != null && i < this.props.rounds[0].length - 1){
                          var nextMatch = this.props.rounds[0][i + 1][Math.floor(j / 2)];
                          nextMatch = Matches.findOne(nextMatch.id);
                          var rNum = i + 1;
                          var mNum = Math.floor(j / 2);
                          while(++rNum < this.props.rounds[0].length && nextMatch.winner != null) {
                            if(nextMatch.winner.alias != match.players[0].alias && nextMatch.winner.alias != match.players[1].alias) {
                              isFutureLoser = true;
                              break;
                            }
                            mNum = Math.floor(mNum / 2);
                            nextMatch = this.props.rounds[0][rNum][mNum];
                            nextMatch = Matches.findOne(nextMatch.id);
                          }
                        }
                        return (
                          <MatchBlock key={i + " " + j} match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} />
                        );
                      })
                    }
                  </div>
                </div>
              );
            })
          }
          </div>
          {
            this.props.format == "double_elim" ? (
              this.finals(headers.slice(this.props.rounds[0].length))
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }

  render() {
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    return (
      <div style={{overflowX: "auto"}}>
        { this.mainBracket() }
        {
          this.props.id && !this.props.complete ? (
            <EventModal
              id={this.state.id}
              bracket={this.state.bracket}
              round={this.state.round}
              match={this.state.match}
              open={this.state.open}
              closeModal={() => { this.setState({open: false}) }}
              update={this.forceUpdate.bind(this)}
              format={this.props.format}
            />
          ) : (
            ""
          )
        }
        {
          event.league ? (
            <LeagueModal open={this.state.leagueOpen} close={() => { this.setState({ leagueOpen: false }) }} id={event._id} />
          ) : (
            ""
          )
        }
        {
          event.league && bracket.complete ? (
            <button style={{marginLeft: 10}} onClick={() => { this.setState({ leagueOpen: true }) }}>Close Bracket</button>
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
