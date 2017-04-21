import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import Loader from "/imports/components/public/loader.jsx";
import Editor from "/imports/components/public/editor.jsx";

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
    const gameObjs = this.state.games;
    const gamesPerRow = opts.mobile ? 1 : 2;
    var count = 0;
    var tempObj = [];
    while(count < gameObjs.length) {
      var index = Math.floor(count / 2);
      var subIndex = count % 2;
      if(subIndex == 0) {
        tempObj[index] = [gameObjs[count]];
      }
      else {
        tempObj[index].push(gameObjs[count]);
      }
      count += 1;
    }
    if(tempObj.length > 0) {
      if(tempObj[tempObj.length - 1][1] == undefined) {
        tempObj[tempObj.length - 1][1] = null;
      }
    }
    return (
      <div className="col">
        {
          tempObj.map((ar, j) => {
            return (
              <div className="row" style={{marginBottom: j == tempObj.length - 1 ? 0 : 20}}>
                {
                  ar.map((g, i) => {
                    if(g == null) {
                      return (
                        <div className="col-1">
                        </div>
                      )
                    }
                    return (
                      <div className="col col-1" style={{marginRight: ar.length - 1 == i ? 0 : 20}}>
                        <img src={g.bannerUrl} style={{width: "100%", height: "auto"}} />
                        <span style={{padding: 10, backgroundColor: "#111", fontSize: opts.fontSize}}>{ g.name }</span>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  onProfileSave() {
    Meteor.call("user.editBio", Meteor.userId(), this.refs.editor.value(), (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated bio!");
      }
    })
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <div className="row center x-center" style={{padding: 50}}>
          <Loader animate={true} width={150} />
        </div>
      )
    }
    const user = Meteor.users.findOne({
      username: this.props.username
    })
    const spacing = 20;
    return (
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
                <button style={{marginTop: spacing}} onClick={() => {
                  this.onProfileSave()
                }}>
                  Save
                </button>
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
