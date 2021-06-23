// mapboxgl.accessToken = 'pk.eyJ1IjoidmluYXkxOTk5IiwiYSI6ImNrZ3ZwOGp1bzAyaWYzMXJyeTExNDVhZnUifQ.4cEakcbGU7-PNGfJ27mi-Q';
// const map = new mapboxgl.Map({
// container: 'map', // container ID
// style: 'mapbox://styles/mapbox/dark-v10', // style URL
// center: city[0].geometry.coordinates, // starting position [lng, lat]
// zoom: 9 // starting zoom
// });

// for(var i = 0; i < city[0].check.length; i++) {
//     const marker = new mapboxgl.Marker()
//     .setLngLat(city[0].check[i].geometry.coordinates)
//     .addTo(map);
//   }

mapboxgl.accessToken = 'pk.eyJ1IjoidmluYXkxOTk5IiwiYSI6ImNrZ3ZwOGp1bzAyaWYzMXJyeTExNDVhZnUifQ.4cEakcbGU7-PNGfJ27mi-Q';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: city[0].geometry.coordinates,
  zoom: 12
});

// code from the next step will go here!

const geojson = {features: city[0].ownerList }

geojson.features.forEach(function(marker) {

// create a HTML element for each feature
var el = document.createElement('div');
el.className = 'marker';  

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
  .setLngLat([marker.geometry.coordinates[1],marker.geometry.coordinates[0]])
  .addTo(map);
});
