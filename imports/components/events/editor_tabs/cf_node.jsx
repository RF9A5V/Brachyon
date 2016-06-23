import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class CFNode extends Component {

  render() {
    style = {};
    val = 0;
    if(this.props.icon){
      style.backgroundImage = `url(${this.props.icon})`;
      style.backgroundSize = "100% 100%";
    }
    if(this.props.active){
      style.border = 'solid 4px #22FF22';
      val = -4;
    }
    return (
      <div className="spons-tree-node" onClick={this.props.handler} style={style}>
        {
          this.props.mode && this.props.mode == "add" ? (
            <FontAwesome name="plus" style={{color: 'black', fontSize: 20}}/>
          ) : (
            ""
          )
        }
        <span className="spons-tree-overlay" style={{right: this.props.level == 5 ? -24 + val : -6 + val, bottom: -6 + val}}>
          {
            this.props.level == 5 ? (
              "MAX"
            ) : (
              this.props.level
            )
          }
        </span>
      </div>
    );
  }
}
