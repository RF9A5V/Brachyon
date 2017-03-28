import React, { Component } from "react";

import Games from '/imports/api/games/games.js';

export default class UserStat extends Component {
	constructor(props) {
    super(props);
    this.state = {
      game:"overview"
    }
  }

	componentWillMount() {
    this.setState({
      game:"overview"
    });
  }

  selectGame(){
    this.setState({game: this.refs.game.value})
  }

  showTable(){
    var userStat = Meteor.user().stats[this.state.game];
    if (this.state.game=="overview"){
      return (
        <div className="center" style={{border:"solid", paddingTop:50, paddingBottom:50, marginTop:50, marginBottom:50, fontSize:25}}>
          Select a game to see your stats
        </div>
        );
    }
    else{
      return(
        <div className="center" style={{}}>
          <img style={{width: 200, height:250, float:"left"}}src={Games.findOne(this.state.game).bannerUrl} />
          <div style={{marginTop:15, marginBottom:15, fontSize:20}}>
          	{Games.findOne(this.state.game).name.toUpperCase()}
          </div>
          <table  style={{justifyContent:"center", margin:"auto"}}>
            <tr style={{height:25, fontSize:18}}>
              <th className="center">Matches Played:</th>
              <td className="center">{(userStat.losses + userStat.wins)}</td>
            </tr>
            <tr style={{height:25,fontSize:18}}>
              <th className="center">Wins:</th>
              <td className="center">{userStat.wins}</td>
            </tr>
            <tr style={{height:25,fontSize:18}}>
              <th className="center">Win%:</th>
              <td className="center">{((userStat.wins/(userStat.losses + userStat.wins))*100).toFixed(2)}%</td>
            </tr>
          </table>
        </div>
        );
    }
  }

  render(){
  	return(
  	<div style={{marginTop:15, marginBottom:15}}>
      <div className="center">
        <select className="center" ref="game" onChange={(e)=> {this.selectGame()} }style={{width:300, border:"solid", margin:20}}>
        <option value="overview" Selected>
          Overview
        </option>
          {
            Object.keys(Meteor.user().stats).map(game =>{
              return(
                  <option value={Games.findOne(game)._id}>
                    {Games.findOne(game).name}
                  </option>
                );
            })
          }
        </select>
      </div>
      <div className="center" style={{width:"50vw", margin:"auto"}}>
       {this.showTable()}
      </div>
    </div>

  )}

}