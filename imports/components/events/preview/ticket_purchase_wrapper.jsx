import React, { Component } from "react";

import ProcessModal from "../../public/process_modal.jsx";
import TicketSelect from "./ticket_select.jsx";

export default class TicketPurchaseWrapper extends Component {

  openModal() {
    this.refs.process.openModal();
  }

  closeModal() {
    this.refs.process.closeModal();
  }

  steps() {
    return [
      {
        component: TicketSelect,
        args: {}
      }
    ]
  }

  render() {
    return (
      <div>
        <ProcessModal ref="process" steps={this.steps()} />
      </div>
    )
  }
}
