import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { getImageUrl } from "../utils/image";

const DISH_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Fast Food", "Dessert", "Drinks", "Veg", "Non-Veg"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  quantity: "1",
  category: "Dinner",
  image: null,
  whatsappNumber: "",
  address: "",
};

export default function Seller() {
  const { user } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (user?.token) {
      fetchFoods();
      fetchOrders();
    }
  }, [user?.token]);

  const fetchFoods = async () => {
    try {
      const { data } = await API.get("/foods/seller", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFoods(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/seller-orders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPreview("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const submitFood = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.category) {
      return alert("Please fill all required food fields");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity || 1);
    formData.append("category", form.category);
    formData.append("whatsappNumber", form.whatsappNumber);
    formData.append("address", form.address);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await API.put(`/foods/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Dish updated successfully");
      } else {
        await API.post("/foods/add", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Dish added successfully");
      }
      resetForm();
      fetchFoods();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Dish operation failed");
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    setForm({
      title: food.title || food.dishName || "",
      description: food.description || "",
      price: food.price || "",
      quantity: food.quantity || 1,
      category: food.category || "Dinner",
      image: null,
      whatsappNumber: food.whatsappNumber || "",
      address: food.address || "",
    });
    setPreview(getImageUrl(food.image || food.imageUrl));
  };

  const deleteFood = async (id) => {
    const confirmed = window.confirm("Do you want to delete this dish?");
    if (!confirmed) return;

    try {
      await API.delete(`/foods/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Dish deleted successfully");
      fetchFoods();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete dish");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const totalQuantity = foods.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-8 rounded-2xl bg-orange-500 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Seller"}</h1>
          <p className="mt-2 text-orange-50">Manage your dishes, track orders, and grow your kitchen business.</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">My Dishes</p>
            <p className="text-2xl font-bold">{foods.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="text-2xl font-bold">{totalQuantity}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Active Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{editingId ? "Edit Dish" : "Add New Dish"}</h2>
            {editingId && <button onClick={resetForm} className="text-sm text-orange-500">Cancel</button>}
          </div>

          <form onSubmit={submitFood} className="grid gap-4 md:grid-cols-2">
            <input className="border p-3 rounded" placeholder="Dish Name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="border p-3 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              {DISH_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input className="border p-3 rounded" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="border p-3 rounded" type="number" placeholder="Available Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <input className="border p-3 rounded" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} />
            <input className="border p-3 rounded" placeholder="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
            <textarea className="border p-3 rounded md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <textarea className="border p-3 rounded md:col-span-2" rows="2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

            <div className="md:col-span-2">
              {preview ? <img src={preview} alt="Preview" className="h-40 w-full rounded object-cover" /> : <div className="rounded border border-dashed p-4 text-sm text-gray-500">Image preview will appear here.</div>}
            </div>

            <button className="md:col-span-2 rounded bg-orange-500 py-3 text-white">{editingId ? "Update Dish" : "Add Dish"}</button>
          </form>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">My Dishes</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {foods.map((food) => (
              <div key={food._id} className="overflow-hidden rounded-2xl bg-white shadow">
                <img src={getImageUrl(food.image || food.imageUrl)} alt={food.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{food.title}</h3>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-600">{food.category}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{food.description}</p>
                  <p className="mt-3 font-bold text-orange-500">₹{food.price}</p>
                  <p className="text-sm text-gray-500">Qty: {food.quantity || 1}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => startEdit(food)} className="flex-1 rounded bg-blue-500 py-2 text-white">Edit</button>
                    <button onClick={() => deleteFood(food._id)} className="flex-1 rounded bg-red-500 py-2 text-white">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">Seller Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-white p-5 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{order.userId?.name}</h3>
                    <p className="text-sm text-gray-500">{order.userId?.email}</p>
                  </div>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-sm text-white">{order.orderStatus}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-2">
                      <span>{item.foodId?.title} × {item.quantity}</span>
                      <span>₹{item.foodId?.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => updateStatus(order._id, "Accepted")} className="rounded bg-blue-500 px-3 py-2 text-white">Accept</button>
                  <button onClick={() => updateStatus(order._id, "Preparing")} className="rounded bg-yellow-500 px-3 py-2 text-white">Preparing</button>
                  <button onClick={() => updateStatus(order._id, "Delivered")} className="rounded bg-green-500 px-3 py-2 text-white">Delivered</button>
                  <button onClick={() => updateStatus(order._id, "Cancelled")} className="rounded bg-red-500 px-3 py-2 text-white">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}