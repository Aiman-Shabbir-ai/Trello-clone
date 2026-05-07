const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    tags: Array,
    dueDate: String,
    commentList: Array,
    assignees: Array,
    checklist: Array,
    done: Boolean,
  },
  { _id: false }
);

const columnSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    cards: [cardSchema],
  },
  { _id: false }
);

const boardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    boardTitle: {
      type: String,
      required: true,
      default: 'Board',
    },
    backgroundColor: {
      type: String,
      default: 'violet',
    },
    columns: {
      type: [columnSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
