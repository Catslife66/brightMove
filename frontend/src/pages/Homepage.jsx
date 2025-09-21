import { useDispatch } from "react-redux";
import PropertySearchForm from "../feature/property/PropertySearchForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperties } from "../feature/property/PropertySlice";
import { faBed, faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Helmet from "react-helmet";

const Homepage = () => {
  const dispatch = useDispatch();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    dispatch(fetchProperties())
      .unwrap()
      .then((data) => {
        setProperties(data.slice(0, 5));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    fetchArticles();
    async function fetchArticles() {
      try {
        const res = await fetch("http://localhost:8000/api/blog/");
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        }
        setArticles(data.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    }
  }, [dispatch]);

  const getFeatureImg = (images) => {
    const featureImg = images.find((image) => image.is_feature === true);
    return featureImg || images[0];
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Helmet>
        <title>Bright Move</title>
        <meta
          name="description"
          content="A website for searching properties to buy."
        />
      </Helmet>

      {/* hero */}
      <section className="bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-gray-400 bg-blend-multiply">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Journey to your perfect home
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi sit
            amet mauris commodo. Nulla pharetra diam sit amet nisl.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            <PropertySearchForm />
          </div>
        </div>
      </section>

      {/* stat */}
      <section className="py-12 bg-white mt-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl py-8 font-bold mb-8">
            Your Trusted Real Estate Advisors
          </h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 py-4">17K+</h3>
                <p className="text-lg py-4">Satisfied Customers</p>
              </div>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 py-4">25+</h3>
                <p className="text-lg py-4">Years of Experience</p>
              </div>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 py-4">150+</h3>
                <p className="text-lg py-4">Indausty Awards</p>
              </div>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 py-4">900K+</h3>
                <p className="text-lg py-4">Property resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* feature property */}
      <section className="py-12 bg-white mt-4">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 py-8">
            Discover Your Perfect Property Match
          </h2>
          <div className="flex flex-wrap mx-4">
            <Link
              to={`/property/${properties[0].id}`}
              className="w-full lg:w-1/2 px-4 py-2 mb-8 lg:mb-0"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={properties[0].images[0].image}
                  alt={properties[0].images[0].alt_text}
                  className="rounded-lg mb-4 w-full"
                />
                <h3 className="text-2xl font-semibold mb-2">
                  £ {properties[0].price}
                </h3>
                <p className="text-gray-600">
                  {properties[0].get_formatted_address}
                </p>
                <div className="flex items-center mt-4">
                  <span className="text-gray-600 mr-4">
                    {properties[0].bedroom} <FontAwesomeIcon icon={faBed} />
                  </span>
                  <span className="text-gray-600 mr-2">
                    {properties[0].toilet} <FontAwesomeIcon icon={faToilet} />
                  </span>
                </div>
              </div>
            </Link>
            <div className="w-full lg:w-1/2 px-4">
              <div className="grid grid-cols-2 gap-4">
                {properties.slice(1, 5).map((property) => {
                  const featureImage = getFeatureImg(property.images);
                  return (
                    <Link
                      to={`/property/${property.id}`}
                      className="w-full px-4 mb-8 md:mb-0"
                      key={property.id}
                    >
                      <div className="bg-white p-6 rounded-lg shadow-lg">
                        <img
                          src={
                            featureImage
                              ? featureImage.image
                              : "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          alt={
                            featureImage
                              ? featureImage.alt_text
                              : "Property Image"
                          }
                          className="rounded-lg mb-4 w-full"
                        />

                        <div className="flex flex-row justify-between items-center align-center">
                          <p className="text-gray-600">£ {property.price}</p>
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-4">
                              {property.bedroom}{" "}
                              <FontAwesomeIcon icon={faBed} />
                            </span>
                            <span className="text-gray-600 mr-2">
                              {property.toilet}{" "}
                              <FontAwesomeIcon icon={faToilet} />
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm">
                          {property.get_formatted_address}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* articles */}
      <section className="py-12 bg-white mt-4">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 py-8">
            More Property Market News
          </h2>
          <div className="grid grid-cols-3 gap-4 mx-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="w-full mx-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Link to={`/article/${article.id}`}>
                  <img
                    className="rounded-t-lg"
                    src={article.feature_img}
                    alt={article.title}
                    style={{ height: "260px", width: "100%" }}
                  />
                </Link>
                <div className="p-5">
                  <Link to={`/article/${article.id}`}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {article.title}
                    </h5>
                  </Link>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {article.content.slice(0, 100)}...
                  </p>
                  <Link
                    to={`/article/${article.id}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
