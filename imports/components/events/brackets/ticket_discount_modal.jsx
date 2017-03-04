import React, { Component } from "react";
import Modal from "react-modal";

export default class TicketDiscountModal extends Component {

  activateDiscount(index) {
    const instance = Instances.findOne();

    Meteor.call("tickets.activateDiscount", instance._id, this.props.index, index, this.props.participant.id, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
    })
  }

  onCheckIn() {
    this.props.onCheckIn(this.props.participant);
    this.props.onClose();
  }

  render() {

    const instance = Instances.findOne();
    const ticketObj = instance.tickets[this.props.index];

    var user;
    if(this.props.participants) {
      user = Meteor.users.findOne(this.props.participant.id);
    }

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        {
          this.props.participant ? (
            <div>
              <div className="row center x-center" style={{marginBottom: 20}}>
                <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: 75, height: 75, borderRadius: "100%"}} />
                <b style={{marginLeft: 20, fontSize: 20}}>
                  { this.props.participant.alias }
                </b>
              </div>
              <div className="row center">
                <label>Discounts Applicable</label>
              </div>
              {
                ticketObj.discounts.map((d, i) => {
                  return (
                    <div className="row x-center center" style={{marginBottom: 10}}>
                      <span className="col-1" style={{marginRight: 20}}>{ d.name }</span>
                      <div className="col-1">
                        {
                          d.qualifiers[this.props.participant.id] ? (
                            <span>Discount Applied!</span>
                          ) : (
                            <button onClick={() => { this.activateDiscount(i) }}>Apply Discount</button>
                          )
                        }
                      </div>
                    </div>
                  )
                })
              }
              <div className="row center">
                <button style={{marginRight: 10}} onClick={this.onCheckIn.bind(this)}>Check In</button>
                <button onClick={this.props.onClose}>Cancel</button>
              </div>
            </div>
          ) : (
            <span>Discounts go here!</span>
          )
        }

      </Modal>
    )
  }
}
