import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "flowbite-react";

const PropertyManager = () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("access");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProperty();

    async function fetchUserProperty() {
      try {
        const userPropertyEndpoint = `http://localhost:8000/api/property/user/`;
        const res = await fetch(userPropertyEndpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          throw Error("connection failed");
        }
        const data = await res.json();
        setProperties(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [userId, isLoading, accessToken]);

  const propertyList = properties.map((property) => (
    <tr
      key={property.id}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <th scope="col" className="px-6 py-3">
        {property.id}
      </th>
      <th scope="col" className="px-6 py-3">
        {property.get_formatted_address}
      </th>
      <th scope="col" className="px-6 py-3">
        {property.added_at}
      </th>
      <th scope="col" className="px-6 py-3">
        {property.updated_at}
      </th>
      <th scope="col" className="px-6 py-3">
        £ {property.price}
      </th>
      <th scope="col" className="px-6 py-3">
        {property.is_active ? (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        ) : (
          <FontAwesomeIcon icon={faMinusCircle} className="text-gray-600" />
        )}
      </th>
      <th scope="col" className="px-6 py-3 grid">
        <Link to={`/admin/property/update/${property.id}`} className="info-btn">
          Update info
        </Link>
        <Link to={`/admin/property/${property.id}/images`} className="img-btn">
          Manage image
        </Link>
      </th>
    </tr>
  ));

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
      <h3>Property List Overview</h3>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Property id
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Added at
            </th>
            <th scope="col" className="px-6 py-3">
              Updated at
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{propertyList}</tbody>
      </table>

      <div className="mt-6">
        <Link to="add" className="default-btn">
          Add a property
        </Link>
      </div>
    </div>
  );
};

export default PropertyManager;
