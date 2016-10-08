import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import NameSearch from "./search/name.jsx";
import LocationSearch from "./search/location.jsx";
import GameSearch from "./search/game.jsx";
import DateFilter from "./search/date_filter.jsx";

export default class DiscoverSearch extends Component {

  constructor() {
    super();
    this.state = {
      moreOptions: false,
      params: {}
    }
  }

  setSearchParams(paramName){
    return (value) => {
      this.state.params[paramName] = value;
      this.forceUpdate();
    }
  }

  getSearchResults() {
    if(!this.state.moreOptions){
      delete this.state.params.date;
    }
    this.props.handler(this.state.params, this.query());
  }

  query() {
    var query = {};
    Object.keys(this.refs).forEach(ref => {
      var subQuery = this.refs[ref].query();
      Object.keys(subQuery).map(cmd => {
        query[cmd] = subQuery[cmd];
      })
    })
    return query;
  }

  render(){
    return (
      <div className="col">
        <div className="row center" style={{textAlign: 'left', margin: "10px 0", alignItems: "flex-end"}}>
          <NameSearch ref="name" onChange={this.setSearchParams("name")} onSubmit={this.getSearchResults.bind(this)} />
          <LocationSearch ref="location" onChange={this.setSearchParams("location")} onSubmit={this.getSearchResults.bind(this)} />
          <GameSearch ref="game" onChange={this.setSearchParams("game")} onSubmit={this.getSearchResults.bind(this)} />
          <button style={{marginBottom: 22}} onClick={this.getSearchResults.bind(this)}>
            <FontAwesome name="search"/>
          </button>
          {
            // <button style={{marginLeft: 10, marginBottom: 22}} onClick={() => { this.setState({ moreOptions: !this.state.moreOptions }) }}>
            //   {
            //     //this.state.moreOptions ? "Less" : "More"
            //   }
            // </button>
          }
        </div>
        {
          // this.state.moreOptions ? (
          //   <div className="row center" style={{textAlign: 'left', margin: "10px 0"}}>
          //     <DateFilter onChange={this.setSearchParams("date")} />
          //   </div>
          // ) : (
          //   ""
          // )
        }
      </div>
    );
  }
}
