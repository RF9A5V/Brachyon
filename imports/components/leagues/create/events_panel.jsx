import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class EventsPanel extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      option: 0,
      events: props.attrs.events,
      charCount: (props.attrs.events[0].name || props.attrs.details.name || "").length
    }
  }

  componentWillUnmount() {
    this.props.setValue("events", null);
  }

  eventCounter() {
    var events = this.state.events;
    var decrementIcon = events.length <= 1 ? (
      <FontAwesome name="caret-left" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome name="caret-left" size="3x" onClick={() => { events.pop(); }} />
    );
    var incrementIcon = events.length >= 30 ? (
      <FontAwesome name="caret-right" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome name="caret-right" size="3x" onClick={() => { events.push({}); }} />
    );
    return (
      <div className="row x-center center">
        { decrementIcon }
        <span style={{padding: 10, backgroundColor: "#111", margin: "0 20px"}}>{ events.length }</span>
        { incrementIcon }
      </div>
    )
  }

  categories() {
    var options = this.state.events.map((e, i) => { return e.name });
    return options.map((val, i) => {
      var style = {
        backgroundColor: "#111",
        padding: 10,
        width: 100,
        marginRight: 10,
        textAlign: "center",
        cursor: "pointer",
        height: 40,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
      }
      return (
        <div style={style} onClick={() => { this.setState({ option: i }) }}>
          <span style={{color: this.state.option == i ? "#00BDFF" : "#FFF"}}>
          { val ? (val) : this.props.attrs.details.name || "Default" + " " + (i + 1) }
          </span>
        </div>
      )
    })
  }

  form() {
    return (
      <div className="col">
        <div className="row">
          <h5>Event Name</h5>
        </div>
        <input type="text" onChange={(e) => {
          var value = e.target.value;
          e.target.value = value.substring(0, 50);
          this.setState({
            charCount: value.length
          });
          this.state.events[this.state.option].name = value;
          this.props.setValue("events", this.state.events);
        }} defaultValue={this.state.events[this.state.option].name || (this.props.attrs.details.name || "Default" + " ") + (this.state.option + 1)} />
      </div>
    )
  }

  render() {
    return (
      <div className="col">
        { this.eventCounter() }
        <hr className="user-divider" />
        <div className="row" style={{marginBottom: 10}}>
          { this.categories() }
        </div>
        { this.form() }
      </div>
    )
  }
}
