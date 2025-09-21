import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { properties } from "./PropertySlice";
import { useNavigate } from "react-router-dom";

const PropertySearchForm = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const allProperties = useSelector(properties);

  const placelist = useMemo(
    () =>
      Array.from(new Set(allProperties.map((property) => property.town || ""))),
    [allProperties]
  );

  function findMatch(input, places) {
    if (!input) return [];
    const regex = new RegExp(input, "gi");
    return places.filter((place) => place.match(regex));
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
    const matches = findMatch(e.target.value, placelist);
    setSuggestions(matches);
  };

  const handleSuggestionClick = (e) => {
    setInputValue(e.target.dataset.place);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === "") {
      alert("Please enter an area or a postcode.");
      return;
    }
    navigate(`property/search/?q=${inputValue}`);
  };

  const suggestionList = suggestions.map((suggestion, index) => (
    <li
      className="text-left block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      key={index}
      data-place={suggestion}
      onClick={handleSuggestionClick}
    >
      {suggestion}
    </li>
  ));

  return (
    <>
      <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            value={inputValue}
            onChange={handleChange}
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Please enter a place or postcode"
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
        {suggestions.length > 0 && (
          <div
            id="multi-dropdown"
            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="multiLevelDropdownButton"
            >
              {suggestionList}
            </ul>
          </div>
        )}
      </form>
    </>
  );
};

export default PropertySearchForm;
