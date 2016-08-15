import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import MoneyInput from "/imports/components/public/money_input.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

import Icons from "/imports/api/sponsorship/icon.js";

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
    console.log(nodeChildren);
    for(var i in nodeChildren){
      var index = nodeChildren[i];
      rez.push(
        <div className="circle" style={{backgroundImage: this.props.goals[i].icon ? `url(${Icons.findOne(this.props.goals[index].icon).url()})` : "initial"}} onClick={this.onGoalEdit(index, this.props.goals[index])}>
        </div>
      )
      rez.push(
        <div className="line-horiz">
        </div>
      )
    }
    if(nodeChildren.length < 5) {
      rez.push(
        <div className="circle col center x-center" onClick={this.onGoalCreate(0).bind(this)}>
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
    console.log("here");
    while(count++ < 4 && nodeChildren.some((val) => {
      return val != null;
    })) {
      rez.push(
        <div className="row center goal-row">
          {
            nodeChildren.map((index) => {
              return (
                <div className={`line-vert ${ index != null ? "" : "hidden" }`}></div>
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
        <div className="row center goal-row">
          {
            grandchildren.map((index, i) => {
              if(index == null && count < 4) {
                if(nodeChildren[i] == null) {
                  return (
                    <div className="circle indirect hidden"></div>
                  );
                }
                return (
                  <div className="circle indirect col center" onClick={this.onGoalCreate(nodeChildren[i])}>
                    <FontAwesome name="plus" />
                  </div>
                )
              }
              else {
                var goal = this.props.goals[index];
                return (
                  <div className={`circle indirect`} onClick={this.onGoalEdit(index, goal)} style={{backgroundImage: goal.icon ? `url(${Icons.findOne(goal.icon).url()})` : ""}}></div>
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
        index
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

  onGoalSubmit(e) {
    e.preventDefault();

    var goals = {
      name: this.refs.name.value,
      amount: this.refs.amount.value() * 100,
      description: this.refs.description.value,
      icon: this.refs.icon.value()
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
              <div className="circle" style={{backgroundImage: initial.icon ? `url(${Icons.findOne(initial.icon).url()})` : "inherit"}} onClick={this.onGoalEdit(0, initial).bind(this)}>
              </div>
            )
          }
        </div>

        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({open: false}) }}>
          <div className="col">
            <label>Name</label>
            <input type="text" ref="name" style={{margin: 0}} defaultValue={this.state.goal.name}/>
            <label>Amount</label>
            <MoneyInput ref="amount" defaultValue={this.state.goal.amount} />
            <label>Description</label>
            <textarea ref="description" style={{margin: 0, marginBottom: 10}} defaultValue={this.state.goal.description}></textarea>
            <label>Icon (Optional)</label>
            <ImageForm aspectRatio={1} ref="icon" collection={Icons} id={this.state.goal.icon} />
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
