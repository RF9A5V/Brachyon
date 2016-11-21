import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import Editor from "/imports/components/public/editor.jsx";

import ImageForm from "/imports/components/public/img_form.jsx";

import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

export default class RewardsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: -1
    }
  }


  render() {
    return (
      <div className="submodule-bg submodule-overflow">
        <div className="row">
          <div className="col-1"></div>
          <h3>Rewards</h3>
          <div className="row col-1">
            <div className="col-1">
            </div>
            <button>Save</button>
          </div>
        </div>
        <div className="row">
          <div className="reward-preview-container">
            <div className={`cf-reward ${this.state.active == -1 ? "active" : ""}`}>
              <FontAwesome name="plus" />
              <span>Add Reward</span>
            </div>
          </div>
          <div className="reward-preview-form col-1 col center x-center">
            <ImageForm collection={RewardIcons} />
          </div>
          <div className="reward-preview-form col-1 col">
            <label>Prize Name</label>
            <input type="text" ref="name" style={{marginTop: 0}} />
            <label>Description</label>
            <Editor ref="description" usePara={true} />
          </div>
        </div>
      </div>
    )
  }
}
