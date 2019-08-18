const express = require('express');
const router = express.Router();
// Whenever we need to protect routes, we need to bring in middleware
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Parent = require('../models/Parent');
const Kid = require('../models/Kid');

// @route    GET /kids
// @desc     Get all parent's kids
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    // Kid has a parent field. We want the kids for this specific parent through req.parent.id.
    // TO DO: Sort kids in ascending order.
    const kids = await Kid.find({ parent: req.parent.id });
    res.json(kids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error in routes/kids.js');
  }
});

// @route    POST /kids
// @desc     Add new kids
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Please add a name for your child')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 status (bad request)
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    parent = req.parent.id;
    console.log(parent);

    try {
      const newKid = new Kid({
        name,
        parent: req.parent.id
      });

      // Save kid in the database
      const kid = await newKid.save();

      // Return the kid to the client
      res.json(kid);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error from routes/kids.js');
    }
  }
);

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
