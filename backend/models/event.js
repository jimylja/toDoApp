const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String },
  description: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category' },
  status: {
    type: String,
    enum: ['published', 'draft'],
    required: true,
    default: 'published' },
  startDate: {
    type: Date,
    required: true },
  endDate: {
    type: Date,
    required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
