import showCountryName from "./ShowCountryName.js";
import cityLookup from "./CityLookup.js";
import addCity from "./AddCity.js";

let countryInfo = d3.select("#add-city");

countryInfo
  .append("input")
  .attr("id", "city-lookup")
  .on("input", cityLookup);

countryInfo.append("div").attr("id", "autofill");

var pi = Math.PI,
  tau = 2 * pi;

var width = Math.max(960, window.innerWidth),
  height = Math.max(500, window.innerHeight);

// Initialize the projection to fit the world in a 1×1 square centered at the origin.
var projection = d3
  .geoMercator()
  .scale(1 / tau)
  .translate([0, 0]);

var path = d3.geoPath().projection(projection);

var tile = d3.tile().size([width, height]);

var zoom = d3
  .zoom()
  .scaleExtent([1 << 11, 1 << 14])
  .on("zoom", zoomed);

var svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

var raster = svg.append("g");

// var vector = svg.selectAll("path");
// queue()
//   .defer(d3.json, "world.json")
//   .defer(
//     d3.tsv,
//     "https://raw.githubusercontent.com/Maarondesigns/Travel_Blog/master/WorldCountryNames.tsv"
//   )
//   .await(ready);
Promise.all([
  d3.json("world.json"),
  d3.tsv(
    "https://raw.githubusercontent.com/Maarondesigns/Travel_Blog/master/WorldCountryNames.tsv"
  ),
  d3.json("cities.json")
]).then(([world, names, cities]) => {
  ready(world, names, cities);
});

function ready(world, names, cities) {
  svg
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "country")
    .on("mouseover", (d, i) => showCountryName(d, i, names));

  function geoLocations(cities) {
    return cities.map(function(d) {
      return {
        type: "Point",
        coordinates: [d.long, d.lat],
        name: d.city,
        region: d.region,
        country: d.country
      };
    });
  }

  cities.cities.forEach(city => {
    addCity(city);
  });

  // svg
  //   .selectAll(null)
  //   .data(geoLocations(cities))
  //   .enter()
  //   .append("path")
  //   .attr("d", path)
  //   .attr("class", "city");

  // countryInfo
  //   .selectAll("div")
  //   .data(cities.cities)
  //   .enter()
  //   .append("div")
  //   .attr("class", "city-info")
  //   .html(d => `<span>${d.city},${d.region}</span>`);

  // Compute the projected initial center.
  var center = projection([0, 45]);

  // Apply a zoom transform equivalent to projection.{scale,translate,center}.
  svg.call(zoom).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1 << 12)
      .translate(-center[0], -center[1])
  );
}

function zoomed() {
  var transform = d3.event.transform;

  var tiles = tile.scale(transform.k).translate([transform.x, transform.y])();

  projection.scale(transform.k / tau).translate([transform.x, transform.y]);

  svg.selectAll("path").attr("d", path);

  var image = raster
    .attr("transform", stringify(tiles.scale, tiles.translate))
    .selectAll("image")
    .data(tiles, function(d) {
      return d;
    });

  image.exit().remove();

  image
    .enter()
    .append("image")
    .attr("xlink:href", function(d) {
      return (
        "http://" +
        "abc"[d[1] % 3] +
        ".tile.openstreetmap.org/" +
        d[2] +
        "/" +
        d[0] +
        "/" +
        d[1] +
        ".png"
      );
    })
    .attr("x", function(d) {
      return d[0] * 256;
    })
    .attr("y", function(d) {
      return d[1] * 256;
    })
    .attr("width", 256)
    .attr("height", 256);
}

function stringify(scale, translate) {
  var k = scale / 256,
    r = scale % 1 ? Number : Math.round;
  return (
    "translate(" +
    r(translate[0] * scale) +
    "," +
    r(translate[1] * scale) +
    ") scale(" +
    k +
    ")"
  );
}
