const Q = require('q');

const getAll = () => {
    let deferred = Q.defer();
    const query = "select id as _id, requestStatus, currentCarPlace, sellcarBrand, requestTime, totalDriven, purchaseDate, sellcarSeries from yc_seller_request";
    mysql.query(query, (err, results) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        deferred.resolve(results);
    });

    return deferred.promise;
}

const getById = _id => {
    let deferred = Q.defer();
    const query = "select id as _id, requestStatus, currentCarPlace, sellcarBrand, requestTime, totalDriven, purchaseDate, sellcarSeries from yc_seller_request where id = " + _id;    
    mysql.query(query, (err, results) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (results.length > 0) {
            deferred.resolve(results[0]);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

const create = data => {
    let deferred = Q.defer();
    const row = {
        requestStatus: data.requestStatus,
        currentCarPlace: data.currentCarPlace,
        sellcarBrand: data.sellcarBrand,
        requestTime: data.requestTime,
        totalDriven: data.totalDriven,
        purchaseDate: data.purchaseDate,
        sellcarSeries:data.sellcarSeries,
        phone:data.userPhone
    }
    const query = "insert into yc_seller_request set ?";
    mysql.query(query, row, (err, result) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

const update = (_id, data) => {
    let deferred = Q.defer();

    const query = "update yc_seller_request set ? where id = " + _id;
    mysql.query(query, data, (err, doc) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

const _delete = _id => {
    let deferred = Q.defer();

    const query = "delete from yc_seller_request where id = " + _id;
    mysql.query(query, err => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

let service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;
