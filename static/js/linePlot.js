console.log('Made it!');
updateLinePlot();
// When clicked on "Go" button, the selected date will be passed to the updateMap function
// to generate new overlay map with updated air quality data.
document.getElementById('selected_date_button').addEventListener('click', function() {
  console.log('clicked');
  updateLinePlot();
})

function updateLinePlot()
{
    // Get the selected date from the dropdown menu
    var selectedDate = document.getElementById('inputDate').value;
    // Construct the URL with the selected date
    var url = '/bar/' + selectedDate;
    // Send a request to the Flask app with the selected date
    d3.json(url).then(function(data) {
        console.log(data);
    
        function texas(data)
        {
            return data.features.properties.state_id == 'TX';
        }

        function illinois(data)
        {
            return data.features.properties.state_id == 'IL';
        }
          
        function NewYork(data)
        {
            return data.features.properties.state_id == 'NY';
        }

        function florida(data)
        {
            return data.features.properties.state_id == 'FL';
        }

        function cali(data)
        {
            return data.features.properties.state_id == 'CA';
        }
          // Call the custom function with filter()
        let texData = data.filter(texas);
        let illData = data.filter(illinois);
        let NYData = data.filter(NewYork);
        let FloData = data.filter(florida);
        let caliData = data.filter(cali);

        
        
        // Trace for the Data
        let trace1 = {
            x: texData.map(row => Date),
            y: texData.map(row => row.aqi),
            mode: 'lines',
            name: "Texas",
            line: {
             width: 3
            }
        };

        let trace2 = { 
            x: caliData.map(row => Date),
            y: caliData.map(row => row.aqi),
            mode: 'lines',
            name: "California",
            line: {
             width: 3
        }};

        let trace3 = {
            x: NYDataData.map(row => Date),
            y: NYData.map(row => row.aqi),
            mode: 'lines',
            name: "New York",
            line: {
             width: 3
        }};

        let trace4 = {
            x: illData.map(row => Date),
            y: illData.map(row => row.aqi),
            mode: 'lines',
            name: "Illinois",
            line: {
             width: 3
        }};

        let trace5 = {
            x: FloData.map(row => Date),
            y: FloData.map(row => row.aqi),
            mode: 'lines',
            name: "Florida",
            line: {
             width: 3
        }};

        // Data trace array
        let traceData = [trace1, trace2, trace3, trace4, trace5];

        // Apply title to the layout
        let layout = {
            title: "AQI over time"
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("linePlot", traceData, layout);

    });
}