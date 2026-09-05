import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function SellerRoute({ children }) {
  const { isAuthenticated, user, authChecked } = useSelector((state) => state.auth);
  const hasToken = localStorage.getItem("access_token");

  if (hasToken && !authChecked) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default SellerRoute;