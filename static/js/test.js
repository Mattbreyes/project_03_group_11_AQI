// Get the Roadster endpoint
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function updateAll(entryNum){
  // Fetch the JSON data and console log it
  d3.json(url).then(function(data){
    
    console.log(data);
    
    ////////////////// Updates the Bar Chart ///////////////////////////
    let barData = [{
      x: data.samples[entryNum].sample_values.slice(0, 10).reverse(),
      y: data.samples[entryNum].otu_ids.slice(0, 10).reverse(),
      text: data.samples[entryNum].otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];
    let barLayout = {
      yaxis:{
        type:'category',
        tickprefix: "OTU ",
      }
    }
    Plotly.newPlot("bar", barData, barLayout);

    ///////////////// Updates the Bubble Chart ////////////////////////
    let bubbleData = [{
      x: data.samples[entryNum].otu_ids,
      y: data.samples[entryNum].sample_values,
      text: data.samples[entryNum].otu_labels,
      mode: "markers",
      marker: {
        color: data.samples[entryNum].otu_ids,
        size: data.samples[entryNum].sample_values
      }
    }];
    let bubbleLayout = {
      xaxis:{
        title: "OTU ID",
      }
    }
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function optionChanged(value) {
  updateAll(value)
}

function init() { 
  let data = d3.json(url).then(function(data){
    ////////////////Populate the Test Subject ID No.://///////////////
    let dropBody = d3.select("#selDataset");

    for (x = 0; x < data.names.length; x++) {
      dropBody.append("option").attr("value", x).text(data.names[x]);
    }
  });
  updateAll(0);
  
}


init();