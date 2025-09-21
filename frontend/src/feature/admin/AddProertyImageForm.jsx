import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddProertyImageForm = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const { propertyId } = useParams();
  const [formSetData, setFormSetData] = useState([
    { imageFile: null, altText: "", isFeature: false },
  ]);

  const handleChange = (e, index) => {
    const updatedFormSetData = [...formSetData];
    if (e.target.type === "file") {
      updatedFormSetData[index].imageFile = e.target.files[0];
    } else if (e.target.type === "checkbox") {
      updatedFormSetData[index].isFeature = e.target.checked;
    } else {
      updatedFormSetData[index].altText = e.target.value;
    }
    setFormSetData(updatedFormSetData);
  };

  const handleAddMore = () => {
    setFormSetData([
      ...formSetData,
      { imageFile: null, altText: "", isFeature: false },
    ]);
  };

  const handleDeleteFormSet = (deleteIndex) => {
    setFormSetData(formSetData.filter((_, index) => index !== deleteIndex));
  };

  const formset = formSetData.map((form, index) => (
    <tr
      key={`formset-${index}`}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <td className="px-6 py-4">
        <input
          className="form-control"
          type="file"
          name={`image-${index}`}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          name="is_feature"
          checked={formSetData.isFeature}
          onChange={(e) => handleChange(e, index)}
        />
      </td>

      <td className="px-6 py-4">
        <input
          className="form-control"
          type="text"
          name={`alt_txt-${index}`}
          value={form.altText || ""}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          className="info-btn"
          onClick={() => handleDeleteFormSet(index)}
        >
          delete
        </button>
      </td>
    </tr>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadEndpoint = `http://localhost:8000/api/property/${propertyId}/add-images/`;
    formSetData.forEach(async (form, index) => {
      const formData = new FormData();
      formData.append("image", form.imageFile);
      formData.append("alt_text", form.altText);
      formData.append("is_feature", index === 0 ? "true" : "false");
      formData.append("property", propertyId);
      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });
        if (!res.ok) {
          console.log("upload failed");
        }
        navigate(`/admin/property/${propertyId}/images`);
        return await res.json();
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="ext-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Property image
              </th>
              <th scope="col" className="px-6 py-3">
                Is feature Image
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{formset}</tbody>
        </table>

        <div className="grid grid-cols-4 gap-4 mt-4 items-center">
          <button
            type="button"
            className="col-start-2 default-btn"
            onClick={handleAddMore}
          >
            Add image
          </button>
          <button type="submit" className="col-start-3 info-btn">
            Save All
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProertyImageForm;
