import React, { Component } from 'react';
import AccordionContainer from '/imports/components/public/accordion_container.jsx';
import DetailsPanel from './create/details.jsx';

export default class EventCreateScreen extends Component {

  accordionItems() {
    return [
      {
        title: 'Details',
        content: (<DetailsPanel />)
      },
      {
        title: 'Revenue',
        content: (<div>2</div>)
      },
      {
        title: 'Organization',
        content: (<div>3</div>)
      },
      {
        title: 'Sponsors',
        content: (<div>4</div>)
      }
    ]
  }

  render() {
    return (
      <div className='box'>
        <div className='col x-center'>
          <h2>Create an Event</h2>
          {
            this.accordionItems().map(function(item){
              return (<AccordionContainer { ...item } />)
            })
          }
        </div>
      </div>
    )
  }
}
