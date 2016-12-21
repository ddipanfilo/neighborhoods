import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { neighborhoods } from './util/locations';
import { selectObjects } from './util/functions';
var inside = require('point-in-polygon');

// import {data} from '../raw/ny';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.createMap = this.createMap.bind(this);
    this.state = {latitude: {}, longitude: {}};
  }

  drawNeighborhoods(array) {
    let polygons = [];

    let colors = ["#FF0000", "#0000FF", "#00ff00", "#ffff00"];
    let colorIdx = 0;

    array.forEach((object) => {

      for (var key in object) {
        if (colorIdx === 4) {
          colorIdx = 0;
        }
        let currentCoords = (object[key]);

        let currentNeighborhood =
          new google.maps.Polygon({
            paths: currentCoords,
            strokeColor: colors[colorIdx],
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: colors[colorIdx],
            fillOpacity: 0.40
        });
        polygons.push(currentNeighborhood);
        currentNeighborhood.setMap(this.map);
        colorIdx += 1;
      }
    });

    this.polygons = polygons;
  }

  createMap(position){
    // if ((position.coords.latitude < 41.1111 &&
    // position.coords.latitude > 40.5083) &&
    // (position.coords.longitude < -73.5223 &&
    // position.coords.longitude > -74.2062)) {
    //   this.setState({latitude: position.coords.latitude,
    // longitude: position.coords.longitude});
    // } else {
    //   this.setState({latitude: 40.739681, longitude: -73.990957});
    // }

    this.setState({latitude: 40.739681, longitude: -73.990957});
    const arrayToDraw = selectObjects(this.state.latitude,
      this.state.longitude
    );
    // const arrayToDraw = [neighborhoods];
    const mapDOMNode = this.refs.map;
    const mapOptions = {
      center: {lat: this.state.latitude, lng: this.state.longitude},
      zoom: 15
    };

    this.map = new google.maps.Map(mapDOMNode, mapOptions);
    this.markers = [];
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: null,
      scrollwheel: false,
      position: {lat: this.state.latitude, lng: this.state.longitude}
    });
    this.markers.push(marker);

    // var searchBox = new google.maps.places.SearchBox(this.map);
    this.searchBar(marker);
    this.mouseHover(marker);
    this.drawNeighborhoods(arrayToDraw);
    this.writeNeighborhood(arrayToDraw);
  }

  mouseHover(originalMarker) {
    const that = this;
    google.maps.event.addListener(this.map, 'mousemove', function(event) {
      that.markers.forEach( marker =>
        marker.setMap(null)
      );
      that.setState({latitude: event.latLng.lat(), longitude: event.latLng.lng()});
      const arrayToDraw = selectObjects(that.state.latitude,
        that.state.longitude
      );
      that.writeNeighborhood(arrayToDraw);
      that.clearPolygons();
      that.drawNeighborhoods(arrayToDraw);
    });


  }

  searchBar(originalMarker){
    const map = this.map;
    const that = this;

    document.getElementById('pac-input').className = "pac-input";
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [originalMarker];
    // Listen for the event fired when the user
    // selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      that.clearPolygons();
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      that.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      that.markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          // console.log("Returned place contains no geometry");
          return;
        }

        that.setState({latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()});
        const arrayToDraw = selectObjects(that.state.latitude,
          that.state.longitude);
        that.drawNeighborhoods(arrayToDraw);
        that.writeNeighborhood(arrayToDraw);
        // Create a marker for each place.
        that.markers.push(new google.maps.Marker({
          map: map,
          draggable: false,
          animation: null,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      document.getElementById('pac-input').value = "";
      map.fitBounds(bounds);
      map.setZoom(15);
    });
  }

  clearPolygons(){
    this.polygons.forEach(function(polygon) {
      polygon.setMap(null);
    });
    this.polygons = [];
  }

  writeNeighborhood(array) {
    let finalArray = [];
    array.forEach((object) => {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          finalArray.push(key+" ");
        }
      }
    });
    // finalArray = ["Chelsea", "Flatiron"];
    const string = finalArray.join("+ ");

    document.getElementById('david').innerHTML = "Developed by David DiPanfilo";
    document.getElementById('zillow').className = "zillow";
    document.getElementById('text').innerHTML = string;
  }

  componentDidMount() {
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //       this.createMap(position);
    //     }
    //   );
    // }

    setTimeout( () => { this.createMap(); }, 2000);

  }

  scrape(){
    let finalObject = {};
    let i = 1;

    data.forEach((object) => {
      let coordinates = object.coordinates;
      let newCoordinates = [];
      coordinates[0].forEach((array) => {
        let coordinateObj = {};
        coordinateObj.lng = array[0];
        coordinateObj.lat = array[1];
        newCoordinates.push(coordinateObj);
      });

      let newObj = {};
      finalObject[i] = newCoordinates;
      i += 1;
    });

    let string = JSON.stringify(finalObject);
  }

  render() {
    // this.scrape();
    return (
      <div className="parent-div">
        <input id="pac-input" className="none"
          type="text" placeholder="Search Box"
        />
        <img className="loading" src="./app/assets/images/ripple.gif"></img>
        <div className="map" id="map-container" ref="map"></div>
        <div id="text"></div>
      </div>
    );
  }

}

export default Map;
