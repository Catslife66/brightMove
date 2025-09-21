import { useNavigate } from "react-router-dom";
import PropertyManager from "./PropertyManager";

const Property = () => {
  const navigate = useNavigate();

  const handleAddAProperty = () => {
    navigate("/property/add");
  };

  return (
    <div>
      <h1>Property Management</h1>
      <PropertyManager />
      <button type="button" onClick={handleAddAProperty}>
        Add a property
      </button>
    </div>
  );
};

export default Property;
