import React from 'react';
import Modal from 'react-modal';
import Datetime from 'react-datetime';

export default class BasicExample extends React.Component {
    constructor () {
      super();
      // this.openModal = this.openModal.bind(this);
      // this.closeModal = this.closeModal.bind(this);
      this.state = {
        open: false
      }
    }

    openModal(){ 
      this.setState({open: true}); 
    }

    closeModal(){ 
      this.setState({open: false}); 
    }

    render () {
      console.log(this);
      return (
        <div>
          <button onClick={this.openModal.bind(this)}>Open Modal</button>
          <Modal 
            className = "create-modal"
            overlayClassName = "overlay-class"
            isOpen={this.state.open}>
            <div className="div-pad">
              <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
            </div>
            <h1>Create an Event:</h1> 
            <form>
              Event Name:
              <input type="text" name="eventname" placeholder="Something catchy..."/><br/>
              Location:
              <input type="text" name="location" placeholder="Where at?"/><br/>
              <input type="checkbox" name="online"/>
              <label>Online Event</label><br/>
              <label for="file-upload" class="custom-file-upload">
                  <i class="fa fa-cloud-upload"></i> Custom Upload
              </label>
              <input id="file-upload" type="file"/>
              Date and Time:
              <div className="row center">
                <Datetime open={true} input={false} />
              </div>
              <br/>
              <div className="div-pad">
                <input className="create-btn" type="submit" value="Create Event"/>
              </div>
            </form>           
          </Modal>
        </div>
      );
    }
  }
