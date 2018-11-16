//var width = 1200;
//var height = 800;
var votingMap;
var scale0 = 8000
var border = 1; // change to 0 to remove border
var bordercolor = 'black';
var selectedDistrict = '0';
colorByDistrict = $(showDistricts)[0].checked;
aggByDistrict = $(aggDistricts)[0].checked;
populations = [];
scaled_populations = [];
var forClintonRatio = [];


chartDiv = d3.select('#mapDiv').node()
w = chartDiv.clientWidth - 33;
h = chartDiv.parentNode.clientHeight - chartDiv.parentNode.firstElementChild.clientHeight;

function redraw() {
  svg
    .attr("width", 10)
    .attr("height", 10);

  borderPath
    .attr("width", 10)
    .attr("height", 10);
  // Extract the width and height that was computed by CSS.
  w = chartDiv.clientWidth;
  h = chartDiv.parentNode.clientHeight - chartDiv.parentNode.firstElementChild.clientHeight;

  // update sizes
  svg
    .attr("width", w)
    .attr("height", h);

  borderPath
    .attr("width", w)
    .attr("height", h);

  projection
    .scale(Math.min(w, h * 1.4) * 7)
    .translate([w / 2, h / 2]);

  svg.selectAll('.county').attr('d', path);
};

var projection = d3.geo.mercator()
  .scale(scale0)
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
  //.style('width', '110px')
  //.style('height', '90px')
  .style('font', '10px sans-serif')
  //.style('background', 'skyblue')
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

var red = "#ac202f"
var blue = "#2265a3"
var purple = "#740280"

var interpolateIsoRdBu = d3.scale.linear()
  .domain([0, .5, 1])
  .range([red, purple, blue])
  .interpolate(d3.interpolateLab);


//These should be autogenerated
maxForClintonRatio = 2.3854780459988594;
minForClintonRatio = 0.15556307067974298;
//maxPopulation=474768;
//medianPopulation=22109;
//minPopulation=3716;

maxPopulation = Math.max(scaled_populations)
minPopulation = Math.min(scaled_populations)
//maxPopulation=474768;
//medianPopulation=22109;
//minPopulation=3716;

var vDomain = [minForClintonRatio, maxForClintonRatio];
var uDomain = [minPopulation, maxPopulation];

var quantization = vsup.squareQuantization().n(5).valueDomain(vDomain).uncertaintyDomain(uDomain);
//var quantization = vsup.quantization().branching(3).layers(4).valueDomain(vDomain).uncertaintyDomain(uDomain);
var scale = vsup.scale().quantize(quantization).range(interpolateIsoRdBu);

var legend = vsup.legend.heatmapLegend();
//var legend = vsup.legend.arcmapLegend();

legend
  .scale(scale)
  .size(160)
  .x(w - 160)
  .y(h - 200)
  .vtitle("Dem:Rep")
  .utitle("Population");

//svg.append("g").call(legend);

var districtColorMap = {
  '1': "red",
  '2': "green",
  '3': "purple",
  '4': "yellow",
  '5': "grey"
};

var clicked = function(d) {
  if (selectedDistrict == null) {
    getFaded()
  } else {
    if (selectedDistrict !== "0") {
      county = d.properties["NAME"]
      entryDict = votingMap.get(county)
      entryDict['District'] = selectedDistrict
      votingMap.set(county, entryDict)
      d3.select(this).style('fill', districtColorMap[selectedDistrict])
    }
  }
  getFaded()
};

function getFaded() {
  //remove all opacity
  svg.selectAll('.county')
    .transition()
    .duration(1)
    //.ease(d3.easeLinear)
    .style("opacity", function(d) {
      countyName = d.properties['NAME']
      if (votingMap.get(countyName)['District'] == selectedDistrict) {
        return 0.3
      } else {
        return 1.0
      }
    })
}

getFillColor = function(d) {
  if (colorByDistrict) {
    var county = d.properties['NAME']
    cDict = votingMap.get(county)
    district = cDict['District']
    return districtColorMap[district]
  } else {
    countyName = d.properties['NAME']
    countyDict = votingMap.get(countyName)
    return scale((countyDict["Dem"] / countyDict['Rep']), countyDict['ScaledPopulation']);
  }
}


colorMap = function() {
  colorByDistrict = $(showDistricts)[0].checked;
  aggByDistrict = $(aggDistricts)[0].checked;
  county = svg.selectAll('.county')
    .style('fill', function(d) {
      return getFillColor(d)
    })
  if (aggByDistrict) {
    county
      .style('stroke-width', '1.5px')
      .style('stroke', function(d) {
        return getFillColor(d)
      })
  } else {
    county
      .style('stroke-width', '.3px')
      .style('stroke', 'black')
  }
}


function districtData() {
  var popD1 = 0,
    popD2 = 0,
    popD3 = 0,
    popD4 = 0;
  var votesD1 = 0,
    votesD2 = 0,
    votesD3 = 0,
    votesD4 = 0;
  var demD1 = 0,
    demD2 = 0,
    demD3 = 0,
    demD4 = 0;
  var repD1 = 0,
    repD2 = 0,
    repD3 = 0,
    repD4 = 0;
  var indD1 = 0,
    indD2 = 0,
    indD3 = 0,
    indD4 = 0;
  votingMap.forEach(function(entry) {
    if (entry['District'] === "1") {
      popD1 = popD1 + entry['Population'];
      votesD1 = votesD1 + entry['TotalVotes'];
      demD1 = demD1 + entry['Dem'];
      repD1 = repD1 + entry['Rep'];
      indD1 = indD1 + entry['Independent'];
    } else if (entry['District'] === "2") {
      popD2 = popD2 + entry['Population'];
      votesD2 = votesD2 + entry['TotalVotes'];
      demD2 = demD2 + entry['Dem'];
      repD2 = repD2 + entry['Rep'];
      indD2 = indD2 + entry['Independent'];
    } else if (entry['District'] === "3") {
      popD3 = popD3 + entry['Population'];
      votesD3 = votesD3 + entry['TotalVotes'];
      demD3 = demD3 + entry['Dem'];
      repD3 = repD3 + entry['Rep'];
      indD3 = indD3 + entry['Independent'];
    } else if (entry['District'] === "4") {
      popD4 = popD4 + entry['Population'];
      votesD4 = votesD4 + entry['TotalVotes'];
      demD4 = demD4 + entry['Dem'];
      repD4 = repD4 + entry['Rep'];
      indD4 = indD4 + entry['Independent'];
    }
  })
  console.log(votesD1);
  console.log(votesD2);
  console.log(votesD3);
  console.log(votesD4);
}
var buildMap = function() {
  var county = svg.selectAll('.county')
    .data(geoData.features);
  county
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .on('mouseover', function(d) {
      var county;
      county = d.properties["NAME"];
      pop = votingMap.get(county)["Population"];
      district = votingMap.get(county)["District"];
      tVotes = votingMap.get(county)["TotalVotes"];
      dem = votingMap.get(county)["Dem"];
      rep = votingMap.get(county)["Rep"];
      ind = votingMap.get(county)["Independent"];
      tip.html(
        "<div class ='w3-white w3-card'>" +
        "<table class='w3-table w3-striped w3-bordered'>" +
        "<tr><td>County: </td><td>" + county + "</td></tr>" +
        "<tr><td>Population: </td><td align='right'>" + pop + "</td></tr>" +
        "<tr><td>District: </td><td align='right'>" + district + "</td></tr>" +
        "<tr><td>Total Votes:</td><td align='right'>" + tVotes + "</td></tr>" +
        "<tr><td>Democrat: </td><td align='right'>" + dem + "</td></tr>" +
        "<tr><td>Republican: </td><td align='right'>" + rep + "</td></tr>" +
        "<tr><td>Independent: </td><td align='right'>" + ind + "</td></tr>" +
        "</table>" +
        "</div>")
      tip.transition()
        .duration(20)
        .style('opacity', .9)
        .style('left', (d3.event.pageX) + 40 + "px")
        .style('top', (d3.event.pageY - 40 + "px"))
        .style("z-index", 20);
    })
    .on('mouseout', function(d) {
      tip.transition()
        .duration(50)
        .style('opacity', 0)
        .style("z-index", 0);
    })
    .on('click', clicked);;

};

function setDistrict(evt, district) {
  if (district == "0") {
    selectedDistrict = district;
    redraw()
  } else {
    var i, x, tablinks;
    //set currently activated district
    selectedDistrict = district;
    tablinks = document.getElementsByClassName("distBut");
    for (i = 0; i < tablinks.length; i++) {
      if (tablinks[i].classList.contains("w3-opacity") === false) {
        tablinks[i].className += " w3-opacity";
      }
    }
    $(evt.currentTarget).removeClass(" w3-opacity");
    getFaded()
  }
}

function openAccordian(evt, id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    $(evt.currentTarget).addClass("active");
  } else {
    x.className = x.className.replace(" w3-show", "");
    $(evt.currentTarget).removeClass("active");
    setDistrict('0')
  }
  redraw()
}

d3.csv('data/IowaCountyData.csv', function(csvData) {
  votingData = csvData;
  votingMap = new Map();
  votingData.forEach(function(entry) {
    county = entry['County']
    pop = parseInt(entry['Population'])
    popScaled = Math.sqrt(parseInt(entry['Population']))
    rep = parseInt(entry['Trump'])
    dem = parseInt(entry['Clinton'])
    indp = parseInt(entry['Johnson']) + parseInt(entry['Others'])
    total = parseInt(entry['Total'])
    CD = entry['CongressionalDistrict']

    populations.push(pop);
    scaled_populations.push(popScaled);
    forClintonRatio.push(dem / rep);

    countyDict = {
      'Population': pop,
      'ScaledPopulation': popScaled,
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
    colorMap();
    districtData();
  });
});

// Draw for the first time to initialize.
redraw();
redraw();
// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);
