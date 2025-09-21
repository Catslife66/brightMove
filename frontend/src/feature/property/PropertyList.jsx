import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistButton from "../wishlist/WishlistButton";
import { userAccount } from "../account/AccountSlice";
import { fetchWishList, wishlist } from "../wishlist/WishlistSlice";
import { Link } from "react-router-dom";
import ContactButton from "../email/ContactButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faToilet, faHouse } from "@fortawesome/free-solid-svg-icons";

const PropertyList = ({ properties = null }) => {
  const userWishlist = useSelector(wishlist);
  const user = useSelector(userAccount);
  const accessToken = localStorage.getItem("access");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchWishList(accessToken));
    }
  }, [accessToken, user, dispatch]);

  const renderPropertyImage = (images) => {
    const featureImage = images.find((image) => image.is_feature);
    if (!featureImage) {
      return null;
    }
    return (
      <img
        // src={featureImage.image}
        src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
        alt={featureImage.alt_text || ""}
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
      />
    );
  };

  const propertyElement = properties.map((property) => {
    let isInWishlist = false;
    if (user) {
      isInWishlist = userWishlist.some((item) => item.property === property.id);
    }

    return (
      <div
        className="flex flex-col py-4 items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        key={property.id}
      >
        <div className="grid grid-cols-2">
          <Link
            to={`/property/${property.id}`}
            className="shrink-0 max-w-md lg:max-w-lg mx-auto"
          >
            {property.images && renderPropertyImage(property.images)}
          </Link>
          <div>
            <Link to={`/property/${property.id}`}>
              <h1 className="text-left text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {property.address_line1} {property.town}
              </h1>
              <div className="my-4 sm:items-center sm:gap-4 sm:flex">
                <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  £ {property.price}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-2 sm:mt-0">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faHouse} />
                  <span className="ms-2">{property.property_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faBed} />
                  <span className="ms-2">{property.bedroom}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faToilet} />
                  <span className="ms-2">{property.bedroom}</span>
                </div>
              </div>

              <p className="mb-2 text-gray-500 dark:text-gray-400">
                {property.description}
              </p>
              <p className="text-left mb-2 text-gray-500 dark:text-gray-400">
                Added on {property.added_at}
              </p>
            </Link>

            <div className="sm:gap-4 sm:items-center sm:flex sm:my-2">
              <div className="flex items-center gap-1">
                {property.agent.company_name}
              </div>
              <WishlistButton
                propertyId={property.id}
                isInWishlist={isInWishlist}
                user={user}
              />
              <ContactButton property={property} />
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{propertyElement}</>;
};

export default PropertyList;
