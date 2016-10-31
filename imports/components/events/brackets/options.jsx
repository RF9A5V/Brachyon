import React, { Component } from "react";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import UserTemplate from "/imports/components/public/search_results/user_template.jsx";

export default class BracketOptionsPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      aliasName: "",
      userEmail: ""
    }
  }

  onParticipantDetailsChange(e) {
    e.preventDefault();
    this.setState({
      aliasName: this.refs.aliasName.value,
      userEmail: this.refs.userEmail.value
    })
  }

  onParticipantAdd(e) {
    e.preventDefault();
    var id = this.refs.userSearch.value();
    Meteor.call("events.addParticipant", Events.findOne()._id, this.props.bracketIndex, id, this.state.aliasName, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        if(id) {
          toastr.success(`Sent request to ${this.state.aliasName} to join!`);
        }
        else {
          toastr.success(`Successfully added ${this.state.aliasName} to this bracket!`);
          this.props.onComplete({
            alias: this.state.aliasName,
            id: this.refs.userSearch.value()
          })
        }
        this.refs.aliasName.value = "";
        this.refs.userSearch.reset();
        this.forceUpdate();
      }
    })
  }

  onUserSelect(user) {
    this.refs.aliasName.value = (user.profile || {}).alias || user.username;
    this.setState({
      aliasName: this.refs.aliasName.value
    });
  }

  render() {
    return (
      <div className="col">
        <label>Add a Participant</label>
        <label>Username (if they already have an account)</label>
        <AutocompleteForm ref="userSearch" publications={[
          "userSearch"
        ]} types={[
          {
            type: Meteor.users,
            template: UserTemplate,
            name: "Meteor.users"
          }
        ]} onChange={this.onUserSelect.bind(this)} placeholder="Find a user by username." />
        <label>Alias</label>
        <input type="text" ref="aliasName" placeholder="Player's name in the bracket." style={{margin: "0 0 20px"}} onChange={this.onParticipantDetailsChange.bind(this)}/>
        {
          this.state.aliasName.length > 0 ? (
            <div>
              <button onClick={this.onParticipantAdd.bind(this)}>Add Participant</button>
            </div>
          ) : (
            <span>Participant needs an alias!</span>
          )
        }
      </div>
    );
  }
}
