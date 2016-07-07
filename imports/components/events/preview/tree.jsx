import React, { Component } from "react";

// Non-editable preview version of the crowdfunding tree.

export default class CFTree extends Component {

  constructor(props) {
    super(props);

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
        {
          this.props.goals.children[0] ? (
            ""
          ) : (
            <div className="row center">

              {
                this.props.goals.children[1] == null ? (
                  <div className="line horiz half no-bg"></div>
                ) : (
                  <div className="line horiz half"></div>
                )
              }
              {
                this.props.goals.children[2] == null ? (
                  <div className="line horiz half no-bg"></div>
                ) : (
                  <div className="line horiz half"></div>
                )
              }
            </div>
          )
        }

        <div className="row">
          {
            Object.keys(this.props.goals.children).map(function(key, index){
              var child = self.props.goals.children[key];
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
