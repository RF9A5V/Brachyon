import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Title extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title || "",
      slug: props.slug || "",
      customSlug: false
    }
  }

  value() {
    return {
      title: this.refs.title.value,
      slug: this.refs.slug.value,
      customSlug: this.state.customSlug
    }
  }

  onChange(e) {
    var { value } = e.target;
    value = value.slice(0, 50);
    this.props.setLocalValue("title", value);
    this.setState({
      title: value,
      slug: !this.state.customSlug && this.props.generateFromTitle ? value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\d-]+/g, "") : this.state.slug
    });
  }

  onSlugEdit(e) {
    var { value } = e.target;
    this.setState({
      customSlug: value != "",
      slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\d-]+/g, ""),
      loadingSlug: true
    }, _ => {
      if(this.timer) {
        clearTimeout(this.timer);
      }
      if(this.state.customSlug) {
        this.timer = setTimeout(_ => {
          Meteor.call("leagues.validateSlug", this.state.slug, (err) => {
            this.setState({
              validSlug: err == null,
              loadingSlug: false
            })
          })
        })
      }
      if(this.state.slug == "") {
        this.setState({
          slug: this.refs.title.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\d-]+/g, "")
        })
      }
    })
  }

  slugStatus() {
    if(this.state.customSlug) {
      var text = "";
      if(this.state.loadingSlug) {
        text = "Loading...";
      }
      else {
        text = this.state.validSlug ? "Available" : "Taken"
      }
      return `(${text})`
    }
    return null;
  }

  renderBase(opts) {
    return (
      <div className={opts.orientation} style={{marginBottom: 10}}>
        <div className="col col-1" style={{marginRight: opts.orientation == "row" ? 10 : 0, marginBottom: opts.orientation == "col" ? 10 : 0}}>
          <label style={{fontSize: opts.fontSize}} className="input-label">Title { this.state.title.length } / 50</label>
          <input className={opts.inputClass} type="text" ref="title" value={this.state.title} style={{margin: 0}} onChange={this.onChange.bind(this)} />
        </div>
        <div className="col col-1">
          <label className="input-label" style={{fontSize: opts.fontSize}}>URL {this.slugStatus()}</label>
          <input className={opts.inputClass} type="text" ref="slug" value={this.state.slug} style={{margin: 0}} onChange={this.onSlugEdit.bind(this)} />
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      orientation: "row",
      fontSize: "1em",
      inputClass: ""
    })
  }

  renderMobile() {
    return this.renderBase({
      orientation: "col",
      fontSize: "1em"
    })
  }
}
