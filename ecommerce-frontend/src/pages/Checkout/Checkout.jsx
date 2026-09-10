import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/ordersApi";
import { createPayment, verifyPayment } from "../../api/paymentsApi";
import { fetchCart } from "../../redux/slices/cartSlice";
import "../../css/Checkout.css";

function Checkout() {
  const { items, total_price } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address_line: user?.address || "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setError("");

    const required = ["full_name", "email", "phone", "address_line", "city", "state", "pincode"];
    const missing = required.filter((f) => !formData[f].trim());
    if (missing.length > 0) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await createOrder(formData);
      const order = orderRes.data.data;

      const paymentRes = await createPayment(order.id);
      const paymentData = paymentRes.data.data;

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "MyShop",
        description: `Payment for Order #${order.id}`,
        order_id: paymentData.razorpay_order_id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(fetchCart());
            navigate(`/orders/${order.id}`);
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#667eea" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <p className="status-text">Your cart is empty.</p>;
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-address">
          <h3>Contact & Shipping Details</h3>

          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea rows="3" name="address_line" placeholder="House no, street, locality" value={formData.address_line} onChange={handleChange} required />
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>{item.product_detail?.name} × {item.quantity}</span>
              <span>₹{item.subtotal}</span>
            </div>
          ))}
          <div className="summary-total-row">
            <span>Total</span>
            <span>₹{total_price}</span>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Processing..." : "Place Order & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;