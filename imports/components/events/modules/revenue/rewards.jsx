import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import Editor from "/imports/components/public/editor.jsx";

import ImageForm from "/imports/components/public/img_form.jsx";
import Loading from "/imports/components/public/loading.jsx";

import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

export default class RewardsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: -1,
      description: "",
      loadDescription: false,
      ready: false
    };
  }

  onDescriptionChange(value) {
    this.setState({
      description: value
    })
  }

  createReward(data) {
    var name = this.refs.name.value;
    var img = data._id;
    var desc = this.state.description;
    Meteor.call("events.crowdfunding.createReward", Events.findOne()._id, name, img, desc, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setCurrentReward(-1);
        this.setState({
          ready: false
        });
        return toastr.success("Successfully created reward!", "Success!");
      }
    })
  }

  saveReward(data) {
    var name = this.refs.name.value;
    var img = data._id;
    var desc = this.state.description;
    Meteor.call("events.crowdfunding.editReward", Events.findOne()._id, this.state.active, name, img, desc, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!")
      }
      else {
        this.setState({
          imgID: img,
          ready: false
        });
        return toastr.success("Successfully edited reward!", "Success!");
      }
    })
  }

  onUploadedCallback() {
    if(this.state.active < 0) {
      return this.createReward.bind(this);
    }
    else {
      return this.saveReward.bind(this);
    }
  }

  onRewardSave() {
    this.refs.image.value();
  }

  setCurrentReward(index) {
    if(index >= 0) {
      var reward = Events.findOne().crowdfunding.rewards[index];
      this.setState({
        active: index,
        description: reward.description,
        loadDescription: true,
        img: null,
        imgID: reward.img
      });
      this.refs.name.value = reward.name;
    }
    else {
      this.setState({
        active: -1,
        description: "",
        loadDescription: true,
        img: null,
        imgID: null
      });
      this.refs.name.value = "";
    }
    setTimeout(() => {
      this.setState({
        loadDescription: false
      })
    }, 400);
  }

  render() {
    if(!this.state.ready) {
      var reward = Meteor.subscribe("rewardImgs", Events.findOne()._id, {
        onReady: () => {
          this.setState({ready: true, rewardImgs: reward});
          if(this.state.active >= 0) {
            this.setCurrentReward(this.state.active);
          }
        }
      });
      return (
        <Loading />
      );
    }
    return (
      <div className="submodule-bg submodule-overflow">
        <div className="row x-center" style={{marginBottom: 10}}>
          <div className="col-1"></div>
          <h3 style={{margin: 0}}>Rewards</h3>
          <div className="row col-1">
            <div className="col-1">
            </div>
            <button onClick={this.onRewardSave.bind(this)}>Save</button>
          </div>
        </div>
        <div className="row">
          <div className="reward-preview-container">
            {
              (Events.findOne().crowdfunding.rewards || []).map((reward, i) => {
                return (
                  <div className={`cf-reward ${this.state.active == i ? "active" : ""}`} onClick={() => {this.setCurrentReward(i)}}>
                    <span>{ reward.name }</span>
                  </div>
                )
              })
            }
            <div className={`cf-reward ${this.state.active == -1 ? "active" : ""}`} onClick={() => { this.setCurrentReward(-1) }}>
              <FontAwesome name="plus" />
              <span>Add Reward</span>
            </div>
          </div>
          <div className="reward-preview-form col-1 col center x-center">
            {
              this.state.loadDescription ? (
                <Loading />
              ) : (
                <ImageForm collection={RewardIcons} callback={this.onUploadedCallback()} ref="image" defaultImage={this.state.img} onImgSelected={(img) => {
                  this.setState({ img, imgID: null, loadDescription: true });
                  setTimeout(() => { this.setState({loadDescription: false}) })
                }} id={this.state.imgID} />
              )
            }
          </div>
          <div className="reward-preview-form col-1 col">
            <label>Prize Name</label>
            <input type="text" ref="name" style={{marginTop: 0}} />
            <label>Description</label>
            {
              this.state.loadDescription ? (
                <Loading />
              ) : (
                <Editor ref="description" usePara={true} onChange={this.onDescriptionChange.bind(this)} value={this.state.description}/>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
