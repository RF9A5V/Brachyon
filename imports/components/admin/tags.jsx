import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import Tags from "/imports/api/meta/tags.js";

export default class TagAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: Meteor.subscribe("tags", {
        onReady: () => {
          this.setState({ tagsReady: true })
        }
      }),
      tagsReady: false
    }
  }

  componentWillUnmount() {
    this.state.tags.stop();
  }

  onTagCreate() {
    if(this.refs.text.value == "") {
      return toastr.error("Tag must have non-zero length.", "Error!");
    }
    Meteor.call("tags.create", this.refs.text.value, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.text.value = "";
        this.forceUpdate();
      }
    })
  }

  onTagDelete(id) {
    var conf = confirm("Are you sure you want to delete this tag?");
    if(conf) {
      Meteor.call("tags.delete", id, (err) => {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.warning("Deleted tag.", "Warning!");
          this.forceUpdate();
        }
      })
    }
  }

  render() {
    if(!this.state.tagsReady) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div>
        <div className="col">
          <label>Add A Tag</label>
          <div className="row x-center">
            <input type="text" style={{marginRight: 10}} ref="text" />
            <button onClick={this.onTagCreate.bind(this)}>Submit</button>
          </div>
        </div>
        <div className="tag-container">
          {
            Tags.find({}).map((tag) => {
              return (
                <div className="tag">
                  <span className="tag-text">
                    #{ tag.text }
                  </span>
                  <FontAwesome name="times" onClick={() => { this.onTagDelete(tag._id) }} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
