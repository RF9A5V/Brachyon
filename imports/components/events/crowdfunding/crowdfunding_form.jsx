import React, { Component } from 'react';
import FileUpload from '../../public/file_upload.jsx';

export default class CFForm extends Component {

  componentWillReceiveProps(next){
    Object.keys(this.refs).map((val) => { this.refs[val].value = next[val] })
  }

  onSubmit(e) {
    e.preventDefault();
    [name, amount, description] = Object.keys(this.refs).map((val) => { return this.refs[val].value })
    var icon;
    if(this.refs.icon.state.changed){
      icon = this.refs.icon.state.file;
    }
    this.props.handler({
      name,
      amount,
      description,
      icon
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)} className="col">
        <label>
          Branch Name
        </label>
        <input ref="name" type="text" defaultValue={this.props.name} />
        <label>
          Amount
        </label>
        <input ref="amount" type="text" defaultValue={this.props.amount} />
        <label>
          Description
        </label>
        <textarea ref="description" defaultValue={this.props.description}></textarea>
        <label>
          Icon
        </label>
        <FileUpload ref="icon" value={this.props.icon} />
        <input type="submit" value="Update Node" />
        <button onClick={this.props.deleteHandler}>
          Delete This
        </button>
      </form>
    )
  }
}
