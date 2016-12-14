import { neighborhoods } from './locations';
var inside = require('point-in-polygon');

export function selectObjects(latitude, longitude) {
  let array = [];
  for (var key in neighborhoods) {
    if (neighborhoods.hasOwnProperty(key)) {
      if (inside([latitude, longitude], convertObjectToIndividualObject(neighborhoods[key]))) {
        let newObject = {};
        newObject[key] = neighborhoods[key];
        array.push(newObject);
      }
    }
  }
  return array;
}

function convertObjectToIndividualObject(object) {
  let array = [];
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      var value = object[key];
      array.push(convertObjectToArray(value));
    }
  }
  return array;
}

function convertObjectToArray(object){
  let array = [];
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      var value = object[key];
        array.push(value);
    }
  }
  return array;
}

export function drawNeighborhoods(array) {
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
