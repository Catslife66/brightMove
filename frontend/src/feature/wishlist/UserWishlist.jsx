import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  wishlistStatus,
  fetchWishList,
  deleteFromWishList,
} from "../wishlist/WishlistSlice";
import { userAccount } from "../account/AccountSlice";

const UserWishlist = () => {
  const accessToken = localStorage.getItem("access");
  const user = useSelector(userAccount);
  const status = useSelector(wishlistStatus);
  const dispatch = useDispatch();
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    if (accessToken && user) {
      dispatch(fetchWishList(accessToken))
        .unwrap()
        .then((data) => {
          setSavedProperties(data);
        })
        .catch((err) => console.log(err));
    }
  }, [accessToken, user, dispatch]);

  const handleDelete = async (propertyId) => {
    try {
      await dispatch(deleteFromWishList({ propertyId, accessToken })).unwrap();
      const updatedList = savedProperties.filter(
        (item) => item.property_detail.id !== propertyId
      );
      setSavedProperties(updatedList);
    } catch (err) {
      console.log(err);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Failed to fetch wishlist.</p>;
  }

  const renderPropertyImage = (images) => {
    const featureImage = images.find((image) => image.is_feature);
    if (!featureImage) {
      return null;
    }
    return <img src={featureImage.image} alt={featureImage.alt_text || ""} />;
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto w-3/4 lg:py-16">
        <h1>my wishlist</h1>
        {savedProperties.map((item) => (
          <div
            className="flex flex-col py-4 items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            key={item.id}
          >
            <div className="grid grid-cols-2">
              <Link
                to={`/property/${item.property_detail.id}`}
                className="shrink-0 max-w-md lg:max-w-lg mx-auto"
              >
                {renderPropertyImage(item.property_detail.images)}
              </Link>
              <div>
                <Link to={`/property/${item.property_detail.id}`}>
                  <h1 className="text-left text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {item.property_detail.address_line1}{" "}
                    {item.property_detail.town}
                  </h1>
                  <div className="my-4 sm:items-center sm:gap-4 sm:flex">
                    <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                      £ {item.property_detail.price}
                    </h3>
                  </div>

                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {item.property_detail.description}
                  </p>
                  <p className="text-left mb-2 text-gray-500 dark:text-gray-400">
                    Added on {item.property_detail.added_at}
                  </p>
                </Link>

                <div className="sm:gap-4 sm:items-center sm:flex sm:my-2">
                  <div className="flex items-center gap-1">
                    {item.property_detail.agent.company_name}
                  </div>
                  <button
                    onClick={() => handleDelete(item.property_detail.id)}
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Remove Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWishlist;
