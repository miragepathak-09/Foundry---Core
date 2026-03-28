import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../AppContext';
import { Item } from '../types';

// Fix Leaflet marker icons
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapComponentProps {
  onMarkerClick: (item: Item) => void;
  onMapClick: (lat: number, lng: number) => void;
}

// Custom Pulse Icons
const createPulseIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pulse" style="background-color: ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const icons = {
  lost: createPulseIcon('#FF5E3A'), // Sunset Orange
  found: createPulseIcon('#2ECC71'), // Emerald Green
  lending: createPulseIcon('#FFD700'), // Gold
};

// Component to handle map center and locate
const MapController: React.FC<{ location: { lat: number, lng: number } | null }> = ({ location }) => {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [location, map]);

  return null;
};

// Component to handle map clicks
const MapEvents: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LeafletMapComponent: React.FC<LeafletMapComponentProps> = ({ onMarkerClick, onMapClick }) => {
  const { items, location } = useAppContext();
  const defaultCenter: [number, number] = [27.7172, 85.3240]; // Kathmandu

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
      <MapContainer 
        center={location ? [location.lat, location.lng] : defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: '#050505' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController location={location} />
        <MapEvents onMapClick={onMapClick} />

        {items.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.coordinates.lat, item.coordinates.lng]}
            icon={icons[item.type as keyof typeof icons] || DefaultIcon}
            eventHandlers={{
              click: () => onMarkerClick(item),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
