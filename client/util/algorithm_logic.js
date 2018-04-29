import async from 'async';
import axios from 'axios';
require('dotenv').config();

export const getBoundaries = function() {
  const amount = parseInt(this.state.dollarInput);
  const stdDev = 0.5;
  const defaultRadiusInMeters = 32000;
  const currentLatLng = this.state.addressLatLng;
  const rideType = this.state.rideType
  let directions = [];

  for (let i = 0; i < 360; i+=10) {
    directions.push(i);
  }

  const googleGeometry = google.maps.geometry.spherical;

  async.eachOf(directions, (direction, index, callback) => {
    const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
    this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, index, directions.length, direction, [], rideType);
    callback(null);
  });
}

export const landOrWater = function(position, map, direction, callback) {
  // const mapUrl = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=${map.getZoom()}&size=1x1&maptype=roadmap&key=AIzaSyDEXz3xx4nhRj4ePTFB39xLHHtvampEivs`
  const mapUrl = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=${map.getZoom()}&size=1x1&maptype=roadmap`;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let result;

  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = mapUrl;

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
    const pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;

    if(pixelData[0] > 160 && pixelData[0] < 181 && pixelData[1] > 190 && pixelData[1] < 210) {
      const step = -402;
      const googleGeometry = google.maps.geometry.spherical;
      const newPosition = new googleGeometry.computeOffset(position, step, direction);
      landOrWater(newPosition, map, direction, callback);
    } else {
      callback(position);
    }
  }
}

export const snapToNearestRoad = function (index, position, callback) {
  const directionsService = new google.maps.DirectionsService();
  const request = {
      origin: position,
      destination: position,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  directionsService.route(request, (response, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      position = response.routes[0].legs[0].start_location
      callback(position);
    } else {
      setTimeout(snapToNearestRoad(index, position, callback), 1000);
    }
  });
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
              this.props.drawBoundaries(this.state.boundaries);
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
