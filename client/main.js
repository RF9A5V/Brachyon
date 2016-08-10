import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/router.jsx';

import Events from '/imports/api/event/events.js';
import Games from '/imports/api/games/games.js';
import ProfileBanners from "/imports/api/users/profile_banners.js";

Meteor.startup(() => {
  // code to run on server at startup

  toastr.options.progressBar = true;
  toastr.options.positionClass = "toast-bottom-right";

  render(renderRoutes(), document.getElementById('app'));
});
