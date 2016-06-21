import React from 'react';
import Modal from 'react-modal';
import LogInScreen from './login.jsx';

export default class LogInModal extends React.Component {
    constructor () {
      super();
      this.state = {
        open: false,
      }
    }

    openModal(){
      this.setState({open: true});
    }

    closeModal(){
      this.setState({open: false});
    }

    render () {
      return (
        <div>
          <button className="head-margin" onClick={this.openModal.bind(this)}>Log In</button>
          <Modal
            className = "cred-modal"
            overlayClassName = "cred-overlay"
            isOpen={this.state.open}>
            <div className="div-pad">
              <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
            </div>
            <h1 style={{textAlign: 'center'}}>Log In</h1>
            <LogInScreen />
          </Modal>
        </div>
      );
    }
  }
