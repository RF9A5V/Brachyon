import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';

export default class DiscoverSearch extends Component {

  componentWillMount(){

    self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('test')),
      {types: ['geocode']});
      autocomplete.addListener('place_changed', function(){
        lat = autocomplete.getPlace().geometry.location.lat();
        lng = autocomplete.getPlace().geometry.location.lng();
        self.setState({
          location: {
            lat, lng
          }
        })
        self.stateChanged();
      })
    });
  }

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  changeSearch(e){
    self = this;
    e.preventDefault();
    if(this.state && this.state.timeout){
      clearTimeout(this.state.timeout);
    }
    this.setState({
      search: this.refs.search.value,
      timeout: setTimeout(function(){
        self.stateChanged();
        console.log('here');
        clearTimeout(this);
      }, 500)
    })
  }

  changeDate(e){
    e.preventDefault();
    this.setState({
      date: this.refs.date.value
    })
    this.stateChanged();
  }

  stateChanged() {
    console.log(this.state);
    this.props.handler(this.state);
  }

  render(){
    return (
      <div style={{textAlign: 'center'}}>
        <input type="text" ref="search" onChange={this.changeSearch.bind(this)} placeholder="Search for events..."/>
        <input id="test" ref="location" style={{marginLeft: 15}} type="text" placeholder='Location'/>
        <input style={{marginLeft: 15}} ref="date" type="date" placeholder="Date" onChange={this.changeDate.bind(this)}/>
        <input style={{marginLeft: 15}} ref="game" type="text" placeholder="Game"/>
      </div>
    );
  }
}
