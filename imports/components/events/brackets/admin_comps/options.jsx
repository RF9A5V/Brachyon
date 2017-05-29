import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class OptionsModal extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      tab: "Alias",
      amount: 0
    }
  }

  componentWillReceiveProps(next) {
    if(next.participant && next.participant.paymentAmount) {
      this.setState({
        amount: next.participant.paymentAmount
      })
    }
  }

  tabs(opts) {
    const instance = Instances.findOne();
    var tabs = [
      "Alias",
      "Remove",
      "Payment"
    ];

    return (
      <div className="row">
        {
          tabs.map((t) => {
            return (
              <div style={{padding: 5, borderBottom: this.state.tab == t ? "solid 2px #FF6000" : "solid 2px transparent", cursor: "pointer", fontSize: opts.fontSize}} onClick={() => { this.setState({ tab: t }) }}>
                { t }
              </div>
            )
          })
        }
      </div>
    )
  }

  aliasTab(opts) {

    const setAlias = () => {
      const value = this.refs.alias.value;
      if(value.length == 0) {
        return toastr.error("You must provide an alias.");
      }
      Meteor.call("events.brackets.setAlias", Instances.findOne()._id, this.props.index, this.props.participant.alias, value, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully set user alias for this bracket!");
        }
      })
    }

    return (
      <div className="col">
        <label className="input-label" style={{fontSize: opts.fontSize}}>Alias</label>
        <input className={opts.inputClass} type="text" defaultValue={this.props.participant.alias} ref="alias" style={{marginTop: 0, marginRight: 0}} />
        <div className="row center">
          <button className={opts.buttonClass} onClick={setAlias}>
            Change Alias
          </button>
        </div>
      </div>
    )
  }

  removeTab(opts) {

    const instance = Instances.findOne();

    const onRemove = () => {
      const cb = () => {
        Meteor.call("events.brackets.removeParticipant", instance._id, this.props.index, this.props.participant.alias, (err) => {
          if(err){
            return toastr.error(err.reason, "Error!");
          }
          this.props.onClose();
          return toastr.success("Successfully removed participant from event!", "Success!");
        })
      }

      if(instance.tickets && this.props.participant.id) {
        Meteor.call("tickets.removePayment", instance._id, this.props.index, this.props.participant.id, (err) => {
          if(err) {
            toastr.error(err.reason);
          }
          else {
            cb();
          }
        });
      }
      else {
        cb();
      }
    }

    return (
      <div className="col">
        <span style={{fontSize: opts.fontSize}}>Warning: This action will remove the participant from your bracket. They can be added again at a later date, but seed information will not be retained.</span>
        <div className="row center">
          <button className={opts.buttonClass} onClick={onRemove}>
            Remove Participant
          </button>
        </div>
      </div>
    )
  }

  paymentTab(opts) {
    return (
      <div className="col">
        <label style={{fontSize: opts.fontSize}}>Set Payment Amount</label>
        <div className="row">
          <div className="row center x-center" style={{padding: 10, backgroundColor: "#666", fontSize: opts.fontSize}}>
            $
          </div>
          <input className={`col-1 ${opts.inputClass}`} type="text" style={{margin: 0}} value={this.state.amount} onChange={(e) => {
            const amount = parseFloat(e.target.value);
            if(isNaN(amount)) {
              return;
            }
            this.setState({
              amount
            })
          }} onBlur={(e) => {
            this.setState({
              amount: parseFloat(e.target.value).toFixed(2)
            })
          }} />
          <button className={opts.buttonClass} style={{marginLeft: 10}} onClick={() => {
            Meteor.call("events.brackets.setPaymentInfo", Instances.findOne()._id, this.props.index, this.props.participant.alias, this.state.amount, (err) => {
              if(err) {
                toastr.error(err.reason);
              }
            })
          }}>Paid</button>
        </div>
      </div>
    )
  }

  activeTab(opts) {
    switch(this.state.tab) {
      case "Alias":
        return this.aliasTab(opts)
      case "Remove":
        return this.removeTab(opts)
      case "Payment":
        return this.paymentTab(opts)
      default:
        return null
    }
  }

  renderBase(opts) {
    if(!this.props.participant) {
      return null;
    }
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome name="times" style={{fontSize: `calc(${opts.fontSize} * 2)`}} onClick={this.props.onClose} />
        </div>
        { this.tabs(opts) }
        <div style={{marginTop: 20}}>
          { this.activeTab(opts) }
        </div>
      </Modal>
    )
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "1em",
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only"
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      modalClass: "",
      overlayClass: "",
      inputClass: "",
      buttonClass: ""
    });
  }

}
