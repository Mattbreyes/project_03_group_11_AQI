console.log('Made it!');
updateBarPlot();
// When clicked on "Go" button, the selected date will be passed to the updateMap function
// to generate new overlay map with updated air quality data.
document.getElementById('selected_date_button').addEventListener('click', function() {
  console.log('clicked');
  updateBarPlot();
})

function updateBarPlot()
{
    // Get the selected date from the dropdown menu
    var selectedDate = document.getElementById('inputDate').value;
    // Construct the URL with the selected date
    var url = '/bar/' + selectedDate;
    // Send a request to the Flask app with the selected date
    d3.json(url).then(function(data) {
        console.log(data);
        // Trace for the Roman Data
        let trace1 = {
            x: data.map(row => row.city_ascii),
            y: data.map(row => row.aqi),
            type: "bar"
        };

        // Data trace array
        let traceData = [trace1];

        // Apply title to the layout
        let layout = {
            title: "Top 10 largest cities AQI"
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("barPlot", traceData, layout);

    });
}
