const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');

const router = express.Router();

// All board endpoints require a valid JWT.
router.use(authMiddleware);

router.get('/', getBoards);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

module.exports = router;
