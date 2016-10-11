import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MainLayout from '../imports/components/layouts/MainLayout.jsx';
import LandingScreen from '../imports/components/public/index.jsx';
import AboutScreen from '../imports/components/public/about.jsx';
import AdvertiseScreen from '../imports/components/public/footer/advertise.jsx';
import TermsScreen from '../imports/components/public/footer/terms.jsx'
import ShowUserScreen from '../imports/components/users/show.jsx';
import EditEventScreen from '../imports/components/events/edit.jsx';
import OrganizeEventScreen from '../imports/components/events/organize.jsx';
import EventDiscoveryScreen from '../imports/components/events/discover/discover.jsx';
import TournamentSingleScreen from '../imports/components/tournaments/single.jsx';
import TournamentDoubleScreen from '../imports/components/tournaments/double.jsx';
import PreviewEventScreen from '../imports/components/events/preview.jsx';
import PublishEventScreen from '../imports/components/events/publish.jsx';
import EventCreateScreen from '../imports/components/events/create.jsx';
import ApprovalScreen from '../imports/components/events/approval.jsx';
import GameSelectScreen from '../imports/components/games/game_select.jsx';
import GameApprovalScreen from '../imports/components/games/approval.jsx';
import UserOptionsScreen from "../imports/components/users/options.jsx";
import CurrencyPurchaseScreen from "../imports/components/public/currency_purchase.jsx";
import ShowEventScreen from "../imports/components/events/show.jsx";
import BracketShowScreen from "../imports/components/events/brackets/show.jsx";
import EventAdminScreen from "../imports/components/events/admin.jsx";
import BracketAdminScreen from "../imports/components/events/brackets/admin.jsx";
import CheckoutScreen from "../imports/components/events/checkout.jsx";

import AdminFunctionScreen from "../imports/components/admin/main.jsx";

function isLoggedIn(nextState, replace){
  if(Meteor.userId()){
    replace('/dashboard');
  }
}

function verifyUser(nextState, replace) {
  if(!Meteor.userId()){
    replace('/');
  }
}

function isAdmin(nextState, repl) {
  var user = Meteor.user();
  console.log(user);
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={LandingScreen} onEnter={isLoggedIn} />
      <Route path="dashboard" component={ShowUserScreen} onEnter={verifyUser} />
      <Route path="options" component={UserOptionsScreen} onEnter={verifyUser} />
      <Route path="about" component={AboutScreen} />
      <Route path="advertise" component={AdvertiseScreen} />
      <Route path="terms" component={TermsScreen} />
      <Route path="events/:eventId/edit" component={EditEventScreen} />
      <Route path="events/:eventId/view" component={OrganizeEventScreen} />
      <Route path="events/:eventId/preview" component={PreviewEventScreen}/>
      <Route path="events/:eventId/publish" component={PublishEventScreen} />
      <Route path="events/:eventId/show" component={ShowEventScreen} />
      <Route path="events/discover" component={EventDiscoveryScreen} />
      <Route path="events/approval" component={ApprovalScreen} />
      <Route path="events/create" component={EventCreateScreen} />
      <Route path="games/select" component={GameSelectScreen} />
      <Route path="games/approval" component={GameApprovalScreen} />
      <Route path="tournaments/single" component={TournamentSingleScreen} />
      <Route path="tournaments/double" component={TournamentDoubleScreen} />
      <Route path="events/:eventId/brackets/:bracketIndex" component={BracketShowScreen} />
      <Route path="events/:eventId/brackets/:bracketIndex/admin" component={BracketAdminScreen} />
      <Route path="events/:eventId/admin" component={EventAdminScreen} />
      <Route path="events/:eventId/checkout" component={CheckoutScreen} />
      <Route path="admin" component={AdminFunctionScreen} onEnter={isAdmin} />
    </Route>
  </Router>
)
