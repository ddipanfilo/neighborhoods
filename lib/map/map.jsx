import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { neighborhoods, chelsea, flatiron } from '../util/locations';
var inside = require('point-in-polygon');

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  selectObjects(latitude, longitude){
    let array = [];
    for (var key in neighborhoods) {
      if (neighborhoods.hasOwnProperty(key)) {
        if (inside([latitude, longitude], this.convertObjectToIndividualObject(neighborhoods[key]))) {
          let newObject = {};
          newObject[key] = neighborhoods[key];
          array.push(newObject);
        }
      }
    }
    return array;
  }

  convertObjectToIndividualObject(object) {
    let array = [];
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var value = object[key];
        array.push(this.convertObjectToArray(value));
      }
    }
    return array;
  }

  convertObjectToArray(object){
    let array = [];
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var value = object[key];
          array.push(value);
      }
    }
    return array;
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

  createMap(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // const latitude = 40.739681;
    // const longitude = -73.990957;
    const arrayToDraw = this.selectObjects(latitude, longitude);
    // this.checkShapes(latitude, longitude);

    const mapDOMNode = this.refs.map;
    const mapOptions = {
      center: {lat: latitude, lng: longitude},
      zoom: 16
    };

    this.map = new google.maps.Map(mapDOMNode, mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: null,
      position: {lat: latitude, lng: longitude}
    });

    this.drawNeighborhoods(arrayToDraw);

    // chelsea.setMap(this.map);
    // flatiron.setMap(this.map);
  }

  // const _getCoordsObj = latLng => ({
  //   lat: latLng.lat(),
  //   lng: latLng.lng()
  // });

  componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) =>
        this.createMap(position)
      );
    }
  }

  render() {
    return <div className="map" id="map-container" ref="map"></div>;
  }
}

export default Map;
