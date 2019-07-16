const Q = require('q');

const parse = results => {
    let brands = [];
    let brand = {};
    results.forEach(el => {
        if (brand._id && brand._id != el._id) {
            brands.push(brand);
            brand = {};
        }

        if (!brand._id) {
            brand = {
                _id: el._id,
                logo: el.b_logo,
                chName: el.chName,
                enName: "",
                chPinyin: "",
                series: []
            }
        }

        if(brand._id && brand._id == el._id) {
            brand.series.push({
                chName: el.series,
                chPinyin: "",
                seriesLogo: el.s_logo
            });
        }
    });

    if(brand._id)
        brands.push(brand);

    return brands;
}

const getAll = () => {
    let deferred = Q.defer();

    const query = "SELECT cb.id AS _id, cb.brand AS chName, cb.logo as b_logo, cs.series AS series, cs.logo as s_logo FROM tms_car_brands cb INNER JOIN tms_car_series cs ON cb.id = cs.brand_id ORDER BY cb.id;";
    mysql.query(query, (err, results) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if(results.length > 0) {
            deferred.resolve(parse(results));
        } else {
            deferred.resolve([]);
        }
    });

    return deferred.promise;
}

let service = {};
service.getAll = getAll;

module.exports = service;
