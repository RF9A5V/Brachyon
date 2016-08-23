import React, { Component } from "react";

import ProcessModal from "../public/process_modal.jsx";
import PaymentType from "../public/process_steps/payment_type.jsx";

export default class ProcessTestScreen extends Component {

  onModalOpen() {
    this.refs.process.openModal();
  }

  steps() {
    return [
      {
        component: PaymentType,
        args: {}
      },
      {
        component: PaymentType,
        args: {}
      }
    ]
  }

  onComplete() {
    var values = this.refs.process.values();
    console.log(values);
    this.refs.process.reset();
  }

  render() {
    return (
      <div>
        <ProcessModal ref="process" onComplete={this.onComplete.bind(this)} steps={this.steps()} />
        <button onClick={this.onModalOpen.bind(this)}>Open Modal</button>
      </div>
    )
  }
}
