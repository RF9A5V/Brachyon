import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import LandingScreen from './public/index.jsx';
import ShowUserScreen from './users/show.jsx';
import LoadingScreen from './public/loading.jsx';
import EditEventScreen from './events/edit.jsx';

export default class App extends TrackerReact(React.Component) {

  currentUser(){
    return Meteor.user();
  }

  pageMapping(page){
    pages = {
      main: <LandingScreen />,
      userShow: <ShowUserScreen />,
      eventEdit: <EditEventScreen id={this.props.id} />
    }
    return pages[page];
  }

  render() {
    rez = "";
    if(this.currentUser() === undefined){
      rez = (<LoadingScreen />);
    }
    else {
      rez = this.pageMapping(this.props.page);
    }
    return rez;
  }
}
