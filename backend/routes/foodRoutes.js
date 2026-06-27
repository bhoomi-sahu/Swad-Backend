const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const foodController =
  require("../controllers/foodController");

// GET ALL FOODS
router.get(
  "/",
  foodController.getFoods
);

// SELLER FOODS
router.get(
  "/seller",
  protect,
  foodController.getSellerFoods
);

// GET SINGLE FOOD
router.get(
  "/:id",
  foodController.getSingleFood
);

// ADD REVIEW
router.post(
  "/:id/review",
  protect,
  foodController.addReview
);

// ADD FOOD
router.post(
  "/add",
  protect,
  upload.single("image"),
  foodController.addFood
);

// UPDATE FOOD
router.put(
  "/:id",
  protect,
  upload.single("image"),
  foodController.updateFood
);

// DELETE FOOD
router.delete(
  "/:id",
  protect,
  foodController.deleteFood
);

module.exports =
  router;