import React, { Component } from 'react';

export default class AutocompleteForm extends Component {

  componentWillMount() {
    this.setState({
      matches: [],
      open: false,
      length: 0,
      active: -1
    })
  }

  onChange(e) {
    var val = e.target.value;
    if(val.length < 1){
      this.setState({
        open: false,
        length: 0
      });
      this.props.handler(null);
      return;
    }
    this.state.open = true;
    var re = new RegExp(val, "gi");
    var matches = this.props.items.filter(function(value){
      return re.test(value);
    })
    if (matches.length === 0) {
      return;
    }
    if(matches.length > 6){
      matches = matches.slice(0, 6);
    }
    matches = matches.map(function(value){
      return {
        value,
        index: value.search(re)
      }
    })
    this.setState({
      matches,
      length: val.length
    })
  }

  onClick(e) {
    e.preventDefault();
    var item = e.target;
    while(!item.classList.contains("autocomplete-item")){
      item = item.parentNode;
    }
    var value = item.textContent
    this.refs.input.value = value;
    this.setState({
      open: false
    })
    this.props.handler(this.props.values[this.props.items.indexOf(value)]);
  }

  onKeyDown(e) {
    if(e.keyCode === 38){
      if(this.state.active === -1){
        return;
      }
      this.setState({
        active: this.state.active - 1
      })
    }
    if(e.keyCode === 40){
      if(this.state.active === this.state.matches.length - 1){
        return;
      }
      this.setState({
        active: this.state.active + 1
      })
    }
    if(e.keyCode === 13){
      var value = this.state.matches[this.state.active].value;
      this.refs.input.value = value
      this.props.handler(this.props.values[this.props.items.indexOf(value)]);
      this.setState({
        open: false,
        active: -1
      })
    }
  }

  render() {
    return (
      <div className="autocomplete-form">
        <input type="text" ref="input" className="autocomplete-input" onChange={this.onChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)} />
        <div className={`autocomplete-item-container ${this.state.open ? "active" : ""}`}>
          {
            this.state.matches.map((function(value, index){
              return (
                <div className={`autocomplete-item ${index === this.state.active ? "active" : ""}`} onClick={this.onClick.bind(this)}>
                  <span className="autocomplete-text">
                    {
                      value.value.substr(0, value.index)
                    }
                  </span>
                  <span className="autocomplete-text autocomplete-match">
                    {
                      value.value.substr(value.index, this.state.length)
                    }
                  </span>
                  <span className="autocomplete-text">
                    {
                      value.value.substr(value.index + this.state.length, value.length)
                    }
                  </span>
                </div>
              )
            }).bind(this))
          }
        </div>
      </div>
    );
  }
}
