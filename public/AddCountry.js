const addCountry = country => {
  d3.select("#countries")
    .append("div")
    .attr("class", "country-info")
    .html(d => `<div>${country.name}</div>`);
};
export default addCountry;
