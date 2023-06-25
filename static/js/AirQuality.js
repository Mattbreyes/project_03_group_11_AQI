
// Load the GeoJSON data.
var geoData = "/1981-01-01"
var geojson;
var xhr = new XMLHttpRequest();
xhr.open('GET', '/1981-01-01', true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var geoData = JSON.parse(xhr.responseText);
    createFeatures(geoData.features);   
  }
};
xhr.send();

// --------------------------------------------------------------------------------------------------------------------
function createFeatures(airQualityData) {

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
    console.log("Population: " + aqi + " Color: " + color);
   
    return color;
  };


  // Create a GeoJSON layer that contains the features array on the airQualityData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let airQuality = L.geoJSON(airQualityData, {
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


  // Send the earthquakes layer to the createMap function/
  createMap(airQuality);
}

// ---------------------------------------------------------------------------------------------------------------------
function createMap(airQuality) {

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

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    AirQuality: airQuality
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscale, airQuality]
  });


 /*
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
    console.log("Population: " + aqi + " Color: " + color);
   
    return color;
  };

 
  
  let minOfAqiIntervals = [0, 51, 101, 151, 201, 301]
  let colorsList = [];
  for (let i = 0; i < 6; i++) {
    colorsList.push(ChooseColor(minOfAqiIntervals[i]));
  }
  console.log(colorsList)

  // create legend
  var legend = L.control({
    position: "bottomright"
  });

  
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'legend');
    let intervals = ['0 - 50', '51 - 100', '101 - 150', '151 - 200', '201 - 300', '301 +'];
    
    // Loop through the intervals and colorsList to create the legend items
    for (let i = 0; i < intervals.length; i++) {
      let interval = intervals[i];
      let color = colorsList[i];
      
      div.innerHTML +=
        '<div><i style="background:' + color + '"></i>' +
        interval + '</div>';
    }
    
    return div;
  };
  

  // add legend to the map.
  legend.addTo(myMap);
  */
}
