const showCountryName = (d, i, names) => {
  let countryName = document.getElementById("country-name");
  let name = names.filter(x => x.id == d.id)[0].name;
  countryName.innerHTML = name;

  //population
  let countryPop = document.getElementById("country-population");

  d3.json(
    "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json"
  ).then(data => {
    let country = data.filter(x => x.country === name);
    let population = country[0].population.replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1,"
    );
    countryPop.innerHTML = "Population: " + population;
  });
  //surface area
  let countryArea = document.getElementById("country-area");
  d3.json(
    "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-surface-area.json"
  ).then(data => {
    let country = data.filter(x => x.country === name);
    let area = country[0].area
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    countryArea.innerHTML = "Total Area: " + area + " sq.km.";
  });
};

export default showCountryName;
