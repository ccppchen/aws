var express = require('express'),
  router = express.Router(),
  app = express(),
  vue_home = global.dbHandel.getModel('vues'),
  products = global.dbHandel.getModel('products'),
  suggests = global.dbHandel.getModel('suggests');

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
