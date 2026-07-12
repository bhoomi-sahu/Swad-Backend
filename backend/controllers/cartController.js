const Cart =
  require("../models/Cart");

const Food =
  require("../models/Food");

// ADD TO CART
const addToCart =
async (req, res) => {

  try {

    const {
      foodId,
      quantity,
    } = req.body;

    const food =
      await Food.findById(foodId)
        .select("sellerId");

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    let cart =
      await Cart.findOne({
        userId:req.user._id,
      }).populate("items.foodId");

    // CREATE CART
    if (!cart) {

      cart =
        await Cart.create({
          userId:req.user._id,
          items:[],
        });

      cart.items = [];

    }

    // CHECK ITEM EXISTS
    const itemIndex =
      cart.items.findIndex(
        item =>
          item.foodId.toString() ===
          foodId
      );

    // UPDATE QUANTITY
    if (itemIndex > -1) {

      cart.items[itemIndex]
        .quantity += quantity;

    } else {

      // ADD NEW ITEM
      cart.items.push({
        foodId,
        quantity,
      });

    }

    await cart.save();

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};

// GET CART
const getCart =
async (req, res) => {

  try {

    const cart =
      await Cart.findOne({
        userId:req.user._id,
      }).populate({
        path:"items.foodId",
        populate:{
          path:"sellerId",
          select:"name",
        },
      });

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};

// REMOVE ITEM
const removeFromCart =
async (req, res) => {

  try {

    const cart =
      await Cart.findOne({
        userId:req.user._id,
      });

    if (!cart) {

      return res.status(404).json({
        message:"Cart not found",
      });

    }

    cart.items =
      cart.items.filter(
        item =>
          item.foodId.toString() !==
          req.params.foodId
      );

    await cart.save();

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};

// UPDATE QUANTITY
const updateQuantity =
async (req, res) => {

  try {

    const {
      foodId,
      quantity,
    } = req.body;

    const cart =
      await Cart.findOne({
        userId:req.user._id,
      });

    if (!cart) {

      return res.status(404).json({
        message:"Cart not found",
      });

    }

    const item =
      cart.items.find(
        item =>
          item.foodId.toString() ===
          foodId
      );

    if (!item) {

      return res.status(404).json({
        message:"Item not found",
      });

    }

    // REMOVE IF QUANTITY <= 0
    if (quantity <= 0) {

      cart.items =
        cart.items.filter(
          item =>
            item.foodId.toString() !==
            foodId
        );

    } else {

      item.quantity = quantity;

    }

    await cart.save();

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};

module.exports = {

  addToCart,

  getCart,

  removeFromCart,

  updateQuantity,

};