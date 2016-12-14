import { data } from '../../raw/ny.js';

function scrape(){
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

  return finalObject;
}
