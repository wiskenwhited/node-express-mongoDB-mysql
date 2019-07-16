if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

require('rootpath')();

var throng = require('throng');
var config = require('config');
var express = require('./core/express');
var chalk = require('chalk');
var logger = require('./helpers/logger');

/**
 * Connect to MongoDB and set global variable `db` to the connected database instanc
 */
global.mongo = require('mongoskin');
global.db = mongo.db(config.db.connectionString, { native_parser: true },{
          server: {  poolSize: 1 },
          socketOptions: { keepAlive: 1,  connectTimeoutMS: 10000 }});

const mysql = require('mysql');
global.mysql = mysql.createConnection(config.mysql);

/**
 * Start Express app
 */
function start(workerId, callback) {

  var app = express.init();

  // Start the app by listening on <port>
  app.listen(config.port, function () {

    // Logging initialization
    (!workerId || workerId === 1) && logger.info(chalk.green(
      "\n ------------------------------------------------------\r\n",
      "The server is running at " + config.host + "/\n",
      "Environment:\t\t" + process.env.NODE_ENV + "\n",
      "Port:\t\t\t" + config.port + "\n",
      "Database:\t\t" + config.db.connectionString + "\n",
      "------------------------------------------------------\n"));

    if (callback) callback(app, config);

  });

}

/**
 * Starting backend server with clusters
 * (No clustering on development)
 */
var webConcurrency = process.env.NODE_ENV === 'production' ? config.webConcurrency : 1;
throng({
  workers: webConcurrency,

  master: function() {
    logger.info(chalk.magenta('Master cluster started, setting up ' + webConcurrency + ' worker(s) ...'));
  },

  start: function(id) {
    logger.info(chalk.yellow('Worker #' + id + ' started'));
    start(id);

    process.on('SIGTERM', function () {
      logger.info(chalk.cyan('Worker ' + id + ' exiting ...'));
      process.exit();
    });
  }
});


