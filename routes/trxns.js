const express = require('express');
const router = express.Router();

// @route    GET /trxn
// @desc     Get all kid's transactions
// @access   Private
router.get('/', (req, res) => {
  res.send(`Get all trxns.`);
});

// @route    POST /trxn
// @desc     Add new trxn
// @access   Private
router.post('/', (req, res) => {
  res.send(`Add trxn.`);
});

// @route    PUT /trxn/:id
// @desc     Update trxn
// @access   Private
router.put('/:id', (req, res) => {
  res.send(`Update trxn.`);
});

// @route    DELETE /trxn/:id
// @desc     Delete trxn
// @access   Private
router.delete('/:id', (req, res) => {
  res.send(`Delete trxn.`);
});

module.exports = router;
