import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const PropertyImageManager = () => {
  const accessToken = localStorage.getItem("access");
  const [propertyImages, setPropertyImages] = useState([]);
  const [formsetData, setFormsetData] = useState([]);
  const navigate = useNavigate();
  const { propertyId } = useParams();

  useEffect(() => {
    async function fetchPropertyImages() {
      const endpoint = `http://localhost:8000/api/property/${propertyId}/images/`;
      try {
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw Error("connection failed");
        }
        const images = await res.json();
        const imageFormData = images.map((img) => ({
          id: img.id,
          current: img.image,
          file: null,
          altTxt: img.alt_text,
          isChanged: false,
        }));
        setPropertyImages(images);
        setFormsetData(imageFormData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPropertyImages();
  }, [propertyId, accessToken]);

  const handleChange = (e, index) => {
    const updatedFormsData = [...formsetData];
    const currentForm = updatedFormsData[index];

    if (e.target.name === "file") {
      currentForm.file = e.target.files[0];
    } else if (e.target.name === "alt_txt") {
      currentForm.altTxt = e.target.value;
    }
    currentForm.isChanged = true;

    setFormsetData(updatedFormsData);
  };

  const handleUpdateAll = async () => {
    for (const form of formsetData) {
      if (form.isChanged) {
        const formData = new FormData();
        if (form.file) formData.append("image", form.file);
        formData.append("alt_text", form.altTxt);
        try {
          const updateUrl = `http://localhost:8000/api/property/images/${form.id}/update/`;
          const res = await fetch(updateUrl, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
          if (!res.ok) {
            console.log(`failed to update image-${form.id}`);
            console.log(...formData.entries());
          }
          const updatedImage = await res.json();
          console.log("Updated image:", updatedImage);
        } catch (err) {
          console.log(err);
        }
      }
    }
    navigate(`/admin/property/${propertyId}/images`);
  };

  const handleDelete = async (imageId) => {
    const deleteEndpoint = `http://localhost:8000/api/property/images/${imageId}/delete/`;
    try {
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        console.log("error happened");
        return;
      }
      setPropertyImages(propertyImages.filter((image) => image.id !== imageId));
    } catch (err) {
      console.log(err);
    }
  };

  const imageList = formsetData.map((image, index) => (
    <tr
      key={image.id}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <th scope="col" className="px-6 py-3">
        {image.id}
      </th>
      <th scope="col" className="px-6 py-3">
        <img
          src={image.current}
          alt={image.altTxt}
          style={{ width: "100px" }}
        />
      </th>
      <th scope="col" className="px-6 py-3">
        <input
          type="text"
          name="alt_txt"
          value={image.altTxt}
          onChange={(e) => handleChange(e, index)}
          className="form-control"
        />
      </th>
      <th scope="col" className="px-6 py-3">
        {image.current}
      </th>
      <th scope="col" className="px-6 py-3">
        <input
          type="file"
          name="file"
          onChange={(e) => handleChange(e, index)}
          className="form-control"
        />
      </th>

      <th>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => handleDelete(image.id)}
        >
          delete
        </button>
      </th>
    </tr>
  ));

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
      <h3>Property Image Overview</h3>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Image id
            </th>
            <th scope="col" className="px-6 py-3">
              image
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Current path
            </th>
            <th scope="col" className="px-6 py-3">
              Update new image
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{imageList}</tbody>
      </table>

      <div className="mt-6">
        {propertyImages.length > 0 && (
          <button
            type="button"
            className="default-btn"
            onClick={handleUpdateAll}
          >
            Update all
          </button>
        )}
        <Link
          to={`/admin/property/${propertyId}/images/upload`}
          className="info-btn"
        >
          Add images
        </Link>
      </div>
    </div>
  );
};

export default PropertyImageManager;
