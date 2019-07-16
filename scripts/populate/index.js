const config = require('../../config/env/development');
const mysql = require('mysql').createConnection(config.mysql);
const { populateSeries } = require('./series.js');

global.mysql = mysql;

console.log('Brand population starting...');

require('./brand.js')()
  .then(brandInfo => {
    console.log('Populated Successfully!');
    console.log('Series population starting...');

    populateSeries(brandInfo);
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  })
