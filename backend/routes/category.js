const express = require('express');
const router = express.Router();

const Category = require('../models/category');

/**
 * @swagger
 * /categories:
 *    get:
 *      summary: This should return all event categories
 */

router.get("/", (req, res) => {
    Category.find({}).then(categories => {
      res.status(200).json({
        message: "Categories fetched successfully!",
        data: categories
      });
    });
  }
);

module.exports = router;
