var express = require('express'),
    router = express.Router(),
    app = express(),
    Menus = global.dbHandel.getModel('menus');

module.exports = function(app) {
  app.use('/', router);
}

router.get('/rn/test', function(req, res) {
  res.json({data: "hello"});
});

router.get('/rn/menu', function(req, res) {

  Menus.find({}, null, function(err, data) {
    if (err) {
        return handleError(res, req)
    };
    return res.status(200).json(data[0].data);
  });

});
