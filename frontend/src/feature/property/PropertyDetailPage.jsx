import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import PropertyMap from "./PropertyMap";
import { useParams } from "react-router-dom";
import { properties, fetchSingleProperty } from "./PropertySlice";
import { userAccount } from "../account/AccountSlice";
import { fetchWishList, wishlist } from "../wishlist/WishlistSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faToilet,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import WishlistButton from "../wishlist/WishlistButton";
import { Carousel, Tabs } from "flowbite-react";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const dispatch = useDispatch();
  const allProperties = useSelector(properties);
  const userWishlist = useSelector(wishlist);
  const user = useSelector(userAccount);
  const accessToken = localStorage.getItem("access");
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleProperty(propertyId));

    if (!userWishlist) {
      dispatch(fetchWishList(accessToken))
        .unwrap()
        .then((data) => {
          const isSaved = data.find(
            (property) => property.property === propertyId
          );
          setIsInWishlist(isSaved);
        })
        .catch((err) => console.log(err));
    } else {
      const isSaved = userWishlist.find(
        (property) => property.property === propertyId
      );
      setIsInWishlist(isSaved);
    }
  }, [propertyId, accessToken, userWishlist, isInWishlist, dispatch]);

  const property = allProperties.find(
    (property) => property.id === Number(propertyId)
  );

  const renderImageCarousel = (images) => {
    return images.map((image) => (
      <img key={image.id} src={image.image} alt={image.alt_text || ""} />
    ));
  };

  if (!property) {
    return <p>no property</p>;
  }

  return (
    <section
      key={property.id}
      className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased"
    >
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel>{renderImageCarousel(property.images)}</Carousel>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {property.get_formatted_address}
            </h1>
            <h1 className="mt-4 text-lg font-semibold text-gray-900 sm:text-2xl dark:text-white">
              £ {property.price}
            </h1>
            <div className="mt-4 sm:gap-4 sm:items-center sm:flex">
              <span>
                <FontAwesomeIcon icon={faBed} /> {property.bedroom}
              </span>
              <span>
                <FontAwesomeIcon icon={faToilet} /> {property.bedroom}
              </span>
              <span>
                <FontAwesomeIcon icon={faRulerCombined} /> 65 m2
              </span>
            </div>
            <p className="my-4 text-gray-500 dark:text-gray-400">
              {property.description}
            </p>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <WishlistButton
                propertyId={property.id}
                isInWishlist={isInWishlist}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mt-6 px-4 mx-auto 2xl:px-0">
        <Tabs aria-label="Default tabs" variant="default">
          <Tabs.Item active title="Map">
            <PropertyMap property={property} />
          </Tabs.Item>
          <Tabs.Item title="Floorplan">
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Dashboard tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
          <Tabs.Item title="Contacts">
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Contacts tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
        </Tabs>
      </div>
    </section>
  );
};

export default PropertyDetailPage;
