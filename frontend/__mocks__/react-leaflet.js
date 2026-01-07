// Mock for react-leaflet to avoid ESM import errors in Jest
module.exports = {
  MapContainer: () => null,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({}),
  useMapEvent: () => ({}),
  useMapEvents: () => ({})
};