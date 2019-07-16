const Q = require('q');
const Sellcar = require('./sellcar.service');

const getAll = () => {
    let deferred = Q.defer();
    const query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users";

    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(users);
    });

    return deferred.promise;    
}

const getById = _id => {
    let deferred = Q.defer();
    const query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users where id = " + _id;

    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users.length > 0) {
            deferred.resolve(users[0]);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

const getProfile = param => {
    const deferred = Q.defer();
    const phoneNum = param.phoneNumber;
    const query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users where phoneNumber = '" + phonenum + "'";
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users.length > 0) {
            deferred.resolve(users[0]);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

const getChannelIDbyPhone = phonenum => {
    let deferred = Q.defer();
    const query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users where phoneNumber = '" + phonenum + "'";
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if(users.length > 0) {
            deferred.resolve(user[0].channel_id);
        } else {
            deferred.resolve();
        }
    })
  return deferred.promise;
};

const saveToken = (phonenum, secret) => {
    let deferred = Q.defer();
    let query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users where phoneNumber = '" + phonenum + "'";
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (users.length > 0) {
            let user = users[0];
            user.secret = secret;
            query = "update yc_users set ? where id = " + user._id;
            mysql.query(query, { secret: secret }, (err, doc) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
        } else {
            query = "insert into yc_users set ?";
            mysql.query(query, {phoneNumber: phonenum, secret: secret}, (err, docs) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
        }
  });
  return deferred.promise;
};

const getToken = phonenum => {
    let deferred = Q.defer();
    let query = "select id as _id, phoneNumber, userName, profileImage, gender, bDay, address, type, secret, verified, osType, channel_id from yc_users where phoneNumber = '" + phonenum + "'";
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (users.length > 0) {
            deferred.resolve(users[0]);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

const setVerified = (user, osType, identifier) => {
    let deferred = Q.defer();
    const data = {
        verified: 1,
        osType: osType,
        channel_id: identifier
    }
    let query = "update yc_users set ? where id = " + user._id;
    mysql.query(query, data, (err, docs) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
};

const create = userParam => {
    let deferred = Q.defer();
    let query = "select * from yc_users where phoneNumber = '" + userParam.phoneNumber + "'";
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (users.length > 0) {
            deferred.reject('user "' + userParam.phoneNumber + '" is already taken');
        } else {
            query = "insert into set ?";
            mysql.query(query, userParam, (err, docs) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(docs[0].ops);
            });
        }
    });
    return deferred.promise;
}

const update = (_id, userParam) => {
    let deferred = Q.defer();
    let query = "select * from yc_users where id = " + _id;
    const updateUser = () => {
        const set = {
            phoneNumber: userParam.phoneNumber,
            userName: userParam.userName,
            profileImage: userParam.profileImage,
            gender: userParam.gender,
            bDay: userParam.bDay,
            address: userParam.address,
            type: userParam.type,
        };

        let query = "update yc_users set ? where id = " + _id;
        mysql.query(query, set, (err, doc) => {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    }
    mysql.query(query, (err, users) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (users[0].phoneNumber !== userParam.phoneNumber) {
            query = "select * from yc_users where phoneNumber = '" + phoneNUmber + "'";
            mysql.query(query, (err, users) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if(users.length > 0) {
                    deferred.reject('user phoneNumber "' + userParam.phoneNumber + '" is already taken')                    
                } else {
                    updateUser();
                }
            });
        } else {
            updateUser();
        }
    });
    return deferred.promise;
}

const _delete = _id => {
    let deferred = Q.defer();
    const query = "delete from yc_users where id = " + _id;
    mysql.query(query, err => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });
    return deferred.promise;
}

const setFeedback = param => {
    const deferred = Q.defer();

    const phoneNum = param.phoneNumber;
    const feedback = param.feedback;
    const date = param.date;

    var set = {
        phoneNumber: phoneNum,
        feedback: feedback,
        date: date
    };

    const query = "insert into yc_feedback set ?";
    mysql.query(query, set, (err, doc) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });

    return deferred.promise;
};

const getBoughtCars = param => {
  const deferred = Q.defer();
  const phoneNum = param.phoneNumber;
  deferred.resolve({data:[]});
//   db.sellcars.find({status:'出售完成', 'soldStatus.phoneNumber':phoneNum}).toArray(function(err, result){
//     if(err) deferred.reject();
//     if(result){
//       deferred.resolve({data:result});
//     } else {
//       deferred.resolve({data:[]});
//     }

//   });
  return deferred.promise;
}

const getSoldCars = param => {
  const deferred = Q.defer();
  const phoneNum = param.phoneNumber;
  deferred.resolve({data:[]});
//   db.sellcars.find({status:'出售完成', sellerPhone:phoneNum}).toArray(function(err, result){
//     if(err) deferred.reject();
//     if(result){
//       /*
//       var cars = [];
//       cars = result.map(function(row){
//         if(row.sellerPhone === phoneNum)
//           return row;
//       });
//       deferred.resolve({data: cars});
//       */
//       deferred.resolve({data: result});
//     } else {
//       deferred.resolve({data:[]});
//     }

//   });
  return deferred.promise;
}

const getReservedCars = param => {
    const deferred = Q.defer();
    const phoneNum = param.phoneNumber;
    let page = 1;
    let sort = [];
    let condition = [];
    let response = [];

    const query = `SELECT yc.sellcarUDID FROM yc_buyer_request yc WHERE yc.phone=${phoneNum}`;
    mysql.query(query, (err, result) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (Array.isArray(result) && result.length > 0 && result.filter(val => val.sellcarUDID).length > 0) {
            sellcarIds = result.map((val) => "'" + val.sellcarUDID + "'");
            
            if(sellcarIds.length > 0) {
                condition.push("i.id in (" + sellcarIds.join(',') + ")");
            }
            let query = {
                page: page,
                limit: 10,
                condition: condition,
                sort: sort
            }
            Sellcar.getAll(query)
            .then((car) => {
                deferred.resolve({data:car});
            })
            .catch((err) => {
                deferred.resolve({data:[]});
            });
        } else {
            deferred.resolve({data:[]});
        }
    });

    return deferred.promise;
}

const getFilterCars = param => {
    const deferred = Q.defer();
    const phoneNum = param.phoneNumber;

    const query = `SELECT * FROM yc_seller_request yc WHERE yc.phone=${phoneNum}`;
    mysql.query(query, (err, result) => {
        if (err) deferred.reject(err.name + ':' + err.message);
        if (Array.isArray(result) && result.length > 0) {
            const initial = {
                purchase: [],
                brand: [],
                series: [],
                totalDriven: []
            }
            filters = result.reduce((res, cur) => {
                if(!res.purchase.includes(cur.purchaseDate))
                    res.purchase.push("'" + cur.purchaseDate + "'");
                if(!res.brand.includes(cur.sellcarBrand))
                    res.brand.push("'" + cur.sellcarBrand + "'");
                if(!res.series.includes(cur.sellcarSeries))
                    res.series.push("'" + cur.sellcarSeries + "'");
                if(!res.totalDriven.includes(cur.totalDriven))
                    res.totalDriven.push("'" + cur.totalDriven + "'");
                
                return res;
            }, initial);

            let condition = [];
            // condition.push("i.purchase_date in (" + filters.purchase.join(',') + ")");
            if(filters.brand.length > 0)
                condition.push("v.name in (" + filters.brand.join(',') + ")");
            if(filters.series.length > 0) 
                condition.push("b.name in (" + filters.series.join(',') + ")");
            if(filters.totalDriven.length > 0) 
                condition.push("i.mileage in (" + filters.totalDriven.join(',') + ")");
            let query = {
                page: 1,
                limit: 10,
                condition: condition,
                sort: []
            }
            Sellcar.getAll(query)
            .then((car) => {
                deferred.resolve({data:car});
            })
            .catch((err) => {
                deferred.resolve({data:[]});
            });
        } else {
            deferred.resolve({data:[]});
        }
    });

  return deferred.promise;
}

const getCars = param => {
  const deferred = Q.defer();
  //var phoneNum = param.phoneNumber;

  let arr_boughtCars = [];
  let arr_soldCars = [];
  let arr_reservedCars = [];
  let arr_filterCars = [];

  getBoughtCars(param).then(boughtCars => {
    arr_boughtCars = boughtCars.data;
    getSoldCars(param).then(soldCars => {
        arr_soldCars = soldCars.data;
        getReservedCars(param).then(reservedCars => {
          arr_reservedCars = reservedCars.data;
          getFilterCars(param).then(filterCars => {
            arr_filterCars = filterCars.data;
            deferred.resolve({bought: arr_boughtCars, sold: arr_soldCars, reserved: arr_reservedCars, filtered: arr_filterCars});
          });
        });
      });
  });

  return deferred.promise;
}

let service = {};

service.getAll = getAll;
service.getById = getById;
service.getProfile = getProfile;
service.create = create;
service.update = update;
service.delete = _delete;
service.saveToken = saveToken;
service.getToken = getToken;
service.setVerified = setVerified;
service.getChannelIDbyPhone = getChannelIDbyPhone;
service.setFeedback = setFeedback;
service.getBoughtCars = getBoughtCars;
service.getCars = getCars;
service.getSoldCars = getSoldCars;
service.getReservedCars = getReservedCars;
service.getFilterCars = getFilterCars;

module.exports = service;
