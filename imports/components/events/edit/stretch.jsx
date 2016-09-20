import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import MoneyInput from "/imports/components/public/money_input.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

import { Icons } from "/imports/api/sponsorship/icon.js";

export default class StretchGoals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      create: false,
      goal: {},
      id: Events.findOne()._id
    }
  }

  renderInitialChildren(nodeChildren) {
    var rez = [];
    for(var i in nodeChildren){
      var index = nodeChildren[i];
      rez.push(
        <div className="circle" style={{backgroundImage: this.props.goals[index].icon == null ? "initial" : `url(${Icons.findOne(this.props.goals[index].icon).link()})`}} onClick={this.onGoalEdit(index, this.props.goals[index])} key={"a"+index}>
        </div>
      )
      rez.push(
        <div className="line-horiz" key={"b"+index}>
        </div>
      )
    }
    if(nodeChildren.length < 5) {
      rez.push(
        <div className="circle col center x-center" onClick={this.onGoalCreate(0).bind(this)} key="c">
          <FontAwesome name="plus" />
        </div>
      );
    }
    else {
      rez.pop();
    }
    return (
      <div className="row center x-center goal-row">
        { rez }
      </div>
    )
  }

  renderDirectChildren(nodeChildren) {
    var rez = [];
    var count = 0;
    if(nodeChildren.length == 0) {
      return "";
    }
    while(count++ < 4 && nodeChildren.some((val) => {
      return val != null;
    })) {
      rez.push(
        <div className="row center goal-row" key={"a" + count}>
          {
            nodeChildren.map((index, i) => {
              return (
                <div className={`line-vert ${ index != null ? "" : "hidden" }`} key={i}></div>
              )
            })
          }
          {
            nodeChildren.length < 5 ? (
              <div className="line-vert hidden">
              </div>
            ) : (
              ""
            )
          }
        </div>
      );
      var grandchildren = nodeChildren.map((index) => {
        if(index == null) {
          return null;
        }
        if(this.props.goals[index].children.length == 0) {
          return null;
        }
        return this.props.goals[index].children[0];
      });
      rez.push(
        <div className="row center goal-row" key={"b" + count}>
          {
            grandchildren.map((index, i) => {
              if(index == null && count < 4) {
                if(nodeChildren[i] == null) {
                  return (
                    <div className="circle indirect hidden" key={i}></div>
                  );
                }
                return (
                  <div className="circle indirect col center" onClick={this.onGoalCreate(nodeChildren[i])} key={i}>
                    <FontAwesome name="plus" />
                  </div>
                )
              }
              else {
                var goal = this.props.goals[index];
                return (
                  <div className={`circle indirect`} onClick={this.onGoalEdit(index, goal)} style={{backgroundImage: goal.icon ? `url(${Icons.findOne(goal.icon).link()})` : ""}} key={i}></div>
                )
              }
            })
          }
          {
            nodeChildren.length < 5 ? (
              <div className="circle indirect hidden">
              </div>
            ) : (
              ""
            )
          }
        </div>
      )
      nodeChildren = grandchildren;
    }

    return rez.reverse();
  }

  onGoalCreate(index) {
    return (e) => {
      e.preventDefault();
      this.setState({
        open: true,
        create: true,
        index,
        goal: {}
      })
    }
  }

  onGoalEdit(index, goal) {
    return (e) => {
      e.preventDefault();
      this.setState({
        open: true,
        create: false,
        index,
        goal
      })
    }
  }

  onImageUploaded(data) {
    var goals = {
      name: this.refs.name.value,
      amount: parseInt(this.refs.amount.value),
      description: this.refs.description.value,
      icon: data._id
    }

    if(this.state.create) {
      Meteor.call("events.addGoal", this.state.id, this.state.index, goals, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully added goal!", "Success!");
          this.setState({
            open: false
          });
        }
      })
    }
    else {
      Meteor.call("events.editGoal", this.state.id, this.state.index, goals, (err) => {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully edited goal!", "Success!");
          this.setState({
            open: false
          });
        }
      })
    }
  }

  onGoalSubmit(e) {
    e.preventDefault();
    this.refs.icon.value();
  }

  onGoalDelete(e) {
    e.preventDefault();
    Meteor.call("events.removeGoal", this.state.id, this.state.index, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Test test", "Success!");
        Meteor.subscribe("event", this.state.id);
      }
    })
  }

  setThreshold() {
    Meteor.call("events.setSkillPointThreshold", this.state.id, this.refs.threshold.value * 100, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      return toastr.success("Successfully set thresholds!", "Success!");
    })
  }

  render() {
    var initial = this.props.goals[0];
    var ary = [];
    if(initial != null) {
      ary = initial.children;
    }
    return (
      <div className="col x-center">
        {
          this.renderDirectChildren(ary)
        }
        {
          initial ? (
            this.renderInitialChildren(ary)
          ) : (
            ""
          )
        }
        {
          initial ? (
            <div className="row center x-center">
              <div className="line-vert"></div>
            </div>
          ) : (
            ""
          )
        }
        <div className="row center x-center">
          {
            initial == null ? (
              <div className="circle col center x-center" onClick={this.onGoalCreate(0).bind(this)}>
                <FontAwesome name="plus" />
              </div>
            ) : (
              <div className="circle" style={{backgroundImage: initial.icon ? `url(${Icons.findOne(initial.icon).link()})` : "inherit"}} onClick={this.onGoalEdit(0, initial).bind(this)}>
              </div>
            )
          }
        </div>

        <div className="row" style={{marginTop: 10}}>
          <input ref="threshold" type="number" style={{margin: 0}} defaultValue={(Events.findOne().revenue.strategy.pointThreshold / 100).toFixed(2)}/>
          <button style={{marginLeft: 15}} onClick={this.setThreshold.bind(this)}>Set Threshold</button>
        </div>

        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({open: false}) }}>
          <div className="col">
            <label>Name</label>
            <input type="text" ref="name" style={{margin: 0}} defaultValue={this.state.goal.name}/>
            <label>Required Skill Points</label>
            <input type="number" ref="amount" defaultValue={this.state.goal.amount} />
            <label>Description</label>
            <textarea ref="description" style={{margin: 0, marginBottom: 10}} defaultValue={this.state.goal.description}></textarea>
            <label>Icon (Optional)</label>
            <ImageForm aspectRatio={1} ref="icon" collection={Icons} id={this.state.goal.icon} callback={this.onImageUploaded.bind(this)} />
            <div>
              <button onClick={this.onGoalSubmit.bind(this)}>Submit</button>
              {
                !this.state.create ? (
                  <button onClick={this.onGoalDelete.bind(this)}>Delete</button>
                ) : (
                  ""
                )
              }
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
