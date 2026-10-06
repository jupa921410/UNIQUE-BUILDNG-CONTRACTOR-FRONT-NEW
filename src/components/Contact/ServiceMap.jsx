import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ServiceMap.css';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [27.9506, -82.4572]; // Tampa center
const radiusInMeters = 50 * 1609.34; // 75 miles to meters

export default function ServiceMap() {
  return (
    <div className="service-map-container">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        className="service-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={center}
          pathOptions={{
            fillColor: 'var(--green-primary)',
            color: 'var(--green-primary)',
            fillOpacity: 0.15,
            weight: 2
          }}
          radius={radiusInMeters}
        />
        <Marker position={center}>
          <Popup>
            <strong>Unique Building Contractors</strong><br />
            Serving Tampa Bay and 75 miles around.
          </Popup>
        </Marker>
      </MapContainer>
      <div className="map-overlay-info">
        <span>Serving a 50-mile radius around Tampa Bay</span>
      </div>
    </div>
  );
}
