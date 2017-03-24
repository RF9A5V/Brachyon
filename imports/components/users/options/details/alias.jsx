import React, { Component } from "react";

export default class AliasSelect extends Component {

  onSave() {
    Meteor.call("users.update_alias", this.refs.alias.value, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully changed alias!");
      }
    })
  }

  render() {
    const user = Meteor.users.findOne(Meteor.userId());
    return (
      <div className="col">
        <label>Alias</label>
        <input type="text" placeholder="Alias" defaultValue={user.profile.alias} style={{margin: 0}} ref="alias" />
        <div className="row center" style={{marginTop: 10}}>
          <button onClick={this.onSave.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
