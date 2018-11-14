var width = 1000;
var height = 600;

var projection = d3.geo.albers()
  .scale(1000)

//.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

var geoPath = d3.geo.path()
        .projection(projection);

// Add svg and g elements to the webpage
var svg = d3.select("#mapDiv").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(-50,875)scale(8)")
        .style('position', 'fixed');

var buildMap = function() {
  county = svg.selectAll('.county')
      .data(geoData.features);
  county
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', geoPath)
      .style('stroke-width', '.3px')
      .style('fill', function (d) {
        if (d.properties['STATE'] === "19") {
          return 'lightgrey';
        } else {
          return 'grey';
        }
      })
      .style('stroke', 'black');
    county.append('svg:title')
          .text(function(d) { return d.properties["NAME"]});
};

d3.json('USCounty.json', function(error, jsonData) {
    geoData = jsonData;

    // Next, let's load a CSV with economic data
    // d3.csv('unhcr_refugee_data.csv', function(csvData) {
    //     refugeeData = csvData;
    // }

    buildMap();
});
