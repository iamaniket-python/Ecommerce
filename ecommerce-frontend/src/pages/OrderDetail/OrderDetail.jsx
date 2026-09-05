import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/ordersApi";
import "../../css/OrderDetail.css";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="status-text">Loading order...</p>;
  if (!order) return <p className="status-text">Order not found.</p>;

  return (
    <div className="container order-detail-page">
      <div className="order-success-banner">
        <h2>Order Placed Successfully!</h2>
        <p>Order #{order.id} · Status: {order.status}</p>
      </div>

      <div className="order-items">
        {order.items.map((item) => (
          <div className="order-item-row" key={item.id}>
            <span>{item.product_name} × {item.quantity}</span>
            <span>₹{item.subtotal}</span>
          </div>
        ))}
      </div>

      <div className="order-total-row">
        <span>Total Paid</span>
        <span>₹{order.total_amount}</span>
      </div>

      <p className="order-address">Shipping to: {order.shipping_address}</p>
    </div>
  );
}

export default OrderDetail;