import React from 'react';

export default class EventBlock extends React.Component {

  imgOrDefault() {
    if(this.props.imageURL == null){
      return '/images/balls.svg';
    }
    else {
      return this.props.imageURL;
    }
  }

  render(){
    return (
      <div className="event-block" onClick={this.props.handler}>
        <img src={this.imgOrDefault()} />
      </div>
    )
  }
}
