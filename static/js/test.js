// Get the Roadster endpoint
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data){
    // console.log(data);
    console.log(data.samples[0].otu_ids)
      
    function init() {
        let trace1 = [{
            x: data.samples[0].sample_values.slice(0,10).reverse(),
            y: data.samples[0].otu_ids.slice(0,10).reverse(),
            text: data.samples[0].otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
      
        let layout1 = {
          title: "Top OTUs",
          yaxis: {
            type: "category",
            tickprefix: "OTU "
          }
        };
      
        Plotly.newPlot("bar", trace1, layout1)
      }

        let trace2 = [{
            x: data.samples[0].otu_ids,
            y: data.samples[0].sample_values,
            text: data.samples[0].otu_labels,
            mode: "markers",
            marker: {
            color: data.samples[0].otu_ids,
            size: data.samples[0].sample_values
            }
        }];
        let layout2 = {
            xaxis:{
            title: "OTU ID",
            }
        }
        Plotly.newPlot("bubble", trace2, layout2);
 

      init();
});

