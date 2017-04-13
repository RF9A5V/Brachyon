import React, { Component } from "react";

import MatchBlock from './match.jsx';
import EventModal from "../modal.jsx";
import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";

import DragScroll from "react-dragscroll"
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class DoubleElimWinnersBracket extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    this.state = {
      leagueOpen: event && event.league && bracket && bracket.complete && this.props.active,
      dragging: false
    };
  }

  switchMatch(dragIndex, hoverIndex) {
    const dragRound = this.state.rounds[0][0][dragIndex];
    let rounds = this.state.rounds;
    rounds[0][0][dragIndex] = rounds[0][0][hoverIndex];
    rounds[0][0][hoverIndex] = dragRound;
    this.setState({rounds});
  }

  onDrag(e) {
    if(this.refs.headers && this.refs.dragger) {
      this.refs.headers.scrollLeft = this.refs.dragger.refs.container.scrollLeft;
      const isDragging = this.refs.dragger.state.dragging;
      if(this.state.dragging != isDragging) {
        this.setState({
          dragging: isDragging
        })
      }
    }
  }

  componentDidMount() {
    const func = this.onDrag.bind(this);
    window.addEventListener("mouseup", func);
    window.addEventListener("mousemove", func);
    this.state.func = func;
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.state.func);
    window.removeEventListener("mousemove", this.state.func);
  }

  componentWillReceiveProps(next) {
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    this.setState({
      leagueOpen: event && event.league && bracket && bracket.complete && next.active
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

  finals() {
    return (
      <div className="row">
        {
          this.props.rounds[2].map((round, i) => {
            var finr = "finalround" + i
            return (
              <div className="col">
                <div className="col col-1 finalr" id={finr} style={{justifyContent: "space-around"}} key={i}>
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
                        return (
                          <MatchBlock key={i + " " + j} match={match} swapMatch={this.swapMatch.bind(this)} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}/>
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
    return (
        <div className="col">
          <div className="row" style={{paddingLeft: 10}}>
            <div className="row">
            {
              this.props.rounds[0].map((round, i) => {
                return (
                  <div className="col">
                    <div className="col col-1" style={{justifyContent: "space-around"}} key={i}>
                      {
                        round.map((match, j) => {
                          if(match && match.id) {
                            match = Matches.findOne(match.id);
                          }
                          return (
                            <MatchBlock key={i + " " + j} match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} />
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
              this.props.rounds[2] ? (
                this.finals()
              ) : (
                null
              )
            }
          </div>
        </div>
    )
  }

  render() {
    var event = Events.findOne();
    var bracket = Brackets.findOne();

    var headers = this.props.rounds[0].map((_, i) => {
      return (
        <h4 style={{width: i == 0 ? 225 : 245, display: "inline-block"}}>
          Round { i + 1 }
        </h4>
      )
    });
    if(this.props.format == "double_elim") {
      headers.push(
        <h4 style={{minWidth: 220, display: "inline-block"}}>
          Grand Finals
        </h4>
      )
    }

    return (
      <div onWheel={(e) => {
        e.stopPropagation();
      }}>
        <div style={{whiteSpace: "nowrap", overflowX: "hidden", margin: -20, marginBottom: 10, backgroundColor: "#222", width: "calc(100% + 40px)"}} ref="headers">
          { headers }
        </div>
        {
          this.props.page == "admin" ? (
            <div style={{height: "calc(97vh - 300px)", margin: -20, marginTop: 0}}>
              { this.mainBracket() }
            </div>
          ) : (
            <div style={{height: "calc(97vh - 300px)"}}>
              { this.mainBracket() }
            </div>
          )
        }
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
          event && Meteor.userId() == event.owner && bracket && bracket.complete && event.league && !event.isComplete ? (
            <LeagueModal open={this.state.leagueOpen} close={() => { this.setState({ leagueOpen: false }) }} id={event._id} />
          ) : (
            ""
          )
        }
        {
          event && Meteor.userId() == event.owner && event.league && bracket && bracket.complete && !event.isComplete ? (
            <button style={{marginLeft: 10}} onClick={() => { this.setState({ leagueOpen: true }) }}>Close Bracket</button>
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
export default DragDropContext(HTML5Backend)(DoubleElimWinnersBracket)
