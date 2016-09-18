import React, { Component } from "react";
import Modal from "react-modal";

export default class ProcessModal extends Component {

  constructor(props) {
    super(props);

    var steps = props.steps;
    if(steps == undefined) {
      steps = [];
    }
    this.state = {
      open: false,
      step: 0,
      steps,
      dataStore: {}
    }
  }

  openModal() {
    this.setState({
      open: true
    })
  }

  closeModal() {
    this.setState({
      open: false
    })
  }

  advanceStep(process) {
    return (e) => {
      if(typeof(this.refs[this.state.step].valid) != "function") {
        throw new Error("Process for process modal should implement bool valid().");
      }
      if(typeof(this.refs[this.state.step].value) != "function" || typeof(this.refs[this.state.step].value()) != "object") {
        throw new Error("Process for process modal should implement obj value()");
      }
      if(this.refs[this.state.step].valid()){
        var process = this.refs[this.state.step].value();
        for(var key in process) {
          this.state.dataStore[key] = process[key];
        }
        this.setState({
          step: this.state.step + 1
        });
      }
    }
  }

  backStep() {
    this.setState({
      step: this.state.step - 1
    })
  }

  reset() {
    this.setState({
      step: 0,
      open: false,
      steps: this.props.steps || []
    })
  }

  values() {
    return this.state.dataStore;
  }

  updateAfterCB(values) {
    for(var key in values) {
      this.state.dataStore[key] = values[key];
    }
    this.props.onComplete(this.state.dataStore);
  }

  addFieldsToDataStore(obj){
    for(var key in obj) {
      this.state.dataStore[key] = obj[key];
    }
  }

  complete() {
    this.refs[this.state.step].value();
  }

  render() {
    return (
      <Modal isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
        {
          this.state.steps.map((process, index) => {
            return (
              <div className="col" style={{display: this.state.step == index ? "inherit" : "none", minHeight: "100%"}}>
                <process.component ref={index} {...process.args} {...this.state.dataStore} cb={this.updateAfterCB.bind(this)} hack={this.addFieldsToDataStore.bind(this)} />
                <div className="row center">
                  {
                    index > 0 ? (
                      <button onClick={this.backStep.bind(this)} style={{margin: "0 10px"}}>Back</button>
                    ) : (
                      ""
                    )
                  }
                  {
                    index < this.state.steps.length - 1 ? (
                      <button onClick={this.advanceStep(process).bind(this)} style={{margin: "0 10px"}}>Next Step</button>
                    ) : (
                      <button onClick={this.complete.bind(this)} style={{margin: "0 10px"}}>Submit</button>
                    )
                  }
                </div>
              </div>
            )
          })
        }
      </Modal>
    )
  }
}
