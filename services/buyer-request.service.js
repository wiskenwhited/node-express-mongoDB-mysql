const Q = require('q');

const getAll = () => {
    let deferred = Q.defer();
    const query = "select id as _id, status as requestStatus, time as requestTime, type as requestType, sellcarUDID, phone as userPhone, price from yc_buyer_request";
    mysql.query(query, (err, results) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        deferred.resolve(results);
    });

    return deferred.promise;
}

const create = data => {
    let deferred = Q.defer();
    const row = {
        status: data.requestStatus,
        time: data.requestTime,
        type: data.requestType,
        sellcarUDID: data.sellcarUDID,
        phone: data.userPhone,
        price: data.price
    }
    const query = "insert into yc_buyer_request set ?";
    mysql.query(query, row, (err, result) => {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });

    return deferred.promise;
}

const update = (_id, data) => {
    let deferred = Q.defer();

    const row = {
        phone: data.userPhone,
        sellcarUDID: data.sellcarUDID,
        type: data.requestType,
        time: data.requestTime,
        status: data.requestStatus
    };
    const query = "update yc_buyer_request set ? where id = " + _id;
    mysql.query(query, row, (err, doc) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

const _delete = _id => {
    let deferred = Q.defer();

    const query = "delete from yc_buyer_request where id = " + _id;
    mysql.query(query, err => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });

    return deferred.promise;
}

let service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;