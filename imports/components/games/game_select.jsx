import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Games from '/imports/api/games/games.js';

import GameBlock from './game_block.jsx';
import GameCreateModal from './create.jsx';

export default class GameSelectScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;
    this.setState({
      games: Meteor.subscribe("games", {
        onReady(){
          self.setState({
            loaded: true,
            played: Meteor.user().profile.games || [],
            diff: Meteor.user().profile.games || []
          })
          console.log(self.state);
        }
      }),
      loaded: false
    })
  }

  componentWillUnmount(){
    this.state.games.stop();
  }

  games() {
    return Games.find().fetch();
  }

  image(id){
    return Images.find({_id: id}).fetch()[0].url()
  }

  updateGames(){
    self = this;
    Meteor.call('users.update_games', this.state.diff, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else{
        toastr.success("Successfully updated games played.");
        self.state.played = self.state.diff;
        self.forceUpdate();
      }
    })
  }

  togglePlayed(id){
    index = this.state.diff.indexOf(id);
    if(index >= 0){
      this.state.diff.splice(index, 1);
    }
    else {
      this.state.diff.push(id);
    }
    console.log(this.state);
    this.forceUpdate();
  }

  gamesChanged() {
    if(this.state.diff.length != this.state.played.length){
      return true;
    }
    for(var i = 0; i < this.state.diff.length; i ++){
      if(this.state.played.indexOf(this.state.diff[i]) < 0){
        return true;
      }
    }
    return false;
  }

  render() {
    self = this;
    if(!this.state.loaded){
      return (
        <div>

        </div>
      )
    }
    return (
      <div className="screen">
        <div>
          <div style={{padding: 10}}>
            <h2>Select Your Games</h2>
            <div className='row'>
              <GameCreateModal />
              {
                this.gamesChanged() ? (
                  <button style={{marginLeft: 15}} onClick={this.updateGames.bind(this)}>Update Games</button>
                ) : (
                  ""
                )
              }
            </div>
          </div>
          <div className="game-block-container">
            {
              this.games().map(function(val){
                return (
                  <GameBlock imgUrl={self.image(val.banner)} key={val._id} handler={() => self.togglePlayed(val._id)} played={self.state.diff.indexOf(val._id) >= 0} />
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
