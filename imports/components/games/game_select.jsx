import React, { Component } from 'react';

export default class GameSelectScreen extends Component {
  render() {
    return (
      <div className="screen">
        <div className="game-block-container">
          {
            [0, 1, 2, 3, 4, 5].map(function(val){
              return (
                  <div className="game-block">
                    <img src="/images/temp.jpg" />
                  </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
