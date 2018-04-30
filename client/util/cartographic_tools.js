import { recalculateBoundary } from './algorithm_logic';

export const drawBoundaries = function (currentPos, boundaries, rideType) {
  const boundariesArray = [];
  const recalculatedBoundaries = [];
  const numBoundaries = Object.keys(boundaries).length;
  let numRecalculatedBoundaries = 0;

  for (let i = 0; i < numBoundaries; i++) {
    boundariesArray.push(boundaries[i]);
    recalculatedBoundaries.push(i);
  }

  boundariesArray.forEach((boundary, index) => {
    let direction = 360 / numBoundaries * index;

    let newRideType = rideType;
    console.log("rideType", rideType);
    recalculateBoundary(currentPos, boundary, this.map, direction, res => {

      recalculatedBoundaries[index] = res;
      numRecalculatedBoundaries++;

      if (numRecalculatedBoundaries === numBoundaries) {

        // if (this.state.newBoundary[rideType] !== undefined) {
        if (this.state.newBoundary[rideType]) {
          this.state.newBoundary[rideType].setMap(null);
        } else {
          const color = {
            'lyft': '#FF0000',
            'lyft_line': '#32CD32',
            'lyft_plus': '#ADFF2F'
          }

          const bermudaPolygon = new google.maps.Polygon({
            paths: recalculatedBoundaries,
            strokeColor: color[rideType],
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: color[rideType],
            fillOpacity: 0.35
          });


          let newBoundary = this.state.newBoundary;
          newBoundary[rideType] = bermudaPolygon;
          this.setState({ newBoundary });

          const bounds = new google.maps.LatLngBounds();
          recalculatedBoundaries.forEach(coord => bounds.extend(coord));
          this.map.fitBounds(bounds);
          bermudaPolygon.setMap(this.map);
        }
      }
    });
  });
};
