var width = 1000;
var height = 600;
var votingMap;
var selectedDistrict = '0';

var projection = d3.geo.albers()
  .scale(1000)

//.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

var geoPath = d3.geo.path()
  .projection(projection);

var tip = d3.select('#mapDiv').append("tip")
  .attr('class', 'tooltip')
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('text-align', 'center')
  .style('width', '100px')
  .style('height', '75px')
  .style('font', '10px sans-serif')
  .style('background', 'darkorange')
  .style('color', 'black');

// Add svg and g elements to the webpage
var svg = d3.select("#mapDiv").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(-50,875)scale(8)")
  .style('position', 'fixed');

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
  county = svg.selectAll('.county')
    .data(geoData.features);
  county
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', geoPath)
    .style('stroke-width', '.3px')
    .style('stroke', 'black')
    .style('fill', function(d) {
      if (d.properties['STATE'] !== "19") {
        return 'grey';
      } else {
        county = d.properties['NAME']
        cDict = votingMap.get(county)
        district = cDict['District']
        return districtColorMap[district]
      }
    })
    .on('click', clicked);
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
      'Indepedent': indp,
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
