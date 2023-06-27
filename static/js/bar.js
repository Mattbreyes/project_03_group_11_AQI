// url = "insert_here";


function updateAll(entryNum){
  // Fetch the JSON data and console log it
  d3.json(url).then(function(data)
  {
    console.log(data);

    // an empty list to add all the different states to
    let state_list = []
    let states = data.features.properties.state_id
    let aqi_values = data.features.properties.aqi

    //loops through all of the states and only adds the state if it is not already in the list
    for(i = 0; i < states.length; i++)
    {
        if(!(states[i] in state_list))
         {
             state_list.push(aqi_values[i])
         }
    }
    
    //empty list of aqi values
    let aqi_list = []

    //loops through all of the states
    for(x = 0; x < state_list; x++)
    {
        let aqi_average = 0;
        let aqi = 0;
        let count = 0;

        //loops through all of the data 
        for(i = 0; i < states.length; i++)
        {
            // if the state of the loop matches the state of the index of the state list which we made
            // then it will loop through and add the values to aqi_average to find the average for 
            // that particular state

            if(states[i] == state_list[x])
            {
                aqi_average = aqi_values[i] + aqi_average
                count = count + 1
            }
        }
        //pushes the average to the aqi_list
        aqi = (aqi_average/count)
        aqi_list.push(aqi)
    }
    //now we have a state list of all unique values and after looping through that, 
    //we have matching average aqi values at the same indices of the state list.


    ////////////////// Updates the Bar Chart ///////////////////////////
    let barData = [{
      x: state_list,
      y: aqi_list,
      type: "bar",
      orientation: "h",
    }];
    let barLayout = {
      yaxis:{
        type:'category',
        tickprefix: "Average AQI",
      }
    }
    Plotly.newPlot("bar", barData, barLayout);
})
}
function optionChanged(value) {
  updateAll(value)
}

function init() { 
  let data = d3.json(url).then(function(data){
    let dropBody = d3.select("#selDataset");

    for (i = 0; i < data.features.properties.aqi.length; i++) 
    {
      dropBody.append("option").attr("value", x).text(data.features.properties.aqi[i]);
    }
  });
  updateAll(0);
  
}

init();









// // This is the first load of the web page, with initial date value.
// let baseMap = createBaseMap();
// updateMap(baseMap);

// // When clicked on "Go" button, the selected date will be passed to the updateMap function
// // to generate new overlay map with updated air quality data.
// document.getElementById('selected_date_button').addEventListener('click', function() {
//   updateMap(baseMap);
// })

// // ---------------------------------------------------------------------------------------------------------------------
// function createBaseMap() {

//   // Create the base layers.
 
//   let grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>',
//   subdomains: 'abcd',
//   maxZoom: 19
//   }); 

//   // Create a baseMaps object.
//   let baseMaps = {
//     "Grayscale": grayscale, 
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   let myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [grayscale]
//   });

//   return myMap;
// }

// ---------------------------------------------------------------------------------------------------------------------
function updateMap() 
{
  
  // Get the selected date from the dropdown menu
  var selectedDate = document.getElementById('inputDate').value;

  // Construct the URL with the selected date
  var url = '/' + selectedDate;
  
  // Send a request to the Flask app with the selected date
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) 
    {
      var geoData = JSON.parse(xhr.responseText);

      console.log(geoData);



  };
  xhr.send();
  }
}
updateMap()

