import { useDispatch } from "react-redux";
import { addToWishList, deleteFromWishList } from "./WishlistSlice";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";

const WishlistButton = ({ propertyId, isInWishlist, user }) => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("access");
  const [isSaved, setIsSaved] = useState(isInWishlist);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setIsSaved(isInWishlist);
  }, [isInWishlist]);

  const toggleSaveToWishlist = () => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    const deleteAction = deleteFromWishList({ propertyId, accessToken });
    const addAction = addToWishList({ propertyId, accessToken });

    dispatch(isSaved ? deleteAction : addAction)
      .unwrap()
      .then(() => {
        setIsSaved(!isSaved);
      })
      .catch((err) => {
        console.log(err);
      });

    setShowAlert(false);
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-primary" role="alert">
          Please log in to save the property to wishlist.
        </div>
      )}
      <button
        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-200 dark:focus:ring-red-900"
        onClick={toggleSaveToWishlist}
      >
        {isSaved ? (
          <FontAwesomeIcon
            icon={faHeartCircleCheck}
            className="text-orange-600"
          />
        ) : (
          <FontAwesomeIcon icon={faHeart} className="text-orange-600" />
        )}
      </button>
    </>
  );
};

export default WishlistButton;
