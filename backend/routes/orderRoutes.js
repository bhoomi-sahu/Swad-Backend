const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const {

  placeOrder,

  getMyOrders,

  getSellerOrders,

  updateOrderStatus,

  addOrderReview,

} = require(
  "../controllers/orderController"
);

// PLACE ORDER
router.post(
  "/place",
  protect,
  placeOrder
);

// USER ORDERS
router.get(
  "/my",
  protect,
  getMyOrders
);

// SELLER ORDERS
router.get(
  "/seller-orders",
  protect,
  getSellerOrders
);

// UPDATE STATUS
router.put(
  "/:id/status",
  protect,
  updateOrderStatus
);

// ADD REVIEW
router.put(
  "/:id/review",
  protect,
  addOrderReview
);

module.exports =
  router;