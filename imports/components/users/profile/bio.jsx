import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import Loader from "/imports/components/public/loader.jsx";
import Editor from "/imports/components/public/editor.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

export default class UserBio extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
    Meteor.call("user.getSelectedGames", props.username, (err, data) => {
      if(err) {
        toastr.error("Error getting played games!");
      }
      else {
        this.setState({
          ready: true,
          games: data
        })
      }
    })
  }

  userGames(opts) {
    return (
      <RowLayout length={opts.mobile ? 1 : 3}>
        {
          this.state.games.map(g => {
            return (
              <div className="col col-1 game">
                <img src={g.bannerUrl} style={{width: "100%", height: "auto"}} />
                <span className="game-title" style={{padding: 10, backgroundColor: "#111", fontSize: opts.fontSize}}>{ g.name }</span>
              </div>
            )
          })
        }
      </RowLayout>
    )
  }

  promoVideo() {
    const user = Meteor.user();
    if(this.props.editMode) {
      return (
        <div className="col">
          <label className="input-label">Youtube Embed</label>
          <input type="text" ref="youtubeEmbed" defaultValue={`https://youtu.be/${user.profile.youtubeEmbed}`} style={{margin: 0, minWidth: 300}} onBlur={this.value.bind(this)} />
        </div>
      )
    }
    return user.profile.youtubeEmbed ? (
      <iframe width="560" height="315" src={`https://www.youtube.com/embed/${user.profile.youtubeEmbed}`} frameBorder="0" allowfullscreen></iframe>
    ) : (
      null
    )
  }

  value() {

    var ytLink = this.refs.youtubeEmbed.value;
    var regex = /.*youtube\.com\/watch\?v=(.+).*/;
    var backup = /.*youtu\.be\/(.*).*/;
    var match = regex.exec(ytLink) || backup.exec(ytLink);
    return {
      description: this.refs.editor.value(),
      youtubeEmbed: match ? match[1] : match
    }
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <div className="row center x-center" style={{padding: 50}}>
          <Loader animate={true} width={150} />
        </div>
      )
    }
    const user = Meteor.user()
    const spacing = 20;
    return (
      <div>
        <div className="row center">
          {
            this.promoVideo()
          }
        </div>
        <div className={opts.mobile ? "col" : "row"} style={{padding: spacing}}>
          <div className="col col-1" style={{marginRight: opts.mobile ? 0 : spacing, marginBottom: opts.mobile ? spacing : 0}}>
            <label className="input-label" style={{textAlign: "center", backgroundColor: "#666"}}>
              <span style={{textAlign: "center", textTransform: "uppercase", fontSize: opts.fontSize}}>
                User Bio
              </span>
            </label>
            {
              this.props.editMode ? (
                <div className="col x-center" style={{backgroundColor: "rgba(0, 0, 0, 0.8)", padding: spacing}}>
                  <div style={{width: "100%"}}>
                    <Editor value={user.profile.bio || ""} ref="editor" />
                  </div>
                </div>
              ) : (
                <div style={{backgroundColor: "rgba(0, 0, 0, 0.8)", padding: spacing}}>
                  <div dangerouslySetInnerHTML={{__html: user.profile.bio || ""}} style={{fontSize: opts.fontSize}}>
                  </div>
                </div>
              )
            }

          </div>
          <div className="col col-1">
            <label className="input-label" style={{textAlign: "center", backgroundColor: "#666"}}>
              <span style={{textTransform: "uppercase", fontSize: opts.fontSize}}>
                Games Played
              </span>
            </label>
            <div style={{padding: spacing, backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
              {
                this.userGames(opts)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      mobile: true,
      fontSize: "2.5em"
    });
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      fontSize: "1em"
    });
  }
}
