import async from 'async';
import axios from 'axios';
require('dotenv').config();

export const getBoundaries = function(userLocation, type) {
  const amount = parseInt(this.state.dollarInput);
  const stdDev = 2;
  const defaultRadiusInMeters = 32000;
  const currentLatLng = userLocation || this.state.addressLatLng;
  const rideType = type || this.state.rideType
  let directions = [];

  for (let i = 0; i < 360; i += 45) {
    directions.push(i);
  }

  const googleGeometry = google.maps.geometry.spherical;

  async.eachOf(directions, (direction, index, callback) => {
    const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
    this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, index, directions.length, direction, [], rideType);
    callback(null);
  });
}

export const recalculateBoundary = function (position, boundary, map, direction, callback) {
  landOrWater(boundary, map, res => {
    if (res === 'land')
      callback(boundary);
    else {
      const googleGeometry = google.maps.geometry.spherical;
      const midPoint = googleGeometry.computeDistanceBetween(boundary, position) / 2;

      if (midPoint <= 250) {
        callback(boundary);
      } else {
        const midLatLng = new googleGeometry.computeOffset(position, midPoint, direction);
        landOrWater(midLatLng, map, res => {
          if (res === 'water')
            recalculateBoundary(position, midLatLng, map, direction, callback);
          else
            recalculateBoundary(midLatLng, boundary, map, direction, callback);
        })
      }
    }
  })
}

export const landOrWater = function (position, map, callback) {
  const mapUrl = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=${map.getZoom()}&size=1x1&maptype=roadmap&key=${process.env.GOOGLE_API_KEY}`;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = mapUrl;

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
    const pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;

    if (pixelData[0] > 160 && pixelData[0] < 181 && pixelData[1] > 190 && pixelData[1] < 210) {
      callback('water');
    }
    else {
      callback('land');
    }
  }
}

export const rideEstimate = async function(start, end, amount, stdDev, index, numDirections, direction, history, rideType) {
  let result;
  const requestType = rideType
  await axios.get('/rideEstimate', {
    params: {
      start_lat: start.lat(),
      start_lng: start.lng(),
      end_lat: end.lat(),
      end_lng: end.lng(),
      ride_type: requestType
    }
  })
  .then(res => {result = res})
  .catch(errors => {})

  if (result.data) {
    let primetimeString = result.data.cost_estimates[0].primetime_percentage;
    let primetimePercentage = parseFloat(primetimeString) / 100.0;
    let baseCost = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
    let estimate = (primetimePercentage * baseCost) + baseCost;

    if (result.data.cost_estimates[0].can_request_ride) {
      if ((estimate < (amount + stdDev) && estimate > (amount - stdDev)) ||
      history.length > 8) {
        let newBoundaries = Object.assign({}, this.state.boundaries);
        newBoundaries[index] = end;
        this.setState({ boundaries: newBoundaries },
          () => {
            if (Object.keys(this.state.boundaries).length === numDirections) {
              this.props.drawBoundaries(start, this.state.boundaries, rideType);
              this.changeFormState();
            }
          });
      } else {
        let ratio = amount / estimate;
        const googleGeometry = google.maps.geometry.spherical;
        const newDistance = googleGeometry.computeDistanceBetween(start, end);
        const newEnd = new googleGeometry.computeOffset(start, ratio * newDistance, direction);
        history.push(newEnd);
        this.rideEstimate(start, newEnd, amount, stdDev, index, numDirections, direction, history, rideType);
      }
    } else {
      const googleGeometry = google.maps.geometry.spherical;
      const newDistance = googleGeometry.computeDistanceBetween(start, end) / 2;
      const newEnd = new googleGeometry.computeOffset(start, newDistance, direction);
      history.push(newEnd);
      this.rideEstimate(start, newEnd, amount, stdDev, index, numDirections, direction, history, rideType);
    }
  }
}
