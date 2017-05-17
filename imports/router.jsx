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
import EventDiscoveryScreen from '../imports/components/events/discover/discover.jsx';
import PreviewEventScreen from '../imports/components/events/preview.jsx';
import EventCreateScreen from '../imports/components/events/create.jsx';
import UserOptionsScreen from "../imports/components/users/options.jsx";
import BracketShowScreen from "../imports/components/events/brackets/show.jsx";
import EventAdminScreen from "../imports/components/events/admin.jsx";
import BracketAdminScreen from "../imports/components/events/brackets/admin.jsx";
import GamesIndexScreen from "../imports/components/games/index.jsx";
import OrganizationCreateScreen from "../imports/components/organizations/create.jsx";
import OrganizationShowScreen from "../imports/components/organizations/show.jsx";
import GameHubScreen from "../imports/components/games/hub.jsx";
import PrivacyPolicyScreen from "../imports/components/public/privacy.jsx";
import ForgotPassScreen from "../imports/components/public/forgot_pass.jsx";
import ResetPassScreen from "../imports/components/public/reset_pass.jsx";
import ShortLinkScreen from "../imports/components/public/short_link.jsx";
import UserProfileScreen from "../imports/components/users/profile.jsx";

import Sandbox from "../imports/components/sandbox/message.jsx";

import CreateRunnableScreen from "../imports/components/generic/create_runnable.jsx";
import CreateLeagueScreen from "../imports/components/leagues/create.jsx";
import EditLeagueScreen from "../imports/components/leagues/edit.jsx";
import ShowLeagueScreen from "../imports/components/leagues/show.jsx";

import CreateBracketScreen from "../imports/components/brackets/create.jsx";

import AdminFunctionScreen from "../imports/components/admin/main.jsx";

function isLoggedIn(nextState, replace){
  if(Meteor.userId()) {
    replace("/dashboard");
  }
}

function verifyUser(nextState, replace) {
  if(!Meteor.userId()){
    replace('/');
  }
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={NoFooter}>
      <IndexRoute component={LandingScreen} onEnter={isLoggedIn} />
      <Route path="events/create" component={EventCreateScreen} />
      <Route path="event/:slug/edit" component={EventAdminScreen} />
      <Route path="event/:slug" component={PreviewEventScreen} />
      <Route path="event/:slug/:slide" component={PreviewEventScreen} />
      <Route path="event/:slug/bracket/:bracketIndex" component={BracketShowScreen} />
      <Route path="event/:slug/bracket/:bracketIndex/admin" component={BracketAdminScreen} />
      <Route path="leagues/create" component={CreateLeagueScreen} />
      <Route path="league/:slug/edit" component={EditLeagueScreen} />
      <Route path="league/:slug/admin" component={EditLeagueScreen} />
      <Route path="league/:slug" component={ShowLeagueScreen} />
      <Route path="league/:slug/:slide" component={ShowLeagueScreen} />
      <Route path="bracket/:slug" component={BracketShowScreen} />
      <Route path="bracket/:slug/admin" component={BracketAdminScreen} />
      <Route path="orgs/create" component={OrganizationCreateScreen} />
      <Route path="org/:slug" component={OrganizationShowScreen} />
      <Route path="admin" component={AdminFunctionScreen} />
      <Route path="user/:username" component={UserProfileScreen}/>
      <Route path="/_:id" component={ShortLinkScreen} />
      <Route path="/sandbox" component={Sandbox} />
    </Route>

    <Route path="/" component={MainLayout}>
      <Route path="dashboard" component={ShowUserScreen} onEnter={verifyUser} />
      <Route path="options" component={UserOptionsScreen} onEnter={verifyUser} />
      <Route path="about" component={AboutScreen} />
      <Route path="advertise" component={AdvertiseScreen} />
      <Route path="terms" component={TermsScreen} />
      <Route path="contact" component={ContactScreen} />
      <Route path="faq" component={FaqScreen} />
      <Route path="discover" component={EventDiscoveryScreen} />
      <Route path="games/index" component={GamesIndexScreen} />
      <Route path="create" component={CreateRunnableScreen} />
      <Route path="brackets/create" component={CreateBracketScreen} />
      <Route path="game/:slug" component={GameHubScreen} />
      <Route path="/privacy" component={PrivacyPolicyScreen} />
      <Route path="forgot_pw" component={ForgotPassScreen} />
      <Route path="reset_password/:token" component={ResetPassScreen} />
    </Route>
  </Router>
)
