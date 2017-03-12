import React, { Component } from "react";
import Modal from "react-modal";

export default class OptionsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: "Alias"
    }
  }

  tabs() {
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
              <div style={{padding: 5, borderBottom: this.state.tab == t ? "solid 2px #FF6000" : "solid 2px transparent", cursor: "pointer"}} onClick={() => { this.setState({ tab: t }) }}>
                { t }
              </div>
            )
          })
        }
      </div>
    )
  }

  aliasTab() {

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
        <label>Alias</label>
        <input type="text" defaultValue={this.props.participant.alias} ref="alias" style={{marginTop: 0, marginRight: 0}} />
        <div className="row center">
          <button onClick={setAlias}>
            Change Alias
          </button>
        </div>
      </div>
    )
  }

  removeTab() {

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
        <span>Warning: Tom write a warning for this.</span>
        <div className="row center">
          <button onClick={onRemove}>
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

  activeTab() {
    switch(this.state.tab) {
      case "Alias":
        return this.aliasTab()
      case "Remove":
        return this.removeTab()
      case "Discounts":
        return this.discountTab()
      default:
        return null
    }
  }

  render() {
    if(!this.props.participant) {
      return null;
    }
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        { this.tabs() }
        <div style={{marginTop: 20}}>
          { this.activeTab() }
        </div>
      </Modal>
    )
  }
}
