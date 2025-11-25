const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Record = require('./models/record.model');

// Load environment variables
dotenv.config();

// --- Data for programmatic generation ---
const chemicalNames = [
  'Ethylene', 'Propylene', 'Benzene', 'Toluene', 'Xylene', 'Methanol',
  'Ammonia', 'Styrene', 'Cumene', 'Butadiene', 'Vinyl Chloride',
  'Ethylene Glycol', 'Propylene Oxide', 'Acetic Acid', 'Formaldehyde',
  'Phenol', 'Acetone', 'Naphtha', 'Diesel', 'Gasoline'
];

const plants = [
  'Titan North', 'Phoenix East', 'Helios Prime', 'Alpha-1', 'Beta-7',
  'Gamma-3', 'Orion Main', 'Vulcan West', 'Neptune South', 'Jupiter Core',
  'Saturn Ring', 'Ares-IV'
];

const regions = [
  'USA (Houston)', 'Germany (Ludwigshafen)', 'China (Shanghai)',
  'Saudi Arabia (Jubail)', 'Singapore', 'South Korea (Ulsan)',
  'Netherlands (Rotterdam)', 'India (Jamnagar)'
];

const statuses = ['Stable', 'Warning', 'Alert'];

// --- Function to generate the seed data ---
const generateSeedData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    // Weighted status: 80% Stable, 15% Warning, 5% Alert
    let status;
    const randomStatus = Math.random();
    if (randomStatus < 0.8) {
      status = 'Stable';
    } else if (randomStatus < 0.95) {
      status = 'Warning';
    } else {
      status = 'Alert';
    }

    const record = {
      name: chemicalNames[Math.floor(Math.random() * chemicalNames.length)],
      plant: plants[Math.floor(Math.random() * plants.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      volume: Math.floor(Math.random() * 19000) + 1000, // Volume between 1,000 and 20,000
      purity: parseFloat((Math.random() * 1.99 + 98).toFixed(2)), // Purity between 98.00 and 99.99
      status: status,
    };
    data.push(record);
  }
  return data;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful.');

    // Clear existing data
    await Record.deleteMany({});
    console.log('Existing records deleted.');

    // Generate 150 new records
    const seedData = generateSeedData(150);
    
    // Insert the new seed data
    await Record.insertMany(seedData);
    console.log(`✅ Database seeded successfully with ${seedData.length} records!`);

  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the seeder function
seedDB();
