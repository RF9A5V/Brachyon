import React, { Component } from "react";
import Modal from "react-modal";

export default class OptionsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    }
  }

  tabs() {
    const instance = Instances.findOne();
    var tabs = [
      "Alias",
      "Remove"
    ];
    if(instance.tickets) {
      tabs.push("Discounts");
    }

    return (
      <div className="row">
        {
          tabs.map((t, i) => {
            return (
              <div style={{padding: 5, borderBottom: this.state.tab == i ? "solid 2px #FF6000" : "solid 2px transparent", cursor: "pointer"}} onClick={() => { this.setState({ tab: i }) }}>
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
    const onRemove = () => {
      Meteor.call("events.brackets.removeParticipant", Instances.findOne()._id, this.props.index, this.props.participant.alias, (err) => {
        if(err){
          return toastr.error(err.reason, "Error!");
        }
        this.props.onClose();
        return toastr.success("Successfully removed participant from event!", "Success!");
      })
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

  activeTab() {
    switch(this.state.tab) {
      case 0:
        return this.aliasTab()
      case 1:
        return this.removeTab()
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
