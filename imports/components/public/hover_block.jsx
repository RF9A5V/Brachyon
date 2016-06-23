import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class HoverBlock extends Component {

  close(e) {
    e.preventDefault();
    this.props.handler();
  }

  render() {
    if(!this.props.open){
      return (<div></div>)
    }
    return (
      <div className="hover-block" style={{left: this.props.x, top: this.props.y + window.scrollY}}>
        <div className="hover-block-arrow"></div>
        <div className="hover-block-content">
          <div style={{textAlign: 'right', marginBottom: 10}}>
            <a href="#" onClick={this.close.bind(this)}>
              <FontAwesome name="times" />
            </a>
          </div>
          {
            this.props.children
          }
        </div>
      </div>

    )
  }
}
