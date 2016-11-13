var express = require('express');
var glob = require('glob');
var ejs = require('ejs');

var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
// session
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// mongodb
var mongoose = require('mongoose');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  // 设置程序和资源文件目录
  app.set('views', config.root + '/client');
  app.use(express.static(config.root + '/public'));
  // 设置模版引擎
  app.set('view engine', 'html');
  app.engine('.html', require('ejs').__express);

  app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(session({
      secret: config.session_secret,
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({
        db: 'riki',
        collection: 'sessions',
        autoRemove: 'interval',
        autoRemoveInterval: 5,
        username: 'riki',
        password: 'riki'
      }),
      cookie:{
        maxAge:1000*60*10 //过期时间设置(单位毫秒) 十分钟有效期
      }
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());
  // 全局方法
  global.dbHandel = require('../util/dbHandel');
  //设置跨域访问
  app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By",' nginx');
      next();
  });

  var controllers = glob.sync(config.root + '/server/api/**/*.controller.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });
  // require('../api/user/user.controller')(app);
  // 连接mongodb数据库
  mongoose.connect(config.db, config.options, function (err) {
    if (err) {
      console.log('connect to %s error: ', err.message);
      process.exit(1);
    }
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
