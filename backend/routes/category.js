const express = require('express');
const router = express.Router();

const Category = require('../models/category');

/**
 * @swagger
 * /categories:
 *    get:
 *      summary: This should return all categories
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

/**
 * @swagger
 * paths:
 *  /categories:
 *    post
 *      summary: Add a new category
 *      requestBody:
 *        description: category data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/models/category/Category'
 *     responses: '201':
 *       description: Category Created
 */

router.post("/", (req, res) => {
  const newCategory = new Category(req.body);
  newCategory.save((err, category) => {
    if (err) return res.status(500).send(err);
    return res.status(201).json({
      message: "Category was created successfully!",
      category: category
    });
  })
});

/**
 * @swagger
 * path
 *  /categories:
 *    delete:
 *      summary: This should delete category by ID
 *      parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of category that have to be deleted
 */

router.delete("/", (req, res) => {
  Event.findByIdAndRemove(req.query.id, (err, category) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json({
      message: "Category successfully deleted!",
      id: category._id
    })
  })
});

/**
 * @swagger
 * path
 *  /events:
 *    put:
 *      summary: This should update category by ID
 *      parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of category that have to be deleted
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/models/category/Category'
 */

router.put("/", (req, res) => {
  Category.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, newCategory) => {
    if (err) return res.status(500).send(err);
    return res.json({
      message: "Category was updated successfully!",
      category: newCategory
    })
  })
});
module.exports = router;
