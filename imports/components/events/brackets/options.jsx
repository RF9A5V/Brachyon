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
    Meteor.call("events.addParticipant", Events.findOne()._id, this.props.bracketIndex, this.refs.userSearch.value(), this.state.aliasName, this.state.userEmail, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success(`Successfully added ${this.state.aliasName} to this bracket!`);
        this.props.onComplete({
          alias: this.state.aliasName,
          id: this.refs.userSearch.value(),
          email: this.state.userEmail
        })
        this.refs.aliasName.value = "";
        this.refs.userEmail.value = "";
        this.setState({
          aliasName: "",
          userEmail: ""
        });
        this.refs.userSearch.reset();
      }
    })
  }

  onUserSelect(user) {
    this.refs.aliasName.value = (user.profile || {}).alias || "";
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
        <label>E-Mail</label>
        <input type="email" ref="userEmail" placeholder="Contact Email (Required if already have an account)" style={{margin: "0 0 20px"}} onChange={this.onParticipantDetailsChange.bind(this)} />
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
