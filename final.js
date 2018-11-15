//var width = 1200;
//var height = 800;
var votingMap;
var scale0 = 8000
var border = 1; // change to 0 to remove border
var bordercolor = 'black';
var selectedDistrict = '0';

var chartDiv = d3.select('#mapDiv').node()
h = chartDiv.clientWidth - 33;
w = chartDiv.clientHeight;

function redraw() {
  svg
    .attr("width", 10)
    .attr("height", 10);

  borderPath
    .attr("width", 10)
    .attr("height", 10);
  // Extract the width and height that was computed by CSS.
  w = chartDiv.clientWidth - 33;
  h = chartDiv.clientHeight;

  // update sizes
  svg
    .attr("width", w)
    .attr("height", h);

  borderPath
    .attr("width", w)
    .attr("height", h);

  projection
    .scale(w*7)
    .translate([w / 2, h / 2]);

  svg.selectAll('.county').attr('d', path);
};

var projection = d3.geo.mercator()
  .scale(scale0)
  //.center([-93.75, 42.6]);
  //.center([-93.69839, 42.209339])
  //.center([-94.6, 41])
  .center([-93.0977, 41.8780])
  //41.8780° N, 93.0977°
  .translate([w / 2, h / 2]);

var path = d3.geo.path()
  .projection(projection)


var tip = d3.select('#mapDiv').append("tip")
  .attr('class', 'tooltip')
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('text-align', 'center')
  .style('width', '110px')
  .style('height', '90px')
  .style('font', '10px sans-serif')
  .style('background', 'skyblue')
  .style('color', 'black');

// Add svg and g elements to the webpage
svg = d3.select("#mapDiv").append("svg")
  .attr("border", border)

//.style('position', 'fixed');
borderPath = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .style("stroke", bordercolor)
  .style("fill", "none")
  .style("stroke-width", border);


var districtColorMap = {
  '1': "red",
  '2': "green",
  '3': "purple",
  '4': "yellow"
};

var clicked = function(d) {
  if (selectedDistrict !== "0") {
    county = d.properties["NAME"]
    entryDict = votingMap.get(county)
    entryDict['District'] = selectedDistrict
    votingMap.set(county, entryDict)
    d3.select(this).style('fill', districtColorMap[selectedDistrict])
  }
};

var buildMap = function() {
  var county = svg.selectAll('.county')
    .data(geoData.features);
  county
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .style('stroke-width', '.3px')
    .style('stroke', 'black')
    .style('fill', function(d) {
      if (d.properties['STATE'] !== "19") {
        return 'grey';
      } else {
        var county = d.properties['NAME']
        cDict = votingMap.get(county)
        district = cDict['District']
        return districtColorMap[district]
      }
    })
    .on('mouseover', function(d) {
                    var county;
                    county = d.properties["NAME"];
                    pop = votingMap.get(county)["Population"];
                    district = votingMap.get(county)["District"];
                    tVotes = votingMap.get(county)["TotalVotes"];
                    dem = votingMap.get(county)["Dem"];
                    rep = votingMap.get(county)["Rep"];
                    ind = votingMap.get(county)["Independent"];
                    tip.html("County: " + county + "</br>" + "Population: " + pop + "</br>" + "District: " + district + "</br>" + "Total Votes: " + tVotes + "</br>" + "Democrat: " + dem + "</br>" + "Republican: " + rep + "</br>" + "Independent: " + ind)
					tip.transition()
						.duration(200)
						.style('opacity', .9)
						.style('left', (d3.event.pageX) + 40 + "px")
						.style('top', (d3.event.pageY - 40 + "px"))
                        .style("z-index", 20);
  })
  .on('mouseout', function(d) {
      tip.transition()
          .duration(500)
          .style('opacity', 0)
          .style("z-index", 0)
      ;
  })
  .on('click', clicked);;

};

d3.csv('data/IowaCountyData.csv', function(csvData) {
  votingData = csvData;
  votingMap = new Map();
  votingData.forEach(function(entry) {
    county = entry['County']
    pop = parseInt(entry['Population'])
    rep = parseInt(entry['Trump'])
    dem = parseInt(entry['Clinton'])
    indp = parseInt(entry['Johnson']) + parseInt(entry['Others'])
    total = parseInt(entry['Total'])
    CD = entry['CongressionalDistrict']
    countyDict = {
      'Population': pop,
      'Rep': rep,
      'Dem': dem,
      'Independent': indp,
      'TotalVotes': total,
      'District': CD
    }
    votingMap.set(county, countyDict);

  });

  d3.json('USCounty.json', function(error, jsonData) {
    geoData = jsonData;

    //Filter to only Iowa
    var holder = geoData.features
    var filteredCounties = holder.filter(function(el) {
      return el.properties.STATE == "19"
    })
    geoData.features = filteredCounties
    buildMap();
  });
});

// Draw for the first time to initialize.
redraw();
redraw();
// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);
