import React, { Component } from 'react';

export default class FileUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasFile: props.value != null,
      file: props.value,
      changed: false
    }
  }

  componentWillReceiveProps() {
    this.setState({
      hasFile: false,
      file: null,
      changed: false
    })
    return true;
  }

  onClick(e) {
    e.preventDefault();
    this.refs.file.click();
  }

  onChange(e) {
    e.preventDefault();
    reader = new FileReader();
    reader.onload = (function(){
      this.setState({
        hasFile: true,
        file: reader.result,
        changed: true
      })
    }).bind(this);
    reader.readAsDataURL(e.target.files[0])
  }

  render() {
    if(this.state.hasFile || this.props.value){
      return (
        <div className="col" style={{marginTop: 10}}>
          <img style={{width: '200', height: 'auto'}} src={this.state.file || this.props.value} onClick={this.onClick.bind(this)} />
          <input type="file" ref="file" onChange={this.onChange.bind(this)} />
        </div>
      );
    }
    return (
      <div style={{marginTop: 10}}>
        <input type="file" ref="file" onChange={this.onChange.bind(this)} />
        <button onClick={this.onClick.bind(this)}>Upload File</button>
      </div>
    );
  }
}
