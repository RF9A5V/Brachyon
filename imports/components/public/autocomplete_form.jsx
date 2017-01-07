import React, { Component } from 'react';
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class AutocompleteForm extends TrackerReact(Component) {
  constructor(props) {
    super(props);
    this.state = {
      readyList: (new Array(props.publications.length)).fill(false),
      id: this.props.id,
      top: 0,
      left: 0
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

  componentDidMount() {
    this.setTemplateLocation();
  }

  componentWillUnmount() {
    this.state.pubs.forEach(function(item){
      item.stop();
    })
  }

  componentWillReceiveProps(next) {
    if(next.value) {
      this.refs.input.value = next.value;
    }
    if(next.id) {
      this.state.id = next.id;
    }
    this.forceUpdate();
  }

  setTemplateLocation() {
    var pos = this.refs.input.getBoundingClientRect();
    this.setState({
      top: pos.top + 43,
      left: pos.left,
      width: this.refs.input.offsetWidth
    })
  }

  onTemplateSelect(obj, name) {
    this.setState({
      id: obj._id,
      active: false
    }, () => {
      this.setTemplateLocation();
    });
    this.refs.input.value = name;
    if(this.props.onChange){
      this.props.onChange(obj);
    }
  }

  value() {
    return this.state.id;
  }

  reset() {
    this.state.id = null;
    this.state.active = false;
    this.refs.input.value = "";
    this.props.onChange({});
    this.forceUpdate();
  }

  results() {
    var self = this;
    return this.props.types.map(function(item){
      var rez = item.type.find({}).fetch().map(function(instance){
        return (
          <item.template {...instance} onClick={self.onTemplateSelect.bind(self)} />
        )
      });
      var end = [];
      rez.forEach((i) => {
        end.push(i);
        end.push(<hr />);
      });
      end.pop();
      return end;
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

  onKeyPress(e) {
    if(e.key == "Enter" && this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <div className="col">
        <input ref="input" type="text" onChange={this.search.bind(this)} placeholder={this.props.placeholder || ""} defaultValue={this.props.value} onKeyPress={ this.onKeyPress.bind(this) } style={{marginRight: 0}} />
        {
          this.state.readyList.every( (value) => {return value} ) && this.state.active ? (
            <div className="template-container" style={{ top: this.state.top, left: this.state.left, width: this.state.width }}>
              {this.results()}
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }

}
