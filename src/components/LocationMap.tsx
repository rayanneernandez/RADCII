import { useEffect, useRef } from "react";
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

const LocationMap = ({ position, onPositionChange }: LocationMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker(position, { draggable: !!onPositionChange }).addTo(map);

    if (onPositionChange) {
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onPositionChange([pos.lat, pos.lng]);
      });
    }

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map view and marker when position changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng(position);
    mapRef.current.setView(position, mapRef.current.getZoom());
  }, [position]);

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow-sm flex items-center gap-1 text-xs z-[1000]">
        <MapPin className="w-3 h-3 text-primary" />
        <span>Arraste o marcador</span>
      </div>
    </div>
  );
};

export default LocationMap;
