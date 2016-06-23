import React, { Component } from 'react';

import TestNode from './test_node.jsx';
import HoverBlock from './hover_block.jsx';
import TestForm from './test_form.jsx';

export default class TestTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      branches: props.branches
    };
  }

  // Origin to range, NOT range to origin.
  // Returns single number coordinate of given X, Y components.
  c(x, y){
    return (12 - y) * 5 + x;
  }

  reloadTree() {
    ar = (new Array(13*5)).map(() => { return 0 });
    for(var i = 0; i < 65; i ++){
      ar[i] = {}
    }
    ar[this.c(2,0)] = {
      type: 'circle'
    }
    ar[this.c(2,1)] = {
      type: 'line',
      orientation: 'vertical'
    }
    ar[this.c(1,2)] = {
      type: 'line',
      orientation: 'horizontal'
    }
    ar[this.c(3,2)] = {
      type: 'line',
      orientation: 'horizontal'
    }
    ar[this.c(2,2)] = {
      type: 'circle'
    }

    for(var i = 0; i < 5; i ++){
      ar[this.c(i, 3)] = {
        type: 'line',
        orientation: 'vertical'
      }
    }

    branches = this.state.branches;

    for(var i = 0; i < 5; i ++){
      if(branches[i] == null){
        ar[this.c(i, 4)] = {
          type: 'circle',
          action: 'add'
        }
        continue;
      }
      renderCircle = true;
      for(var j = 4; j < 4 + 2 * (branches[i].nodes.length - 1); j += 2){
        ar[this.c(i, j)] = {
          type: 'circle'
        }
        ar[this.c(i, j + 1)] = {
          type: 'line',
          orientation: 'vertical'
        }
      }
      ar[this.c(i, 4 + 2 * (branches[i].nodes.length - 1))] = {
        type: 'circle'
      }
      if(branches[i].nodes.length < 5){
        ar[this.c(i, 4 + 2 * (branches[i].nodes.length) - 1)] = {
          type: 'line',
          orientation: 'vertical'
        }
        ar[this.c(i, 4 + 2 * (branches[i].nodes.length))] = {
          type: 'circle',
          action: 'add'
        }
      }
    }

    this.setState({
      grid: ar
    })
  }

  componentWillMount() {
    this.reloadTree();
  }

  componentWillReceiveProps(next){
    this.state.branches = next.branches;
    console.log(this.state.branches);
    console.log(next.branches);
    this.reloadTree();
  }

  addNode(x, y) {
    return (e) => {
      e.preventDefault();
      Meteor.call('sponsorships.add_node', this.props._id, x, function(err){
        if(err){
          toastr.error('Error updating nodes');
        }
        else {
          toastr.success('Updated nodes');
        }
      })
    }
  }

  editNode(x, y) {
    if(this.state.branches[x] == null){
      return (() => {});
    }
    return (function(e){
      el = e.target.getBoundingClientRect();
      node = this.state.branches[x].nodes[(12 - y) / 2 - 2];
      node.icon = this.state.branches[x].icon;
      node.name = this.state.branches[x].name;
      this.setState({
        node,
        open: true,
        branch: x,
        index: (12 - y) / 2 - 2,
        x: el.left,
        y: el.top
      })
    }).bind(this);
  }

  deleteNode(e){
    e.preventDefault();
    self = this;
    Meteor.call('sponsorships.delete_node', this.props._id, this.state.branch, this.state.index, function(err){
      if(err){
        toastr.error('error');
      }
      else {
        toastr.success('success');
      }
      self.setState({
        open: false
      })
    })
  }

  render() {
    var self = this;
    return (
      <div className="screen">
        <div className="spons-grid">
          {
            this.state.grid.map(function(val, index){
              var name = "";
              handler = (()=>{});
              if(val.type == 'circle'){
                name = 'spons-grid-circle';
              }
              if(val.type == 'line'){
                if(val.orientation == 'vertical'){
                  name = "spons-grid-line vertical";
                }
                else {
                  name = "spons-grid-line horizontal";
                  if(val.left){
                    name += ' left'
                  }
                  else {
                    name += ' right';
                  }
                  if(val.half){
                    name += ' half'
                  }
                }
              }
              if(val.action == 'add'){
                handler = self.addNode(index % 5, Math.floor(index / 5)).bind(self);
              }
              else {
                handler = self.editNode(index % 5, Math.floor(index / 5)).bind(self);
              }
              return (
                <div className="spons-grid-element">
                  {
                    val.type == 'circle' ? (
                      <TestNode action={val.action} handler={handler} icon={self.state.branches[index % 5].icon} />
                    ) : (
                      <div className={name}></div>
                    )
                  }

                </div>
              )
            })
          }
        </div>
        <HoverBlock open={this.state.open} x={this.state.x+50} y={this.state.y-80} handler={() => { this.setState({open: false}) }}>
          <TestForm deleteHandler={this.deleteNode.bind(this)} {...this.state.node} />
        </HoverBlock>
      </div>
    );
  }
}
