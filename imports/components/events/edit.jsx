import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import EventDescription from './editor_tabs/description.jsx';
import EventBanner from './editor_tabs/banner.jsx';
import EventTime from './editor_tabs/time.jsx';
import EventLocation from './editor_tabs/location.jsx';

import LoadingScreen from '../public/loading.jsx';
import TabController from '../public/tab_controller.jsx';

export default class EditEventScreen extends TrackerReact(React.Component){

  componentWillMount(){
    self = this;
    this.setState({
      event: Meteor.subscribe('event', self.props.params.eventId)
    })
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  tabs(){
    event = this.event();
    console.log(this)
    return [
      {
        title: 'Description',
        content: <EventDescription id={this.props.params.eventId} title={event.title} description={event.description} />
      },
      {
        title: 'Banner',
        content: (
          <EventBanner id={this.props.params.eventId} />
        )
      },
      {
        title: 'Time',
        content: (
          <EventTime id={this.props.params.eventId} {...event.time} />
        )
      },
      {
        title: 'Location',
        content: (
          <EventLocation id={this.props.params.eventId} {...event.location} />
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
        <div className="screen col">
          <TabController tabs={this.tabs()} />
          <div style={{alignSelf: 'center'}}>
            <button onClick={(e) => { window.history.back() }}>Back</button>
          </div>
        </div>
      )
    }
  }
}
