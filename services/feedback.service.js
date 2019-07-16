var Q = require('q');

const getAll = () => {
    const deferred = Q.defer();
    const query = "select id as _id, phoneNumber, feedback, date from yc_feedback"
    mysql.query(query, (err, fds) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(fds);
    })
    return deferred.promise;
}

const _delete = _id => {
    const deferred = Q.defer();
    const query = "delete from yc_feedback where id = " + _id;
    mysql.query(query, err => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });
    return deferred.promise;
}

let service = {};

service.getAll = getAll;
service.delete = _delete;

module.exports = service;
