import React, { Component } from 'react'
import MatchBlock from './match.jsx';
import LeagueModal from "../public_comps/league_modal.jsx";

export default class SingleDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentDidMount() {
    var finalMatch = this.props.rounds[0][this.props.rounds[0].length - 1][0];
    if(finalMatch.winner) {
      this.setState({ open: true });
    }
  }

  componentWillReceiveProps(props) {
    var finalMatch = props.rounds[0][props.rounds[0].length - 1][0];
    if(finalMatch.winner) {
      this.setState({ open: true });
    }
  }

  render() {
    return (
      <div className="col">
        <div className="row">
          {
            Array(this.props.rounds[0].length).fill("").map((_, i) => {
              if(i == this.props.rounds[0].length-1)
              {
                return (
                  <div className="round-spacing" style={{width: 150, textAlign: "center"}}>
                    Grand Finals
                  </div>
                )
              }
              else{
                return (
                  <div className="round-spacing" style={{width: 150, textAlign: "center"}}>
                    Round { i + 1 }
                  </div>
                )
              }
            })
          }
        </div>
        <div className="row">
          {
            this.props.rounds[0].map((round, i) => {
              return (
                <div className="col" style={{justifyContent: "space-around"}}>
                  {
                    round.map((match, j) => {
                      var isFutureLoser = false;
                      if(i < this.props.rounds[0].length - 1){
                        var rNum = i + 1;
                        var nextMatch = this.props.rounds[0][rNum][Math.floor(j / 2)];
                        var mNum = Math.floor(j / 2);
                        while(rNum < this.props.rounds[0].length && nextMatch.winner != null) {
                          if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                            isFutureLoser = true;
                            break;
                          }
                          mNum = Math.floor(mNum / 2);
                          rNum += 1;
                          if(rNum == this.props.rounds[0].length) {
                            break;
                          }
                          nextMatch = this.props.rounds[0][rNum][mNum];
                        }
                      }
                      return (<div className="bracket-match-spacing">
                        <MatchBlock match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length} id={this.props.id} isFutureLoser={isFutureLoser} />

                      </div>);
                    })
                  }
                </div>
              );
            })
          }
        </div>
        {
          Events.findOne().league ? (
            <LeagueModal open={this.state.open} close={() => { this.setState({open: false}) }} />
          ) : (
            ""
          )
        }
      </div>
    )

  }
}
