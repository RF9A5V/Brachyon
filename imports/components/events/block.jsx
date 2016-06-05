import React from 'react';
import Images from '/imports/api/event/images.js';

export default class EventBlock extends React.Component {

  imgOrDefault() {
    img = Images.findOne(this.props.banner);
    if(img == null){
      return '/images/balls.svg';
    }
    else {
      return img.url();
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
