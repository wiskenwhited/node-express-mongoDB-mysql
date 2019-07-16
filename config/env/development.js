module.exports = {

  db: {
    connectionString: process.env.YOUCHI_MONGO_URI || "mongodb://127.0.0.1:27017/youchie"
  },
  mysql: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tms'
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {}
  }

};
