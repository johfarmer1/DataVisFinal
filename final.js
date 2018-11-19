//var width = 1200;
//var height = 800;
var votingMap;
var scale0 = 8000
var border = 0; // change to 0 to remove border
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

  svg.selectAll('.legendlabel').remove()
  if ($(showDistricts)[0].checked) {
    legend
    .attr('width', w/7)
    .attr('height',w/7)
    .attr('x', w - (w/5) + "px")
    .attr('y', h - (w/5) + "px")
    .style('opacity',1);
    legend2
    .attr('width', w/7)
    .attr('height',w/7)
    .attr('x', w - (w/5) + "px")
    .attr('y', h - (w/5) + "px")
    .style('opacity',.95);
    createLegendLabels()
  } else {
    legend.style('opacity',0)
    legend2.style('opacity',0)
  }

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
//.style('color', 'black');

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
maxForClintonRatio = 1.85;
minForClintonRatio = 0.15;

maxPopulation = Math.log(474768)
minPopulation = Math.log(3716)

var vDomain = [minForClintonRatio, maxForClintonRatio];
var uDomain = [maxPopulation, minPopulation];

var quantization = vsup.squareQuantization().n(5).valueDomain(vDomain).uncertaintyDomain(uDomain);
//var quantization = vsup.quantization().branching(3).layers(4).valueDomain(vDomain).uncertaintyDomain(uDomain);
var scale = vsup.scale().quantize(quantization).range(interpolateIsoRdBu);

var legend = vsup.legend.heatmapLegend();

var linearGradient = svg.append('linearGradient').attr('id', 'linearGradient');
  linearGradient.append('stop')
    .attr('offset', '0%')
    .attr("stop-color", red );
  linearGradient.append('stop')
    .attr('offset', '50%')
    .attr("stop-color", purple );
  linearGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', blue );

var greyGradient = svg.append('linearGradient').attr('id', 'greyGradient')
  .attr('gradientTransform', "rotate(90)");

greyGradient.append('stop')
  .attr('offset', '0%')
  .attr("stop-color", "rgba(255,255,255,0)" );
greyGradient.append('stop')
  .attr('offset', '100%')
  .attr("stop-color", "rgba(255,255,255,.85)" );


//color map legend
var legend = svg.append('rect')
  .attr('class','legend')
  .attr('width', w/7)
  .attr('height',w/7)
  .attr('x', w - (w/5) + "px")
  .attr('y', h - (w/5) + "px")
  .attr('z-index', 0)
  .style('fill', "url(#linearGradient)");

var legend2 = svg.append('rect')
  .attr('class','legend')
  .attr('width', w/7)
  .attr('height',w/7)
  .attr('x', w - (w/5) + "px")
  .attr('y', h - (w/5) + "px")
  .attr("z-index", 1)
  .attr('fill', 'url(#greyGradient)')
  .style('opacity', .95);


var createLegendLabels = function() {

  var legendWidth = parseInt(legend.attr('width'))
  var legendX = parseInt(legend.attr('x'))
  var legendY = parseInt(legend.attr('y'))


  var label1 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("Percentage of votes for Clinton")
    .attr('x', legendX)
    .attr('width', legendWidth)
    .attr('y', legendY-20)
    .style('weight', 'bold')
    .style('text-align', 'center')
    .style('font-size', '10px')

  var label2 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("0")
    .attr('x', legendX)
    .attr('y', legendY-5)
    .style('weight', 'bold')
    .style('font-size', '12px')

  var label3 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("100")
    .attr('x', legendX+legendWidth-22.5)
    .attr('y', legendY-5)
    .style('weight', 'bold')
    .style('font-size', '12px')

  var label4 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("Population Size")
    .attr('x', legendX + legendWidth + 15)
    .attr('y', legendY + (legendWidth / 2) - 38.4)
    .style('weight', 'bold')
    .style('font-size', '10px')
    .attr('transform', function() {var newW = legendX + legendWidth+15 , newH = (legendY + (legendWidth / 2) - 38.4);
                    return "rotate(90, " + newW + "," + newH + ")"});

  var label5 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("474768")
    .attr('x', legendX + legendWidth)
    .attr('y', legendY + 15)
    .style('weight', 'bold')
    .style('font-size', '12px')

  var label6 = svg.append('text')
    .attr('class', 'legendlabel')
    .text("3716")
    .attr('x', legendX + legendWidth)
    .attr('y', legendY + legendWidth)
    .style('weight', 'bold')
    .style('font-size', '12px')

}


var districtColorMap = {
  '1': "#8dd3c7",
  '2': "#ffffb3",
  '3': "#bebada",
  '4': "#fb8072",
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
  colorMap()
  districtData()
  makePopGraph()
  makeVoteGraph()
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
    legend.style('opacity',1)
    legend2.style('opacity',.9)
    createLegendLabels()
    aggByDistrict = $(aggDistricts)[0].checked;
    countyName = d.properties['NAME']
    countyDict = votingMap.get(countyName)
    if (aggByDistrict) {
      if (countyDict['District'] === "1") {
        return scale((demD1 / votesD1), scaled_popD1);
      } else if (countyDict['District'] === "2") {
        return scale((demD2 / votesD2), scaled_popD2);
      } else if (countyDict['District'] === "3") {
        return scale((demD3 / votesD3), scaled_popD3);
      } else if (countyDict['District'] === "4") {
        return scale((demD4 / votesD4), scaled_popD4);
      }
    } else {
      return scale((countyDict["Dem"] / countyDict['Rep']), countyDict['ScaledPopulation']);
    }
  } else {
    legend.style('opacity', 0)
    legend2.style('opacity', 0)
    svg.selectAll('.legendlabel').remove()
    var county = d.properties['NAME']
    cDict = votingMap.get(county)
    district = cDict['District']
    return districtColorMap[district]
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
  popD1 = 0
  popD2 = 0
  popD3 = 0
  popD4 = 0
  votesD1 = 0
  votesD2 = 0
  votesD3 = 0
  votesD4 = 0
  demD1 = 0
  demD2 = 0
  demD3 = 0
  demD4 = 0
  repD1 = 0
  repD2 = 0
  repD3 = 0
  repD4 = 0
  indD1 = 0
  indD2 = 0
  indD3 = 0
  indD4 = 0
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
  scaled_popD1 = Math.sqrt(popD1)
  scaled_popD2 = Math.sqrt(popD2)
  scaled_popD3 = Math.sqrt(popD3)
  scaled_popD4 = Math.sqrt(popD4)
  makePopGraph();
  makeVoteGraph();
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
        "<tr><td>Population: </td><td align='right'>" + Number(pop).toLocaleString() + "</td></tr>" +
        "<tr><td>District: </td><td align='right'>" + district + "</td></tr>" +
        "<tr><td>Total Votes:</td><td align='right'>" + Number(tVotes).toLocaleString() + "</td></tr>" +
        "<tr><td>Percent Votes for Hillary: </td><td align='right'>" +
        (Number(dem / tVotes) * 100).toFixed(2) + "%</td></tr>" +
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
    .on('click', clicked);

};

function setDistrict(evt, district) {
  if (district == "0") {
    selectedDistrict = district;
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
  districtData();
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

//Clears the district of each county
function clearAllDisricts() {
  votingMap.forEach(function(county) {
    county['District'] = '5'
  });
  d3.selectAll('.county').style('fill', districtColorMap['5'])
  districtData();
  colorMap();
}


makePopGraph = function() {
  var original_data = {
    name: 'Before',
    type: 'bar',
    y: ['1', '2', '3', '4'],
    x: [771049, 778869, 823243, 757708],
    orientation: 'h'
  }

  var new_data = {
    name: 'Your Districts',
    type: "bar",
    y: ['1', '2', '3', '4'],
    x: [popD1, popD2, popD3, popD4],
    orientation: 'h'
  }

  var layout = {
    title: 'Population of Each District',
    showlegend: false,

    height: 300,
    xaxis: {
      title: 'District Population'
    },
    yaxis: {
      title: 'District Number'
    }
  }

  Plotly.react('popDiv', [original_data, new_data], layout)

}

makeVoteGraph = function() {
  var original_data = {
    name: 'Before',
    type: 'bar',
    y: ['1', '2', '3', '4'],
    x: [0.4462089866113292, 0.4416078232486768, 0.44470166399777206, 0.33199909313361425],
    orientation: 'h'
  }

  var new_data = {
    name: 'Your Districts',
    type: "bar",
    y: ['1', '2', '3', '4'],
    x: [demD1 / votesD1, demD2 / votesD2, demD3 / votesD3, demD4 / votesD4],
    orientation: 'h'
  }

  var layout = {
    title: 'Election Result of Each District',
    showlegend: false,

    height: 300,
    xaxis: {
      title: 'Percent Votes for Hillary',
      range: [0, .6],
      autotick: false,
      tick0: 0,
      dtick: 0.1
    },
    yaxis: {
      title: 'District Number'
    },
    shapes: [{
      type: 'line',
      x0: 0.5,
      y0: 0.5,
      x1: 0.5,
      y1: 4.5,
      line: {
        color: 'rgb(55, 128, 191)',
        width: 3,
        dash: 'dot'
      }
    }]

  }

  Plotly.react('voteDiv', [original_data, new_data], layout)

}

var getCsv = function() {
  var defer = $.Deferred();
  d3.csv('data/IowaCountyData.csv', function(csvData) {
    votingData = csvData;
    votingMap = new Map();
    votingData.forEach(function(entry) {
      county = entry['County']
      pop = parseInt(entry['Population'])
      popScaled = Math.log(parseInt(entry['Population']))
      rep = parseInt(entry['Trump'])
      dem = parseInt(entry['Clinton'])
      indp = parseInt(entry['Johnson']) + parseInt(entry['Others'])
      total = parseInt(entry['Total'])
      CD = entry['CongressionalDistrict']

      populations.push(pop);
      scaled_populations.push(popScaled);
      forClintonRatio.push(dem / (rep + indp));

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
    defer.resolve(votingMap);
  });
  return defer.promise();
};

$.when(
  getCsv(), // please pass csv url as you like
).done(function(res1) {
  var votingMap = res1
  districtData();
}).fail(function(err) {
  console.log(err);
});



// Draw for the first time to initialize.
redraw();
redraw();
// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);
