import React from 'react';
import Images from '/imports/api/event/images.js';

export default class EventBlock extends React.Component {

  imgOrDefault() {
    if(this.props.image == null){
      return '/images/balls.svg';
    }
    else {
      return this.props.image;
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
