import React, { Component } from 'react';

export default class TicketingForm extends Component {

  componentWillMount(){
    this.setState({
      loaded: false
    })
  }

  componentDidMount() {
    this.setParams();
    this.setState({
      loaded: true
    })
  }

  setParams() {
    this.refs.name.value = this.props.name;
    this.refs.description.value = this.props.description;
    this.refs.amount.value = (this.props.amount / 100).toFixed(2);
    this.refs.limit.value = this.props.limit;
  }

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
    if(this.state.loaded){
      this.setParams();
    }
    return (
      <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} onSubmit={this.onSubmit.bind(this)}>
        <label>Ticket Name</label>
        <input type="text" ref='name' />
        <label>Description</label>
        <textarea ref="description"></textarea>
        <label>Amount</label>
        <input type="text" ref='amount' />
        <label>Limit</label>
        <input type="text" ref='limit' />
        <input type="submit" value="Update" />
      </form>
    );
  }
}
