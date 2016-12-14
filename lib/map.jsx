import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { neighborhoods } from './util/locations';
import { selectObjects } from './util/functions';
var inside = require('point-in-polygon');

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.createMap = this.createMap.bind(this);
    this.state = {latitude: {}, longitude: {}};
  }

  drawNeighborhoods(array) {
    array.forEach((object) =>{
      for (var key in object) {
        let currentCoords = (object[key]);
        let currentNeighborhood =
          new google.maps.Polygon({
            paths: currentCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.40
        }).setMap(this.map);
      }
    });
  }

  createMap(position){
    this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});

    // const latitude = position.coords.latitude;
    // const longitude = position.coords.longitude;
    // const latitude = 40.739681;
    // const longitude = -73.990957;
    // this.checkShapes(latitude, longitude);

    const arrayToDraw = selectObjects(this.state.latitude, this.state.longitude);
    const mapDOMNode = this.refs.map;
    const mapOptions = {
      center: {lat: this.state.latitude, lng: this.state.longitude},
      zoom: 16
    };

    this.map = new google.maps.Map(mapDOMNode, mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: null,
      position: {lat: this.state.latitude, lng: this.state.longitude}
    });

    // var searchBox = new google.maps.places.SearchBox(this.map);
    this.searchBar();
    this.drawNeighborhoods(arrayToDraw);
    this.writeNeighborhood(arrayToDraw);
  }

  searchBar(){
    const map = this.map;
    const that = this;

    document.getElementById('pac-input').className = "pac-input";
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        that.setState({latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()});
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
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

      map.fitBounds(bounds);
    });
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
    const string = finalArray.join(", ");
    document.getElementById('text').innerHTML = string;
  }

  componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.createMap(position);
        }
      );
    }

  }

  render() {
    return (
      <div className="map" id="map-container" ref="map"></div>
    );
  }
}

export default Map;

// selectObjects(latitude, longitude){
//   let array = [];
//   for (var key in neighborhoods) {
//     if (neighborhoods.hasOwnProperty(key)) {
//       if (inside([latitude, longitude], this.convertObjectToIndividualObject(neighborhoods[key]))) {
//         let newObject = {};
//         newObject[key] = neighborhoods[key];
//         array.push(newObject);
//       }
//     }
//   }
//   return array;
// }
//
// convertObjectToIndividualObject(object) {
//   let array = [];
//   for (var key in object) {
//     if (Object.prototype.hasOwnProperty.call(object, key)) {
//       var value = object[key];
//       array.push(this.convertObjectToArray(value));
//     }
//   }
//   return array;
// }
//
// convertObjectToArray(object){
//   let array = [];
//   for (var key in object) {
//     if (Object.prototype.hasOwnProperty.call(object, key)) {
//       var value = object[key];
//         array.push(value);
//     }
//   }
//   return array;
// }

// checkShapes(latitude, longitude) {
//
//   let chelseaPolygon = [[40.737360, -73.996847], [40.742400, -74.009207],
//     [40.750659, -74.009058], [40.757037, -74.004952], [40.749810, -73.987793]];
//   let flatironPolygon = [[40.737377, -73.996850], [40.742903, -73.992809],
//     [40.740161, -73.986294], [40.737144, -73.988523], [40.738489, -73.991817],
//     [40.736005,-73.993652]];
//
//     let testArray = [chelseaPolygon, flatironPolygon];
//
//     // testArray.forEach((polygon) => {
//     //   console.log(inside([latitude, longitude], polygon));
//     // });
//
//
//       // inside([ latitude, longitude ], chelseaPolygon),
//       // inside([ latitude, longitude ], flatironPolygon)
//
// }

// chelsea.setMap(this.map);
// flatiron.setMap(this.map);

// const _getCoordsObj = latLng => ({
//   lat: latLng.lat(),
//   lng: latLng.lng()
// });
