import React, { Component } from "react";
import DragScroll from "react-dragscroll";
import { Element } from "react-scroll"

import MatchBlock from './match.jsx';
import EventModal from "../modal.jsx";
import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DoubleElimWinnersBracket extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var bracket = Brackets.findOne();
    this.state = {
      leagueOpen: event && event.league && bracket && bracket.complete && this.props.active,
      dragging: false,
      headerTop: 0
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
        matchMap[advId].source.push({
          id,
          lost: false
        })
      }
      else {
        matchMap[advId] = {
          source: [{
            id,
            lost: false
          }]
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
    const bObj = Brackets.findOne();
    if(bracket.rounds[2] && bObj) {
      const loserCount = bracket.rounds[1].reduce((acc, r) => {
        return acc + r.filter(m => { return m != null }).length;
      }, -1);
      const loserFinal = bracket.rounds[1][bracket.rounds[1].length - 1][0].id;
      matchMap[loserFinal] = {
        number: count + loserCount
      }
      bracket.rounds[2].forEach((finals, index) => {
        // If double elim, final match will always exist
        const m = finals[0];
        if(!m) {
          return;
        }
        const mId = finals[0].id;
        matchMap[mId] = {
          number: count + loserCount + index + 1
        }
        if(index == 0) {
          const winSource = bracket.rounds[0][bracket.rounds[0].length - 1][0].id;
          const loseSource = bracket.rounds[1][bracket.rounds[1].length - 1][0].id;
          matchMap[mId].source = [
            {
              id: winSource,
              lost: false
            },
            {
              id: loseSource,
              lost: false
            }
          ]
        }
        else {
          const prevMatch = bracket.rounds[2][index - 1][0].id;
          matchMap[mId].source = [
            {
              id: prevMatch,
              lost: false
            },
            {
              id: prevMatch,
              lost: true
            }
          ]
        }
      })
    }
    this.state.matchMap = matchMap;
  }

  swapParticipant(dragIndex, hoverIndex) {
    Meteor.call("participants.swapPlayers", Instances.findOne()._id, this.props.index, dragIndex, hoverIndex);
    this.props.update();
  }

  onDrag(e) {
    if(this.refs.headers && this.refs.dragger) {
      // this.refs.headers.scrollLeft = this.refs.dragger.refs.container.scrollLeft;
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

  onParticipantHover(alias) {
    if(this.props.setLocalValue) {
      this.props.setLocalValue("activeAlias", alias);
    }
    else {
      this.setState({
        activeAlias: alias
      });
    }
  }

  getActiveAlias() {
    return this.props.localValues ? this.props.localValues.activeAlias : this.state.activeAlias;
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
                        var temp = Matches.findOne(match.id);
                        match = temp || match;
                      }
                      if(match.players.every(p => {
                        return p == null
                      })) {
                        return null
                      }
                      return (
                        <MatchBlock
                          key={i + " " + j} match={match} bracket={2} roundNumber={i} matchNumber={j}
                          roundSize={this.props.rounds[2].length} update={this.props.update}
                          onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} matchMap={this.state.matchMap} partMap={this.props.partMap}
                          onParticipantHover={this.onParticipantHover.bind(this)} activeAlias={this.getActiveAlias()}
                        />
                      );
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
    this.setMatchMap(this.props.rounds);
    var count = 1;
    return (
        <div className="col">
          <div className="row">
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
                          // TODO: Not pass like a billion params to the match object
                          return (
                            <MatchBlock key={i + " " + j}
                              match={match}
                              bracket={0}
                              roundNumber={i} matchNumber={j}
                              roundSize={this.props.rounds[0].length}
                              update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}
                              numDecorator={count++} matchMap={this.state.matchMap} partMap={this.props.partMap}
                              swapParticipant={this.swapParticipant.bind(this)}
                              onParticipantHover={this.onParticipantHover.bind(this)}
                              activeAlias={this.getActiveAlias()}
                            />
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

    const bracket = Brackets.findOne();

    var headers = this.props.rounds[0].map((r, i) => {
      const matchCount = r.filter(m => {
        return m != null;
      }).length;
      var text;
      if(i == 0) {
        text = "Top " + Object.keys(this.props.partMap).length;
      }
      else if(matchCount == 1) {
        text = "Finals";
      }
      else if(matchCount <= 2) {
        text = "Semi-Finals";
      }
      else if(matchCount <= 4) {
        text = "Quarter-Finals";
      }
      else {
        text = "Top " + (matchCount * 2)
      }
      return (
        <h4 style={{width: opts.headerWidth + (i == 0 ? 0 : opts.headerSpacing), display: "inline-block", fontSize: opts.fontSize}}>
          { text }
        </h4>
      )
    });
    if(this.props.format == "double_elim") {
      this.props.rounds[2].forEach(r => {
        const m = r[0];
        if(m && m.id) {
          const match = Matches.findOne(m.id);
          if(!match) {
            return null;
          }
          if(match.players.some(p => { return p != null })) {
            headers.push(
              <h4 style={{minWidth: opts.headerWidth + opts.headerSpacing, display: "inline-block", fontSize: opts.fontSize}}>
                Grand Finals
              </h4>
            )
          }
        }
      })
    }
    const width = opts.headerWidth + ((opts.headerWidth + opts.headerSpacing) * (headers.length - 1));
    let draggableDiv, draggable;
    if (bracket || this.props.useDrag) {
      draggableDiv = (
        <DragScroll width={"100%"} height="100%" ref="dragger" onDrag={(dx, dy) => {
          const el = document.getElementById("winner-header");
          el.scrollLeft -= dx;
          if(this.props.full) {
            window.scrollBy(0, -dy);
          }
        }}>
          <div style={{paddingTop: 40, paddingBottom: this.props.addPadding ? 120 : 0}} ref="content">
            { this.mainBracket(opts) }
          </div>
        </DragScroll>
      )
      draggable = this.state.dragging ? "grabbing" : "grab"
    }
    else {
      draggableDiv = (
        this.mainBracket()
      )
      draggable = "";
    }

    let bracketDiv = opts.mobile ? (
      <div className={this.state.dragging ? "grabbing" : "grab"} style={{position: "relative", paddingTop: 60, height: opts.dragHeight, width: "100%",  overflow: "auto"}} onScroll={(e) => {
        const node = document.getElementById("winner-header");
        this.setState({
          headerTop: e.target.scrollTop
        })
      }} onWheel={(e) => {
        const node = document.getElementById("winner-header");
        this.setState({
          headerTop: e.target.scrollTop
        })
      }}>
        <div style={{width}}>
          <div style={{
            backgroundColor: "#222",
            position: "absolute",
            zIndex: 1, top: this.state.headerTop, left: 0,
            width,
            whiteSpace: "nowrap",
            maxWidth: "100%"
          }} id="winner-header">
            { headers }
          </div>
          { this.mainBracket(opts) }
        </div>
      </div>
    ) : (
      <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: (this.props.height || bracket) && !this.props.full ? opts.dragHeight : "", position: "relative", marginBottom: 20, paddingTop: 40}}>
        <div style={{
          backgroundColor: "#222",
          position: "absolute",
          zIndex: 1, top: 0, left: 0,
          width,
          whiteSpace: "nowrap",
          maxWidth: "100%"
        }} id="winner-header">
          { headers }
        </div>
        { draggableDiv }
      </div>
    );


    return (
      <Element name="winners" onWheel={(e) => {
        e.stopPropagation();
      }}>
        { bracketDiv }
        {
          this.props.id && !this.props.complete ? (
            <EventModal
              id={this.state.id}
              bracket={this.state.bracket}
              round={this.state.round}
              match={this.state.match}
              open={this.state.open}
              closeModal={() => { this.setState({open: false}) }}
              update={this.props.update}
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
      </Element>
    );
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      dragHeight: "calc(100vh - 252px)",
      headerWidth: 420,
      headerSpacing: 60,
      fontSize: "3em",
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      dragHeight: "calc(97vh - 150px)",
      headerWidth: 245,
      headerSpacing: 20,
      fontSize: "1em",
      mobile: false
    });
  }

}
