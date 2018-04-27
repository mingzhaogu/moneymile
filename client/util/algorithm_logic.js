import async from 'async';
import axios from 'axios';

export const getBoundaries = function() {
  const amount = parseInt(this.state.dollarInput);
  const stdDev = 0.5;
  const defaultRadiusInMeters = 32000;
  const currentLatLng = this.state.addressLatLng;
  let directions = [];

  for (let i = 0; i < 360; i+=20) {
    directions.push(i);
  }

  const googleGeometry = google.maps.geometry.spherical;

  async.eachOf(directions, (direction, index, callback) => {
    const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
    // this.landOrWater(endLatLng.lat(), endLatLng.lng(), res => console.log(res))
    this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, index, direction, []);
    callback(null);
  });
}

export const landOrWater = function (position, map, callback) {
  const mapUrl = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=${map.getZoom()}&size=1x1&maptype=roadmap`
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
    if (pixelData[0] > 160 && pixelData[0] < 181 && pixelData[1] > 190 && pixelData[1] < 210) {
      result = "water";
    } else {
      result = "land";
    }
    callback(result);
  };
}

export const snapToNearestRoad = async function (index, position, map, callback) {
  // const directionsService = new google.maps.DirectionsService();
  // const request = {
  //   origin: position,
  //   destination: position,
  //   travelMode: google.maps.DirectionsTravelMode.DRIVING
  // };

  await axios.get('/snapToRoad', {
    params: {
      origin: `${position.lat()},${position.lng()}`,
      destination: `${position.lat()},${position.lng()}`
    }
  })
  .then(res => {result = res})
  .catch(errors => console.log(errors))

  // await directionsService.route(request, (response, status) => {
  //   if (status == google.maps.DirectionsStatus.OK) {
  //     console.log("preposition", position.lat(), position.lng());
  //     position = response.routes[0].legs[0].start_location
  //     console.log(position.lat(), position.lng());
  //   } else {
  //     console.log("return", response, status);
  //   }
    // } else {
    //   new google.maps.Marker({
    //     position: position,
    //     map: map,
    //     icon: {
    //       url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    //       scaledSize: new google.maps.Size(32, 32)
    //     }
    //   });
    //   console.log("index", index);
    //   console.log("position", position.lat(), position.lng());
    //   console.log("result not found");
    // }

  //   callback(position)
  // });
}

export const rideEstimate = async function(start, end, amount, stdDev, index, direction, history) {
  let result;
  await axios.get('/rideEstimate', {
    params: {
      start_lat: start.lat(),
      start_lng: start.lng(),
      end_lat: end.lat(),
      end_lng: end.lng(),
      ride_type: 'lyft'
    }
  })
  .then(res => {result = res})
  .catch(errors => console.log(errors))

  this.props.newMarker(end);
  if (result.data) {
    let primetimeString = result.data.cost_estimates[0].primetime_percentage;
    let primetimePercentage = parseFloat(primetimeString) / 100.0;
    let baseCost = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
    let estimate = (primetimePercentage * baseCost) + baseCost;
    // let estimate = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
    if ((estimate < (amount + stdDev) && estimate > (amount - stdDev)) ||
        history.length > 8) {
      let newBoundaries = Object.assign({}, this.state.boundaries);
      newBoundaries[index] = end;
      this.setState({ boundaries: newBoundaries },
      () => {
        if (Object.keys(this.state.boundaries).length === 18) {
          // MapTools.drawBoundaries(this.state.boundaries, this.props.map);
          this.props.drawBoundaries(start, this.state.boundaries, amount);
        }
      });
    } else {
      let ratio = amount / estimate;
      const googleGeometry = google.maps.geometry.spherical;
      const newDistance = googleGeometry.computeDistanceBetween(start, end);
      const newEnd = new googleGeometry.computeOffset(start, ratio * newDistance, direction);
      history.push(newEnd);
      this.rideEstimate(start, newEnd, amount, stdDev, index, direction, history);
    }
  }
}
