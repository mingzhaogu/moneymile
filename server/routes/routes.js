//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');



router.get('/', function(req, res){
  res.render('index');
});



module.exports = router;
