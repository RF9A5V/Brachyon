import React from 'react';

// TODO: Get this to actually work.

export default class ReactiveInput extends React.Component {
  placeholder(){
    return this.props.placeholder == null ? "" : this.props.placeholder;
  }
  value() {
    return this.props.value == null ? "" : this.props.value;
  }
  getValue(){
    return this.refs.input.value;
  }
  onChange(e) {
    // TODO: Change input size dynamically based on span size.
  }
  render(){
    return (
      <div className="row center" style={{position:'relative'}}>
        <input ref="input" type="text" style={ { minWidth: '200px' } } placeholder={this.placeholder()} defaultValue={this.value()} onChange={this.onChange} />
        <span style={{visibility:'hidden', position: 'absolute', zIndex: -1}} className="reactive-input-sizer">{this.value()}</span>
      </div>
    );
  }
}
