exports.reverseGeocode = async (req, res) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        message: "Geoapify API key is missing",
      });
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=en&apiKey=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: errorText || "Unable to fetch address",
      });
    }

    const data = await response.json();
    const feature = data.features?.[0];
    const properties = feature?.properties || {};

    const resolvedAddress = properties.formatted || properties.address_line1 || properties.address_line2 || properties.name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

    const lat = Number(feature?.geometry?.coordinates?.[1] || latitude);
    const lng = Number(feature?.geometry?.coordinates?.[0] || longitude);

    return res.json({
      address: resolvedAddress,
      lat,
      lng,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.searchAddress = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!query || query.length < 3) {
      return res.json({ results: [] });
    }

    if (!apiKey) {
      return res.status(500).json({
        message: "Geoapify API key is missing",
      });
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=en&limit=5&apiKey=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: errorText || "Unable to search address",
      });
    }

    const data = await response.json();

    const results = (data.features || []).map((item) => ({
      display_name: item.properties?.formatted || item.properties?.address_line1 || item.properties?.name || query,
      lat: Number(item.geometry?.coordinates?.[1]),
      lng: Number(item.geometry?.coordinates?.[0]),
    }));

    return res.json({ results });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};