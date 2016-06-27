import React, { Component } from 'react';

import CFNode from './crowdfunding_node.jsx';
import HoverBlock from '../../public/hover_block.jsx';
import CFForm from './crowdfunding_form.jsx';
import CFDisplay from './crowdfunding_display.jsx';

export default class CFTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      branches: props.branches,
      edit: props.edit
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
      for(var j = 4; j < 2 + 2 * (branches[i].nodes.length) + 1 && j < 13; j += 2){
        ar[this.c(i, j)] = {
          type: 'circle'
        }
        ar[this.c(i, j + 1)] = {
          type: 'line',
          orientation: 'vertical'
        }
      }
      if(branches[i].nodes.length < 5 && this.state.edit){
        ar[this.c(i, 4 + 2 * (branches[i].nodes.length))] = {
          type: 'circle',
          action: 'add'
        }
      }
      if(branches[i].nodes.length < 5 && !this.state.edit){
        ar[this.c(i, 4 + 2 * (branches[i].nodes.length) - 1)] = {}
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
    console.log('reloaded');
    this.state.branches = next.branches;
    this.reloadTree();
  }

  addNode(x, y) {
    return (e) => {
      e.preventDefault();
      Meteor.call('sponsorships.add_node', this.props.id, x, function(err){
        if(err){
          toastr.error(err.reason);
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
      console.log(this.state.branches[x].nodes);
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

  updateNode(attrs) {
    self = this;
    Meteor.call('sponsorships.update_node', this.props.id, this.state.branch, this.state.index, attrs, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success('Great success!');
      }
      self.setState({
        open: false
      })
    })
  }

  deleteNode(e){
    e.preventDefault();
    self = this;
    Meteor.call('sponsorships.delete_node', this.props.id, this.state.branch, this.state.index, function(err){
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
      <div className="col-1">
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
                      <CFNode action={val.action} handler={handler} icon={self.state.branches[index % 5] ? self.state.branches[index % 5].icon : null} />
                    ) : (
                      <div className={name}></div>
                    )
                  }

                </div>
              )
            })
          }
        </div>
        <HoverBlock open={this.state.open} x={this.state.x+55} y={this.state.y-10} handler={() => { this.setState({open: false}) }}>
          {
            this.state.edit ? (
              <CFForm deleteHandler={this.deleteNode.bind(this)} {...this.state.node} handler={this.updateNode.bind(this)} />
            ) : (
              <CFDisplay {...this.state.node} />
            )
          }

        </HoverBlock>
      </div>
    );
  }
}