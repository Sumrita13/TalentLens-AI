import { Router } from 'express';
import Candidate from '../models/Candidate';
import { MLService } from '../services/MLService';
import Ranking from '../models/Ranking';

const router = Router();

import Job from '../models/Job';

router.post('/execute', async (req, res) => {
  try {
    const { jobId, limit = 100 } = req.body;
    
    let jdText = "";
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jdText = `${job.title}\n\n${job.description}\n\nRequirements:\n${job.requirements.skills.join(', ')}`;
      }
    }

    // Trigger Ranking Engine
    const rankedResults = await MLService.rankLocalDataset(jdText);

    // Save rankings to database (clear old results first)
    if (jobId && rankedResults.length > 0) {
      await Ranking.deleteMany({ job_id: jobId });

      const rankingDocs = rankedResults.slice(0, limit).map((r: any) => ({
        job_id: jobId,
        candidate_id_str: r.candidate_id,  // store as plain string
        scores: r.scores,
        final_score: r.final_score,
        justification: r.justification
      }));

      await Ranking.insertMany(rankingDocs);
    }

    res.json(rankedResults.slice(0, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/results/:jobId', async (req, res) => {
  try {
    const rankings = await Ranking.find({ job_id: req.params.jobId })
      .sort({ final_score: -1 })
      .lean();
      
    // Fetch the actual candidate names
    const candidateIds = rankings.map(r => r.candidate_id_str);
    const candidates = await Candidate.find({ candidate_id: { $in: candidateIds } }).select('candidate_id profile.anonymized_name');
    
    const candidateMap = candidates.reduce((acc: any, c: any) => {
      acc[c.candidate_id] = c.profile?.anonymized_name;
      return acc;
    }, {});
    
    const populatedRankings = rankings.map(r => ({
      ...r,
      candidate_name: candidateMap[r.candidate_id_str || ''] || r.candidate_id_str
    }));

    res.json(populatedRankings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

import * as xlsx from 'xlsx';

router.get('/export/:jobId', async (req, res) => {
  try {
    const rankings = await Ranking.find({ job_id: req.params.jobId })
      .sort({ final_score: -1 })
      .lean();
      
    // Fetch the actual candidate names
    const candidateIds = rankings.map(r => r.candidate_id_str);
    const candidates = await Candidate.find({ candidate_id: { $in: candidateIds } }).select('candidate_id profile.anonymized_name');
    
    const candidateMap = candidates.reduce((acc: any, c: any) => {
      acc[c.candidate_id] = c.profile?.anonymized_name;
      return acc;
    }, {});
    
    const data = rankings.map((r, index) => {
      const name = candidateMap[r.candidate_id_str || ''] || r.candidate_id_str || 'Unknown';
      const scores = r.scores as any || {};
      const justification = r.justification as any || {};
      
      const penalties = scores.penalties || 0;
      let risk = "Low";
      if (penalties > 0.3) risk = "High";
      else if (penalties > 0.1) risk = "Medium";

      return {
        "Rank": index + 1,
        "Candidate ID": r.candidate_id_str,
        "Candidate Name": name,
        "Final Score (%)": Number((r.final_score || 0) * 100).toFixed(1),
        "Skill Match (%)": Number((scores.skill_match || 0) * 100).toFixed(1),
        "Behavioral Score (%)": Number((scores.behavioral_score || 0) * 100).toFixed(1),
        "Risk Level": risk,
        "AI Recommendation": justification.hiring_recommendation || 'N/A',
        "AI Justification": justification.ranking_justification || 'Strong semantic match.'
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Ranked Candidates");
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="ranked_candidates.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
