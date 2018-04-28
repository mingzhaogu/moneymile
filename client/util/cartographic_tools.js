import { snapToNearestRoad } from './algorithm_logic';

export const drawBoundaries = function(start, boundaries, amount) {
  let boundariesArray = [];
  let distance = 0;

  for (let i = 0; i < Object.keys(boundaries).length; i++) {
    boundariesArray.push(boundaries[i]);
  }
  console.log("boundariesArray", boundariesArray);

  boundariesArray.forEach((boundary, index) => {

    // TESTING START
    const googleGeometry = google.maps.geometry.spherical;
    const newDistance = googleGeometry.computeDistanceBetween(start, boundary);
    distance += newDistance;
    // TESTING END

    snapToNearestRoad(index, boundary, this.map,
      (result) => {
        new google.maps.Marker({
          position: result,
          map: this.map,
          title: `${index}, ${newDistance}`,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32)
          }
        });
        console.log("markers", index, result.lat(), result.lng());
        boundariesArray[index] = result;
      }
    )
  });

  console.log('totaldistance', distance);
  console.log('distance per point', distance / boundariesArray.length);
  console.log('distance per dollar', distance / (boundariesArray.length * amount));

  const bermudaTriangle = new google.maps.Polygon({
       paths: boundariesArray,
       strokeColor: '#FF0000',
       strokeOpacity: 0.8,
       strokeWeight: 3,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
  const bounds = new google.maps.LatLngBounds();
  boundariesArray.forEach((coord) => bounds.extend(coord));
  this.map.fitBounds(bounds);
  bermudaTriangle.setMap(this.map);
}
