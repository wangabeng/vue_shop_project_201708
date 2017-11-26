var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.build.port;
var app = express();
var router = express.Router();
router.get('/', function(req, res, next) {
  req.url = 'index.html';
  next();
});
app.use(router);

// 添加获取数据代码开始 
var appData = require('./data.json');
var seller = appData.seller;

var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router();

//设置路由
apiRoutes.get('/seller', function(req, res){
  res.json({
    'errno':0,
    'data':seller
  });
});
apiRoutes.get('/goods', function(req, res){
  res.json({
    'errno':0,
    'data':goods
  });
});
apiRoutes.get('/ratings', function(req, res){
  res.json({
    'errno':0,
    'data':ratings
  });
});

app.use('/api',apiRoutes);//通过'/api/seller'等来获取数据
// 添加获取数据代码结束

// 定义static目录
app.use(express.static('./dist'));
// 启动这个服务器
var server = app.listen(port)

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}