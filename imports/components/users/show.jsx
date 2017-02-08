import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory, Link } from "react-router"
import Modal from "react-modal";

import Games from '/imports/api/games/games.js';
import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';
import ProfileImage from './profile_image.jsx';
import ImageForm from "/imports/components/public/img_form.jsx";
import UserSections from "./show/sections.jsx";
import Loading from "/imports/components/public/loading.jsx";

export default class ShowUserScreen extends TrackerReact(Component) {

  componentWillMount() {
    self = this;
    this.setState({
      user: Meteor.subscribe("user", Meteor.userId(), {
        onReady: () => {
           console.log('helo');
          this.setState({

            ready: true
          })
        }
      }),
      open: false,
      ready: false,
      tab: "events"
    });
  }

  componentWillUnmount(){
    this.state.user.stop();
  }

  profileBannerURL(id) {
    var user = Meteor.user();
    if(user.profile.bannerUrl){
      return user.profile.bannerUrl;
    }
    return "/images/bg.jpg";
  }

  profileImage() {
    var user = Meteor.user();
    if(user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  updateProfileImage(e) {
    e.preventDefault();
    this.refs.img.value();
    this.setState({open: false});
  }

  tabContent() {
    if(this.state.tab=="events"){
      return (<UserSections/>)
    }
    else if (this.state.tab=="stats"){
      return(
        <div>
          <div className="center" style={{float:"left", padding:"10", marginLeft: 25, border:"solid", width:"170px", borderColor:"#ff6000", fontSize:18}}>
            Stats
          </div>
          <div className="center" >
            <table  style={{justifyContent:"center", margin:"0 auto"}}>
              <tr style={{fontSize:18}}>
                <th className="center">Game</th>
                <th className="center">Wins</th>
                <th className="center">Losses</th>
                <th className="center">Ties</th>
                <th className="center">Win%</th>
              </tr>
              {
                Object.keys(Meteor.user().stats).map(game =>{
                  return(
                    <tr>
                      <td className="center">{Games.findOne(game).name}</td>
                      <td className="center">{Meteor.user().stats[game].wins}</td>
                      <td className="center">{Meteor.user().stats[game].losses}</td>
                      <td className="center">{Meteor.user().stats[game].ties}</td>
                      <td className="center">{((Meteor.user().stats[game].wins/(Meteor.user().stats[game].losses + Meteor.user().stats[game].wins))*100).toFixed(2)}%</td>
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

  render() {
    var self = this;
    console.log(this.state.ready);
    if(!this.state.ready){
      return (
        <div className="row center x-center" style={{width: "100%", height: "100%"}}>
          <Loading />
        </div>
      )
    }

    return (
      <div>
        <div className="user-banner" style={{backgroundImage: `url(${this.profileBannerURL()})`}}>
          <div className="user-img-line row flex-pad x-center">
            <div className="row col-1">
              {
                // Meteor.user().profile.games.slice(0, 3).map((game, i) => {
                //   var g = Games.findOne(game);
                //   return (
                //     <div className="user-game-icon" style={{backgroundImage: `url(${g.bannerUrl})`}} key={i}>
                //     </div>
                //   );
                // })
              }
            </div>
            <div className="user-profile-image" onClick={() => { this.setState({ open: true }) }}>
              <img src={this.profileImage()} style={{width: "100%", height: "100%", borderRadius: "100%"}} />
              <div className="user-profile-overlay">
                Add Image
              </div>
              <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
                <div className="col center x-center" style={{width: "100%", height: "100%"}}>
                  <ImageForm ref="img" collection={ProfileImages} meta={{userId: Meteor.userId()}} />
                  <button onClick={this.updateProfileImage.bind(this)}>Submit</button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div className="row center">
          <button onClick={() => { browserHistory.push("/create") }} style={{marginTop: 100}}>Create an Event</button>
        </div>
        {
          // <div className="row" style={{padding:"0 30px"}}>
          //   {
          //     ["events","stats"].map((tab)=>{
          //       var style = {padding:5, fontSize:24, borderBottom:`solid 2px ${this.state.tab==tab?"#ff6000":"white"}`, marginRight:10}
          //       return (
          //         <div className="user-tab" style={{borderColor:`${this.state.tab==tab?"#ff6000":"white"}`}} onClick={()=>{this.setState({tab})}}>{tab.slice(0,1).toUpperCase() + tab.slice(1)}</div>
          //       )})
          //   }
          // </div>
        }
        <div className="row col-1"><hr className="user-divider"></hr></div>
        <div className="col">
          {this.tabContent()}
        </div>
      </div>
    )

  }
}
