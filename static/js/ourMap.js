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
// let geoData = "/<selected_date>";

let geojson;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
d3.selectAll("#selected_date_button").on('click', getData);

function getData() {// Get the data with d3.
  // collect the specified date
  let dropdownMenu = d3.select("#inputDate");
  // Assign the value of the dropdown menu option to a letiable
  let dataset = dropdownMenu.property("value");
  console.log(dataset);

  d3.json(dataset).then(function(data) {

    console.log(data);
    
    // Create a new choropleth layer
    geojson = L.choropleth(data, {

      // Define which property in the features to use.
      valueProperty: "aqi",

      // Set the color scale.
      scale: ["#ffffb2", "#b10026"],

      // The number of breaks in the step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("</strong><br /><br />Estimated Air quality level: " +
          feature.AQI);
      }
    }).addTo(myMap);

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = geojson.options.limits;
      let colors = geojson.options.colors;
      let labels = [];

      // Add the minimum and maximum.
      let legendInfo = "<h1>Air Quality Index</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>"

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>")
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

  });
}