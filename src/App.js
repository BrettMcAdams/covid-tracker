import React, { useState, useEffect } from "react";
import "./styles/App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./utilities/util";
import numeral from "numeral";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="background">
        <div className="app__header">
          <img
            className="icon"
            src="https://www.lji.org/wp-content/uploads/2020/04/corona_icon-1-585x609.png"
            alt="covid icon"
          />
          <h1>COVID-19 World Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app">
          <div className="app__left">
            <div className="app__stats">
              <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Cases"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isRed
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>
            <Map
              countries={mapCountries}
              casesType={casesType}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <Card className="app__right">
            <CardContent>
              <div className="app__information">
              <h3>Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType} />
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
              </div>
            </CardContent>
          </Card>
          <p>*Data provided by disease.sh</p>
        </div>

      </div>
    </ThemeProvider>
  );
};

export default App;
