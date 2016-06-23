import React, { Component } from 'react';

export default class TestForm extends Component {

  componentWillReceiveProps(next){
    var self = this;
    console.log(next);
    Object.keys(self.refs).map((val) => { self.refs[val].value = next[val] })
  }

  render() {
    return (
      <form onSubmit={ (e) => { e.preventDefault() } } className="col">
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
        <span>Coming Soon!</span>
        <button onClick={this.props.deleteHandler}>
          Delete This
        </button>
      </form>
    )
  }
}
