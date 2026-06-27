const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

// GENERATE TOKEN
const generateToken =
(id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

};

// REGISTER
const registerUser =
async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      whatsapp,
      whatsappNumber,
      address,
      bio,
      gender,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Name, email, password and phone are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    if (confirmPassword && confirmPassword !== password) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const emailExists =
      await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const phoneExists =
      await User.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        message: "Phone number already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "seller",
        gender: gender || "",
        phone: phone || "",
        whatsapp: whatsapp || whatsappNumber || "",
        whatsappNumber: whatsappNumber || whatsapp || "",
        address: address || "",
        bio: bio || "",
      });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      whatsapp: user.whatsapp,
      whatsappNumber: user.whatsappNumber,
      address: user.address,
      bio: user.bio,
      gender: user.gender,
      token: generateToken(user._id),
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// LOGIN
const loginUser =
async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({
        message:
          "Invalid Email",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid Password",
      });

    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      whatsapp: user.whatsapp,
      whatsappNumber: user.whatsappNumber,
      address: user.address,
      bio: user.bio,
      gender: user.gender,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

// PROFILE
const getProfile =
async (req, res) => {

  res.json(req.user);

};

module.exports = {

  registerUser,

  loginUser,

  getProfile,

};