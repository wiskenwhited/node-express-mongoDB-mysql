const Q = require('q');

const getType = () => {
    const deferred = Q.defer();
    const query = "select logo, type_name as chName from tms_car_type";
    mysql.query(query, (err, types) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(types);
    });
    return deferred.promise;
}

const getColor = () => {
    const deferred = Q.defer();
    const query = "select color as colorName, '' as colorRGB from tms_vehicle_color";
    mysql.query(query, (err, colors) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(colors);
    });
    return deferred.promise;
}

const getProductCountry = () => {
    const deferred = Q.defer();
    const query = "select country_name as countryName from tms_car_country";
    mysql.query(query, (err, countries) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(countries);
    });
    return deferred.promise;
}

const getFuelOil = () => {
    const deferred = Q.defer();
    const query = "select fuel_name as oilName from tms_car_fuel";
    mysql.query(query, (err, fuels) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(fuels);
    });
    return deferred.promise;
}

const getCapability = () => {
    const deferred = Q.defer();
    const query = "select capability from tms_car_capability";
    mysql.query(query, (err, capabilities) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(capabilities);
    });
    return deferred.promise;
}

const getEmission = () => {
    const deferred = Q.defer();
    const query = "select emission_level as emissionLevel from tms_car_emission";
    mysql.query(query, (err, emissions) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(emissions);
    });
    return deferred.promise;
}

module.exports = {
    getAll() {
        const deferred = Q.defer();
        let data = {};
        getType().then(types => {
            types.push({
                logo: "",
                chName: "不限"
            });
            data.type = types;

            getColor().then(colors => {
                data.color = colors;
                colors.push({
                    colorName: "不限",
                    colorRGB: ""
                    
                });
                data.gearshift = [];

                getProductCountry().then(countries => {
                    countries.push({
                        countryName: "不限"
                    });
                    data.productCountry = countries;

                    getFuelOil().then(fuels => {
                        fuels.push({
                            oilName: "不限"
                        });
                        data.fuelOil = fuels;

                        getCapability().then(capabilities => {
                            capabilities.push({
                                capability: "不限"
                            });
                            data.capability = capabilities;

                            getEmission().then(emissions => {
                                emissions.push({
                                    emissionLevel: "不限"
                                });
                                data.emission = emissions;

                                deferred.resolve([data]);
                            }).catch(err => deferred.reject(err));

                        }).catch(err => deferred.reject(err));

                    }).catch(err => deferred.reject(err));

                }).catch(err => deferred.reject(err));

            }).catch(err => deferred.reject(err));

        }).catch(err => deferred.reject(err));
        return deferred.promise;
    }
};
