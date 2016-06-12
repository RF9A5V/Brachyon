import React from 'react';
import Modal from 'react-modal';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';

import LocationSelect from '../events/create/location_select.jsx';

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
            <h1 style={{textAlign: 'center'}}>Create an Event</h1>
            <form>
              <div className="row">
                <div className='col' style={{width: '50%'}}>
                  <div>
                    <label>
                      Event Name<br/>
                      <input type="text" name="eventname" placeholder="Something catchy..."/>
                    </label>
                  </div>
                  <LocationSelect />
                  <div>
                    <input type="checkbox" name="online"/>
                    <label>Online Event</label>
                  </div>
                  <div>
                    <label for="file-upload" className="custom-file-upload">
                      <FontAwesome name='picture-o' style={{marginRight: 5}} />
                      Custom Upload
                      <input id="file-upload" type="file"/>
                    </label>
                  </div>
                </div>
                <div style={{width: '50%'}}>
                  Date and Time:
                  <Datetime open={true} input={false} />
                </div>
              </div>
              <div className='row center' style={{marginTop: 20}}>
                <input className="create-btn" type="submit" value="Create Event"/>
              </div>
            </form>

          </Modal>
        </div>
      );
    }
  }
