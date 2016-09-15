import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import ImageForm from "/imports/components/public/img_form.jsx";

import ProfileImages from "/imports/api/users/profile_images.js";

class RewardForm extends Component {

  onRewardSave() {
    Meteor.call("events.revenue.rewards.createReward", this.props.id, this.refs.name.value, this.refs.img.value(), this.refs.description.value, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onComplete();
        toastr.success("Successfully created reward!", "Success!");
      }
    })
  }

  onRewardEdit() {
    Meteor.call("events.revenue.rewards.editReward", this.props.id, this.refs.name.value,this.refs.img.value(), this.refs.description.value, this.props.index, (err) => {
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
    Meteor.call("events.revenue.rewards.deleteReward", this.props.id, this.props.index, (err) => {
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
          <input type="text" placeholder="Name" ref="name" defaultValue={ reward.name } />
          <ImageForm aspectRatio={1} collection={ProfileImages} ref="img" />
          <textarea placeholder="Description" ref="description" defaultValue={ reward.description }></textarea>
          <div>
            <button onClick={ this.onRewardDelete.bind(this) }>Delete</button>
            <button onClick={ this.onRewardEdit.bind(this) }>Submit</button>
          </div>
        </div>
      )
    }
    return (
      <div className="col">
        <input type="text" placeholder="Name" ref="name" />
        <ImageForm aspectRatio={1} collection={ProfileImages} ref="img" />
        <textarea placeholder="Description" ref="description"></textarea>
        <div>
          <button onClick={ this.onRewardSave.bind(this) }>Submit</button>
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
    })
  }

  setRewardForEdit(reward, index) {
    this.setState({
      reward,
      open: true,
      index
    })
  }

  render() {
    var rewards = Events.findOne().revenue.rewards || [];
    return (
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
        <div className="block reward" onClick={this.toggleModal.bind(this)}>
          <span>Add a reward</span>
        </div>
        <Modal isOpen={this.state.open} onRequestClose={ this.toggleModal.bind(this) }>
          <RewardForm id={this.state.id} reward={this.state.reward} index={this.state.index} onComplete={this.toggleModal.bind(this)} />
        </Modal>
      </div>
    )
  }
}
