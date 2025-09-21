import React from "react";
import { useDispatch } from "react-redux";
import { logoutAccount } from "./AccountSlice";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    const agentStatus = localStorage.getItem("isAgent");
    const isAgent = agentStatus === "true";

    dispatch(logoutAccount({ accessToken, refreshToken }))
      .unwrap()
      .then(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("isAgent");
      })
      .catch((err) => {
        console.log(err);
      });
    if (isAgent) {
      navigate("/account/agent/login");
    } else {
      navigate("/account/login");
    }
  };

  return (
    <button type="submit" className="dropdown-item" onClick={handleLogout}>
      Sign out
    </button>
  );
}
