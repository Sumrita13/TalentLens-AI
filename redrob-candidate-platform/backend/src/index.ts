import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rankingRoutes from './routes/rankingRoutes';
import dataRoutes from './routes/dataRoutes';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/ranking', rankingRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Backend is running' });
});

// Start Server
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/redrob_candidate_platform';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
