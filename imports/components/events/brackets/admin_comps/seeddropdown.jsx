import React, { Component } from "react";

export default class AddPartipantAction extends Component {

  changeSeeding(e)
  {
    e.preventDefault();
    var val = e.target.value;
    Meteor.call("events.change_seeding", this.props.id, this.props.index, this.props.seedIndex, val, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully switched seeding.", "Success!");
        this.props.updateList(this.props.seedIndex, val);
      }
    });
  }

  render(){
    var seedArray = [];
    for (var x = 0; x < this.props.pSize; x++)
      seedArray.push(x+1);
    return(
      <select onChange={this.changeSeeding.bind(this)} value={this.props.seedIndex}>
      {
        seedArray.map((seed, i) => {
          return ( <option value={i}>{seed}</option> )
        })
      }
      </select>
    )
  }
}
