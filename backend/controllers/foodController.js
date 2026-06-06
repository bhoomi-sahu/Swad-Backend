const Food =
  require("../models/Food");

// ADD FOOD
const addFood =
async (req, res) => {

  try {

    const {
      title,
      description,
      price,
      category,
    } = req.body;

    const food =
      await Food.create({

        title,
        description,
        price,
        category,

        image:
          req.file
            ? req.file.path
            : "",

        sellerId:
          req.user._id,

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

    const foods =
      await Food.find()

      .populate(
        "sellerId",
        "name email phone whatsapp bio address profileImage"
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

    const updatedFood =
      await Food.findByIdAndUpdate(

        req.params.id,
        req.body,
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