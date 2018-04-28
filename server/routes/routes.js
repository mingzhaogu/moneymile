const express = require('express');
const axios = require('axios');
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
    res.send(result);
  })
  .catch((error) => {
    console.log(error);
  });
});

router.get('/snapToRoad', (req, res) => {
  console.log("HIT THE SERVER");
  axios.request({
    url: 'https://maps.googleapis.com/maps/api/directions/',
    method: 'GET',
    outputFormat: 'json',
    params: {
      origin: req.query.origin,
      destination: req.query.destination,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })
  .then((result) => {
    console.log(result);
    res.send(result);
  })
  .catch((error) => {
    console.log(error);
  });
});

module.exports = router;
