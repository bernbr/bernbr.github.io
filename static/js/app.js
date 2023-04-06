// Data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Call the data with d3.json
d3.json(url).then(function(data){
    //Print Data to Console
    console.log(data);

    // Create a variable for the data
    var data = data;

    // Create a variable for the sample names
    var sampleNames = data.names;

    // Add sampleNames to the dropdownMenu
    sampleNames.forEach((name)=>{
        d3.select("#selDataset").append("option").text(name);
    })

    // Create a function for the default plot

    function init() {

        function buildDefault(){
            // Data for sample 940 -- default sample (first in the list)
            defaultSample = data.samples.filter(sample => sample.id === "940")[0];

            // Use sample_values as the values for the bar chart.
            defaultSampleValues = defaultSample.sample_values;
            // Use otu_ids as the labels for the bar chart.
            defaultOtuIds = defaultSample.otu_ids;
            // Use otu_labels as the hovertext for the chart.
            defaultHoverText = defaultSample.otu_labels;

            // Select the Top 10 for each ID
            sampleValues = defaultSampleValues.slice(0, 11).reverse();
            otuIds = defaultOtuIds.slice(0, 11).reverse();
            hoverText = defaultHoverText.slice(0, 11).reverse();

            // console.log(sampleValues);
            console.log(otuIds);
            console.log(hoverText);

        }

        buildDefault();

        // Bar Chart 
        function buildBarChart(){
            // Add Trace
            var trace1 = {
                x: sampleValues,
                y: otuIds.map(otuId => `OTU ${otuId}`),
                text: hoverText,
                type: "bar",
                orientation: "h"
            };

            // Plot the Data for Trace1
            var barChartData = [trace1];

            var barChartLayout = {
                title: `<b>Top 10 OTUs found in Test Subject</b>`,
                xaxis: {title: "Sample Value"},
                yaxis: {title: "OTU ID"},
                autosize: false,
                width: 600,
                height: 600
            };

            // Plot the Bar Graph
            Plotly.newPlot("bar", barChartData, barChartLayout);
        }

        buildBarChart();

        // Bubble Chart
        function buildBubbleChart(){
            var trace2 = {
                x: defaultOtuIds,
                y: defaultSampleValues,
                text: defaultHoverText,
                mode: 'markers',
                markersize: {
                    color: defaultOtuIds,
                    size: defaultSampleValues
                }
            };

            // Plot the data for Trace2
            var bubbleChartData = [trace2];

            // Bubble Chart Layout
            var bubbleChartLayout = {
                title: `<b>Bubble Chart of Test Subject's Sample Values</b>`,
                xaxis: {title: "OTU ID"},
                yaxis: {title: "Sample Value"},
                showlegend: false, 
                width: 800,
                height: 400
            };

            //Plot the Bubble Chart
            Plotly.newPlot('bubble', bubbleChartData, bubbleChartLayout);
        }

        buildBubbleChart();

        function buildDemographics(){
            // Demographic Information for the Sample
            defaultDemographics = data.metadata.filter(sample => sample.id === 940)[0];
            console.log(defaultDemographics);

            // Display each key-value pair from the metadata JSON object
            Object.entries(defaultDemographics).forEach(
                ([key, value]) => d3.select("#sample-metadata")
                                                        .append("p").text(`${key.toUpperCase()}: ${value}`));
        }

        buildDemographics();

        function buildGaugeChart(){

            // Washing frequency value
            var defaultwfreq = defaultDemographics.wfreq;

            // Trace data for Gauge Chart
            var trace3 = [
                {
                    domain: {x: [0, 1], y:[0, 1]},
                    value: defaultwfreq,
                    title: {text: '<b>Belly Button Washing Frequency</b>'},
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: {range:[null,9]},
                        steps: [
                            {range: [0, 1], color: 'rgb(255, 245, 230)'},
                            {range: [1, 2], color: 'rgb(255, 235, 204)'},
                            {range: [2, 3], color: 'rgb(255, 224, 179)'},
                            {range: [3, 4], color: 'rgb(255, 214, 153)'},
                            {range: [4, 5], color: 'rgb(255, 204, 128)'},
                            {range: [5, 6], color: 'rgb(255, 194, 102)'},
                            {range: [6, 7], color: 'rgb(255, 184, 77)'},
                            {range: [7, 8], color: 'rgb(255, 173, 51)'},
                            {range: [8, 9], color: 'rgb(255, 163, 26)'},
                        ]
                    }
                }
            ];

            // Gauge Layout
            var gaugeChartLayout = {width: 600, height: 400, margin: {t:0, b:0}};

            Plotly.newPlot("gauge", trace3, gaugeChartLayout);

        }

        buildGaugeChart();
    }

    init();

    // Update plots when you change the dropdownMenu sample.
d3.selectAll("#selDataset").on("change", updatePlot);

// Create a function to update the plot.     
function updatePlot() {

    // Select the dropdownMenu
    var inputElement = d3.select("#selDataset");

    // Assign the values to the dropdownMenu
    var inputValue = inputElement.property("value");
    console.log(inputValue);

    // Filter the data with the dropdownValue to change the dashboard display. 
    dashboardData = data.samples.filter(sample => sample.id === inputValue)[0];
    console.log(dashboardData);

    // Update data
    updateSampleValues = dashboardData.sample_values;
    updateOtuIds = dashboardData.sample_values;
    updateOtuLabels = dashboardData.otu_labels;

    // Update Top 10
    updatevalues_top10 = updateSampleValues.slice(0, 11).reverse();
    updateotuIds_top10 = updateOtuIds.slice(0, 11).reverse();
    updatelabels_top10 = updateOtuLabels.slice(0, 11).reverse();

    // Update Bar Chart
    Plotly.restyle("bar", "x", [updatevalues_top10]);
    Plotly.restyle("bar", "y", [updateotuIds_top10.map(otuId => `OTU ${otuId}`)]);
    Plotly.restyle("bar", "text", [updatelabels_top10]);

    // Update Bubble Chart
    Plotly.restyle("bubble", "x", [updateOtuIds]);
    Plotly.restyle("bubble", "y", [updateSampleValues]);
    Plotly.restyle("bubble", "text", [updateOtuLabels]);
    Plotly.restyle("bubble", "marker.color", [updateOtuIds]);
    Plotly.restyle("bubble", "marker.size", [updateSampleValues]);

    // Update Demographic Info
    updateMetadata = data.metadata.filter(sample => sample.id == inputValue)[0];

    // Clear the current data
    d3.select("#sample-metadata").html("");

    // Display the metadata on the dashboard
    Object.entries(updateMetadata).forEach(
        ([key, value]) => d3.select("#sample-metadata")
                                                .append("p").text(`${key.toUpperCase()}: ${value}`));    
    
    // Update Gauge Chart
    var wfreq = updateMetadata.wfreq;

    Plotly.restyle("gauge", "value", wfreq);

    }
});
