import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import React from 'react';
import { render } from 'react-dom';

import './main.html';
import App from '../imports/public/app.js';
import Header from '../imports/public/index/header.js';

Meteor.startup(() => {
  render(<App />, document.getElementById('app'));
  render(<Header />, document.querySelector('header'));
});
