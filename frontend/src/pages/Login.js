import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../services/api";

import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const { data } = await API.post(
        "/auth/login",
        form
      );

      login(data);

      alert("Login Success");
      navigate(from, { replace: true });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e)=>
            setForm({
              ...form,
              email:e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e)=>
            setForm({
              ...form,
              password:e.target.value
            })
          }
        />

        <button
          className="w-full bg-orange-500 text-white py-3 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}