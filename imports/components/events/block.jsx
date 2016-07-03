import React from 'react';
import Images from '/imports/api/event/images.js';

export default class EventBlock extends React.Component {

  imgOrDefault() {
    if(this.props.image == null){
      return '/images/bg.jpg';
    }
    else {
      return this.props.image;
    }
  }

  onClick(e) {
    window.scrollTo(0, 0);
    this.props.handler(e);
  }

  render(){
    return (
      <div className="event-block" onClick={this.onClick.bind(this)}>
        <img src={this.imgOrDefault()} />
      </div>
    )
  }
}
