import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import Candidate from './src/models/Candidate';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/redrob_candidate_platform';

async function migrateUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create 1 shared hash to save time
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const candidates = await Candidate.find().limit(10000).select('candidate_id profile');
    console.log(`Found ${candidates.length} candidates. Creating user accounts...`);

    const users = candidates.map((c: any, index) => ({
      email: c.profile?.email || `candidate${index + 1}@redrob.com`,
      passwordHash,
      role: 'candidate',
      candidateId: c.candidate_id,
      name: c.profile?.headline ? c.profile.headline.split(' ')[0] : `Candidate ${index + 1}`
    }));

    // Avoid duplicate emails if any exist
    const uniqueUsersMap = new Map();
    for (const u of users) {
      if (!uniqueUsersMap.has(u.email)) {
        uniqueUsersMap.set(u.email, u);
      }
    }
    const uniqueUsers = Array.from(uniqueUsersMap.values());

    console.log(`Inserting ${uniqueUsers.length} users into the database...`);
    
    // Clear old users (for hackathon idempotency)
    await User.deleteMany({});
    
    // Insert recruiter admin
    const adminHash = await bcrypt.hash('admin123', 10);
    uniqueUsers.push({
      email: 'recruiter@redrob.com',
      passwordHash: adminHash,
      role: 'recruiter',
      name: 'System Recruiter',
      candidateId: null
    });

    // Batch insert
    const batchSize = 1000;
    for (let i = 0; i < uniqueUsers.length; i += batchSize) {
      await User.insertMany(uniqueUsers.slice(i, i + batchSize));
      console.log(`Inserted batch ${i} to ${i + batchSize}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
