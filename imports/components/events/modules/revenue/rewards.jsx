import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import Editor from "/imports/components/public/editor.jsx";

import ImageForm from "/imports/components/public/img_form.jsx";
import Loading from "/imports/components/public/loading.jsx";

import Rewards from "/imports/api/sponsorship/rewards.js";
import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

export default class RewardsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: null,
      loadDescription: false,
      ready: false
    };
  }

  componentWillUnmount() {
    if(this.state.rewards) {
      this.state.rewards.stop();
    }
  }

  onDescriptionChange(value) {
    this.setState({
      description: value
    })
  }

  onRewardSave() {
    var name = this.refs.name.value;
    var desc = this.state.description;
    var value = this.refs.dollarValue.value * 100;
    var eventId = Events.findOne()._id;
    if(!this.state.active) {
      if(!this.refs.image.hasValue()) {
        return toastr.error("Need to supply image!", "Error!");
      }
      Meteor.call("events.crowdfunding.createReward", eventId, name, desc, value, (err, reward) => {
        this.refs.image.setMeta("rewardId", reward);
        this.refs.image.value((data) => {
          this.refs.image.reset();
          this.setState({
            ready: false,
            active: null
          });
          return toastr.success("Successfully created reward!", "Success!");
        })
      })
    }
    else {
      this.refs.image.setMeta("rewardId", this.state.active);
      Meteor.call("events.crowdfunding.editReward", this.state.active, name, desc, value, (err) => {
        var complete = () => {
          this.setState({
            ready: false
          });
          return toastr.success("Successfully edited reward!", "Success!");
        }
        if(this.refs.image.hasValue()) {
          this.refs.image.setMeta("rewardId", this.state.active);
          this.refs.image.value((data) => {
            this.refs.image.reset();
            complete();
          });
        }
        else {
          complete();
        }
      })
    }
  }

  swap() {
    this.setState({ loadDescription: true, img: null });
    setTimeout(() => {
      this.setState({ loadDescription: false });
    }, 400);
    this.refs.image.reset();
  }

  render() {
    if(!this.state.ready) {
      if(this.state.rewards) {
        this.state.rewards.stop();
      }
      var reward = Meteor.subscribe("rewards", Events.findOne().slug, {
        onReady: () => {
          this.setState({ready: true, rewards: reward});
        }
      });
      return (
        <Loading />
      );
    }
    var reward = Rewards.findOne({ _id: this.state.active}) || {};
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
              Rewards.find({}).map((rewardIter, i) => {
                return (
                  <div className={`cf-reward ${rewardIter._id == this.state.active ? "active" : ""}`} onClick={() => { this.setState({ active: rewardIter._id }); this.swap(); }}>
                    <span>{ rewardIter.name }</span>
                  </div>
                )
              })
            }
            <div className={`cf-reward ${this.state.active == null ? "active" : ""}`} onClick={() => { this.setState({ active: null }); this.swap();}}>
              <FontAwesome name="plus" />
              <span>Add Reward</span>
            </div>
          </div>
          <div className="reward-preview-form col-1 col center x-center">
            {
              this.state.loadDescription ? (
                <Loading />
              ) : (
                <ImageForm collection={RewardIcons} url={reward.imgUrl} ref="image" defaultImage={this.state.img} onImgSelected={(img) => {
                  this.setState({ img });
                }} />
              )
            }
          </div>
          <div className="reward-preview-form col-1 col">
            {
              this.state.loadDescription ? (
                <Loading />
              ) : (
                [
                  <label>Prize Name</label>,
                  <input type="text" ref="name" style={{marginTop: 0}} defaultValue={reward.name} />,
                  <label>Nominal Value</label>,
                  <input type="number" ref="dollarValue" style={{marginTop: 0}} defaultValue={(reward.value / 100).toFixed(2)} />,
                  <label>Description</label>,
                  <Editor ref="description" usePara={true} onChange={this.onDescriptionChange.bind(this)} value={reward.description}/>
                ]
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
