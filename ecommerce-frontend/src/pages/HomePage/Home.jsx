import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../../redux/slices/productsSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategoryIcons from "../../components/CategoryIcons/CategoryIcons";
import "../../css/Home.css";

function Home() {
  const dispatch = useDispatch();
  const { list, categories, loading, error } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;

    const timer = setTimeout(() => {
      dispatch(fetchProducts(params));
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, search, selectedCategory]);

  return (
    <div className="home-page">
      <HeroBanner />

      <div className="container">
        <CategoryIcons
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="status-text">Loading products...</p>}
        {error && <p className="status-text error">Something went wrong.</p>}
        {!loading && list.length === 0 && <p className="status-text">No products found.</p>}

        <div className="products-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;