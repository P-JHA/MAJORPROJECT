// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: "map",
//   // style: "mapbox://styles/mapbox/streets-v12",
//   center: listing.geometry.coordinates,
//   zoom: 9,
// });

// const marker = new mapboxgl.Marker({ color: "red" })
//   .setLngLat(listing.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }).setHTML(
//       `<h4>${listing.location} </h4><p>Exact Location will be after Booking<\p>`
//     )
//   )
//   .addTo(map);

// public/js/map.js
mapboxgl.accessToken = mapToken; // assumes mapToken is defined by the page

// defensive: make sure 'listing' exists
if (typeof listing === "undefined" || !listing.geometry) {
  console.error("Listing or geometry not provided to map.js");
} else {
  const coordinates = listing.geometry.coordinates || [];

  console.log("Map coordinates:", coordinates); // open browser console to inspect

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates.length ? coordinates : [77.2088, 28.6139],
    zoom: coordinates.length ? 12 : 9,
  });

  // add controls
  map.addControl(new mapboxgl.NavigationControl());

  // add marker if coordinates available
  if (coordinates.length) {
    new mapboxgl.Marker({ color: "red" })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.location} </h4><p>Exact Location will be after Booking<\p>`
        )
      )
      .addTo(map);
  } else {
    console.warn("No coordinates to place marker");
  }
}
