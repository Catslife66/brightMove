import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accountStatus, fetchAccount, updateAccount } from "./AccountSlice";
import { Link } from "react-router-dom";

const UserDetailPage = () => {
  const dispatch = useDispatch();
  const status = useSelector(accountStatus);
  const [userData, setUserDate] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("access");
  const agentStatus = localStorage.getItem("isAgent");
  const isAgent = agentStatus === "true";
  const [formMsg, setFormMsg] = useState({
    detail: "",
  });

  useEffect(() => {
    if ((userId && accessToken) || accountStatus === "succeeded") {
      dispatch(fetchAccount({ userId, isAgent, accessToken }))
        .unwrap()
        .then((user) => {
          setUserDate({
            username: user.username || "",
            email: user.email || "",
            phoneNumber: user.phone_number || "",
          });
        })
        .catch((err) => console.log(err));
    }
  }, [userId, accessToken, isAgent, dispatch]);

  const handleChange = (e) => {
    setUserDate({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      username: userData.username || "",
      email: userData.email || "",
      phone_number: userData.phoneNumber || "",
    };
    dispatch(updateAccount({ updateData, userId, isAgent, accessToken }))
      .unwrap()
      .then((data) => {
        if (status === "succeeded") {
          setFormMsg({
            detail: "Updated successfully",
          });
        } else if (status === "failed") {
          setFormMsg({
            detail: data.error,
          });
        }
        setTimeout(
          () =>
            setFormMsg({
              detail: "",
            }),
          2000
        );
      })
      .catch((err) => console.log(err));
  };

  if (!userId || !accessToken) {
    return (
      <p>
        You are not logged in.<Link to="/account/login/">Log in</Link>
      </p>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Update profile
        </h2>
        <form onSubmit={handleSubmit}>
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
                value={userData.username}
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
                value={userData.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                readOnly
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                onChange={handleChange}
                value={userData.phoneNumber}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserDetailPage;
