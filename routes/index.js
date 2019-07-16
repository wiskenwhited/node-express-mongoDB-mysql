var authHelper = require('../helpers/auth-helper');

module.exports = function(app) {
  app.use('/search', require('../controllers/search.controller'));
  app.use('/managers', require('../controllers/managers.controller'));
  app.use('/brands', require('../controllers/brands.controller'));
  app.use('/carTypes', require('../controllers/car-type.controller'));
  app.use('/areas', require('../controllers/areas.controller'));
  app.use('/uploader', authHelper.checkAuth(), require('../controllers/uploads.controller'));
  app.use('/users', require('../controllers/users.controller'));
  app.use('/sellcars', require('../controllers/sellcars.controller'));
  app.use('/buyer', require('../controllers/buyer-requests.controller'));
  app.use('/seller', require('../controllers/seller-requests.controller'));
  app.use('/testItems', require('../controllers/test-items.controller'));
  app.use('/faqs', require('../controllers/faqs.controller'));
  app.use('/suggestiveCar', require('../controllers/suggestive-car.controller'));
  app.use('/auth', require('../controllers/auth.controller'));
  app.use('/notification', require('../controllers/notification.controller'));
  app.use('/feedback', require('../controllers/feedback.controller'));
  app.use('/test', require('../controllers/test.controller'));
};
