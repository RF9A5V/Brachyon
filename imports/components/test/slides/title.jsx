import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

export default class EventTitlePage extends Component {

  constructor() {
    super();
    this.state = {
      pageIndex: 0
    }
  }

  backgroundImage(useDarkerOverlay){
    if(useDarkerOverlay){
      return "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
    }
    return "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
  }

  onMoveToDetails() {
    this.setState({
      pageIndex: 1
    })
  }

  render() {
    return (
      <div className="slide-page-container">
        <div className="slide-page row" style={{display: this.state.pageIndex == 0 ? "flex" : "none", background: this.backgroundImage(false)}}>
          <div className="col flex-pad col-1">
            <div className="col">
              <div className="row" style={{justifyContent: "space-around", marginTop: 20}}>
                {
                  [0, 1, 2].map(() => {
                    return (
                      <div className="col x-center">
                        <img src="/images/profile.png" className="big-name-img" />
                        <span>Profile</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div>
              {
                [2, 1, 0.5].map((i) => {
                  return (
                    <div className="sponsor-item col center">
                      <div className="row x-center">
                        <img src="/images/profile.png" />
                        <span>Username - ${i * 1000}</span>
                      </div>
                      <p>
                        Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl.
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="col col-3 center x-center">
            <div className="col-1">
            </div>
            <div className="col center x-center col-2">
              <h3>Title</h3>
              <div>CF Amount</div>
              <div className="row">
                <button style={{marginRight: 10}}>Play</button>
                <button>Watch</button>
              </div>
            </div>
            <div className="col col-1" style={{justifyContent: "flex-end", paddingBottom: 10}}>
              <FontAwesome name="chevron-down" size="2x" onClick={this.onMoveToDetails.bind(this)} />
            </div>
          </div>
          <div className="col col-1">

          </div>
        </div>
        <div className="slide-page" style={{display: this.state.pageIndex == 1 ? "flex" : "none", background: this.backgroundImage(true)}}>
          <div className="slide-page-up">
            <div className="slide-control" onClick={() => { this.setState({ pageIndex: 0 }) }}>
              <FontAwesome name="chevron-up" size="2x" />
            </div>
          </div>
          <div className="col col-3">
          <div className="slide-description">
            <p>
              Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick. Leberkas ball tip andouille, jowl capicola chicken ribeye alcatra porchetta sirloin jerky tongue sausage.
            </p>
            <p>
              Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick. Leberkas ball tip andouille, jowl capicola chicken ribeye alcatra porchetta sirloin jerky tongue sausage.
            </p>
            <p>
              Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick. Leberkas ball tip andouille, jowl capicola chicken ribeye alcatra porchetta sirloin jerky tongue sausage.
            </p>
            <p>
              Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick. Leberkas ball tip andouille, jowl capicola chicken ribeye alcatra porchetta sirloin jerky tongue sausage.
            </p>
          </div>
            <div className="slide-schedule">
              <div className="schedule-item">
                <h3>Schedule</h3>
              </div>
              {
                [0, 1, 2, 3, 4, 5].map((i) => {
                  return (
                    <div className="schedule-item">
                      <span>{ moment().hour(i).format("h:mm") }</span>
                      <p>
                        Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue. Drumstick filet mignon fatback, picanha bresaola pancetta pastrami short ribs tongue strip steak turducken meatloaf brisket jowl. Salami jowl pastrami, ham hock biltong turducken doner tri-tip short ribs capicola pork loin alcatra pork belly cupim drumstick.
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="col x-center col-1 slide-bracket-list">
            {
              [0, 1, 2].map(() => {
                return (
                  <div className="slide-bracket">
                    <img src="/images/bg.jpg" />
                    <span>Bracket Name</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
