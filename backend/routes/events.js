const express = require('express');
const router = express.Router();
const Event = require('../models/event');

/**
 * @swagger
 * /events:
 *    get:
 *      description: This should return all events
 */

router.get("/", (req, res) => {
  Event.find({})
    .populate("category", ["name", "color"])
    .then(documents => {
      res.status(200).json({
        message: "Events fetched successfully!",
        events: documents
      });
    });
});

module.exports = router;
