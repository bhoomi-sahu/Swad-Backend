const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },

        quantity: Number,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    deliveryType: {
      type: String,
      enum: ["self", "delivery"],
      default: "self",
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      default: "Pending",
    },
       
    paymentMethod:{
  type:String,
  default:"COD",
},

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    paymentReference: {
      type: String,
    },

    orderInstructions: {
      type: String,
      default: "",
    },

    reviewRating: {
      type: Number,
    },

    reviewComment: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
    },

    deliveryAddress: {
      type: String,
      required: function() {
        return this.deliveryType === "delivery";
      }
    },

    deliveryLat: {
      type: Number,
    },

    deliveryLng: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("Order", orderSchema);