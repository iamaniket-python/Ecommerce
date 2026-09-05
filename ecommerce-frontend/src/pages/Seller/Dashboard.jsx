import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellerDashboard } from "../../api/sellerApi";
import "../../css/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerDashboard()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-text">Loading dashboard...</p>;
  if (!stats) return <p className="status-text">Could not load dashboard.</p>;

  const cards = [
    { label: "Today's Orders", value: stats.today_orders },
    { label: "Pending Orders", value: stats.pending_orders },
    { label: "Today's Revenue", value: `₹${stats.today_revenue}` },
    { label: "Monthly Revenue", value: `₹${stats.monthly_revenue}` },
    { label: "Published Products", value: stats.published_products },
    { label: "Draft Products", value: stats.draft_products },
    { label: "Low Inventory", value: stats.low_inventory },
    { label: "Out of Stock", value: stats.out_of_stock },
  ];

  return (
    <div className="container seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/seller/products" className="dashboard-link-btn">My Products</Link>
          <Link to="/seller/products/add" className="dashboard-add-btn">+ Add Product</Link>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.label}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;