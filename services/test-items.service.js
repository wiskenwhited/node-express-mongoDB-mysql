const Q = require('q');

const getAll = () => {
    const deferred = Q.defer();
    const query = "select c.id as _id, c.category as testCategory, i.item as testItemName from yc_test_categories c left join yc_test_items i on c.id = i.category_id order by c.id";
    mysql.query(query, (err, tests) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        let data = [];
        let category = {};
        let items = [];
        tests.forEach(test => {
            if(category._id == test._id) {
                items.push({
                    testItemName: test.testItemName,
                    checked: false
                });
            } else {
                if(category._id) {
                    category.categoryItems = items;
                    data.push(category);
                }
                category = {
                    _id: test._id,
                    testCategory: test.testCategory
                };
                items = [];
                if(test.testItemName) {
                    items.push({ 
                        testItemName: test.testItemName,
                        checked: false
                    });
                }
            }
        });
        category.categoryItems = items;
        data.push(category);

        deferred.resolve(data);
    });
    return deferred.promise;
}

const create = testParam => {
    const deferred = Q.defer();
    let query = "select * from yc_test_categories where category = '" + testParam.testCategory + "'";
    mysql.query(query, (err, tests) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if(tests.length > 0) {
            deferred.reject(testParam.testCategory + ' category is already taken');
        } else {
            const category = {
                category: testParam.testCategory
            }
            query = "insert into yc_test_categories set ?";
            mysql.query(query, category, (err, doc) => {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                } else {
                    deferred.resolve([{
                        testCategory: testParam.testCategory,
                        _id: doc.insertId
                    }]);
                }
            });
        }
    });

    return deferred.promise;
}

const multiInsert = (categoryId, items, i, callback) => {
    if(i >= items.length) {
        return callback(null);
    }

    const item = items[i];
    const newItem = {
        item: item.testItemName,
        category_id: categoryId
    }
    const query = "insert into yc_test_items set ?";
    mysql.query(query, newItem, err => {
        if(err)
            return callback(err);
        
        multiInsert(categoryId, items, i+1, callback);
    });
}

const update = (_id, testParam) => {
    const deferred = Q.defer();
    let query = "select * from yc_test_categories where id = " + _id + " or category = '" + testParam.testCategory + "'";
    mysql.query(query, (err, tests) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else if(tests.length > 1) {
            deferred.reject(testParam.testCategory + ' category is already taken')            
        } else if(tests.length < 1) {
            deferred.reject("invalid update");
        } else {
            const updateCategory = {
                category: testParam.testCategory
            }
            query = "update yc_test_categories set ? where id = " + _id;
            mysql.query(query, updateCategory, err => {
                if(err)
                    deferred.reject(err.name + ': ' + err.message);
                else {
                    query = "delete from yc_test_items where category_id = " + _id;
                    mysql.query(query, err => {
                        multiInsert(_id, testParam.categoryItems, 0, err => {
                            deferred.resolve();
                        });
                    })
                }
            });
        }
    });

    return deferred.promise;
}

const _delete = _id => {
    const deferred = Q.defer();
    let query = "delete from yc_test_items where category_id = " + _id;
    mysql.query(query, err => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            query = "delete from yc_test_categories where id = " + _id;
            mysql.query(query, err => {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                } else {
                    deferred.resolve();
                }
            });
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
