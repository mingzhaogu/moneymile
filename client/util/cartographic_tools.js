import { landOrWater } from './algorithm_logic';

export const drawBoundaries = function (boundaries, rideType) {
  console.log('hidrew', rideType)
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
    let newRideType = rideType
    landOrWater(boundary, this.map, direction, res => {
      // new google.maps.Marker({
      //   position: res,
      //   map: this.map,
      //   title: `${index}`
      // });
      recalculatedBoundaries[index] = res;
      numRecalculatedBoundaries++;

      if (numRecalculatedBoundaries === numBoundaries) {
        console.log(this.state.newBoundary.newRideType)
        if (this.state.newBoundary[rideType] !== undefined) {
          this.state.newBoundary[rideType].setMap(null);
        }
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
        console.log(rideType)
        let newBoundary = this.state.newBoundary
        newBoundary[rideType] = bermudaPolygon
        this.setState({newBoundary})

        const bounds = new google.maps.LatLngBounds();
        recalculatedBoundaries.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds);
        bermudaPolygon.setMap(this.map);
      }
    });
  });
}
