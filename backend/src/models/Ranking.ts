import mongoose, { Schema, Document } from 'mongoose';

export interface IRanking extends Document {
  job_id: mongoose.Types.ObjectId;
  candidate_id?: mongoose.Types.ObjectId;
  candidate_id_str?: string;
  scores: {
    skill_match: number;
    behavioral_score: number;
    semantic_similarity: number;
    penalties: number;
    experience_match?: number;
    project_relevance?: number;
    education_score?: number;
    certification_score?: number;
    risk_penalty?: number;
  };
  final_score: number;
  justification: {
    why_matched?: string;
    key_strengths?: string[];
    potential_risks?: string[];
    ranking_justification?: string;
    overall_match_score?: string;
    strengths?: string[];
    weaknesses?: string[];
    missing_skills?: string[];
    hiring_recommendation?: string;
  };
}

const RankingSchema: Schema = new Schema({
  job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate_id: { type: Schema.Types.ObjectId, ref: 'Candidate' },
  candidate_id_str: { type: String },
  scores: {
    skill_match: Number,
    behavioral_score: Number,
    semantic_similarity: Number,
    penalties: Number,
    experience_match: Number,
    project_relevance: Number,
    education_score: Number,
    certification_score: Number,
    risk_penalty: Number
  },
  final_score: Number,
  justification: {
    why_matched: String,
    key_strengths: [String],
    potential_risks: [String],
    ranking_justification: String,
    overall_match_score: String,
    strengths: [String],
    weaknesses: [String],
    missing_skills: [String],
    hiring_recommendation: String
  }
}, { timestamps: true });

export default mongoose.model<IRanking>('Ranking', RankingSchema);
