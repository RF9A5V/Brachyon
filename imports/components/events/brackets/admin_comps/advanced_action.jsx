import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";
import Brackets from "/imports/api/brackets/brackets.js";

export default class AddPartipantAction extends Component {
  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var iid = instance._id;
    var bracket = instance.brackets[this.props.index];
    var started = instance.brackets[this.props.index].inProgress ? true:false;
    var score = started ? Brackets.findOne().score : bracket.score;
    if (!(started))
      this.didSwitchParentObject = true;
    this.state = {
      score,
      iid,
      started,
      index: this.props.index
    }
  }

  componentDidUpdate()
  {
    if (this.state.started != true && Instances.findOne().brackets[this.props.index].inProgress)
    {
      this.setState({started: true})
    }
    else if (this.didSwitchParentObject)
    {
      this.refs.win_score.value = this.state.score.wins;
      this.refs.lose_score.value = this.state.score.loss;
      this.refs.tie_score.value = this.state.score.ties;
      this.refs.bye_score.value = this.state.score.byes;
    }
  }


  updateScore()
  {
    var wins = this.refs.win_score.value ? parseInt(this.refs.win_score.value) : parseInt(this.state.score.wins);
    var loss = this.refs.lose_score.value ? parseInt(this.refs.lose_score.value) : parseInt(this.state.score.loss);
    var ties = this.refs.tie_score.value ? parseInt(this.refs.tie_score.value) : parseInt(this.state.score.ties);
    var byes = this.refs.bye_score.value ? parseInt(this.refs.bye_score.value) : parseInt(this.state.score.byes);
    var score = {wins, loss, ties, byes};
    Meteor.call("events.update_scoring", this.state.iid, this.state.index, score, (err) => {
      if (err)
      {
        toastr.error("Something went wrong saving the score!", "Error!");
        return err;
      }
      else
      {
        toastr.success("Scores updated!", "Success!")
        this.setState({score: score});
        this.didSwitchParentObject = false;
        this.forceUpdate();
      }
    });
  }

  render()
  {
    return(
      <div>
      {
        this.state.started ? (
          <div className="col">
            <p>Win Score: {this.state.score.wins}</p>
            <p>Loss Score: {this.state.score.loss}</p>
            <p>Tie Score: {this.state.score.ties}</p>
            <p>Bye Score: {this.state.score.byes}</p>
          </div>
         ) : (
          <div>
            <div className="row">
              <div className="col">
                <p>Win Score:</p>
                <input type="number" ref="win_score" onkeypress='return event.charCode >= 48 && event.charCode <= 57' />
              </div>
              <div className="col">
                <p>Loss Score:</p>
                <input type="number" ref="lose_score" onkeypress='return event.charCode >= 48 && event.charCode <= 57' />
              </div>
              <div className="col">
                <p>Tie Score:</p>
                <input type="number" ref="tie_score" onkeypress='return event.charCode >= 48 && event.charCode <= 57' />
              </div>
              <div className="col">
                <p>Bye Score:</p>
                <input type="number" ref="bye_score" onkeypress='return event.charCode >= 48 && event.charCode <= 57' />
              </div>
            </div>
            <div>
              <button onClick={() => {this.updateScore()}}>
                Save
              </button>
            </div>
          </div>
        )
      }
      </div>
    );
  }

}
