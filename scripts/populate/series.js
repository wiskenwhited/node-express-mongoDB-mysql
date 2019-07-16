module.exports = {
  populateSeries: (data) => {
    let count = 0;
    let promises = data.map(b => {
      let sql = `SELECT DISTINCT ct.car_series FROM tms_car_models ct WHERE ct.brands='${b[1]}'`;
      mysql.query(sql, (err, results) => {
        if (err) {
          console.log(err);
        }

        if (results.length > 0) {
          let series = [];
          results.map(s => {
            series.push([b[0], s.car_series]);
          })
          
          let sql1 = `INSERT INTO tms_car_series (brand_id, series) VALUES ?`;
          mysql.query(sql1, [series], (err, res) => {
            if (err) console.log(err);
            count++;
            console.log(`Number of car series imported : ${count}`);
            if (count == data.length) {
              console.log('Populated Successfully!!!');
              process.exit(0);
            }
          })
        }
      })
    })
  }
}
