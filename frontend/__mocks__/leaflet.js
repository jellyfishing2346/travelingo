// Manual mock for leaflet to avoid ESM import errors in Jest
module.exports = {
  map: () => ({}),
  tileLayer: () => ({}),
  marker: () => ({}),
  icon: () => ({}),
  latLng: () => ({}),
  layerGroup: () => ({}),
  featureGroup: () => ({}),
  DomUtil: {},
  DomEvent: {},
  control: {},
  popup: () => ({}),
};