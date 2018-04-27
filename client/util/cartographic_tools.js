export const drawBoundaries = (boundaries, map) => {
  // console.log(map);
  let boundariesArray = [];

  for (let i = 0; i < 18; i++) {
    boundariesArray.push(i);
  }

  boundariesArray = boundariesArray.map(index => boundaries[index]);
  boundariesArray.forEach((boundary, index) => {
    new google.maps.Marker({
      position: boundary,
      map: map,
      title: `${index}`
    });
  });
  // console.log("boundariesArray", boundariesArray);
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
  map.fitBounds(bounds);
  bermudaTriangle.setMap(map);
};
