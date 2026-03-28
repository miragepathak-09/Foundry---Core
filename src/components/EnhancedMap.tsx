import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Circle } from 'react-leaflet';
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

interface EnhancedMapProps {
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
  lost_crimson: createPulseIcon('#DC143C'), // Crimson
  found_emerald: createPulseIcon('#50C878'), // Emerald
  rental_amber: createPulseIcon('#FFBF00'), // Amber
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

export const EnhancedMap: React.FC<EnhancedMapProps> = ({ onMarkerClick, onMapClick }) => {
  const { items, location } = useAppContext();
  const defaultCenter: [number, number] = [27.7172, 85.3240]; // Kathmandu

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden border-[0.5px] border-white/20 shadow-2xl relative">
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

        {items.map((item) => {
          // Privacy Logic: Reveal exact pin only if booked/rented or if it's the user's item
          const isBooked = item.status === 'rented' || item.status === 'on-loan';
          const isUserItem = item.userId === 'user-1'; // Mock user ID
          const revealExact = isBooked || isUserItem;
          const color = item.type === 'lost' ? '#DC143C' : item.type === 'found' ? '#50C878' : '#FFBF00';
          const icon = item.type === 'lost' ? icons.lost_crimson : item.type === 'found' ? icons.found_emerald : icons.rental_amber;

          return (
            <React.Fragment key={item.id}>
              {revealExact ? (
                <Marker 
                  position={[item.coordinates.lat, item.coordinates.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => onMarkerClick(item),
                  }}
                />
              ) : (
                <Circle 
                  center={[item.coordinates.lat, item.coordinates.lng]}
                  radius={100} // 100m radius blur for privacy
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.15,
                    color: color,
                    weight: 1,
                    dashArray: '5, 10'
                  }}
                  eventHandlers={{
                    click: () => onMarkerClick(item),
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Privacy Legend */}
      <div className="absolute top-6 right-6 z-[1000] p-3 glass rounded-2xl border-[0.5px] border-white/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-dashed border-white/40" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Approx. Location (Privacy)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Exact Node (Handshake Complete)</span>
        </div>
      </div>
    </div>
  );
};
