import { Router } from 'express';
import Candidate from '../models/Candidate';
import Job from '../models/Job';
import Ranking from '../models/Ranking';

const router = Router();

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const candidateCount = await Candidate.countDocuments();
    const jobCount = await Job.countDocuments();
    const rankingCount = await Ranking.countDocuments();

    // Aggregate skill distribution (top 5)
    const skillDistribution = await Candidate.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    const avgMatchRateAggr = await Ranking.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$final_score' } } }
    ]);
    const matchRateStr = avgMatchRateAggr.length > 0 ? `${(avgMatchRateAggr[0].avgScore * 100).toFixed(0)}%` : '0%';

    const recentRankings = await Ranking.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('job_id', 'title')
      .lean();

    const candidateIds = recentRankings.map(r => r.candidate_id_str);
    const candidates = await Candidate.find({ candidate_id: { $in: candidateIds } }).select('candidate_id profile.anonymized_name');
    
    const candidateMap = candidates.reduce((acc: any, c: any) => {
      acc[c.candidate_id] = c.profile?.anonymized_name;
      return acc;
    }, {});

    const populatedRecentRankings = recentRankings.map(r => ({
      ...r,
      candidate_name: candidateMap[r.candidate_id_str || ''] || r.candidate_id_str
    }));

    res.json({
      stats: {
        candidates: candidateCount,
        jobs: jobCount,
        rankings: rankingCount,
        matchRate: matchRateStr
      },
      skillDistribution,
      recentRankings: populatedRecentRankings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get candidate specific analytics
router.get('/candidate-analytics/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    // Find rankings for this candidate
    const rankings = await Ranking.find({ candidate_id_str: candidateId }).populate('job_id', 'title');
    
    if (!rankings.length) {
      return res.json({
        stats: {
          profileViews: Math.floor(Math.random() * 50) + 10,
          skillMatches: '0',
          behavioralScore: '0%'
        },
        recommendedJobs: []
      });
    }

    const avgBehavioral = rankings.reduce((acc, curr) => acc + (curr.scores?.behavioral_score || 0), 0) / rankings.length;
    const avgSkill = rankings.reduce((acc, curr) => acc + (curr.scores?.skill_match || 0), 0) / rankings.length;

    // Sort by final_score descending
    const topJobs = [...rankings].sort((a, b) => b.final_score - a.final_score).slice(0, 3);

    res.json({
      stats: {
        profileViews: Math.floor(Math.random() * 100) + 20,
        skillMatches: (avgSkill * 100).toFixed(0),
        behavioralScore: `${(avgBehavioral * 100).toFixed(0)}%`
      },
      recommendedJobs: topJobs.map(r => ({
        id: r._id,
        title: (r.job_id as any)?.title || 'Unknown Job',
        matchPercent: (r.final_score * 100).toFixed(0) + '%'
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List candidates (paginated)
router.get('/candidates', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const candidates = await Candidate.find()
      .select('profile candidate_id skills redrob_signals')
      .skip(skip)
      .limit(limit);
      
    const total = await Candidate.countDocuments();

    res.json({
      candidates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Seed database from local file
router.post('/seed', async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../../../data/candidates.jsonl');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'candidates.jsonl not found in /data folder' });
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let count = 0;
    const batchSize = 500;
    let batch: any[] = [];

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const data = JSON.parse(line);
          batch.push({
            updateMany: {
              filter: { candidate_id: data.candidate_id },
              update: { $set: data },
              upsert: true
            }
          });

          if (batch.length >= batchSize) {
            await Candidate.bulkWrite(batch);
            count += batch.length;
            batch = [];
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (batch.length > 0) {
      await Candidate.bulkWrite(batch);
      count += batch.length;
    }

    res.json({ message: `Successfully seeded ${count} candidates` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single candidate
router.get('/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ candidate_id: req.params.id });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
