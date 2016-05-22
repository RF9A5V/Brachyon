import React from 'react';
import { mount } from 'react-mounter';

import App from './components/app.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';

FlowRouter.route('/', {
  action: function() {
    mount(MainLayout, {
      content: (<App page="main"/>)
    })
  }
})

FlowRouter.route('/users/show', {
  action: function() {
    mount(MainLayout, {
      content: (<App page="userShow" />)
    })
  }
})

FlowRouter.route('/events/:eventId/edit', {
  action: function(params, queryParams) {
    mount(MainLayout, {
      content: (<App page="eventEdit" id={params.eventId} />)
    })
  }
})
