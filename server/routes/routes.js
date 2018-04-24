//server/routes/routes.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Lyft = require('lyft-node');
require('dotenv').config();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/rideEstimate', (req, res) =>  {
  const lyft = new Lyft(
    process.env.LYFT_CLIENT_ID,
    process.env.LYFT_CLIENT_SECRET
  );

  const query = {
    start: {
      latitude: req.query.start_lat,
      longitude: req.query.start_lng,
    },
    end: {
      latitude: req.query.end_lat,
      longitude: req.query.end_lng,
    },
    rideType: req.query.ride_type
  };

  lyft.getRideEstimates(query)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
});



module.exports = router;
