import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TicketCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ticketList: [],
      activeTicket: null
    }
  }

  isValid() {
    return true;
  }

  value(cb) {
    var instance = Instances.findOne();
    var price = 0;
    this.state.ticketList.map(ticket => {
      price += instance.tickets[ticket];
    });
    if(price == 0) {
      Meteor.call("events.issueTickets", instance._id, this.state.ticketList, (err) => {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        else {
          cb({
            tickets: this.state.ticketList
          });
        }
      });
    }
    else {
      cb({
        tickets: this.state.ticketList
      });
    }
  }

  ticketName(ticket) {
    var instance = Instances.findOne();
    var matches = ticket.match(/[0-9]+/);
    if(matches) {
      return "Entry to Bracket " + matches[0];
    }
    return ticket[0].toUpperCase() + ticket.slice(1);
  }

  setActiveTicket(ticket) {
    if(this.state.activeTicket == ticket) {
      this.state.activeTicket = null;
    }
    else {
      this.state.activeTicket = ticket;
    }
    this.forceUpdate();
  }

  toggleTicket() {
    var indexOfActiveTicket = this.state.ticketList.indexOf(this.state.activeTicket);
    if(indexOfActiveTicket < 0) {
      this.state.ticketList.push(this.state.activeTicket);
    }
    else {
      this.state.ticketList.splice(indexOfActiveTicket, 1);
    }
    this.forceUpdate();
  }

  ticketStatusColor(ticket) {
    var instance = Instances.findOne();
    if(instance.access) {
      var access = instance.access[Meteor.userId()];
      if(access && access.indexOf(ticket) > -1) {
        return "#0D0";
      }
    }
    if(this.state.ticketList.indexOf(ticket) >= 0){
      return "#DD0"
    }
    return "#D00";
  }

  ticketButton() {
    var instance = Instances.findOne();
    if(instance.tickets.ticketAccess) {
      var access = instance.ticketAccess[Meteor.userId()];
      if(access && access.indexOf(this.state.activeTicket) > -1) {
        return "";
      }
    }
    return (
      <button onClick={this.toggleTicket.bind(this)}>
        { this.state.ticketList.indexOf(this.state.activeTicket) >= 0 ? ("Remove") : ("Add") }
      </button>
    );
  }

  render() {
    var instance = Instances.findOne();
    return (
      <div className="col" style={{padding: 20, marginBottom: 20}}>
        <div className="row center" style={{marginBottom: 20}}>
          <h3>Tickets</h3>
        </div>
        <div className="row">
          <div className="submodule-section col-1">
            {
              Object.keys(instance.tickets || {}).map((ticket, i) => {
                return (
                  <div className={`sub-section-select row flex-pad x-center ${ticket == this.state.activeTicket ? "active" : ""}`} onClick={() => { this.setState({activeTicket: ticket}) }}>
                    <span>
                      {
                        this.ticketName(ticket)
                      }
                    </span>
                    <FontAwesome name="circle" style={{color: this.ticketStatusColor(ticket)}} />
                  </div>
                )
              })
            }
          </div>
          <div className="submodule-section col-2">
            {
              this.state.activeTicket ? (
                <div className="col">
                  <div className="row flex-pad">
                    <h3>
                      {
                        this.ticketName(this.state.activeTicket)
                      }
                    </h3>
                    <h5>{instance.tickets[this.state.activeTicket] == 0 ? "Free!" : "$" + (instance.tickets[this.state.activeTicket] / 100).toFixed(2)}</h5>
                  </div>
                  <p className="col-1">
                  </p>
                  <div className="row center">
                    {
                      this.ticketButton()
                    }
                  </div>
                </div>
              ) : (
                ""
              )
            }
          </div>
          <div className="submodule-section col-2">
            <div className="col">
              {
                this.state.ticketList.map((key, index) => {
                  var ticket = instance.tickets[key];
                  return (
                    <div className="row flex-pad x-center" style={{paddingBottom: 20, borderBottom: (index == this.state.ticketList.length - 1 ? "solid 2px white" : "none"), marginBottom: (index == this.state.ticketList.length - 1 ? 20 : 0)}}>
                      <h5>{ this.ticketName(key) }</h5>
                      <h5>{ ticket == 0 ? "Free!" : "$" + (ticket / 100).toFixed(2) }</h5>
                    </div>
                  )
                })
              }
              {
                this.state.ticketList.length > 0 ? (
                  <div className="row flex-pad x-center">
                    <h5>Total</h5>
                    <h5>
                      {
                        (() => {
                          var total = 0;
                          for(var i = 0; i < this.state.ticketList.length; i ++){
                            var ticket = this.state.ticketList[i];
                            total += instance.tickets[ticket];
                          }
                          return total == 0 ? "Free!" : "$" + (total / 100).toFixed(2);
                        })()
                      }
                    </h5>
                  </div>
                ) : (
                  ""
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
