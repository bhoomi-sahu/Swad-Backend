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
      role,
      phone,
      whatsapp,
      address,
      bio,
    } = req.body;

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({

        name,
        email,

        password:
          hashedPassword,

        role,

        phone:
          phone || "",

        whatsapp:
          whatsapp || "",

        address:
          address || "",

        bio:
          bio || "",

      });

    res.status(201).json({

      _id:
        user._id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      phone:
        user.phone,

      whatsapp:
        user.whatsapp,

      address:
        user.address,

      bio:
        user.bio,

      token:
        generateToken(
          user._id
        ),

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
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

      _id:
        user._id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      phone:
        user.phone,

      whatsapp:
        user.whatsapp,

      address:
        user.address,

      bio:
        user.bio,

      profileImage:
        user.profileImage,

      token:
        generateToken(
          user._id
        ),

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