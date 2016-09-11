import React, { Component } from "react";
import Modal from "react-modal";

import Games from "/imports/api/games/games.js";

export default class TicketSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: null,
      index: null
    };
  }

  onTypeClick(type, index) {
    this.setState({
      type,
      index
    });
  }

  render() {
    var event = Events.findOne();
    if(this.state.type != null) {
      if(this.state.type == "bracket"){
        var bracket = event.organize[this.state.index];
        return (
          <div className="col x-center">
            <img src={Games.findOne(bracket.game).bannerUrl} />
            <span>{ bracket.name }</span>
          </div>
        )
      }
      else {
        var ticket = event.revenue.ticketing[this.state.index];
        return (
          <div className="cf-ticket col">
            <div className="row flex-pad x-center">
              <span>{ ticket.name } - ${ ticket.amount / 100 }</span>
              <span className="cf-limit">
                {ticket.limit}
              </span>
            </div>
            <p className="cf-description">
              { ticket.description }
            </p>
          </div>
        )
      }
    }
    return (
      <div className="row">
        <div className="col col-2">
          <span style={{marginBottom: 10}}>Brackets</span>
          {
            event.organize ? (
              event.organize.map((bracket, i) => {
                return (
                  <div className="slide-bracket">
                    <img src={Games.findOne(bracket.game).bannerUrl} />
                    <span>{ bracket.name }</span>
                  </div>
                )
              })
            ) : (
              ""
            )
          }
        </div>
        <div className="col col-1 cf-tickets">
          <span style={{marginBottom: 10}}>Tickets</span>
          {
            event.revenue && event.revenue.ticketing ? (
              event.revenue.ticketing.map((ticket) => {
                return (
                  <div className="cf-ticket col">
                    <div className="row flex-pad x-center">
                      <span>{ ticket.name } - ${ ticket.amount / 100 }</span>
                      <span className="cf-limit">
                        {ticket.limit}
                      </span>
                    </div>
                    <p className="cf-description">
                      { ticket.description }
                    </p>
                  </div>
                )
              })
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }
}
