import { Link } from "react-router-dom";
import "../../css/ProductCard.css";

function ProductCard({ product }) {
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}
        {hasDiscount && <span className="discount-badge">Sale</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-seller">by {product.owner_username}</p>

        <div className="product-price-row">
          <span className="product-price">₹{product.final_price}</span>
          {hasDiscount && <span className="product-original-price">₹{product.price}</span>}
        </div>

        {product.stock === 0 ? (
          <span className="stock-status out">Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span className="stock-status low">Only {product.stock} left</span>
        ) : (
          <span className="stock-status in">In Stock</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;