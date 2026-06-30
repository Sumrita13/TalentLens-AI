const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/redrob_candidate_platform';

async function deleteBadJobs() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Using the raw collection to avoid needing to import the TypeScript model
    const result = await mongoose.connection.collection('jobs').deleteMany({ title: 'New Job Description' });
    
    console.log(`Successfully deleted ${result.deletedCount} jobs with the title "New Job Description"`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

deleteBadJobs();
