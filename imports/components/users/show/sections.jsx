import React, { Component } from "react";

import UserEvents from "./events.jsx";
import UserStats from "./stats.jsx";

export default class UserSections extends Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 0,
      sections: []
    }
  }

  onEventSubscriptionChange(subName, page) {
    this.props.setEventSubscription(subName, page);
  }

  componentWillMount() {
    this.setState({
      sections: [
        {
          name: "Events",
          component: <UserEvents onAction={this.onEventSubscriptionChange.bind(this)} isReady={this.props.isReady} />
        }
        // {
        //   name: "Stats",
        //   component: <UserStats />
        // }
        // {
        //   name: "Sponsorship",
        //   component: <div>3</div>
        // },
        // {
        //   name: "History",
        //   component: <div>4</div>
        // },
        // {
        //   name: "Achievements",
        //   component: <div>5</div>
        // }
      ],
    })
  }

  render() {
    return (
      <div className="col center x-center" style={{padding: 30}}>
        <div className="row center">
          {
            this.state.sections.map((section, i) => {
              return (
                <div className={`tab-header col`} onClick={() => { this.setState({section: i}) }}>
                  <h5>{ section.name }</h5>
                  <hr className="user-divider" style={{ width: "100%", borderColor: this.state.section == i ? "#FF6000" : "inherit" }}></hr>
                </div>
              )
            })
          }
        </div>
        {
          this.state.sections[this.state.section].component
        }
      </div>
    )
  }
}
