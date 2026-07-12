const express =
  require("express");

const router =
  express.Router();

const Message =
  require("../models/Message");


// GET ROOM MESSAGES

router.get(
  "/:roomId",
  async (req, res) => {

    try {

      const messages =
        await Message.find({

          roomId:
            req.params.roomId,

        }).sort({
          createdAt: 1,
        });

      res.json(messages);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);


// SAVE MESSAGE

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        roomId,
        sender,
        text,
        orderId,
      } = req.body;

      const message =
        await Message.create({

          roomId,

          sender,

          text,

          orderId: orderId || "",

        });

      res.status(201).json(
        message
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

module.exports =
  router;