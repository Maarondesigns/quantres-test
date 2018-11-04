import addCity from "./AddCity.js";

const cityLookup = () => {
  let city = document.getElementById("city-lookup");

  if (city.value.length > 3) {
    d3.json(`/mapbox/`).then(data => {
      d3.json(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          city.value
        }.json?access_token=${data.token}`
      ).then(function(data) {
        let y = document.getElementById("city-lookup").getBoundingClientRect()
          .top;

        d3.selectAll("#autoContainer").remove();

        let autoContainer = d3
          .select("#autofill")
          .append("div")
          .attr("id", "autoContainer");

        autoContainer
          .selectAll(".autocomplete")
          .data(data.features)
          .enter()
          .append("div")
          .attr("class", "autocomplete")
          .html((d, i) => data.features[i].place_name)
          .on("click", autoSelect);

        function autoSelect(d, i) {
          let context = data.features[i].context;
          let countryValue = context.filter(x => x.id.includes("country"));
          let regionValue;
          if (context.length > 1)
            regionValue = context.filter(x => x.id.includes("region"));

          d3.select(this)
            .style("background-color", "gray")
            .style("cursor", "pointer");
          let employeeName = document.getElementById("employee").value;
          let selectedCity = {};
          selectedCity.employee_name = employeeName;
          let placeInfo = data.features[i].place_name.split(", ");
          selectedCity.city = placeInfo[0];
          if (regionValue) {
            selectedCity.region = regionValue[0].text;
          } else selectedCity.region = city.value;

          selectedCity.country = countryValue[0].text;
          selectedCity.long = data.features[i].center[0];
          selectedCity.lat = data.features[i].center[1];

          d3.json(`/addcity`, {
            method: "POST",
            body: JSON.stringify(selectedCity),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then(json => {
            addCity(json);
            city.value = "";
            d3.selectAll("#autoContainer").remove();
          });
        }
      });
    });
  }
};

export default cityLookup;
