import React from 'react';
import Modal from 'react-modal';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import LocationSelect from '../events/create/location_select.jsx';
import DateInput from '../events/create/date_input.jsx';
import TimeInput from '../events/create/time_input.jsx';

export default class BasicExample extends React.Component {
  constructor () {
    super();
    // this.openModal = this.openModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
    this.state = {
      open: false,
      file: null
    }
  }

  openModal(){
    this.setState({open: true});
  }

  closeModal(){
    this.setState({open: false, file: null});
  }

  submit(e) {
    e.preventDefault();
    file = this.state.file;

    info = {};

    info.eventName = this.refs.eventName.value;
    info.location = this.refs.location.value();
    info.date = this.refs.date.value();
    info.time = this.refs.time.value();

    reader = new FileReader();
    reader.onload = function() {
      data = this.result;
      len = data.length;
      arr = new Uint8Array(len);
      for(var i = 0; i < len; i ++){
        arr[i] = data.charCodeAt(i);
      }
      info.file = {
        content: arr,
        type: file.type
      }
      Meteor.call('events.create', Meteor.userId(), info, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully updated event banner!");
        }
      })
    }
    reader.readAsBinaryString(file);
  }

  onDrop(files) {
    this.setState({
      file: files[0]
    });
  }

  render () {
    return (
      <div>
        <button onClick={this.openModal.bind(this)}>Create Event</button>
        <Modal
          className = "create-modal"
          overlayClassName = "overlay-class"
          isOpen={this.state.open}>
          <div className="div-pad">
            <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
          </div>
          <h1 style={{textAlign: 'center'}}>Create an Event</h1>
          <form onSubmit={this.submit.bind(this)}>
            <div className="row">
              <div className='col' style={{width: '50%'}}>
                <div>
                  <label>
                    Event Name<br/>
                    <input type="text" name="eventname" placeholder="Event Name" ref="eventName"/>
                  </label>
                </div>
                <LocationSelect ref="location" />
                <div>
                  <label>
                    Event Banner (defaults to our logo)
                  </label>
                  {
                    this.state.file == null ? (
                      <Dropzone accept="image/*" multiple={false} onDrop={this.onDrop.bind(this)}>
                        <div style={{width: '100%', height: '100%'}} className="row x-center center">
                          Drag And Drop
                        </div>
                      </Dropzone>
                    ) : (
                      <img src={this.state.file.preview} style={{ width: '70%', height: 'auto' }} />
                    )
                  }
                </div>
              </div>
              <div style={{width: '50%'}}>
                <label>
                  Date And Time
                </label>
                <br/>
                <DateInput ref="date" />
                <TimeInput ref="time" />
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
