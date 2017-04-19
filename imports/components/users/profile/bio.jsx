import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import Loader from "/imports/components/public/loader.jsx";


export default class UserBio extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
    Meteor.call("user.getSelectedGames", props.username, (err, data) => {
      if(err) {
        toastr.error("Error getting played games!");
      }
      else {
        this.setState({
          ready: true,
          games: data
        })
      }
    })
  }

  userGames(opts) {
    const gameObjs = this.state.games;
    console.log(gameObjs);
    const gamesPerRow = opts.mobile ? 1 : 2;
    var count = 0;
    var tempObj = [];
    while(count < gameObjs.length) {
      var index = Math.floor(count / 2);
      var subIndex = count % 2;
      if(subIndex == 0) {
        tempObj[index] = [gameObjs[count]];
      }
      else {
        tempObj[index].push(gameObjs[count]);
      }
      count += 1;
    }
    if(tempObj[tempObj.length - 1][1] == undefined) {
      tempObj[tempObj.length - 1][1] = null;
    }
    return (
      <div className="col">
        {
          tempObj.map((ar, j) => {
            return (
              <div className="row" style={{marginBottom: j == tempObj.length - 1 ? 0 : 20}}>
                {
                  ar.map((g, i) => {
                    if(g == null) {
                      return (
                        <div className="col-1">
                        </div>
                      )
                    }
                    return (
                      <div className="col col-1" style={{marginRight: ar.length - 1 == i ? 0 : 20}}>
                        <img src={g.bannerUrl} style={{width: "100%", height: "auto"}} />
                        <span style={{padding: 10, backgroundColor: "#111"}}>{ g.name }</span>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <div className="row center x-center" style={{padding: 50}}>
          <Loader animate={true} width={150} />
        </div>
      )
    }
    const spacing = 20;
    return (
      <div className="row" style={{padding: spacing}}>
        <div className="col col-1" style={{marginRight: spacing}}>
          <label className="input-label" style={{textAlign: "center", backgroundColor: "#666"}}>
            <span style={{textAlign: "center", textTransform: "uppercase"}}>
              User Bio
            </span>
          </label>
          <div style={{backgroundColor: "rgba(0, 0, 0, 0.8)", padding: spacing}}>
            Your rapidograph pens are fucking dried up, the x-acto blades in your bag are rusty, and your mind is dull. Stop clicking your mouse, get messy, go back to the basics and make something fucking original. If you fucking give up, you will achieve nothing. To surpass others is fucking tough, if you only do as you are told you don’t have it in you to succeed. Never let your guard down by thinking you’re fucking good enough. The details are not the details. They make the fucking design. A good fucking composition is the result of a hierarchy consisting of clearly contrasting elements set with distinct alignments containing irregular intervals of negative space. Sometimes it is appropriate to place various typographic elements on the outside of the fucking left margin of text to maintain a strong vertical axis. This practice is referred to as exdenting and is most often used with bullets and quotations. Why are you fucking reading all of this? Get back to work.

            Make your work consistent but not fucking predictable. Never, never assume that what you have achieved is fucking good enough. Use your fucking hands. When you design, you have to draw on your own fucking life experiences. If it’s not something you would want to read/look at/use then why fucking bother? Intuition is fucking important. If you fucking give up, you will achieve nothing. What’s important is the fucking drive to see a project through no matter what.

            Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. Form follows fucking function. This design is fucking brilliant. Nothing of value comes to you without fucking working at it. Sometimes it is appropriate to place various typographic elements on the outside of the fucking left margin of text to maintain a strong vertical axis. This practice is referred to as exdenting and is most often used with bullets and quotations. Don’t fucking lie to yourself.

            Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. Use your fucking hands. If you’re not being fucking honest with yourself how could you ever hope to communicate something meaningful to someone else? Never, never assume that what you have achieved is fucking good enough. Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. If you fucking give up, you will achieve nothing. When you sit down to work, external critics aren’t the enemy. It’s you who you must to fight against to do great fucking work. You must overcome yourself. Form follows fucking function.

            While having drinks with Tibor Kalman one night, he told me, “When you make something no one hates, no one fucking loves it.” Don’t get hung up on things that don’t fucking work. What’s important is the fucking drive to see a project through no matter what. Creativity is a fucking work-ethic. Don’t fucking lie to yourself. Don’t worry about what other people fucking think. Never let your guard down by thinking you’re fucking good enough. Design as if your fucking life depended on it.

            Learn from fucking criticism. Never let your guard down by thinking you’re fucking good enough. Never, never assume that what you have achieved is fucking good enough. Don’t fucking lie to yourself. You need to sit down and sketch more fucking ideas because stalking your ex on facebook isn’t going to get you anywhere. Your rapidograph pens are fucking dried up, the x-acto blades in your bag are rusty, and your mind is dull. Stop clicking your mouse, get messy, go back to the basics and make something fucking original.

            While having drinks with Tibor Kalman one night, he told me, “When you make something no one hates, no one fucking loves it.” Saul Bass on failure: Failure is built into creativity… the creative act involves this element of ‘newness’ and ‘experimentalism,’ then one must expect and accept the fucking possibility of failure. Creativity is a fucking work-ethic. Why are you fucking reading all of this? Get back to work.

            If you fucking give up, you will achieve nothing. To surpass others is fucking tough, if you only do as you are told you don’t have it in you to succeed. Your rapidograph pens are fucking dried up, the x-acto blades in your bag are rusty, and your mind is dull. Stop clicking your mouse, get messy, go back to the basics and make something fucking original. Must-do is a good fucking master. What’s important is the fucking drive to see a project through no matter what. Form follows fucking function. Saul Bass on failure: Failure is built into creativity… the creative act involves this element of ‘newness’ and ‘experimentalism,’ then one must expect and accept the fucking possibility of failure. A good fucking composition is the result of a hierarchy consisting of clearly contrasting elements set with distinct alignments containing irregular intervals of negative space.

            Your rapidograph pens are fucking dried up, the x-acto blades in your bag are rusty, and your mind is dull. Stop clicking your mouse, get messy, go back to the basics and make something fucking original. Creativity is a fucking work-ethic. Intuition is fucking important. Use your fucking hands. Think about all the fucking possibilities. If you’re not being fucking honest with yourself how could you ever hope to communicate something meaningful to someone else?
          </div>
        </div>
        <div className="col col-1">
          <label className="input-label" style={{textAlign: "center", backgroundColor: "#666"}}>
            <span style={{textTransform: "uppercase"}}>
              Games Played
            </span>
          </label>
          <div style={{padding: spacing, backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
            {
              this.userGames(opts)
            }
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false
    });
  }
}
