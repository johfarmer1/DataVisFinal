Data Visualization Final Project
Quinn Schiller, Joh Farmer, Jordon O'Kelly

Our visualization can be run by entering the directory "DataVisFinal"
Then on the terminal run: `python3 -m http.server`
Then on chrome search http://localhost:8000/ and the visualization
should appear

The first view will show a map of Iowa divided by congressional regions.
By using the graph controls, the user can then see the counties and regions
based on population and voting data. Using the "Congressional District
Controls" dropdown, the user can select a district and add counties to that
district. The side-graphs will change based on this gerrymandering.

final.js is our javascript file that contains all of the D3 code that
creates our visualization. index.html is our html template that uses the
javascript file. USCounty.json is the Json file that we used to create the
map of Iowa. IowaCountyData.csv contains the Iowa election data.

We used the 2010 census data to find the population of each county as well as county-level voting results for Iowa. Our color scale uses the vsup library.

- Population Data
  -  https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml?refresh=t
- Voting Results
  - https://www.nytimes.com/interactive/2016/us/elections/primary-calendar-and-results.html
- GeoJson source
  - eric.clst.org/tech/usgeojson
- Vsup source
  - https://github.com/uwdata/vsup
