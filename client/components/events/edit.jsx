import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import ReactQuill from 'react-quill';
import EventBanner from './editor_tabs/banner.jsx';
import EventTime from './editor_tabs/time.jsx';

import LoadingScreen from '../public/loading.jsx';
import TabController from '../public/tab_controller.jsx';

export default class EditEventScreen extends TrackerReact(React.Component){

  event() {
    _id = this.props.id;
    return Events.findOne({_id});
  }

  tabs(){
    return [
      {
        title: 'Description',
        content: <ReactQuill value="Hello!" theme="snow" />
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
          <EventTime />
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
