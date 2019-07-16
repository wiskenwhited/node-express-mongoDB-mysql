const Q = require('q');

const getAll = () => {
    let deferred = Q.defer();
    const query = "select id as _id, question as chQuestion, answer as chAnswer from yc_faqs";
    mysql.query(query, (err, faqs) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(faqs);
    });

    return deferred.promise;
}

const getById = _id => {
    let deferred = Q.defer();
    const query = "select id as _id, question as chQuestion, answer as chAnswer from yc_faqs where id = " + _id;
    mysql.query(query, (err, faq) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (faq.length > 0) {
            deferred.resolve(faq[0]);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

const create = data => {
    let deferred = Q.defer();
    let query = "select * from yc_faqs where question = '" + data.chQuestion + "'";
    mysql.query(query, (err, faq) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if(faq.length > 0) {
            deferred.reject('FAQ "' + faqParam.chQuestion + '" is already taken');
        } else {
            const row = {
                question: data.chQuestion,
                answer: data.chAnswer
            }
            query = "insert into yc_faqs set ?";
            mysql.query(query, row, err => {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
        }
    });

    return deferred.promise;
}

const update = (_id, data) => {
    let deferred = Q.defer();
    const updateFAQ = () => {
        // fields to update
        const row = {
            question: data.chQuestion,
            answer: data.chAnswer
        };
        let query = "update yc_faqs set ? where id = " + _id;
        mysql.query(query, row, (err, doc) => {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    }

    let query = "select * from yc_faqs where id = " + _id;
    mysql.query(query, (err, faqs) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (faqs.length > 0) {
            if (faqs[0].question !== data.chQuestion) {
                // faq name has changed so check if the new faq name is already taken
                query = "select * from yc_faqs where question = '" + data.chQuestion + "'";
                mysql.query(query, (err, faqs) => {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    
                    if(faqs.length > 0) {
                        deferred.reject('FAQ "' + data.chQuestion + '" is already taken');
                    } else {
                        updateFAQ();
                    }
                });
            } else {
                updateFAQ();
            }
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

const _delete = _id => {
    let deferred = Q.defer();

    const query = "delete from yc_faqs where id = " + _id;
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
