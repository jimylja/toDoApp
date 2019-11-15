const express = require('express');
const router = express.Router();
const Event = require('../models/event');

/**
 * @swagger
 * /events:
 *    get:
 *      description: This should return all events for one month
 */

router.get("/:month?:year?", (req, res) => {
  const month = req.query.month ? Number(req.query.month) : new Date().getMonth()+1;
  const year = req.query.year ? Number(req.query.year) : new Date().getMonth();

  Event.find({
    startDate: {
      $gt: new Date(year, month,1, 0, 0),
      $lt: new Date(year,month+1,0, 23, 59)}
    })
    .populate("category", ["name", "color"])
    .then(documents => {
      res.status(200).json({
        message: "Events fetched successfully!",
        events: documents
      });
    });
});

router.delete("/", (req, res) => {
  Event.findByIdAndRemove(req.query.id, (err, event) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json({
      message: "Event successfully deleted!",
      id: event._id
    })
  })
});

router.put("/", (req, res) => {
  Event.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, newEvent) => {
    if (err) return res.status(500).send(err);
    return res.json({
      message: "Event was updated successfully!",
      event: newEvent
    })
  } )
});

module.exports = router;
