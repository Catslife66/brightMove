import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount, userAccount, accountStatus } from "./AccountSlice";
import { Spinner } from "flowbite-react";

const AgentProfilePage = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const agentStatus = localStorage.getItem("isAgent");
  const accessToken = localStorage.getItem("access");
  const [isUpdateLogo, setIsUpdateLogo] = useState(false);
  const user = useSelector(userAccount);
  const status = useSelector(accountStatus);
  const [isLoading, setIsLoading] = useState(true);
  const isAgent = agentStatus === "true" ? true : false;

  const [formError, setFormError] = useState({});
  const [formMsg, setFormMsg] = useState({
    detail: "",
  });
  const [agentData, setAgentData] = useState({
    user: {
      username: "",
      email: "",
    },
    companyName: "",
    companyLogo: null,
    telephone: "",
    intro: "",
    addressLine1: "",
    addressLine2: "",
    town: "",
    region: "",
    locationLat: "",
    locationLon: "",
  });

  useEffect(() => {
    if (status === "succeeded") {
      let agentData = {
        user: {
          username: user.user.username || "",
          email: user.user.email || "",
        },
        companyName: user.company_name || "",
        companyLogo: user.company_logo || "",
        telephone: user.telephone || "",
        intro: user.intro || "",
        addressLine1: user.address_line1 || "",
        addressLine2: user.address_line2 || "",
        town: user.town || "",
        region: user.region || "",
        locationLat: user.location_lat || "",
        locationLon: user.location_lon || "",
      };
      setAgentData(agentData);
      setIsLoading(false);
    }
  }, [status]);

  const handleChange = (e) => {
    if (e.target.name === "companyLogo") {
      setAgentData({
        ...agentData,
        companyLogo: e.target.files[0],
      });
      setIsUpdateLogo(true);
    } else {
      setAgentData({
        ...agentData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("telephone", agentData.telephone);
    formData.append("intro", agentData.intro);
    formData.append("address_line1", agentData.addressLine1);
    formData.append("town", agentData.town);
    formData.append("region", agentData.region);
    formData.append("location_lat", agentData.locationLat);
    formData.append("location_lon", agentData.locationLon);
    if (isUpdateLogo) {
      formData.append("company_logo", agentData.companyLogo);
    }
    dispatch(
      updateAccount({ updateData: formData, userId, isAgent, accessToken })
    )
      .unwrap()
      .then((data) => {
        if (data.error) {
          setFormError(data.error);
        } else {
          setFormMsg({ detail: "Updated successfully" });
        }
      })
      .catch((err) => setFormError(err));

    setIsUpdateLogo(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Agent profile
        </h2>
        <form onSubmit={handleSubmit}>
          {formMsg && <p>{formMsg.detail}</p>}
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={agentData.user.username}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                readOnly
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={agentData.user.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                readOnly
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="companyName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                onChange={handleChange}
                value={agentData.companyName}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="companyLogo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company Logo
              </label>
              <img src={agentData.companyLogo || ""} alt="company logo" />
              {formError && <p>{formError.company_logo}</p>}
              <input
                type="file"
                name="companyLogo"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={!agentData.companyLogo}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="telephone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Telephone Number
              </label>
              {formError && <p>{formError.telephone}</p>}
              <input
                type="text"
                name="telephone"
                onChange={handleChange}
                value={agentData.telephone}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="intro"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company Introduction
              </label>
              {formError && <p>{formError.intro}</p>}
              <input
                type="text"
                name="intro"
                value={agentData.intro}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="addressLine1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address Line 1
              </label>
              {formError && <p>{formError.address_line1}</p>}
              <input
                type="text"
                name="addressLine1"
                value={agentData.addressLine1}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="addressLine2"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address Line 2
              </label>
              {formError && <p>{formError.address_line2}</p>}
              <input
                type="text"
                name="addressLine2"
                value={agentData.addressLine2}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="town"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Town
              </label>
              {formError && <p>{formError.town}</p>}
              <input
                type="text"
                name="town"
                value={agentData.town}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="region"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Region
              </label>
              {formError && <p>{formError.region}</p>}
              <input
                type="text"
                name="region"
                value={agentData.region}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="locationLat"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Latitude
              </label>
              {formError && <p>{formError.location_lat}</p>}
              <input
                type="text"
                name="locationLat"
                value={agentData.locationLat}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="locationLon"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Longtitude
              </label>
              {formError && <p>{formError.location_lon}</p>}
              <input
                type="text"
                name="locationLon"
                value={agentData.locationLon}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AgentProfilePage;
