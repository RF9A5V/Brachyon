import React, { Component } from "react";

export default class GoalSelection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTotal: props.amount
    }
  }

  sponsorEvent(e) {
    e.preventDefault();
    var self = this;
    if(this.state.currentTotal !== this.props.amount){
      return toastr.error("All currency points have to be allocated to submit.", "Error!");
    }
    var obj = {};
    for(var key in this.refs){
      if(this.refs[key].value){
        obj[key] = this.refs[key].value * 1
      }
    }
    Meteor.call("events.sponsor", this.props.id, obj, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success(`${this.props.amount} successfully sponsored for this event!`, "Success!");
        this.props.onSubmit();
      }
    });
  }

  unblockedGoals() {
    var goals = [];
    var main = this.props.goals;
    if((main.current || 0) * 1 < main.amount * 1){
      goals.push({
        name: main.name,
        description: main.description,
        amount: main.amount,
        current: (main.current || 0),
        id: "main"
      })
    }
    else {
      for(var key in main.children){
        if(main.children[key].nodes){
          for(var index in main.children[key].nodes){
            var item = main.children[key].nodes[index];
            if((item.current || 0) * 1 < item.amount * 1){
              goals.push({
                name: item.name,
                description: item.description,
                amount: item.amount,
                current: (item.current || 0),
                id: `${key},${index}`
              });
              break;
            }
          }
        }
      }
    }
    return goals;
  }

  onChange(e) {
    var amt = 0;
    for(var key in this.refs){
      amt += (this.refs[key].value * 1 || 0)
    }
    this.setState({
      currentTotal: amt
    })
  }

  render() {
    var goals = this.unblockedGoals();
    var split = Math.floor(this.props.amount / goals.length);
    var remainder = this.props.amount - (split * goals.length);
    return (
      <div>
        <h4>Allocated: { Math.max(this.props.amount - this.state.currentTotal, 0) }</h4>
        {
          this.unblockedGoals().map((goal) => {
            return (
              <div className="row x-center" style={{marginTop: 10}}>
                <div className="col">
                  <span style={{marginRight: 20}}>{ goal.name }</span>
                  <sub>{ goal.current } / { goal.amount }</sub>
                </div>
                <div style={{position: "relative"}}>
                  <div style={{position: "absolute", top: 7, left: 7, width: 25, height: 25, borderRadius: "100%", backgroundColor: "gold"}}>
                  </div>
                  <input style={{paddingLeft: 39, margin: 0}} type="text" ref={goal.id} defaultValue={split + (remainder-- > 0 ? 1 : 0)} onChange={this.onChange.bind(this)}/>
                </div>
              </div>
            )
          })
        }
        <button onClick={this.sponsorEvent.bind(this)} style={{marginTop: 10}}>
          Sponsor!
        </button>
      </div>
    )
  }
}
