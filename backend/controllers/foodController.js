const Food =
  require("../models/Food");

// ADD FOOD
const addFood =
async (req, res) => {

  try {

    const {
      title,
      dishName,
      description,
      price,
      category,
      quantity,
      whatsappNumber,
      address,
    } = req.body;

    const food =
      await Food.create({
        title: title || dishName || "",
        dishName: dishName || title || "",
        description,
        price: Number(price),
        category,
        quantity: Number(quantity || 1),
        image: req.file ? req.file.path : "",
        imageUrl: req.file ? req.file.path : "",
        sellerId: req.user._id,
        sellerName: req.user.name,
        sellerPhone: req.user.phone || "",
        whatsappNumber: whatsappNumber || req.user.whatsappNumber || req.user.whatsapp || "",
        address: address || req.user.address || "",
      });

    res.status(201).json(food);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// GET ALL FOODS
const getFoods =
async (req, res) => {

  try {

    const { search, category, city, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (city) filter.address = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const foods =
      await Food.find(filter)
        .sort({ createdAt: -1 })
        .populate(
          "sellerId",
          "name email phone whatsappNumber whatsapp bio address profileImage"
        );

    res.json(foods);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// GET SINGLE FOOD
const getSingleFood =
async (req, res) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      )

      .populate(
        "sellerId",
        "name email phone whatsapp bio address profileImage"
      );

    if (!food) {

      return res.status(404).json({

        message:
          "Food not found",

      });

    }

    res.json(food);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// ADD REVIEW
const addReview =
async (req, res) => {

  try {

    const {
      rating,
      comment,
    } = req.body;

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {

      return res.status(404).json({
        message:
          "Food not found",
      });

    }

    const review = {

      userName:
        req.user.name,

      rating:
        Number(rating),

      comment,

    };

    food.reviews.push(
      review
    );

    food.totalReviews =
      food.reviews.length;

    food.rating =

      food.reviews.reduce(

        (acc, item) =>
          acc + item.rating,

        0

      ) /

      food.reviews.length;

    await food.save();

    res.json(food);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// GET SELLER FOODS
const getSellerFoods =
async (req, res) => {

  try {

    const foods =
      await Food.find({

        sellerId:
          req.user._id,

      });

    res.json(foods);

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// UPDATE FOOD
const updateFood =
async (req, res) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {

      return res.status(404).json({
        message:
          "Food not found",
      });

    }

    if (
      food.sellerId.toString()
      !==
      req.user._id.toString()
    ) {

      return res.status(401).json({
        message:
          "Not authorized",
      });

    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
      updateData.imageUrl = req.file.path;
    }

    if (updateData.title && !updateData.dishName) {
      updateData.dishName = updateData.title;
    }

    const updatedFood =
      await Food.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new:true }
      );

    res.json(
      updatedFood
    );

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

// DELETE FOOD
const deleteFood =
async (req, res) => {

  try {

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {

      return res.status(404).json({
        message:
          "Food not found",
      });

    }

    if (
      food.sellerId.toString()
      !==
      req.user._id.toString()
    ) {

      return res.status(401).json({
        message:
          "Not authorized",
      });

    }

    await food.deleteOne();

    res.json({

      message:
        "Food deleted",

    });

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }

};

module.exports = {

  addFood,
  getFoods,
  getSingleFood,
  getSellerFoods,
  updateFood,
  deleteFood,
  addReview,

};