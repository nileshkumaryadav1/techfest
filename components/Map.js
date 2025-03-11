"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ events }) {
  return (
    <MapContainer center={[20, 78]} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event, index) => (
        <Marker key={index} position={event.location.split(",").map(Number)}>
          <Popup>
            <strong>{event.title}</strong><br />
            {event.description}<br />
            {event.date} - {event.time}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
