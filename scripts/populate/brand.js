module.exports = () => {
  const query = "SELECT ct.id, ct.brands FROM tms_car_models ct GROUP BY ct.brands ORDER BY ct.id";
  let brandInfo = [];
  return new Promise((resolve, reject) => {
    mysql.query(query, (err, brands) => {
      if (err) reject(err);

      if (brands.length > 0) {
        brands.map(brand => {
          brandInfo.push([brand.id, brand.brands]);
        })
        // let query = `INSERT INTO tms_car_brands (id, brand) VALUES (${brand.id}, '${brand.brands}')`;
        let query = `INSERT INTO tms_car_brands (id, brand) VALUES ?`;
        mysql.query(query, [brandInfo], (err, result) => {
          if (err) reject(err);

          resolve(brandInfo);
        })
      }
    })
  })
}



