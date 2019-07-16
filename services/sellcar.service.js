var Q = require('q');
db.bind('sellcars');

const car_query = `select i.id as id, i.vehicle_number as uniqueId, 
        i.merchant_id as sellerId, m.principal_number as sellerPhone, m.merchant_name as sellerName,
        '' as brand_id, '' as brand_logo, i.vendor as brand_chName, '' as brand_enName, '' as brand_chPinyin,
        '' as series_seriesLogo, i.brand as series_chName, '' as series_chPinyin,
        ct.logo as carType_logo, ct.type_name as carType_chName,
        vc.color as carColor_colorName, '' as carColor_colorRGB,
        i.gear_shift as gearshift,
        i.car_country as productCountry_countryName,
        i.car_fuel as fuelOil_oilName,
        i.car_capability as capability_capability,
        i.car_emission as emissionLevel_emissionLevel,
        i.car_emission_amount as emissionAmount,
        i.price as price,
        i.new_price as newPrice,
        i.purchase_date as purchaseDate,
        i.mileage as totalDriven,
        i.reg_date as marketingStartDate,
        i.remark as sellerDescription,
        "在商场" as status,
        i.year_careful_period as insuranceMsg_msg1,
        i.jqx as insuranceMsg_msg2,
        i.insurance_expire as insuranceMsg_msg3,
        i.transfer_count as insuranceMsg_msg4,
        i.vehicle_name as car_title
        from tms_inventory i inner join tms_merchant m on i.merchant_id = m.id  
        inner join tms_car_type ct on i.car_type_id = ct.id 
        inner join tms_vehicle_color vc on i.color_id = vc.id`;

const formatResponse = cars => {
    let data = [];
    cars.forEach(v => {
        let car = {};
        for (let k in v) {
            let value = v[k];
            let ks = k.split('_');
            if(ks.length == 2) {
                if(!car[ks[0]]) {
                    car[ks[0]] = {};
                }
                if(ks[1] == 'id')
                    ks[1] = '_id';
                car[ks[0]][ks[1]] = value;
            } else {
                if(k == 'id')
                    k = '_id';
                car[k] = value;
            }
        }
        data.push(car);
    });
    return data;
}

const getCarImages = cars => {
    return Promise.all(cars.map(car => {
        let result = [];
        return new Promise((resolve, reject) => {
            const query = "select bp.photo as imagePath, bp.name as imageDesc from tms_inventory_body_photos bp where bp.inventory_id = " + car._id;
            mysql.query(query, (err, data) => {
                if (err) {
                    return reject(err);
                }
                if (data.length > 0) {
                    data.map((d, i) => {
                        d.imagePath = 'http://47.93.99.187' + d.imagePath;
                        d.imageDesc = d.imageDesc || '照片 ' + (i+1);
                        
                        result.push(d);
                    });
                }

                const query1 = "select ip.photo as imagePath, ip.name as imageDesc from tms_inventory_inside_photos ip where ip.inventory_id = " + car._id;
                mysql.query(query1, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.length > 0) {
                        res.map((d, i) => {
                            d.imagePath = 'http://47.93.99.187' + d.imagePath;
                            d.imageDesc = d.imageDesc || '照片 ' + (i+1);
                            result.push(d);
                        });
                    }
                    
                    const query2 = "select ep.photo as imagePath, ep.name as imageDesc from tms_inventory_engine_photos ep where ep.inventory_id = " + car._id;
                    mysql.query(query2, (err, r) => {
                        if (err) {
                            return reject(err);
                        }
                        if (r.length > 0) {
                            r.map((d, i) => {
                                d.imagePath = 'http://47.93.99.187' + d.imagePath;
                                d.imageDesc = d.imageDesc || '照片 ' + (i+1) ;
                                result.push(d);
                            });
                        }
                        
                        car.carImages = result;
                        return resolve(car);
                    });
                });
            });
        });
    }));
}

const getMerchantsByCities = condition => {
    return new Promise((resolve, reject) => {
        let query = `SELECT m.id as merchant_id, ci.* FROM tms_merchant m
          inner join tms_market mk on m.market_id = mk.id
          inner join tms_cities ci on mk.city_id = ci.id`;
        if(condition && condition.city && condition.city.length > 0) {
            query = query + ' where ' + condition.city[0];
        }
        mysql.query(query, (err, merchants) => {
            if (err) {
                reject(err.name + ': ' + err.message);
            } else {
                resolve(merchants);
            }
        });
    });
}

const getAll = query => {
    const deferred = Q.defer();

    let queryString = car_query;

    getMerchantsByCities(query).then(merchants => {
        if (merchants.length == 0) {
            return deferred.resolve([]);
        }
        let merchantIds = merchants.map(mer => mer.merchant_id);
        queryString += " where i.merchant_id in (" + merchantIds.join(',') + ")";
        if(query) {
            let skip = (query.page-1)*query.limit;
            if(query.condition.length > 0) {
                queryString += " and " + query.condition.join(' and ');
            }
            if(query.sort.length > 0) {
                queryString += " order by " + query.sort.join(', ');
            }
            queryString += " limit " + skip + ", " + query.limit;
        }
        console.log(queryString);
        mysql.query(queryString, (err, cars) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                cars = cars.map(car => {
                    let merchant = merchants.filter(m => {
                        return m.merchant_id == car.sellerId;
                    });
                    _merchant = merchant[0];
                    car.currentCarPlace = _merchant.city;
                    car.city_id = _merchant.id;
                    car.city_chName = _merchant.city;
                    car.city_chPinyin = _merchant.city_en;

                    return car;
                })
                cars = formatResponse(cars);
                getCarImages(cars).then(data => {
                    deferred.resolve(data);
                })
            }
        });
    });
    return deferred.promise;
}

let service = {};
service.getAll = getAll;

module.exports = service;
