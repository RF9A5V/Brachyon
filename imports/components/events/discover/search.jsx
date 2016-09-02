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
    this.props.handler(this.state.params);
  }

  render(){
    return (
      <div className="col">
        <div className="row center" style={{textAlign: 'left', margin: "10px 0", alignItems: "flex-end"}}>
          <NameSearch onChange={this.setSearchParams("name")} />
          <LocationSearch onChange={this.setSearchParams("location")} />
          <GameSearch onChange={this.setSearchParams("game")} />
          <button style={{margin: 2.5}} onClick={this.getSearchResults.bind(this)}>
            <FontAwesome name="search"/>
          </button>
          <button style={{margin: 2.5}} onClick={() => { this.setState({ moreOptions: !this.state.moreOptions }) }}>
            {
              this.state.moreOptions ? "Less" : "More"
            }
          </button>
        </div>
        {
          this.state.moreOptions ? (
            <div className="row center" style={{textAlign: 'left', margin: "10px 0"}}>
              <DateFilter onChange={this.setSearchParams("date")} />
            </div>
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
