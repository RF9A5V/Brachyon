import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class TestNode extends Component {

  action() {
    if(this.props.action == 'add'){
      return <FontAwesome name="plus" />
    }
  }

  render() {
    style = {};
    if(this.props.icon && this.props.action != 'add'){
      style.backgroundImage = `url(${this.props.icon})`;
      style.backgroundSize = '100% 100%';
    }
    console.log(style);
    return (
      <div className="spons-grid-circle" onClick={this.props.handler} style={style}>
        {
          this.action()
        }
      </div>
    );
  }
}
