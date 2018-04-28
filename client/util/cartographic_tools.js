import { landOrWater } from './algorithm_logic';

export const drawBoundaries = function (boundaries) {
  const boundariesArray = [];
  const recalcluatedBoundaries = [];
  const numBoundaries = Object.keys(boundaries).length;
  let numRecalculatedBoundaries = 0;

  for (let i = 0; i < numBoundaries; i++) {
    boundariesArray.push(boundaries[i]);
    recalcluatedBoundaries.push(i);
  }

  boundariesArray.forEach((boundary, index) => {
    let direction = 360 / numBoundaries * index;

    landOrWater(boundary, this.map, direction, res => {
      // new google.maps.Marker({
      //   position: res,
      //   map: this.map,
      //   title: `${index}`
      // });
      recalcluatedBoundaries[index] = res;
      numRecalculatedBoundaries++;
      // console.log(numRecalculatedBoundaries);

      if (numRecalculatedBoundaries === numBoundaries) {
        const bermudaPolygon = new google.maps.Polygon({
          paths: recalcluatedBoundaries,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });

        const bounds = new google.maps.LatLngBounds();
        recalcluatedBoundaries.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds);
        bermudaPolygon.setMap(this.map);
      }
    });
  });
}
