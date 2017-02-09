import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class GameBlock extends Component {

  componentWillMount() {
    
    this.setState({
      selected: this.props.played
    })
  }

  toggleSelect(){
    this.setState({
      selected: !this.state.selected
    })
    this.props.handler();
  }

  render() {
    return (
      <div className="game-block" onClick={this.toggleSelect.bind(this)}>
        { this.state.selected ? (
          <div className="game-block-overlay">
            <div className="game-block-selected">
              <FontAwesome name="check" />
            </div>
          </div>
        ) : (
          ""
        )}
        <img src={this.props.imgUrl} />
      </div>
    )
  }
}
