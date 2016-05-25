import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import EventDescription from './editor_tabs/description.jsx';
import EventBanner from './editor_tabs/banner.jsx';
import EventTime from './editor_tabs/time.jsx';
import EventLocation from './editor_tabs/location.jsx';

import LoadingScreen from '../public/loading.jsx';
import TabController from '../public/tab_controller.jsx';

export default class EditEventScreen extends TrackerReact(React.Component){

  event() {
    _id = this.props.id;
    return Events.findOne({_id});
  }

  tabs(){
    event = this.event();
    console.log(event);
    return [
      {
        title: 'Description',
        content: <EventDescription id={this.props.id} description={event.description} />
      },
      {
        title: 'Banner',
        content: (
          <EventBanner />
        )
      },
      {
        title: 'Time',
        content: (
          <EventTime id={this.props.id} {...event.time} />
        )
      },
      {
        title: 'Location',
        content: (
          <EventLocation id={this.props.id} {...event.location} />
        )
      }
    ]
  }

  render() {
    if(this.event() == null){
      return (
        <LoadingScreen />
      )
    }
    else {
      return (
        <TabController tabs={this.tabs()} />
      )
    }
  }
}
