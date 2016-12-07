var express = require('express'),
  router = express.Router(),
  User = require('./user.service'),
  // ccap = require('../../util/ccap'),
  code = null,
  auths = global.dbHandel.getModel('auths')

var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser('my secret here'));

module.exports = function(app) {
  app.use('/', router);
};

// 登录拦截器
router.get('*', function(req, res, next) {
  var url = req.path;
  if (url != "/login" && !req.session.user && url != "/reg") {
    // return res.redirect("/login");
  }
  next();
});
router.get('/', function(req, res) {
  var url = req.hostname;
  var path = req.path;
  res.render('index', {
    title: 'Generator-Express MVC',
    url: url + path
  });
});
router.get('/login', function(req, res) {
  if (req.session.user) {
    res.render('home', {
      title: '主页',
      userName: req.session.user
    });
  } else {
    res.render('login', {
      title: '用户登录'
    });
  }

});

// router.get('/capt/:random', function(req, res) {
//   var buff = code = ccap.ccap();
//   res.end(buff[1]);
// });
router.get('/reg', function(req, res) {
  res.render('reg', {
    title: '注册'
  });
});


router.get('/auth', function(req, res) {
  if (req.headers.token) {
    auths.findOne({ _id: req.headers.token }, function(err, data){
      if (data) {
        res.json({"user": data.user, "status": 1})
        return;
      }else if(err) {
        return handleError(res, req)
      }else {
        res.json({ "status": 0 })
      }
    })
  }else {
    res.json({ "status": 0 })
  }
});
router.post('/forget', function(req, res){
  auths.remove({ user: req.body.user }, function(err, data) {
    if (err) {
      return handleError(res, req)
    }else {
      res.json({ "msg": 'success', "status": 1 })
    }
  })
});
function newDate() {
  var d = new Date().getTime();
  return new Date(d + 1000*60*60);
}
router.post('/login', function(req, res) {
  var Uname = req.body.username;
  User.getUserOne(Uname, function(err, doc) {
    if (err) {
      res.sendStatus(500);
    } else if (!doc) {
      res.json({"msg": "用户名不存在", "status": 0});
    } else if (req.body.password !== doc.password) {
      res.json({"msg": "密码不正确", "status": 0});
    } else {
      req.session.user = doc.name;
      auths.create({
        user: doc.name,
        expires: newDate()
      }, function(err, data) {
        // auths.findOne({ user: doc.name }, function(err, data) {
        //   res.json({"msg": "success", "status": 1, "token": data._id});
        // });
        if (err) {
          return handleError(res, req)
        };
        console.log('登录成功');
        res.json({"msg": "success", "status": 1, "token": data._id});
      });

    }
  });


});
router.post('/reg', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var clientCode = req.body.code;

  if (username.length < 6) {
    // return res.send('用户名不能少于6位！');
    return res.json({"msg": "用户名不能少于6位！", "status": 0});
  };
  if (password !== confirmPassword) {
    // return res.send('密码不一致！');
    return res.json({"msg": "密码不一致！", "status": 0});
  };
  if (confirmPassword.length < 6) {
    // return res.send('密码不能少于6位！');
    return res.json({"msg": "密码不能少于6位！", "status": 0});
  };

  if (code[0].length < 4 || clientCode.toLowerCase() != code[0].toLowerCase()) {
    // return res.send('验证码不正确');
    return res.json({"msg": "验证码不正确", "status": 0});
  };

  User.getUserByQuery(username, function(err, user) {
    if (err) res.send(500);

    if (user.length > 0) {
      // return res.send('用户已存在！');
      return res.json({"msg": "用户已存在！", "status": 0});
    }
    User.newAndSave(username, password, function(err, doc) {
      if (err) {
        res.send(500);
      } else {
        // res.sendStatus(200);
        res.json({"msg": "success", "status": 1});
      }
    });

  });

});
router.get('/home', function(req, res) {
  if (req.session.user) {
    res.render('home', {
      title: '主页',
      userName: req.session.user
    });
  } else {
    res.redirect('/login');
  };
});
router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

