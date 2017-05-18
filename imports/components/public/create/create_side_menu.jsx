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
      fontSize: "5rem", marginLeft: 40
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
        height: "calc(100vh - (126px * 2))",
        backgroundColor: "#111",
        padding: 20,
        position: "fixed",
        left: 0,
        top: 126,
        zIndex: 2,
        paddingTop: "4em"
      }}>
        {
          this.props.items.map((item, i) => {
            return (
              <div className="row x-center" style={{marginBottom: "4em", alignSelf: "flex-start", width: "100%"}} onClick={() => {
                this.props.onItemSelect(i)
                this.setState({
                  maxed: false
                })
              }}>
                <div className="col-1">
                  <FontAwesome name={item.icon} style={{fontSize: "4.5rem", color: this.props.selected == i ? eColor : "white"}} />
                </div>
                {
                  this.state.maxed ? (
                    [
                      <span className="col-3" style={{...spanStyle, color: this.props.selected == i ? eColor : "white"}}>
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
            <div className="col" style={{width: "100%"}}>
              {
                this.props.actions.map(a => {
                  return (
                    <div className="row x-center" style={{alignSelf: "flex-start", width: "100%"}} onClick={a.action}>
                      <div className="col-1">
                        <FontAwesome name={a.icon} style={{fontSize: "4.5rem"}}/>
                        <FontAwesome name={a.icon} />
                      </div>
                      <span className="col-3" style={spanStyle}>{a.name}</span>
                      <div style={{width: "10vw", marginRight: 80}}></div>
                    </div>
                  )
                })
              }
              <div className="row x-center" style={{alignSelf: "flex-start", width: "100%"}} onClick={() => {
                this.setState({
                  maxed: false
                })
              }} >
                <div className="col-1">
                  <FontAwesome name="chevron-left" style={{fontSize: "4.5rem"}}/>
                </div>
                <span className="col-3" style={spanStyle}>Collapse</span>
                <div style={{width: "10vw", marginRight: 80}}></div>
              </div>
            </div>
          ) : (
            <FontAwesome name="chevron-right" style={{fontSize: "4.5rem"}} onClick={() => {
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
