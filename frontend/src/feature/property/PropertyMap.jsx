import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const PropertyMap = ({ property }) => {
  const containerStyle = {
    width: "400px",
    height: "400px",
  };

  const center = {
    lat: parseFloat(property.location_lat),
    lng: parseFloat(property.location_lon),
  };

  const icon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [40, 40],
  });

  return (
    <MapContainer center={center} zoom={13} style={containerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={icon}>
        <Popup>{property.address_line1}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;
