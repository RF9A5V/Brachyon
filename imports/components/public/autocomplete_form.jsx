import React, { Component } from 'react';
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class AutocompleteForm extends TrackerReact(Component) {
  constructor(props) {
    super(props);
    this.state = {
      readyList: (new Array(props.publications.length)).fill(false),
      id: this.props.id
    }
  }

  componentWillMount() {
    var self = this;
    this.state.pubs = this.props.publications.map(function(pub, index){
      return Meteor.subscribe(pub, "", {
        onReady() {
          self.state.readyList[index] = true;
          self.forceUpdate();
        }
      })
    });
    this.state.active = false;
  }

  componentWillUnmount() {
    this.state.pubs.forEach(function(item){
      item.stop();
    })
  }

  onTemplateSelect(obj, name) {
    this.setState({
      id: obj._id,
      active: false
    });
    this.refs.input.value = name;
    if(this.props.onChange){
      this.props.onChange(obj);
    }
  }

  value() {
    return this.state.id;
  }

  results() {
    var self = this;
    return this.props.types.map(function(item){
      return item.type.find({}).fetch().map(function(instance){
        return (
          <item.template {...instance} onClick={self.onTemplateSelect.bind(self)} />
        )
      })
    })
  }

  search(e) {
    this.state.pubs.forEach(function(item){
      item.stop();
    });
    this.state.readyList = (new Array(this.props.publications.length)).fill(false);
    if(e.target.value != "") {
      var self = this;
      this.state.active = true;
      this.state.readyList = (new Array(this.props.publications.length)).fill(false);
      this.state.pubs = this.props.publications.map(function(pub, index){
        return Meteor.subscribe(pub, e.target.value, {
          onReady() {
            self.state.readyList[index] = true;
            self.forceUpdate();
          }
        })
      });
    }
    else {
      this.state.active = false;
      this.state.id = null;
      if(this.props.onChange) {
        this.props.onChange({});
      }
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div className="col" style={{position: "relative"}}>
        <input ref="input" type="text" onChange={this.search.bind(this)} style={{margin: 0, marginBottom: 10}} />
        <div className="template-container">
          {
            this.state.readyList.every( (value) => {return value} ) && this.state.active ? (
              this.results()
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }

}
