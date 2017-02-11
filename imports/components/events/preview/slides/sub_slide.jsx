import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Swipeable from "react-swipeable";

export default class SubSlideContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentItem: 0,
      swiping: false
    };
  }

  backgroundImage() {
    return this.props.backgroundImage ? this.props.backgroundImage : "/images/bg.jpg";
  }

  onUp() {
    if(this.state.currentItem < this.props.items.length - 1) {
      this.state.currentItem ++;
      this.refs.container.scrollTop = (window.innerHeight - 100) * this.state.currentItem;
      this.forceUpdate();
    }
  }

  onDown() {
    if(this.state.currentItem > 0) {
      this.state.currentItem --;
      this.refs.container.scrollTop = (window.innerHeight - 100) * this.state.currentItem;
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="slide-container" ref="container">
        {
          this.props.items.map((item, i) => {
            return (
              <Swipeable onSwipedUp={this.onUp.bind(this)} onSwipedDown={this.onDown.bind(this)}>
                <div className="slide" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.backgroundImage()})`}}>
                  <item.component {...item.args} />
                </div>
              </Swipeable>
            )
          })
        }
        {
          this.props.items.length > 1 ? (
            <div className="slide-controller">
              {
                this.props.items.map((item, i) => {

                  return (
                    <FontAwesome name="circle" className={`slide-controller-tab ${i == this.state.currentItem ? "active" : ""}`} onClick={() => {
                      this.refs.container.scrollTop = (window.innerHeight - 100) * i;
                      this.setState({ currentItem: i });
                    }} />
                  )
                })
              }
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
    )
  }
}
