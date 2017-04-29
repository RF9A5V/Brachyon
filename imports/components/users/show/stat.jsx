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
  totalGames(){
  	var count =0;
  	var wins =0;
  	var loss = 0;
		const user = Meteor.users.findOne({
			username: this.props.username
		})
  	Object.keys(user.stats).map(game =>{
  		wins += user.stats[game].wins;
  		loss += user.stats[game].losses;
  		count+=1;
  	})
  	return (
  		<table  style={{justifyContent:"center", margin:"auto"}}>
	        <tr style={{height:25, fontSize:18}}>
	          <th className="center">Matches Played:</th>
	          <td className="center">{(loss + wins)}</td>
	        </tr>
	        <tr style={{height:25,fontSize:18}}>
	          <th className="center">Wins:</th>
	          <td className="center">{wins}</td>
	        </tr>
	        <tr style={{height:25,fontSize:18}}>
	          <th className="center">Win%:</th>
	          <td className="center">{((wins/(loss + wins))*100).toFixed(2)}%</td>
	        </tr>
	    </table>
  	)
  }

  showTable(){
		const user = Meteor.users.findOne({
			username: this.props.username
		});
    if (user.stats == null){
    	return (
    		<div className="center" style={{border:"solid", paddingTop:30, paddingBottom:30 ,marginTop:50, marginBottom:50, fontSize:25}}>
    			You have not played any games
    		</div>
    		)
    }
    var userStat = user.stats[this.state.game];
    var tourney = user.tournaments;
    if (this.state.game=="overview"){
      return (
      	<div>
	        <div className="center" style={{marginTop:50, marginBottom:50, fontSize:25}}>
	          {this.totalGames()}
	        </div>
	        <div className="center">
	          <table>
		          <tr>
			          <th className="center">Event Name</th>
			          <th className="center">Game</th>
			          <th className="center">Rank</th>
			          <th className="center">Record</th>
		          </tr>
	          {
	            Object.keys(tourney).reverse().map(tour =>{
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
	        <div className="row center">
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
			          <th className="center">Event Name</th>
			          <th className="center">Game</th>
			          <th className="center">Rank</th>
			          <th className="center">Record</th>
		          </tr>
	          {
	            Object.keys(tourney).reverse().map(tour =>{
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
		const user = Meteor.users.findOne({
			username: this.props.username
		});

  	return(
  	<div style={{marginTop:15, marginBottom:15}}>
      <div className="center">
        <select className="center" ref="game" onChange={(e)=> {this.selectGame()} }style={{width:300, border:"solid", margin:20}}>
        <option value="overview" Selected>
          Overview
        </option>
          {user.stats==null? ("")
          	:(
          		Object.keys(user.stats).map(game => {
								const g = Games.findOne(game);
            		return(
                		<option value={game}>
                  		{g.name}
                		</option>
              	);
            	})
          	)}
        </select>
      </div>
      <div className="center" style={{width:"50vw", margin:"auto"}}>
       {this.showTable()}
      </div>
    </div>

  )}

}
