const addCity = city => {
  var pi = Math.PI,
    tau = 2 * pi;
  var projection = d3
    .geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

  var path = d3.geoPath().projection(projection);

  function geoLocations(d) {
    return {
      type: "Point",
      coordinates: [d.long, d.lat],
      name: d.city,
      region: d.region,
      country: d.country
    };
  }

  d3.select("svg")
    .datum(geoLocations(city))
    .append("path")
    .attr("d", path)
    .attr("class", "city")
    .on("mouseover", d => {
      let weather = document.getElementById("weather-data");
      d3.json(
        `https://api.openweathermap.org/data/2.5/weather?q=${
          d.name
        }&units=imperial&appid=7a0d4b3e4193bc8e248dd9d51bbd9943`
      ).then(res => {
        console.log(res);
        weather.innerHTML = `City: ${res.name}<br>Current Temperature: ${
          res.main.temp
        } F<br>Weather: ${res.weather[0].description}<br>Wind Speed: ${
          res.wind.speed
        } mph`;
      });
    });

  d3.select("#employees")
    .append("div")
    .attr("class", "city-info")
    .html(
      d => `<div>${city.employee_name} (${city.city}, ${city.country})</div>`
    );
};
export default addCity;
