import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seller",
    phone: "",
    whatsapp: "",
    address: "",
    bio: "",
    gender: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      return alert("Password must contain at least 8 characters");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      alert("Registration successful");
      navigate(form.role === "seller" ? "/seller" : "/");
    } catch (error) {
      alert(error.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Seller Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 mb-4 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 mb-4 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 mb-4 rounded"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border p-3 mb-4 rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 mb-4 rounded"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 mb-4 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="seller">Seller</option>
          <option value="user">Customer</option>
        </select>

        {form.role === "seller" && (
          <>
            <input
              type="text"
              placeholder="WhatsApp Number"
              className="w-full border p-3 mb-4 rounded"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />

            <input
              type="text"
              placeholder="Address"
              className="w-full border p-3 mb-4 rounded"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <textarea
              placeholder="Bio"
              className="w-full border p-3 mb-4 rounded"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </>
        )}

        <button className="w-full bg-orange-500 text-white py-3 rounded">Register</button>
      </form>
    </div>
  );
}
