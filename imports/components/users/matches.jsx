import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

export default class Matches extends TrackerReact(Component) {

  render() {
    return(
      <div>
      <div style={{margin:"auto", width:1150, backgroundColor:"#222", paddingBottom:30}}>
     	<div className="center" style={{width:1150, paddingTop:10, margin:"auto"}}>
     		<p style={{marginTop:20, fontSize:25, lineHeight:"50%"}}>Chicken Mondays</p>
     		<p style={{fontSize:15, opacity:.8}}>SFV</p>
	      	<div className="center" style={{margin:"20px auto", width:1150, backgroundColor:"#222"}}>
		      	<div style={{float:"left",width:500, padding:10, fontSize:30}}>
		      		<div style={{float:"right"}}><img src="/images/profile.png" style={{width:75,height:75}}/></div><div style={{backgroundColor:"#222"}}>Player 1</div>
		      	</div>
		      	<div style={{float:"right",width:500, padding:10, fontSize:30}}>
		      		<div style={{float:"left"}}><img src="/images/profile.png" style={{width:75,height:75}}/></div><div style={{backgroundColor:"#222"}}>Player 2</div>
		      	</div>
		      	<div className="center" style={{marginTop:20}}>
		      		<div style={{border:"solid", width:100, margin:"auto",color:"red"}}>
		      			11:11
		      		</div>
		      		<div>
		      			VS
		      		</div>
		      	</div>
		      	
	      	</div>
      	</div>
      	<div className="center" style={{margin:"auto", marginTop:30, width:1150}}>
      		Viewers Vote: <button>VOTE</button>
      		<div style={{float:"left", width:"35%"}}>
      			<div className="center" style={{margin:"auto", border:"solid",borderColor:"#ff6000", width:200, padding:10, boxShadow:"0 0 20px  #ff6000"}}>
      				70%
      			</div>
      		</div>
      		<div style={{float:"right", width:"35%"}}>
      			<div className="center" style={{margin:"auto", border:"solid", width:200, padding:10, boxShadow:"0 0 20px white"}}>
      				30%
      			</div>
      		</div>

      	</div>
      </div>
      <div className="center" style={{margin:"30px 0px"}}>
      		<iframe 
		        src="http://player.twitch.tv/?channel={a_seagull}" 
		        height="500" 
		        width="800" 
		        frameborder="0" 
		        scrolling="no"
		        allowfullscreen="true">
    		</iframe>
      		<iframe frameborder="0" scrolling="no" id="chat_embed" src="http://www.twitch.tv/a_seagull/chat" height="500" width="350"></iframe>
      	</div>
      	<div className="center" style={{width:"1150px", margin:"auto"}}>
      		<div style={{width:"550px",float:"left", padding:10}}>
      			<h4 style={{marginTop:15}}>Player 1 Bracket </h4>
      			<div style={{margin:15}}>
	      			<div style={{float:"left", width:"200px", border:"solid", padding:5, borderColor:"#ff6000"}}>
		      			<span className="center">akirameru</span> <span style={{float:"right"}}>3</span>
	      			</div>
	      			<div style={{float:"right", width:"200px", border:"solid", padding:5}}>
		      			<span style={{float:"left"}}>3</span> <span className="center">akirameru</span> 
	      			</div>
	      			<div style={{padding:5, margin:"15 auto"}}>
	      				vs
	      			</div>
      			</div>
      			<div style={{margin:15}}>
	      			<div style={{float:"left", width:"200px", border:"solid", padding:5}}>
		      			<span className="center">akirameru</span> <span style={{float:"right"}}>3</span>
	      			</div>
	      			<div style={{float:"right", width:"200px", border:"solid", padding:5, borderColor:"#ff6000"}}>
		      			<span style={{float:"left"}}>3</span> <span className="center">akirameru</span> 
	      			</div>
	      			<div style={{padding:5, margin:"15 auto"}}>
	      				vs
	      			</div>
      			</div>
      			<div style={{margin:15}}>
	      			<div style={{float:"left", width:"200px", border:"solid", padding:5, borderColor:"#ff6000"}}>
		      			<span className="center">akirameru</span> <span style={{float:"right"}}>3</span>
	      			</div>
	      			<div style={{float:"right", width:"200px", border:"solid", padding:5}}>
		      			<span style={{float:"left"}}>3</span> <span className="center">akirameru</span> 
	      			</div>
	      			<div style={{padding:5, margin:"15 auto"}}>
	      				vs
	      			</div>
      			</div>
      			
      		</div>
      		<div style={{width:"550px",float:"right", padding:10}}>
      			<h4 style={{marginTop:15}}>Player 2 Bracket </h4>
      			<div style={{margin:15}}>
	      			<div style={{float:"left", width:"200px", border:"solid", padding:5, borderColor:"#ff6000"}}>
		      			<span className="center">akirameru</span> <span style={{float:"right"}}>3</span>
	      			</div>
	      			<div style={{float:"right", width:"200px", border:"solid", padding:5}}>
		      			<span style={{float:"left"}}>3</span> <span className="center">akirameru</span> 
	      			</div>
	      			<div style={{padding:5, margin:"15 auto"}}>
	      				vs
	      			</div>
      			</div>
      			<div style={{margin:15}}>
	      			<div style={{float:"left", width:"200px", border:"solid", padding:5, borderColor:"#ff6000"}}>
		      			<span className="center">akirameru</span> <span style={{float:"right"}}>3</span>
	      			</div>
	      			<div style={{float:"right", width:"200px", border:"solid", padding:5}}>
		      			<span style={{float:"left"}}>3</span> <span className="center">akirameru</span> 
	      			</div>
	      			<div style={{padding:5, margin:"15 auto"}}>
	      				vs
	      			</div>
      			</div>      			
      		</div>
      	</div>
      </div>
    );
  }
}
