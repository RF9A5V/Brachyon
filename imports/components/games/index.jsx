import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";

import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";

export default class GamesIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false
    }
  }

  onImageUploaded(data) {
    console.log(data);
    Meteor.call("games.submitForReview", this.refs.gameName.value, this.refs.gameDescription.value, data._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.image.reset();
        this.refs.gameName.value = "";
        this.refs.gameDescription.value = "";
        return toastr.success("Successfully sent game for review!", "Success!");
      }
    })
  }

  gameDisplay() {
    if(!this.state.ready) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div className="row" style={{flexWrap: "wrap", padding: 20}}>
        {
          Games.find().map((game) => {
            return (
              <div className="game">
                <img src={Images.findOne(game.banner).link()} />
                <div>
                  <span>
                    { game.name }
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  onSubmit() {
    if(this.refs.gameName.value == "") {
      return toastr.error("Game name can't be empty!", "Error!");
    }
    this.refs.image.value();
  }

  render() {
    return (
      <div className="col" style={{marginTop: 20}}>
        <div className="row" style={{padding: 20}}>
          <div className="col center x-center col-1">
            <ImageForm ref="image" collection={Images} aspectRatio={16/9} callback={this.onImageUploaded.bind(this)} />
          </div>
          <div className="col-1 col">
            <span>Game Name</span>
            <input type="text" placeholder="Game Name" ref="gameName" />
            <span>Game Description</span>
            <textarea placeholder="Game Description" ref="gameDescription" style={{marginTop: 20}}>

            </textarea>
            <div className="row center" style={{marginRight: 10}}>
              <button onClick={this.onSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        </div>
        {
          this.gameDisplay()
        }
      </div>
    )
  }
}
