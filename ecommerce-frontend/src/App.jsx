import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/HomePage/Home";
import Cart from "./pages/Cart/Cart";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Checkout from "./pages/Checkout/Checkout";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./pages/Seller/Dashboard";
import MyProducts from "./pages/Seller/MyProducts";
import ProductForm from "./pages/Seller/ProductForm";
import SellerRoute from "./routes/SellerRoute";
import { fetchCurrentUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/seller/dashboard" element={<SellerRoute><Dashboard /></SellerRoute>} />
        <Route path="/seller/products" element={<SellerRoute><MyProducts /></SellerRoute>} />
        <Route path="/seller/products/add" element={<SellerRoute><ProductForm /></SellerRoute>} />
        <Route path="/seller/products/edit/:id" element={<SellerRoute><ProductForm /></SellerRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;