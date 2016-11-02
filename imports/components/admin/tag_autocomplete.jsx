import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import Tags from "/imports/api/meta/tags.js";

export default class TagAutocomplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTags: Meteor.subscribe("tagsByList", props.tags, {
        onReady: () => {
          this.setState({ defaultTagsReady: true })
        }
      }),
      tags: Meteor.subscribe("tagSearch", "", {
        onReady: () => {
          this.setState({ tagsReady: true })
        }
      }),
      defaultTagsReady: false,
      tagsReady: false,
      text: "",
      defaultTags: props.tags
    }
  }

  componentWillUnmount() {
    this.state.tags.stop();
    this.state.currentTags.stop();
  }

  onChange() {
    clearTimeout(this.state.timer);
    this.setState({ ready: false });
    this.state.timer = setTimeout(() => {
      this.setState({
        tags: Meteor.subscribe("tagSearch", this.refs.tagInput.value, () => {
          this.setState({
            ready: true,
            text: this.refs.tagInput.value
          });
        })
      })
    }, 500);
  }

  onTagClick(tag) {
    if(this.state.defaultTags.indexOf(tag._id) >= 0) {
      return toastr.error("Tag already exists for this game!");
    }
    this.state.defaultTags.push(tag._id);
    this.setState({
      ready: false,
      text: ""
    });
    this.refs.tagInput.value = "";
    this.props.onTagSelect(tag);
  }

  onTagRemove(tag) {
    console.log(this.state.defaultTags.indexOf(tag._id));
    this.state.defaultTags.splice(this.state.defaultTags.indexOf(tag._id), 1);
    this.props.onTagRemove(tag);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="col center x-center">
        <div>
          <span style={{marginRight: 20}}>Tag</span>
          <div style={{position: "relative"}}>
            <input type="text" ref="tagInput" onChange={this.onChange.bind(this)} style={{marginRight: 0}} />
            {
              this.state.ready ? (
                <div className="col" style={{position: "absolute", top: 60, width: "100%"}}>
                  {
                    Tags.find({ text: new RegExp(this.state.text) }).map((tag) => {
                      return (
                        <div onClick={() => { this.onTagClick(tag) }} style={{backgroundColor: "#111", padding: 20, cursor: "pointer"}}>
                          #{ tag.text }
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                ""
              )
            }
          </div>
        </div>
        {
          this.state.defaultTagsReady ? (
            <div className="tag-container">
              {
                Tags.find({ _id: { $in: this.state.defaultTags } }).map((tag) => {
                  return (
                    <div className="tag">
                      <span className="tag-text">#{ tag.text }</span>
                      <FontAwesome name="times" onClick={ () => { this.onTagRemove(tag) } } />
                    </div>
                  )
                })
              }
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
