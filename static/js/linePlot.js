// TODO: RUN D3 SEQUENTIALLY

console.log('Made it linePlot!');
updateLinePlot();
// When clicked on "Go" button, the selected date will be passed to the updateMap function
// to generate new overlay map with updated air quality data.
document.getElementById('selected_date_button').addEventListener('click', function() {
  console.log('clicked');
  updateLinePlot();
})

function updateLinePlot()
{
    var stateArray = [];
    var oneYrData =[]; 
    var twoYrData = [];
    var threeYrData = [];
    var fourYrData = [];
    var fiveYrData = [];
    var initialData = [];
    var row1x = [];
    var row1y = [];
    var row2x = [];
    var row2y = [];
    var row3x = [];
    var row3y = [];
    var row4x = [];
    var row4y = [];
    var row5x = [];
    var row5y = [];
    var row6x = [];
    var row6y = [];
    // Get the selected date from the dropdown menu
    var selectedDate = document.getElementById('inputDate').value;

    // Construct the URL with the selected date
    var url = '/line/' + selectedDate;
    // ensure that d3 code is ran is proper sequence
    var sequential = d3.scaleSequential().domain([10,20]);

    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
        sequential(11)
        console.log('lineplot->',data);
        initialData = data;
        // var x = data['city_ascii'];
        for (let i=0; i<data.length; i++){
            // 5 lines 
            stateArray.push(data[i].city_ascii);
            row1x.push(data[i].Date);
            row1y.push(data[i].aqi);
        }
        console.log('stateArray',stateArray);
        console.log('row1x',row1x);
    });

    // 1 yr later data
    var url = '/lineplot/' + selectedDate;
    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
    sequential(12)
        console.log('lineplot 1 YEAR->',data);
        oneYrData = data;    
        
        // temp array to hold each states values
        var states = [];
        // Iterate over +1 year
        for( let i=0; i<stateArray.length; i++){
            for (let j=0; j< oneYrData.length; j++){
                if (stateArray[i] == oneYrData[j].city_ascii){
                    row2x.push(oneYrData[j].Date);
                    row2y.push(oneYrData[j].aqi);
                }
            }
        }
        
    });
    // 2 yr later data
    var url = '/lineplot2/' + selectedDate;
    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
    sequential(13)
        console.log('lineplot 2 YEAR->',data);
        twoYrData = data;

        for( let i=0; i<stateArray.length; i++){
            for (let j=0; j< twoYrData.length; j++){
                if (stateArray[i] == twoYrData[j].city_ascii){
                    row3x.push(twoYrData[j].Date);
                    row3y.push(twoYrData[j].aqi);
                }
            }
        }

    });
    // 3 yr later data
    var url = '/lineplot3/' + selectedDate;
    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
    sequential(14)
        console.log('lineplot 3 YEAR->',data);
        threeYrData = data;

        for( let i=0; i<stateArray.length; i++){
            for (let j=0; j< threeYrData.length; j++){
                if (stateArray[i] == threeYrData[j].city_ascii){
                    row4x.push(threeYrData[j].Date);
                    row4y.push(threeYrData[j].aqi);
                }
            }
        }
    });
    // 4 yr later data
    var url = '/lineplot4/' + selectedDate;
    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
    sequential(15)
        console.log('lineplot 4 YEAR->',data);
        fourYrData = data;
        for( let i=0; i<stateArray.length; i++){
            for (let j=0; j< fourYrData.length; j++){
                if (stateArray[i] == fourYrData[j].city_ascii){
                    row5x.push(fourYrData[j].Date);
                    row5y.push(fourYrData[j].aqi);
                }
            }
        }
    });
    // 5 yr later data
    var url = '/lineplot5/' + selectedDate;
    // Send a request to the Flask app with the selected date
d3.json(url).then(function(data) {
    sequential(16)
        console.log('lineplot 5 YEAR->',data);
        fiveYrData = data;
        for( let i=0; i<stateArray.length; i++){
            for (let j=0; j< fiveYrData.length; j++){
                if (stateArray[i] == fiveYrData[j].city_ascii){
                    row6x.push(fiveYrData[j].Date);
                    row6y.push(fiveYrData[j].aqi);
                }
            }
        }
        console.log('row6x',row6x);
    });
    
    // Trace for the Data
    let trace1 = {
        x: row1x,
        y: row1y,
        type: 'scatter'
        // name: stateArray[0],
        // line: {
        // width: 3
        // }
    };
    let trace2 = {
        x: row2x,
        y: row2y,
        type: 'scatter'
        // name: stateArray[1],
        // line: {
        // width: 3
        // }
    };
    let trace3 = {
        x: row3x,
        y: row3y,
        type: 'scatter'
        // name: stateArray[2],
        // line: {
        // width: 3
        // }
    };
    let trace4 = {
        x: row4x,
        y: row4y,
        type: 'scatter',
        // name: stateArray[3],
        // line: {
        // width: 3
        // }
    };
    let trace5 = {
        x: row5x,
        y: row5y,
        type: 'scatter',
        // name: stateArray[4],
        // line: {
        // width: 3
        // }
    };
    let trace6 = {
        x: row6x,
        y: row6y,
        type: 'scatter',
        // name: stateArray[5],
        // line: {
        // width: 3
        // }
    };

    // Data trace array
    let traceData = [trace1, trace2, trace3, trace4, trace5];

    // Apply title to the layout
    let layout = {
        title: "AQI over time"
    };
    console.log('traceData',traceData)
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("linePlot", traceData, layout);
}

