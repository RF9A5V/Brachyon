import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";

import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";

export default class AddGameAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameID: null
    }
  }

  onImgUploaded(data) {
    if(data == null) {
      toastr.error("Must supply image for game!", "Error!");
    }
    else {
      Meteor.call("games.create", this.refs.name.value, this.refs.description.value, data._id, (err) => {
        if(err) {
          return toastr.error(err.reason, "Error!");
        }
        else {
          return toastr.success("Successfully created game!", "Success!");
        }
      })
    }
  }

  onImgUploadedForEdit(data) {
    Meteor.call("games.edit", this.state.gameID, this.refs.name.value, this.refs.description.value, data._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ gameID: null })
        return toastr.success("Successfully updated game!", "Success!");
      }
    })
  }

  deleteGame() {
    Meteor.call("games.delete", this.state.gameID, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ gameID: null })
        return toastr.success("Successfully deleted game!", "Success!")
      }
    });
  }

  gameUnselectedView() {
    var games = Games.find();
    return (
      <div className="col">
        <div className="row" style={{width: "70%", margin: "20px auto"}}>
          <div className="col-1 col center x-center">
            <ImageForm ref="image" collection={Images} aspectRatio={16/9} callback={this.onImgUploaded.bind(this)} />
          </div>
          <div className="col col-1">
            <input type="text" placeholder="Game Name" ref="name" />
            <textarea placeholder="Game Description" ref="description"></textarea>
            <div className="row center">
              <button onClick={() => { this.refs.image.value() }}>Add Game</button>
            </div>
          </div>
        </div>
        <div className="row" style={{marginTop: 40}} style={{flexWrap: "wrap"}}>
          {
            games.map(game => {
              return (
                <div className="col" style={{width: "calc(33% - 10px)", flexBasis: "calc(33% - 10px)", flexWrap: "wrap", marginRight: 10}} onClick={() => { this.setState({ gameID: game._id }) }}>
                  <img src={game.bannerUrl} style={{width: "100%", height: "auto"}} />
                  <span>{ game.name }</span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  gameSelectedView() {
    var game = Games.findOne({_id: this.state.gameID});
    return (
      <div className="col">
        <div className="row center" style={{marginBottom: 20}}>
          <h3>{ game.name }</h3>
        </div>
        <div className="row" style={{width: "70%", margin: "0 auto"}}>
          <div className="col-1 col center x-center" style={{marginRight: 20}}>
            <ImageForm ref="image" collection={Images} aspectRatio={16/9} callback={this.onImgUploadedForEdit.bind(this)} id={game.banner} />
          </div>
          <div className="col col-1">
            <input type="text" placeholder="Game Name" ref="name" defaultValue={ game.name } />
            <textarea placeholder="Game Description" ref="description" defaultValue={ game.description }></textarea>
            <div className="row center">
              <button onClick={() => { this.refs.image.value() }}>Edit Game</button>
            </div>
          </div>
        </div>
        <div style={{position: "fixed", bottom: 60, right: 20}}>
          <button style={{marginRight: 10}} onClick={() => { this.setState({ gameID: null }) }}>Back</button>
          <button onClick={ () => { this.deleteGame() } }>Delete</button>
        </div>
      </div>
    )
  }

  render() {
    if(this.state.gameID != null) {
      return this.gameSelectedView();
    }
    else {
      return this.gameUnselectedView();
    }
  }
}
