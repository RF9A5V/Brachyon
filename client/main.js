import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/router.jsx';

import Events from '/imports/api/event/events.js';
import Games from '/imports/api/games/games.js';

Meteor.startup(() => {
  // code to run on server at startup
  render(renderRoutes(), document.getElementById('app'));
});
