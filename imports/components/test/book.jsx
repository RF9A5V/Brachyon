import React, { Component } from "react";

import SlideMain from "./slides/slide_main.jsx";
import TitlePage from "./slides/title.jsx";
import CFPage from "./slides/crowdfunding.jsx";
import StreamPage from "./slides/stream.jsx";

export default class BookScreen extends Component {

  pages() {
    return [
      {
        name: "Cover",
        component: <TitlePage />
      },
      {
        name: "Crowdfunding",
        component: <CFPage />
      },
      {
        name: "Stream",
        component: <StreamPage />
      }
    ]
  }

  render() {
    return (
      <SlideMain slides={this.pages()} />
    )
  }
}
