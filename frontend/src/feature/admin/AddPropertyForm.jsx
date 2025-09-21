import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addProporty } from "../property/PropertySlice";
import { useNavigate } from "react-router-dom";

const AddPropertyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    description: "",
    address1: "",
    address2: "",
    town: "",
    region: "",
    postcode: "",
    propertyType: "",
    bedroom: "",
    toilet: "",
    priceType: "",
    price: "",
    locationLat: "",
    locationLon: "",
  });

  const canSave = useMemo(() => {
    const requiredFields = [
      "description",
      "address1",
      "town",
      "postcode",
      "propertyType",
      "bedroom",
      "toilet",
      "priceType",
      "price",
      "locationLat",
      "locationLon",
    ];
    return requiredFields.every(
      (field) => formData[field].toString().trim() !== ""
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId && canSave) {
      const propertyData = {
        description: formData.description,
        address_line1: formData.address1,
        address_line2: formData.address2,
        town: formData.town,
        region: formData.region,
        postcode: formData.postcode,
        property_type: formData.propertyType,
        bedroom: Number(formData.bedroom),
        toilet: Number(formData.toilet),
        price_type: formData.priceType,
        price: Number(formData.price),
        agent: userId,
        is_active: formData.isActive,
        location_lat: formData.locationLat,
        location_lon: formData.locationLon,
      };
      dispatch(addProporty({ propertyData, accessToken }))
        .unwrap()
        .then((response) => {
          navigate(`/property/${response.id}/update`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a property
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="description">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows={5}
              ></textarea>
            </div>
            <div className="w-full">
              <label htmlFor="address1" className="form-label">
                Address Line 1:
              </label>
              <input
                className="form-control"
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label htmlFor="address2" className="form-label">
                Address Line 2:
              </label>
              <input
                className="form-control"
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label htmlFor="town" className="form-label">
                Town:
              </label>
              <input
                className="form-control"
                type="text"
                name="town"
                value={formData.town}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label htmlFor="region" className="form-label">
                Region:
              </label>
              <input
                className="form-control"
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="postcode">
                Postcode:
              </label>
              <input
                className="form-control"
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="propertyType">
                Property Type:
              </label>
              <select
                className="form-control"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option>Choose price type</option>
                <option value="Detached">Detached</option>
                <option value="Semi-detached">Semi-detached</option>
                <option value="Flat">Flat</option>
                <option value="Bangalow">Bangalow</option>
              </select>
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="bedroom">
                Bedroom:
              </label>
              <input
                className="form-control"
                type="number"
                name="bedroom"
                value={formData.bedroom}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="toilet">
                Toilet:
              </label>
              <input
                className="form-control"
                type="number"
                name="toilet"
                value={formData.toilet}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="priceType">
                Price Type:
              </label>
              <select
                className="form-control"
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
              >
                <option>Choose price type</option>
                <option value="Offers over">Offers over</option>
                <option value="Fixed price">Fixed price</option>
              </select>
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="price">
                Price:
              </label>
              <input
                className="form-control"
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="locationLat">
                Latitude:
              </label>
              <input
                className="form-control"
                type="text"
                name="locationLat"
                value={formData.locationLat}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="form-label" htmlFor="locationLon">
                Longtitude:
              </label>
              <input
                className="form-control"
                type="text"
                name="locationLon"
                value={formData.locationLon}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <input
                name="isActive"
                type="checkbox"
                onChange={handleChange}
                checked={formData.isActive}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="isActive"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Activate this property
              </label>
            </div>
          </div>
          <button type="submit" className="default-btn">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPropertyForm;
