import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../api/productsApi";
import { addItemToCart } from "../../redux/slices/cartSlice";
import "../../css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setMessage("");
    const result = await dispatch(addItemToCart({ product: product.id, quantity }));
    if (addItemToCart.fulfilled.match(result)) {
      setMessage("Added to cart!");
    } else {
      setMessage(result.payload?.error || "Could not add to cart.");
    }
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!product) return null;

  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className="container product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0].image} alt={product.name} />
          ) : (
            <div className="product-image-placeholder">No Image</div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="seller-text">Sold by {product.owner_username}</p>

          <div className="price-row">
            <span className="price">₹{product.final_price}</span>
            {hasDiscount && <span className="original-price">₹{product.price}</span>}
          </div>

          <p className="description">{product.description || "No description available."}</p>

          {product.stock === 0 ? (
            <span className="stock-status out">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span className="stock-status low">Only {product.stock} left in stock</span>
          ) : (
            <span className="stock-status in">In Stock</span>
          )}

          {product.stock > 0 && user?.role !== "seller" && (
            <>
              <div className="quantity-row">
                <label>Quantity</label>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              {message && <p className="cart-message">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;