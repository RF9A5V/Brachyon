import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class OptionsModal extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      tab: "Alias"
    }
  }

  tabs(opts) {
    const instance = Instances.findOne();
    var tabs = [
      "Alias",
      "Remove"
    ];
    if(instance.tickets && this.props.participant.id && !this.props.participant.checkedIn) {
      tabs.push("Discounts");
    }

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
      if(value.length < 3) {
        return toastr.error("Alias name has to be greater than 3 characters.");
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

  discountTab() {
    const instance = Instances.findOne();
    const discounts = instance.tickets.discounts;

    const toggleDiscount = (d, i) => {
      if(d.qualifiers[this.props.participant.id]) {
        Meteor.call("tickets.deactivateDiscount", instance._id, this.props.index, i, this.props.participant.id, (err) => {
          if(err) {
            toastr.error(err.reason);
          }
        })
      }
      else {
        Meteor.call("tickets.activateDiscount", instance._id, this.props.index, i, this.props.participant.id, (err) => {
          if(err) {
            toastr.error(err.reason);
          }
        })
      }
    }

    return (
      <div className="col">
        {
          discounts.map((d, i) => {
            return (
              <div className="row center x-center">
                <div className="col-1">
                  <span>{ d.name }</span>
                </div>
                <div className="col-1">
                  <button onClick={() => { toggleDiscount(d, i) }}>
                    {
                      d.qualifiers[this.props.participant.id] == null ? (
                        "Apply Discount"
                      ) : (
                        "Remove Discount"
                      )
                    }
                  </button>
                </div>
              </div>
            )
          })
        }

      </div>
    )
  }

  activeTab(opts) {
    switch(this.state.tab) {
      case "Alias":
        return this.aliasTab(opts)
      case "Remove":
        return this.removeTab(opts)
      case "Discounts":
        return this.discountTab(opts)
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
      fontSize: "2.5em",
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      inputClass: "large-input",
      buttonClass: "large-button"
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
