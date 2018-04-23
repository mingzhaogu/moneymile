//server/routes/routes.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
