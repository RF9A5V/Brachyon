import React, { Component } from "react";

export default class StretchGoals extends Component {

  renderDirectChildren() {
    var children = this.props.goals[0].children;
    var rez = [];
    for(var i = 0; i < children.length; i ++){
      rez.push(
        <div className="circle" style={{backgroundImage: this.props.goals[children[i]].icon ? `url(${Icons.findOne(this.props.goals[children[i]].icon).url()})` : "initial"}} key={"a"+i} onClick={this.props.onGoalSelect(this.props.goals[children[i]])}></div>
      );
      rez.push(
        <div className="line-horiz" key={"b"+i}></div>
      );
    }
    rez.pop();
    return rez;
  }

  renderGrandchildren() {
    var children = this.props.goals[0].children.map((val) => {
      return this.props.goals[val].children[0];
    });
    var rez = [];
    var renderable = children.some((val) => {
      return val != null;
    });
    while(renderable) {
      rez.push(
        <div className="row center x-center" style={{position: "relative", top: 20}}>
          {
            children.map((child, i) => {
              return (
                <div className={`line-vert ${ child != null ? "" : "hidden" }`}>

                </div>
              )
            })
          }
        </div>
      );
      rez.push(
        <div className="row center x-center">
          {
            children.map((child, i) => {
              if(child == null) {
                return (
                  <div className="circle indirect hidden" key={i}></div>
                )
              }
              return (
                <div className="circle indirect" style={{backgroundImage: this.props.goals[child].icon ? `url(${Icons.findOne(this.props.goals[child].icon).url()})` : "initial"}} key={i} onClick={this.props.onGoalSelect(this.props.goals[child])} style={{position: "relative", top: 20}}>
                </div>
              )
            })
          }
        </div>
      );
      children = children.map((child) => {
        if(child == null){
          return null;
        }
        return this.props.goals[child].children[0];
      });
      renderable = children.some((val) => {
        return val != null;
      });
    }
    return rez.reverse();
  }

  render() {
    if(!this.props.goals) {
      return (
        ""
      );
    }
    return (
      <div className="col x-center">
        <div className="col x-center center">
          {
            this.renderGrandchildren()
          }
        </div>
        <div className="row x-center center" style={{position: "relative", top: 20}}>
        {
          this.renderDirectChildren()
        }
        </div>
        <div className="row center">
          <div className="line-vert"></div>
        </div>
        <div className="circle" style={{backgroundImage: this.props.goals[0].icon ? `url(${Icons.findOne(this.props.goals[0].icon).url()})` : "initial"}} onClick={this.props.onGoalSelect(this.props.goals[0])}></div>
      </div>
    );
  }
}
