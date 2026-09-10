import "../../css/CategoryIcons.css";

const categoryIcons = {
  electronics: "💻",
  fashion: "👕",
  grocery: "🛒",
  home: "🏠",
  beauty: "💄",
  books: "📚",
  toys: "🧸",
  sports: "⚽",
  default: "📦",
};

function getIcon(name) {
  const key = Object.keys(categoryIcons).find((k) =>
    name.toLowerCase().includes(k)
  );
  return categoryIcons[key] || categoryIcons.default;
}

function CategoryIcons({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-icons-section">
      <h3>What are you looking for?</h3>
      <div className="category-icons-row">
        <div
          className={`category-icon-item ${selectedCategory === "" ? "active" : ""}`}
          onClick={() => onSelect("")}
        >
          <div className="category-icon-circle">🛍️</div>
          <span>All</span>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-icon-item ${selectedCategory === String(cat.id) ? "active" : ""}`}
            onClick={() => onSelect(String(cat.id))}
          >
            <div className="category-icon-circle">{getIcon(cat.name)}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryIcons;