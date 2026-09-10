import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import LocationBar from "../LocationBar/LocationBar";
import "../../css/Navbar.css";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MyShop
        </Link>

        <LocationBar />

        <div className="navbar-links">
          <Link to="/">Home</Link>

          {isAuthenticated ? (
            <>
              {user?.role === "customer" && (
                <Link to="/cart" className="navbar-cart">
                  Cart
                  {items?.length > 0 && <span className="cart-badge">{items.length}</span>}
                </Link>
              )}

              {user?.role === "customer" && <Link to="/orders">My Orders</Link>}

              {user?.role === "seller" && <Link to="/seller/dashboard">Dashboard</Link>}
              {user?.role === "seller" && <Link to="/seller/products">My Products</Link>}

              <span className="navbar-username">Hi, {user?.username}</span>
              <button className="navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="navbar-register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;