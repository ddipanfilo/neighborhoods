import React, { Component } from 'react';
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
    // Add current location
      // if ((position.coords.latitude < 41.1111 &&
      //   position.coords.latitude > 40.5083) &&
      //   (position.coords.longitude < -73.5223 &&
      //     position.coords.longitude > -74.2062)
      //   ) { this.setState({latitude: position.coords.latitude,
      //     longitude: position.coords.longitude
      //   });
      // } else {
      //   this.setState({latitude: 40.739681, longitude: -73.990957});
      // }

    this.setState({latitude: 40.739681, longitude: -73.990957});

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

    this.searchBar();
    this.mouseHover();
    this.draw();
    document.getElementById('david').innerHTML = "Developed by David DiPanfilo";
  }

  mouseHover() {
    google.maps.event.addListener(this.map, 'mousemove', (event) => {
      this.markers.forEach( marker =>
        marker.setMap(null)
      );
      this.setState({latitude: event.latLng.lat(),
        longitude: event.latLng.lng()
      });
      this.clearPolygons();
      this.draw();
    });
  }

  searchBar(){
    document.getElementById('pac-input').className = "pac-input";
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      this.clearPolygons();
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }

      this.clearMarkers();

      var bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          return;
        }

        this.handleSearchMarkers(place);

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      document.getElementById('pac-input').value = "";
      this.map.fitBounds(bounds);
      this.map.setZoom(15);
    });
  }

  handleSearchMarkers(place){
    if (this.markers.length === 0) {
      this.setState({latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      });

      this.draw();

      this.markers.push(new google.maps.Marker({
        map: this.map,
        draggable: false,
        animation: null,
        title: place.name,
        position: place.geometry.location
      }));
    }
  }

  clearPolygons(){
    this.polygons.forEach(function(polygon) {
      polygon.setMap(null);
    });
    this.polygons = [];
  }

  clearMarkers(){
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  draw(){
    const arrayToDraw = selectObjects(this.state.latitude,
      this.state.longitude
    );
    this.writeNeighborhood(arrayToDraw);
    this.drawNeighborhoods(arrayToDraw);
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

    const string = finalArray.join("+ ");
    document.getElementById('text').innerHTML = string;
  }

  componentDidMount() {
    // For current location
      // if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition((position) => {
      //       this.createMap(position);
      //     }
      //   );
      // }

    setTimeout( () => { this.createMap(); }, 2000);
  }

  render() {
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
