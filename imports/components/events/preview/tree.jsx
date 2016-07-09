import React, { Component } from "react";

// Non-editable preview version of the crowdfunding tree.

export default class CFTree extends Component {

  constructor(props) {
    super(props);

  }

  junction() {
    var kids = this.props.goals.children;
    var value = "";
    var temp = [(<div className="line horiz half"></div>), (<div className="line horiz half no-bg"></div>)];
    if(kids[0] && kids[2]){
      value = (
        <div className="line horiz"></div>
      )
    }
    else if(kids[0]) {
      value = temp;
    }
    else if(kids[2]){
      value = temp.reverse();
    }
    else {
      return (
        <div></div>
      )
    }
    return (
      <div className="row center">
        { value }
      </div>
    )
  }

  drawNodes() {
    var self = this;
    return (
      <div style={{width: 350}}>
        <div className="row center">
          <span>
            Start
          </span>
        </div>
        <div className="row center">
          <div className="line vert"></div>
        </div>
        <div className="row center">
          <span>
            { this.props.goals.name }
          </span>
        </div>
        <div className="row center">
          <div className="line vert"></div>
        </div>
        { this.junction() }
        <div className="row">
          {
            [0, 1, 2].map(function(key, index){
              var child = self.props.goals.children[key];
              if(child == null){
                return (
                  <div className="col-1"></div>
                );
              }
              return (
                <div className="col-1">
                  <div className="col x-center">
                    {
                      Object.keys(child.nodes).map(function(key_2, node){
                        var val = child.nodes[key_2];
                        return (
                          <div className="col x-center">
                            <div className="line vert"></div>
                            <span>{ val.name }</span>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    if(this.props.goals) {
      return this.drawNodes();
    }
    else {
      return (
        <div></div>
      )
    }
  }
}
