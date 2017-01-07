import React from 'react';

export default class TabController extends React.Component {

  componentWillMount(){
    this.setState({page: 0});
  }

  tabs(){
    return this.props.tabs.map( (value) => { return value.title; } );
  }

  content() {
    return this.props.tabs.map( (value) => { return value.content; } );
  }

  switchTab(page) {
    return function(e){
      this.setState({page});
    }
  }

  render() {
    return (
      <div className="col tab-controller">
        <div className="tab-container row">
          {this.tabs().map( (value, index) => {
            return <Tab title={value} key={index} active={index==this.state.page} handler={this.switchTab(index).bind(this)} />
          })}
        </div>
        <div className="tab-content-container">
          {this.content().map( (value, index) => {
            return <Content content={value} key={index} active={index==this.state.page} />
          })}
        </div>
      </div>
    )
  }
}

class Tab extends React.Component {
  render(){
    style = {}
    if(this.props.active){
      style.fontWeight = 'bold';
      style.borderBottom = 'solid 2px white';
    }
    return (
      <div className='tab' onClick={this.props.handler}>
        <span style={style}>{this.props.title}</span>
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    style = {};
    if(!this.props.active){
      style.display = 'none';
    }
    return (
      <div className='tab-content-block' style={style}>
        {this.props.content}
      </div>
    )
  }
}
