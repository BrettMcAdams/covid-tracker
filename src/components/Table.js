import React from "react";
import "../styles/Table.css";
import numeral from "numeral";

function Table({ countries }) {
  console.log(countries);
  return (
    <div className="table">
      <tr className='tableHeader'>
        <th>Country</th>
        <th className='pop'>Population</th>
        <th className='act'>Active Cases</th>
        <th>Deaths</th>
        <th>Cases per 1mil</th>
        <th>Total</th>
      </tr>
      {countries.map((country) => (
        <tr>
          <td className="countryName">
            <b>{country.country}</b>
          </td>
          <td className='pop'>{numeral(country.population).format("0,0")}</td>
          <td className='act'>{numeral(country.active).format("0,0")}</td>
          <td>{numeral(country.deaths).format("0,0")}</td>
          <td>{numeral(country.casesPerOneMillion).format("0,0")}</td>
          <td>
            {numeral(country.cases).format("0,0")}
          </td>
          
        </tr>
      ))}
    </div>
  );
}

export default Table;
