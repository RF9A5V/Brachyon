import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class CFModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentId: null
    }
  }

  tierView() {
    var tier = this.props.tier;
    if(!tier) {
      return (
        <div>
          No Tier Selected. How did you even get here?
        </div>
      )
    }
    else {
      return (
        <div className="col">
          <div className="row center">
            <h1>{ tier.name }</h1>
          </div>
          <div style={{textAlign: "left"}} dangerouslySetInnerHTML={{__html: tier.description}}>
          </div>
          <div className="row center">
            <h5>Rewards</h5>
          </div>
          {
            Rewards.find({_id: { $in: tier.rewards }}, { sort: { value: 1 } }).map(reward => {
              return (
                <div className="row" style={{marginBottom: 20}}>
                  <img src={reward.imgUrl} style={{width: 100, height: 100, borderRadius: "100%", marginRight: 20}} />
                  <div className="col">
                    <div className="row x-center" style={{marginTop: 20}}>
                      <h5 style={{marginRight: 20}}>{ reward.name }</h5>
                      <FontAwesome name={this.state.currentId == reward._id ? "caret-up" : "caret-down"} size="2x" onClick={() => {
                        if(this.state.currentId == reward._id) {
                          this.setState({ currentId: null });
                        }
                        else {
                          this.setState({ currentId: reward._id });
                        }
                      }} />
                    </div>
                    <div dangerouslySetInnerHTML={{__html: reward.description}} style={{display: this.state.currentId == reward._id ? "block" : "none" }}>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.close}>
        {
          this.tierView()
        }
      </Modal>
    )
  }
}
