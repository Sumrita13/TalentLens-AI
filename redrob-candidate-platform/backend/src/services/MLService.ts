import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export class MLService {
  static async rankCandidates(jobDescription: string, candidates: any[]) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/rank`, {
        job_description: jobDescription,
        candidates_data: candidates
      });
      return response.data;
    } catch (error) {
      console.error('ML Service Error:', error);
      throw new Error('Failed to communicate with Ranking Engine');
    }
  }

  static async rankLocalDataset(jdText?: string) {
    try {
      // This tells the ML service to read from its local /data folder or use the provided JD
      const response = await axios.post(`${ML_SERVICE_URL}/rank/local`, {
        jd_text: jdText
      });
      return response.data;
    } catch (error) {
      console.error('ML Service Local Rank Error:', error);
      throw new Error('Failed to execute bulk local ranking');
    }
  }
}
