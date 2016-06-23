import React, { Component } from 'react';

import FileUpload from '../../public/file_upload.jsx';

export default class CrowdfundingForm extends Component {

  content() {
    return {
      name: this.refs.name.value,
      amount: parseFloat(this.refs.amount.value) * 100,
      description: this.refs.description.value,
      icon: this.refs.icon.state.file || this.refs.icon.props.value
    }
  }

  onSub(e){
    e.preventDefault();
    this.props.handler(this.content());
  }

  onClick(e){
    e.preventDefault();
    this.props.delete();
  }

  render() {
    Object.keys(this.refs).map( (val) => { this.refs[val].value = this.props[val]; } )
    if(this.refs.amount){
      this.refs.amount.value = (this.props.amount / 100).toFixed(2);
    }
    return (
      <form className="col" style={{textAlign: 'left'}} onSubmit={this.onSub.bind(this)} >
        <label>Node Name</label>
        <input type="text" ref="name" defaultValue={this.props.name} />
        <label>Amount</label>
        <input type="text" ref="amount" defaultValue={(this.props.amount / 100).toFixed(2)} />
        <label>Description</label>
        <textarea ref="description"></textarea>
        <label>Icon</label>
        <FileUpload ref='icon' value={this.props.icon} />
        <input type="submit" value="Update Node" />
        <button onClick={this.onClick.bind(this)}>Delete Node</button>
      </form>
    )
  }
}
