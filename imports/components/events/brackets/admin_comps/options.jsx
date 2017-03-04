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
              <div style={{padding: 10, borderBottom: this.state.tab == i ? "solid 2px #FF6000" : "solid 2px transparent", cursor: "pointer"}} onClick={() => { this.setState({ tab: i }) }}>
                { t }
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        { this.tabs() }
        <div>
        </div>
      </Modal>
    )
  }
}
