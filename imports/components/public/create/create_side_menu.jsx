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
      backgroundColor: "#666"
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
      fontSize: "1.5rem", marginLeft: 10
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
        width: this.state.maxed ? "50vw" : "10vw",
        height: "calc(100vh - 91px)",
        backgroundColor: "#111",
        padding: 10,
        position: "fixed",
        left: 0,
        top: 50,
        zIndex: 2,
        paddingTop: "1em"
      }}>
        {
          this.props.items.map((item, i) => {
            return (
              <div className="row x-center" style={{marginBottom: "1em", alignSelf: "flex-start", width: "100%", justifyContent: this.state.maxed ? "flex-start" : "center"}} onClick={() => {
                this.props.onItemSelect(i)
                this.setState({
                  maxed: false
                })
              }}>
                <div className="row center col-1">
                  <FontAwesome name={item.icon} style={{fontSize: "2.5rem", color: this.props.selected == i ? eColor : "white"}} />
                </div>
                {
                  this.state.maxed ? (
                    [
                      <span className="col-3" style={{...spanStyle, color: this.props.selected == i ? eColor : "white"}}>
                        { item.name }
                      </span>,
                      <div className="col-1"></div>,
                      item.toggle ? (
                        this.toggleOption(item, i)
                      ) : (
                        <div style={{width: "10vw"}}></div>
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
                    <div className="row x-center" style={{alignSelf: "flex-start", width: "100%", marginBottom: "1em"}} onClick={a.action}>
                      <div className="col-1 row center">
                        <FontAwesome name={a.icon} style={{fontSize: "2.5rem"}}/>
                      </div>
                      <span className="col-3" style={spanStyle}>{a.name}</span>
                      <div style={{width: "10vw"}}></div>
                    </div>
                  )
                })
              }
              <div className="row x-center" style={{alignSelf: "flex-start", width: "100%"}} onClick={() => {
                this.setState({
                  maxed: false
                })
              }} >
                <div className="col-1 row center">
                  <FontAwesome name="chevron-left" style={{fontSize: "2.5rem"}}/>
                </div>
                <span className="col-3" style={spanStyle}>Collapse</span>
                <div style={{width: "10vw"}}></div>
              </div>
            </div>
          ) : (
            <FontAwesome name="chevron-right" style={{fontSize: "2rem"}} onClick={() => {
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
