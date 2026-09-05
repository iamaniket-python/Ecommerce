import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/productsApi";
import "../../css/MyProducts.css";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    getProducts({ mine: true })
      .then((res) => setProducts(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  if (loading) return <p className="status-text">Loading products...</p>;

  return (
    <div className="container my-products-page">
      <div className="page-header">
        <h1>My Products</h1>
        <Link to="/seller/products/add" className="dashboard-add-btn">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <p className="status-text">You haven't added any products yet.</p>
      ) : (
        <div className="products-table">
          <div className="table-header">
            <span>Name</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {products.map((p) => (
            <div className="table-row" key={p.id}>
              <span>{p.name}</span>
              <span>₹{p.final_price}</span>
              <span>{p.stock}</span>
              <span>
                <span className={`status-badge ${p.status}`}>{p.status}</span>
              </span>
              <span className="row-actions">
                <Link to={`/seller/products/edit/${p.id}`}>Edit</Link>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;