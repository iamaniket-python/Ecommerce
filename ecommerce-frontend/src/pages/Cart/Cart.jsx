import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchCart, updateItemQuantity, removeItemFromCart } from "../../redux/slices/cartSlice";
import "../../css/Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total_price, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateItemQuantity({ id: itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeItemFromCart(itemId));
  };

  if (loading && items.length === 0) {
    return <p className="status-text">Loading cart...</p>;
  }

  if (!loading && items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.product_detail?.images?.length > 0 ? (
                  <img src={item.product_detail.images[0].image} alt={item.product_detail.name} />
                ) : (
                  <div className="cart-item-placeholder">No Image</div>
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.product_detail?.name}</h3>
                <p className="cart-item-price">₹{item.product_detail?.final_price} each</p>
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-subtotal">₹{item.subtotal}</div>

              <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total</span>
            <span className="summary-total">₹{total_price}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;