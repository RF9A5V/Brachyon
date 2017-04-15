import React, { Component } from "react";

export default class Loader extends Component {

  render() {
    return (
      <svg
       className={this.props.animate ? "animate" : ""}
       viewBox={this.props.animate ? `70 30 410 420` : "0, 0, 350, 280"}
       width={this.props.width}>

      <defs
         id="defs40" />
      <g
         id="g3716"
         transform={this.props.animate ? "translate(100, 100)" : ""}
         style={{display:"inline"}}>
        <path
           id="path3720"
           className="square"
           style={{display:"inline", fill:"#00bdff", strokeWidth:1}}
           d="m 142.39666,107.32774 -0.14258,32.14258 c -0.0784,17.67858 -0.0224,32.45383 0.12305,32.83398 0.20913,0.54645 7.0698,0.66094 32.83398,0.54883 l 32.57031,-0.14258 v -32.6914 -32.69141 h -32.6914 z" />
        <path
           id="path4611"
           className="brackets"
           d="M 24.041195,227.06045 23.901099,173.9011 11.950549,173.75303 0,173.60495 V 143.68132 113.7577 l 11.950549,-0.14808 11.95055,-0.14808 0.13993,-56.730769 L 24.180958,0 h 44.783745 44.783757 l -0.14347,22.664836 -0.14345,22.664836 -21.703298,0.274725 -21.703297,0.274725 v 94.230768 94.23078 l 21.703297,0.27472 21.703298,0.27473 0.14345,22.66483 0.14347,22.66484 H 68.964874 24.18129 Z m 212.353815,30.4945 0.14345,-22.66483 21.7033,-0.27473 21.70329,-0.27472 V 140.10989 45.879122 L 258.24176,45.604397 236.53846,45.329672 236.39501,22.664836 236.25154,0 h 44.78376 44.78374 l 0.13993,56.730771 0.13993,56.730769 11.95055,0.14808 L 350,113.7577 v 29.92362 29.92363 l -11.95055,0.14808 -11.95055,0.14807 -0.14009,53.15935 -0.1401,53.15934 h -44.78358 -44.78359 z"
           style={{display:"inline", fill:"#ff6000", strokeWidth:1}} />
      </g>
    </svg>
    )
  }
}
