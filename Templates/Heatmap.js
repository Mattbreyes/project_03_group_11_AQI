let myMap = L.map("map", {
  center: [36.9915, 119.7889],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "http://127.0.0.1:5000/1980-01-01";

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
