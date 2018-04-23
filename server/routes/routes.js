//server/routes/routes.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');
const Lyft = require('lyft-node');


router.get('/', (req, res) => {
  res.render('index');
});


router.get('/rideEstimate', (req, res) => {
  const lyft = new Lyft('yIE8J-p1h3Z8', 'ivqP7ZT6JJLbMWWuX2HiYmm4QGoHVW_s');

  const query = {
    start: {
      latitude: req.query.start_lat,
      longitude: req.query.start_lng,
    },
    end: {
      latitude: req.query.end_lat,
      longitude: req.query.end_lng,
    },
    rideType: 'lyft',
  };

  lyft.getRideEstimates(query)
    .then((result) => {
      console.log(result);
  })

  .catch((error) => {
    console.log(error);
  });




    // axios.request({
    //   url: "https://api.lyft.com/v1/cost",
    //   method: "post",
    //   data: data
    // })
    // .then((response) => {
    //   console.log(response);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
});


module.exports = router;
