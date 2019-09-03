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
    const kids = await Kid.find({ parent: req.parent.id });
    res.json(kids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error in routes/kids.js');
  }
});

// @route    GET /kids/:kids_id
// @desc     Get one of a parent's kids
// @access   Private
router.get('/:kids_id', auth, async (req, res) => {
  try {
    // Find kid by kids_id in the params
    const kid = await Kid.findById(req.params.kids_id);
    // Return specific kid to the client
    res.json(kid);
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
      res.status(500).send('Server error from routes/kids.js in POST');
    }
  }
);

// @route    PUT /kids/:kids_id
// @desc     Update kid
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;

  // Build kid object based on the fields submitted
  const kidFields = {};

  if (name) kidFields.name = name;

  try {
    let kid = await Kid.findById(req.params.id);

    if (!kid) res.status(404).json({ msg: 'Child account not found' });

    // Make sure parent owns kid
    if (kid.parent.toString() !== req.parent.id) {
      // 401 status code means not authorized
      return res
        .status(401)
        .json({ msg: "You're not authorized to edit this child's account" });
    }

    kid = await Kid.findByIdAndUpdate(
      req.params.id,
      { $set: kidFields },
      { new: true }
    );

    res.json(kid);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error from routes/kids.js in PUT');
  }
});

// @route    DELETE /kids/:kids_id
// @desc     Delete kid
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let kid = await Kid.findById(req.params.id);

    if (!kid) res.status(404).json({ msg: 'Child account not found' });

    // Make sure parent owns kid
    if (kid.parent.toString() !== req.parent.id) {
      // 401 status code means not authorized
      return res
        .status(401)
        .json({ msg: "You're not authorized to delete this child's account" });
    }

    await Kid.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Child account removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error from routes/kids.js in DELETE');
  }
});

//////// KIDS' TRXNS

// @route    GET /kids/trxns/:kids_id
// @desc     Get all kid's trxns
// @access   Private
router.get('/trxns/:id', auth, async (req, res) => {
  try {
    // Gets the kid's document from Mongo
    const kid = await Kid.findById(req.params.id);

    // Make sure parent owns kid
    if (kid.parent.toString() !== req.parent.id) {
      // 401 status code means not authorized
      return res.status(401).json({
        msg:
          "You're not authorized to view the transactions of this child's account"
      });
    }
    // Returns all the kid's trxns to the client
    res.json(kid.trxns);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send('Server error in GET request from routes/kids.js to /trxns/:id');
  }
});

// @route    POST /kids/trxns/:kids_id
// @desc     Add new trxn
// @access   Private
router.post(
  '/trxns/:id',
  [
    auth,
    [
      check('amount', 'Please add an amount')
        .not()
        .isEmpty(),
      check('desc', 'Please add a description')
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

    const { amount, desc, date } = req.body;

    try {
      const kid = await Kid.findById(req.params.id);
      // Make sure parent owns kid
      if (kid.parent.toString() !== req.parent.id) {
        // 401 status code means not authorized
        return res.status(401).json({
          msg:
            "You're not authorized to add a transaction to this child's account"
        });
      }

      const newTrxn = {
        amount,
        desc,
        date
      };

      // Add new trxn to the kid's trxn array
      kid.trxns.unshift(newTrxn);

      // Save trxn in database
      await kid.save();

      // Return the trxn to the client
      res.json(kid.trxns);
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .send('Server error in POST request from routes/kids.js to trxns/:id');
    }
  }
);

// @route    PUT /kids/trxns/:trxn_id
// @desc     Update trxn
// @access   Private
router.put('/trxns/:kid_id/:trxn_id', auth, async (req, res) => {
  const { amount, desc, date } = req.body;

  // Build trxn object based on the fields submitted
  const trxnFields = {};
  // If field exists in req.body add it to trxnFields
  if (amount) trxnFields.amount = amount;
  if (desc) trxnFields.desc = desc;
  if (date) trxnFields.date = date;

  try {
    // Get kid document from Mongo
    let kid = await Kid.findById(req.params.kid_id);
    // Find the trxn that matches the trxn_id in the query params
    let trxn = kid.trxns
      // Makes an array of just the _id's (trxn_id's) from the objects in the trxns array
      .map(a => a._id)
      // From the mapped array, filter to find the trxn_id that matches the trxn_id in the query params
      .filter(function(b) {
        if (b == req.params.trxn_id) {
          return true;
        }
      });

    // Find the index of the trxn in the trxns array. Use this to return trxn to the client.
    let trxnIndex = kid.trxns
      .map(a => a._id)
      .findIndex(e => e._id == req.params.trxn_id);

    // If trxn_id is not found, return status
    if (!trxn) res.status(404).json({ msg: "We can't find that transaction." });

    // Make sure parent owns kid
    if (kid.parent.toString() !== req.parent.id) {
      // 401 status code means not authorized
      return res
        .status(401)
        .json({ msg: "You are not authorized to edit this child's account" });
    }

    // Find the relevant trxn in the Kids document and update it with the trxnFields
    kid = await Kid.findOneAndUpdate(
      { 'trxns._id': req.params.trxn_id },
      { $set: { 'trxns.$': trxnFields } },
      { new: true }
    );

    // Return updated trxn object to client
    res.json(kid.trxns[trxnIndex]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send('Server error from routes/kids.js in trxn PUT request');
  }
});

// @route    DELETE /kids/:kids_id/:trxn_id
// @desc     Delete kid's trxn
// @access   Private
router.delete('/trxns/:kids_id/:trxn_id', auth, async (req, res) => {
  try {
    // Get kid document from Mongo
    let kid = await Kid.findById(req.params.kids_id);

    // Get kid's id
    let kidID = kid._id;

    // Set trxn_id in the query params inside a variable
    let trxn = req.params.trxn_id;

    // Make sure parent owns kid
    if (kid.parent.toString() !== req.parent.id) {
      // 401 status code means not authorized
      return res
        .status(401)
        .json({ msg: "You're not authorized to delete this child's account" });
    }

    // Remove trxn
    await Kid.updateOne({ _id: kidID }, { $pull: { trxns: { _id: trxn } } });

    res.json({ msg: `Transaction deleted.` });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send('Server error from routes/kids.js in trxn DELETE request');
  }
});

module.exports = router;
