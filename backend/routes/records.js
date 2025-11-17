const router = require('express').Router();
let Record = require('../models/record.model');

// --- GET ALL RECORDS ---
// This remains the same.
router.route('/').get((req, res) => {
  Record.find()
    .then(records => res.json(records))
    .catch(err => res.status(400).json('Error: ' + err));
});

// --- ADD NEW RECORD ---
// This is the new part. It handles incoming HTTP POST requests on the '/add' url path.
router.route('/add').post((req, res) => {
  // We get the new record's data from the body of the request.
  const { name, plant, region, volume, purity, status } = req.body;

  // We create a new Record instance using our Mongoose model.
  const newRecord = new Record({
    name,
    plant,
    region,
    volume: Number(volume), // Ensure numeric types are stored as numbers
    purity: Number(purity),
    status,
  });

  // We save the new record to the database.
  newRecord.save()
    // .then() returns the newly created record from the database.
    .then(savedRecord => res.json(savedRecord)) // We send the saved record back as confirmation.
    .catch(err => res.status(400).json('Error: ' + err)); // Or we send an error.
});

module.exports = router;

