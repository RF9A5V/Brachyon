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
      index: -1,
      node: -1,
      active: false
    }
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
          amount: 1
        };
      }
      else {
        this.state.branch.children[index] = {
          name: `Branch ${index + 1}`,
          nodes: [{
            name: `Lv. 1`,
            description: "Set Description Here",
            amount: 1
          }]
        }
      }
      this.forceUpdate();
    }
  }

  editNode(index, node) {
    return function(e) {
      this.setState({
        index,
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
            <span>
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
                                  <span onClick={self.editNode(index, node).bind(self)}>{ child.name + (val.name == "" ? val.name : ", " + val.name) }</span>
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
    var st = this.state;
    var target = st.branch.children[st.index].nodes[st.node];
    st.branch.children[st.index].name = this.refs.branchName.value;
    target.name = this.refs.name.value;
    target.description = this.refs.description.value;
    target.amount = this.refs.amount.value * 1;
    this.forceUpdate();
  }

  render() {
    var st = this.state;
    return (
      <div>
        {
          this.state.active ? (
            <div className="col">
              <i>Elements update as you type! Don't forget to save!</i>
              <label>Branch Name</label>
              <input type="text" onChange={this.onChange.bind(this)} ref="branchName" defaultValue={st.branch.children[st.index].name} />
              <label>Item Name</label>
              <input type="text" onChange={this.onChange.bind(this)} ref="name" defaultValue={st.branch.children[st.index].nodes[st.node].name} />
              <label>Item Description</label>
              <textarea ref="description" onChange={this.onChange.bind(this)} defaultValue={st.branch.children[st.index].nodes[st.node].description}></textarea>
              <label>Item Amount</label>
              <input type="text" ref="amount" onChange={this.onChange.bind(this)} defaultValue={st.branch.children[st.index].nodes[st.node].amount} />
              <button onClick={(e) => { this.setState({active: false}) }}>Close</button>
            </div>
          ) : ( "" )
        }
        { this.drawNodes() }
      </div>
    );
  }
}
