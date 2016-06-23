import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Sponsorships from '/imports/api/event/sponsorship.js';

import CFNode from './cf_node.jsx';
import HoverBlock from '../../public/hover_block.jsx';
import CrowdfundingForm from './crowdfunding_form.jsx';

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
    return function(e){
      el = e.target.getBoundingClientRect();
      if(this.refs.name){
        this.refs.name.value = value;
      }
      if(this.refs.amount){
        this.refs.amount.value = amt;
      }
      preview = null;
      if(this.state.nodes[pos].icon){
        preview = this.state.nodes[pos].icon;
      }
      this.setState({
        name: value,
        level: index,
        index: pos,
        preview,
        amt,
        x: el.left,
        y: el.top,
        open: true
      })
    }
  }

  updateNode(attrs){
    this.state.nodes[this.state.index].name = attrs.name;
    this.state.nodes[this.state.index].icon = attrs.icon;
    this.state.nodes[this.state.index].nodes[this.state.level].amount = attrs.amount;
    this.state.nodes[this.state.index].nodes[this.state.level].description = attrs.description;
    this.forceUpdate();
    console.log(this.state.nodes[this.state.index])
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
            amount: 100
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

  deleteNode() {
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
          amt: null,
          open: false
        })
        toastr.success('Deleted node.')
      }
    })
  }

  cfForm() {
    return (
      <CrowdfundingForm
        icon={this.state.nodes[this.state.index].icon}
        name={this.state.nodes[this.state.index].name}
        amount={this.state.nodes[this.state.index].nodes[this.state.level].amount} description={this.state.nodes[this.state.index].nodes[this.state.level].description}
        handler={this.updateNode.bind(this)}
        delete={this.deleteNode.bind(this)}
      />
    );
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
      <div className="row center col-1">
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
                            <CFNode handler={self.setForm(node.name, index, pos, val.amount).bind(self)} level={index+1} icon={node.icon} active={self.state.level === index && self.state.index === pos} />
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
            this.state.open ? (
              <HoverBlock x={this.state.x + 50} y={this.state.y - 20} open={this.state.open} handler={(function(){ this.setState({open: false, level: null, index: null}) }).bind(this)}>
                { this.cfForm.bind(this)() }
              </HoverBlock>
            ) : (
              ""
            )
          }

        </div>

      </div>
    );
  }
}
