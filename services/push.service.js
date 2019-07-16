const config = require('config');
const Q = require('q');
const userService = require('services/user.service');
const _ = require('lodash');
const BaiduPush = require('baidu_push');
const Pushy = require('pushy');

const add = request => {
    const deferred = Q.defer();

    if (request.requestType === '降价通知') {
        userService.getChannelIDbyPhone(request.userPhone).then(channel_id => {
            const tagName = request.sellcarUDID + '_dis';
            let query = "select * from yc_push where tagName = '" + tagname + "'";
            mysql.query(query, (err, tags) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (tags.length > 0) {
                    let tag = tags[0];

                    let tagArr = tag.channel_ids.split(';;;');
                    tagArr.push(channel_id);
                    tag.channel_ids = _.uniq(tagArr.channel_ids).join(';;;');
                    query = "update yc_push set ? where id = " + tag.id;
                    mysql.query(query, tag, err => {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve();
                    });
                } else {
                    const newPush = {
                        tagName: tagName,
                        channel_ids: channel_id
                    }
                    query = "insert into yc_push set ?";
                    mysql.query(query, newPush, err => {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve();
                    });
                }
            });
        }).catch(err => deferred.reject(err.name + ': ' + err.message));
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};

const addPrice = request => {
    const deferred = Q.defer();

    const phone = request.userPhone;
    const car_id = request.sellcarUDID;
    const price = request.price;
    let query = "select * from yc_notification where phone = '" + phone + "' and cond = 1";
    mysql.query(query, (err, rows) => {
        if(err) {
            deferred.reject(err.name + ':' + err.message);
        } else if(rows.length > 0) {
            let row = rows[0];
            let prices = JSON.parse(row.price);

            let car = prices.find( p => { return p.carId === car_id });
            if(car) {
                prices.map(car => {
                    if(car.carId === car_id)
                        car.price = price;
                });
            } else {
                prices.push({
                    carId: car_id,
                    price: price
                });
            }
            row.price = JSON.stringify(prices);

            query = "update yc_notification set ? where id = " + row.id;
            mysql.query(query, row, (err, doc) => {
                if(err) {
                    console.log(err);
                    deferred.reject(err.name + ':' + err.message);
                } else {
                    deferred.resolve();
                }
            });
        } else {
            const data = {
                phone: phone,
                cond: 1,
                price: JSON.stringify([{carId: car_id, price: price}])
            };
            query = "insert into yc_notification set ?";
            mysql.query(query, data, (err, doc) => {
                if(err) {
                    deferred.reject(err.name + ':' + err.message);
                } else {
                    deferred.resolve();
                }
            })
        }
    });

    return deferred.promise;
};

const addFilter = param => {
    const deferred = Q.defer();
    const phone = param.phoneNum;
    const set = {
        phone: param.phoneNum,
        cond: param.cond,
        filter: JSON.stringify(param.filter),
        carIds: JSON.stringify([])
    };
    let query = "select * from yc_notification where phone = '" + phone + "' and cond = 2";
    mysql.query(query, (err, rows) => {
        if(err) {
            deferred.reject(err.name + ':' + err.message);
        } else if(rows.length > 0) {
            query = "update yc_notification set ? where id = " + rows[0].id;
            mysql.query(query, set, (err, doc) => {
                if(err) {
                    deferred.reject(err.name + ':' + err.message);
                } else {
                    deferred.resolve();
                }
            });
        } else {
            query = "insert into yc_notification set ?";
            mysql.query(query, set, (err, doc) => {
                if(err) {
                    deferred.reject(err.name + ':' + err.message);
                } else {
                    deferred.resolve();
                }
            });
        }
    });

    return deferred.promise;
};

const remove = request => {
    const deferred = Q.defer();
    if (request.requestType === '降价通知') {
        userService.getChannelIDbyPhone(request.userPhone).then(channel_id => {
            const tagName = request.sellcarUDID + '_dis';
            let query = "select * from yc_push where tagName = '" + tagname + "'";
            mysql.query(query, (err, tags) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (tags.length > 0) {
                    let tag = tags[0];
                    let tagArr = tag.channel_ids.split(';;;');
                    tag.channel_ids = _.without(tagArr, channel_id).join(';;;');
                    query = "update yc_push set ? where id = " + tag.id;
                    mysql.query(query, tag, err => {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            });
        }).catch(err => deferred.reject(err.name + ': ' + err.message));
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};

const pushDiscountMsg = uuid => {
    const tagname = uuid + '_dis';
    return pushMsg(tagname, '降价通知', '您关注的车已经降价了。 车源号是' + uuid);
};

const pushSoldMsg = uuid => {
    var tagname = uuid + '_dis';
    return pushMsg(tagname, '出售通知', '您关注的车已经出售了。 车源号是' + uuid);
};

const pushPriceMessage = (car_id, discounted_price) => {
    const deferred = Q.defer();
    deferred.resolve();

    return deferred.promise;
};

function pushFilterMessage() {
    var deferred = Q.defer();
    deferred.resolve('OK');

    return deferred.promise;
};

function sendNotification(udids, title, desc, noti) {
  var deferred = Q.defer();
      if (config.push.main === 'pushy') {
        var pushyAPI = new Pushy(config.push.pushy.secret_api_key);
        var data = {message: noti};
        var options = {
          notification: {
            badge: 1,
            body: desc
          }
        };
        pushyAPI.sendPushNotification(data, udids, options, function(err, id) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          console.log('Push sent successfully! (ID: ' + id + ')');
          deferred.resolve();
        });
      } else {
        var sender = new BaiduPush(config.push.baidu);
        sender.pushBatchDevice({
          channel_ids: JSON.stringify(udids),
          msg_type: 1,
          msg: JSON.stringify({
            title: title,
            description: desc
          })
        }).then(function(msg) {
          console.log(msg);
          deferred.resolve();
        }).catch(function(err) {
          deferred.reject(err.name + ': ' + err.message);
        });
      }
  return deferred.promise;
};

const pushMsg = (tag, title, desc) => {
    const deferred = Q.defer();
    query = "select * from yc_push where tagName = '" + tag + "'";
    mysql.query(query, (err, tags) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (tags.length > 0) {
            let tag = tags[0];
            if (config.push.main === 'pushy') {
                var pushyAPI = new Pushy(config.push.pushy.secret_api_key);
                var data = { message: desc };
                var options = {
                    notification: {
                        badge: 1,
                        body: desc
                    }
                };
                pushyAPI.sendPushNotification(data, tag.channel_ids.split(';;;'), options, (err, id) => {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    console.log('Push sent successfully! (ID: ' + id + ')');
                    deferred.resolve();
                });
            } else {
                var sender = new BaiduPush(config.push.baidu);
                sender.pushBatchDevice({
                    channel_ids: JSON.stringify(tag.channel_ids.split(';;;')),
                    msg_type: 1,
                    msg: JSON.stringify({
                        title: title,
                        description: desc
                    })
                }).then(msg => {
                    console.log(msg);
                    deferred.resolve();
                }).catch(err => deferred.reject(err.name + ': ' + err.message));
            }
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

let service = {};

service.pushDiscountMsg = pushDiscountMsg;
service.pushPriceMessage = pushPriceMessage;
service.pushSoldMsg = pushSoldMsg;
service.add = add;
service.addPrice = addPrice;
service.addFilter = addFilter;
service.remove = remove;
service.sendNotification = sendNotification;
service.pushFilterMessage = pushFilterMessage;

module.exports = service;
