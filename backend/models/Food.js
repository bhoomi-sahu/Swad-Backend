const mongoose = require("mongoose");

const reviewSchema =
  new mongoose.Schema({

    userName: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);

const foodSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      dishName: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },

      image: {
        type: String,
        default: "",
      },

      imageUrl: {
        type: String,
        default: "",
      },

      category: {
        type: String,
        default: "Home Food",
      },

      sellerId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      sellerName: {
        type: String,
        default: "",
      },

      sellerPhone: {
        type: String,
        default: "",
      },

      whatsappNumber: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      rating: {
        type: Number,
        default: 0,
      },

      totalReviews: {
        type: Number,
        default: 0,
      },

      reviews: [
        reviewSchema,
      ],

    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Food",
    foodSchema
  );