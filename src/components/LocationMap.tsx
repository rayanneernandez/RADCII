import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationMapProps {
  position: [number, number];
  onPositionChange?: (position: [number, number]) => void;
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  
  return null;
}

const LocationMap = ({ position, onPositionChange }: LocationMapProps) => {
  const mapProps = {
    center: position,
    zoom: 15,
    scrollWheelZoom: false,
    style: { width: '100%', height: '100%' }
  } as any;

  const tileProps = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  } as any;

  const markerProps = {
    position: position,
    draggable: !!onPositionChange,
    eventHandlers: {
      dragend: (e: any) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        onPositionChange?.([pos.lat, pos.lng]);
      },
    }
  } as any;

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
      <MapContainer {...mapProps}>
        {() => (
          <>
            <TileLayer {...tileProps} />
            <Marker {...markerProps} />
            <MapUpdater position={position} />
          </>
        )}
      </MapContainer>
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow-sm flex items-center gap-1 text-xs z-[1000]">
        <MapPin className="w-3 h-3 text-primary" />
        <span>Arraste o marcador</span>
      </div>
    </div>
  );
};

export default LocationMap;
