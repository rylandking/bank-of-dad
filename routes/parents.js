const express = require('express');
const router = express.Router();

// @route    POST /parents
// @desc     Register a parent (user)
// @access   Public
router.post('/', (req, res) => {
  res.send(`Registers a parent.`);
});

module.exports = router;
