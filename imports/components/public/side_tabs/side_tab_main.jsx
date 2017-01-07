import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";

export default class SideTabMain extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAnimating: true,
      activeItem: props.activeItem,
      activeSub: props.activeSub
    }
  }

  componentDidMount() {
    this.setState({
      isAnimating: false
    })
  }

  onSubTabSelect(index, subIndex) {
    this.props.onItemSelect(index, subIndex);
  }

  componentWillReceiveProps(next) {
    this.setState({
      isAnimating: true
    }, () => {
      setTimeout(() => {
        this.setState({
          activeSub: next.activeSub,
          isAnimating: false
        })
      }, 400)
    })
  }

  render() {
    var subItem = this.props.items[this.props.activeItem].subitems[this.state.activeSub];
    if(subItem == null) {
      return "";
    }
    return (
      <div className="tab-content col">
        {
          // <div style={{textAlign: "center"}}>
          //   <h2 style={{display: "inline-block"}}>{this.state.items[this.props.activeItem].text}</h2>
          // </div>
        }
        <div>
          {
            this.props.items[this.props.activeItem].subitems.length > 1 ? (
              this.props.items[this.props.activeItem].subitems.map((item, i) => {

                var optionStyle = {
                  padding: 10,
                  marginRight: 10,
                  width: 100,
                  marginBottom: 10,
                  color: this.state.activeSub == i ? "#0BDDFF" : "white",
                  backgroundColor: "#111",
                  cursor: "pointer",
                  display: "inline-block"
                }

                return (
                  <div style={optionStyle} onClick={() => { this.onSubTabSelect(this.props.activeItem, i) }}>
                    { item.text }
                  </div>
                )
              })
            ) : (
              ""
            )

          }
        </div>
        <VelocityComponent animation={{opacity: this.state.isAnimating ? 0 : 1}} duration={400}>
          <div className="col-1">
            {
              <subItem.component item={this.props.items[this.props.activeItem]} onItemSelect={this.props.onItemSelect} activeItem={this.props.activeItem} { ...(subItem.args || {}) } update={this.props.update} />
            }
          </div>
        </VelocityComponent>
      </div>
    )
  }
}
