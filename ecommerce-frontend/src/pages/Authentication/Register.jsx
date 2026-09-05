import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, clearError } from "../../redux/slices/authSlice";
import "../../css/Login.css";
function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "customer",
    phone: "",
    address: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && (
          <div className="error-box">
            {typeof error === "object"
              ? Object.values(error).flat().join(" ")
              : error}
          </div>
        )}
        {successMsg && <div className="success-box">{successMsg}</div>}

        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="password2" value={formData.password2} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>I am a</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea name="address" rows="2" value={formData.address} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;