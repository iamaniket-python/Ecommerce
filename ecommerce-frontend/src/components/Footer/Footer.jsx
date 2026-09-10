import { Link } from "react-router-dom";
import "../../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3 className="footer-logo">MyShop</h3>
          <p className="footer-about">
            Your one-stop destination for quality products at the best prices. Shop with trust.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <div className="footer-col">
          <h4>For Sellers</h4>
          <Link to="/register">Become a Seller</Link>
          <Link to="/seller/dashboard">Seller Dashboard</Link>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>aniketsrivastava57@gmail.com</p>
          <p>+91 7979922872</p>
          <p>Begusarai, Bihar, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Developed And Managed By Aniket Shrivastava</p>
      </div>
    </footer>
  );
}

export default Footer;