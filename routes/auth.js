const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Parent = require('../models/Parent');

// @route    GET /auth
// @desc     Get logged in parent.
// @access   Private (see 'auth')
router.get('/', auth, async (req, res) => {
  try {
    // If we send correct token, the req object will have a parent object attached to it with the current parents id
    const parent = await Parent.findById(req.parent.id).select('-password');
    res.json({ parent: parent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error in routes/auth.js');
  }
});

// @route    POST /auth
// @desc     Auth new parent user and get token
// @access   Public
router.post(
  '/',
  [
    //Validates the corrent information is provided for a parent sign up (connects to Parents.js)
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please include a password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 status (bad request)
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let parent = await Parent.findOne({ email: email });
      // If there isn't a parent with that email...
      if (!parent) {
        res.status(400).json({ msg: "Email doesn't exist" });
      }

      // If there is a parent, check the password
      const isMatch = await bcrypt.compare(password, parent.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Password is incorrect' });
      }

      // Token exchange
      const payload = {
        parent: {
          id: parent.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token: token });
        }
      );
    } catch (err) {
      console.error(err.message);
      // 500 is a server error
      res.status(500).send(`Sever error in auth.js`);
    }
  }
);

module.exports = router;
