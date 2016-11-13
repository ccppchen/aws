var ccap = require('ccap'),
  RandExp = require('randexp');

var defaults = {
  width: 100, //配置验证码图片的width,default is 256
  height: 40, //配置验证码图片的 height,default is 60
  offset: 25, //验证码 文本间距,default is 40
  quality: 10, //图片质量,default is 50
  fontsize: 32, //字符字体大小,default is 57
};
var _ccap = function(opts) {
  var captcha = ccap({
    width: defaults.width || opts.width,
    height: defaults.height || opts.height,
    offset: defaults.offset || opts.offset,
    quality: defaults.quality || opts.quality,
    fontsize: defaults.fontsize || opts.fontsize,
    generate: function() { //用户自定义生成验证码的函数
      return new RandExp(/[A-Za-z0-9]{4}/).gen();
    }
  });
  var ary = captcha.get(); //ary[0] 验证码字符串,ary[1] 验证码图片数据.
  return ary;
}

module.exports = {
  ccap: function(opts) {
    return _ccap(opts);
  }
}
