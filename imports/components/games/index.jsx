import React, { Component } from "react";
import ReactDOM from "react-dom"
import { browserHistory } from "react-router";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ImageForm from "/imports/components/public/img_form.jsx";

import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

export default class GamesIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      open: false
    }
  }

  componentWillUnmount() {
    this.state.games.stop();
  }

  componentDidMount() {
    //console.log(this.refs)
    //Object.keys(this.refs).forEach((reff)=>{
    //  console.log(reff)//.className)
      // console.log(reff.offsetWidth)
      // console.log(reff.scrollWidth)
    //})
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(this.refs)
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
      <div className="row" style={{flexWrap: "wrap", padding: 20}}>
        {
          Games.find().map((game) => {
            return (
              <div className="game" onClick={ () => { browserHistory.push("/game/" + game.slug) } }>
                <img src={game.bannerUrl} />
                <div className="col game-description">
                  <span ref={game.name} className="game-title">
                    { game.name }
                  </span>
                  <div className="row center">
                    <span className="game-count col-1">
                      <FontAwesome name="users" style={{marginRight: 10}} />
                      { game.playerCount || 0 }
                    </span>
                    <span className="game-count col-1">
                      <FontAwesome name="gamepad" style={{marginRight: 10}} />
                      { game.eventCount || 0 }
                    </span>
                  </div>
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
    return (
      <div className="col" style={{marginTop: 20}}>
        <div className="row center">
          <button className="createGame"style={{marginTop:20, marginBottom:20}}onClick={() => { this.setState({open: true}) }}>Create Game</button>
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
