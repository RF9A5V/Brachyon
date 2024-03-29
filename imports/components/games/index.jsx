import React, { Component } from "react";
import ReactDOM from "react-dom"
import { browserHistory } from "react-router";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ImageForm from "/imports/components/public/img_form.jsx";

import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

import Block from "./block.jsx";

import LoaderContainer from "/imports/components/public/loader_container.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

export default class GamesIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ initReady: true })
        }
      }),
      initReady: false,
      ready: false,
      open: false
    }
  }

  componentWillUnmount() {
    this.state.games.stop();
  }

  componentDidUpdate(prevProps, prevState) {
    Object.keys(this.refs).forEach((reffs)=>{
      var node = ReactDOM.findDOMNode(this.refs[reffs])
      if(node.offsetWidth<node.scrollWidth){
        node.className = "game-title overflow"
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
      <div style={{padding: 10}}>
        <RowLayout length={5}>
          {
            Games.find().map((game) => {
              return (
                <Block game={game} onClick={() => {
                  browserHistory.push("/game/" + game.slug)
                }} />
              )
            })
          }
        </RowLayout>
      </div>
    )
  }

  onSubmit() {
    if(this.refs.gameName.value == "") {
      return toastr.error("Game name can't be empty!", "Error!");
    }
    var { image, meta, type } = this.refs.image.value();
    if(!image) {
      toastr.error("You need an image for this game!");
      throw new Error("Game required image.");
    }
    Meteor.call("games.submitForReview", this.refs.gameName.value, this.refs.gameDescription.value, (err, game) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        meta.gameId = game;
        GameBanners.insert({
          file: image,
          meta,
          fileName: game + "." + type,
          onUploaded: (err) => {
            if(err){
              toastr.error("Something went wrong!");
            }
            else {
              this.refs.image.reset();
              this.refs.gameName.value = "";
              this.refs.gameDescription.value = "";
              this.setState({
                open: false
              })
              return toastr.success("Successfully sent game for review!", "Success!");
            }
          }
        })
      }
    })

  }

  gameCreateModal() {
    return (
      <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome name="times" size="2x" onClick={() => { this.setState({ open: false }) }} />
        </div>
        <div className="col x-center" style={{padding: 20}}>
          <div className="col center x-center" style={{marginBottom: 20}}>
            <ImageForm ref="image" aspectRatio={3/4} />
          </div>
          <div className="col" style={{width: "70%"}}>
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
      </Modal>
    )
  }

  render() {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.initReady} onReady={() => { this.setState({ready: true}) }} />
      )
    }
    return (
      <div className="col" style={{marginTop: 20}}>
        <div className="row center">
          <button className="createGame" style={{marginTop:20, marginBottom:20, color: "white"}} onClick={() => { this.setState({open: true}) }}>Create Game</button>
        </div>
        <hr style={{marginBottom:20}}className="discover-divider" />
        {
          this.gameDisplay()
        }
        {
          this.gameCreateModal()
        }
      </div>
    )
  }
}
