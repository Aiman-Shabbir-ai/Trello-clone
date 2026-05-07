const Board = require('../models/Board');

/**
 * GET /api/boards
 * Return only boards owned by the logged-in user.
 */
async function getBoards(req, res) {
  try {
    const boards = await Board.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    return res.json(boards);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch boards.' });
  }
}

/**
 * POST /api/boards
 * Create a board for the logged-in user.
 */
async function createBoard(req, res) {
  try {
    const { boardTitle, backgroundColor, columns } = req.body;

    const board = await Board.create({
      userId: req.user.userId,
      boardTitle: boardTitle || 'Board',
      backgroundColor: backgroundColor || 'violet',
      columns: Array.isArray(columns) ? columns : [],
    });

    return res.status(201).json(board);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create board.' });
  }
}

/**
 * PUT /api/boards/:id
 * Update a board only if it belongs to the logged-in user.
 */
async function updateBoard(req, res) {
  try {
    const { boardTitle, backgroundColor, columns } = req.body;
    const updates = {};

    // Accept only known fields from Trello frontend payload.
    if (typeof boardTitle === 'string') updates.boardTitle = boardTitle;
    if (typeof backgroundColor === 'string') updates.backgroundColor = backgroundColor;
    if (Array.isArray(columns)) updates.columns = columns;

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found.' });
    }

    return res.json(updatedBoard);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update board.' });
  }
}

/**
 * DELETE /api/boards/:id
 * Delete a board only if it belongs to the logged-in user.
 */
async function deleteBoard(req, res) {
  try {
    const deletedBoard = await Board.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedBoard) {
      return res.status(404).json({ message: 'Board not found.' });
    }

    return res.json({ message: 'Board deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete board.' });
  }
}

module.exports = {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
