var express = require('express'),
  router = express.Router(),
  app = express(),
  vue_home = global.dbHandel.getModel('vues'),
  products = global.dbHandel.getModel('products'),
  suggests = global.dbHandel.getModel('suggests'),
  restaurants = global.dbHandel.getModel('restaurants'),
  allTableDatas = global.dbHandel.getModel('allTableDatas'),
  auths = global.dbHandel.getModel('auths');

module.exports = function(app) {
  app.use('/', router);
}

// res.json([{ "title": "肖申克的救赎" }, { "title": "肖申克的救赎" }]);
// sort: 1代表升序，-1降序 $natural是指自然排序，按照加入时间排序
// req.query适合GET，req.body适合body

router.get('/vue', function(req, res){
  res.render('vue');
})
router.get('/vue/vuetb', function(req, res) {
  vue_home.find({}, null, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    return res.status(200).json(resdata[0]);
  });
});
router.get('/vue/product', function(req, res) {

  products.find({}, null, { limit: parseInt(req.query.limit), skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit), sort: { $natural: 1 } }, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    return res.status(200).json(resdata);
  });
});

router.get('/vue/sug', function(req, res) {
  var query = (req.query.searchText).toLowerCase();
  suggests.find({
    $or: [{
      result: {$regex : query}
    }]
  }, {
    _id: 0,
    result: 1
  }, { limit: 10 }, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    return res.status(200).json(resdata);
  });
});

router.get('/vue/eleme', function(req, res) {

  restaurants.find({},
    null,
    {
      limit: parseInt(req.query.limit),
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      sort: { $natural: 1 }
    }, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    return res.status(200).json(resdata);
  });
});

// 引导页接口： 新增页面接口
router.post('/newPage', function(req, res) {
  allTableDatas.create({
    type: req.body.type,
    version: req.body.version,
    date: new Date(),
    value: req.body.value,
    fd: req.body.fd,
    pm: req.body.pm,
    url: req.body.url
  }, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    res.status(200).json(resdata);
  })
});

// 引导页接口： 删除页面接口
router.post('/delPage', function(req, res) {
  if (req.headers.token) {
    auths.findOne({ _id: req.headers.token }, function(err, data){
      if (data) {
        allTableDatas.remove({
          _id: req.body.id
        }, function(err, resdata) {
          if (err) {
            return handleError(res, req)
          };
          res.json({ "status": 1 })
        })
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

  // allTableDatas.remove({
  //   _id: req.body.id
  // }, function(err, resdata) {
  //   if (err) {
  //     return handleError(res, req)
  //   };
  //   res.status(200).json(resdata);
  // })
});

// 引导页接口： 编辑页面接口
router.post('/editPage', function(req, res) {
  if (req.headers.token) {
    auths.findOne({ _id: req.headers.token }, function(err, data){
      if (data) {
        allTableDatas.findById(req.body.id, function(err, tank) {
          if (err) {
            return handleError(res, req)
          }
          tank.type = req.body.type;
          tank.version = req.body.version;
          tank.date = new Date();
          tank.value = req.body.value;
          tank.fd = req.body.fd;
          tank.pm = req.body.pm;
          tank.url = req.body.url;

          tank.save(function(err) {
            if (err) return handleError(err);
            res.send(tank);
            res.status(200);
          });

        })

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

  // allTableDatas.findById(req.body.id, function(err, tank) {
  //   if (err) {
  //     return handleError(res, req)
  //   }
  //   tank.version = req.body.version;
  //   tank.date = new Date();
  //   tank.value = req.body.value;
  //   tank.fd = req.body.fd;
  //   tank.pm = req.body.pm;
  //   tank.url = req.body.url;

  //   tank.save(function(err) {
  //     if (err) return handleError(err);
  //     res.send(tank);
  //     res.status(200)
  //   });

  // })


});

// 引导页接口： 表格数据页面接口
router.get('/getTableData', function(req, res) {

  allTableDatas.find({ type: req.query.source }, null, { sort: { $natural: 1 } }, function(err, resdata) {
    if (err) {
      return handleError(res, req)
    };
    res.status(200).json(resdata);
  });

  // allTableDatas.find({}, null, { sort: { $natural: 1 } }, function(err, resdata) {
  //   if (err) {
  //     return handleError(res, req)
  //   };
  //   return res.status(200).json(resdata);
  // });
});



