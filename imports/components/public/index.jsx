import React from 'react'
import SignUpScreen from './signup.jsx';
import LogInScreen from './login.jsx';

import ShowUserScreen from '../users/show.jsx';

export default class LandingScreen extends React.Component {
  componentWillMount() {
    this.resetState();
  }

  resetState(){
    this.setState({
      status: 0
    });
  }

  render() {
    rez = "";
    if (this.state.status == 0) {
      rez = (
        <div className="main-content" id="main-content">
          <h1>BRACHYON</h1>
          <h4>Cogito ergo sum, sit amet dolor quis que something or another</h4>
          <div className="row center">
            <button className="sign-up-link" onClick={(e) => { e.preventDefault(); this.setState({status: 1}) }}>Sign Up</button>
          </div>
        </div>
      );
    }
    else if(this.state.status == 1){
      rez = (
        <div className="main-content" id="main-content">
          <SignUpScreen afterSubmit={this.resetState.bind(this)} />
        </div>
      );
    }
    else {
      rez = (
        <div className="main-content" id="main-content">
          <LogInScreen afterSubmit={this.resetState.bind(this)} />
        </div>
      )
    }
    return (
      <div className="landing-screen screen" style={{position: 'relative'}}>
        <header>
          <div className='row'>
            <a href="#" onClick={(e) => { e.preventDefault(); this.setState({status: 1})}} style={{marginRight: 10}}>Sign Up</a>
            <a href="#" onClick={(e)=>{e.preventDefault();this.setState({status: 2})}}>Log In</a>
          </div>
        </header>
        <div className="img-background">
          <img src="http://lorempixel.com/1280/720/" />
          <div className="img-background-overlay"></div>
        </div>
        {rez}
      </div>
    );

  }
}
