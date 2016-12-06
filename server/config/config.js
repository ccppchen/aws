var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    env = process.env.NODE_ENV || 'production';
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'loginexpress'
    },
    port: 3000,
    db: 'mongodb://127.0.0.1:27017/riki',
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
    port: 3000,
    db: 'mongodb://192.168.29.48:27017/blfed',
    db_name: 'blfed',
    session_secret: 'blfed',
  }
};

module.exports = config[env];
