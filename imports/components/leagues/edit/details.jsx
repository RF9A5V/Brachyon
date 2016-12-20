import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";
import LocationSelect from "/imports/components/events/create/location_select.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

class DetailsPanel extends Component {
  render() {
    return (
      <div>
        Dawg
      </div>
    )
  }
}

class LeagueNameInput extends Component {
  render() {
    return (
      <div className="col">
        <h5>League Name</h5>
        <input type="text" defaultValue={this.props.name}/>
      </div>
    )
  }
}

class LeagueDescription extends Component {
  render() {
    return (
      <Editor usePara={true} useInsert={true} useTable={true} value={this.props.description} />
    )
  }
}

class LeagueLocation extends Component {
  render() {
    return (
      <LocationSelect {...this.props.location} />
    )
  }
}

class LeagueImage extends Component {
  render() {
    return (
      <ImageForm url={this.props.image} />
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
