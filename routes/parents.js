const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Parent = require('../models/Parent');

// @route    POST /parents
// @desc     Register a parent (user)
// @access   Public
router.post(
  '/',
  //Validates the corrent information is provided for a parent sign up (connects to Parents.js)
  [
    check('name', 'Please add your name')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 status (bad request)
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let parent = await Parent.findOne({ email: email });
      if (parent) {
        res.status(400).json({ msg: 'Email already exists' });
      }

      parent = new Parent({
        name,
        email,
        password
      });

      // Encypt the password
      const salt = await bcrypt.genSalt(10);

      parent.password = await bcrypt.hash(password, salt);

      await parent.save();

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
      res.status(500).send(`Sever error in parents.js`);
    }
  }
);

module.exports = router;
