const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        enum: [
          "user",
          "seller",
        ],
        default: "user",
      },

      // PROFILE IMAGE
      profileImage: {
        type: String,
        default: "",
      },

      // PHONE NUMBER
      phone: {
        type: String,
        default: "",
      },

      // WHATSAPP NUMBER
      whatsapp: {
        type: String,
        default: "",
      },

      // ADDRESS
      address: {
        type: String,
        default: "",
      },

      // BIO
      bio: {
        type: String,
        default: "",
      },

      // ONLINE STATUS
      isOnline: {
        type: Boolean,
        default: false,
      },

      // FAVORITE FOODS
      favorites: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
      ],

    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );