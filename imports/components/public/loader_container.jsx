import React, { Component } from "react";

import Loader from "/imports/components/public/loader.jsx";


export default class LoaderContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.ready) {
      setTimeout(() => {
        this.props.onReady()
      }, 1000);
    }
  }

  componentWillReceiveProps(next) {
    if(next.ready) {
      setTimeout(() => {
        this.props.onReady()
      }, 1000);
    }
  }

  render() {
    return (
      <div className="col center x-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", top: 0, left: 0, bottom: 0, right: 0}}>
        <Loader width={500} animate={true} />
      </div>
    )
  }

}
