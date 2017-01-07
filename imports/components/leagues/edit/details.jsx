import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";
import LocationSelect from "/imports/components/events/create/location_select.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

// Yes I know there's a lot of copy paste here. Will clean this up once getting the functionality all there first.
// As they say, premature optimization is the killer of many things.
// But this is pretty sloppy though.

var checkForDefaultAttr = function(obj, prop, attr) {
  if(obj && obj.league && obj.league.details) {
    if(obj.league.details[attr] != null) {
      return obj.league.details[attr];
    }
  }
  return prop[attr];
}

class DetailsPanel extends Component {
  render() {
    return (
      <div>
        Overview for Details
      </div>
    )
  }
}

class LeagueNameInput extends Component {

  componentWillUnmount() {
    if(this.props.update) {
      this.props.update();
    }
  }

  render() {
    var name = checkForDefaultAttr(this.props.changelog, this.props, "name");
    var season = checkForDefaultAttr(this.props.changelog, this.props, "season");
    return (
      <div className="row">
        <div className="col col-2">
          <h5>League Name</h5>
          <input type="text" defaultValue={name} onChange={(e) => {
            var log = this.props.changelog;
            if(!log.league) {
              log.league = {};
            }
            if(!log.league.details) {
              log.league.details = {};
            }
            log.league.details.name = e.target.value;
          }}/>
        </div>
        <div className="col col-1">
          <h5>Season</h5>
          <input type="number" defaultValue={season} onChange={(e) => {
            var log = this.props.changelog;
            if(!log.league) {
              log.league = {};
            }
            if(!log.league.details) {
              log.league.details = {};
            }
            log.league.details.season = e.target.value;
          }} />
        </div>
      </div>
    )
  }
}

class LeagueDescription extends Component {
  render() {
    var description = checkForDefaultAttr(this.props.changelog, this.props, "description");
    return (
      <Editor usePara={true} useInsert={true} useTable={true} value={description} onChange={(value) => {
        var log = this.props.changelog;
        if(!log.league) {
          log.league = {};
        }
        if(!log.league.details) {
          log.league.details = {};
        }
        log.league.details.description = value;
      }} />
    )
  }
}

class LeagueLocation extends Component {
  render() {
    var location = checkForDefaultAttr(this.props.changelog, this.props, "location");
    return (
      <LocationSelect {...location} onChange={(value) => {
        var log = this.props.changelog;
        if(!log.league) {
          log.league = {};
        }
        if(!log.league.details) {
          log.league.details = {};
        }
        log.league.details.location = value;
      }} />
    )
  }
}

class LeagueImage extends Component {

  componentWillUnmount() {
    var log = this.props.changelog;
    if(!log.league) {
      log.league = {};
    }
    if(!log.league.details) {
      log.league.details = {};
    }
    log.league.details.image = {
      file: this.state.cache,
      meta: this.refs.img.dimensions()
    };
  }

  render() {
    return (
      <ImageForm
        url={this.props.image}
        aspectRatio={16/9}
        onImgSelected={(img) => {
          this.setState({ cache: img })
        }}
        ref="img"
      />
    )
  }
}

export {
  DetailsPanel,
  LeagueNameInput,
  LeagueDescription,
  LeagueLocation,
  LeagueImage
}
