import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class AccordionContainer extends Component {

  componentWillMount() {
    this.setState({
      active: false
    })
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      active: !this.state.active
    })
  }

  render() {
    return (
      <div className='accordion-container'>
        <div className='accordion-header' onClick={this.onClick.bind(this)}>
          <h3>
            { this.props.title }
          </h3>
          {
            this.state.active ? (
              <FontAwesome name="caret-up" size="2x" />
            ) : (
              <FontAwesome name="caret-down" size="2x" />
            )
          }

        </div>
        {
          this.state.active ? (
            <div className='accordion-content'>
              { this.props.content }
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
    )
  }
}
