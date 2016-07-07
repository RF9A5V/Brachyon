import React, { Component } from "react";
import AccordionContainer from "/imports/components/public/accordion_container.jsx";
import DetailsPanel from "./create/details.jsx";
import RevenuePanel from "./create/revenue.jsx";
import OrganizationPanel from "./create/organization.jsx";

export default class EventCreateScreen extends Component {

  componentWillMount() {
    this.setState({
      active: 0,
      valid: false,
      orgValid: true,
      usingRevenue: false,
      revenueValid: false,
      requiresReview: false
    });
  }

  onClick(e) {
    e.preventDefault();
    if(e.target.classList.contains("inactive")){
      toastr.error("Form is incomplete. Finish it.");
      return;
    }
    var details = this.refs.details.value();
    var organize = this.refs.organization.value();
    var revenue = this.refs.revenue.value();
    var obj = {
      details,
      organize,
      revenue
    };
    Meteor.call("events.create", obj, function(err){

      if(err){
        toastr.error(err.reason);
      }
      else {
        window.location = "/"
      }
    });
  }

  saveForAdv(e) {
    e.preventDefault();
    var details = this.refs.details.value();
    var organize = this.refs.organization.value();
    var revenue = this.refs.revenue.value();
    var obj = {
      details,
      organize,
      revenue
    };
    Meteor.call("events.save_for_advanced", obj, function(err, data){
      if(err){
        toastr.error(err.reason);
      }
      else {
        window.location = `/events/${data}/edit`;
      }
    });
  }

  setValid(valid) {
    this.setState({valid})
  }

  orgValid(valid) {
    this.setState({orgValid: valid})
  }

  revValid(usingRevenue, revenueValid) {
    this.setState({
      usingRevenue,
      revenueValid
    })
  }

  accordionItems() {
    return [
      {
        title: "Details",
        content: (<DetailsPanel ref="details" onChange={this.setValid.bind(this)} />)
      },
      {
        title: "Organization",
        content: (<OrganizationPanel ref="organization" onChange={this.orgValid.bind(this)} />)
      },
      {
        title: "Revenue",
        content: (<RevenuePanel ref="revenue" onChange={this.revValid.bind(this)} />)
      }
    ];
  }

  buttons() {
    var valid = this.state.valid && this.state.orgValid;
    return (
      <div style={{marginBottom: 20}}>
        {
          this.state.usingRevenue ? (
            <button className={`${valid && this.state.revenueValid ? "active" : "inactive"}`}>Submit for Review</button>
          ) : (
            <button onClick={this.onClick.bind(this)} className={`${valid ? "active" : "inactive"}`}>Publish</button>
          )
        }
        <button style={{marginLeft: 10}} onClick={this.saveForAdv.bind(this)}>Advanced Options</button>
      </div>
    );
  }

  render() {
    var self = this;
    return (
      <div className='box'>
        <div className='col x-center'>
          <h2>Create an Event</h2>
          {
            this.accordionItems().map(function(item, index){
              return (
                <AccordionContainer title={item.title} open={self.state.active === index}
                handler={ () =>
                  {
                    self.setState({ active: (index !== self.state.active ? index : -1) })
                  } }
                >
                  { item.content }
                </AccordionContainer>
              )
            })
          }
          {
            this.buttons()
          }
        </div>
      </div>
    )
  }
}
