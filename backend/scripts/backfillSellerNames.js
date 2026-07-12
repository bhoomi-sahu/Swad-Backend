const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
require("../models/User");
const Food = require("../models/Food");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const foods = await Food.find({ sellerId: { $exists: true, $ne: null } }).populate(
    "sellerId",
    "name"
  );

  let updatedCount = 0;
  let skippedCount = 0;

  for (const food of foods) {
    const sellerName = food.sellerId?.name?.trim();

    if (!sellerName) {
      skippedCount += 1;
      continue;
    }

    const currentSellerName = String(food.sellerName || "").trim();

    if (currentSellerName !== sellerName) {
      food.sellerName = sellerName;
      await food.save();
      updatedCount += 1;
    }
  }

  console.log(`Updated ${updatedCount} food record(s).`);

  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} food record(s) without a seller name.`);
  }
}

run()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error(disconnectError);
    }

    process.exit(1);
  });
