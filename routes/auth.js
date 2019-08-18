const express = require('express');
const router = express.Router();

// @route    GET /auth
// @desc     Get logged in parent.
// @access   Private
router.get('/', (req, res) => {
  res.send(`Get logged in parent.`);
});

// @route    POST /auth
// @desc     Auth parent and get token
// @access   Public
router.post('/', (req, res) => {
  res.send(`Log in parent.`);
});

module.exports = router;
