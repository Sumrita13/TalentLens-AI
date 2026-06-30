import { Router } from 'express';
import axios from 'axios';

const router = Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

router.post('/extract-jd', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const response = await axios.post(`${ML_SERVICE_URL}/extract_jd`, { text });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error extracting JD:', error.message);
    res.status(500).json({ error: 'Failed to extract job description from AI service' });
  }
});

router.post('/generate-questions', async (req, res) => {
  try {
    const { candidate, jd } = req.body;
    if (!candidate || !jd) return res.status(400).json({ error: 'candidate and jd are required' });

    const response = await axios.post(`${ML_SERVICE_URL}/generate_interview_questions`, { candidate, jd });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error generating questions:', error.message);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

router.post('/compare', async (req, res) => {
  try {
    const { candidateA, candidateB, jd } = req.body;
    const response = await axios.post(`${ML_SERVICE_URL}/compare_candidates`, { candidateA, candidateB, jd });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error comparing candidates:', error.message);
    res.status(500).json({ error: 'Failed to compare candidates' });
  }
});

export default router;
