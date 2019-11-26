const express = require('express');
const router = express.Router();
const Event = require('../models/event');

/**
 * @swagger
 * path
 *  /events:
 *    get:
 *      summary: This should return all events for one month
 *      parameters:
 *        - in: path
 *          name: month
 *          schema:
 *            type: integer
 *          required: false
 *          description: number of month
 *        - in: path
 *          name: year
 *          schema:
 *            type: integer
 *          required: false
 *          description: number of year
 */
router.get("/:month?:year?", (req, res) => {
  const month = req.query.month ? Number(req.query.month) : new Date().getMonth()+1;
  const year = req.query.year ? Number(req.query.year) : new Date().getMonth();

  Event.find({
    status: 'published',
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

/**
 * @swagger
 * path
 *  /events:
 *    delete:
 *      summary: This should delete event by ID
 *      parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of event that have to be deleted
 */
router.delete("/", (req, res) => {
  Event.findByIdAndRemove(req.query.id, (err, event) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json({
      message: "Event successfully deleted!",
      id: event._id
    })
  })
});

/**
 * @swagger
 * path
 *  /events:
 *    put:
 *      summary: This should update event by ID
 *      parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of event that have to be deleted
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/models/event/Event'
 */

router.put("/", (req, res) => {
  Event.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, newEvent) => {
    if (err) return res.status(500).send(err);
    return res.json({
      message: "Event was updated successfully!",
      event: newEvent
    })
  } )
});

/**
 * @swagger
 * paths:
 *  /events:
 *    post
 *      summary: Add a new Event
 *      requestBody:
 *        description: event data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/models/event/Event'
 *     responses: '201':
 *       description: Event Created
 */
 router.post("/", (req, res) => {
  const startDate = new Date(...Object.values(req.body.startDate));
  const endDate = new Date(...Object.values(req.body.endDate));
  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    startDate: startDate,
    endDate: endDate,
  });
  newEvent.save((err, event) => {
    if (err) return res.status(500).send(err);
    Event.populate(event, {path: "category"}, (err, event) => {
      return res.status(201).json({
        message: "Event was created successfully!",
        event: event
      });
    } );

  })
});

module.exports = router;
