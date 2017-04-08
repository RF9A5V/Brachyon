import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class CreateContainerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maxed: false
    }
  }

  toggleOption(item, index) {
    var eColor;
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league" >= 0)){
      eColor = "#FF6000";
    }
    const cStyle = {
      width: "10vw",
      height: "4vw",
      padding: "0.25vw",
      justifyContent: this.props.modStatus[item.key] ? "flex-end" : "flex-start",
      backgroundColor: "#666",
      marginRight: 80
    }
    const tStyle = {
      width: "50%",
      height: "100%",
      backgroundColor: this.props.modStatus[item.key] ? eColor : "white"
    }
    return (
      <div className="row x-center" style={cStyle} onClick={(e) => {
        e.preventDefault();
        this.props.toggle(item)
      }}>
        <div style={tStyle}>
        </div>
      </div>
    )
  }

  render() {
    const spanStyle = {
      fontSize: "6rem", marginLeft: 40
    }
    var eColor;
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league" >= 0)){
      eColor = "#FF6000";
    }

    return (
      <div className="col x-center" style={{
        width: this.state.maxed ? "75vw" : "10vw",
        height: "calc(100% - 111px)",
        backgroundColor: "#111",
        padding: 20,
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1
      }}>
        {
          this.props.items.map((item, i) => {
            return (
              <div className="row x-center" style={{marginBottom: 40, alignSelf: "flex-start", width: "100%"}} onClick={() => {
                this.props.onItemSelect(i)
                this.setState({
                  maxed: false
                })
              }}>
                <div className="col-1">
                  <FontAwesome name={item.icon} style={{fontSize: "6rem"}} />
                </div>
                {
                  this.state.maxed ? (
                    [
                      <span className="col-3" style={spanStyle}>
                        { item.name }
                      </span>,
                      <div className="col-2"></div>,
                      item.toggle ? (
                        this.toggleOption(item, i)
                      ) : (
                        <div style={{width: "10vw", marginRight: 80}}></div>
                      )

                    ]

                  ) : (
                    ""
                  )
                }
              </div>
            )
          })
        }
        <div className="col-1"></div>
        {
          this.state.maxed ? (
            <div className="row x-center" style={{alignSelf: "flex-start", width: "100%"}} onClick={() => {
              this.setState({
                maxed: false
              })
            }} >
              <div className="col-1">
                <FontAwesome name="chevron-left" style={{fontSize: "6rem"}}/>
              </div>
              <span className="col-3" style={spanStyle}>Collapse</span>
            </div>
          ) : (
            <FontAwesome name="chevron-right" style={{fontSize: "6rem"}} onClick={() => {
              this.setState({
                maxed: true
              })
            }} />
          )
        }

      </div>
    );
  }
}
