import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UserLoginForm from "./feature/account/UserLoginForm";
import UserRegisterForm from "./feature/account/UserRegisterForm";
import UserProfilePage from "./feature/account/UserProfilePage";
import UserWishlist from "./feature/wishlist/UserWishlist";
import PropertyDetailPage from "./feature/property/PropertyDetailPage";
import Layout from "./components/Layout";
import { fetchAccount } from "./feature/account/AccountSlice";
import Home from "./pages/Homepage";
import PropertySearchResult from "./feature/property/PropertySearchResult";
import SigninLayout from "./components/SigninLayout";
import Dashboard from "./components/DashboardLayout";
import AgentLoginForm from "./feature/account/AgentLoginForm";
import AgentProfilePage from "./feature/account/AgentProfilePage";
import PropertyManager from "./feature/admin/PropertyManager";
import UpdatePropertyForm from "./feature/admin/UpdatePropertyForm";
import PropertyImageManager from "./feature/admin/PropertyImageManager";
import AddProertyImageForm from "./feature/admin/AddProertyImageForm";
import AddProperyForm from "./feature/admin/AddPropertyForm";
import ArticleDetailPage from "./feature/article/ArticleDetailPage";

function App() {
  const userId = localStorage.getItem("userId" || "");
  const accessToken = localStorage.getItem("access" || "");
  const agentStatus = localStorage.getItem("isAgent");
  const isAgent = agentStatus === "true";
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && accessToken) {
      dispatch(fetchAccount({ userId, isAgent, accessToken }))
        .unwrap()
        .then(() => {})
        .catch((err) => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("userName");
          localStorage.removeItem("userId");
          localStorage.removeItem("isAgent");
        });
    }
  }, [userId, accessToken, isAgent, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="property">
          <Route path=":propertyId" element={<PropertyDetailPage />} />
          <Route path="search" element={<PropertySearchResult />} />
        </Route>
        <Route path="article">
          <Route path=":articleId" element={<ArticleDetailPage />} />
        </Route>
      </Route>
      <Route path="account" element={<SigninLayout />}>
        <Route path="login" element={<UserLoginForm />} />
        <Route path="register" element={<UserRegisterForm />} />
      </Route>
      <Route path="account" element={<Dashboard />}>
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="wishlist" element={<UserWishlist />} />
      </Route>
      <Route path="admin" element={<SigninLayout />}>
        <Route path="login" element={<AgentLoginForm />} />
      </Route>
      <Route path="admin" element={<Dashboard />}>
        <Route path="property" element={<PropertyManager />} />
        <Route path="property/add" element={<AddProperyForm />} />
        <Route
          path="property/:propertyId/images"
          element={<PropertyImageManager />}
        />
        <Route
          path="property/:propertyId/images/upload"
          element={<AddProertyImageForm />}
        />
        <Route
          path="property/update/:propertyId"
          element={<UpdatePropertyForm />}
        />
        <Route path="profile" element={<AgentProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
