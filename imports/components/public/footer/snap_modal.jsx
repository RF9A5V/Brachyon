import React from 'react';
import Modal from 'react-modal';
import FontAwesome from 'react-fontawesome';

export default class SnapModal extends React.Component {
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
        <div className="social-icon-bg col x-center center" onClick={this.openModal.bind(this)} >
          <FontAwesome name="snapchat-ghost" className="snapchat social-icon" />
        </div>
		  	<Modal
	        className = "snap-modal"
	        isOpen={this.state.open}
          onRequestClose={this.closeModal.bind(this)}
        >
          <div className="row justify-end">
            <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
          </div>
	        <div className="col center x-center">
		        <img src="/images/snapcode.png" className="snapcode-image" />
		      </div>
	      </Modal>
	    </div>
	  );
	}
}
