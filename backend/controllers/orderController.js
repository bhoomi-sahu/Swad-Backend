const Order = require("../models/Order");
const Cart = require("../models/Cart");


// PLACE ORDER
exports.placeOrder = async (req, res) => {

  try {

    const {
      deliveryType,
      paymentMethod,
      paymentStatus,
      paymentReference,
      orderInstructions,
      deliveryAddress,
      deliveryLat,
      deliveryLng,
    } = req.body;

    const cart = await Cart.findOne({
      userId: req.user._id,
    }).populate("items.foodId");

    if (!cart || cart.items.length === 0) {

      return res.status(400).json({
        message: "Cart is empty",
      });

    }

    const sellerGroups = cart.items.reduce((groups, item) => {
      const sellerId = String(item.foodId?.sellerId || "");

      if (!sellerId) {
        return groups;
      }

      if (!groups[sellerId]) {
        groups[sellerId] = [];
      }

      groups[sellerId].push(item);

      return groups;
    }, {});

    const sellerIds = Object.keys(sellerGroups);

    if (sellerIds.length === 0) {
      return res.status(400).json({
        message: "Cart items are missing seller information",
      });
    }

    const createdOrders = [];

    for (const sellerId of sellerIds) {
      const items = sellerGroups[sellerId];

      let orderTotal = 0;

      items.forEach((item) => {
        orderTotal += item.foodId.price * item.quantity;
      });

      let deliveryCharge = 0;
      if (deliveryType === "delivery") {
        deliveryCharge = 40;
      }

      orderTotal += deliveryCharge;

      const order = await Order.create({
        userId: req.user._id,
        sellerId,
        items: items.map((item) => ({
          foodId: item.foodId._id,
          quantity: item.quantity,
        })),
        totalPrice: orderTotal,
        deliveryType,
        deliveryCharge,
        paymentMethod,
        paymentStatus,
        paymentReference,
        orderInstructions,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
      });

      createdOrders.push(order);
    }

    // CLEAR CART
    cart.items = [];

    await cart.save();

    res.status(201).json({
      orders: createdOrders,
      orderCount: createdOrders.length,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// USER ORDERS
exports.getMyOrders = async (req, res) => {

  try {

    const orders =
      await Order.find({
        userId: req.user._id,
      })
      .populate("items.foodId")
      .populate(
        "sellerId",
        "name email phone whatsapp whatsappNumber bio address profileImage"
      );

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// SELLER ORDERS
exports.getSellerOrders = async (req, res) => {

  try {

    const orders =
      await Order.find({
        sellerId: req.user._id,
      })
      .populate("items.foodId")
      .populate(
        "userId",
        "name email"
      );

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// UPDATE ORDER STATUS
exports.updateOrderStatus =
async (req, res) => {

  try {

    const { status } =
      req.body;

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        message:
          "Order not found",
      });

    }

    // SELLER CHECK
    if (
      order.sellerId.toString()
      !==
      req.user._id.toString()
    ) {

      return res.status(401).json({
        message:
          "Not authorized",
      });

    }

    order.orderStatus =
      status;

    await order.save();

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};


// ADD ORDER REVIEW
exports.addOrderReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.userId) {
      return res.status(400).json({
        message: "This order cannot be reviewed",
      });
    }

    if (String(order.userId) !== String(req.user._id)) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (!Number(rating) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const completedStatuses = ["delivered", "completed"];
    if (!completedStatuses.includes(String(order.orderStatus || "").toLowerCase())) {
      return res.status(400).json({
        message: "You can review only completed orders",
      });
    }

    order.reviewRating = Number(rating);
    order.reviewComment = String(comment || "").trim();
    order.reviewedAt = new Date();

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("items.foodId")
      .populate(
        "sellerId",
        "name email phone whatsapp whatsappNumber bio address profileImage"
      );

    res.json(updatedOrder);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

