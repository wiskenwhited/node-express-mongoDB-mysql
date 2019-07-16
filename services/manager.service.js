const bcrypt = require('bcryptjs');
const Q = require('q');

const authenticate = (username, password) => {
    let deferred = Q.defer();
    const query = "select * from yc_managers where username = '" + username + "'";
    mysql.query(query, (err, managers) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if(managers.length > 0 && bcrypt.compareSync(password, managers[0].hash)) {
            deferred.resolve(managers[0]);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

const getAll = user => {
    let deferred = Q.defer();
    let query = "select id as _id, username, role from yc_managers where id = " + user._id;
    mysql.query(query, (err, users) => {
        if(err || users.length == 0)
            deferred.reject({ success: false, message: "You are not authenticated to do this action"});
        else {
            if(users[0].role == 'supermanager') {
                let query = "select id as _id, username, role from yc_managers";
                mysql.query(query, (err, users) => {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    deferred.resolve(users);
                });
            } else {
                deferred.resolve(users);
            }
        }
    });

    return deferred.promise;
}

const getById = _id => {
    let deferred = Q.defer();
    const query = "select id as _id, username, role from yc_managers where id = " + _id;
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if(users.length > 0) {
            deferred.resolve(users[0]);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

const addManager = (user, body) => {
    let deferred = Q.defer();
    const userId = user._id;
    let query = "select * from yc_managers where id = " + userId;
    mysql.query(query, (err, users) => {
        if(err || users.length == 0 || users[0].role != 'supermanager') {
            deferred.reject({ success: false, message: "You are not authenticated to do this action"});
        } else {
            query = "select * from yc_managers where username = '" + body.username + "'";
            mysql.query(query, (err, users) => {
                if(users.length > 0) {
                    deferred.reject({ success: false, message: "The username already exists"});
                } else {
                    const newManager = {
                        username: body.username,
                        role: 'manager',
                        hash: bcrypt.hashSync(body.password, 10)
                    }
                    query = "insert into yc_managers set ?";
                    mysql.query(query, newManager, (err, doc) => {
                        if(err)
                            deferred.reject({ success: false, message: "Error! Please try again."});
                        else
                            deferred.resolve({ success: true });
                    });
                }
            });
        }
    });

    return deferred.promise;
}

const editManager = (token_user, body) => {
    let deferred = Q.defer();
    const userId = token_user._id;
    let query = "select * from yc_managers where id = " + userId;
    mysql.query(query, (err, users) => {
        if(err || users.length == 0 || (users[0].role != 'supermanager' && users[0].id != body._id)) {
            deferred.reject({ success: false, message: "You are not authenticated to do this action"});
        } else {
            query = "select * from yc_managers where username = '" + body.username + "'";
            mysql.query(query, (err, users) => {
                if(users.length > 0 && users[0].id != body._id) {
                    deferred.reject({ success: false, message: "The username already exists"});
                } else {
                    let newManager = {
                        username: body.username
                    }
                    if(body.password)
                        newManager.hash = bcrypt.hashSync(body.password, 10);
                    
                    query = "update yc_managers set ?";
                    mysql.query(query, newManager, (err, doc) => {
                        if(err)
                            deferred.reject({ success: false, message: "Error! Please try again."});
                        else
                            deferred.resolve({ success: true });
                    });
                }
            });
        }
    });

    return deferred.promise;
}

const _delete = (token_user, _id) => {
    let deferred = Q.defer();
    const userId = token_user._id;
    let query = "select * from yc_managers where id = " + userId;
    mysql.query(query, (err, users) => {
        if(err || users.length == 0 || users[0].role != 'supermanager' || users[0].id == _id)
            deferred.reject({ success: false, message: "You are not authenticated to do this action"});
        else {
            query = "delete from yc_managers where id = " + users[0].id;
            mysql.query(query, err => {
                if(err)
                    deferred.reject({ success: false, message: "Error! Please try again."});
                else
                    deferred.resolve({ success: true });
            });
        }
    });

    return deferred.promise;
}

let service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.addManager = addManager;
service.editManager = editManager;
service.getById = getById;
service.delete = _delete;

module.exports = service;