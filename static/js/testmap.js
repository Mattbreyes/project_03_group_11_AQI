let myMap = L.map("map", {
  center: [36.9915, 119.7889],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "<url>";

d3.json(url).then(function(response) {

  features = response.features;

  let heatArray = [];

  for (let i = 0; i < features.length; i++) {
    let latitude = features[i].lat;
    let longitude = features[i].long;

    if (latitude && longitude) {
      heatArray.push([latitude,longitude]);
    }

  }

  let heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});

//pull all earthquakes data from the past 7 days
let url2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//a GET request to the query URL/
d3.json(url2).then(function(data) {
  console.log(data)
  
  createMap(data);
});

function createMap(data){
let Map = L.map("map2", {
  center: [40.59, -112.11],
  zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(Map);
};