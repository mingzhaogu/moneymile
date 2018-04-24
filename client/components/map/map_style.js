const mapStyle = [
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on'
      },
      {
        lightness: 100
      },
      {
        gamma: 9.99
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
];

export default mapStyle;
