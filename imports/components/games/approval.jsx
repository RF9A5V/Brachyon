import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Games from '/imports/api/games/games.js';
import { Banners } from "/imports/api/event/banners.js";

export default class GameApprovalScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;
    this.setState({
      games: Meteor.subscribe('unapproved_games')
    })
  }

  componentWillUnmount() {
    this.state.games.stop();
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

  rejectGame(id) {
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
    if(!this.state.games.ready()){
      return (
        <div>

        </div>
      )
    }
    return (
      <div className="content">
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
                      <img src={game.bannerUrl} />
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
