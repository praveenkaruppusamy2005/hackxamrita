const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB)
    .then(async () => {
        console.log('Connected to DB...');
        try {
            await mongoose.connection.collection('users').dropIndex('mobileNumber_1');
            console.log('Successfully dropped the duplicate mobileNumber_1 index!');
        } catch (err) {
            console.error('Error dropping index (it may not exist, or named differently):', err.message);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
