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
      steps
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
      console.log(this.refs[this.state.step].valid);
      if(typeof(this.refs[this.state.step].valid) != "function") {
        throw new Error("Process for process modal should implement bool valid().");
      }
      if(this.refs[this.state.step].valid()){
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
    return this.state.steps.map((process) => {
      if(typeof(process.value) != "function"){
        return "";
      }
      return process.value();
    })
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
          {
            this.state.steps.map((process, index) => {
              return (
                <div className="col" style={{display: this.state.step == index ? "inherit" : "none"}}>
                  <process.component ref={index} {...process.args}/>
                  <div className="row">
                    {
                      index > 0 ? (
                        <button onClick={this.backStep.bind(this)}>Back</button>
                      ) : (
                        ""
                      )
                    }
                    {
                      index < this.state.steps.length - 1 ? (
                        <button onClick={this.advanceStep(process).bind(this)}>Next Step</button>
                      ) : (
                        <button onClick={this.props.onComplete}>Submit</button>
                      )
                    }
                  </div>
                </div>
              )
            })
          }
        </Modal>
      </div>
    )
  }
}
