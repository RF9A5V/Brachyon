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
    var tourney = Meteor.user().tournaments;
    if (this.state.game=="overview"){
      return (
      	<div>
	        <div className="center" style={{border:"solid", paddingTop:50, paddingBottom:50, marginTop:50, marginBottom:50, fontSize:25}}>
	          Select a game to see your stats
	        </div>
	        <div className="center">
	          <table>
		          <tr>
			          <th>Event Name</th>
			          <th>Game</th>
			          <th>Rank</th>
			          <th>Record</th>
		          </tr>
	          {
	            Object.keys(tourney).map(tour =>{
	              return(
	              	<tr>
	                  <td>{tourney[tour].eventName}</td>
	                  <td>{Games.findOne(tourney[tour].game).name}</td>
	                  <td>{tourney[tour].ranking}</td>
	                  <td>{tourney[tour].record}</td>
	                 </tr>
	                );
	            })
	          }
	          </table>
	        </div>
        </div>
        );
    }
    else{
      return(
      	<div>
	        <div className="row center" style={{}}>
	          <img style={{width: 200, height:250, marginRight:15}}src={Games.findOne(this.state.game).bannerUrl} />
	          <div>
		          <div className="center"style={{marginTop:15, marginBottom:15, fontSize:20}}>
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
	        </div>
	        <div style={{marginTop:15}}>
	        <table>
		          <tr>
			          <th>Event Name</th>
			          <th>Game</th>
			          <th>Rank</th>
			          <th>Record</th>
		          </tr>
	          {
	            Object.keys(tourney).map(tour =>{
	              if(this.state.game == tourney[tour].game)
	              	return(
	              	<tr>
	                  <td>{tourney[tour].eventName}</td>
	                  <td>{Games.findOne(tourney[tour].game).name}</td>
	                  <td>{tourney[tour].ranking}</td>
	                  <td>{tourney[tour].record}</td>
	                 </tr>
	                );
	              else{return}
	            })
	          }
	          </table>
	        </div>
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