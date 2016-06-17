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
          <button onClick={this.openModal.bind(this)}>Log In</button>
          <Modal
            className = "create-modal"
            overlayClassName = "overlay-class"
            isOpen={this.state.open}>
            <div className="div-pad">
              <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
            </div>
            <h1 style={{textAlign: 'center'}}>Signup</h1>
            <LogInScreen />
          </Modal>
        </div>
      );
    }
  }
