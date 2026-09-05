import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, getProductById, getCategories } from "../../api/productsApi";
import "../../css/ProductForm.css";

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount_price: "",
    stock: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.results || res.data));

    if (isEdit) {
      getProductById(id).then((res) => {
        const p = res.data;
        setFormData({
          name: p.name || "",
          description: p.description || "",
          category: p.category || "",
          price: p.price || "",
          discount_price: p.discount_price || "",
          stock: p.stock || "",
          status: p.status || "draft",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...formData,
      category: formData.category || null,
      discount_price: formData.discount_price || null,
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/seller/products");
    } catch (err) {
      setError(
        err.response?.data
          ? Object.values(err.response.data).flat().join(" ")
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container product-form-page">
      <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        {error && <div className="error-box">{error}</div>}

        <div className="form-group">
          <label>Product Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Discount Price (₹)</label>
            <input type="number" step="0.01" name="discount_price" value={formData.discount_price} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;