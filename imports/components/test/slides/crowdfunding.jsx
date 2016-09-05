import React, { Component } from "react";

export default class CrowdfundingPage extends Component {

  backgroundImage(useDarkerOverlay){
    if(useDarkerOverlay){
      return "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
    }
    return "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
  }

  render() {
    return (
      <div className="slide-page-container">
        <div className="slide-page row" style={{background: this.backgroundImage(true)}}>
          <div className="col-3 col cf-main">
            <div className="row x-center">
              <div className=" col col-3 cf-progress">
                <span className="cf-progress-amount">
                  $600 out of $1000
                </span>
                <div className="cf-progress-container">
                  <div className="cf-progress-display" style={{width: "63%"}}></div>
                </div>
              </div>
              <div className="cf-leaderboard col-2">
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
            <div className="cf-strategy">
            </div>
          </div>
          <div className="col-1 col cf-tiers">
            {
              [0, 1, 2, 3, 4].map((i) => {
                return (
                  <div className="cf-tier col">
                    <div className="row flex-pad x-center">
                      <span className="cf-amount">
                        ${2 ** i}
                      </span>
                      <span className="cf-limit">
                        100 Remaining
                      </span>
                    </div>
                    <p className="cf-description">
                      Bacon ipsum dolor amet meatball corned beef strip steak spare ribs venison frankfurter turducken salami porchetta pork chop bacon boudin shank. Cow prosciutto venison, tenderloin fatback swine pork belly jerky alcatra tongue.
                    </p>
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
