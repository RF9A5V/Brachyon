import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class EditBracket extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id,
      bracket: props.bracket
    }
  }

  onBracketSave() {
    var bracket = this.refs.form.value();
    Meteor.call("events.brackets.edit", this.state.id, this.props.index, bracket.game, bracket.format, (err) => {
      if(err) {
        return toastr.error("Error in updating brackets!", "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated brackets!", "Success!");
      }
    })
  }

  onBracketDelete() {
    Meteor.call("events.brackets.remove", this.state.id, this.props.index, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully deleted bracket!");
      }
    })
  }

  componentWillReceiveProps(next){
    this.setState({
      bracket: next.bracket
    });
  }

  render() {
    return (
      <div>
        <div className="submodule-bg submodule-overflow" style={{width: "50%"}}>
          <div className="row center">
            <h3>{ this.props.bracket.name }</h3>
          </div>
          <BracketForm ref="form" {...(this.state.bracket || {})} />
          <div className="row center" style={{marginTop: 20}}>
            <button onClick={this.onBracketSave.bind(this)}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}
