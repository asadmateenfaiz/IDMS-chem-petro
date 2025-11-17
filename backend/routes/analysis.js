const router = require('express').Router();
let Record = require('../models/record.model');

router.route('/').get(async (req, res) => {
  try {
    const { compareBy = 'region', search = '' } = req.query;
    const groupByField = `$${compareBy}`;

    const aggregationPipeline = [];

    // --- NEW: Add a search stage if a search term is provided ---
    // This filters documents BEFORE they are grouped and aggregated.
    if (search) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { plant: { $regex: search, $options: 'i' } },
            { region: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Add the rest of the pipeline stages
    aggregationPipeline.push(
      {
        $group: {
          _id: groupByField,
          totalVolume: { $sum: '$volume' },
          averagePurity: { $avg: '$purity' },
          recordCount: { $sum: 1 },
          alertCount: { $sum: { $cond: [{ $eq: ['$status', 'Alert'] }, 1, 0] } }
        }
      },
      { $sort: { totalVolume: -1 } },
      {
        $project: {
          _id: 0, name: '$_id', totalVolume: 1,
          averagePurity: { $round: ['$averagePurity', 2] },
          recordCount: 1, alertCount: 1
        }
      }
    );

    const results = await Record.aggregate(aggregationPipeline);
    res.json(results);

  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;

