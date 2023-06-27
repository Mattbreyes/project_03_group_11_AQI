// Initialize default lineplot
updateLinePlot();
// When clicked on "Go" button, the selected date will be passed to the updateMap function
// to generate new overlay map with updated air quality data.
document.getElementById('selected_date_button').addEventListener('click', function() {
//   console.log('clicked');
  updateLinePlot();
})

function updateLinePlot()
{
    // variable assignment for nested d3 logic
    var cityArray = [];
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
        // console.log('lineplot->',data);
        initialData = data;
        // var x = data['city_ascii'];
        for (let i=0; i<initialData.length; i++){
            // 5 lines 
            cityArray.push(initialData[i].city_ascii);
            row1x.push(initialData[i].Date);
            row1y.push(initialData[i].aqi);
        }
        console.log('cityArray',cityArray);
        console.log('row1x',row1x);
        console.log('row1y', row1y);
        // 1 yr later data
        var url = '/lineplot/' + selectedDate;
        // Send a request to the Flask app with the selected date
    d3.json(url).then(function(data) {
        sequential(12)
            // console.log('lineplot 1 YEAR->',data);
            oneYrData = data;    
            
            // temp array to hold each states values
            var states = [];
            // Iterate over +1 year
            for( let i=0; i<cityArray.length; i++){
                for (let j=0; j< oneYrData.length; j++){
                    if (cityArray[i] == oneYrData[j].city_ascii){
                        row2x.push(oneYrData[j].Date);
                        row2y.push(oneYrData[j].aqi);
                    }
                }
            }
            // 2 yr later data
            var url = '/lineplot2/' + selectedDate;
            // Send a request to the Flask app with the selected date
        d3.json(url).then(function(data) {
            sequential(13)
                // console.log('lineplot 2 YEAR->',data);
                twoYrData = data;

                for( let i=0; i<cityArray.length; i++){
                    for (let j=0; j< twoYrData.length; j++){
                        if (cityArray[i] == twoYrData[j].city_ascii){
                            row3x.push(twoYrData[j].Date);
                            row3y.push(twoYrData[j].aqi);
                        }
                    }
                }

                // 3 yr later data
                var url = '/lineplot3/' + selectedDate;
                // Send a request to the Flask app with the selected date
            d3.json(url).then(function(data) {
                sequential(14)
                    // console.log('lineplot 3 YEAR->',data);
                    threeYrData = data;

                    for( let i=0; i<cityArray.length; i++){
                        for (let j=0; j< threeYrData.length; j++){
                            if (cityArray[i] == threeYrData[j].city_ascii){
                                row4x.push(threeYrData[j].Date);
                                row4y.push(threeYrData[j].aqi);
                            }
                        }
                    }
                    // 4 yr later data
                    var url = '/lineplot4/' + selectedDate;
                    // Send a request to the Flask app with the selected date
                d3.json(url).then(function(data) {
                    sequential(15)
                        // console.log('lineplot 4 YEAR->',data);
                        fourYrData = data;
                        for( let i=0; i<cityArray.length; i++){
                            for (let j=0; j< fourYrData.length; j++){
                                if (cityArray[i] == fourYrData[j].city_ascii){
                                    row5x.push(fourYrData[j].Date);
                                    row5y.push(fourYrData[j].aqi);
                                }
                            }
                        }

                        // 5 yr later data
                        var url = '/lineplot5/' + selectedDate;
                        // Send a request to the Flask app with the selected date
                    d3.json(url).then(function(data) {
                        sequential(16)
                            // console.log('lineplot 5 YEAR->',data);
                            fiveYrData = data;
                            for( let i=0; i<cityArray.length; i++){
                                for (let j=0; j< fiveYrData.length; j++){
                                    if (cityArray[i] == fiveYrData[j].city_ascii){
                                        row6x.push(fiveYrData[j].Date);
                                        row6y.push(fiveYrData[j].aqi);
                                    }
                                }
                            }
                            console.log('row6x',row6x);
                        });

                        // Logic to go through rows and split it up to proper trace data with same length/size
                        // EX: 
                        //          Order of all rows w/r to cityArray order found in console
                        //      x: [ ['Tue, 01 Jan 1980 08:00:00 GMT', 'Tue, 01 Jan 1981 08:00:00 GMT', ... , 'Tue, 01 Jan 1985 08:00:00 GMT'], ... ]
                        //      y: [ [ 128, 120, ... , 140] , ... ]
                        // Trace for the Data
                        // first elements in rows are w/r to order of cityArray
                        var dateMatrix = [row1x,row2x, row3x, row4x, row5x, row6x];
                        var aqiMatrix = [row1y,row2y, row3y, row4y, row5y, row6y];
                        console.log('dateMatrix',dateMatrix);
                        console.log('aqiMatrix',aqiMatrix);
                        
                        // Variables to assign to trace x and y coordinates from matrices
                        var trace1x = [];
                        var trace1y = [];
                        var trace2x = [];
                        var trace2y = [];
                        var trace3x = [];
                        var trace3y = [];
                        var trace4x = [];
                        var trace4y = [];
                        var trace5x = [];
                        var trace5y = [];
                        // Iterate over the matrix to get the values w/r to cityArray
                        for (let i=0; i<dateMatrix.length; i++){
                            for (let j = 0; j<aqiMatrix.length; j++){
                                if (j == 0){
                                    // console.log('j==0',dateMatrix[i][0]);
                                    trace1x.push(dateMatrix[i][0]);
                                    trace1y.push(aqiMatrix[i][0]);
                                
                                }
                                if (j == 1){
                                    // console.log('j==0',dateMatrix[i][1]);
                                    trace2x.push(dateMatrix[i][1]);
                                    trace2y.push(aqiMatrix[i][1]);
                                
                                }
                                if (j == 2){
                                    // console.log('j==0',dateMatrix[i][1]);
                                    trace3x.push(dateMatrix[i][2]);
                                    trace3y.push(aqiMatrix[i][2]);
                                
                                }
                                if (j == 3){
                                    // console.log('j==0',dateMatrix[i][1]);
                                    trace4x.push(dateMatrix[i][3]);
                                    trace4y.push(aqiMatrix[i][3]);
                                
                                }
                                if (j == 4){
                                    // console.log('j==0',dateMatrix[i][1]);
                                    trace5x.push(dateMatrix[i][4]);
                                    trace5y.push(aqiMatrix[i][4]);
                                
                                }                                
                            }                            
                        }

                        // Each line/city has its own trace 
                        let trace1 = {
                            x: trace1x,
                            y: trace1y,
                            type: 'scatter',
                            name: cityArray[0],
                            line: {
                            width: 3
                            }
                        };
                        let trace2 = {
                            x: trace2x,
                            y: trace2y,
                            type: 'scatter',
                            name: cityArray[1],
                            line: {
                            width: 3
                            }
                        };
                        let trace3 = {
                            x: trace3x,
                            y: trace3y,
                            type: 'scatter',
                            name: cityArray[2],
                            line: {
                            width: 3
                            }
                        };
                        let trace4 = {
                            x: trace4x,
                            y: trace4y,
                            type: 'scatter',
                            name: cityArray[3],
                            line: {
                            width: 3
                            }
                        };
                        let trace5 = {
                            x: trace5x,
                            y: trace5y,
                            type: 'scatter',
                            name: cityArray[4],
                            line: {
                            width: 3
                            }
                        };
                        
                        console.log('trace1->',trace1);
                        // Data trace array
                        let traceData = [trace1, trace2, trace3, trace4, trace5];

                        // Apply title to the layout
                        let layout = {
                            title: "AQI Over 5 Years"
                        };
                        console.log('traceData',traceData)
                        // Render the plot to the div tag with id "plot"
                        Plotly.newPlot("linePlot", traceData, layout);
                    });
                
                });
            
            });
            
            
        });
        
    });

    
}

