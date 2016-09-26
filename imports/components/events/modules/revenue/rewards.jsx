import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import ImageForm from "/imports/components/public/img_form.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

class RewardForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
  }

  onRewardSave(data) {
    Meteor.call("events.crowdfunding.rewards.createReward", this.props.id, this.refs.name.value, data._id, this.refs.description.value, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onComplete();
        toastr.success("Successfully created reward!", "Success!");
      }
    })
  }

  onRewardEdit(data) {
    Meteor.call("events.crowdfunding.rewards.editReward", this.props.id, this.refs.name.value, data._id, this.refs.description.value, this.props.index, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onComplete();
        toastr.success("Successfully edited reward!", "Success!");
      }
    })
  }

  onRewardDelete() {
    Meteor.call("events.crowdfunding.rewards.deleteReward", this.props.id, this.props.index, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onComplete();
        toastr.success("Successfully deleted reward!", "Success!");
      }
    })
  }

  render() {
    var reward = this.props.reward;
    if(reward) {
      return (
        <div className="col">
          <h5>Reward Name</h5>
          <input type="text" placeholder="Name" ref="name" defaultValue={ reward.name } />
          <div className="col x-center" style={{textAlign: "center"}}>
            {
              this.state.selected ? (
                ""
              ) : (
                <img src={reward.imgUrl} style={{width: "25%"}} />
              )
            }
            <ImageForm aspectRatio={1} collection={ProfileImages} ref="img" callback={ this.onRewardEdit.bind(this) } onSelect={() => { this.setState({selected: true}) }} />
          </div>
          <h5>Reward Description</h5>
          <textarea placeholder="Description" ref="description" defaultValue={ reward.description }></textarea>
          <div className="row center">
            <button onClick={ () => { this.refs.img.value() } } style={{marginRight: 10}}>Save</button>
            <button onClick={ this.onRewardDelete.bind(this) }>Delete</button>
          </div>
        </div>
      )
    }
    return (
      <div className="col">
        <h5>Reward Name</h5>
        <input type="text" placeholder="Name" ref="name" />
        <div className="col x-center" style={{textAlign: "center"}}>
          <ImageForm aspectRatio={1} collection={ProfileImages} ref="img" callback={ this.onRewardSave.bind(this) } />
        </div>
        <h5>Reward Description</h5>
        <textarea placeholder="Description" ref="description"></textarea>
        <div className="row center">
          <button onClick={ () => { this.refs.img.value() } }>Submit</button>
        </div>
      </div>
    )
  }
}

export default class RewardsPage extends Component {

  constructor() {
    super();
    this.state = {
      id: Events.findOne()._id,
      open: false,
      reward: null
    }
  }

  toggleModal() {
    this.setState({
      reward: null,
      open: !this.state.open
    });
  }

  setRewardForEdit(reward, index) {
    this.setState({
      reward,
      open: true,
      index
    })
  }

  render() {
    var rewards = (Events.findOne().crowdfunding || {}).rewards || [];
    return (
      <div>
        <div className="button-row">
          <button>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center">
            <h3>Rewards</h3>
          </div>
          <div className="block-container">
            {
              rewards.map((reward, i) => {
                return (
                  <div className="block reward" onClick={() => {this.setRewardForEdit(reward, i)}}>
                    <img src={ reward.imgUrl } />
                    <div>
                      <span>{ reward.name }</span>
                    </div>
                  </div>
                )
              })
            }

            <Modal isOpen={this.state.open} onRequestClose={ this.toggleModal.bind(this) }>
              <RewardForm id={this.state.id} reward={this.state.reward} index={this.state.index} onComplete={this.toggleModal.bind(this)} ref="form" />
            </Modal>
          </div>
          <div className="row center">
            <button onClick={this.toggleModal.bind(this)}>Add A Reward</button>
          </div>
        </div>
      </div>
    )
  }
}
