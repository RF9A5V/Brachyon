import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MainLayout from '../imports/components/layouts/MainLayout.jsx';
import NoFooter from "../imports/components/layouts/NoFooter.jsx";

import LandingScreen from '../imports/components/public/index.jsx';
import AboutScreen from '../imports/components/public/about.jsx';
import AdvertiseScreen from '../imports/components/public/footer/advertise.jsx';
import TermsScreen from '../imports/components/public/footer/terms.jsx'
import ContactScreen from '../imports/components/public/footer/contact.jsx';
import FaqScreen from "../imports/components/public/faq.jsx";
import ShowUserScreen from '../imports/components/users/show.jsx';
import EditEventScreen from '../imports/components/events/edit.jsx';
import OrganizeEventScreen from '../imports/components/events/organize.jsx';
import EventDiscoveryScreen from '../imports/components/events/discover/discover.jsx';
import PreviewEventScreen from '../imports/components/events/preview.jsx';
import PublishEventScreen from '../imports/components/events/publish.jsx';
import EventCreateScreen from '../imports/components/events/create.jsx';
import ApprovalScreen from '../imports/components/events/approval.jsx';
import GameSelectScreen from '../imports/components/games/game_select.jsx';
import GameApprovalScreen from '../imports/components/games/approval.jsx';
import UserOptionsScreen from "../imports/components/users/options.jsx";
import CurrencyPurchaseScreen from "../imports/components/public/currency_purchase.jsx";
import BracketShowScreen from "../imports/components/events/brackets/show.jsx";
import EventAdminScreen from "../imports/components/events/admin.jsx";
import BracketAdminScreen from "../imports/components/events/brackets/admin.jsx";
import CheckoutScreen from "../imports/components/events/checkout_temp.jsx";
import GamesIndexScreen from "../imports/components/games/index.jsx";

import CreateRunnableScreen from "../imports/components/generic/create_runnable.jsx";
import CreateLeagueScreen from "../imports/components/leagues/create.jsx";

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

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={LandingScreen} onEnter={isLoggedIn} />
      <Route path="dashboard" component={ShowUserScreen} onEnter={verifyUser} />
      <Route path="options" component={UserOptionsScreen} onEnter={verifyUser} />
      <Route path="about" component={AboutScreen} />
      <Route path="advertise" component={AdvertiseScreen} />
      <Route path="terms" component={TermsScreen} />
      <Route path="contact" component={ContactScreen} />
      <Route path="faq" component={FaqScreen} />
      <Route path="events/:slug/view" component={OrganizeEventScreen} />
      <Route path="events/:slug/publish" component={PublishEventScreen} />
      <Route path="events/discover" component={EventDiscoveryScreen} />
      <Route path="games/select" component={GameSelectScreen} />
      <Route path="events/:slug/brackets/:bracketIndex" component={BracketShowScreen} />
      <Route path="events/:slug/checkout" component={CheckoutScreen} />
      <Route path="admin" component={AdminFunctionScreen} />
      <Route path="games/index" component={GamesIndexScreen} />
      <Route path="create" component={CreateRunnableScreen} />
      <Route path="leagues/create" component={CreateLeagueScreen} />
    </Route>
    <Route path="/" component={NoFooter}>
      <Route path="events/create" component={EventCreateScreen} />
      <Route path="events/:slug/edit" component={EditEventScreen} />
      <Route path="events/:slug/admin" component={EventAdminScreen} />
      <Route path="events/:slug/show" component={PreviewEventScreen}/>
      <Route path="events/:slug/brackets/:bracketIndex/admin" component={BracketAdminScreen} />
    </Route>
  </Router>
)
