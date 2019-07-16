var Q = require('q');

const getAll = () => {
    const deferred = Q.defer();
    const query = "select * from yc_suggestive_cars";
    mysql.query(query, (err, cars) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(cars);
        }
    });
    return deferred.promise;
}

const create = sugCarParam => {
    const deferred = Q.defer();
    const query = "insert into yc_suggestive_cars set ?";
    mysql.query(query, sugCarParam, err => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message)
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}


const update = (_id, sugCarParam) => {
    const deferred = Q.defer();
    const query = "update yc_suggestive_cars set ?";
    mysql.query(query, sugCarParam, err => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message)
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

const _delete = _id => {
    const deferred = Q.defer();
    const query = "delete from yc_suggestive_cars where id = " + _id;
    mysql.query(query, err => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message)
        } else {
            deferred.resolve();
        }
    })
    return deferred.promise;
}

let service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;
