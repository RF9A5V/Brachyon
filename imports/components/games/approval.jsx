import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Games from '/imports/api/games/games.js';

export default class GameApprovalScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;
    this.setState({
      loaded: false,
      games: Meteor.subscribe('unapproved_games', {
        onReady(){
          console.log(this);
          self.setState({
            loaded: true
          })
        }
      })
    })
  }

  games() {
    return Games.find().fetch();
  }

  approveGame(id) {
    return function(e){
      Meteor.call('games.approve', id, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Game approved.");
        }
      })
    }
  }

  rejectGame() {
    return function(e){
      Meteor.call('games.reject', id, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Game rejected.");
        }
      })
    }
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
          <table className="approval-table">
            <tr>
              <td>Game Name</td>
              <td>Banner</td>
              <td>Approve</td>
              <td>Reject</td>
            </tr>
            {
              this.games().map(function(game){
                return (
                  <tr>
                    <td>{game.name}</td>
                    <td>
                      <img src={Images.findOne(game.banner).url()} />
                    </td>
                    <td>
                      <button onClick={self.approveGame(game._id).bind(self)}>
                        Approve
                      </button>
                    </td>
                    <td>
                      <button onClick={self.rejectGame(game._id).bind(self)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </table>
        </div>
      </div>
    )
  }
}
