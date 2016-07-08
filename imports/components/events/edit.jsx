import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SideTabs from "/imports/components/public/side_tabs.jsx";

import DetailsPanel from "./edit/details.jsx";
import OrganizationPanel from "./edit/organization.jsx";
import RevenuePanel from "./edit/revenue.jsx";
import PromotionPanel from "./edit/promotion.jsx";
import SubmitPanel from "./edit/submit.jsx";

import LoadingScreen from "../public/loading.jsx";

export default class EditEventScreen extends TrackerReact(React.Component){

  constructor(props) {
    super(props);
    this.state = {
      detailsSuite: {}
    }
  }

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", self.props.params.eventId)
    });
    var obj = {};
    ["details", "organize", "revenue", "promotion"].map((function(val){
      obj[val] = (function(attrs) {
        var findDiff = (
          function(object, item) {
            if(object == null){
              return null;
            }
            var current = {};
            Object.keys(object).map((function(key){
              if(typeof object[key] == "object"){
                var diffOrNull;
                if(item){
                  diffOrNull = item[key];
                }
                var check = findDiff(object[key], diffOrNull);
                if(check != null && Object.keys(check).length){
                  current[key] = check;
                }
              }
              else {
                if(!item || item[key] != object[key]){
                  current[key] = object[key];
                }
              }
            }).bind(this));
            return current;
          }
        )
        var diff = self.event()[val];
        var end = findDiff(attrs, diff);

        if(Object.keys(end).length == 0){
          toastr.success("Nothing to update!");
          return;
        }

        Meteor.call(`events.update_${val}`, self.event()._id, end, function(err){
          if(err){
            toastr.error(`Error updating ${val}.\n${err.reason}`);
          }
          else {
            toastr.success(`Successfully updated ${val}!`);
            self.state.event.stop();
            self.setState({
              event: Meteor.subscribe("event", self.props.params.eventId)
            })
          }
        })
      });
    }).bind(this));

    this.state.updateSuite = obj;

  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  items() {
    return ["Details", "Organization", "Revenue", "Promotion", "Submit"];
  }

  content() {
    event = this.event();
    return [
      (<DetailsPanel {...event.details} ref="details" updateSuite={this.state.updateSuite.details}/>),
      (<OrganizationPanel {...event.organize} ref="organization" updateSuite={this.state.updateSuite.organize} />),
      (<RevenuePanel {...event.revenue} ref="revenue" updateSuite={this.state.updateSuite.revenue} />),
      (<PromotionPanel />),
      (<SubmitPanel requiresApproval={event.revenue.active} id={event._id} />)
    ]
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <LoadingScreen />
      )
    }
    else {
      return (
        <div className="box col" style={{flexFlow: "row"}}>
          <SideTabs items={this.items()} panels={this.content()} />
        </div>
      )
    }
  }
}
