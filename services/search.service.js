const _ = require('lodash');
const Q = require('q');
const Sellcar = require('./sellcar.service');

const defaultValue = {
      'status': '不限',
      'carType': '不限',
      'carType.chName': '不限',
      'city': '全国',
      'brand': '不限',
      'brand.chName': '不限',
      'brand.series.chName': '不限',
      'series.chName': '不限',
      'emissionAmount': '不限',
      'emissionAmount.min': '0',
      'emissionAmount.max': '不限',
      'emissionLevel': '不限',
      'emissionLevel.emissionLevel': '不限',
      'carColor': '不限',
      'carColor.colorName': '不限',
      'gearshift': '不限',
      'capability': '不限',
      'capability.capability': '不限',
      'fuelOil': '不限',
      'fuelOil.oilName': '不限',
      'productCountry': '不限',
      'productCountry.countryName': '不限',
      'year': '不限',
      'year.min': '0',
      'year.max': '不限',
      'price': '不限',
      'price.min': '0',
      'price.max': '不限',
      'newPrice': '不限',
      'newPrice.min': '0',
      'newPrice.max': '不限',
      'totalDriven': '不限',
      'totalDriven.min': '0',
      'totalDriven.max': '不限'
    }

const parseQuery = query => {
    let page = 1;
    let limit = 10;
    let sort = [];

    let condition = [];
    let cityCondition = [];
    if(query.page) {
        page = parseInt(query.page);
    }
    if(query.limit) {
        limit = parseInt(query.limit);
    }
    if(query.price) {
        if(typeof query.price === 'object') {
            if(query.price.min && defaultValue['price.min'] != query.price.min)
                condition.push("i.price >= '" + parseFloat(query.price.min) + "'");
            if(query.price.max && defaultValue['price.max'] != query.price.max)
                condition.push("i.price <= '" + parseFloat(query.price.max) + "'");
        } else if(defaultValue['price'] != query.price) {
            condition.push("i.price = '" + parseFloat(query.price) + "'");
        }
    }
    if(query.newPrice) {
        if(typeof query.newPrice === 'object') {
            if(query.newPrice.min && defaultValue['newPrice.min'] != query.newPrice.min)
                condition.push("i.new_price >= '" + parseFloat(query.newPrice.min) + "'");
            if(query.newPrice.max && defaultValue['newPrice.max'] != query.newPrice.max)
                condition.push("i.new_price <= '" + parseFloat(query.newPrice.max) + "'");
        } else if(defaultValue['newPrice'] != query.newPrice) {
            condition.push("i.new_price = '" + parseFloat(query.newPrice) + "'");
        }
    }
    if(query.totalDriven) {
        if(typeof query.totalDriven === 'object') {
            if(query.totalDriven.min && defaultValue['totalDriven.min'] != query.totalDriven.min)
                condition.push("i.mileage >= '" + parseFloat(query.totalDriven.min) + "'");
            if(query.totalDriven.max && defaultValue['totalDriven.max'] != query.totalDriven.max)
                condition.push("i.mileage <= '" + parseFloat(query.totalDriven.max) + "'");
        } else if(defaultValue['totalDriven'] != query.totalDriven) {
            condition.push("i.mileage = '" + parseFloat(query.totalDriven) + "'");
        }
    }
    if(query.emissionAmount) {
        if(typeof query.emissionAmount === 'object') {
            if(query.emissionAmount.min && defaultValue['emissionAmount.min'] != query.emissionAmount.min)
                condition.push("i.car_emission_amount >= '" + parseFloat(query.emissionAmount.min) + "'");
            if(query.emissionAmount.max && defaultValue['emissionAmount.max'] != query.emissionAmount.max)
                condition.push("i.car_emission_amount <= '" + parseFloat(query.emissionAmount.max) + "'");
        } else if(defaultValue['emissionAmount'] != query.emissionAmount) {
            condition.push("i.car_emission_amount = '" + parseFloat(query.emissionAmount) + "'");
        }
    }
    if(query.city) {
        if(typeof query.city === 'object') {
            let cityString = JSON.stringify(query.city).replace(/\"/g, "'");
            cityCondition.push("ci.city in (" + cityString.substr(1, cityString.length-2) + ")");
        } else if(defaultValue["city"] != query.city) {
            cityCondition.push("ci.city like '%" + query.city + "%'");
        }
    }
    if(query._id) {
        if(typeof query._id === 'object') {
            let ids = JSON.stringify(query._id).replace(/\"/g, "'");
            condition.push("i.id in (" + ids.substr(1, ids.length-2) + ")");
        } else {
            condition.push("i.id = " + query._id);
        }
    }
    if(query.carType) {
        if(Array.isArray(query.carType)) {
            let types = JSON.stringify(query.carType).replace(/\"/g, "'");
            condition.push("ct.type_name in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.carType === 'object') {
            value = query.carType.chName;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("ct.type_name in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["carType.chName"] != value) {
                condition.push("ct.type_name = '" + value + "'")
            }
        } else if(defaultValue["carType"] != query.carType) {
            condition.push("ct.type_name = '" + query.carType + "'");
        }
    }
    if(query.emissionLevel) {
        if(Array.isArray(query.emissionLevel)) {
            let types = JSON.stringify(query.emissionLevel).replace(/\"/g, "'");
            condition.push("i.car_emission in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.emissionLevel === 'object') {
            value = query.emissionLevel.emissionLevel;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("i.car_emission in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["emissionLevel.emissionLevel"] != value) {
                condition.push("i.car_emission = '" + value + "'")
            }
        } else if(defaultValue["emissionLevel"] != query.emissionLevel) {
            condition.push("i.car_emission = '" + query.emissionLevel + "'");
        }
    }
    
    if(query.carColor) {
        if(Array.isArray(query.carColor)) {
            let types = JSON.stringify(query.carColor).replace(/\"/g, "'");
            condition.push("vc.color in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.carColor === 'object') {
            value = query.carColor.colorName;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("vc.color in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["carColor.colorName"] != value) {
                condition.push("vc.color = '" + value + "'")
            }
        } else if(defaultValue["carColor"] != query.carColor) {
            condition.push("vc.color = '" + query.carColor + "'");
        }
    }

    if(query.gearshift) {
        if(defaultValue["gearshift"] != query.gearshift) {
            condition.push("i.gear_shift = '" + query.gearshift + "'");
        }
    }

    if(query.capability) {
        if(Array.isArray(query.capability)) {
            let types = JSON.stringify(query.capability).replace(/\"/g, "'");
            condition.push("i.car_capability in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.capability === 'object') {
            value = query.capability.capability;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("i.car_capability in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["capability.capability"] != value) {
                condition.push("i.car_capability = '" + value + "'")
            }
        } else if(defaultValue["capability"] != query.capability) {
            condition.push("i.car_capability = '" + query.capability + "'");
        }
    }

    if(query.productCountry) {
        if(Array.isArray(query.productCountry)) {
            let types = JSON.stringify(query.productCountry).replace(/\"/g, "'");
            condition.push("i.car_country in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.productCountry === 'object') {
            value = query.productCountry.countryName;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("i.car_country in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["productCountry.countryName"] != value) {
                condition.push("i.car_country = '" + value + "'")
            }
        } else if(defaultValue["productCountry"] != query.productCountry) {
            condition.push("i.car_country = '" + query.productCountry + "'");
        }
    }

    if(query.fuelOil) {
        if(Array.isArray(query.fuelOil)) {
            let types = JSON.stringify(query.fuelOil).replace(/\"/g, "'");
            condition.push("cf.fuel_name in (" + types.substr(1, types.length-2) + ")");
        } else if(typeof query.fuelOil === 'object') {
            value = query.fuelOil.oilName;
            if(Array.isArray(value)) {
                let types = JSON.stringify(value).replace(/\"/g, "'");
                condition.push("cf.fuel_name in (" + types.substr(1, types.length-2) + ")");
            } else if(defaultValue["fuelOil.oilName"] != value) {
                condition.push("cf.fuel_name = '" + value + "'")
            }
        } else if(defaultValue["fuelOil"] != query.fuelOil) {
            condition.push("cf.fuel_name = '" + query.fuelOil + "'");
        }
    }
    if(query.sort) {
        if(query.sort.price) {
            if(query.sort.price == 'asc')
                sort.push("i.price ASC");
            else
                sort.push("i.price DESC");
        }
        if(query.sort.totalDriven) {
            if(query.sort.totalDriven == 'asc')
                sort.push("i.mileage ASC");
            else
                sort.push("i.mileage DESC");
        }
        if(query.sort.purchasedYear) {
            if(query.sort.purchasedYear == 'asc')
                sort.push("i.purchase_date ASC");
            else
                sort.push("i.purchase_date DESC");
        }
        if(query.sort.uploadedDate) {
            if(query.sort.uploadedDate == 'asc')
                sort.push("i.reg_date ASC");
            else
                sort.push("i.reg_date DESC");
        }
    }
    if(query.query) {
        condition.push("(i.vendro like '%" + query.query + "%' or i.brand like '%" + query.query + "%')");
    }
    if(query.brand) {
        if(typeof query.brand === 'object') {
            if(query.brand.chName && defaultValue["brand.chName"] != query.brand.chName) {
                condition.push("i.vendor like '%" + query.brand.chName + "%'");
            }
        } else if(defaultValue["brand"] != query.brand) {
            condition.push("i.vendor like '%" + query.brand + "%'");
        }
    }
    if(query.series) {
        if(typeof query.series === 'object') {
            if(query.series.chName && defaultValue["brand.chName"] != query.series.chName) {
                condition.push("i.brand like '%" + query.series.chName + "%'");
            }
        } else if(defaultValue["series"] != query.series) {
            condition.push("i.brand like '%" + query.series + "%'");
        }
    }
    
    condition.push("i.drop_status = 0");
    
    return {
        page: page,
        limit: limit,
        condition: condition,
        sort: sort,
        city: cityCondition
    };
}

function get(query) {
    query = parseQuery(query);
    console.log('*****************************Search Query******************************');
    console.log(query);

    var deferred = Q.defer();

    Sellcar.getAll(query)
        .then(function (cars) {
            deferred.resolve({
                success: true,
                page: query.page,
                limit: query.limit,
                total: cars.length,
                data: cars
            })
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

var service = {};

service.get = get;

module.exports = service;
