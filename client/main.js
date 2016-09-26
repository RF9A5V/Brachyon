import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/router.jsx';
import Modal from "react-modal";

import Events from '/imports/api/event/events.js';
import Games from '/imports/api/games/games.js';
import ProfileBanners from "/imports/api/users/profile_banners.js";

Meteor.startup(() => {
  // code to run on server at startup

  toastr.options.progressBar = true;
  toastr.options.positionClass = "toast-bottom-right";

  var overlay = Modal.defaultStyles.overlay;

  overlay.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.display = "flex";
  overlay.justifyContent = "center";
  overlay.alignItems = "center";
  overlay.zIndex = "3";

  var content = Modal.defaultStyles.content;

  content.border = "none";
  content.borderRadius = 0;
  content.backgroundColor = "#000";
  content.height = "60%";
  content.width = "50%";
  content.position = "relative";
  content.top = 0;
  content.left = 0;

  render(renderRoutes(), document.getElementById('app'));
});
