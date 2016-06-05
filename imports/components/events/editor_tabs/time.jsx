import React from 'react';
import Datetime from 'react-datetime';

export default class EventTime extends React.Component {

  componentDidMount(){
    this.rerender();
  }

  rerender(){
    this.forceUpdate();
  }

  onClick(e) {
    e.preventDefault();
    obj = {
      regStart: this.refs.regStart.state.inputValue,
      regEnd: this.refs.regEnd.state.inputValue,
      eventStart: this.refs.eventStart.state.inputValue,
      eventEnd: this.refs.eventEnd.state.inputValue
    }
    Meteor.call('events.update_time', this.props.id, obj, function(err) {
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated event time!");
      }
    });
  }

  regStartValid(current) {
    yesterday = Datetime.moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  }

  regEndValid(current) {
    yesterday = Datetime.moment().subtract(1, 'day');
    let startDate = yesterday;
    if(this.refs != null && this.refs.regStart != null){
      startDate = Datetime.moment(this.refs.regStart.state.inputValue).subtract(1, 'day');
    }
    return current.isAfter(yesterday) && current.isAfter(startDate);
  }

  eventStartValid(current) {
    yesterday = Datetime.moment().subtract(1, 'day');
    let fundingEnd = yesterday;
    if(this.refs != null && this.refs.regEnd != null){
      fundingEnd = Datetime.moment(this.refs.regEnd.state.inputValue).add(2, 'week');
    }
    return current.isAfter(yesterday) && current.isAfter(fundingEnd);
  }

  eventEndValid(current) {
    yesterday = Datetime.moment().subtract(1, 'day');
    let eventStart = yesterday;
    if(this.refs != null && this.refs.eventStart != null){
      eventStart = Datetime.moment(this.refs.eventStart.state.inputValue).subtract(1, 'day');
    }
    return current.isAfter(yesterday) && current.isAfter(eventStart);
  }

  render() {
    return (
      <div className="col x-center">
        <div className="row">
          <div className="col x-center" style={{marginRight: '20px'}}>
            <h3>Registration Start</h3>
            <Datetime open={true} input={false} ref="regStart"
            defaultValue={this.props.regStart}
            isValidDate={this.regStartValid.bind(this)}
            onChange={this.rerender.bind(this)} />
          </div>
          <div className="col x-center">
            <h3>Registration End</h3>
            <Datetime open={true} input={false} ref="regEnd"
            defaultValue={this.props.regEnd}
            isValidDate={this.regEndValid.bind(this)}
            onChange={this.rerender.bind(this)} />
          </div>
        </div>
        <div className="row">
          <div className="col x-center" style={{marginRight: '20px'}}>
            <h3>Event Start</h3>
            <Datetime open={true} input={false} ref="eventStart"
            defaultValue={this.props.eventStart}
            isValidDate={this.eventStartValid.bind(this)}
            onChange={this.rerender.bind(this)} />
          </div>
          <div className="col x-center">
            <h3>Event End</h3>
            <Datetime open={true} input={false} ref="eventEnd"
            defaultValue={this.props.eventEnd}
            isValidDate={this.eventEndValid.bind(this)}
            onChange={this.rerender.bind(this)} />
          </div>
        </div>
        <button style={{marginTop: 20}} onClick={this.onClick.bind(this)}>Submit</button>
      </div>
    )
  }
}
