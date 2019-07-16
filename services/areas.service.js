const Q = require('q');

const getAll = () => {
    let deferred = Q.defer();
    const query = "select id as _id, city as chName, city_en as chPinyin from tms_cities";

    mysql.query(query, (err, areas) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(areas);
    });

    return deferred.promise;
}

let service = {};
service.getAll = getAll;

module.exports = service;
