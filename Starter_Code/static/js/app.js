// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let sample_metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = sample_metadata.filter(x => x.id === parseInt(sample))[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in result) {
      panel.append("h6").text(`${key}: ${result[key]}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered_sample = sample_data.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered_sample.otu_ids;
    let otu_labels = filtered_sample.otu_labels;
    let sample_values = filtered_sample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      },
      text: otu_labels
    };

    // // Render the Bubble Chart
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: {
        text: "Bacterial Cultures Per Sample",
        font: {
          family: 'Arial',
          size: 24,
          color: 'black'
        }
      },
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Arial',
            size: 18,
            color: 'black'
          },
          automargin: true
        },
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria',
          font: {
            family: 'Arial',
            size: 18,
            color: 'black'
          },
          automargin: true
        }
      }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        color: otu_ids.slice(0, 10).reverse(),
        colorscale: 'Portland'
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }

    // Render the Bar Chart
    let barData = [barTrace];

    let barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {
          family: 'Arial',
          size: 24,
          color: 'black'
        },
        xref: 'paper',
        automargin: true
      },
      xaxis: {
        title: {
          text: 'Number of Bacteria',
          font: {
            family: 'Arial',
            size: 18,
            color: 'black'
          },
          automargin: true
        },
      },
      yaxis: {
        title: {
          text: 'Operational Taxonomical Unit ID',
          font: {
            family: 'Arial',
            size: 18,
            color: 'black'
          },
          automargin: true
        }
      },
      margin: { // set margins to ensure y-label does not overlap with yticks
        l: 100,
        r: 50,
        t: 50,
        b: 50
      }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let test_subject_dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      
      // get name from current entry
      let name = names[i];

      // add name to list of options for dropdown list
      test_subject_dropdown.append("option").text(name);
    };

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();