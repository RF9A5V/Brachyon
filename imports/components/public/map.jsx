import React, { Component } from "react";
import GoogleMapReact from "google-map-react";


class DefaultMarker extends Component {
  render() {
    return (
      <img className="noselect" src="/images/brachyon_logo_trans.png" style={{width: 30, height: "auto"}} />
    )
  }
}

export default class PreviewMap extends Component {
  render() {
    return (
      <div className="col-1" style={{width: "100%"}}>
        <GoogleMapReact center={this.props.center} defaultZoom={15} bootstrapURLKeys={{
          key: "AIzaSyCuuEqAY_bsIg36UVycebVrPY5Tr6pSRFA"
        }}>
          <DefaultMarker lat={this.props.center[0]} lng={this.props.center[1]} />
        </GoogleMapReact>
      </div>
    )
  }
}
