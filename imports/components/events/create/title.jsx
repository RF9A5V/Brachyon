import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Title extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: props.title || "",
      slug: props.slug || "",
      customSlug: false
    }
  }

  value() {
    if(this.refs.title.value.length < 3) {
      toastr.error("Event title needs to be longer than 3 characters.");
      throw new Error("Event title needs to be longer than 3 characters.");
    }
    if(this.refs.title.value.length > 50) {
      toastr.error("Event title cannot be longer than 50 characters.");
      throw new Error("Event title cannot be longer than 50 characters.");
    }
    return {
      title: this.refs.title.value,
      slug: this.refs.slug.value,
      isCustom: this.state.customSlug
    }
  }

  onChange(e) {
    var { value } = e.target;
    if(value.length > 50) {
      value = value.slice(0, 50);
    }
    this.setState({
      value,
      slug: !this.state.customSlug && this.props.generateFromTitle ? value.toLowerCase().replace(/\s/g, "-").replace(/[^\w\d-]+/g, "") : this.state.slug
    });
  }

  onSlugEdit(e) {
    var slug = e.target.value;
    this.setState({
      customSlug: slug != "",
      slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\d-]+/g, ""),
      loadingSlug: true
    }, () => {
      if(this.timer) {
        clearTimeout(this.timer);
      }
      if(this.state.slug == "") {
        this.setState({
          slug: this.refs.title.value.replace(/\s/g, "-").replace(/[^\w\d-]+/g, "")
        })
      }
      this.timer = setTimeout(_ => {
        if(this.state.customSlug) {
          Meteor.call("events.validateSlug", slug, (err) => {
            this.setState({
              validSlug: err == null,
              loadingSlug: false
            })
          })
        }
      }, 500);
    })
  }

  slugStatus() {
    if(this.state.customSlug) {
      var text;
      if(this.state.loadingSlug) {
        text = "Loading..."
      }
      else {
        text = this.state.validSlug ? "Available" : "Taken";
      }
      return `(${text})`;
    }
    return null;
  }

  renderBase(opts) {
    return (
      <div className="row">
        <div className="col col-1" style={{marginRight: 10}}>
          <label style={{fontSize: opts.fontSize, padding: opts.labelPad}} className="input-label">Title { this.state.value.length } / 50</label>
          <input className={opts.inputClass} ref="title" value={this.state.value} type="text" onChange={this.onChange.bind(this)} style={{margin: 0}}/>
        </div>
        <div className="col col-1">
          <label style={{fontSize: opts.fontSize, padding: opts.labelPad}} className="input-label">URL {this.slugStatus()}</label>
          <input className={opts.inputClass} ref="slug" value={this.state.slug} type="text" onChange={this.onSlugEdit.bind(this)} style={{margin: 0}}/>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      inputClass: "",
      width: 300,
      labelPad: 5
    })
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      fontSize: "1em",
      width: "100%",
      labelPad: 5
    })
  }

}
