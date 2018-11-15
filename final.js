var width = 1000;
var height = 600;
var votingMap;
var selectedDistrict = '0';
var j = 0;

var projection = d3.geo.albers()
  .scale(1000)

var selectDistrictOptions = ["None", "1", "2", "3", "4"]

// var form = d3.select("#mapDiv").append("form");
//
// var labels = form.selectAll('label')
//   .data(selectDistrictOptions)
//   .enter()
//   .append('label')
//   .text(function(d) {return d})
//   .insert("input")
//   .attr({
//     type: "radio",
//     class: "shape",
//     name: 'mode',
//     value: function(d, i) {return i;}
//   })
//   .property('checked', function(d,i) {return i===j;});

var geoPath = d3.geo.path()
  .projection(projection);

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
            .style("z-index", 0);
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
