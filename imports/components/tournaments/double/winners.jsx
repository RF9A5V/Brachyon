import React, { Component } from "react";
import DragScroll from "react-dragscroll";

import MatchBlock from './match.jsx';
import EventModal from "../modal.jsx";
import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DoubleElimWinnersBracket extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var event = Events.findOne();

    this.state = {
      leagueOpen: event && event.league && bracket && bracket.complete && this.props.active,
      dragging: false
    };
  }

  setMatchMap(rounds) {
    var bracket = {
      rounds
    };
    var matchMap = {};
    var count = 1;
    const setSource = (i, j, id) => {
      const obj = bracket.rounds[0][i + 1][parseInt(j / 2)];
      const advId = obj.id;
      if(matchMap[advId]) {
        matchMap[advId].source.push(id)
      }
      else {
        matchMap[advId] = {
          source: [id]
        }
      }
    }
    bracket.rounds[0].forEach((r, i) => {
      r.forEach((m, j) => {
        if(m) {
          const id = m.id;
          if(matchMap[id]) {
            matchMap[id].number = count ++;
          }
          else {
            matchMap[id] = {
              number: count++
            };
          }
          if(i < bracket.rounds[0].length - 1) {
            setSource(i, j, id)
          }
        }
        else {
          setSource(i, j, null)
        }
      })
    });
    this.setState({
      matchMap
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.setMatchMap(this.props.rounds);
  }

  componentWillReceiveProps(next) {
    this.setMatchMap(next.rounds);
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
                      if(match && match.id) {
                        match = Matches.findOne(match.id);
                      }
                      if(!match || match.players[0] == null || match.players[1] == null) {
                        return "";
                      }
                      if (match.players[0].alias != null && match.players[1] != null)
                      {
                        return (
                          <MatchBlock
                            key={i + " " + j} match={match} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length} update={this.props.update}
                            onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} matchMap={this.state.matchMap} partMap={this.props.partMap}/>
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

  mainBracket(opts) {
    var count = 1;
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
                            match = Matches.findOne(match.id) || match;
                          }
                          // Jesus these params
                          return (
                            <MatchBlock key={i + " " + j}
                              match={match}
                              bracket={0}
                              roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} numDecorator={count++} matchMap={this.state.matchMap} partMap={this.props.partMap} />
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

  renderBase(opts) {
    var event = Events.findOne();
    var bracket = Brackets.findOne();

    var headers = this.props.rounds[0].map((_, i) => {
      return (
        <h4 style={{width: opts.headerWidth, display: "inline-block", fontSize: opts.fontSize}}>
          Round { i + 1 }
        </h4>
      )
    });
    if(this.props.format == "double_elim") {
      headers.push(
        <h4 style={{minWidth: opts.headerWidth, display: "inline-block", fontSize: opts.fontSize}}>
          Grand Finals
        </h4>
      )
    }

    return (
      <div onWheel={(e) => {
        e.stopPropagation();
      }}>
        {
          opts.mobile ? (
            <div style={{overflow: "auto", height: "calc(100vh - 202px)"}}>
              <div style={{whiteSpace: "nowrap", marginBottom: 20, backgroundColor: "#222"}} ref="headers">
                { headers }
              </div>
              { this.mainBracket(opts) }
            </div>
          ) : (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: opts.dragHeight}}>
              <DragScroll width={"100%"} height={"100%"} ref="dragger">
                <div style={{whiteSpace: "nowrap", marginBottom: 20, backgroundColor: "#222", display: "inline-block"}} ref="headers">
                  { headers }
                </div>
                { this.mainBracket(opts) }
              </DragScroll>
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

  renderMobile() {
    return this.renderBase({
      dragHeight: "calc(100vh - 202px)",
      headerWidth: "460px",
      fontSize: "3em",
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      dragHeight: "calc(97vh - 300px)",
      headerWidth: "255px",
      fontSize: "1em",
      mobile: false
    });
  }

}
