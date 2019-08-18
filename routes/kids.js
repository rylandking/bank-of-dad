const express = require('express');
const router = express.Router();

// @route    GET /kids
// @desc     Get all parent's kids
// @access   Private
router.get('/', (req, res) => {
  res.send(`Get all kids.`);
});

// @route    POST /kids
// @desc     Add new kids
// @access   Private
router.post('/', (req, res) => {
  res.send(`Add kid.`);
});

// @route    PUT /kids/:id
// @desc     Update kid
// @access   Private
router.put('/:id', (req, res) => {
  res.send(`Update kid.`);
});

// @route    DELETE /kids/:id
// @desc     Delete kid
// @access   Private
router.delete('/:id', (req, res) => {
  res.send(`Delete kid.`);
});

module.exports = router;
