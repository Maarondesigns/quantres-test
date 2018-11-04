require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");

const mapToken = process.env.MAPBOX_TOKEN;

var app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

app.get(`/mapbox/`, (req, res) => {
  let token = {
    token: mapToken
  };
  res.send(token);
});

app.post("/addcity", addCity);

app.post("/addcountry", addCountry);

function addCity(req, res) {
  console.log(req.body);
  var newCity = {
    employee_name: req.body.employee_name,
    city: req.body.city,
    region: req.body.region,
    country: req.body.country,
    lat: Number(req.body.lat),
    long: Number(req.body.long)
  };
  let allCities;
  fs.readFile("public/cities.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      allCities = JSON.parse(data);
      allCities.cities.push(newCity);
      json = JSON.stringify(allCities);
      fs.writeFile("public/cities.json", json, "utf8", () =>
        console.log("success")
      );
    }
  });

  res.send(newCity);
}

function addCountry(req, res) {
  console.log(req.body);
  var newCountry = {
    name: req.body.name
  };
  let allCountries;
  fs.readFile("public/countries.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      allCountries = JSON.parse(data);
      allCountries.cities.push(newCountry);
      json = JSON.stringify(allCountries);
      fs.writeFile("public/countries.json", json, "utf8", () =>
        console.log("success")
      );
    }
  });

  res.send(newCountry);
}
