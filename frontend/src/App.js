import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Seller from "./pages/Seller";
import Chat from "./pages/Chat";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import FoodDetails from "./pages/FoodDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/food/:id"
          element={<FoodDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/chat/:roomId" element={<Chat />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller" element={<Seller />} />
        </Route>

      </Routes>

    </BrowserRouter>

  );
}