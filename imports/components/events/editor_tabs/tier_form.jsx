import React, { Component } from 'react';

export default class TierForm extends Component {

  onSubmit(e) {
    e.preventDefault();
    self = this;
    [ name, description, amount, limit ] = Object.keys(this.refs).map( (key) => { return self.refs[key].value } )
    this.props.handler({
      name,
      description,
      amount: parseFloat(amount) * 100,
      limit: parseInt(limit)
    })
  }

  render() {
    Object.keys(this.refs).map( (val) => { this.refs[val].value = this.props[val] } )
    if(this.refs.amount){
      this.refs.amount.value = (this.props.amount / 100).toFixed(2)
    }
    return (
      <form className="col" style={{justifyContent: 'center'}} onSubmit={this.onSubmit.bind(this)}>
        <label>Tier Name</label>
        <input type="text" ref='name' defaultValue={this.props.name} />
        <label>Description</label>
        <textarea ref="description" defaultValue={this.props.description}></textarea>
        <label>Amount</label>
        <input type="text" ref='amount' defaultValue={(this.props.amount / 100).toFixed(2)} />
        <label>Limit</label>
        <input type="text" ref='limit' defaultValue={this.props.limit} />
        <input type="submit" value="Update" />
      </form>
    );
  }
}