import React, { Component } from 'react';

export default class LocationSelect extends Component {

  componentWillMount() {
    this.setState({
      online: "true"
    })
  }

  updateValue(e){
    console.log(e.target.value);
    this.setState({
      online: e.target.value
    });
  }

  render() {
    return (
      <div>
        <label>
          Is this event online?
          <div className="row">
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={true} checked="checked" /> Yes
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={false} /> No
          </div>
          {
            this.state.online == "true" ? (
              <div></div>
            ) : ( <input type="text" ref="location" placeholder="Enter your location" /> )
          }
        </label>
      </div>
    )
  }
}
