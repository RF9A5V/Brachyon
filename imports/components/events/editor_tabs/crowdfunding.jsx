import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Sponsorships from '/imports/api/event/sponsorship.js';
import CFNode from './cf_node.jsx';

export default class CrowdfundingTree extends TrackerReact(Component) {

  componentWillMount() {
    self = this;
    this.setState({
      isLoaded: false,
      nodes: this.props.branches
    })
  }

  onCreate(e) {
    Meteor.call('events.create_sponsorship', this.props.id, function(err) {
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Created sponsorship!")
      }
    })
  }

  sponsorship() {
    return Sponsorships.find().fetch()[0];
  }

  setForm(value, index, pos, amt) {
    self = this;
    return function(e){
      if(self.refs.name){
        self.refs.name.value = value;
      }
      if(self.refs.amount){
        self.refs.amount.value = amt;
      }
      preview = null;
      if(self.state.nodes[pos].icon){
        preview = self.state.nodes[pos].icon;
      }
      self.setState({
        name: value,
        level: index,
        index: pos,
        preview,
        amt
      })
    }
  }

  updateNode(e){
    e.preventDefault();
    this.state.nodes[this.state.index].name = this.refs.name.value;
    this.state.nodes[this.state.index].icon = this.state.preview;
    this.state.nodes[this.state.index].nodes[this.state.level].amount = this.refs.amount.value;
    this.setState({
      name: this.refs.name.value
    })
    Meteor.call('sponsorships.update_nodes', this.props._id, this.state.nodes, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated sponsorship.");
      }
    })
  }

  createNode(pos){
    return (function(e){
      this.state.nodes[pos] = {
        name: "Skill",
        nodes: [
          {
            amount: 10
          }
        ]
      }
      this.forceUpdate();
    }).bind(this)
  }

  appendNode(pos){
    return (function(e){
      this.state.nodes[pos].nodes.push({amount: 10});
      this.forceUpdate();
    }).bind(this)
  }

  openImage(e){
    e.preventDefault();
    this.refs.file.click();
  }

  setImage(e) {
    self = this;
    e.preventDefault();
    f = e.target.files[0];
    reader = new FileReader();
    reader.onload = function(e){
      self.state.nodes[self.state.index].file = reader.result;
      self.setState({
        preview: reader.result
      });
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  deleteNode(e) {
    e.preventDefault();
    self = this;
    Meteor.call('sponsorships.delete_node', this.props._id, this.state.index, this.state.level, function(err){
      if(err){
        toastr.error(err.reason)
      }
      else {
        self.state.nodes[self.state.index].nodes.splice(self.state.level, 1);
        self.setState({
          name: null,
          level: null,
          index: null,
          preview: null,
          amt: null
        })
        toastr.success('Deleted node.')
      }
    })
  }

  render() {
    spons = this.sponsorship();
    self = this;
    if(!spons){
      return (
        <div>
          <button onClick={this.onCreate.bind(this)}>Create Crowdfunding</button>
        </div>
      );
    }
    return (
      <div className="row center">
        <div className="col x-center" style={{flexDirection: "column-reverse"}}>
          <div className="row center">
            <CFNode name="Base Entry" />
          </div>
          <div className="row center">
            <CFNode name="Event Runnable" />
          </div>
          <div className="row center">
            {
              this.state.nodes.map(function(node, pos){
                if(node == null){
                  var render = (pos == 2);
                  if(pos < 2){
                    if(self.state.nodes[pos+1]){
                      render = true;
                    }
                  }
                  if(pos > 2){
                    if(self.state.nodes[pos-1]){
                      render = true;
                    }
                  }
                  return (
                    <div className="col" style={{flexDirection: "column-reverse"}}>
                      {
                        render ? (
                          <CFNode handler={self.createNode(pos).bind(this)} mode="add"/>
                        ) : (
                          <div className="spons-tree-node" style={{backgroundColor: 'transparent'}}></div>
                        )
                      }

                    </div>
                  )
                }
                else {
                  return (
                    <div className="col" style={{flexDirection: "column-reverse", alignItems: 'center'}}>
                      {
                        node.nodes.map(function(val, index){
                          return (
                            <CFNode handler={self.setForm(node.name, index, pos, val.amount).bind(self)} level={index+1} icon={node.icon} active={self.state.level == index && self.state.index == pos} />
                          )
                        })
                      }
                      {
                        node.nodes.length < 5 ? (
                          <CFNode handler={self.appendNode(pos).bind(self)} mode="add"/>
                        ) : (
                          ""
                        )
                      }
                    </div>
                  );
                }
              })
            }
          </div>
        </div>
        <div>
          {
            this.state.name ? (
              <form className="spons-form col">
                <h3>{ this.state.name + ", Lv. " + ((this.state.level == 4) ? ("Max") : (this.state.level + 1)) }</h3>
                <label>
                  Name
                  <input type="text" ref="name" defaultValue={this.state.name} />
                </label>
                <div style={{display: 'none'}}>
                  <input type="file" ref="file" onChange={this.setImage.bind(this)} />
                </div>
                <div>
                  <img style={{width: 40, height: 40, borderRadius: '100%'}} src={this.state.preview} />
                </div>
                <button onClick={this.openImage.bind(this)}>Set Icon</button>
                <label>
                  Amount
                  <input type="text" ref="amount" defaultValue={this.state.amt} />
                </label>
                <div style={{marginBottom: 15}}>
                  <button onClick={this.updateNode.bind(this)}>Update Node</button>
                </div>
                <div>
                  <button onClick={this.deleteNode.bind(this)}>Delete Node</button>
                </div>
              </form>
            ) : (
              <h3>Select A Node</h3>
            )
          }

        </div>

      </div>
    );
  }
}
