import { searchProperty } from "./PropertySlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyList from "./PropertyList";

const PropertySearchResult = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchInput = query.get("q");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortby, setSortby] = useState("");
  const [resultList, setResultList] = useState([]);

  const handleMinPriceFilter = (e) => setMinPrice(e.target.value);
  const handleMaxPriceFilter = (e) => setMaxPrice(e.target.value);
  const handlePropertyTypeFilter = (e) => setPropertyType(e.target.value);
  const handleSortbyFilter = (e) => setSortby(e.target.value);

  useEffect(() => {
    dispatch(searchProperty(searchInput))
      .unwrap()
      .then((data) => {
        let results = data.filter((property) => {
          return (
            (!minPrice || property.price >= minPrice) &&
            (!maxPrice || property.price < maxPrice) &&
            (!propertyType ||
              property.property_type.toLowerCase() ===
                propertyType.toLowerCase())
          );
        });
        switch (sortby) {
          case "Lowest Price":
            results.sort((a, b) => a.price - b.price);
            break;
          case "Highest Price":
            results.sort((a, b) => b.price - a.price);
            break;
          case "Latest Added":
            results.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
            break;
          case "Oldest Added":
            results.sort((a, b) => new Date(a.added_at) - new Date(b.added_at));
            break;
          default:
            break;
        }
        setResultList(results);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [searchInput, maxPrice, minPrice, propertyType, sortby, dispatch]);

  return (
    <div className="px-4 py-6 mx-auto max-w-screen-xl text-center my-4">
      <form className="grid grid-cols-4 gap-2 mb-4">
        <div className="grid grid-cols-2 items-center">
          <label
            htmlFor="min-price"
            className="text-right px-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Minimum price
          </label>
          <input
            type="number"
            name="min-price"
            min="0"
            id="min-price"
            value={minPrice}
            onChange={handleMinPriceFilter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <label
            htmlFor="max-price"
            className="text-right px-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Maximum price
          </label>
          <input
            type="number"
            min={minPrice}
            name="max-price"
            id="max-price"
            value={maxPrice}
            onChange={handleMaxPriceFilter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <label
            htmlFor="property-type"
            className="text-right px-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Property Type
          </label>
          <select
            name="property-type"
            id="property-type"
            value={propertyType}
            onChange={handlePropertyTypeFilter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="Detached">Detached</option>
            <option value="Semi-detached">Semi-detached</option>
            <option value="Flat">Flat</option>
            <option value="Bangalow">Bangalow</option>
            <option value="castle">castle</option>
          </select>
        </div>
        <div className="grid grid-cols-2 items-center">
          <label
            htmlFor="sort-by"
            className="text-right px-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Sort by
          </label>
          <select
            name="sort-by"
            id="sort-by"
            value={sortby}
            onChange={handleSortbyFilter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Default</option>
            <option value="Lowest Price">Lowest Price</option>
            <option value="Highest Price">Highest Price</option>
            <option value="Latest Added">Latest Added</option>
            <option value="Oldest Added">Oldest Added</option>
          </select>
        </div>
      </form>
      {resultList.length === 0 && <p>No results are found</p>}
      <PropertyList properties={resultList} />
    </div>
  );
};

export default PropertySearchResult;
