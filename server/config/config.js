var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    env = process.env.NODE_ENV || 'development';
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'loginexpress'
    },
    port: 3000,
    db: 'mongodb://10.199.5.99:27017/riki',
    db_name: 'riki',
    session_secret: 'riki',
    options: {
      user: 'riki',
      pass: 'riki'
    }
    // seedDB: true
  },

  test: {
    root: rootPath,
    app: {
      name: 'loginexpress'
    },
    port: 3000,
    db: 'mongodb://127.0.0.1:27017/riki',
    db_name: 'riki',
    session_secret: 'riki',
  },

  production: {
    root: rootPath,
    app: {
      name: 'loginexpress'
    },
    port: 80,
    db: 'mongodb://127.0.0.1:27017/fullstack-dev',
    db_name: 'riki',
    session_secret: 'riki',
  }
};

module.exports = config[env];
