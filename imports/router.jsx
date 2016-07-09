import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MainLayout from '../imports/components/layouts/MainLayout.jsx';
import LandingScreen from '../imports/components/public/index.jsx';
import AboutScreen from '../imports/components/public/about.jsx';
import ShowUserScreen from '../imports/components/users/show.jsx';
import EditEventScreen from '../imports/components/events/edit.jsx';
import OrganizeEventScreen from '../imports/components/events/organize.jsx';
import EventDiscoveryScreen from '../imports/components/events/discover/discover.jsx';
import TournamentSingleScreen from '../imports/components/tournaments/single.jsx';
import PreviewEventScreen from '../imports/components/events/preview.jsx';
import PublishEventScreen from '../imports/components/events/publish.jsx';
import EventCreateScreen from '../imports/components/events/create.jsx';
import ApprovalScreen from '../imports/components/events/approval.jsx';
import GameSelectScreen from '../imports/components/games/game_select.jsx';
import GameApprovalScreen from '../imports/components/games/approval.jsx';

function isLoggedIn(nextState, replaceState){
  if(Meteor.userId()){
    replaceState( { nextPathname: nextState.location.pathname }, '/dashboard' );
  }
}

function verifyUser(nextState, replaceState) {
  if(!Meteor.userId()){
    replaceState({nextPathname: nextState.location.pathname}, '/');
  }
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={LandingScreen} onEnter={isLoggedIn} />
      <Route path="dashboard" component={ShowUserScreen} onEnter={verifyUser} />
      <Route path="about" component={AboutScreen} />
      <Route path="events/:eventId/edit" component={EditEventScreen} />
      <Route path="events/:eventId/view" component={OrganizeEventScreen} />
      <Route path="events/:eventId/preview" component={PreviewEventScreen} />
      <Route path="events/:eventId/publish" component={PublishEventScreen} />
      <Route path="events/discover" component={EventDiscoveryScreen} />
      <Route path="events/approval" component={ApprovalScreen} />
      <Route path="events/create" component={EventCreateScreen} />
      <Route path="games/select" component={GameSelectScreen} />
      <Route path="games/approval" component={GameApprovalScreen} />
      <Route path="tournaments/single" component={TournamentSingleScreen} />
    </Route>
  </Router>
)
