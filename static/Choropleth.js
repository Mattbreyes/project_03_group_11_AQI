// Creating the map object - center of california
let myMap = L.map("map", {
  center: [36.9915, 119.7889],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "http://127.0.0.1:5000"

let geojson;

// Get the data with d3.
d3.json(geoData).then(function(data) {

  geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "aqi",

    scale: ["#ffffb2", "#b10026"],

    steps: 10,

    mode: "q",
    style: {
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("</strong><br /><br />Estimated Air quality level: " +
        feature.properties.aqi)
    }
  }).addTo(myMap);

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    let labels = [];

    let legendInfo = "<h1>Air Quality Index</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(myMap);

});
