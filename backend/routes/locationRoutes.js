const express = require("express");

const router = express.Router();

const { reverseGeocode, searchAddress } = require("../controllers/locationController");

router.get("/reverse-geocode", reverseGeocode);
router.get("/search-address", searchAddress);

module.exports = router;