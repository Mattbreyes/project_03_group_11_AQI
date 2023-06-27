// This is the first load of the web page, with initial date value.
let baseMap = createBaseMap();
updateMap(baseMap);
// updateBarPlot();

// console.log('Made it!');
// When clicked on "Go" button, the selected date will be passed to the updateMap function
// to generate new overlay map with updated air quality data.
document.getElementById('selected_date_button').addEventListener('click', function() {
  // console.log('clicked');
  updateMap(baseMap);
  // updateBarPlot();
})

// ---------------------------------------------------------------------------------------------------------------------
function createBaseMap() {

  // Create the base layers.
 
  let grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
  }); 

  // Create a baseMaps object.
  let baseMaps = {
    "Grayscale": grayscale, 
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscale]
  });

  return myMap;
}

// ---------------------------------------------------------------------------------------------------------------------
function updateMap(myMap) {
  
  // Get the selected date from the dropdown menu
  var selectedDate = document.getElementById('inputDate').value;

  // Construct the URL with the selected date
  var url = '/' + selectedDate;
  
  // Send a request to the Flask app with the selected date
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var geoData = JSON.parse(xhr.responseText);
      // console.log('geoData',geoData);


      // Define a function that we want to run once for each feature in the features array.
      // Give each feature a popup that describes the air quality, city name and population of the coordinate.
      function onEachFeature(feature, layer) {
        layer.bindPopup(`<h2>${feature.properties.aqi}</h2><h4>City:  ${feature.properties.city_ascii}</h4><h4>Population:  ${feature.properties.population}</h4>`);

      }

      function ChooseSize(population) {
        return population / 400000;
      }
      

      function ChooseColor(aqi) {
        if (aqi >= 300) {
            color = "Maroon";
        }
        else if (aqi >= 200) {
            color = "Purple";
        }
        else if (aqi >= 150) {
            color = "Red";
        }
        else if (aqi >= 100) {
            color = "Orange";
            
        }
        else if (aqi >= 50) {
            color = "Yellow";
        }
        else if (aqi >= 0) {
            color = "Green";
        }
      
        return color;
      };


      // Create a GeoJSON layer that contains the features array on the airQualityData object.
      // Run the onEachFeature function once for each piece of data in the array.
      let airQuality = L.geoJSON(geoData.features, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
            radius: ChooseSize(feature.properties.population),
            fillColor: ChooseColor(feature.properties.aqi),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
      });

      // Create an overlay object to hold our overlay.
      let overlayMaps = {
        AirQuality: airQuality
      };
      airQuality.addTo(myMap);

    }
  };
  xhr.send();

}
