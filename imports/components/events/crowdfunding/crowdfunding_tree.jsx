import React, { Component } from 'react';

export default class CFTree extends Component {

  constructor(props) {
    super(props);
    var obj = props.goals || {children: null};
    if(obj.children == null){
      obj.children = [null, null, null];
    }
    else {
      for(var i = 0; i < 3; i ++){
        if(obj.children[i] == null){
          obj.children[i] = null;
        }
      }
    }
    this.state = {
      branch: obj,
      node: {},
      active: false
    }
  }

  componentDidUpdate() {
    Object.keys(this.state.node).map((key) => { this.refs[key].value = this.state.node[key] });
    this.refs.amount.value = (this.state.node.amount / 100).toFixed(2);
  }

  values() {
    return this.state.branch;
  }

  createInitialNode(e) {
    this.setState({
      branch: {
        name: "Run the Event",
        description: "This first node is used to represent the amount you need to get this event up and running. Get enough points allocated into this goal node and you can run your event!",
        children: [null, null, null]
      }
    })
  }

  addNode(index) {
    return function(e) {
      if(this.state.branch.children[index]) {
        var num = Object.keys(this.state.branch.children[index].nodes).length;
        this.state.branch.children[index].nodes[num] = {
          name: `Lv. ${num + 1}`,
          description: "Set Description Here",
          amount: 100
        };
      }
      else {
        this.state.branch.children[index] = {
          nodes: [{
            name: `Lv. 1`,
            description: "Set Description Here",
            amount: 100
          }]
        }
      }
      this.forceUpdate();
    }
  }

  editNode(node) {
    return function(e) {
      this.setState({
        node,
        active: true
      })
    }
  }

  drawNodes() {
    var self = this;
    if(!this.state.branch) {
      return (
        <button onClick={this.createInitialNode.bind(this)}>
          Set Up Crowdfunding!
        </button>
      )
    }
    else {
      return (
        <div>
          <div className="row center">
            <span onClick={this.editNode(this.state.branch).bind(self)}>
              { this.state.branch.name }
            </span>
          </div>
          <div className="row center">
            <div className="line vert"></div>
          </div>
          <div className="row center">
            <div className="line horiz"></div>
          </div>
          <div className="row">
            {
              Object.keys(this.state.branch.children).map(function(key, index){
                var child = self.state.branch.children[key];
                return (
                  <div className="col-1">
                    {
                      child == null ? (
                        <div className="col x-center">
                          <div className="line vert"></div>
                          <span onClick={self.addNode(index).bind(self)}>Click ME</span>
                        </div>
                      ) : (
                        <div className="col x-center">
                          {
                            Object.keys(child.nodes).map(function(key_2, node){
                              var val = child.nodes[key_2];
                              return (
                                <div className="col x-center">
                                  <div className="line vert"></div>
                                  <span onClick={self.editNode(val).bind(self)}>{ val.name }</span>
                                </div>
                              )
                            })
                          }
                          {
                            Object.keys(child.nodes).length < 5 ? (
                              <div className="col x-center">
                                <div className="line vert"></div>
                                <span onClick={self.addNode(index).bind(self)}>Click ME</span>
                              </div>
                            ) : ( "" )
                          }
                        </div>
                      )
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      )
    }
  }

  onChange(e) {
    var target = this.state.node;
    target.name = this.refs.name.value;
    target.description = this.refs.description.value;
    target.amount = this.refs.amount.value;
  }

  render() {
    return (
      <div>
        {
          this.state.active ? (
            <div className="col">
              <i>Elements update as you type! Don't forget to save!</i>
              <label>Name</label>
              <input type="text" onChange={this.onChange.bind(this)} ref="name" defaultValue={this.state.node.name} />
              <label>Item Description</label>
              <textarea ref="description" onChange={this.onChange.bind(this)} defaultValue={this.state.node.description}></textarea>
              <label>Item Amount</label>
              <input type="text" ref="amount" onChange={this.onChange.bind(this)} defaultValue={(this.state.node.amount / 100).toFixed(2)} />
              <button onClick={(e) => { this.setState({active: false}); this.state.node.amount = this.refs.amount.value * 100; this.forceUpdate() }}>Close</button>
            </div>
          ) : ( "" )
        }
        { this.drawNodes() }
      </div>
    );
  }
}
