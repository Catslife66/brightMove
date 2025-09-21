import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAccount } from "../feature/account/AccountSlice";
import { Spinner } from "flowbite-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("access");
  const agentStatus = localStorage.getItem("isAgent");
  const isAgent = agentStatus === "true";
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId && accessToken) {
      fetchUser();
    } else {
      navigate("/admin/login");
    }

    async function fetchUser() {
      try {
        const data = await dispatch(
          fetchAccount({ userId, isAgent, accessToken })
        ).unwrap();
        setUser(data);
        setIsLoading(false);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("isAgent");
        console.log(err);
      }
    }
  }, [userId, accessToken, isAgent, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <div>Error loading user data.</div>;
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex max-w-screen-xl justify-between items-center mx-auto">
          <Link to="/" className="flex items-center justify-between mr-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              BrightMove
            </span>
          </Link>
          <div>{user && user.company_name}</div>
        </div>
      </nav>

      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          <ul className="space-y-2">
            <li>
              <Link
                to={
                  user && user.user.is_agent
                    ? "admin/profile"
                    : "/account/profile"
                }
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">
                  {user && user.user.is_agent
                    ? "Company Profile"
                    : "My Profile"}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={
                  user && user.user.is_agent
                    ? "/admin/property"
                    : "/account/wishlist"
                }
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">
                  {user && user.user.is_agent
                    ? "Manage Property"
                    : "Saved Property"}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
